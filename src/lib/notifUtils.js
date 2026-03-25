/**
 * Notification utility — sends notifications to the right people.
 * 
 * NOTIFICATION MATRIX:
 * 
 * | Event                              | Triggered by          | Notified          |
 * |------------------------------------|----------------------|-------------------|
 * | Broker/Coordinador adds Anotación  | Broker/Coordinador   | All Admin+Equipo  |
 * | Workflow action button pressed     | Anyone               | All Admin+Equipo  |
 * | Task assigned to user              | Admin/Equipo         | Assignee          |
 * | @mention in task comment           | Anyone               | Mentioned user    |
 * | Task past due date                 | System               | Assignee + Admin  |
 */

import { supabase } from "@/lib/supabaseClient";

/**
 * Fetch all Admin and Equipo user IDs (agency team members).
 */
export async function fetchAdminEquipoIds() {
    const { data } = await supabase
        .from("usuarios")
        .select("id")
        .in("rol", ["Admin", "Equipo"]);
    return (data || []).map(u => u.id);
}

/**
 * Send a notification to one or more users safely (never throws).
 * @param {string|string[]} usuarioIds
 * @param {{ tipo: string, mensaje: string, link?: string }} payload
 */
export async function sendNotif(usuarioIds, { tipo, mensaje, link = null }) {
    try {
        const ids = Array.isArray(usuarioIds) ? usuarioIds : [usuarioIds];
        if (!ids.length) return;
        const rows = ids.map(id => ({ usuario_id: id, tipo, mensaje, link }));
        await supabase.from("notificaciones").insert(rows);
    } catch (_) {
        // Silently fail — notifications are non-critical
    }
}

/**
 * Notify all Admin + Equipo members.
 */
export async function notifyAdmins({ tipo, mensaje, link = null }) {
    const ids = await fetchAdminEquipoIds();
    await sendNotif(ids, { tipo, mensaje, link });
}

/**
 * Notify a single user by ID.
 */
export async function notifyUser(userId, { tipo, mensaje, link = null }) {
    if (!userId) return;
    await sendNotif(userId, { tipo, mensaje, link });
}

/**
 * Parse @mentions from a comment text and notify each mentioned user.
 * Expects users array: [{ id, nombre, rol }]
 */
export async function notifyMentions(texto, allUsers, senderName, link = null) {
    if (!texto) return;
    const mentioned = allUsers.filter(u => texto.includes(`@${u.nombre}`));
    for (const u of mentioned) {
        await notifyUser(u.id, {
            tipo: "mencion",
            mensaje: `${senderName} te mencionó en un comentario: "${texto.slice(0, 80)}${texto.length > 80 ? "..." : ""}"`,
            link
        });
    }
}

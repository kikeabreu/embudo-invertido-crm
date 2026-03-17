"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { createBrokerAction, deleteBrokerAction } from "@/app/actions/adminActions";
import { G, css } from "@/lib/constants";
import { GText } from "@/components/ui/UIUtils";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useToast, Toasts } from "@/components/ui/Toast";

function AdminCreateModal({ onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const { toasts, show: toast } = useToast();

    const [form, setForm] = useState({
        nombre: "",
        email: "",
        password: "",
        precio_pactado: "",
        fecha_corte: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        Object.entries(form).forEach(([key, val]) => formData.append(key, val));

        const result = await createBrokerAction(formData);

        if (result?.error) {
            toast(result.error, "error");
            setLoading(false);
        } else {
            toast("Agencia / Broker creado", "success");
            onSuccess();
        }
    };

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
            <Toasts toasts={toasts} />
            <div style={{ ...css.card, padding: 30, width: 400 }}>
                <div style={{ fontSize: 18, color: G.white, fontFamily: "Georgia,serif", marginBottom: 20 }}>Agregar Nuevo Cliente (Broker)</div>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                    <div>
                        <label style={css.label}>Nombre completo o Agencia</label>
                        <input required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} style={css.input} placeholder="Juan Pérez" />
                    </div>
                    <div>
                        <label style={css.label}>Correo (Para Iniciar Sesión)</label>
                        <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={css.input} placeholder="juan@agencia.com" />
                    </div>
                    <div>
                        <label style={css.label}>Contraseña Temporal</label>
                        <input required type="text" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={css.input} placeholder="Minimo 6 caracteres" />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div>
                            <label style={css.label}>Precio Pactado ($)</label>
                            <input type="number" step="0.01" value={form.precio_pactado} onChange={e => setForm({ ...form, precio_pactado: e.target.value })} style={css.input} placeholder="500.00" />
                        </div>
                        <div>
                            <label style={css.label}>Fecha de Corte</label>
                            <input type="date" value={form.fecha_corte} onChange={e => setForm({ ...form, fecha_corte: e.target.value })} style={{ ...css.input, colorScheme: "dark" }} />
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                        <button type="button" onClick={onClose} disabled={loading} style={{ background: "transparent", color: G.muted, border: "none", cursor: "pointer", fontSize: 13 }}>Cancelar</button>
                        <button type="submit" disabled={loading} style={css.btn(G.gPurple)}>{loading ? "Creando..." : "Crear Cuenta"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function BrokerList({ brokers, onSelect, onShowCreate, onDelete, isAdmin }) {
    return (
        <div style={{ background: G.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
            <div style={{ width: "100%", maxWidth: 580 }}>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <div style={{ width: 64, height: 64, background: G.gMagenta, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28, boxShadow: "0 0 40px rgba(236,72,153,0.3)" }}>▼</div>
                    <GText g={G.gMagenta} size={10} weight={600} style={{ letterSpacing: 4, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Agencia Top Seller</GText>
                    <div style={{ fontSize: 26, color: G.white, fontFamily: "Georgia,serif", marginBottom: 6 }}>Embudo Invertido™</div>
                    <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", letterSpacing: 1 }}>{isAdmin ? "Panel de Gestión de Clientes" : "Selecciona tu cuenta de Broker"}</div>
                </div>

                {brokers.length === 0 && <div style={{ ...css.card, padding: "20px", textAlign: "center", color: G.dimmed, fontFamily: "sans-serif", fontSize: 12, marginBottom: 16, borderStyle: "dashed" }}>Aún no hay brokers registrados.</div>}

                {brokers.map(b => (
                    <div key={b.id} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                        <button onClick={() => onSelect(b.id)} style={{ flex: 1, ...css.card, border: `1px solid ${G.border}`, padding: "14px 20px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <div style={{ fontSize: 14, color: G.white, fontFamily: "Georgia,serif" }}>{b.nombre || b.email}</div>
                                <div style={{ fontSize: 10, color: G.muted, fontFamily: "sans-serif", marginTop: 2 }}>{b.rol || "Broker"} • Pago: {b.estado_pago || 'Pendiente'}</div>
                            </div>
                            <GText g={G.gViolet} size={11}>Abrir Embudo →</GText>
                        </button>
                        {isAdmin && b.rol !== 'Admin' && (
                            <button onClick={() => onDelete(b.id, b.nombre || b.email)} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "14px 12px", cursor: "pointer", color: G.red, fontSize: 12 }} title="Eliminar Cliente">✕</button>
                        )}
                    </div>
                ))}

                {isAdmin && (
                    <button onClick={onShowCreate} style={{ ...css.btn(G.gCyan), width: "100%", marginTop: 20, padding: 14, borderRadius: 12, fontSize: 14 }}>
                        + Agregar Nuevo Cliente (Broker)
                    </button>
                )}
            </div>
        </div>
    );
}

export default function DashboardHome() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [brokers, setBrokers] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const { confirm, ConfirmUI } = useConfirm();
    const { toasts, show: toast } = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push("/");
            return;
        }

        const { data: profile } = await supabase.from('usuarios').select('*').eq('id', session.user.id).single();
        setUser({ ...session.user, ...profile });

        let query = supabase.from('usuarios').select('*').order('created_at', { ascending: false });
        if (profile?.rol !== 'Admin') {
            query = query.eq('id', session.user.id);
        }

        const { data: brokerList } = await query;
        setBrokers(brokerList || []);
        setLoading(false);
    };

    const handleDeleteBroker = async (id, name) => {
        const ok = await confirm(`¿Eliminar definitivamente a "${name}"?`, `Se borrará toda su cuenta, accesos, historial y piezas generadas.`, "Sí, eliminar");
        if (!ok) return;

        const result = await deleteBrokerAction(id);
        if (result?.error) {
            toast(result.error, "error");
        } else {
            toast("Cliente eliminado", "success");
            loadData();
        }
    };

    if (loading) return <div style={{ padding: 40, textAlign: "center", color: G.dimmed, fontFamily: "sans-serif", fontSize: 11, letterSpacing: 2 }}>CARGANDO...</div>;

    return (
        <div style={{ height: "100%", overflowY: "auto", position: "relative" }}>
            <Toasts toasts={toasts} />
            {ConfirmUI}

            <BrokerList
                brokers={brokers}
                onSelect={(id) => router.push(`/dashboard/broker/${id}`)}
                onShowCreate={() => setShowModal(true)}
                onDelete={handleDeleteBroker}
                isAdmin={user?.rol === 'Admin'}
            />

            {showModal && (
                <AdminCreateModal
                    onClose={() => setShowModal(false)}
                    onSuccess={() => { setShowModal(false); loadData(); }}
                />
            )}
        </div>
    );
}

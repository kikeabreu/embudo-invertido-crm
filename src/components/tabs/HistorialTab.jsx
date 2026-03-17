"use client";

import { useState } from "react";
import { G, css, USERS, fmtDate } from "@/lib/constants";
import { GText } from "@/components/ui/UIUtils";

export default function HistorialTab({ logs }) {
    const [ft, setFt] = useState("Todos");

    // Extraemos los tipos únicos que hay en los logs actuales
    const types = [...new Set(logs.map(l => l.tipo).filter(Boolean))];

    // Filtramos y ordenamos por created_at (asegurando que exista)
    const filtered = logs
        .filter(l => ft === "Todos" || l.tipo === ft)
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

    const Sel = ({ val, set, opts }) => (
        <select value={val} onChange={e => set(e.target.value)} style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${G.border}`, borderRadius: 8, color: G.purpleHi, fontSize: 11, padding: "6px 12px", fontFamily: "sans-serif" }}>
            {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    );

    const typeG = t => ({ banco: G.gViolet, instalacion: G.gMagenta, onboarding: G.gGreen, secuencias: G.gCyan, crear: G.gGreen, eliminar: G.gOrange }[t] || G.gPurple);

    return (
        <div style={{ padding: "24px 28px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                    <GText g={G.gViolet} size={10} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Auditoría</GText>
                    <div style={{ fontSize: 20, color: G.white, fontFamily: "Georgia,serif" }}>Historial de cambios</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <Sel val={ft} set={setFt} opts={["Todos", ...types]} />
                    <span style={{ fontSize: 10, color: G.dimmed, fontFamily: "sans-serif", alignSelf: "center" }}>{filtered.length} registros</span>
                </div>
            </div>

            {filtered.length === 0
                ? <div style={{ textAlign: "center", padding: "60px", color: G.dimmed, fontFamily: "sans-serif", fontSize: 13 }}>{logs.length === 0 ? "Aún no hay cambios registrados." : "Sin resultados."}</div>
                : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {filtered.map(l => (
                        <div key={l.id} style={{ ...css.card, padding: "14px 18px", display: "flex", gap: 12 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 20, background: G.gPurple, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <span style={{ fontSize: 12, color: G.white, fontWeight: 700 }}>{l.actor_nombre ? l.actor_nombre[0].toUpperCase() : (l.tipo ? l.tipo[0].toUpperCase() : '*')}</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
                                    <span style={{ fontSize: 12, color: G.white, fontFamily: "sans-serif", fontWeight: 700 }}>{l.actor_nombre || 'Sistema'}</span>
                                    <GText g={typeG(l.tipo)} size={8} style={{ border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 3, padding: "1px 6px", textTransform: "uppercase", letterSpacing: 1 }}>{l.tipo}</GText>
                                    <span style={{ fontSize: 9, color: G.muted, fontFamily: "monospace", marginLeft: "auto" }}>{l.created_at ? fmtDate(l.created_at) : 'Sin fecha'}</span>
                                </div>
                                <div style={{ fontSize: 12, color: G.muted, fontFamily: "sans-serif", lineHeight: 1.5 }}>{l.descripcion}</div>
                            </div>
                        </div>
                    ))}
                </div>}
        </div>
    );
}

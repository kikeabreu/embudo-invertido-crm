"use client";

import { useState } from "react";
import { G, css, USERS, fmtDate } from "@/lib/constants";
import { GText } from "@/components/ui/UIUtils";

export default function HistorialTab({ logs }) {
    const [fu, setFu] = useState("Todos");
    const [ft, setFt] = useState("Todos");

    const types = [...new Set(logs.map(l => l.type))];
    const filtered = logs.filter(l => (fu === "Todos" || l.user === fu) && (ft === "Todos" || l.type === ft)).sort((a, b) => b.ts.localeCompare(a.ts));

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
                    <Sel val={fu} set={setFu} opts={["Todos", ...USERS.map(u => u.name)]} />
                    <Sel val={ft} set={setFt} opts={["Todos", ...types]} />
                    <span style={{ fontSize: 10, color: G.dimmed, fontFamily: "sans-serif", alignSelf: "center" }}>{filtered.length} registros</span>
                </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                {USERS.map(u => {
                    const ul = logs.filter(l => l.user === u.name);
                    return (
                        <div key={u.id} style={{ ...css.card, padding: "14px 18px", minWidth: 130 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                <div style={{ width: 28, height: 28, borderRadius: 20, background: G.gPurple, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <span style={{ fontSize: 11, color: G.white, fontWeight: 700 }}>{u.name[0]}</span>
                                </div>
                                <span style={{ fontSize: 12, color: G.white, fontFamily: "sans-serif", fontWeight: 600 }}>{u.name}</span>
                            </div>
                            <GText g={G.gViolet} size={20} weight={800}>{ul.length}</GText>
                            <div style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>cambios</div>
                        </div>
                    );
                })}
            </div>

            {filtered.length === 0
                ? <div style={{ textAlign: "center", padding: "60px", color: G.dimmed, fontFamily: "sans-serif", fontSize: 13 }}>{logs.length === 0 ? "Aún no hay cambios registrados." : "Sin resultados."}</div>
                : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {filtered.map(l => (
                        <div key={l.id} style={{ ...css.card, padding: "14px 18px", display: "flex", gap: 12 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 20, background: G.gPurple, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <span style={{ fontSize: 12, color: G.white, fontWeight: 700 }}>{l.user[0]}</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
                                    <span style={{ fontSize: 12, color: G.white, fontFamily: "sans-serif", fontWeight: 700 }}>{l.user}</span>
                                    <span style={{ fontSize: 8, color: G.dimmed, fontFamily: "sans-serif", border: `1px solid ${G.border}`, borderRadius: 3, padding: "1px 6px" }}>{l.role}</span>
                                    <GText g={typeG(l.type)} size={8} style={{ border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 3, padding: "1px 6px", textTransform: "uppercase", letterSpacing: 1 }}>{l.type}</GText>
                                    {l.mes && <span style={{ fontSize: 9, color: G.purple, fontFamily: "sans-serif" }}>· {l.mes}</span>}
                                    <span style={{ fontSize: 9, color: G.muted, fontFamily: "monospace", marginLeft: "auto" }}>{fmtDate(l.ts)}</span>
                                </div>
                                <div style={{ fontSize: 12, color: G.muted, fontFamily: "sans-serif", lineHeight: 1.5 }}>{l.desc}</div>
                                {l.pieceTitulo && <div style={{ fontSize: 10, color: G.dimmed, fontFamily: "sans-serif", marginTop: 3 }}>📄 {l.pieceTitulo}</div>}
                            </div>
                        </div>
                    ))}
                </div>}
        </div>
    );
}

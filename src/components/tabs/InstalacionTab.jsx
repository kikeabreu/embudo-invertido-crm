"use client";

import { G, css, pct } from "@/lib/constants";
import { INSTALACION_SECTIONS } from "@/lib/data";
import { GText, PBar } from "@/components/ui/UIUtils";

export default function InstalacionTab({ data, vars, onToggle, onVarChange }) {
    const allIds = INSTALACION_SECTIONS.flatMap(s => s.items.map(i => i.id));
    const done = allIds.filter(id => data.checked?.[id]).length;

    return (
        <div style={{ padding: "24px 28px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
            <div style={{ marginBottom: 24 }}>
                <GText g={G.gViolet} size={10} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Fase de Instalación</GText>
                <div style={{ fontSize: 20, color: G.white, fontFamily: "Georgia,serif", marginBottom: 16 }}>Optimización de Perfil</div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <PBar val={pct(done, allIds.length)} g={G.gViolet} h={6} />
                    <GText g={G.gViolet} size={13}>{pct(done, allIds.length)}%</GText>
                </div>
            </div>

            <div style={{ ...css.cardGlow, padding: 20, marginBottom: 24 }}>
                <GText g={G.gMagenta} size={9} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 14 }}>◈ Variables del Broker</GText>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[{ k: "nombre", l: "Nombre / Marca" }, { k: "zona", l: "Zona / Colonia" }, { k: "nicho", l: "Nicho (primerizo / patrimonial / lifestyle)" }, { k: "cta", l: "CTA principal (ej: INVERTIR)" }].map(({ k, l }) => (
                        <div key={k}>
                            <label style={css.label}>{l}</label>
                            <input value={vars?.[k] || ""} onChange={e => onVarChange(k, e.target.value)} placeholder="Escribe aquí..." style={css.input} />
                        </div>
                    ))}
                </div>
            </div>

            {INSTALACION_SECTIONS.map(sec => {
                const secDone = sec.items.filter(i => data.checked?.[i.id]).length;
                return (
                    <div key={sec.id} style={{ ...css.card, marginBottom: 14, overflow: "hidden" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: `1px solid ${G.border}` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{ fontSize: 14, color: G.purpleHi }}>{sec.icon}</span>
                                <span style={{ fontSize: 12, color: G.white, fontFamily: "sans-serif", fontWeight: 600 }}>{sec.label}</span>
                            </div>
                            <span style={{ fontSize: 10, color: secDone === sec.items.length ? G.green : G.purpleHi, fontFamily: "monospace" }}>
                                {secDone}/{sec.items.length}{secDone === sec.items.length ? " ✓" : ""}
                            </span>
                        </div>
                        {sec.items.map(item => {
                            const isDone = !!data.checked?.[item.id];
                            return (
                                <button key={item.id} onClick={() => onToggle(item.id)} style={{ width: "100%", background: isDone ? "rgba(16,185,129,0.04)" : "transparent", border: "none", borderBottom: `1px solid ${G.border}`, cursor: "pointer", padding: "11px 18px", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                                    <div style={{ width: 16, height: 16, borderRadius: 5, flexShrink: 0, border: `1px solid ${isDone ? G.green : G.border}`, background: isDone ? "rgba(16,185,129,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {isDone && <span style={{ fontSize: 9, color: G.green, fontWeight: 700 }}>✓</span>}
                                    </div>
                                    <span style={{ fontSize: 12, fontFamily: "sans-serif", color: isDone ? G.muted : G.white, textDecoration: isDone ? "line-through" : "none", lineHeight: 1.4 }}>{item.text}</span>
                                </button>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}

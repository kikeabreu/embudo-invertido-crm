"use client";

import { useState } from "react";
import { G, css } from "@/lib/constants";
import { GText } from "@/components/ui/UIUtils";

export default function BrokerList({ brokers = [], onSelect, onCreate, onDelete }) {
    const [name, setName] = useState("");

    return (
        <div style={{ minHeight: "100vh", background: G.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
            <div style={{ width: "100%", maxWidth: 480 }}>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <div style={{ width: 64, height: 64, background: G.gMagenta, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28, boxShadow: "0 0 40px rgba(236,72,153,0.3)" }}>▼</div>
                    <GText g={G.gMagenta} size={10} weight={600} style={{ letterSpacing: 4, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Agencia Top Seller</GText>
                    <div style={{ fontSize: 26, color: G.white, fontFamily: "Georgia,serif", marginBottom: 6 }}>Embudo Invertido™</div>
                    <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", letterSpacing: 1 }}>Selecciona o crea un broker</div>
                </div>

                {brokers.length === 0 && <div style={{ ...css.card, padding: "20px", textAlign: "center", color: G.dimmed, fontFamily: "sans-serif", fontSize: 12, marginBottom: 16, borderStyle: "dashed" }}>Aún no tienes brokers. Crea el primero.</div>}

                {brokers.map(b => (
                    <div key={b.id} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                        <button onClick={() => onSelect(b.id)} style={{ flex: 1, ...css.card, border: `1px solid ${G.border}`, padding: "14px 20px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <div style={{ fontSize: 14, color: G.white, fontFamily: "Georgia,serif" }}>{b.name}</div>
                                <div style={{ fontSize: 10, color: G.muted, fontFamily: "sans-serif", marginTop: 2 }}>{b.zona || "Mérida, Yucatán"}</div>
                            </div>
                            <GText g={G.gViolet} size={11}>Abrir →</GText>
                        </button>
                        <button onClick={() => onDelete(b.id)} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "14px 12px", cursor: "pointer", color: G.red, fontSize: 12 }}>✕</button>
                    </div>
                ))}

                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && name.trim()) { onCreate(name.trim()); setName(""); } }} placeholder="Nombre del broker..." style={{ ...css.input, flex: 1, borderRadius: 10 }} />
                    <button onClick={() => { if (name.trim()) { onCreate(name.trim()); setName(""); } }} style={{ ...css.btn(), borderRadius: 10, whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(124,58,237,0.3)" }}>+ Crear</button>
                </div>
            </div>
        </div>
    );
}

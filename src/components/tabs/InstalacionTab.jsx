"use client";

import { useState } from "react";
import { G, css, pct } from "@/lib/constants";
import { GText, PBar } from "@/components/ui/UIUtils";

export default function InstalacionTab({ 
    data, 
    vars, 
    varsLabels, 
    schema, 
    onToggle, 
    onVarChange, 
    onSaveSchema, 
    onSaveVarsLabels, 
    canEditAdmin 
}) {
    const [isManaging, setIsManaging] = useState(false);

    // Schema Flattening for Progress calculation
    const currentSchema = schema || [];
    const currentVarsLabels = varsLabels || [];

    const allIds = currentSchema.flatMap(s => (s.items || []).map(i => i.id));
    const done = allIds.filter(id => data.checked?.[id]).length;

    // --- MANAGE ACTIONS ---
    const addVar = () => {
        const key = prompt("Key única (ej: phone):")?.trim()?.toLowerCase();
        if (!key) return;
        const label = prompt("Nombre visible (ej: WhatsApp):")?.trim();
        if (!label) return;
        onSaveVarsLabels([...currentVarsLabels, { k: key, l: label }]);
    };

    const removeVar = (key) => {
        if (confirm("¿Eliminar este campo?")) {
            onSaveVarsLabels(currentVarsLabels.filter(v => v.k !== key));
        }
    };

    const addSection = () => {
        const label = prompt("Título de la sección:")?.trim();
        if (!label) return;
        const newSec = { id: "in_" + Date.now(), label, icon: "◈", items: [] };
        onSaveSchema([...currentSchema, newSec]);
    };

    const removeSection = (id) => {
        if (confirm("¿Eliminar sección completa?")) {
            onSaveSchema(currentSchema.filter(s => s.id !== id));
        }
    };

    const addItem = (secId) => {
        const text = prompt("Nuevo ítem:")?.trim();
        if (!text) return;
        const newItem = { id: "i_" + Date.now(), text };
        onSaveSchema(currentSchema.map(s => s.id === secId ? { ...s, items: [...(s.items || []), newItem] } : s));
    };

    const removeItem = (secId, itemId) => {
        onSaveSchema(currentSchema.map(s => s.id === secId ? { ...s, items: (s.items || []).filter(i => i.id !== itemId) } : s));
    };

    const editSchemaLabel = (secId, itemId = null) => {
        const section = currentSchema.find(s => s.id === secId);
        const current = itemId 
            ? section.items.find(i => i.id === itemId).text 
            : section.label;
        const newText = prompt("Editar texto:", current)?.trim();
        if (!newText) return;

        if (itemId) {
            onSaveSchema(currentSchema.map(s => s.id === secId ? { 
                ...s, 
                items: (s.items || []).map(i => i.id === itemId ? { ...i, text: newText } : i) 
            } : s));
        } else {
            onSaveSchema(currentSchema.map(s => s.id === secId ? { ...s, label: newText } : s));
        }
    };

    return (
        <div style={{ padding: "24px 28px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
            <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <GText g={G.gViolet} size={10} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Fase de Instalación</GText>
                    <div style={{ fontSize: 20, color: G.white, fontFamily: "Georgia,serif", marginBottom: 16 }}>Optimización de Perfil</div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <PBar val={pct(done, allIds.length)} g={G.gViolet} h={6} />
                        <GText g={G.gViolet} size={13}>{pct(done, allIds.length)}%</GText>
                    </div>
                </div>
                {canEditAdmin && (
                    <button onClick={() => setIsManaging(!isManaging)} style={{ background: isManaging ? G.purpleDim : "transparent", border: `1px solid ${isManaging ? G.purpleHi : G.border}`, borderRadius: 8, color: isManaging ? G.white : G.muted, padding: "8px 16px", fontSize: 10, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                        {isManaging ? "SALIR DE EDICIÓN ✓" : "⚙︎ EDITAR ESTRUCTURA"}
                    </button>
                )}
            </div>

            {/* --- BROKER VARIABLES --- */}
            <div style={{ ...css.cardGlow, padding: 20, marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <GText g={G.gMagenta} size={9} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block" }}>◈ Variables del Broker</GText>
                    {isManaging && (
                        <button onClick={addVar} style={{ background: "rgba(255,255,255,0.05)", border: `1px dashed ${G.border}`, borderRadius: 4, color: G.white, fontSize: 10, padding: "4px 8px", cursor: "pointer" }}>+ AÑADIR CAMPO</button>
                    )}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {currentVarsLabels.map(({ k, l }) => (
                        <div key={k} style={{ position: "relative" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <label style={css.label}>{l}</label>
                                {isManaging && (
                                    <button onClick={() => removeVar(k)} style={{ background: "transparent", border: "none", color: G.red, fontSize: 9, cursor: "pointer", opacity: 0.6 }}>✖</button>
                                )}
                            </div>
                            <input 
                                value={vars?.[k] || ""} 
                                onChange={e => onVarChange(k, e.target.value)} 
                                placeholder={`Escribe ${l}...`} 
                                style={{ ...css.input, paddingRight: isManaging ? 30 : 12 }} 
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* --- CHECKLIST SECTIONS --- */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {currentSchema.map(sec => {
                    const items = sec.items || [];
                    const secDone = items.filter(i => data.checked?.[i.id]).length;
                    return (
                        <div key={sec.id} style={{ ...css.card, overflow: "hidden" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: `1px solid ${G.border}`, background: "rgba(255,255,255,0.01)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <span style={{ fontSize: 14, color: G.purpleHi }}>{sec.icon}</span>
                                    {isManaging ? (
                                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <input value={sec.label} onChange={() => editSchemaLabel(sec.id)} readOnly style={{ background: "transparent", border: "none", borderBottom: "1px dashed rgba(255,255,255,0.2)", color: G.white, fontSize: 12, fontWeight: 600, padding: "2px 0", cursor: "pointer" }} onClick={() => editSchemaLabel(sec.id)} />
                                            <button onClick={() => removeSection(sec.id)} style={{ color: G.red, border: "none", background: "transparent", cursor: "pointer", fontSize: 10 }}>✖</button>
                                        </div>
                                    ) : (
                                        <span style={{ fontSize: 12, color: G.white, fontFamily: "sans-serif", fontWeight: 600 }}>{sec.label}</span>
                                    )}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    {isManaging && (
                                        <button onClick={() => addItem(sec.id)} style={{ color: G.green, background: "transparent", border: `1px solid ${G.green}`, borderRadius: 4, fontSize: 9, padding: "2px 6px", cursor: "pointer" }}>+ ITEM</button>
                                    )}
                                    <span style={{ fontSize: 10, color: items.length > 0 && secDone === items.length ? G.green : G.purpleHi, fontFamily: "monospace" }}>
                                        {secDone}/{items.length}{items.length > 0 && secDone === items.length ? " ✓" : ""}
                                    </span>
                                </div>
                            </div>
                            {items.map(item => {
                                const isDone = !!data.checked?.[item.id];
                                return (
                                    <div key={item.id} style={{ display: "flex", alignItems: "center", borderBottom: `1px solid ${G.border}`, background: isDone ? "rgba(16,185,129,0.04)" : "transparent" }}>
                                        <button 
                                            onClick={() => onToggle(item.id)} 
                                            style={{ flex: 1, background: "transparent", border: "none", cursor: "pointer", padding: "11px 18px", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}
                                        >
                                            <div style={{ width: 16, height: 16, borderRadius: 5, flexShrink: 0, border: `1px solid ${isDone ? G.green : G.border}`, background: isDone ? "rgba(16,185,129,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {isDone && <span style={{ fontSize: 9, color: G.green, fontWeight: 700 }}>✓</span>}
                                            </div>
                                            <span style={{ fontSize: 12, fontFamily: "sans-serif", color: isDone ? G.muted : G.white, textDecoration: isDone ? "line-through" : "none", lineHeight: 1.4 }}>{item.text}</span>
                                        </button>
                                        {isManaging && (
                                            <div style={{ display: "flex", gap: 10, paddingRight: 14 }}>
                                                <button onClick={() => editSchemaLabel(sec.id, item.id)} style={{ color: G.muted, border: "none", background: "transparent", cursor: "pointer", fontSize: 10 }}>✎</button>
                                                <button onClick={() => removeItem(sec.id, item.id)} style={{ color: G.red, border: "none", background: "transparent", cursor: "pointer", fontSize: 10 }}>✖</button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}

                {isManaging && (
                    <button onClick={addSection} style={{ ...css.card, background: "rgba(255,255,255,0.02)", border: `1px dashed ${G.border}`, padding: 14, color: G.muted, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
                        + AÑADIR NUEVA SECCIÓN
                    </button>
                )}
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { G, css, pct } from "@/lib/constants";
import { GText, PBar } from "@/components/ui/UIUtils";

export default function OnboardingTab({ 
    checked, 
    schema, 
    onToggle, 
    onSaveSchema, 
    canEditAdmin,
    mesLabel, 
    toast 
}) {
    const [isManaging, setIsManaging] = useState(false);

    // Schema Flattening for Progress calculation
    const currentSchema = schema || [];
    const allIds = currentSchema.flatMap(s => (s.items || []).map(i => i.id));
    const done = allIds.filter(id => checked?.[id]).length;

    // --- MANAGE ACTIONS ---
    const addStep = () => {
        const titulo = prompt("Título del paso (ej: Contenido & Guiones):")?.trim();
        if (!titulo) return;
        const dias = prompt("Días (ej: Días 5–8):")?.trim();
        if (!dias) return;
        const newStep = { id: "ob_" + Date.now(), dias, titulo, items: [] };
        onSaveSchema([...currentSchema, newStep]);
    };

    const removeStep = (id) => {
        if (confirm("¿Eliminar este paso completo?")) {
            onSaveSchema(currentSchema.filter(s => s.id !== id));
        }
    };

    const addItem = (stepId) => {
        const text = prompt("Nuevo ítem de onboarding:")?.trim();
        if (!text) return;
        const newItem = { id: "o_" + Date.now(), text };
        onSaveSchema(currentSchema.map(s => s.id === stepId ? { ...s, items: [...(s.items || []), newItem] } : s));
    };

    const removeItem = (stepId, itemId) => {
        onSaveSchema(currentSchema.map(s => s.id === stepId ? { ...s, items: (s.items || []).filter(i => i.id !== itemId) } : s));
    };

    const editStepLabel = (stepId, itemId = null) => {
        const step = currentSchema.find(s => s.id === stepId);
        const current = itemId 
            ? step.items.find(i => i.id === itemId).text 
            : step.titulo;
        const newText = prompt("Editar texto:", current)?.trim();
        if (!newText) return;

        if (itemId) {
            onSaveSchema(currentSchema.map(s => s.id === stepId ? { 
                ...s, 
                items: (s.items || []).map(i => i.id === itemId ? { ...i, text: newText } : i) 
            } : s));
        } else {
            onSaveSchema(currentSchema.map(s => s.id === stepId ? { ...s, titulo: newText } : s));
        }
    };

    return (
        <div style={{ padding: "24px 28px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
            <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <GText g={G.gGreen} size={10} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Onboarding · {mesLabel}</GText>
                    <div style={{ fontSize: 20, color: G.white, fontFamily: "Georgia,serif", marginBottom: 16 }}>Los primeros 15 días</div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <PBar val={pct(done, allIds.length)} g={G.gGreen} h={6} />
                        <GText g={G.gGreen} size={13}>{pct(done, allIds.length)}%</GText>
                    </div>
                </div>
                {canEditAdmin && (
                    <button onClick={() => setIsManaging(!isManaging)} style={{ background: isManaging ? G.purpleDim : "transparent", border: `1px solid ${isManaging ? G.purpleHi : G.border}`, borderRadius: 8, color: isManaging ? G.white : G.muted, padding: "8px 16px", fontSize: 10, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
                        {isManaging ? "SALIR DE EDICIÓN ✓" : "⚙︎ CONFIGURAR ONBOARDING"}
                    </button>
                )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {currentSchema.map((step) => {
                    const items = step.items || [];
                    const sDone = items.filter(i => checked?.[i.id]).length;
                    const isComplete = items.length > 0 && sDone === items.length;

                    return (
                        <div key={step.id} style={{ ...css.card, overflow: "hidden", borderColor: isComplete ? "rgba(16,185,129,0.3)" : G.border }}>
                            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${G.border}`, background: isComplete ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.01)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                            <GText g={isComplete ? G.gGreen : G.gViolet} size={10} weight={600} style={{ letterSpacing: 2, textTransform: "uppercase" }}>{step.dias}</GText>
                                            {isManaging && (
                                                <button onClick={() => removeStep(step.id)} style={{ background: "transparent", border: "none", color: G.red, fontSize: 9, cursor: "pointer" }}>✖</button>
                                            )}
                                        </div>
                                        {isManaging ? (
                                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                                <input value={step.titulo} onChange={() => editStepLabel(step.id)} readOnly style={{ background: "transparent", border: "none", borderBottom: "1px dashed rgba(255,255,255,0.2)", color: G.white, fontSize: 13, fontWeight: 600, width: "100%", cursor: "pointer" }} onClick={() => editStepLabel(step.id)} />
                                            </div>
                                        ) : (
                                            <div style={{ fontSize: 13, color: G.white, fontFamily: "sans-serif", fontWeight: 600 }}>{step.titulo}</div>
                                        )}
                                    </div>
                                    <div style={{ marginLeft: 12, textAlign: "right" }}>
                                        <span style={{ fontSize: 11, color: isComplete ? G.green : G.muted, fontFamily: "monospace" }}>{sDone}/{items.length}</span>
                                        {isManaging && (
                                            <div style={{ marginTop: 4 }}>
                                                <button onClick={() => addItem(step.id)} style={{ color: G.green, background: "transparent", border: `1px solid ${G.green}`, borderRadius: 4, fontSize: 8, padding: "1px 4px", cursor: "pointer" }}>+ ITEM</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ marginTop: 10 }}><PBar val={pct(sDone, items.length)} g={isComplete ? G.gGreen : G.gViolet} /></div>
                            </div>

                            {items.map(item => {
                                const isDone = !!checked?.[item.id];
                                return (
                                    <div key={item.id} style={{ display: "flex", alignItems: "center", borderBottom: `1px solid ${G.border}`, background: isDone ? "rgba(16,185,129,0.04)" : "transparent" }}>
                                        <button 
                                            onClick={() => { onToggle(item.id); if (!isDone && toast) toast(`✓ ${item.text.slice(0, 40)}`); }} 
                                            style={{ flex: 1, background: "transparent", border: "none", cursor: "pointer", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, textAlign: "left" }}
                                        >
                                            <div style={{ width: 15, height: 15, borderRadius: 4, flexShrink: 0, border: `1px solid ${isDone ? G.green : G.border}`, background: isDone ? "rgba(16,185,129,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {isDone && <span style={{ fontSize: 8, color: G.green, fontWeight: 700 }}>✓</span>}
                                            </div>
                                            <span style={{ fontSize: 11, fontFamily: "sans-serif", color: isDone ? G.muted : G.white, textDecoration: isDone ? "line-through" : "none", lineHeight: 1.4 }}>{item.text}</span>
                                        </button>
                                        {isManaging && (
                                            <div style={{ display: "flex", gap: 8, paddingRight: 12 }}>
                                                <button onClick={() => editStepLabel(step.id, item.id)} style={{ color: G.muted, border: "none", background: "transparent", cursor: "pointer", fontSize: 10 }}>✎</button>
                                                <button onClick={() => removeItem(step.id, item.id)} style={{ color: G.red, border: "none", background: "transparent", cursor: "pointer", fontSize: 10 }}>✖</button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}

                {isManaging && (
                    <button onClick={addStep} style={{ ...css.card, background: "rgba(255,255,255,0.02)", border: `1px dashed ${G.border}`, padding: 20, color: G.muted, cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        + AÑADIR NUEVO PASO DE ONBOARDING
                    </button>
                )}
            </div>
        </div>
    );
}

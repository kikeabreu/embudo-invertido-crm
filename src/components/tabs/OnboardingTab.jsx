"use client";

import { G, css, pct } from "@/lib/constants";
import { ONBOARDING_STEPS } from "@/lib/data";
import { GText, PBar } from "@/components/ui/UIUtils";

export default function OnboardingTab({ checked, onToggle, mesLabel, toast }) {
    const allIds = ONBOARDING_STEPS.flatMap(s => s.items.map(i => i.id));
    const done = allIds.filter(id => checked?.[id]).length;

    return (
        <div style={{ padding: "24px 28px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
            <div style={{ marginBottom: 24 }}>
                <GText g={G.gGreen} size={10} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Onboarding · {mesLabel}</GText>
                <div style={{ fontSize: 20, color: G.white, fontFamily: "Georgia,serif", marginBottom: 16 }}>Los primeros 15 días</div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <PBar val={pct(done, allIds.length)} g={G.gGreen} h={6} />
                    <GText g={G.gGreen} size={13}>{pct(done, allIds.length)}%</GText>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {ONBOARDING_STEPS.map((step) => {
                    const sDone = step.items.filter(i => checked?.[i.id]).length;
                    const isComplete = sDone === step.items.length;

                    return (
                        <div key={step.id} style={{ ...css.card, overflow: "hidden", borderColor: isComplete ? "rgba(16,185,129,0.3)" : G.border }}>
                            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${G.border}`, background: isComplete ? "rgba(16,185,129,0.06)" : "transparent" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <GText g={isComplete ? G.gGreen : G.gViolet} size={10} weight={600} style={{ letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 4 }}>{step.dias}</GText>
                                        <div style={{ fontSize: 13, color: G.white, fontFamily: "sans-serif", fontWeight: 600 }}>{step.titulo}</div>
                                    </div>
                                    <span style={{ fontSize: 11, color: isComplete ? G.green : G.muted, fontFamily: "monospace" }}>{sDone}/{step.items.length}</span>
                                </div>
                                <div style={{ marginTop: 10 }}><PBar val={pct(sDone, step.items.length)} g={isComplete ? G.gGreen : G.gViolet} /></div>
                            </div>

                            {step.items.map(item => {
                                const isDone = !!checked?.[item.id];
                                return (
                                    <button key={item.id} onClick={() => { onToggle(item.id); if (!isDone && toast) toast(`✓ ${item.text.slice(0, 40)}`); }} style={{ width: "100%", background: isDone ? "rgba(16,185,129,0.04)" : "transparent", border: "none", borderBottom: `1px solid ${G.border}`, cursor: "pointer", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, textAlign: "left" }}>
                                        <div style={{ width: 15, height: 15, borderRadius: 4, flexShrink: 0, border: `1px solid ${isDone ? G.green : G.border}`, background: isDone ? "rgba(16,185,129,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {isDone && <span style={{ fontSize: 8, color: G.green, fontWeight: 700 }}>✓</span>}
                                        </div>
                                        <span style={{ fontSize: 11, fontFamily: "sans-serif", color: isDone ? G.muted : G.white, textDecoration: isDone ? "line-through" : "none", lineHeight: 1.4 }}>{item.text}</span>
                                    </button>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

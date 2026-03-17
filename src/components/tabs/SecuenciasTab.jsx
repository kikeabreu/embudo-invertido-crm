"use client";

import { useState } from "react";
import { G, css, pct, uid } from "@/lib/constants";
import { SECUENCIA_VALOR, SECUENCIA_VENTA, TENSIONES_COMPRA } from "@/lib/data";
import { GText, PBar } from "@/components/ui/UIUtils";
import DiaModal from "@/components/ui/DiaModal";

export default function SecuenciasTab({ data, onSave, isViewer, onCrearEnBanco, onEnviarHistoriaAlBanco, toast }) {
    const ciclos = data?.ciclos || [];
    const [activoCicloId, setActivoCicloId] = useState(() => {
        if (data?.activoCicloId) return data.activoCicloId;
        if (ciclos.length > 0) return ciclos[ciclos.length - 1].id;
        return null;
    });
    const [openDia, setOpenDia] = useState(null);
    const [showNuevoCiclo, setShowNuevoCiclo] = useState(false);
    const [nuevoCicloLabel, setNuevoCicloLabel] = useState("");
    const [nuevoCicloTipo, setNuevoCicloTipo] = useState("valor");
    const [vistaHistorial, setVistaHistorial] = useState(false);

    const cicloActivo = ciclos.find(c => c.id === activoCicloId) || null;
    const seqData = cicloActivo?.tipo === "venta" ? SECUENCIA_VENTA : SECUENCIA_VALOR;
    const days = cicloActivo?.dias || {};
    const tension = cicloActivo?.tension || "t1";

    const completados = seqData.filter(d => days[d.dia]?.completado).length;
    const progress = pct(completados, seqData.length);

    const persistCiclos = (updatedCiclos, newActivoId) => {
        onSave({ ciclos: updatedCiclos, activoCicloId: newActivoId ?? activoCicloId });
    };

    const crearCiclo = () => {
        if (!nuevoCicloLabel.trim()) return;
        const nuevo = { id: uid(), label: nuevoCicloLabel.trim(), tipo: nuevoCicloTipo, tension: "t1", dias: {}, creadoEn: new Date().toISOString() };
        const updated = [...ciclos, nuevo];
        setActivoCicloId(nuevo.id);
        setNuevoCicloLabel(""); setShowNuevoCiclo(false); setVistaHistorial(false);
        persistCiclos(updated, nuevo.id);
    };

    const eliminarCiclo = (id) => {
        const updated = ciclos.filter(c => c.id !== id);
        const newActivo = updated.length > 0 ? updated[updated.length - 1].id : null;
        setActivoCicloId(newActivo);
        persistCiclos(updated, newActivo);
    };

    const handleSaveDia = (diaNum, diaDataSaved) => {
        const updatedCiclos = ciclos.map(c => c.id === activoCicloId ? { ...c, dias: { ...c.dias, [diaNum]: diaDataSaved } } : c);
        persistCiclos(updatedCiclos);
        setOpenDia(null);
    };

    const handleTensionChange = (t) => {
        const updatedCiclos = ciclos.map(c => c.id === activoCicloId ? { ...c, tension: t } : c);
        persistCiclos(updatedCiclos);
    };

    const openDiaData = openDia ? seqData.find(d => d.dia === openDia) : null;

    // ── Empty state ──
    if (ciclos.length === 0 && !showNuevoCiclo) {
        return (
            <div style={{ padding: "24px 28px", overflowY: "auto", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center", maxWidth: 400 }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>📅</div>
                    <GText g={G.gCyan} size={10} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Sin ciclos activos</GText>
                    <div style={{ fontSize: 14, color: G.white, fontFamily: "Georgia,serif", marginBottom: 8 }}>Crea tu primer ciclo de secuencia</div>
                    <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", marginBottom: 24 }}>Cada ciclo es un período completo de contenido (7 días de Valor o 14 días de Venta) con su propio historial y copy guardado.</div>
                    {!isViewer && <button onClick={() => setShowNuevoCiclo(true)} style={{ ...css.btn(G.gCyan), boxShadow: `0 4px 20px ${G.cyan}33` }}>+ Nuevo ciclo</button>}
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: "24px 28px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
            {openDiaData && cicloActivo && (
                <DiaModal
                    key={`${cicloActivo.id}-${openDia}`}
                    diaData={openDiaData}
                    diaNum={openDia}
                    seqType={cicloActivo.tipo}
                    cicloLabel={cicloActivo.label}
                    savedData={days[openDia] || {}}
                    onSave={(d) => handleSaveDia(openDia, d)}
                    onClose={() => setOpenDia(null)}
                    onCrearEnBanco={(piezaData) => onCrearEnBanco(piezaData, openDia, cicloActivo.id)}
                    bancoPiezaId={days[openDia]?.bancoPiezaId || null}
                    isViewer={isViewer}
                    onEnviarHistoriaAlBanco={onEnviarHistoriaAlBanco ? (h, d) => onEnviarHistoriaAlBanco(h, d, cicloActivo.id) : null}
                    toast={toast}
                />
            )}

            {/* ── HEADER ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                    <GText g={G.gCyan} size={10} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Secuencias de Contenido</GText>
                    <div style={{ fontSize: 20, color: G.white, fontFamily: "Georgia,serif" }}>Ciclos de Publicación</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setVistaHistorial(v => !v)} style={{ background: vistaHistorial ? G.purpleDim : "transparent", border: `1px solid ${vistaHistorial ? G.borderHi : G.border}`, borderRadius: 8, color: vistaHistorial ? G.purpleHi : G.muted, fontSize: 10, padding: "7px 14px", cursor: "pointer", fontFamily: "sans-serif" }}>
                        🕐 Historial ({ciclos.length})
                    </button>
                    {!isViewer && (
                        <button onClick={() => { setShowNuevoCiclo(v => !v); setVistaHistorial(false); }} style={{ ...css.btn(showNuevoCiclo ? undefined : G.gCyan), fontSize: 11, boxShadow: showNuevoCiclo ? "none" : `0 4px 20px ${G.cyan}33` }}>
                            {showNuevoCiclo ? "Cancelar" : "+ Nuevo ciclo"}
                        </button>
                    )}
                </div>
            </div>

            {/* ── NUEVO CICLO FORM ── */}
            {showNuevoCiclo && (
                <div style={{ ...css.cardGlow, padding: 20, marginBottom: 20, borderColor: G.cyan + "44" }}>
                    <GText g={G.gCyan} size={9} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Nuevo ciclo</GText>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, alignItems: "end" }}>
                        <div>
                            <label style={css.label}>Nombre del ciclo</label>
                            <input value={nuevoCicloLabel} onChange={e => setNuevoCicloLabel(e.target.value)} onKeyDown={e => e.key === "Enter" && crearCiclo()} placeholder="Ej: Semana Valor — Abril 2025" autoFocus style={css.input} />
                        </div>
                        <div>
                            <label style={css.label}>Tipo de secuencia</label>
                            <select value={nuevoCicloTipo} onChange={e => setNuevoCicloTipo(e.target.value)} style={{ ...css.input, color: G.purpleHi }}>
                                <option value="valor">Secuencia de Valor (7 días)</option>
                                <option value="venta">Secuencia de Venta (14 días)</option>
                            </select>
                        </div>
                        <button onClick={crearCiclo} style={{ ...css.btn(G.gCyan), boxShadow: `0 4px 20px ${G.cyan}33`, whiteSpace: "nowrap" }}>Crear ciclo →</button>
                    </div>
                </div>
            )}

            {/* ── HISTORIAL DE CICLOS ── */}
            {vistaHistorial && (
                <div style={{ ...css.card, padding: "16px 20px", marginBottom: 20 }}>
                    <GText g={G.gViolet} size={9} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Todos los ciclos</GText>
                    {ciclos.length === 0 && <div style={{ fontSize: 11, color: G.dimmed, fontFamily: "sans-serif" }}>Sin ciclos aún.</div>}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {[...ciclos].reverse().map(c => {
                            const cSeqData = c.tipo === "venta" ? SECUENCIA_VENTA : SECUENCIA_VALOR;
                            const cDone = cSeqData.filter(d => c.dias?.[d.dia]?.completado).length;
                            const cPct = pct(cDone, cSeqData.length);
                            const isActivo = c.id === activoCicloId;
                            const cColor = c.tipo === "venta" ? G.magenta : G.purpleHi;
                            const cGrad = c.tipo === "venta" ? G.gMagenta : G.gViolet;
                            return (
                                <div key={c.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", borderRadius: 10, border: `1px solid ${isActivo ? cColor + "55" : G.border}`, background: isActivo ? cColor + "08" : "transparent" }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                                            <span style={{ fontSize: 12, color: isActivo ? G.white : G.muted, fontFamily: "sans-serif", fontWeight: 700 }}>{c.label}</span>
                                            <span style={css.tag(cColor)}>{c.tipo === "venta" ? "Venta 14d" : "Valor 7d"}</span>
                                            {isActivo && <span style={{ fontSize: 8, color: G.green, fontFamily: "sans-serif", border: `1px solid ${G.green}44`, borderRadius: 3, padding: "1px 6px" }}>● ACTIVO</span>}
                                        </div>
                                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                            <div style={{ flex: 1, maxWidth: 200 }}><PBar val={cPct} g={cGrad} h={3} /></div>
                                            <span style={{ fontSize: 10, color: G.dimmed, fontFamily: "monospace" }}>{cDone}/{cSeqData.length} días</span>
                                            {c.creadoEn && <span style={{ fontSize: 9, color: G.dimmed, fontFamily: "monospace" }}>{new Date(c.creadoEn).toLocaleDateString("es-MX")}</span>}
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: 6 }}>
                                        {!isActivo && (
                                            <button onClick={() => { setActivoCicloId(c.id); setVistaHistorial(false); persistCiclos(ciclos, c.id); }} style={{ background: "transparent", border: `1px solid ${cColor}44`, borderRadius: 6, color: cColor, fontSize: 10, padding: "5px 12px", cursor: "pointer", fontFamily: "sans-serif" }}>Abrir</button>
                                        )}
                                        {!isViewer && (
                                            <button onClick={() => eliminarCiclo(c.id)} style={{ background: "transparent", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, color: G.red, fontSize: 10, padding: "5px 8px", cursor: "pointer" }}>✕</button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ── CICLO ACTIVO ── */}
            {cicloActivo && !vistaHistorial && (
                <>
                    {/* Ciclo selector breadcrumb */}
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16, padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: `1px solid ${G.border}` }}>
                        <span style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>Ciclo activo</span>
                        <span style={{ fontSize: 12, color: G.white, fontFamily: "sans-serif", fontWeight: 700 }}>{cicloActivo.label}</span>
                        <span style={css.tag(cicloActivo.tipo === "venta" ? G.magenta : G.purpleHi)}>{cicloActivo.tipo === "venta" ? "Venta 14d" : "Valor 7d"}</span>
                        {ciclos.length > 1 && (
                            <select
                                value={activoCicloId}
                                onChange={e => { setActivoCicloId(e.target.value); persistCiclos(ciclos, e.target.value); }}
                                style={{ marginLeft: "auto", background: "rgba(255,255,255,0.06)", border: `1px solid ${G.border}`, borderRadius: 6, color: G.purpleHi, fontSize: 10, padding: "4px 8px", fontFamily: "sans-serif", cursor: "pointer" }}
                            >
                                {ciclos.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                            </select>
                        )}
                    </div>

                    {/* Tensión de compra */}
                    {cicloActivo.tipo === "venta" && (
                        <div style={{ ...css.cardGlow, padding: 18, marginBottom: 20 }}>
                            <GText g={G.gMagenta} size={9} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 12 }}>⚡ Tensión de compra — {cicloActivo.label}</GText>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {TENSIONES_COMPRA.map(t => (
                                    <button key={t.id} onClick={() => !isViewer && handleTensionChange(t.id)} style={{ flex: "1 1 auto", padding: "10px 14px", borderRadius: 10, border: `1px solid ${tension === t.id ? G.magenta + "88" : G.border}`, background: tension === t.id ? G.magenta + "11" : "transparent", cursor: isViewer ? "default" : "pointer", textAlign: "left", transition: "all 0.2s" }}>
                                        <div style={{ fontSize: 11, color: tension === t.id ? G.magenta : G.white, fontFamily: "sans-serif", fontWeight: 700, marginBottom: 3 }}>{tension === t.id ? "● " : ""}{t.label}</div>
                                        <div style={{ fontSize: 10, color: G.dimmed, fontFamily: "sans-serif" }}>{t.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recomendaciones */}
                    <div style={{ ...css.card, padding: "12px 16px", marginBottom: 20 }}>
                        <div style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
                            {cicloActivo.tipo === "valor" ? "Recomendaciones — Secuencia de Valor" : "Recomendaciones — Secuencia de Venta"}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {(cicloActivo.tipo === "valor" ? [
                                "Máx 400 palabras por post (200–300 ideal)",
                                "Si no obtienes engagement, borra y republica",
                                "Reserva 30–60 min para responder comentarios",
                                "Comparte el post en historias junto con el video",
                            ] : [
                                "Máx 400 palabras por post (200–300 ideal)",
                                "Úsala después de 1–2 semanas de Secuencia de Valor",
                                "Define tu tensión de compra antes de empezar",
                                "Cada post debe mencionar la tensión elegida",
                            ]).map((r, i) => (
                                <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start", width: "calc(50% - 4px)" }}>
                                    <span style={{ color: cicloActivo.tipo === "valor" ? G.cyan : G.magenta, fontSize: 10, marginTop: 1, flexShrink: 0 }}>▸</span>
                                    <span style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", lineHeight: 1.5 }}>{r}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Grid de días */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                        {seqData.map((diaItem) => {
                            const saved = days[diaItem.dia] || {};
                            const isDone = saved.completado;
                            const hasCopy = !!saved.copy;
                            return (
                                <div key={diaItem.dia} onClick={() => setOpenDia(diaItem.dia)}
                                    style={{ ...css.card, padding: "16px 18px", cursor: "pointer", borderColor: isDone ? G.green + "44" : hasCopy ? diaItem.color + "33" : G.border, background: isDone ? "rgba(16,185,129,0.04)" : hasCopy ? diaItem.color + "08" : G.bgCard, transition: "all 0.2s" }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = isDone ? G.green + "88" : diaItem.color + "66"; e.currentTarget.style.background = isDone ? "rgba(16,185,129,0.08)" : diaItem.color + "11"; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = isDone ? G.green + "44" : hasCopy ? diaItem.color + "33" : G.border; e.currentTarget.style.background = isDone ? "rgba(16,185,129,0.04)" : hasCopy ? diaItem.color + "08" : G.bgCard; }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <div style={{ width: 28, height: 28, borderRadius: 8, background: isDone ? "rgba(16,185,129,0.2)" : diaItem.grad, display: "flex", alignItems: "center", justifyContent: "center", border: isDone ? `1px solid ${G.green}44` : "none" }}>
                                                <span style={{ fontSize: 11, color: isDone ? G.green : G.white, fontWeight: 800 }}>{isDone ? "✓" : diaItem.dia}</span>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 9, color: isDone ? G.green : diaItem.color, fontFamily: "sans-serif", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>{diaItem.diaNombre}</div>
                                                <div style={{ fontSize: 10, color: isDone ? G.green + "88" : G.dimmed, fontFamily: "sans-serif" }}>{isDone ? "Publicado" : hasCopy ? "Copy listo" : "Pendiente"}</div>
                                            </div>
                                        </div>
                                        <span style={{ fontSize: 9, color: G.dimmed, fontFamily: "monospace" }}>D{diaItem.dia}</span>
                                    </div>
                                    <div style={{ fontSize: 11, color: G.white, fontFamily: "sans-serif", fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{diaItem.tipo}</div>
                                    <div style={{ fontSize: 10, color: G.muted, fontFamily: "sans-serif", lineHeight: 1.5, marginBottom: 10 }}>{diaItem.objetivo.slice(0, 70)}{diaItem.objetivo.length > 70 ? "…" : ""}</div>
                                    <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                                        <span style={{ fontSize: 8, color: G.dimmed, fontFamily: "sans-serif", border: `1px solid ${G.border}`, borderRadius: 4, padding: "1px 6px" }}>{diaItem.estructura.length} pasos</span>
                                        {hasCopy && !isDone && <span style={{ fontSize: 8, color: diaItem.color, fontFamily: "sans-serif" }}>● copy</span>}
                                        {saved.fechaProg && <span style={{ fontSize: 8, color: G.blue, fontFamily: "sans-serif" }}>📅 {saved.fechaProg}</span>}
                                        {saved.nota && <span style={{ fontSize: 8, color: G.orange, fontFamily: "sans-serif" }}>📌 nota</span>}
                                    </div>
                                    {hasCopy && (
                                        <div style={{ marginTop: 8, padding: "8px 10px", background: "rgba(255,255,255,0.04)", borderRadius: 6, borderLeft: `2px solid ${isDone ? G.green : diaItem.color}66` }}>
                                            <div style={{ fontSize: 10, color: G.dimmed, fontFamily: "sans-serif", lineHeight: 1.5 }}>{saved.copy.slice(0, 80)}{saved.copy.length > 80 ? "…" : ""}</div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Summary footer */}
                    <div style={{ ...css.card, padding: "16px 20px", marginTop: 20, display: "flex", gap: 20, alignItems: "center" }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Progreso · {cicloActivo.label}</div>
                            <PBar val={progress} g={cicloActivo.tipo === "valor" ? G.gViolet : G.gMagenta} h={6} />
                        </div>
                        <div style={{ display: "flex", gap: 16 }}>
                            {[
                                { val: completados, label: "publicados", g: cicloActivo.tipo === "valor" ? G.gViolet : G.gMagenta },
                                { val: seqData.filter(d => days[d.dia]?.copy && !days[d.dia]?.completado).length, label: "con copy", g: G.gOrange },
                                { val: seqData.length - completados, label: "pendientes", g: G.gBlue },
                            ].map(({ val, label, g }) => (
                                <div key={label} style={{ textAlign: "center" }}>
                                    <GText g={g} size={20} weight={800}>{val}</GText>
                                    <div style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

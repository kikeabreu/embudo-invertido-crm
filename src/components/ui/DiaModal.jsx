"use client";

import { useState } from "react";
import { G, css, FORMATOS, FORMATO_ICON, FASES, faseColor } from "@/lib/constants";
import HistoriasDelDia from "@/components/ui/HistoriasDelDia";

// Sugerir formato según tipo de día
const sugeriFormatoParaDia = (tipo) => {
    if (/reel/i.test(tipo)) return "Reel";
    if (/carrusel|antes.*después|caso/i.test(tipo)) return "Carrusel";
    if (/historia personal|día a día|motivación/i.test(tipo)) return "Foto estática";
    if (/valor|autoridad|conscien/i.test(tipo)) return "Carrusel";
    if (/lanzamiento|oferta|venta/i.test(tipo)) return "Reel";
    return "Reel";
};

// Sugerir fase según tipo de secuencia y día
const sugerirFaseParaDia = (seqType, diaNum) => {
    if (seqType === "venta") return "Conversión";
    if (diaNum <= 2) return "Atracción";
    if (diaNum <= 5) return "Valor";
    return "Atracción";
};

export default function DiaModal({ diaData, diaNum, seqType, cicloLabel, savedData, onSave, onClose, onCrearEnBanco, bancoPiezaId, isViewer, onEnviarHistoriaAlBanco, toast }) {
    const formatoSugerido = sugeriFormatoParaDia(diaData.tipo);
    const faseSugerida = sugerirFaseParaDia(seqType, diaNum);

    const [copy, setCopy] = useState(savedData?.copy || "");
    const [completado, setCompletado] = useState(savedData?.completado || false);
    const [nota, setNota] = useState(savedData?.nota || "");
    const [formato, setFormato] = useState(savedData?.formato || formatoSugerido);
    const [fase, setFase] = useState(savedData?.fase || faseSugerida);
    const [fechaProg, setFechaProg] = useState(savedData?.fechaProg || "");
    const [linkEvidencia, setLinkEvidencia] = useState(savedData?.linkEvidencia || "");
    const [historias, setHistorias] = useState(savedData?.historias || []);
    const [activeSection, setActiveSection] = useState("guia");

    const handleSave = () => onSave({ copy, completado, nota, formato, fase, fechaProg, linkEvidencia, historias });

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
            <div style={{ background: "#0E0E24", border: `1px solid ${diaData.color}44`, borderRadius: 20, width: 700, maxWidth: "100%", maxHeight: "94vh", overflowY: "auto", boxShadow: `0 0 60px ${diaData.color}22`, display: "flex", flexDirection: "column" }}>

                {/* Header */}
                <div style={{ padding: "18px 24px", borderBottom: `1px solid ${G.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 }}>
                    <div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 10, background: diaData.grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ fontSize: 13, color: G.white, fontWeight: 800 }}>{diaNum}</span>
                            </div>
                            <span style={css.tag(diaData.color)}>{diaData.diaNombre}</span>
                            <span style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif" }}>{seqType === "valor" ? "Sec. Valor" : "Sec. Venta"} · {cicloLabel}</span>
                            {bancoPiezaId && <span style={{ fontSize: 9, color: G.green, fontFamily: "sans-serif", border: `1px solid ${G.green}44`, borderRadius: 4, padding: "1px 6px" }}>✓ En Banco</span>}
                        </div>
                        <div style={{ fontSize: 15, color: G.white, fontFamily: "Georgia,serif" }}>{diaData.tipo}</div>
                        <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", marginTop: 3 }}>{diaData.objetivo}</div>
                    </div>
                    <button onClick={onClose} style={{ background: "transparent", border: "none", color: G.muted, fontSize: 18, cursor: "pointer" }}>✕</button>
                </div>

                {/* Section tabs */}
                <div style={{ padding: "12px 24px", borderBottom: `1px solid ${G.border}`, display: "flex", gap: 6, flexShrink: 0 }}>
                    <button onClick={() => setActiveSection("guia")} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${activeSection === "guia" ? diaData.color + "88" : G.border}`, background: activeSection === "guia" ? diaData.color + "11" : "transparent", color: activeSection === "guia" ? diaData.color : G.muted, fontSize: 10, fontFamily: "sans-serif", cursor: "pointer", fontWeight: activeSection === "guia" ? 700 : 400 }}>📖 Guía</button>
                    <button onClick={() => setActiveSection("produccion")} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${activeSection === "produccion" ? diaData.color + "88" : G.border}`, background: activeSection === "produccion" ? diaData.color + "11" : "transparent", color: activeSection === "produccion" ? diaData.color : G.muted, fontSize: 10, fontFamily: "sans-serif", cursor: "pointer", fontWeight: activeSection === "produccion" ? 700 : 400 }}>✏️ Producción</button>
                    <button onClick={() => setActiveSection("historias")} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${activeSection === "historias" ? diaData.color + "88" : G.border}`, background: activeSection === "historias" ? diaData.color + "11" : "transparent", color: activeSection === "historias" ? diaData.color : G.muted, fontSize: 10, fontFamily: "sans-serif", cursor: "pointer", fontWeight: activeSection === "historias" ? 700 : 400 }}>⭕ Historias ({historias.length})</button>
                    <button onClick={() => setActiveSection("banco")} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${activeSection === "banco" ? diaData.color + "88" : G.border}`, background: activeSection === "banco" ? diaData.color + "11" : "transparent", color: activeSection === "banco" ? diaData.color : G.muted, fontSize: 10, fontFamily: "sans-serif", cursor: "pointer", fontWeight: activeSection === "banco" ? 700 : 400 }}>📋 Banco</button>
                </div>

                <div style={{ padding: "20px 24px", flex: 1 }}>

                    {/* ── GUÍA ── */}
                    {activeSection === "guia" && (
                        <div>
                            <div style={{ ...css.card, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 16 }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Formato sugerido</div>
                                    <div style={{ fontSize: 13, color: G.white, fontFamily: "sans-serif", fontWeight: 700 }}>{FORMATO_ICON[formatoSugerido]} {formatoSugerido}</div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Fase sugerida</div>
                                    <div style={{ fontSize: 13, color: faseColor(faseSugerida), fontFamily: "sans-serif", fontWeight: 700 }}>{faseSugerida}</div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Recomendación</div>
                                    <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif" }}>Máx 400 palabras · 200–300 ideal</div>
                                </div>
                            </div>
                            {diaData.estructura.map((bloque, bi) => (
                                <div key={bi} style={{ marginBottom: 10, padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, borderLeft: `3px solid ${diaData.color}66` }}>
                                    <div style={{ fontSize: 10, color: diaData.color, fontFamily: "sans-serif", fontWeight: 700, marginBottom: 6, letterSpacing: 0.5 }}>{bi + 1}. {bloque.paso}</div>
                                    {bloque.items.map((item, ii) => (
                                        <div key={ii} style={{ display: "flex", gap: 8, marginBottom: 3 }}>
                                            <span style={{ color: G.dimmed, fontSize: 10, marginTop: 1 }}>▸</span>
                                            <span style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", lineHeight: 1.5 }}>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── PRODUCCIÓN ── */}
                    {activeSection === "produccion" && (
                        <div>
                            {/* Formato + Fase + Fecha */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                                <div>
                                    <label style={css.label}>Formato final</label>
                                    <select value={formato} onChange={e => setFormato(e.target.value)} disabled={isViewer}
                                        style={{ ...css.input, color: G.purpleHi }}>
                                        {FORMATOS.map(f => <option key={f} value={f}>{FORMATO_ICON[f]} {f}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={css.label}>Fase del Banco</label>
                                    <select value={fase} onChange={e => setFase(e.target.value)} disabled={isViewer}
                                        style={{ ...css.input, color: faseColor(fase) }}>
                                        {FASES.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={css.label}>Fecha programada</label>
                                    <input type="date" value={fechaProg} onChange={e => setFechaProg(e.target.value)} readOnly={isViewer}
                                        style={{ ...css.input, colorScheme: "dark" }} />
                                </div>
                            </div>

                            <div style={{ marginBottom: 14 }}>
                                <label style={css.label}>Copy del post</label>
                                <textarea value={copy} onChange={e => setCopy(e.target.value)} readOnly={isViewer}
                                    placeholder="Pega o escribe aquí el copy final listo para publicar..." rows={6}
                                    style={{ ...css.input, resize: "vertical", lineHeight: 1.6 }} />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                                <div>
                                    <label style={css.label}>Nota del equipo</label>
                                    <input value={nota} onChange={e => setNota(e.target.value)} readOnly={isViewer}
                                        placeholder="Instrucciones, referencias, contexto..." style={css.input} />
                                </div>
                                <div>
                                    <label style={css.label}>Link de evidencia (post publicado)</label>
                                    <input value={linkEvidencia} onChange={e => setLinkEvidencia(e.target.value)} readOnly={isViewer}
                                        placeholder="URL, Drive, screenshot..." style={css.input} />
                                </div>
                            </div>

                            {/* Publicado toggle */}
                            <button onClick={() => !isViewer && setCompletado(v => !v)}
                                style={{ display: "flex", alignItems: "center", gap: 10, background: completado ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${completado ? G.green : G.border}`, borderRadius: 10, padding: "10px 16px", cursor: isViewer ? "default" : "pointer", width: "100%", marginBottom: 4 }}>
                                <div style={{ width: 18, height: 18, borderRadius: 5, border: `1px solid ${completado ? G.green : G.border}`, background: completado ? "rgba(16,185,129,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    {completado && <span style={{ fontSize: 10, color: G.green, fontWeight: 700 }}>✓</span>}
                                </div>
                                <span style={{ fontSize: 12, color: completado ? G.green : G.muted, fontFamily: "sans-serif" }}>
                                    {completado ? "✓ Post publicado" : "Marcar como publicado"}
                                </span>
                            </button>
                        </div>
                    )}

                    {/* ── HISTORIAS ── */}
                    {activeSection === "historias" && (
                        <HistoriasDelDia historias={historias} onChange={setHistorias} isViewer={isViewer} onEnviarAlBanco={onEnviarHistoriaAlBanco ? (h) => { onEnviarHistoriaAlBanco(h, diaNum); } : null} />
                    )}

                    {/* ── BANCO ── */}
                    {activeSection === "banco" && (
                        <div>
                            <div style={{ ...css.card, padding: "16px 20px", marginBottom: 16 }}>
                                <div style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Conexión con Banco de contenido</div>
                                {bancoPiezaId ? (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: G.green, flexShrink: 0 }} />
                                            <span style={{ fontSize: 12, color: G.white, fontFamily: "sans-serif" }}>Pieza vinculada al Banco</span>
                                        </div>
                                        <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", lineHeight: 1.6 }}>
                                            Esta pieza ya existe en el Banco. Desde ahí el equipo gestiona producción, aprobación y publicación. Los cambios de copy aquí <span style={{ color: G.orange }}>no se sincronizan automáticamente</span> — actualiza la pieza directamente en Banco si necesitas reflejar cambios.
                                        </div>
                                        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                                            <span style={{ fontSize: 9, color: G.green, fontFamily: "sans-serif", border: `1px solid ${G.green}44`, borderRadius: 4, padding: "2px 8px" }}>ID: {bancoPiezaId.slice(0, 8)}…</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                        <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", lineHeight: 1.6 }}>
                                            Esta pieza aún no está en el Banco. Al crear el borrador, se pre-llenará con el copy, formato (<strong style={{ color: G.white }}>{formato}</strong>), fase (<strong style={{ color: faseColor(fase) }}>{fase}</strong>){fechaProg ? ` y fecha programada (${fechaProg})` : ""}. El equipo podrá confirmarla y gestionar su producción desde Banco.
                                        </div>
                                        {!isViewer && (
                                            <button onClick={() => { handleSave(); onCrearEnBanco({ copy, formato, fase, fechaProg, titulo: diaData.tipo, hook: diaData.objetivo }); if (toast) toast("📋 Borrador creado en Banco", "info"); }}
                                                style={{ ...css.btn(diaData.grad), alignSelf: "flex-start", boxShadow: `0 4px 20px ${diaData.color}33`, display: "flex", alignItems: "center", gap: 8 }}>
                                                📋 Crear borrador en Banco
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Resumen del día */}
                            <div style={{ ...css.card, padding: "14px 18px" }}>
                                <div style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Resumen de configuración</div>
                                {[
                                    { l: "Formato", v: `${FORMATO_ICON[formato] || ""} ${formato}`, c: G.purpleHi },
                                    { l: "Fase del Banco", v: fase, c: faseColor(fase) },
                                    { l: "Fecha programada", v: fechaProg || "Sin definir", c: fechaProg ? G.white : G.dimmed },
                                    { l: "Copy", v: copy ? `${copy.slice(0, 50)}…` : "Sin copy", c: copy ? G.muted : G.dimmed },
                                    { l: "Historias", v: `${historias.length} del día · ${historias.filter(h => h.publicada).length} publicadas`, c: G.cyan },
                                    { l: "Evidencia", v: linkEvidencia || "Sin link", c: linkEvidencia ? G.green : G.dimmed },
                                ].map(({ l, v, c }) => (
                                    <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                        <span style={{ fontSize: 11, color: G.dimmed, fontFamily: "sans-serif" }}>{l}</span>
                                        <span style={{ fontSize: 11, color: c, fontFamily: "sans-serif", maxWidth: 260, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer actions */}
                <div style={{ padding: "14px 24px", borderTop: `1px solid ${G.border}`, display: "flex", gap: 10, justifyContent: "flex-end", flexShrink: 0 }}>
                    <button onClick={onClose} style={{ background: "transparent", border: `1px solid ${G.border}`, borderRadius: 8, color: G.muted, padding: "9px 20px", cursor: "pointer", fontSize: 12, fontFamily: "sans-serif" }}>Cerrar</button>
                    {!isViewer && <button onClick={() => { handleSave(); if (toast) toast(`Día ${diaNum} guardado`); }} style={{ ...css.btn(diaData.grad), boxShadow: `0 4px 20px ${diaData.color}44` }}>Guardar cambios</button>}
                </div>
            </div>
        </div>
    );
}

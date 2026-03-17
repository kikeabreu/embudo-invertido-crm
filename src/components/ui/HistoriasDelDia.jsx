"use client";

import { G, css, uid } from "@/lib/constants";

const TIPOS_HISTORIA = ["Compartir post del día", "CTA directo", "Behind the scenes", "Testimonial", "Cuenta regresiva", "Encuesta/Interacción", "Otra"];

export default function HistoriasDelDia({ historias = [], onChange, isViewer, onEnviarAlBanco }) {
    const addHistoria = () => {
        onChange([...historias, { id: uid(), tipo: "Compartir post del día", copy: "", publicada: false, linkEvidencia: "", hora: "", bancoPiezaId: null }]);
    };
    const updateHistoria = (id, field, val) => onChange(historias.map(h => h.id === id ? { ...h, [field]: val } : h));
    const removeHistoria = (id) => onChange(historias.filter(h => h.id !== id));
    const sinEnviar = historias.filter(h => !h.bancoPiezaId).length;

    return (
        <div>
            <div style={{ fontSize: 8, letterSpacing: 3, color: G.cyan, textTransform: "uppercase", fontFamily: "sans-serif", paddingBottom: 8, borderBottom: `1px solid ${G.border}`, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>⭕ Historias del día ({historias.length})</span>
                <div style={{ display: "flex", gap: 6 }}>
                    {!isViewer && sinEnviar > 0 && onEnviarAlBanco && (
                        <button onClick={() => historias.filter(h => !h.bancoPiezaId).forEach(h => onEnviarAlBanco(h))}
                            style={{ background: G.purple + "22", border: `1px solid ${G.purpleHi}44`, borderRadius: 6, color: G.purpleHi, fontSize: 9, padding: "3px 10px", cursor: "pointer", fontFamily: "sans-serif", fontWeight: 700 }}>
                            📋 Enviar {sinEnviar > 1 ? `todas (${sinEnviar})` : "al Banco"}
                        </button>
                    )}
                    {!isViewer && <button onClick={addHistoria} style={{ background: G.cyan + "22", border: `1px solid ${G.cyan}44`, borderRadius: 6, color: G.cyan, fontSize: 9, padding: "3px 10px", cursor: "pointer", fontFamily: "sans-serif", fontWeight: 700 }}>+ Historia</button>}
                </div>
            </div>
            {historias.length === 0 && (
                <div style={{ fontSize: 11, color: G.dimmed, fontFamily: "sans-serif", fontStyle: "italic", marginBottom: 12, padding: "10px 0" }}>
                    Sin historias programadas. MentorKings recomienda compartir el post del día en stories.
                    {!isViewer && <button onClick={addHistoria} style={{ marginLeft: 8, background: "transparent", border: `1px solid ${G.cyan}44`, borderRadius: 4, color: G.cyan, fontSize: 10, padding: "2px 8px", cursor: "pointer", fontFamily: "sans-serif" }}>Agregar →</button>}
                </div>
            )}
            {historias.map((h, hi) => (
                <div key={h.id} style={{ marginBottom: 10, padding: "12px 14px", background: h.publicada ? "rgba(6,182,212,0.06)" : "rgba(255,255,255,0.03)", borderRadius: 10, border: `1px solid ${h.bancoPiezaId ? G.purple + "44" : h.publicada ? G.cyan + "44" : G.border}` }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: h.publicada ? G.cyan + "33" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontSize: 9, color: h.publicada ? G.cyan : G.dimmed, fontWeight: 800 }}>{hi + 1}</span>
                        </div>
                        <select value={h.tipo} onChange={e => updateHistoria(h.id, "tipo", e.target.value)} disabled={isViewer}
                            style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${G.border}`, borderRadius: 6, color: G.purpleHi, fontSize: 11, padding: "4px 8px", fontFamily: "sans-serif", flex: 1 }}>
                            {TIPOS_HISTORIA.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <input value={h.hora} onChange={e => updateHistoria(h.id, "hora", e.target.value)} placeholder="Hora (ej: 10:00am)" readOnly={isViewer}
                            style={{ ...css.input, width: 110, fontSize: 10, padding: "4px 8px" }} />
                        <button onClick={() => updateHistoria(h.id, "publicada", !h.publicada)}
                            style={{ background: h.publicada ? "rgba(6,182,212,0.15)" : "transparent", border: `1px solid ${h.publicada ? G.cyan : G.border}`, borderRadius: 6, color: h.publicada ? G.cyan : G.muted, fontSize: 10, padding: "4px 8px", cursor: "pointer", fontFamily: "sans-serif", whiteSpace: "nowrap" }}>
                            {h.publicada ? "✓ Pub." : "Publicar"}
                        </button>
                        {!isViewer && !h.bancoPiezaId && onEnviarAlBanco && (
                            <button onClick={() => onEnviarAlBanco(h)}
                                style={{ background: "transparent", border: `1px solid ${G.purpleHi}44`, borderRadius: 6, color: G.purpleHi, fontSize: 10, padding: "4px 8px", cursor: "pointer", fontFamily: "sans-serif", whiteSpace: "nowrap" }}>
                                📋
                            </button>
                        )}
                        {h.bancoPiezaId && <span style={{ fontSize: 8, color: G.purple, fontFamily: "sans-serif", whiteSpace: "nowrap", border: `1px solid ${G.purple}44`, borderRadius: 4, padding: "2px 6px" }}>✓ Banco</span>}
                        {!isViewer && <button onClick={e => { e.stopPropagation(); removeHistoria(h.id); }} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 5, color: G.red, fontSize: 11, cursor: "pointer", padding: "3px 8px", fontFamily: "sans-serif" }}>✕ Eliminar</button>}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <div>
                            <label style={{ ...css.label, marginBottom: 4 }}>Copy / texto de la historia</label>
                            <textarea value={h.copy} onChange={e => updateHistoria(h.id, "copy", e.target.value)} placeholder="Texto, CTA o descripción..." rows={2} readOnly={isViewer}
                                style={{ ...css.input, resize: "none", fontSize: 11, lineHeight: 1.5 }} />
                        </div>
                        <div>
                            <label style={{ ...css.label, marginBottom: 4 }}>Link de evidencia</label>
                            <input value={h.linkEvidencia} onChange={e => updateHistoria(h.id, "linkEvidencia", e.target.value)} placeholder="Drive, screenshot, URL..." readOnly={isViewer}
                                style={{ ...css.input, fontSize: 11 }} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

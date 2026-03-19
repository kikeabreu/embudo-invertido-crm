"use client";

import { useState } from "react";
import { G, css, ESTADOS_PIEZA, estadoColor, FASES, faseColor, FORMATOS, FORMATO_ICON, fmtDate, uid } from "@/lib/constants";

function AnotacionInput({ onAdd }) {
    const [texto, setTexto] = useState("");
    const handleAdd = () => {
        if (!texto.trim()) return;
        onAdd(texto.trim());
        setTexto("");
    };
    return (
        <div style={{ display: "flex", gap: 8 }}>
            <input value={texto} onChange={e => setTexto(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()}
                placeholder="Escribe tu comentario o sugerencia..." style={{ ...css.input, flex: 1, fontSize: 11, borderColor: "rgba(245,158,11,0.3)" }} />
            <button onClick={handleAdd} style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 8, color: G.orange, padding: "8px 14px", cursor: "pointer", fontSize: 11, fontFamily: "sans-serif", fontWeight: 700, whiteSpace: "nowrap" }}>
                Agregar 💬
            </button>
        </div>
    );
}

const uploadToDrive = async (file, onProgress) => {
    // 1. Obtener token del backend
    const res = await fetch('/api/drive-token');
    if (!res.ok) throw new Error("Error obteniendo token");
    const { token, folderId } = await res.json();

    const metadata = { name: file.name, parents: [folderId] };

    // 2. Iniciar sesión Resumable
    const initRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Upload-Content-Type': file.type || 'application/octet-stream',
            'X-Upload-Content-Length': file.size.toString()
        },
        body: JSON.stringify(metadata)
    });

    if (!initRes.ok) {
        const errorText = await initRes.text();
        console.error("Error from Drive INIT:", errorText);
        throw new Error("Error iniciando subida: " + errorText);
    }
    const location = initRes.headers.get('Location');

    // 3. Subir archivo usando XMLHttpRequest para medir progreso
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', location, true);
        xhr.upload.onprogress = e => {
            if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = async () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const data = JSON.parse(xhr.responseText);
                try {
                    // Hacer público el archivo
                    await fetch(`https://www.googleapis.com/drive/v3/files/${data.id}/permissions`, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify({ role: 'reader', type: 'anyone' })
                    });
                    // Obtener link
                    const urlRes = await fetch(`https://www.googleapis.com/drive/v3/files/${data.id}?fields=webViewLink`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const urlData = await urlRes.json();
                    resolve(urlData.webViewLink);
                } catch (err) {
                    console.error("Error asignando permisos públicos:", err);
                    resolve(`https://drive.google.com/file/d/${data.id}/view`);
                }
            } else {
                reject(new Error("Error subiendo el archivo"));
            }
        };
        xhr.onerror = () => reject(new Error("Error de red"));
        xhr.send(file);
    });
};

const renderPreviews = (text, onDelete) => {
    if (!text) return null;

    const attachmentRegex = /📎 (.*?):\n(https?:\/\/[^\s]+)\n?/g;
    const parts = [];
    let lastIndex = 0;

    let match;
    while ((match = attachmentRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
        }
        parts.push({ type: 'attachment', filename: match[1], url: match[2], fullMatch: match[0] });
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
        parts.push({ type: 'text', content: text.slice(lastIndex) });
    }

    return parts.map((part, i) => {
        if (part.type === 'text') {
            const trimmed = part.content.trim();
            if (!trimmed) return null;
            return <div key={i} style={{ whiteSpace: "pre-wrap", marginBottom: 12, color: G.dimmed }}>{trimmed}</div>;
        } else {
            const isDrive = part.url.includes('drive.google.com/file/d/');
            let iframeUrl = null;
            let fileId = null;
            if (isDrive) {
                const matchId = part.url.match(/\/file\/d\/([-_A-Za-z0-9]+)/);
                if (matchId) {
                    fileId = matchId[1];
                    iframeUrl = `https://drive.google.com/file/d/${fileId}/preview`;
                }
            }

            return (
                <div key={i} style={{ marginBottom: 16, background: "rgba(255,255,255,0.02)", border: `1px solid ${G.border}`, borderRadius: 8, padding: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <a href={part.url} target="_blank" rel="noopener noreferrer" style={{ color: G.cyan, textDecoration: "none", fontSize: 11, fontWeight: 600, display: "flex", gap: 6, alignItems: "center" }}>
                            📎 {part.filename}
                        </a>
                        {onDelete && (
                            <button onClick={() => onDelete(part.fullMatch, fileId)} style={{ background: "rgba(239,68,68,0.1)", border: "none", color: G.red, fontSize: 10, padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontWeight: "bold" }}>
                                Borrar 🗑
                            </button>
                        )}
                    </div>
                    {iframeUrl ? (
                        <iframe src={iframeUrl} width="100%" height="220" style={{ border: `1px solid ${G.borderHi}`, borderRadius: 6, background: "#000" }} allow="autoplay" allowFullScreen />
                    ) : (
                        <a href={part.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: G.muted, wordBreak: "break-all", background: "rgba(255,255,255,0.05)", padding: 8, borderRadius: 4, display: "block" }}>{part.url}</a>
                    )}
                </div>
            );
        }
    });
};

function FileUploadInput({ value, onChange, label, placeholder, readOnly, toast }) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isEditing, setIsEditing] = useState(false);

    const handleFile = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setUploading(true);
        setProgress(0);
        try {
            let currentText = value ? value.trim() + "\n\n" : "";
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const url = await uploadToDrive(file, (p) => {
                    setProgress(Math.round(((i * 100) + p) / files.length));
                });
                currentText += `📎 ${file.name}:\n${url}\n\n`;
            }
            onChange(currentText.trim());
            if (toast) toast(files.length > 1 ? "Archivos subidos correctamente" : "Archivo subido correctamente", "success");
        } catch (err) {
            console.error(err);
            if (toast) toast("Error: No se pudieron subir los archivos", "error");
        } finally {
            setUploading(false);
            e.target.value = null; // reset input
        }
    };

    const handleDeleteLine = async (fullMatch, fileId) => {
        if (!window.confirm("¿Seguro que deseas borrar este archivo? Se borrará también de Google Drive si es posible.")) return;
        try {
            if (fileId) {
                setUploading(true);
                setProgress(100);
                await fetch('/api/drive-delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fileId }) });
                setUploading(false);
            }
            const newText = value.replace(fullMatch, "");
            onChange(newText.trim());
            if (toast) toast("Archivo borrado");
        } catch (err) {
            console.error(err);
            if (toast) toast("Error al conectar con Drive", "error");
            setUploading(false);
        }
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label style={css.label}>{label}</label>
                <div style={{ display: "flex", gap: 6 }}>
                    {!readOnly && (
                        <button onClick={() => setIsEditing(!isEditing)} style={{ cursor: "pointer", fontSize: 10, color: isEditing ? G.white : G.muted, border: `1px solid ${isEditing ? G.borderHi : G.border}`, borderRadius: 4, padding: "2px 6px", background: isEditing ? "rgba(255,255,255,0.1)" : "transparent", transition: "all 0.15s" }}>
                            {isEditing ? "Ver Previews 👁" : "Editar manual ✏️"}
                        </button>
                    )}
                    {!readOnly && (
                        <label style={{ cursor: "pointer", fontSize: 10, color: G.cyan, border: `1px solid ${G.cyan}44`, borderRadius: 4, padding: "2px 6px", background: G.cyan + "11", transition: "all 0.15s" }}>
                            Subir archivos 📎
                            <input type="file" multiple style={{ display: "none" }} onChange={handleFile} disabled={uploading} />
                        </label>
                    )}
                </div>
            </div>
            {uploading ? (
                <div style={{ marginTop: 6 }}>
                    <div style={{ fontSize: 10, color: G.cyan, fontWeight: 600 }}>{progress < 100 ? `Subiendo... ${progress}%` : 'Procesando en Drive...'}</div>
                    <div style={{ height: 4, background: G.border, borderRadius: 2, marginTop: 4, overflow: "hidden" }}>
                        <div style={{ width: `${progress}%`, height: "100%", background: G.cyan, transition: "width 0.2s" }} />
                    </div>
                </div>
            ) : (
                isEditing && !readOnly ? (
                    <textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                        style={{ ...css.input, marginTop: 4, minHeight: 60, resize: "vertical", fontSize: 11, fontFamily: "monospace", whiteSpace: "pre-wrap" }} />
                ) : (
                    <div style={{ ...css.input, marginTop: 4, minHeight: 60, fontSize: 11, fontFamily: "monospace", overflowY: "auto", maxHeight: 350, background: "rgba(0,0,0,0.2)", padding: value ? "12px 12px 0 12px" : 12 }}>
                        {value ? renderPreviews(value, readOnly ? null : handleDeleteLine) : <span style={{ color: G.dimmed, fontStyle: "italic" }}>{placeholder || "Vacío..."}</span>}
                    </div>
                )
            )}
        </div>
    );
}

function PieceTextArea({ value, onChange, label, rows = 3, placeholder = "", readOnly = false, locked = false }) {
    return (
        <div style={{ marginBottom: 14 }}>
            <label style={css.label}>{label}</label>
            {locked
                ? <div style={{ fontSize: 11, color: G.dimmed, fontFamily: "sans-serif", fontStyle: "italic" }}>🔒 Solo visible para el equipo</div>
                : <textarea value={value || ""} onChange={onChange} placeholder={placeholder} rows={rows} readOnly={readOnly}
                    style={{ ...css.input, resize: "vertical", lineHeight: 1.6, opacity: readOnly ? 0.7 : 1 }} />}
        </div>
    );
}

export default function PieceModal({ piece, isViewer, canEdit, canDelete, userRole, onSave, onClose, onDelete, logs, toast }) {
    const [form, setForm] = useState({ formato: "", fechaProg: "", linkEvidencia: "", origen: "manual", anotaciones: [], ...piece });
    const [confirmDelete, setConfirmDelete] = useState(false);

    const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

    const pLogs = (logs || []).filter(l => l.pieceId === piece.id).sort((a, b) => b.ts.localeCompare(a.ts));

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
            <div style={{ background: "#0E0E24", border: `1px solid ${G.borderHi}`, borderRadius: 20, width: 600, maxWidth: "100%", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 0 60px rgba(124,58,237,0.2)" }}>
                <div style={{ padding: "20px 24px", borderBottom: `1px solid ${G.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                            <select value={form.fase || ""} onChange={e => f("fase", e.target.value)} disabled={isViewer}
                                style={{ ...css.input, padding: "2px 8px", fontSize: 10, height: 22, borderRadius: 6, fontWeight: 700, color: G.white, width: "auto" }}>
                                {FASES.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                            <span style={{ fontSize: 9, color: G.muted, fontFamily: "sans-serif", alignSelf: "center" }}>#{piece.num}</span>
                        </div>
                        <div style={{ fontSize: 16, color: G.white, fontFamily: "Georgia,serif", lineHeight: 1.3 }}>{piece.titulo}</div>
                        <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", marginTop: 4, fontStyle: "italic" }}>"{piece.hook}"</div>
                    </div>
                    <button onClick={onClose} style={{ background: "transparent", border: "none", color: G.muted, fontSize: 18, cursor: "pointer", flexShrink: 0 }}>✕</button>
                </div>
                <div style={{ padding: "20px 24px" }}>
                    <div style={{ marginBottom: 18 }}>
                        <label style={css.label}>Estado</label>
                        <div style={{ display: "flex", gap: 6 }}>
                            {ESTADOS_PIEZA.map(e => (
                                <button key={e} onClick={() => !isViewer && f("estado", e)} style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: `1px solid ${form.estado === e ? estadoColor(e) : G.border}`, background: form.estado === e ? `${estadoColor(e)}22` : "transparent", color: form.estado === e ? estadoColor(e) : G.muted, fontSize: 9, fontFamily: "sans-serif", cursor: isViewer ? "default" : "pointer", letterSpacing: 0.5, textTransform: "uppercase" }}>
                                    {form.estado === e ? "● " : ""}{e}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Formato + Origen badge */}
                    <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                            <label style={css.label}>Formato</label>
                            <select value={form.formato || ""} onChange={e => f("formato", e.target.value)} disabled={isViewer}
                                style={{ ...css.input, color: G.purpleHi }}>
                                <option value="">Sin definir</option>
                                {FORMATOS.map(fmt => <option key={fmt} value={fmt}>{FORMATO_ICON[fmt]} {fmt}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={css.label}>Link de evidencia</label>
                            <input value={form.linkEvidencia || ""} onChange={e => f("linkEvidencia", e.target.value)} readOnly={isViewer} placeholder="URL del post, Drive, screenshot..." style={css.input} />
                        </div>
                        {form.origen === "secuencia" && (
                            <div style={{ alignSelf: "flex-end", paddingBottom: 2 }}>
                                <span style={{ fontSize: 9, color: G.cyan, fontFamily: "sans-serif", border: `1px solid ${G.cyan}44`, borderRadius: 6, padding: "6px 10px", display: "block" }}>📅 Desde secuencia</span>
                            </div>
                        )}
                    </div>
                    {/* Fecha programada */}
                    <div style={{ marginBottom: 18 }}>
                        <label style={css.label}>Fecha programada de publicación</label>
                        <input type="date" value={form.fechaProg || ""} onChange={e => f("fechaProg", e.target.value)} readOnly={isViewer}
                            style={{ ...css.input, colorScheme: "dark", width: "auto", minWidth: 200 }} />
                        {form.fechaProg && <span style={{ fontSize: 10, color: G.muted, fontFamily: "sans-serif", marginLeft: 10 }}>
                            {new Date(form.fechaProg + "T12:00:00").toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        </span>}
                    </div>
                    <div style={{ fontSize: 8, letterSpacing: 3, color: G.dimmed, textTransform: "uppercase", fontFamily: "sans-serif", paddingBottom: 8, borderBottom: `1px solid ${G.border}`, marginBottom: 14 }}>Contenido del post</div>
                    <PieceTextArea value={form.copy} onChange={e => f("copy", e.target.value)} label="Copy completo" rows={4} placeholder="Escribe el copy completo del post aquí..." readOnly={isViewer} />
                    <PieceTextArea value={form.guion} onChange={e => f("guion", e.target.value)} label="Hook & estructura del guión" rows={3} placeholder="Hook, desarrollo, CTA..." readOnly={isViewer} />

                    <div style={{ fontSize: 8, letterSpacing: 3, color: G.dimmed, textTransform: "uppercase", fontFamily: "sans-serif", paddingBottom: 8, borderBottom: `1px solid ${G.border}`, marginBottom: 14 }}>Producción</div>
                    <PieceTextArea value={form.instrucciones} onChange={e => f("instrucciones", e.target.value)} label="Instrucciones de grabación / diseño" rows={3} placeholder="Ej: Grabar en locación, fondo neutro, ropa casual..." readOnly={isViewer} />
                    <PieceTextArea value={form.notasInternas} onChange={e => f("notasInternas", e.target.value)} label="Notas internas del equipo 🔒" rows={2} placeholder="Solo visible para Kike y Equipo..." readOnly={isViewer} locked={userRole === 'Broker'} />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        {[{ k: "linkRecursos", l: "Link de recursos (crudos)" }, { k: "linkFinal", l: "Link diseño / video final" }].map(({ k, l }) => (
                            <FileUploadInput key={k} value={form[k]} onChange={v => f(k, v)} label={l} placeholder="URL o subir archivo..." readOnly={isViewer} toast={toast} />
                        ))}
                    </div>

                    {pLogs.length > 0 && (
                        <>
                            <div style={{ fontSize: 8, letterSpacing: 3, color: G.dimmed, textTransform: "uppercase", fontFamily: "sans-serif", paddingBottom: 8, borderBottom: `1px solid ${G.border}`, marginBottom: 14, marginTop: 20 }}>Actividad ({pLogs.length})</div>
                            <div style={{ maxHeight: 150, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
                                {pLogs.map(l => (
                                    <div key={l.id} style={{ display: "flex", gap: 10, padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: `1px solid ${G.border}` }}>
                                        <div style={{ width: 28, height: 28, borderRadius: 20, background: G.gPurple, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                            <span style={{ fontSize: 11, color: G.white, fontWeight: 700 }}>{l.user[0]}</span>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", gap: 8, marginBottom: 2, alignItems: "center" }}>
                                                <span style={{ fontSize: 11, color: G.white, fontFamily: "sans-serif", fontWeight: 700 }}>{l.user}</span>
                                                <span style={{ fontSize: 9, color: G.dimmed, fontFamily: "monospace", marginLeft: "auto" }}>{fmtDate(l.ts)}</span>
                                            </div>
                                            <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif" }}>{l.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* ── ANOTACIONES DEL CLIENTE ── */}
                    <div style={{ marginTop: 20, padding: "16px", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                            <div style={{ fontSize: 9, letterSpacing: 2, color: G.orange, fontFamily: "sans-serif", textTransform: "uppercase", fontWeight: 700 }}>
                                💬 Anotaciones{userRole === "Viewer" ? " del cliente" : " / Sugerencias del cliente"}
                            </div>
                            {canEdit && form.anotaciones?.some(a => !a.revisada) && (
                                <span style={{ fontSize: 9, color: G.orange, fontFamily: "sans-serif", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 10, padding: "2px 8px" }}>
                                    {form.anotaciones.filter(a => !a.revisada).length} sin revisar
                                </span>
                            )}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
                            {(form.anotaciones || []).length === 0 && (
                                <div style={{ fontSize: 11, color: G.dimmed, fontFamily: "sans-serif", fontStyle: "italic" }}>
                                    {userRole === "Viewer" ? "Escribe aquí tus comentarios o sugerencias sobre esta pieza." : "Sin anotaciones del cliente."}
                                </div>
                            )}
                            {(form.anotaciones || []).map((a, ai) => (
                                <div key={a.id} style={{ padding: "10px 12px", background: a.revisada ? "rgba(16,185,129,0.05)" : "rgba(245,158,11,0.06)", border: `1px solid ${a.revisada ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)"}`, borderRadius: 8, display: "flex", gap: 10, alignItems: "flex-start" }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", gap: 8, marginBottom: 4, alignItems: "center" }}>
                                            <span style={{ fontSize: 9, color: G.orange, fontFamily: "sans-serif", fontWeight: 700 }}>Cliente</span>
                                            <span style={{ fontSize: 9, color: G.dimmed, fontFamily: "monospace" }}>{a.ts ? fmtDate(a.ts) : ""}</span>
                                            {a.revisada && <span style={{ fontSize: 8, color: G.green, fontFamily: "sans-serif" }}>✓ Revisada</span>}
                                        </div>
                                        <div style={{ fontSize: 12, color: G.white, fontFamily: "sans-serif", lineHeight: 1.5 }}>{a.texto}</div>
                                    </div>
                                    {canEdit && !a.revisada && (
                                        <button onClick={() => f("anotaciones", form.anotaciones.map((x, xi) => xi === ai ? { ...x, revisada: true } : x))}
                                            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 6, color: G.green, fontSize: 10, padding: "3px 8px", cursor: "pointer", fontFamily: "sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}>
                                            ✓ Marcar revisada
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {userRole === "Viewer" && (
                            <AnotacionInput onAdd={(texto) => f("anotaciones", [...(form.anotaciones || []), { id: uid(), texto, ts: new Date().toISOString(), revisada: false }])} />
                        )}
                    </div>

                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
                        {!isViewer && onDelete && !confirmDelete && (
                            <button onClick={() => setConfirmDelete(true)} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, color: G.red, padding: "9px 16px", cursor: "pointer", fontSize: 12, fontFamily: "sans-serif", marginRight: "auto" }}>
                                🗑 Eliminar
                            </button>
                        )}
                        {confirmDelete && (
                            <div style={{ display: "flex", gap: 8, alignItems: "center", marginRight: "auto", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "6px 12px" }}>
                                <span style={{ fontSize: 11, color: G.red, fontFamily: "sans-serif" }}>¿Confirmar eliminación?</span>
                                <button onClick={() => onDelete(piece.id)} style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.5)", borderRadius: 6, color: G.red, padding: "4px 12px", cursor: "pointer", fontSize: 11, fontFamily: "sans-serif", fontWeight: 700 }}>Sí, eliminar</button>
                                <button onClick={() => setConfirmDelete(false)} style={{ background: "transparent", border: `1px solid ${G.border}`, borderRadius: 6, color: G.muted, padding: "4px 10px", cursor: "pointer", fontSize: 11, fontFamily: "sans-serif" }}>Cancelar</button>
                            </div>
                        )}
                        <button onClick={onClose} style={{ background: "transparent", border: `1px solid ${G.border}`, borderRadius: 8, color: G.muted, padding: "9px 20px", cursor: "pointer", fontSize: 12, fontFamily: "sans-serif" }}>Cerrar</button>
                        {!isViewer && <button onClick={() => { onSave(form); if (toast) toast("Cambios guardados"); }} style={{ ...css.btn(), boxShadow: "0 4px 20px rgba(124,58,237,0.3)" }}>Guardar cambios</button>}
                        {isViewer && <button onClick={() => { onSave(form); if (toast) toast("Anotación guardada 💬", "info"); }} style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 8, color: G.orange, padding: "9px 20px", cursor: "pointer", fontSize: 12, fontFamily: "sans-serif", fontWeight: 700 }}>Guardar anotación 💬</button>}
                    </div>
                </div>
            </div>
        </div>
    );
}

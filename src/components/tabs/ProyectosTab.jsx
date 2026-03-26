import React, { useState, useEffect } from "react";
import { G, css, fmtDate } from "@/lib/constants";
import { GText } from "@/components/ui/UIUtils";
import { supabase } from "@/lib/supabaseClient";
import { notifyUser, notifyMentions } from "@/lib/notifUtils";

export default function ProyectosTab({ proyectos, tareas, onSaveProyecto, onDeleteProyecto, onSaveTarea, onDeleteTarea, onAddComentario, isViewer, currentUser, brokerId, toast }) {
    const [selProjId, setSelProjId] = useState(null);
    const [showProjModal, setShowProjModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [editProj, setEditProj] = useState(null);
    const [editTask, setEditTask] = useState(null);
    const [team, setTeam] = useState([]);
    
    // Drive y Menciones
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [mentionSearch, setMentionSearch] = useState("");
    const [showMentions, setShowMentions] = useState(false);

    const BANCO_PROJ = { id: 'banco-tareas', nombre: 'Inbox del Banco ⚡', color: G.orange, esVirtual: true };
    const allProyectos = [BANCO_PROJ, ...proyectos];
    const selProj = allProyectos.find(p => p.id === selProjId) || allProyectos[0];
    const projTasksRaw = tareas.filter(t => selProj?.id === 'banco-tareas' ? (!t.proyecto_id && t.broker_id === brokerId) : t.proyecto_id === selProj?.id);

    const [viewMode, setViewMode] = useState("kanban"); // kanban | lista | calendario
    const [filterAssignee, setFilterAssignee] = useState("Todas");
    const [filterPriority, setFilterPriority] = useState("Todas");
    const [filterStatus, setFilterStatus] = useState("Todos");
    const [filterDate, setFilterDate] = useState("Todas");
    const [sortBy, setSortBy] = useState("defecto"); // defecto | prioridad | fecha_limite | estado
    const [calMes, setCalMes] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });

    const hoy = new Date().toLocaleString("sv").split(" ")[0]; // YYYY-MM-DD
    const getWeekEnd = () => {
        const d = new Date();
        const diff = d.getDate() + (7 - d.getDay()) % 7;
        const weekEnd = new Date(d.setDate(diff));
        return weekEnd.toLocaleString("sv").split(" ")[0];
    };
    const thisWeekEnd = getWeekEnd();
    const thisMonth = hoy.substring(0, 7);

    const projTasks = projTasksRaw
        .filter(t => {
            if (filterPriority !== "Todas" && t.prioridad !== filterPriority) return false;
            if (filterAssignee === "Mis tareas" && t.asignado_a !== currentUser?.id) return false;
            if (filterAssignee !== "Todas" && filterAssignee !== "Mis tareas" && t.asignado_a !== filterAssignee) return false;
            if (filterStatus !== "Todos" && t.estado !== filterStatus) return false;
            
            if (filterDate === "Atrasadas" && (!t.fecha_limite || t.fecha_limite >= hoy || t.estado === "Hecho")) return false;
            if (filterDate === "Hoy" && t.fecha_limite !== hoy) return false;
            if (filterDate === "Esta semana" && (!t.fecha_limite || t.fecha_limite < hoy || t.fecha_limite > thisWeekEnd)) return false;
            if (filterDate === "Este mes" && (!t.fecha_limite || !t.fecha_limite.startsWith(thisMonth))) return false;
            
            return true;
        })
        .sort((a, b) => {
            if (sortBy === "fecha_limite") {
                if (!a.fecha_limite) return 1;
                if (!b.fecha_limite) return -1;
                return a.fecha_limite.localeCompare(b.fecha_limite);
            }
            if (sortBy === "prioridad") {
                const pMap = { "Crítica": 1, "Alta": 2, "Media": 3, "Baja": 4 };
                return (pMap[a.prioridad] || 9) - (pMap[b.prioridad] || 9);
            }
            if (sortBy === "estado") {
                const sMap = { "Inbox": 1, "En curso": 2, "Bloqueado": 3, "Hecho": 4 };
                return (sMap[a.estado] || 9) - (sMap[b.estado] || 9);
            }
            // default
            return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        });

    useEffect(() => {
        if (!selProjId) setSelProjId('banco-tareas');
        fetchTeam();
    }, [proyectos]);

    useEffect(() => {
        const handleOpenTask = (e) => {
            const taskId = e.detail?.taskId;
            if (taskId) {
                const t = tareas.find(x => x.id === taskId);
                if (t) {
                    setEditTask(t);
                    setShowTaskModal(true);
                    
                    // Asegurarnos de estar en el proyecto correcto
                    if (t.proyecto_id) setSelProjId(t.proyecto_id);
                    else setSelProjId('banco-tareas');
                }
            }
        };
        window.addEventListener("open-task-modal", handleOpenTask);
        return () => window.removeEventListener("open-task-modal", handleOpenTask);
    }, [tareas]);

    const fetchTeam = async () => {
        const { data } = await supabase.from('usuarios').select('id, nombre, rol')
            .or(`rol.in.(Admin,Equipo),id.eq.${brokerId},parent_id.eq.${brokerId}`);
        if (data) setTeam(data);
    };

    // --- DRIVE HELPERS (Adaptados de PieceModal) ---
    const uploadFile = async (file) => {
        setUploading(true); setProgress(0);
        try {
            const res = await fetch('/api/drive-token');
            if (!res.ok) throw new Error("Error token");
            const { token, folderId } = await res.json();
            const metadata = { name: file.name, parents: [folderId] };
            const initRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', {
                method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'X-Upload-Content-Type': file.type || 'application/octet-stream', 'X-Upload-Content-Length': file.size.toString() },
                body: JSON.stringify(metadata)
            });
            const location = initRes.headers.get('Location');
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', location, true);
            xhr.upload.onprogress = e => { if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100)); };
            const driveUrl = await new Promise((resolve, reject) => {
                xhr.onload = async () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        const d = JSON.parse(xhr.responseText);
                        await fetch(`https://www.googleapis.com/drive/v3/files/${d.id}/permissions`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ role: 'reader', type: 'anyone' }) });
                        const uR = await fetch(`https://www.googleapis.com/drive/v3/files/${d.id}?fields=webViewLink`, { headers: { Authorization: `Bearer ${token}` } });
                        const uD = await uR.json(); resolve(uD.webViewLink);
                    } else reject("Error subiendo");
                };
                xhr.onerror = () => reject("Error red"); xhr.send(file);
            });
            return driveUrl;
        } catch (e) { toast("Error Drive: " + e.message, "error"); return null; }
        finally { setUploading(false); setProgress(0); }
    };

    const renderTextWithLinks = (text) => {
        if (!text) return null;
        const attachmentRegex = /📎 (.*?):\n(https?:\/\/[^\s]+)\n?/g;
        const parts = []; let lastIndex = 0; let match;
        while ((match = attachmentRegex.exec(text)) !== null) {
            if (match.index > lastIndex) parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
            parts.push({ type: 'link', name: match[1], url: match[2] });
            lastIndex = match.index + match[0].length;
        }
        if (lastIndex < text.length) parts.push({ type: 'text', content: text.slice(lastIndex) });
        return parts.map((p, i) => p.type === 'text' ? <span key={i}>{p.content}</span> : <a key={i} href={p.url} target="_blank" style={{ color: G.cyan, textDecoration: "none", background: "rgba(6,182,212,0.1)", padding: "2px 6px", borderRadius: 4, fontSize: 10, display: "inline-block", margin: "2px 0" }}>📎 {p.name}</a>);
    };

    const STATUS_COLS = [
        { k: "Inbox", l: "📥 Inbox", c: G.muted },
        { k: "En curso", l: "⚡ En curso", c: G.orange },
        { k: "Bloqueado", l: "🛑 Bloqueado", c: G.red },
        { k: "Hecho", l: "✅ Hecho", c: G.green }
    ];

    const PRIORITY_ICON = { Baja: "🟢", Media: "🟡", Alta: "🟠", Crítica: "🔴" };

    return (
        <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
            {/* Sidebar de Proyectos */}
            <div style={{ width: 240, borderRight: `1px solid ${G.border}`, display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.01)" }}>
                <div style={{ padding: 20, borderBottom: `1px solid ${G.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <GText bold size={11} color={G.white} spacing={2}>PROYECTOS</GText>
                    {!isViewer && <button onClick={() => { setEditProj({ nombre: "", descripcion: "", color: G.purple }); setShowProjModal(true); }} style={{ background: G.purple, border: "none", borderRadius: 4, color: G.white, width: 24, height: 24, cursor: "pointer" }}>+</button>}
                </div>
                    {allProyectos.map(p => (
                        <div key={p.id} onClick={() => setSelProjId(p.id)} style={{ padding: "10px 15px", borderRadius: 8, cursor: "pointer", background: selProjId === p.id ? "rgba(255,255,255,0.05)" : "transparent", color: selProjId === p.id ? G.white : G.muted, marginBottom: 4, transition: "0.2s", display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color || G.purple }} />
                            <span style={{ flex: 1 }}>{p.nombre}</span>
                        </div>
                    ))}
                    {allProyectos.length === 0 && <div style={{ padding: 20, textAlign: "center", color: G.dimmed, fontSize: 11 }}>Sin proyectos aún</div>}

            </div>

            {/* Area de Trabajo */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                {selProj ? (
                    <>
                        <div style={{ padding: "20px 30px", borderBottom: `1px solid ${G.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: 18, color: G.white }}>{selProj.nombre}</h2>
                                <p style={{ margin: "5px 0 0", fontSize: 12, color: G.muted }}>{selProj.descripcion || "Sin descripción"}</p>
                            </div>
                            <div style={{ display: "flex", gap: 10 }}>
                                {!selProj.esVirtual && !isViewer && <button onClick={() => { setEditProj(selProj); setShowProjModal(true); }} style={{ ...css.btn(G.bgGlass), padding: "7px 15px" }}>⚙️ Editar</button>}
                                {!isViewer && <button onClick={() => { setEditTask({ titulo: "", descripcion: "", prioridad: "Media", estado: "Inbox", proyecto_id: selProj.esVirtual ? null : selProj.id, broker_id: brokerId }); setShowTaskModal(true); }} style={css.btn()}>+ Nueva Tarea</button>}
                            </div>
                        </div>

                        {/* Barra de Filtros y Vistas */}
                        <div style={{ padding: "10px 30px", borderBottom: `1px solid ${G.border}`, display: "flex", gap: 15, background: "rgba(0,0,0,0.15)", alignItems: "center", flexWrap: "wrap" }}>
                            <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.05)", padding: 4, borderRadius: 8 }}>
                                {["kanban", "lista", "calendario"].map(v => (
                                    <button key={v} onClick={() => setViewMode(v)} style={{ background: viewMode === v ? "rgba(124,58,237,0.2)" : "transparent", color: viewMode === v ? G.white : G.muted, border: "none", padding: "6px 14px", borderRadius: 6, fontSize: 11, cursor: "pointer", textTransform: "capitalize", fontWeight: viewMode === v ? 600 : 400 }}>
                                        {v === "kanban" ? "📋 " : v === "lista" ? "📝 " : "📅 "}{v}
                                    </button>
                                ))}
                            </div>
                            <div style={{ width: 1, height: 20, background: G.border }} />
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <label style={{ fontSize: 10, color: G.muted, fontWeight: 700, letterSpacing: 1 }}>ASIGNADO A:</label>
                                <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)} style={{ ...css.input, padding: "6px 10px", fontSize: 11, width: "auto" }}>
                                    <option value="Todas">👥 Todos</option>
                                    <option value="Mis tareas">👤 Mis tareas</option>
                                    {team.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
                                </select>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <label style={{ fontSize: 10, color: G.muted, fontWeight: 700, letterSpacing: 1 }}>PRIORIDAD:</label>
                                <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ ...css.input, padding: "6px 10px", fontSize: 11, width: "auto" }}>
                                    <option value="Todas">⚪ Todas</option>
                                    <option value="Crítica">🔴 Crítica</option>
                                    <option value="Alta">🟠 Alta</option>
                                    <option value="Media">🟡 Media</option>
                                    <option value="Baja">🟢 Baja</option>
                                </select>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <label style={{ fontSize: 10, color: G.muted, fontWeight: 700, letterSpacing: 1 }}>ESTADO:</label>
                                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...css.input, padding: "6px 10px", fontSize: 11, width: "auto" }}>
                                    <option value="Todos">🌐 Todos</option>
                                    <option value="Inbox">📥 Inbox</option>
                                    <option value="En curso">⚡ En curso</option>
                                    <option value="Bloqueado">🛑 Bloqueado</option>
                                    <option value="Hecho">✅ Hecho</option>
                                </select>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <label style={{ fontSize: 10, color: G.muted, fontWeight: 700, letterSpacing: 1 }}>LÍMITE:</label>
                                <select value={filterDate} onChange={e => setFilterDate(e.target.value)} style={{ ...css.input, padding: "6px 10px", fontSize: 11, width: "auto" }}>
                                    <option value="Todas">📅 Todas</option>
                                    <option value="Atrasadas">⚠️ Atrasadas</option>
                                    <option value="Hoy">🔥 Hoy</option>
                                    <option value="Esta semana">📆 Esta semana</option>
                                    <option value="Este mes">🗓️ Este mes</option>
                                </select>
                            </div>
                            <div style={{ width: 1, height: 20, background: G.border }} />
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <label style={{ fontSize: 10, color: G.muted, fontWeight: 700, letterSpacing: 1 }}>ORDENAR:</label>
                                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...css.input, padding: "6px 10px", fontSize: 11, width: "auto", background: "rgba(124,58,237,0.1)", borderColor: "rgba(124,58,237,0.3)" }}>
                                    <option value="defecto">🕒 Recientes primero</option>
                                    <option value="fecha_limite">⏰ Por fecha límite</option>
                                    <option value="prioridad">🔥 Por prioridad</option>
                                    <option value="estado">📊 Por estado</option>
                                </select>
                            </div>
                            <div style={{ marginLeft: "auto", fontSize: 11, color: G.muted }}>
                                Mostrando <span style={{ color: G.white, fontWeight: 700 }}>{projTasks.length}</span> tareas
                            </div>
                        </div>

                        {/* Kanban Board */}
                        {viewMode === "kanban" && (
                            <div style={{ flex: 1, overflowX: "auto", display: "flex", gap: 20, padding: 25, alignItems: "flex-start" }}>
                            {STATUS_COLS.map(col => (
                                <div key={col.k} style={{ minWidth: 280, width: 280, display: "flex", flexDirection: "column", maxHeight: "100%" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 15, padding: "0 5px" }}>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: col.c }}>{col.l}</div>
                                        <div style={{ background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 10, fontSize: 10, color: G.muted }}>
                                            {projTasks.filter(t => t.estado === col.k).length}
                                        </div>
                                    </div>
                                    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
                                        {projTasks.filter(t => t.estado === col.k).map(task => (
                                            <div key={task.id} onClick={() => { setEditTask(task); setShowTaskModal(true); }} style={{ background: G.bgCard, border: `1px solid ${G.border}`, borderRadius: 12, padding: 15, cursor: "pointer", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = G.borderHi} onMouseLeave={e => e.currentTarget.style.borderColor = G.border}>
                                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                                                    <span style={{ fontSize: 10, color: G.muted }}>{PRIORITY_ICON[task.prioridad]} {task.prioridad.toUpperCase()}</span>
                                                    {task.fecha_limite && <span style={{ fontSize: 9, color: G.orange }}>📅 {task.fecha_limite}</span>}
                                                </div>
                                                <div style={{ fontSize: 14, color: G.white, fontWeight: 600, marginBottom: 8 }}>{task.titulo}</div>
                                                <div style={{ fontSize: 11, color: G.muted, lineBreak: "anywhere", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{task.descripcion}</div>
                                                
                                                <div style={{ marginTop: 15, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                                                        {task.creador_id && (
                                                            <div title={`Creado por: ${team.find(u => u.id === task.creador_id)?.nombre || "Autor"}`} style={{ fontSize: 9, color: G.muted, border: `1px dashed rgba(255,255,255,0.2)`, borderRadius: 10, padding: "2px 6px", display: "flex", gap: 3, alignItems: "center", background: "rgba(255,255,255,0.02)" }}>
                                                                <span style={{color: G.green}}>+</span>
                                                                {team.find(u => u.id === task.creador_id)?.nombre?.slice(0, 2).toUpperCase() || "?"}
                                                            </div>
                                                        )}
                                                        {task.comentarios_tareas?.length > 0 && <span style={{ fontSize: 10, color: G.dimmed, marginLeft: task.creador_id ? 5 : 0 }}>💬 {task.comentarios_tareas.length}</span>}
                                                    </div>
                                                    <div title={`Asignado a: ${team.find(u => u.id === task.asignado_a)?.nombre || "Sin asignar"}`} style={{ width: 24, height: 24, borderRadius: "50%", background: G.purple, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: G.white, border: `1px solid ${G.borderHi}` }}>
                                                        {team.find(u => u.id === task.asignado_a)?.nombre?.slice(0, 2).toUpperCase() || "?"}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        )}

                        {/* Vista Lista */}
                        {viewMode === "lista" && (
                            <div style={{ flex: 1, padding: 25, overflowY: "auto" }}>
                                <div style={{ display: "flex", alignItems: "center", padding: "10px 16px", borderBottom: `1px solid ${G.border}`, background: G.bgCard, borderRadius: 8, marginBottom: 8 }}>
                                    <span style={{ fontSize: 9, letterSpacing: 2, color: G.muted, fontFamily: "sans-serif", textTransform: "uppercase", width: 120 }}>ESTADO</span>
                                    <span style={{ fontSize: 9, letterSpacing: 2, color: G.muted, fontFamily: "sans-serif", textTransform: "uppercase", width: 80 }}>PRIORIDAD</span>
                                    <span style={{ fontSize: 9, letterSpacing: 2, color: G.muted, fontFamily: "sans-serif", textTransform: "uppercase", flex: 1 }}>TÍTULO</span>
                                    <span style={{ fontSize: 9, letterSpacing: 2, color: G.muted, fontFamily: "sans-serif", textTransform: "uppercase", width: 120 }}>LÍMITE</span>
                                    <span style={{ fontSize: 9, letterSpacing: 2, color: G.muted, fontFamily: "sans-serif", textTransform: "uppercase", width: 120 }}>ASIGNADO A</span>
                                </div>
                                {projTasks.map(task => (
                                    <div key={task.id} onClick={() => { setEditTask(task); setShowTaskModal(true); }} style={{ ...css.card, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", transition: "0.2s", marginBottom: 6 }} onMouseEnter={e => e.currentTarget.style.borderColor = G.borderHi} onMouseLeave={e => e.currentTarget.style.borderColor = G.border}>
                                        <div style={{ width: 120, fontSize: 11, color: STATUS_COLS.find(s => s.k === task.estado)?.c || G.muted }}>{STATUS_COLS.find(s => s.k === task.estado)?.l}</div>
                                        <div style={{ width: 80, fontSize: 11 }}>{PRIORITY_ICON[task.prioridad]} {task.prioridad}</div>
                                        <div style={{ flex: 1, fontSize: 13, color: G.white, fontWeight: 600 }}>{task.titulo}</div>
                                        <div style={{ width: 120, fontSize: 11, color: task.fecha_limite ? G.orange : G.dimmed }}>{task.fecha_limite ? `📅 ${task.fecha_limite}` : "—"}</div>
                                        <div style={{ width: 120, display: "flex", alignItems: "center", gap: 6 }}>
                                            {task.asignado_a ? (
                                                <>
                                                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: G.purple, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: G.white }}>{team.find(u => u.id === task.asignado_a)?.nombre?.slice(0, 2).toUpperCase() || "?"}</div>
                                                    <span style={{ fontSize: 11, color: G.muted }}>{team.find(u => u.id === task.asignado_a)?.nombre?.split(" ")[0]}</span>
                                                </>
                                            ) : <span style={{ fontSize: 11, color: G.dimmed }}>Sin asignar</span>}
                                        </div>
                                    </div>
                                ))}
                                {projTasks.length === 0 && <div style={{ textAlign: "center", padding: 40, color: G.dimmed, fontSize: 12, fontFamily: "sans-serif" }}>No hay tareas que coincidan con los filtros.</div>}
                            </div>
                        )}

                        {/* Vista Calendario */}
                        {viewMode === "calendario" && (() => {
                            const startDay = new Date(calMes.y, calMes.m, 1).getDay();
                            const totalDays = new Date(calMes.y, calMes.m + 1, 0).getDate();
                            const todayStr = new Date().toLocaleString("sv").split(" ")[0]; // YYYY-MM-DD local
                            
                            return (
                                <div style={{ flex: 1, padding: 25, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                        <GText bold size={14} color={G.white} spacing={2}>
                                            {new Date(calMes.y, calMes.m).toLocaleString('es', { month: 'long', year: 'numeric' }).toUpperCase()}
                                        </GText>
                                        <div style={{ display: "flex", gap: 10 }}>
                                            <button onClick={() => setCalMes(m => m.m === 0 ? { y: m.y - 1, m: 11 } : { ...m, m: m.m - 1 })} style={{ ...css.btn(G.bgGlass), padding: "4px 12px" }}>‹ Anterior</button>
                                            <button onClick={() => setCalMes(m => m.m === 11 ? { y: m.y + 1, m: 0 } : { ...m, m: m.m + 1 })} style={{ ...css.btn(G.bgGlass), padding: "4px 12px" }}>Siguiente ›</button>
                                        </div>
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10, flex: 1 }}>
                                        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => <div key={d} style={{ textAlign: "center", fontSize: 10, color: G.muted, fontWeight: 700 }}>{d}</div>)}
                                        {Array.from({ length: startDay }).map((_, i) => <div key={`blank-${i}`} />)}
                                        {Array.from({ length: totalDays }).map((_, i) => {
                                            const d = i + 1;
                                            const dateStr = `${calMes.y}-${String(calMes.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                                            const isHoy = dateStr === todayStr;
                                            const tsForDay = projTasks.filter(t => t.fecha_limite === dateStr);
                                            
                                            return (
                                                <div key={d} style={{ background: isHoy ? "rgba(124,58,237,0.08)" : G.bgCard, border: `1px solid ${isHoy ? G.purple : G.border}`, borderRadius: 8, padding: "8px 4px", minHeight: 100, display: "flex", flexDirection: "column", gap: 4 }}>
                                                    <div style={{ fontSize: 10, color: isHoy ? G.purpleHi : G.muted, textAlign: "right", fontWeight: isHoy ? 700 : 400, marginBottom: 4 }}>{d}</div>
                                                    {tsForDay.map(t => {
                                                        const stat = STATUS_COLS.find(s => s.k === t.estado) || { c: G.muted };
                                                        return (
                                                            <div key={t.id} onClick={() => { setEditTask(t); setShowTaskModal(true); }} style={{ fontSize: 9, padding: "4px 6px", background: stat.c + "22", color: stat.c, borderRadius: 4, cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", border: `1px solid ${stat.c}44`, fontFamily: "sans-serif" }} title={t.titulo}>
                                                                {PRIORITY_ICON[t.prioridad]} {t.titulo}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })()}
                    </>
                ) : (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: G.dimmed }}>
                        <div style={{ fontSize: 40, marginBottom: 20 }}>🚀</div>
                        <GText size={14}>Selecciona o crea un proyecto para empezar</GText>
                    </div>
                )}
            </div>

            {/* Modals... (Siguiente paso) */}
            {/* Modal de Proyecto */}
            {showProjModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                    <div style={{ ...css.card, width: 400, padding: 30 }}>
                        <GText bold size={12} spacing={2} color={G.purpleHi} marginBottom={20}>{editProj?.id ? "EDITAR PROYECTO" : "NUEVO PROYECTO"}</GText>
                        <label style={css.label}>NOMBRE</label>
                        <input value={editProj.nombre} onChange={e => setEditProj({ ...editProj, nombre: e.target.value })} style={{ ...css.input, marginBottom: 20 }} placeholder="Ej: Lanzamiento Q2" />
                        <label style={css.label}>DESCRIPCIÓN</label>
                        <textarea value={editProj.descripcion} onChange={e => setEditProj({ ...editProj, descripcion: e.target.value })} style={{ ...css.input, height: 80, marginBottom: 20 }} placeholder="Notas breves..." />
                        <label style={css.label}>COLOR</label>
                        <div style={{ display: "flex", gap: 8, marginBottom: 30 }}>
                            {[G.purple, G.blue, G.green, G.orange, G.red, G.magenta].map(c => (
                                <div key={c} onClick={() => setEditProj({ ...editProj, color: c })} style={{ width: 24, height: 24, borderRadius: "50%", background: c, border: editProj.color === c ? `2px solid ${G.white}` : "none", cursor: "pointer" }} />
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={() => setShowProjModal(false)} style={{ ...css.btn(G.bgGlass), flex: 1 }}>Cancelar</button>
                            <button onClick={() => { onSaveProyecto(editProj); setShowProjModal(false); }} style={{ ...css.btn(), flex: 1 }}>Guardar</button>
                        </div>
                        {editProj?.id && <button onClick={() => { onDeleteProyecto(editProj.id); setShowProjModal(false); }} style={{ background: "transparent", border: "none", color: G.red, fontSize: 10, marginTop: 15, cursor: "pointer", width: "100%" }}>ELIMINAR PROYECTO</button>}
                    </div>
                </div>
            )}

            {/* Modal de Tarea / Detalle */}
            {showTaskModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                    <div style={{ ...css.cardGlow, width: 800, height: "85vh", display: "flex", overflow: "hidden" }}>
                        {/* Columna Izquierda: Datos */}
                        <div style={{ flex: 1.5, padding: 35, overflowY: "auto", borderRight: `1px solid ${G.border}` }}>
                            <GText bold size={10} color={G.muted} spacing={2} marginBottom={10}>DETALLES DE TAREA</GText>
                            <input value={editTask.titulo} onChange={e => setEditTask({ ...editTask, titulo: e.target.value })} style={{ ...css.input, fontSize: 24, padding: "5px 0", background: "transparent", border: "none", borderBottom: `1px solid ${G.border}`, borderRadius: 0, marginBottom: 25, fontWeight: 700 }} placeholder="Título de la tarea..." />
                            
                            <label style={css.label}>DESCRIPCIÓN</label>
                            <textarea value={editTask.descripcion} onChange={e => setEditTask({ ...editTask, descripcion: e.target.value })} style={{ ...css.input, minHeight: 120, marginBottom: 25, lineHeight: 1.6 }} placeholder="Escribe los detalles aquí..." />
                            
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 25 }}>
                                <div>
                                    <label style={css.label}>ESTADO</label>
                                    <select value={editTask.estado} onChange={e => setEditTask({ ...editTask, estado: e.target.value })} style={css.input}>
                                        {STATUS_COLS.map(s => <option key={s.k} value={s.k}>{s.l}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={css.label}>PRIORIDAD</label>
                                    <select value={editTask.prioridad} onChange={e => setEditTask({ ...editTask, prioridad: e.target.value })} style={css.input}>
                                        <option value="Baja">🟢 Baja</option>
                                        <option value="Media">🟡 Media</option>
                                        <option value="Alta">🟠 Alta</option>
                                        <option value="Crítica">🔴 Crítica</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={css.label}>ASIGNADO A</label>
                                    <select value={editTask.asignado_a || ""} onChange={e => setEditTask({ ...editTask, asignado_a: e.target.value })} style={css.input}>
                                        <option value="">Sin asignar</option>
                                        {team.map(u => <option key={u.id} value={u.id}>{u.nombre} ({u.rol})</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={css.label}>FECHA LÍMITE</label>
                                    <input type="date" value={editTask.fecha_limite || ""} onChange={e => setEditTask({ ...editTask, fecha_limite: e.target.value })} style={css.input} />
                                </div>
                            </div>
                            
                            {editTask?.pieza_id && (
                                <div style={{ marginBottom: 25 }}>
                                    <button onClick={() => {
                                        window.dispatchEvent(new CustomEvent("navigate-tab", { detail: { tab: "banco", query: `open_piece=${editTask.pieza_id}` } }));
                                        setShowTaskModal(false);
                                    }} style={{ ...css.btn(G.bgGlass), width: "100%", padding: "12px 0", color: G.cyan, border: `1px dashed ${G.cyan}66`, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                        🔗 Ir al Post Original en el Banco
                                    </button>
                                </div>
                            )}
                            
                            <div style={{ display: "flex", gap: 10, marginTop: 40 }}>
                                <button onClick={() => setShowTaskModal(false)} style={{ ...css.btn(G.bgGlass), flex: 1 }}>Cerrar</button>
                                <button onClick={() => { onSaveTarea(editTask); setShowTaskModal(false); 
                                    // Notify new assignee if changed
                                    const original = tareas.find(t => t.id === editTask.id);
                                    if (editTask.asignado_a && editTask.asignado_a !== original?.asignado_a) {
                                        notifyUser(editTask.asignado_a, { 
                                            tipo: "asignacion", 
                                            mensaje: `📌 ${currentUser?.nombre || "Alguien"} te asignó la tarea: "${editTask.titulo}"`,
                                            link: `tab:proyectos?open_task=${editTask.id}`
                                        }).catch(() => {});
                                    }
                                }} style={{ ...css.btn(), flex: 1 }}>Guardar Cambios</button>
                            </div>
                            {editTask.id && <button onClick={() => { onDeleteTarea(editTask.id); setShowTaskModal(false); }} style={{ background: "transparent", border: "none", color: G.red, fontSize: 10, marginTop: 15, cursor: "pointer", width: "100%" }}>ELIMINAR TAREA</button>}
                        </div>

                        {/* Columna Derecha: Comentarios & Colaboración */}
                        <div style={{ flex: 1, background: "rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", position: "relative" }}>
                            <div style={{ padding: 25, borderBottom: `1px solid ${G.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <GText bold size={10} spacing={2}>COMENTARIOS</GText>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <label style={{ cursor: "pointer", fontSize: 10, color: G.cyan, padding: "4px 8px", border: `1px solid ${G.cyan}33`, borderRadius: 4, background: G.cyan + "08" }}>
                                        📎 DRIVE
                                        <input type="file" style={{ display: "none" }} onChange={async e => {
                                            const f = e.target.files[0]; if (!f) return;
                                            const url = await uploadFile(f);
                                            if (url) {
                                                const inp = document.getElementById("comment-input");
                                                inp.value += `\n📎 ${f.name}:\n${url}\n`;
                                            }
                                        }} />
                                    </label>
                                </div>
                            </div>

                            {uploading && (
                                <div style={{ padding: "10px 25px", background: "rgba(6,182,212,0.1)", borderBottom: `1px solid ${G.cyan}22` }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: G.cyan, marginBottom: 5 }}>
                                        <span>Subiendo archivo...</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div style={{ height: 3, background: G.border, borderRadius: 2, overflow: "hidden" }}>
                                        <div style={{ width: `${progress}%`, height: "100%", background: G.cyan, transition: "width 0.2s" }} />
                                    </div>
                                </div>
                            )}

                            <div style={{ flex: 1, overflowY: "auto", padding: 25, display: "flex", flexDirection: "column", gap: 20 }}>
                                {editTask.comentarios_tareas?.length > 0 ? editTask.comentarios_tareas.map(c => (
                                    <div key={c.id}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: G.purpleHi }}>{team.find(u => u.id === c.autor_id)?.nombre || "Usuario"}</span>
                                            <span style={{ fontSize: 9, color: G.dimmed }}>{fmtDate(c.created_at)}</span>
                                        </div>
                                        <div style={{ fontSize: 12, color: G.white, background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "0 12px 12px 12px", border: `1px solid ${G.border}`, lineHeight: 1.5 }}>
                                            {renderTextWithLinks(c.texto)}
                                        </div>
                                    </div>
                                )) : (
                                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: G.dimmed, fontSize: 11, textAlign: "center" }}>
                                        Sin comentarios aún.<br/>Menciona con @ o adjunta archivos.
                                    </div>
                                )}
                            </div>

                            {/* Mentions Dropdown */}
                            {showMentions && (
                                <div style={{ position: "absolute", bottom: 100, left: 20, right: 20, background: "#0F0F2D", border: `1px solid ${G.borderHi}`, borderRadius: 12, boxShadow: "0 -10px 40px rgba(0,0,0,0.5)", maxHeight: 200, overflowY: "auto", zIndex: 10 }}>
                                    {team.filter(u => u.nombre.toLowerCase().includes(mentionSearch.toLowerCase())).map(u => (
                                        <div key={u.id} onClick={() => {
                                            const inp = document.getElementById("comment-input");
                                            const t = inp.value;
                                            const lastAt = t.lastIndexOf("@");
                                            inp.value = t.slice(0, lastAt) + `@${u.nombre} ` + t.slice(lastAt + 1 + mentionSearch.length);
                                            setShowMentions(false);
                                            inp.focus();
                                        }} style={{ padding: "10px 15px", cursor: "pointer", borderBottom: `1px solid ${G.border}`, display: "flex", gap: 10, alignItems: "center" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                            <div style={{ width: 24, height: 24, borderRadius: "50%", background: G.gPurple, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: G.white }}>{u.nombre[0]}</div>
                                            <div style={{ fontSize: 12, color: G.white }}>{u.nombre} <span style={{ color: G.dimmed, fontSize: 10 }}>({u.rol})</span></div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{ padding: 20, borderTop: `1px solid ${G.border}`, background: G.bgCard }}>
                                <textarea id="comment-input" 
                                onChange={e => {
                                    const t = e.target.value;
                                    const lastAt = t.lastIndexOf("@");
                                    if (lastAt !== -1 && lastAt >= t.length - 15) {
                                        const search = t.slice(lastAt + 1);
                                        if (!search.includes(" ")) {
                                            setMentionSearch(search);
                                            setShowMentions(true);
                                        } else setShowMentions(false);
                                    } else setShowMentions(false);
                                }}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey && !showMentions) {
                                        e.preventDefault();
                                        const t = e.target.value.trim();
                                        if (t) {
                                            onAddComentario(editTask.id, t);
                                            notifyMentions(t, team, currentUser?.nombre || "Alguien", `tab:proyectos?open_task=${editTask.id}`).catch(() => {});
                                            e.target.value = "";
                                        }
                                    }
                                    if (e.key === 'Escape') setShowMentions(false);
                                }} style={{ ...css.input, minHeight: 80, padding: 15, borderRadius: 12, fontSize: 13 }} placeholder="Escribe un mensaje... usa @ para etiquetar" />
                                <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: 10, color: G.dimmed }}>SHIFT+ENTER para salto de línea</span>
                                    <button onClick={() => {
                                        const inp = document.getElementById("comment-input");
                                        const t = inp.value.trim();
                                        if (t) {
                                            onAddComentario(editTask.id, t);
                                            notifyMentions(t, team, currentUser?.nombre || "Alguien").catch(() => {});
                                            inp.value = "";
                                        }
                                    }} style={{ ...css.btn(), padding: "6px 20px" }}>Enviar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

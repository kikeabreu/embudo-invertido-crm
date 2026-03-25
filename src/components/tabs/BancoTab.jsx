"use client";

import { useState, useEffect } from "react";
import { G, css, FASES, ESTADOS_PIEZA, FORMATOS, FORMATO_ICON, faseColor, faseGrad, estadoColor, pct, uid } from "@/lib/constants";
import { PBar, GText } from "@/components/ui/UIUtils";
import PieceModal from "@/components/ui/PieceModal";

function BancoSel({ val, set, opts }) {
    return (
        <select value={val} onChange={e => set(e.target.value)} style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${G.border}`, borderRadius: 8, color: G.purpleHi, fontSize: 11, padding: "6px 10px", fontFamily: "sans-serif", cursor: "pointer" }}>
            {opts.map(o => <option key={o.v ?? o} value={o.v ?? o}>{o.l ?? o}</option>)}
        </select>
    );
}

export default function BancoTab({ piezas = [], tareas = [], onSave, onAdd, onImport, onDelete, onBulkDelete, onBulkUpdate, isViewer, canEdit, canDelete, canImport, logs = [], toast, userRole, brokerId, onCreateTarea, currentUser }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [filterFase, setFilterFase] = useState("Todas");
    const [filterEst, setFilterEst] = useState("Todos");
    const [filterFormato, setFilterFormato] = useState("Todos");
    const [filterOrigen, setFilterOrigen] = useState("Todos");
    const [sortBy, setSortBy] = useState("num");
    const [search, setSearch] = useState("");
    const [vista, setVista] = useState("lista"); // lista | kanban | calendario | cards
    const [editPiece, setEditPiece] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [calMes, setCalMes] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
    const [form, setForm] = useState({ fase: "Atracción", avatar: "", dolor: "", titulo: "", hook: "", ctaDm: "", formato: "", fechaProg: "" });

    useEffect(() => {
        const handleOpenPiece = (e) => {
            const pieceId = e.detail?.pieceId;
            if (pieceId) {
                const p = piezas.find(x => x.id === pieceId);
                if (p) {
                    setEditPiece(p);
                }
            }
        };
        window.addEventListener("open-piece-modal", handleOpenPiece);
        return () => window.removeEventListener("open-piece-modal", handleOpenPiece);
    }, [piezas]);

    const filtered = piezas
        .filter(p => {
            if (filterFase !== "Todas" && p.fase !== filterFase) return false;
            if (filterEst !== "Todos" && p.estado !== filterEst) return false;
            if (filterFormato !== "Todos" && p.formato !== filterFormato) return false;
            if (filterOrigen !== "Todos" && p.origen !== filterOrigen) return false;
            if (search && !(p.titulo?.toLowerCase().includes(search.toLowerCase()) || p.hook?.toLowerCase().includes(search.toLowerCase()) || p.copy?.toLowerCase().includes(search.toLowerCase()))) return false;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === "fecha") {
                if (!a.fechaProg && !b.fechaProg) return a.num - b.num;
                if (!a.fechaProg) return 1; if (!b.fechaProg) return -1;
                return a.fechaProg.localeCompare(b.fechaProg);
            }
            return a.num - b.num;
        });

    const toggleSelectAll = () => {
        if (selectedIds.length === filtered.length) setSelectedIds([]);
        else setSelectedIds(filtered.map(p => p.id));
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const byFase = FASES.map(f => ({ f, total: piezas.filter(p => p.fase === f).length, pub: piezas.filter(p => p.fase === f && p.estado === "Publicado").length }));
    const hoy = new Date();
    const enSieteDias = new Date(hoy); enSieteDias.setDate(hoy.getDate() + 7);
    const proximasAll = piezas.filter(p => { if (!p.fechaProg) return false; const d = new Date(p.fechaProg + "T12:00:00"); return d >= hoy && d <= enSieteDias; });
    const proximasPorEstado = ESTADOS_PIEZA.reduce((acc, e) => { acc[e] = proximasAll.filter(p => p.estado === e).length; return acc; }, {});

    // ── Vista: LISTA ──────────────────────────────────────────────────────────
    const vistaListaJSX = (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", padding: "10px 16px", borderBottom: `1px solid ${G.border}`, background: G.bgCard, borderRadius: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                    <input
                        type="checkbox"
                        checked={selectedIds.length > 0 && selectedIds.length === filtered.length}
                        onChange={toggleSelectAll}
                        style={{ width: 14, height: 14, cursor: "pointer" }}
                    />
                    <span style={{ fontSize: 9, letterSpacing: 2, color: G.muted, fontFamily: "sans-serif", textTransform: "uppercase" }}>PIEZA</span>
                </div>
                <span style={{ fontSize: 9, letterSpacing: 2, color: G.muted, fontFamily: "sans-serif", textTransform: "uppercase", width: 78, textAlign: "center" }}>FASE</span>
                <span style={{ fontSize: 9, letterSpacing: 2, color: G.muted, fontFamily: "sans-serif", textTransform: "uppercase", width: 92, textAlign: "center" }}>ESTADO</span>
                <span style={{ fontSize: 9, letterSpacing: 2, color: G.muted, fontFamily: "sans-serif", textTransform: "uppercase", width: 150, textAlign: "center" }}>FORMATO</span>
                <span style={{ fontSize: 9, letterSpacing: 2, color: G.muted, fontFamily: "sans-serif", textTransform: "uppercase", width: 76, textAlign: "center" }}>ACCIONES</span>
            </div>
            {filtered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: G.dimmed, fontFamily: "sans-serif", fontSize: 12 }}>Sin piezas que coincidan con los filtros.</div>}
            {filtered.map((p) => {
                const pLogCount = logs.filter(l => l.pieceId === p.id).length;
                const hasDetails = p.copy || p.guion || p.instrucciones;
                const isFromSeq = p.origen === "secuencia";
                const bc = isFromSeq ? G.cyan + "33" : G.border;
                const isSel = selectedIds.includes(p.id);
                return (
                    <div key={p.id} style={{ ...css.card, padding: "12px 16px", display: "grid", gridTemplateColumns: "30px 28px 78px 92px 1fr 140px 76px", gap: 10, alignItems: "center", cursor: "pointer", borderColor: isSel ? G.purple : bc, background: isSel ? "rgba(124,58,237,0.08)" : G.bgCard, transition: "0.2s" }}
                        onClick={() => setEditPiece(p)}>
                        <input 
                            type="checkbox" 
                            checked={isSel}
                            onChange={(e) => { e.stopPropagation(); toggleSelect(p.id); }}
                            onClick={e => e.stopPropagation()}
                            style={{ width: 14, height: 14, cursor: "pointer" }}
                        />
                        <span style={{ fontSize: 9, color: G.dimmed, fontFamily: "monospace" }}>#{p.num}</span>
                        <span style={css.tag(faseColor(p.fase))}>{p.fase}</span>
                        <span style={{ ...css.tag(estadoColor(p.estado)), borderRadius: 4 }}>{p.estado}</span>
                        <div>
                            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 2 }}>
                                <span style={{ fontSize: 12, color: G.white, fontFamily: "sans-serif", fontWeight: 600 }}>{p.titulo}</span>
                                {isFromSeq && <span style={{ fontSize: 7, color: G.cyan, border: `1px solid ${G.cyan}33`, borderRadius: 3, padding: "1px 4px" }}>📅 Seq</span>}
                            </div>
                            <div style={{ fontSize: 10, color: G.muted, fontFamily: "sans-serif", fontStyle: "italic" }}>"{p.hook?.slice(0, 60)}{(p.hook?.length ?? 0) > 60 ? "…" : ""}"</div>
                            <div style={{ display: "flex", gap: 8, marginTop: 3 }}>
                                {hasDetails && <span style={{ fontSize: 7, color: G.purple }}>● contenido</span>}
                                {p.fechaProg && <span style={{ fontSize: 7, color: G.blue }}>📅 {p.fechaProg}</span>}
                                {p.linkEvidencia && <span style={{ fontSize: 7, color: G.green }}>🔗 evidencia</span>}
                                {(p.anotaciones?.filter(a => !a.revisada).length > 0) && <span style={{ fontSize: 7, color: G.orange }}>💬 {p.anotaciones.filter(a => !a.revisada).length}</span>}
                                {pLogCount > 0 && <span style={{ fontSize: 7, color: G.muted }}>🕐 {pLogCount}</span>}
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
                            {p.formato ? <span style={{ fontSize: 9, color: G.purpleHi, border: `1px solid ${G.purpleHi}33`, borderRadius: 4, padding: "1px 5px" }}>{FORMATO_ICON[p.formato]} {p.formato}</span>
                                : <span style={{ ...css.tag(G.blue), fontSize: 7 }}>{p.avatar || "—"}</span>}
                        </div>
                        <div style={{ display: "flex", gap: 5, justifyContent: "flex-end" }}>
                            <button onClick={(e) => { e.stopPropagation(); setEditPiece(p); }} style={{ background: "transparent", border: `1px solid ${G.border}`, borderRadius: 5, cursor: "pointer", color: G.purpleHi, fontSize: 10, padding: "3px 8px" }}>✎</button>
                            {!isViewer && <button onClick={(e) => { e.stopPropagation(); onDelete(p.id); }} style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 5, cursor: "pointer", color: G.red, fontSize: 10, padding: "3px 8px", fontFamily: "sans-serif" }}>✕</button>}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    // ── Vista: CARDS ─────────────────────────────────────────────────────────
    const vistaCardsJSX = (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            {filtered.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: G.dimmed, fontFamily: "sans-serif", fontSize: 12 }}>Sin piezas.</div>}
            {filtered.map(p => {
                const bc = p.origen === "secuencia" ? G.cyan + "33" : G.border;
                return (
                    <div key={p.id} onClick={() => setEditPiece(p)} style={{ ...css.card, padding: "16px", cursor: "pointer", borderColor: bc, transition: "all 0.15s", display: "flex", flexDirection: "column", gap: 10 }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = G.borderHi; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = bc; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                <span style={css.tag(faseColor(p.fase))}>{p.fase}</span>
                                {p.formato && <span style={{ fontSize: 9, color: G.purpleHi, border: `1px solid ${G.purpleHi}33`, borderRadius: 10, padding: "2px 7px" }}>{FORMATO_ICON[p.formato]} {p.formato}</span>}
                            </div>
                            <span style={{ ...css.tag(estadoColor(p.estado)), borderRadius: 4, fontSize: 8 }}>{p.estado}</span>
                        </div>
                        <div>
                            <div style={{ fontSize: 13, color: G.white, fontFamily: "sans-serif", fontWeight: 700, marginBottom: 5, lineHeight: 1.3 }}>{p.titulo}</div>
                            <div style={{ fontSize: 10, color: G.muted, fontFamily: "sans-serif", fontStyle: "italic", lineHeight: 1.5 }}>"{p.hook?.slice(0, 80)}{(p.hook?.length ?? 0) > 80 ? "…" : ""}"</div>
                        </div>
                        {p.copy && <div style={{ fontSize: 10, color: G.dimmed, fontFamily: "sans-serif", lineHeight: 1.5, padding: "8px 10px", background: "rgba(255,255,255,0.04)", borderRadius: 6, borderLeft: `2px solid ${faseColor(p.fase)}44` }}>
                            {p.copy.slice(0, 100)}{p.copy.length > 100 ? "…" : ""}
                        </div>}
                        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginTop: "auto" }}>
                            {p.fechaProg && <span style={{ fontSize: 9, color: G.blue }}>📅 {p.fechaProg}</span>}
                            {p.linkEvidencia && <span style={{ fontSize: 9, color: G.green }}>🔗</span>}
                            {p.origen === "secuencia" && <span style={{ fontSize: 8, color: G.cyan, border: `1px solid ${G.cyan}33`, borderRadius: 3, padding: "1px 4px" }}>Seq</span>}
                            <span style={{ marginLeft: "auto", fontSize: 9, color: G.dimmed }}>#{p.num}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    // ── Vista: KANBAN ─────────────────────────────────────────────────────────
    const vistaKanbanJSX = (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${ESTADOS_PIEZA.length}, minmax(180px, 1fr))`, gap: 12, alignItems: "start" }}>
            {ESTADOS_PIEZA.map(estado => {
                const col = filtered.filter(p => p.estado === estado);
                const ec = estadoColor(estado);
                return (
                    <div key={estado} style={{ ...css.card, overflow: "hidden" }}>
                        <div style={{ padding: "10px 14px", borderBottom: `1px solid ${G.border}`, background: ec + "11", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 10, color: ec, fontFamily: "sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{estado}</span>
                            <span style={{ fontSize: 11, color: ec, fontFamily: "monospace", fontWeight: 800 }}>{col.length}</span>
                        </div>
                        <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: 6, maxHeight: 500, overflowY: "auto" }}>
                            {col.length === 0 && <div style={{ fontSize: 10, color: G.dimmed, fontFamily: "sans-serif", textAlign: "center", padding: "16px 0" }}>—</div>}
                            {col.map(p => (
                                <div key={p.id} onClick={() => setEditPiece(p)} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 8, border: `1px solid ${p.origen === "secuencia" ? G.cyan + "33" : G.border}`, cursor: "pointer", transition: "all 0.15s" }}
                                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
                                    <div style={{ display: "flex", gap: 5, marginBottom: 5, flexWrap: "wrap" }}>
                                        <span style={{ ...css.tag(faseColor(p.fase)), fontSize: 7, padding: "1px 5px" }}>{p.fase}</span>
                                        {p.formato && <span style={{ fontSize: 9 }}>{FORMATO_ICON[p.formato]}</span>}
                                    </div>
                                    <div style={{ fontSize: 11, color: G.white, fontFamily: "sans-serif", fontWeight: 600, lineHeight: 1.3, marginBottom: 4 }}>{p.titulo}</div>
                                    {p.fechaProg && <div style={{ fontSize: 9, color: G.blue }}>📅 {p.fechaProg}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    // ── Vista: CALENDARIO ─────────────────────────────────────────────────────
    const vistaCalendarioJSX = (() => {
        const { y, m } = calMes;
        const primerDia = new Date(y, m, 1).getDay(); // 0=Dom
        const diasEnMes = new Date(y, m + 1, 0).getDate();
        const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

        const byDate = {};
        filtered.forEach(p => {
            if (!p.fechaProg) return;
            if (!byDate[p.fechaProg]) byDate[p.fechaProg] = [];
            byDate[p.fechaProg].push(p);
        });

        const prevMes = () => setCalMes(({ y, m }) => m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 });
        const nextMes = () => setCalMes(({ y, m }) => m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 });

        const cells = [];
        for (let i = 0; i < primerDia; i++) cells.push(null);
        for (let d = 1; d <= diasEnMes; d++) cells.push(d);
        while (cells.length % 7 !== 0) cells.push(null);

        const todayStr = new Date().toISOString().slice(0, 10);

        return (
            <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <button onClick={prevMes} style={{ background: "transparent", border: `1px solid ${G.border}`, borderRadius: 8, color: G.muted, padding: "6px 14px", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13 }}>←</button>
                    <GText g={G.gViolet} size={16} weight={700}>{meses[m]} {y}</GText>
                    <button onClick={nextMes} style={{ background: "transparent", border: `1px solid ${G.border}`, borderRadius: 8, color: G.muted, padding: "6px 14px", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13 }}>→</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
                    {dias.map(d => <div key={d} style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif", textAlign: "center", letterSpacing: 1, textTransform: "uppercase", padding: "4px 0" }}>{d}</div>)}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                    {cells.map((d, i) => {
                        if (!d) return <div key={`e${i}`} />;
                        const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                        const dayPiezas = byDate[dateStr] || [];
                        const isToday = dateStr === todayStr;
                        return (
                            <div key={dateStr} style={{ minHeight: 72, padding: "6px", background: isToday ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.02)", border: `1px solid ${isToday ? G.purpleHi + "44" : G.border}`, borderRadius: 8 }}>
                                <div style={{ fontSize: 10, color: isToday ? G.purpleHi : G.muted, fontFamily: "monospace", fontWeight: isToday ? 800 : 400, marginBottom: 4 }}>{d}</div>
                                {dayPiezas.slice(0, 3).map(p => (
                                    <div key={p.id} onClick={() => setEditPiece(p)} style={{ fontSize: 8, color: G.white, fontFamily: "sans-serif", background: faseColor(p.fase) + "33", border: `1px solid ${faseColor(p.fase)}55`, borderRadius: 4, padding: "2px 5px", marginBottom: 3, cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", transition: "background 0.15s" }}
                                        onMouseEnter={e => e.currentTarget.style.background = faseColor(p.fase) + "66"}
                                        onMouseLeave={e => e.currentTarget.style.background = faseColor(p.fase) + "33"}
                                        title={p.titulo}>
                                        {FORMATO_ICON[p.formato] || "●"} {p.titulo.slice(0, 18)}{p.titulo.length > 18 ? "…" : ""}
                                    </div>
                                ))}
                                {dayPiezas.length > 3 && <div style={{ fontSize: 8, color: G.dimmed, fontFamily: "sans-serif" }}>+{dayPiezas.length - 3} más</div>}
                            </div>
                        );
                    })}
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 16, padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
                    {FASES.map(f => <div key={f} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <div style={{ width: 10, height: 10, borderRadius: 3, background: faseColor(f) + "66", border: `1px solid ${faseColor(f)}88` }} />
                        <span style={{ fontSize: 10, color: G.muted, fontFamily: "sans-serif" }}>{f}</span>
                    </div>)}
                    <span style={{ fontSize: 10, color: G.dimmed, fontFamily: "sans-serif", marginLeft: "auto" }}>{Object.values(byDate).flat().length} de {piezas.filter(p => p.fechaProg).length} piezas visibles</span>
                </div>
            </div>
        );
    })();

    const VISTAS = [
        { id: "lista", icon: "≡", label: "Lista" },
        { id: "cards", icon: "⊞", label: "Cards" },
        { id: "kanban", icon: "▦", label: "Kanban" },
        { id: "calendario", icon: "📅", label: "Calendario" },
    ];

    return (
        <div style={{ padding: "24px 28px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
            {editPiece && <PieceModal piece={editPiece} tareas={tareas} isViewer={isViewer} canEdit={canEdit} canDelete={canDelete} userRole={userRole} onSave={p => { onSave(p); setEditPiece(null); }} onClose={() => setEditPiece(null)} onDelete={canDelete ? (id => { onDelete(id); setEditPiece(null); }) : null} logs={logs} toast={toast} brokerId={brokerId} currentUser={currentUser} onCreateTarea={onCreateTarea} />}

            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                {byFase.map(({ f, total, pub }) => (
                    <div key={f} style={{ ...css.card, flex: 1, padding: "14px 16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                            <span style={css.tag(faseColor(f))}>{f}</span>
                            <GText g={faseGrad(f)} size={16} weight={800}>{pub}/{total}</GText>
                        </div>
                        <PBar val={pct(pub, total)} g={faseGrad(f)} />
                    </div>
                ))}
            </div>

            {proximasAll.length > 0 && (
                <div style={{ ...css.card, padding: "10px 16px", marginBottom: 12, borderColor: G.cyan + "44", background: G.cyan + "06", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13 }}>📅</span>
                    <span style={{ fontSize: 11, color: G.white, fontFamily: "sans-serif", fontWeight: 700 }}>Próximos 7 días ({proximasAll.length})</span>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {ESTADOS_PIEZA.filter(e => proximasPorEstado[e] > 0).map(e => (
                            <span key={e} style={{ fontSize: 10, color: estadoColor(e), fontFamily: "sans-serif", border: `1px solid ${estadoColor(e)}44`, borderRadius: 10, padding: "2px 9px" }}>
                                {proximasPorEstado[e]} {e}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ display: "flex", gap: 6, marginBottom: 14, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: "1 1 180px", minWidth: 140 }}>
                    <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: G.dimmed, fontSize: 12 }}>🔍</span>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar título, hook, copy..." style={{ ...css.input, paddingLeft: 30, fontSize: 11 }} />
                </div>
                <BancoSel val={filterFase} set={setFilterFase} opts={[{ v: "Todas", l: "Fase: Todas" }, ...FASES.map(f => ({ v: f, l: f }))]} />
                <BancoSel val={filterEst} set={setFilterEst} opts={[{ v: "Todos", l: "Estado: Todos" }, ...ESTADOS_PIEZA.map(e => ({ v: e, l: e }))]} />
                <BancoSel val={filterFormato} set={setFilterFormato} opts={[{ v: "Todos", l: "Formato: Todos" }, ...FORMATOS.map(f => ({ v: f, l: f }))]} />
                <BancoSel val={filterOrigen} set={setFilterOrigen} opts={[{ v: "Todos", l: "Origen: Todos" }, { v: "manual", l: "Manual" }, { v: "secuencia", l: "Secuencia" }]} />
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${G.border}`, borderRadius: 8, color: G.purpleHi, fontSize: 11, padding: "6px 10px", fontFamily: "sans-serif", cursor: "pointer" }}>
                    <option value="num">Orden: #</option>
                    <option value="fecha">Orden: Fecha</option>
                </select>
                <div style={{ display: "flex", gap: 2, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: 3, border: `1px solid ${G.border}` }}>
                    {VISTAS.map(v => (
                        <button key={v.id} onClick={() => setVista(v.id)} title={v.label}
                            style={{ background: vista === v.id ? G.purpleDim : "transparent", border: `1px solid ${vista === v.id ? G.borderHi : "transparent"}`, borderRadius: 6, color: vista === v.id ? G.purpleHi : G.muted, fontSize: 13, padding: "4px 9px", cursor: "pointer", transition: "all 0.15s" }}>
                            {v.icon}
                        </button>
                    ))}
                </div>
                <span style={{ fontSize: 10, color: G.dimmed, fontFamily: "sans-serif" }}>{filtered.length} piezas</span>
                {!isViewer && (
                    <div style={{ display: "flex", gap: 6 }}>
                        {canImport && (
                            <>
                                <button 
                                    onClick={() => {
                                        const template = `Genera un JSON con esta estructura (puedes hacer hasta 20 o 40 publicaciones):
[
  {
    "titulo": "Título de la pieza",
    "fase": "Atracción",
    "formato": "Reel",
    "fechaProg": "YYYY-MM-DD",
    "hook": "El gancho...",
    "copy": "El copy completo...",
    "guion": "Estructura del vídeo...",
    "instrucciones": "Notas de edición...",
    "notasInternas": ""
  }
]`;
                                        navigator.clipboard.writeText(template);
                                        toast("Formato copiado. Pégalo en Claude.");
                                    }} 
                                    style={{ ...css.btn(), background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}`, fontSize: 11 }}
                                    title="Copiar formato para Claude"
                                >
                                    📋 Formato
                                </button>
                                <button 
                                    onClick={() => document.getElementById('import-json').click()} 
                                    style={{ ...css.btn(), background: "rgba(255,255,255,0.05)", border: `1px solid ${G.border}`, fontSize: 11 }}
                                >
                                    📥 Importar
                                </button>
                                <input 
                                    id="import-json" 
                                    type="file" 
                                    accept=".json" 
                                    style={{ display: "none" }} 
                                    onChange={e => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onload = (evt) => {
                                            try {
                                                const data = JSON.parse(evt.target.result);
                                                if (!Array.isArray(data)) throw new Error("Debe ser un array de objetos");
                                                onImport(data);
                                                e.target.value = ""; // Reset
                                            } catch (err) {
                                                toast("Error al leer JSON: " + err.message, "error");
                                            }
                                        };
                                        reader.readAsText(file);
                                    }}
                                />
                            </>
                        )}
                        <button onClick={() => setShowForm(v => !v)} style={{ ...css.btn(showForm ? undefined : G.gMagenta), fontSize: 11 }}>{showForm ? "Cancelar" : "+ Nueva pieza"}</button>
                    </div>
                )}
            </div>

            {showForm && (
                <div style={{ ...css.cardGlow, padding: 16, marginBottom: 16 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                        {[{ k: "titulo", l: "Título" }, { k: "hook", l: "Hook" }, { k: "avatar", l: "Avatar" }, { k: "ctaDm", l: "CTA DM" }].map(({ k, l }) => (
                            <div key={k}><label style={css.label}>{l}</label><input value={form[k] || ""} onChange={e => setForm({ ...form, [k]: e.target.value })} placeholder={l + "..."} style={css.input} /></div>
                        ))}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
                        <div><label style={css.label}>Fase</label>
                            <select value={form.fase} onChange={e => setForm({ ...form, fase: e.target.value })} style={{ ...css.input, color: faseColor(form.fase) }}>
                                {FASES.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                        <div><label style={css.label}>Formato</label>
                            <select value={form.formato || ""} onChange={e => setForm({ ...form, formato: e.target.value })} style={{ ...css.input, color: G.purpleHi }}>
                                <option value="">Sin definir</option>
                                {FORMATOS.map(f => <option key={f} value={f}>{FORMATO_ICON[f]} {f}</option>)}
                            </select>
                        </div>
                        <div><label style={css.label}>Fecha programada</label>
                            <input type="date" value={form.fechaProg || ""} onChange={e => setForm({ ...form, fechaProg: e.target.value })} style={{ ...css.input, colorScheme: "dark" }} />
                        </div>
                        <button onClick={() => { if (form.titulo.trim()) { onAdd({ ...form, id: uid(), num: piezas.length + 1, estado: "En cola", copy: "", guion: "", instrucciones: "", notasInternas: "", linkRecursos: "", linkFinal: "", linkEvidencia: "", origen: "manual", origenRef: null, anotaciones: [] }); setShowForm(false); setForm({ fase: "Atracción", avatar: "", dolor: "", titulo: "", hook: "", ctaDm: "", formato: "", fechaProg: "" }); } }} style={{ ...css.btn(G.gGreen) }}>+ Agregar</button>
                    </div>
                </div>
            )}

            {vista === "lista" && vistaListaJSX}
            {vista === "cards" && vistaCardsJSX}
            {vista === "kanban" && vistaKanbanJSX}
            {vista === "calendario" && vistaCalendarioJSX}
            {selectedIds.length > 0 && (
                <div style={{ 
                    position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", 
                    background: "#121232", border: `1px solid ${G.purple}`, borderRadius: 12, 
                    padding: "12px 20px", display: "flex", alignItems: "center", gap: 16, 
                    boxShadow: "0 10px 40px rgba(0,0,0,0.5)", zIndex: 1000,
                    animation: "slideUp 0.3s ease-out"
                }}>
                    <style>{`
                        @keyframes slideUp { from { transform: translate(-50%, 40px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
                    `}</style>
                    <span style={{ fontSize: 12, color: G.white, fontWeight: 600 }}>{selectedIds.length} seleccionados</span>
                    <div style={{ width: 1, height: 24, background: G.border }}></div>
                    
                    <div style={{ display: "flex", gap: 8 }}>
                        <select 
                            onChange={(e) => {
                                if (!e.target.value) return;
                                onBulkUpdate(selectedIds, { estado: e.target.value });
                                setSelectedIds([]);
                                e.target.value = "";
                            }}
                            style={{ ...css.input, width: "auto", fontSize: 11, padding: "5px 10px" }}
                        >
                            <option value="">Cambiar Estado...</option>
                            {ESTADOS_PIEZA.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>

                        <select 
                            onChange={(e) => {
                                if (!e.target.value) return;
                                onBulkUpdate(selectedIds, { fase: e.target.value });
                                setSelectedIds([]);
                                e.target.value = "";
                            }}
                            style={{ ...css.input, width: "auto", fontSize: 11, padding: "5px 10px" }}
                        >
                            <option value="">Cambiar Fase...</option>
                            {FASES.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>

                        {canDelete && (
                            <button 
                                onClick={() => {
                                    onBulkDelete(selectedIds);
                                    setSelectedIds([]);
                                }}
                                style={{ ...css.btn(G.red), padding: "6px 14px", fontSize: 11 }}
                            >
                                🗑️ Eliminar
                            </button>
                        )}
                        
                        <button 
                            onClick={() => setSelectedIds([])}
                            style={{ ...css.btn("rgba(255,255,255,0.1)"), padding: "6px 14px", fontSize: 11 }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

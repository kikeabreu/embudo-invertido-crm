"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { createBrokerAction, deleteBrokerAction } from "@/app/actions/adminActions";
import { G, css, ESTADOS_PIEZA, FORMATOS, FORMATO_META, estadoColor } from "@/lib/constants";
import { GText } from "@/components/ui/UIUtils";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useToast, Toasts } from "@/components/ui/Toast";
import { formatOperationalDate, getClientOperation, pieceMatchesOperationalView } from "@/lib/operations";

function AdminCreateModal({ onClose, onSuccess, brokers }) {
    const [loading, setLoading] = useState(false);
    const { toasts, show: toast } = useToast();

    const [form, setForm] = useState({
        nombre: "",
        email: "",
        password: "",
        precio_pactado: "",
        fecha_corte: "",
        fecha_contratacion: "",
        piezas_comprometidas: 12,
        rol: "Broker",
        parent_id: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        Object.entries(form).forEach(([key, val]) => formData.append(key, val));

        const result = await createBrokerAction(formData);

        if (result?.error) {
            toast(result.error, "error");
            setLoading(false);
        } else {
            toast("Agencia / Broker creado", "success");
            onSuccess();
        }
    };

    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
            <Toasts toasts={toasts} />
            <div style={{ ...css.card, padding: 30, width: 400 }}>
                <div style={{ fontSize: 18, color: G.white, fontFamily: "Georgia,serif", marginBottom: 20 }}>Agregar Nuevo Cliente (Broker)</div>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                    <div>
                        <label style={css.label}>Nombre completo o Agencia</label>
                        <input required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} style={css.input} placeholder="Juan Pérez" />
                    </div>
                    <div>
                        <label style={css.label}>Correo (Para Iniciar Sesión)</label>
                        <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={css.input} placeholder="juan@agencia.com" />
                    </div>
                    <div>
                        <label style={css.label}>Contraseña Temporal</label>
                        <input required type="text" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={css.input} placeholder="Minimo 6 caracteres" />
                    </div>
                    <div>
                        <label style={css.label}>Tipo de Cuenta</label>
                        <select value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })} style={css.input}>
                            <option value="Broker">Cliente (Broker)</option>
                            <option value="Equipo">Miembro del Equipo (Top Seller)</option>
                            <option value="Coordinador">Coordinador (Acceso a cliente)</option>
                        </select>
                    </div>
                    {form.rol === 'Coordinador' && (
                        <div>
                            <label style={css.label}>Vincular a Cliente (Broker)</label>
                            <select required value={form.parent_id} onChange={e => setForm({ ...form, parent_id: e.target.value })} style={css.input}>
                                <option value="">Selecciona un cliente...</option>
                                {brokers?.filter(b => b.rol === 'Broker').map(b => (
                                    <option key={b.id} value={b.id}>{b.nombre || b.email}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {form.rol === 'Broker' && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            <div>
                                <label style={css.label}>Precio Pactado ($)</label>
                                <input type="number" step="0.01" value={form.precio_pactado} onChange={e => setForm({ ...form, precio_pactado: e.target.value })} style={css.input} placeholder="500.00" />
                            </div>
                            <div>
                                <label style={css.label}>Corte de pago</label>
                                <input type="date" value={form.fecha_corte} onChange={e => setForm({ ...form, fecha_corte: e.target.value })} style={{ ...css.input, colorScheme: "light" }} />
                            </div>
                            <div>
                                <label style={css.label}>Inicio del contrato</label>
                                <input type="date" value={form.fecha_contratacion} onChange={e => setForm({ ...form, fecha_contratacion: e.target.value })} style={{ ...css.input, colorScheme: "light" }} />
                            </div>
                            <div>
                                <label style={css.label}>Piezas por ciclo</label>
                                <input type="number" min="0" value={form.piezas_comprometidas} onChange={e => setForm({ ...form, piezas_comprometidas: e.target.value })} style={css.input} />
                            </div>
                        </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                        <button type="button" onClick={onClose} disabled={loading} style={{ background: "transparent", color: G.muted, border: "none", cursor: "pointer", fontSize: 13 }}>Cancelar</button>
                        <button type="submit" disabled={loading} style={css.btn(G.gPurple)}>{loading ? "Creando..." : "Crear Cuenta"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function BrokerList({ brokers, onSelect, onShowCreate, onDelete, isAdmin, isEditor }) {
    return (
        <div style={{ background: G.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
            <div style={{ width: "100%", maxWidth: 580 }}>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <div style={{ width: 64, height: 64, background: G.gPurple, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28, boxShadow: "0 16px 40px rgba(15,23,42,0.08)" }}>▼</div>
                    <GText g={G.gMagenta} size={10} weight={600} style={{ letterSpacing: 4, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Agencia Top Seller</GText>
                    <div style={{ fontSize: 26, color: G.white, fontFamily: "Georgia,serif", marginBottom: 6 }}>Embudo Invertido™</div>
                    <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", letterSpacing: 1 }}>{isAdmin ? "Panel de gestión de clientes" : isEditor ? "Clientes asignados a tu operación" : "Selecciona tu cuenta de Broker"}</div>
                </div>

                {brokers.length === 0 && <div style={{ ...css.card, padding: "20px", textAlign: "center", color: G.dimmed, fontFamily: "sans-serif", fontSize: 12, marginBottom: 16, borderStyle: "dashed" }}>{isEditor ? "Todavía no tienes clientes asignados. El administrador debe asignarlos desde este panel." : "Aún no hay clientes registrados."}</div>}

                {brokers.map(b => (
                    <div key={b.id} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                        <button onClick={() => onSelect(b.id)} style={{ flex: 1, ...css.card, border: `1px solid ${G.border}`, padding: "14px 20px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <div style={{ fontSize: 14, color: G.white, fontFamily: "Georgia,serif" }}>{b.nombre || b.email}</div>
                                <div style={{ fontSize: 10, color: G.muted, fontFamily: "sans-serif", marginTop: 2 }}>{b.rol || "Broker"} • Pago: {b.estado_pago || 'Pendiente'}</div>
                            </div>
                            <GText g={G.gViolet} size={11}>Abrir Embudo →</GText>
                        </button>
                        {isAdmin && b.rol !== 'Admin' && (
                            <button onClick={() => onDelete(b.id, b.nombre || b.email)} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "14px 12px", cursor: "pointer", color: G.red, fontSize: 12 }} title="Eliminar Cliente">✕</button>
                        )}
                    </div>
                ))}

                {isAdmin && (
                    <button onClick={onShowCreate} style={{ ...css.btn(G.gCyan), width: "100%", marginTop: 20, padding: 14, borderRadius: 12, fontSize: 14 }}>
                        + Agregar Nuevo Cliente (Broker)
                    </button>
                )}
            </div>
        </div>
    );
}

const cleanText = (value = "", limit = 130) => {
    const clean = String(value || "").replace(/\s+/g, " ").trim();
    if (!clean) return "";
    return clean.length > limit ? clean.slice(0, limit).trim() + "..." : clean;
};

const getFormatoMeta = (formato) => FORMATO_META[formato] || { label: formato || "Sin formato", short: "TIPO", tone: G.muted, bg: "#F3F4F6" };

function FormatBadge({ formato }) {
    const meta = getFormatoMeta(formato);
    return (
        <span style={{ background: meta.bg, color: meta.tone, border: `1px solid ${meta.tone}44`, borderRadius: 7, padding: "4px 8px", fontSize: 9, fontFamily: "Gilroy, sans-serif", fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            {meta.short}
        </span>
    );
}

function GeneralOperationsPanel({ piezas, brokers, onOpenPiece }) {
    const [viewMode, setViewMode] = useState("month");
    const [brokerFilter, setBrokerFilter] = useState("Todos");
    const [estadoFilter, setEstadoFilter] = useState("Todos");
    const [formatoFilter, setFormatoFilter] = useState("Todos");
    const [search, setSearch] = useState("");

    const brokerName = (id) => brokers.find(b => b.id === id)?.nombre || brokers.find(b => b.id === id)?.email || "Cliente";
    const brokerById = (id) => brokers.find(b => b.id === id);

    const operations = brokers
        .filter(client => brokerFilter === "Todos" || client.id === brokerFilter)
        .map(client => ({ client, ...getClientOperation(client, piezas) }))
        .sort((a, b) => {
            const weight = { "Crítico": 0, "Atención": 1, "En curso": 2, "Sin ciclo": 3, "Sin meta": 4, "Al día": 5 };
            return (weight[a.risk] ?? 9) - (weight[b.risk] ?? 9);
        });

    const filtered = piezas
        .filter(p => brokerFilter === "Todos" || p.broker_id === brokerFilter)
        .filter(p => {
            const client = brokerById(p.broker_id);
            return client ? pieceMatchesOperationalView(p, client, viewMode) : false;
        })
        .filter(p => estadoFilter === "Todos" || p.estado === estadoFilter)
        .filter(p => formatoFilter === "Todos" || p.formato === formatoFilter)
        .filter(p => {
            if (!search.trim()) return true;
            const q = search.toLowerCase();
            return [p.titulo, p.hook, p.cuerpo, p.guion, brokerName(p.broker_id)].some(v => String(v || "").toLowerCase().includes(q));
        })
        .sort((a, b) => {
            if (!a.fecha_prog && !b.fecha_prog) return (a.titulo || "").localeCompare(b.titulo || "");
            if (!a.fecha_prog) return 1;
            if (!b.fecha_prog) return -1;
            return a.fecha_prog.localeCompare(b.fecha_prog);
        });

    const proximas = filtered.filter(p => p.fecha_prog).slice(0, 12);
    const pendientes = filtered.filter(p => ["En cola", "Producción", "Aprobado", "Programado"].includes(p.estado)).length;
    const publicadas = filtered.filter(p => p.estado === "Publicado").length;
    const clientesEnRiesgo = operations.filter(op => op.risk === "Crítico" || op.risk === "Atención").length;

    return (
        <section style={{ padding: "28px 32px 8px" }}>
            <div style={{ maxWidth: 1500, margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "flex-end", marginBottom: 16, flexWrap: "wrap" }}>
                    <div>
                        <div style={{ fontSize: 11, color: G.naranja, fontFamily: "Gilroy, sans-serif", fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6 }}>Panel general</div>
                        <h1 style={{ margin: 0, color: G.white, fontFamily: "Gilroy, sans-serif", fontSize: 26, letterSpacing: 0 }}>Logística de clientes</h1>
                        <div style={{ color: G.muted, fontFamily: "sans-serif", fontSize: 13, marginTop: 5 }}>Control diario, semanal y por ciclo contractual de cada cliente.</div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(110px, 1fr))", gap: 10, minWidth: 520 }}>
                        {[
                            ["En ventana", filtered.length],
                            ["Por cerrar", pendientes],
                            ["Publicadas", publicadas],
                            ["Clientes en riesgo", clientesEnRiesgo],
                        ].map(([label, value]) => (
                            <div key={label} style={{ ...css.card, padding: "12px 14px" }}>
                                <div style={{ color: G.white, fontSize: 20, fontWeight: 900, fontFamily: "Gilroy, sans-serif" }}>{value}</div>
                                <div style={{ color: G.muted, fontSize: 10, fontWeight: 800, fontFamily: "Gilroy, sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ ...css.card, padding: 14, marginBottom: 12 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                        <div style={{ display: "flex", padding: 3, background: "#F1F3F3", borderRadius: 7, border: `1px solid ${G.border}` }}>
                            {[{ id: "today", label: "Hoy" }, { id: "week", label: "Semana" }, { id: "month", label: "Mes operativo" }].map(option => (
                                <button key={option.id} type="button" onClick={() => setViewMode(option.id)} style={{ border: "none", borderRadius: 5, padding: "7px 11px", background: viewMode === option.id ? "#FFFFFF" : "transparent", color: viewMode === option.id ? G.purple : G.muted, boxShadow: viewMode === option.id ? "0 1px 4px rgba(8,16,16,0.10)" : "none", fontFamily: "Gilroy, sans-serif", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>
                                    {option.label}
                                </button>
                            ))}
                        </div>
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar cliente, título, hook o copy..." style={{ ...css.input, flex: "1 1 260px", minWidth: 220 }} />
                        <select value={brokerFilter} onChange={e => setBrokerFilter(e.target.value)} style={{ ...css.input, width: "auto", minWidth: 190 }}>
                            <option value="Todos">Todos los clientes</option>
                            {brokers.map(b => <option key={b.id} value={b.id}>{b.nombre || b.email}</option>)}
                        </select>
                        <select value={estadoFilter} onChange={e => setEstadoFilter(e.target.value)} style={{ ...css.input, width: "auto", minWidth: 160 }}>
                            <option value="Todos">Todos los estados</option>
                            {ESTADOS_PIEZA.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                        <select value={formatoFilter} onChange={e => setFormatoFilter(e.target.value)} style={{ ...css.input, width: "auto", minWidth: 160 }}>
                            <option value="Todos">Todos los formatos</option>
                            {FORMATOS.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                    </div>
                </div>

                <div style={{ ...css.card, overflow: "hidden", marginBottom: 14 }}>
                    <div style={{ padding: "14px 16px", borderBottom: `1px solid ${G.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <div>
                            <div style={{ color: G.white, fontFamily: "Gilroy, sans-serif", fontSize: 14, fontWeight: 900 }}>Cierre del ciclo por cliente</div>
                            <div style={{ color: G.muted, fontFamily: "sans-serif", fontSize: 11, marginTop: 3 }}>Cada fila usa la fecha de contratación y la meta mensual configurada en Admin.</div>
                        </div>
                        <span style={{ color: G.muted, fontFamily: "monospace", fontSize: 11 }}>{operations.length} clientes</span>
                    </div>
                    <div style={{ overflowX: "auto" }}>
                        <div style={{ minWidth: 980 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1.1fr 90px 90px 90px 120px 1.4fr", gap: 12, padding: "9px 16px", background: "#F7F9F9", borderBottom: `1px solid ${G.border}`, color: G.muted, fontFamily: "Gilroy, sans-serif", fontSize: 9, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                <span>Cliente</span><span>Ciclo vigente</span><span>Meta</span><span>Publicadas</span><span>Avance</span><span>Riesgo</span><span>Próxima acción</span>
                            </div>
                            {operations.map(op => (
                                <button key={op.client.id} type="button" onClick={() => onOpenPiece({ broker_id: op.client.id })} style={{ width: "100%", display: "grid", gridTemplateColumns: "1.25fr 1.1fr 90px 90px 90px 120px 1.4fr", gap: 12, alignItems: "center", padding: "12px 16px", border: "none", borderBottom: `1px solid ${G.border}`, background: "#FFFFFF", textAlign: "left", cursor: "pointer" }}>
                                    <span>
                                        <span style={{ display: "block", color: G.white, fontFamily: "Gilroy, sans-serif", fontSize: 12, fontWeight: 900 }}>{op.client.nombre || op.client.email}</span>
                                        <span style={{ display: "block", color: G.muted, fontFamily: "sans-serif", fontSize: 10, marginTop: 2 }}>{op.cycle.daysRemaining} días para cerrar</span>
                                    </span>
                                    <span style={{ color: G.muted, fontFamily: "monospace", fontSize: 10 }}>{formatOperationalDate(op.cycle.start, { year: false })} - {formatOperationalDate(op.cycle.end)}</span>
                                    <span style={{ color: G.white, fontFamily: "monospace", fontSize: 13, fontWeight: 800 }}>{op.committed}</span>
                                    <span style={{ color: G.green, fontFamily: "monospace", fontSize: 13, fontWeight: 800 }}>{op.published}</span>
                                    <span style={{ color: G.white, fontFamily: "monospace", fontSize: 13, fontWeight: 900 }}>{op.progress}%</span>
                                    <span style={{ justifySelf: "start", color: op.riskTone, background: `${op.riskTone}12`, border: `1px solid ${op.riskTone}55`, borderRadius: 6, padding: "4px 7px", fontFamily: "Gilroy, sans-serif", fontSize: 9, fontWeight: 900, textTransform: "uppercase" }}>{op.risk}</span>
                                    <span style={{ color: G.muted, fontFamily: "sans-serif", fontSize: 11, lineHeight: 1.35 }}>{op.nextAction}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(320px, 0.65fr)", gap: 14, alignItems: "start" }}>
                    <div style={{ ...css.card, overflow: "hidden" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "150px 90px 110px 1fr 110px", gap: 10, padding: "10px 14px", background: "#F7F9F9", borderBottom: `1px solid ${G.border}`, color: G.muted, fontSize: 9, fontFamily: "Gilroy, sans-serif", fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                            <span>Cliente</span><span>Tipo</span><span>Estado</span><span>Pieza</span><span>Fecha</span>
                        </div>
                        <div style={{ maxHeight: 430, overflowY: "auto" }}>
                            {filtered.length === 0 && <div style={{ padding: 28, color: G.dimmed, fontFamily: "sans-serif", fontSize: 13, textAlign: "center" }}>No hay piezas con esos filtros.</div>}
                            {filtered.slice(0, 80).map(p => {
                                const summary = cleanText(p.cuerpo || p.guion || p.instrucciones || p.hook || "", 105);
                                return (
                                    <button key={p.id} onClick={() => onOpenPiece(p)} style={{ width: "100%", display: "grid", gridTemplateColumns: "150px 90px 110px 1fr 110px", gap: 10, alignItems: "center", padding: "12px 14px", border: "none", borderBottom: `1px solid ${G.border}`, background: "transparent", textAlign: "left", cursor: "pointer" }}>
                                        <span style={{ color: G.white, fontSize: 12, fontFamily: "Gilroy, sans-serif", fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{brokerName(p.broker_id)}</span>
                                        <FormatBadge formato={p.formato} />
                                        <span style={{ color: estadoColor(p.estado), border: `1px solid ${estadoColor(p.estado)}44`, borderRadius: 6, padding: "4px 7px", fontSize: 9, fontFamily: "Gilroy, sans-serif", fontWeight: 900, textTransform: "uppercase", textAlign: "center" }}>{p.estado || "En cola"}</span>
                                        <span>
                                            <span style={{ display: "block", color: G.white, fontSize: 13, fontFamily: "sans-serif", fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.titulo || "Sin título"}</span>
                                            <span style={{ display: "block", color: G.muted, fontSize: 11, fontFamily: "sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>{summary || cleanText(p.hook, 105) || "Sin resumen"}</span>
                                        </span>
                                        <span style={{ color: p.fecha_prog ? G.blue : G.dimmed, fontSize: 11, fontFamily: "monospace" }}>{p.fecha_prog || "Sin fecha"}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <aside style={{ ...css.card, padding: 16 }}>
                        <div style={{ fontSize: 11, color: G.white, fontFamily: "Gilroy, sans-serif", fontWeight: 900, marginBottom: 12 }}>Publicaciones en la ventana</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 430, overflowY: "auto" }}>
                            {proximas.length === 0 && <div style={{ color: G.dimmed, fontFamily: "sans-serif", fontSize: 12 }}>No hay publicaciones fechadas con estos filtros.</div>}
                            {proximas.map(p => {
                                const meta = getFormatoMeta(p.formato);
                                return (
                                    <button key={p.id} onClick={() => onOpenPiece(p)} style={{ border: `1px solid ${G.border}`, background: "#FFFFFF", borderRadius: 10, padding: 10, textAlign: "left", cursor: "pointer" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 7 }}>
                                            <span style={{ color: G.blue, fontFamily: "monospace", fontSize: 11, fontWeight: 800 }}>{p.fecha_prog}</span>
                                            <span style={{ color: meta.tone, background: meta.bg, borderRadius: 6, padding: "2px 6px", fontFamily: "Gilroy, sans-serif", fontSize: 8, fontWeight: 900 }}>{meta.short}</span>
                                        </div>
                                        <div style={{ color: G.white, fontFamily: "sans-serif", fontSize: 12, fontWeight: 800, lineHeight: 1.25 }}>{cleanText(p.titulo, 58)}</div>
                                        <div style={{ color: G.muted, fontFamily: "sans-serif", fontSize: 10, marginTop: 4 }}>{brokerName(p.broker_id)}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}

function EditorAssignmentsPanel({ editors, brokers, assignments, onToggle, savingKey, setupError }) {
    const [selectedEditor, setSelectedEditor] = useState("");
    const selectedEditorId = editors.some(editor => editor.id === selectedEditor) ? selectedEditor : editors[0]?.id || "";
    const selected = editors.find(editor => editor.id === selectedEditorId);
    const assignedIds = new Set(assignments.filter(item => item.editor_id === selectedEditorId).map(item => item.broker_id));

    return (
        <section style={{ padding: "8px 32px" }}>
            <div style={{ maxWidth: 1500, margin: "0 auto", ...css.card, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 18, marginBottom: 16, flexWrap: "wrap" }}>
                    <div>
                        <div style={{ color: G.white, fontFamily: "Gilroy, sans-serif", fontSize: 15, fontWeight: 900 }}>Asignación de editores</div>
                        <div style={{ color: G.muted, fontFamily: "sans-serif", fontSize: 12, marginTop: 4 }}>Aquí decides qué clientes puede ver y operar cada miembro del equipo.</div>
                    </div>
                    <select value={selectedEditorId} onChange={e => setSelectedEditor(e.target.value)} style={{ ...css.input, width: "auto", minWidth: 240 }}>
                        {editors.length === 0 && <option value="">No hay editores registrados</option>}
                        {editors.map(editor => <option key={editor.id} value={editor.id}>{editor.nombre || editor.email}</option>)}
                    </select>
                </div>

                {setupError && <div style={{ padding: "10px 12px", background: "#FFF7E8", border: "1px solid #E9A23B55", borderRadius: 7, color: "#9A6700", fontFamily: "sans-serif", fontSize: 12, marginBottom: 14 }}>Falta activar la migración de operación en Supabase. Sigue el archivo de instrucciones incluido en el proyecto.</div>}

                {!setupError && selected && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 8 }}>
                        {brokers.map(client => {
                            const checked = assignedIds.has(client.id);
                            const key = `${selectedEditorId}:${client.id}`;
                            return (
                                <label key={client.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", border: `1px solid ${checked ? G.borderHi : G.border}`, borderRadius: 7, background: checked ? "#F1EFFC" : "#FFFFFF", cursor: savingKey === key ? "wait" : "pointer" }}>
                                    <input type="checkbox" checked={checked} disabled={savingKey === key} onChange={() => onToggle(selectedEditorId, client.id, checked)} style={{ width: 16, height: 16, accentColor: G.purple }} />
                                    <span style={{ minWidth: 0 }}>
                                        <span style={{ display: "block", color: G.white, fontFamily: "Gilroy, sans-serif", fontSize: 12, fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{client.nombre || client.email}</span>
                                        <span style={{ display: "block", color: checked ? G.purple : G.muted, fontFamily: "sans-serif", fontSize: 10, marginTop: 2 }}>{checked ? "Asignado" : "Sin asignar"}</span>
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}

function EditorProductivityOverview({ editors, assignments, tasks }) {
    const todayKey = new Date().toISOString().slice(0, 10);
    const completedStates = new Set(["Hecho", "Aprobado", "Revisión Cliente"]);

    const rows = editors.map(editor => {
        const editorTasks = tasks.filter(task => task.asignado_a === editor.id);
        const completed = editorTasks.filter(task => completedStates.has(task.estado));
        const active = editorTasks.filter(task => !completedStates.has(task.estado));
        const overdue = active.filter(task => task.fecha_limite && task.fecha_limite < todayKey).length;
        const points = completed.reduce((total, task) => total + (Number(task.puntos_esfuerzo) || 1), 0);
        const durations = completed
            .filter(task => task.fecha_inicio && task.fecha_fin)
            .map(task => (new Date(task.fecha_fin) - new Date(task.fecha_inicio)) / 3600000)
            .filter(hours => Number.isFinite(hours) && hours >= 0);
        const avgHours = durations.length ? Math.round(durations.reduce((sum, hours) => sum + hours, 0) / durations.length) : null;
        const clients = assignments.filter(item => item.editor_id === editor.id).length;
        return { editor, active: active.length, overdue, points, avgHours, clients };
    });

    return (
        <section style={{ padding: "8px 32px 24px" }}>
            <div style={{ maxWidth: 1500, margin: "0 auto", ...css.card, overflow: "hidden" }}>
                <div style={{ padding: "14px 16px", borderBottom: `1px solid ${G.border}` }}>
                    <div style={{ color: G.white, fontFamily: "Gilroy, sans-serif", fontSize: 15, fontWeight: 900 }}>Productividad global del equipo</div>
                    <div style={{ color: G.muted, fontFamily: "sans-serif", fontSize: 11, marginTop: 3 }}>Comparativo exclusivo para Admin; suma el trabajo de todos los clientes.</div>
                </div>
                <div style={{ overflowX: "auto" }}>
                    <div style={{ minWidth: 760 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(5, minmax(90px, 1fr))", gap: 12, padding: "9px 16px", background: "#F7F9F9", borderBottom: `1px solid ${G.border}`, color: G.muted, fontFamily: "Gilroy, sans-serif", fontSize: 9, fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                            <span>Editor</span><span>Clientes</span><span>Activas</span><span>Vencidas</span><span>Puntos terminados</span><span>Tiempo promedio</span>
                        </div>
                        {rows.length === 0 && <div style={{ padding: 20, color: G.dimmed, fontFamily: "sans-serif", fontSize: 12 }}>No hay miembros con rol Equipo.</div>}
                        {rows.map(row => (
                            <div key={row.editor.id} style={{ display: "grid", gridTemplateColumns: "1.5fr repeat(5, minmax(90px, 1fr))", gap: 12, alignItems: "center", padding: "12px 16px", borderBottom: `1px solid ${G.border}` }}>
                                <span style={{ color: G.white, fontFamily: "Gilroy, sans-serif", fontSize: 12, fontWeight: 900 }}>{row.editor.nombre || row.editor.email}</span>
                                <span style={{ color: G.white, fontFamily: "monospace", fontSize: 12 }}>{row.clients}</span>
                                <span style={{ color: G.purple, fontFamily: "monospace", fontSize: 12, fontWeight: 800 }}>{row.active}</span>
                                <span style={{ color: row.overdue ? G.red : G.muted, fontFamily: "monospace", fontSize: 12, fontWeight: row.overdue ? 900 : 500 }}>{row.overdue}</span>
                                <span style={{ color: G.green, fontFamily: "monospace", fontSize: 12, fontWeight: 900 }}>{row.points}</span>
                                <span style={{ color: G.muted, fontFamily: "monospace", fontSize: 11 }}>{row.avgHours === null ? "Sin datos" : `${row.avgHours} h`}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function DashboardHome() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [brokers, setBrokers] = useState([]);
    const [allPiezas, setAllPiezas] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [editors, setEditors] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [assignmentSetupError, setAssignmentSetupError] = useState(false);
    const [savingAssignment, setSavingAssignment] = useState("");
    const [showModal, setShowModal] = useState(false);

    const { confirm, ConfirmUI } = useConfirm();
    const { toasts, show: toast } = useToast();

    async function loadData() {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push("/");
            return;
        }

        const { data: profile } = await supabase.from('usuarios').select('*').eq('id', session.user.id).single();
        setUser({ ...session.user, ...profile });

        let visibleUsers = [];
        let currentAssignments = [];
        setAssignmentSetupError(false);

        if (profile?.rol === 'Admin') {
            const { data: userList } = await supabase.from('usuarios').select('*').order('created_at', { ascending: false });
            visibleUsers = userList || [];
            setEditors(visibleUsers.filter(item => item.rol === 'Equipo'));

            const { data: assignmentRows, error: assignmentError } = await supabase.from('editor_clientes').select('*');
            if (assignmentError) setAssignmentSetupError(true);
            currentAssignments = assignmentRows || [];
            const { data: taskRows } = await supabase.from('tareas').select('id, asignado_a, estado, puntos_esfuerzo, fecha_inicio, fecha_fin, fecha_limite');
            setAllTasks(taskRows || []);
        } else if (profile?.rol === 'Equipo') {
            const { data: assignmentRows, error: assignmentError } = await supabase.from('editor_clientes').select('*').eq('editor_id', session.user.id);
            if (assignmentError) {
                setAssignmentSetupError(true);
            } else {
                currentAssignments = assignmentRows || [];
                const brokerIds = currentAssignments.map(item => item.broker_id);
                if (brokerIds.length > 0) {
                    const { data: assignedClients } = await supabase.from('usuarios').select('*').in('id', brokerIds).order('created_at', { ascending: false });
                    visibleUsers = assignedClients || [];
                }
            }
            setEditors([]);
            setAllTasks([]);
        } else {
            const { data: ownProfile } = await supabase.from('usuarios').select('*').eq('id', session.user.id);
            visibleUsers = ownProfile || [];
            setEditors([]);
            setAllTasks([]);
        }

        setAssignments(currentAssignments);
        const onlyBrokers = visibleUsers.filter(b => b.rol === 'Broker');
        setBrokers(onlyBrokers);
        if (profile?.rol === 'Admin' || profile?.rol === 'Equipo') {
            const brokerIds = onlyBrokers.map(b => b.id);
            if (brokerIds.length > 0) {
                const { data: piezasData } = await supabase.from('piezas_banco').select('*').in('broker_id', brokerIds);
                setAllPiezas(piezasData || []);
            } else {
                setAllPiezas([]);
            }
        } else {
            setAllPiezas([]);
        }

        // Auto-redirección para roles que no deben ver la lista
        if (profile?.rol === 'Broker') {
            router.push(`/dashboard/broker/${profile.id}`);
        } else if (profile?.rol === 'Coordinador' && profile.parent_id) {
            router.push(`/dashboard/broker/${profile.parent_id}`);
        }

        setLoading(false);
    }

    useEffect(() => {
        loadData();
        // La carga inicial depende de la sesión, no de estado editable de esta vista.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleEditorAssignment = async (editorId, brokerId, isAssigned) => {
        const key = `${editorId}:${brokerId}`;
        setSavingAssignment(key);
        const query = supabase.from('editor_clientes');
        const { data, error } = isAssigned
            ? await query.delete().eq('editor_id', editorId).eq('broker_id', brokerId).select()
            : await query.insert({ editor_id: editorId, broker_id: brokerId }).select().single();

        if (error) {
            toast("No se pudo actualizar la asignación", "error");
        } else if (isAssigned) {
            setAssignments(prev => prev.filter(item => !(item.editor_id === editorId && item.broker_id === brokerId)));
            toast("Cliente retirado del editor", "success");
        } else {
            setAssignments(prev => [...prev, data]);
            toast("Cliente asignado al editor", "success");
        }
        setSavingAssignment("");
    };

    const handleDeleteBroker = async (id, name) => {
        const ok = await confirm(`¿Eliminar definitivamente a "${name}"?`, `Se borrará toda su cuenta, accesos, historial y piezas generadas.`, "Sí, eliminar");
        if (!ok) return;

        const result = await deleteBrokerAction(id);
        if (result?.error) {
            toast(result.error, "error");
        } else {
            toast("Cliente eliminado", "success");
            loadData();
        }
    };

    if (loading) return <div style={{ padding: 40, textAlign: "center", color: G.dimmed, fontFamily: "sans-serif", fontSize: 11, letterSpacing: 2 }}>CARGANDO...</div>;

    return (
        <div style={{ height: "100%", overflowY: "auto", position: "relative" }}>
            <Toasts toasts={toasts} />
            {ConfirmUI}

            {(user?.rol === 'Admin' || user?.rol === 'Equipo') && (
                <GeneralOperationsPanel
                    piezas={allPiezas}
                    brokers={brokers}
                    onOpenPiece={(pieza) => router.push(pieza.id ? `/dashboard/broker/${pieza.broker_id}?tab=banco&piece=${pieza.id}` : `/dashboard/broker/${pieza.broker_id}`)}
                />
            )}

            {user?.rol === 'Admin' && (
                <>
                    <EditorAssignmentsPanel
                        editors={editors}
                        brokers={brokers}
                        assignments={assignments}
                        onToggle={toggleEditorAssignment}
                        savingKey={savingAssignment}
                        setupError={assignmentSetupError}
                    />
                    <EditorProductivityOverview editors={editors} assignments={assignments} tasks={allTasks} />
                </>
            )}

            <BrokerList
                brokers={brokers}
                onSelect={(id) => router.push(`/dashboard/broker/${id}`)}
                onShowCreate={() => setShowModal(true)}
                onDelete={handleDeleteBroker}
                isAdmin={user?.rol === 'Admin'}
                isEditor={user?.rol === 'Equipo'}
            />

            {showModal && (
                <AdminCreateModal
                    onClose={() => setShowModal(false)}
                    onSuccess={() => { setShowModal(false); loadData(); }}
                    brokers={brokers}
                />
            )}
        </div>
    );
}

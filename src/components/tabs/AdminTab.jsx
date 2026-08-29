"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { G, css } from "@/lib/constants";
import { GText } from "@/components/ui/UIUtils";
import { formatOperationalDate, getClientOperation } from "@/lib/operations";

export default function AdminTab({ brokerId, toast, piezas = [], onBrokerUpdate }) {
    const [loading, setLoading] = useState(true);
    const [broker, setBroker] = useState(null);
    const [pagos, setPagos] = useState([]);

    // Forms
    const [editModo, setEditModo] = useState(false);
    const [configForm, setConfigForm] = useState({
        fecha_corte: "",
        fecha_contratacion: "",
        piezas_comprometidas: 12,
        precio_pactado: "",
        estado_pago: "Pendiente",
        proxima_accion: "",
        notas_operativas: "",
    });

    const [showPagoForm, setShowPagoForm] = useState(false);
    const [pagoForm, setPagoForm] = useState({ monto: "", fecha_pago: "", notas: "", comprobante_url: "" });

    async function loadAdminData() {
        setLoading(true);
        // Load config
        const { data: brk } = await supabase.from('usuarios').select('id, fecha_corte, fecha_contratacion, piezas_comprometidas, precio_pactado, estado_pago, proxima_accion, notas_operativas, created_at').eq('id', brokerId).single();
        if (brk) {
            setBroker(brk);
            setConfigForm({
                fecha_corte: brk.fecha_corte || "",
                fecha_contratacion: brk.fecha_contratacion || "",
                piezas_comprometidas: brk.piezas_comprometidas ?? 12,
                precio_pactado: brk.precio_pactado || "",
                estado_pago: brk.estado_pago || "Pendiente",
                proxima_accion: brk.proxima_accion || "",
                notas_operativas: brk.notas_operativas || "",
            });
        }

        // Load payments
        const { data: pgs } = await supabase.from('pagos_recibos').select('*').eq('broker_id', brokerId).order('fecha_pago', { ascending: false });
        if (pgs) setPagos(pgs);

        setLoading(false);
    }

    useEffect(() => {
        loadAdminData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [brokerId]);

    const saveConfig = async () => {
        const { error } = await supabase.from('usuarios').update(configForm).eq('id', brokerId);
        if (error) { toast("Error al guardar configuración", "error"); return; }

        setBroker(prev => ({ ...prev, ...configForm }));
        if (onBrokerUpdate) onBrokerUpdate(configForm);
        setEditModo(false);
        toast("Configuración financiera actualizada");
    };

    const registrarPago = async () => {
        if (!pagoForm.monto || !pagoForm.fecha_pago) {
            toast("Monto y fecha son obligatorios", "error");
            return;
        }
        const insertData = { ...pagoForm, broker_id: brokerId };
        const { data, error } = await supabase.from('pagos_recibos').insert(insertData).select().single();

        if (error) { toast("Error al registrar el pago", "error"); return; }

        setPagos([data, ...pagos]);
        setShowPagoForm(false);
        setPagoForm({ monto: "", fecha_pago: "", notas: "", comprobante_url: "" });
        toast("Pago registrado correctamente");
    };

    const estadoColor = (est) => ({ "Pagado": G.green, "Pendiente": G.orange, "Atrasado": G.red }[est] || G.muted);
    const operation = getClientOperation({ id: brokerId, created_at: broker?.created_at, ...configForm }, piezas);

    if (loading) return <div style={{ padding: 40, color: G.dimmed, fontSize: 11, fontFamily: "sans-serif" }}>Cargando info administrativa...</div>;

    return (
        <div style={{ padding: "24px 28px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
            <GText g={G.gViolet} size={10} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Módulo de Administración</GText>
            <div style={{ fontSize: 20, color: G.white, fontFamily: "Georgia,serif", marginBottom: 8 }}>Configuración, operación y pagos</div>
            <div style={{ color: G.muted, fontFamily: "sans-serif", fontSize: 12, marginBottom: 24 }}>El ciclo mensual comienza en la fecha de contratación y se renueva en ese mismo día de cada mes.</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                {/* PANEL CONFIGURACION */}
                <div style={{ ...css.card, padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <span style={{ fontSize: 13, color: G.white, fontWeight: 700, fontFamily: "sans-serif" }}>Acuerdo Comercial</span>
                        <button onClick={() => editModo ? saveConfig() : setEditModo(true)} style={css.btn(editModo ? G.gGreen : G.gPurple)}>
                            {editModo ? "Guardar" : "Editar"}
                        </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        <div>
                            <label style={css.label}>Precio Pactado (Mensual)</label>
                            {editModo ?
                                <input type="number" value={configForm.precio_pactado} onChange={e => setConfigForm({ ...configForm, precio_pactado: e.target.value })} style={css.input} />
                                : <div style={{ fontSize: 16, color: G.white, fontFamily: "monospace" }}>${broker?.precio_pactado || "0.00"}</div>
                            }
                        </div>
                        <div>
                            <label style={css.label}>Fecha de contratación</label>
                            {editModo ?
                                <input type="date" value={configForm.fecha_contratacion} onChange={e => setConfigForm({ ...configForm, fecha_contratacion: e.target.value })} style={{ ...css.input, colorScheme: "light" }} />
                                : <div style={{ fontSize: 13, color: G.white, fontFamily: "sans-serif" }}>{broker?.fecha_contratacion || "No definida"}</div>
                            }
                        </div>
                        <div>
                            <label style={css.label}>Piezas comprometidas por ciclo</label>
                            {editModo ?
                                <input type="number" min="0" value={configForm.piezas_comprometidas} onChange={e => setConfigForm({ ...configForm, piezas_comprometidas: e.target.value })} style={css.input} />
                                : <div style={{ fontSize: 16, color: G.white, fontFamily: "monospace" }}>{broker?.piezas_comprometidas ?? 12}</div>
                            }
                        </div>
                        <div>
                            <label style={css.label}>Fecha de corte de pago</label>
                            {editModo ?
                                <input type="date" value={configForm.fecha_corte} onChange={e => setConfigForm({ ...configForm, fecha_corte: e.target.value })} style={{ ...css.input, colorScheme: "light" }} />
                                : <div style={{ fontSize: 13, color: G.white, fontFamily: "sans-serif" }}>{broker?.fecha_corte || "No definida"}</div>
                            }
                        </div>
                        <div>
                            <label style={css.label}>Estado del Pago Actual</label>
                            {editModo ?
                                <select value={configForm.estado_pago} onChange={e => setConfigForm({ ...configForm, estado_pago: e.target.value })} style={css.input}>
                                    <option value="Pagado">Pagado</option>
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Atrasado">Atrasado</option>
                                </select>
                                : <span style={{ ...css.tag(estadoColor(broker?.estado_pago)), fontSize: 11 }}>{broker?.estado_pago || "Pendiente"}</span>
                            }
                        </div>
                        <div>
                            <label style={css.label}>Próxima acción operativa</label>
                            {editModo ?
                                <input value={configForm.proxima_accion} onChange={e => setConfigForm({ ...configForm, proxima_accion: e.target.value })} style={css.input} placeholder="Ej: cerrar los 2 reels pendientes" />
                                : <div style={{ fontSize: 12, color: G.white, fontFamily: "sans-serif", lineHeight: 1.45 }}>{broker?.proxima_accion || operation.nextAction}</div>
                            }
                        </div>
                        <div>
                            <label style={css.label}>Notas operativas internas</label>
                            {editModo ?
                                <textarea value={configForm.notas_operativas} onChange={e => setConfigForm({ ...configForm, notas_operativas: e.target.value })} style={{ ...css.input, minHeight: 76, resize: "vertical" }} placeholder="Contexto para el equipo..." />
                                : <div style={{ fontSize: 12, color: G.muted, fontFamily: "sans-serif", lineHeight: 1.45 }}>{broker?.notas_operativas || "Sin notas"}</div>
                            }
                        </div>
                    </div>
                </div>

                {/* PANEL PAGOS */}
                <div style={{ ...css.card, padding: 20, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <span style={{ fontSize: 13, color: G.white, fontWeight: 700, fontFamily: "sans-serif" }}>Historial de Recibos</span>
                        <button onClick={() => setShowPagoForm(!showPagoForm)} style={{ background: "transparent", border: `1px solid ${G.border}`, borderRadius: 8, color: G.muted, padding: "5px 10px", cursor: "pointer", fontSize: 11 }}>
                            {showPagoForm ? "Cancelar" : "+ Pago"}
                        </button>
                    </div>

                    {showPagoForm && (
                        <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${G.border}`, borderRadius: 8, padding: 12, marginBottom: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                <div><label style={css.label}>Monto</label><input type="number" placeholder="0.00" value={pagoForm.monto} onChange={e => setPagoForm({ ...pagoForm, monto: e.target.value })} style={css.input} /></div>
                                <div><label style={css.label}>Fecha Pago</label><input type="date" value={pagoForm.fecha_pago} onChange={e => setPagoForm({ ...pagoForm, fecha_pago: e.target.value })} style={{ ...css.input, colorScheme: "light" }} /></div>
                            </div>
                            <div><label style={css.label}>Notas / Folio</label><input placeholder="Referencia de transferencia..." value={pagoForm.notas} onChange={e => setPagoForm({ ...pagoForm, notas: e.target.value })} style={css.input} /></div>
                            <button onClick={registrarPago} style={css.btn(G.gCyan)}>Registrar Recibo</button>
                        </div>
                    )}

                    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                        {pagos.length === 0 && <div style={{ fontSize: 11, color: G.dimmed, textAlign: "center", padding: 20 }}>No hay pagos registrados.</div>}
                        {pagos.map(p => (
                            <div key={p.id} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.02)", border: `1px solid ${G.border}`, borderRadius: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div style={{ fontSize: 13, color: G.green, fontFamily: "monospace", fontWeight: 700 }}>${p.monto}</div>
                                    <div style={{ fontSize: 10, color: G.white, fontFamily: "sans-serif", marginTop: 2 }}>{p.notas || "Sin notas"}</div>
                                </div>
                                <div style={{ fontSize: 10, color: G.muted, fontFamily: "sans-serif" }}>📅 {p.fecha_pago}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <div style={{ ...css.card, padding: 20, marginTop: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
                    <div>
                        <div style={{ color: G.white, fontFamily: "Gilroy, sans-serif", fontSize: 14, fontWeight: 900 }}>Vista previa del ciclo vigente</div>
                        <div style={{ color: G.muted, fontFamily: "monospace", fontSize: 11, marginTop: 4 }}>{formatOperationalDate(operation.cycle.start)} - {formatOperationalDate(operation.cycle.end)}</div>
                    </div>
                    <span style={{ color: operation.riskTone, background: `${operation.riskTone}12`, border: `1px solid ${operation.riskTone}55`, borderRadius: 6, padding: "5px 8px", fontFamily: "Gilroy, sans-serif", fontSize: 10, fontWeight: 900, textTransform: "uppercase" }}>{operation.risk}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(110px, 1fr))", gap: 10, marginTop: 16 }}>
                    {[["Meta", operation.committed], ["Publicadas", operation.published], ["Pendientes", operation.pending], ["Días restantes", operation.cycle.daysRemaining]].map(([label, value]) => (
                        <div key={label} style={{ background: "#F7F9F9", borderRadius: 7, padding: "10px 12px" }}>
                            <div style={{ color: G.white, fontFamily: "monospace", fontSize: 17, fontWeight: 900 }}>{value}</div>
                            <div style={{ color: G.muted, fontFamily: "sans-serif", fontSize: 10, marginTop: 2 }}>{label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

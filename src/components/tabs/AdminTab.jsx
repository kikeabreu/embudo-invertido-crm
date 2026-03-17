"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { G, css } from "@/lib/constants";
import { GText } from "@/components/ui/UIUtils";

export default function AdminTab({ brokerId, toast }) {
    const [loading, setLoading] = useState(true);
    const [broker, setBroker] = useState(null);
    const [pagos, setPagos] = useState([]);

    // Forms
    const [editModo, setEditModo] = useState(false);
    const [configForm, setConfigForm] = useState({ fecha_corte: "", precio_pactado: "", estado_pago: "Pendiente" });

    const [showPagoForm, setShowPagoForm] = useState(false);
    const [pagoForm, setPagoForm] = useState({ monto: "", fecha_pago: "", notas: "", comprobante_url: "" });

    useEffect(() => {
        loadAdminData();
    }, [brokerId]);

    const loadAdminData = async () => {
        setLoading(true);
        // Load config
        const { data: brk } = await supabase.from('usuarios').select('fecha_corte, precio_pactado, estado_pago').eq('id', brokerId).single();
        if (brk) {
            setBroker(brk);
            setConfigForm({
                fecha_corte: brk.fecha_corte || "",
                precio_pactado: brk.precio_pactado || "",
                estado_pago: brk.estado_pago || "Pendiente"
            });
        }

        // Load payments
        const { data: pgs } = await supabase.from('pagos_recibos').select('*').eq('broker_id', brokerId).order('fecha_pago', { ascending: false });
        if (pgs) setPagos(pgs);

        setLoading(false);
    };

    const saveConfig = async () => {
        const { error } = await supabase.from('usuarios').update(configForm).eq('id', brokerId);
        if (error) { toast("Error al guardar configuración", "error"); return; }

        setBroker(configForm);
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

    if (loading) return <div style={{ padding: 40, color: G.dimmed, fontSize: 11, fontFamily: "sans-serif" }}>Cargando info administrativa...</div>;

    return (
        <div style={{ padding: "24px 28px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
            <GText g={G.gViolet} size={10} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Módulo de Administración</GText>
            <div style={{ fontSize: 20, color: G.white, fontFamily: "Georgia,serif", marginBottom: 24 }}>Configuración y Pagos</div>

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
                            <label style={css.label}>Fecha de Corte</label>
                            {editModo ?
                                <input type="date" value={configForm.fecha_corte} onChange={e => setConfigForm({ ...configForm, fecha_corte: e.target.value })} style={{ ...css.input, colorScheme: "dark" }} />
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
                                <div><label style={css.label}>Fecha Pago</label><input type="date" value={pagoForm.fecha_pago} onChange={e => setPagoForm({ ...pagoForm, fecha_pago: e.target.value })} style={{ ...css.input, colorScheme: "dark" }} /></div>
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
        </div>
    );
}

"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { G, css } from "@/lib/constants";
import { GText, PBar } from "@/components/ui/UIUtils";

// Importaciones de Chart.js
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement,
    Title, Tooltip, Legend, Filler
} from "chart.js";

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement,
    Title, Tooltip, Legend, Filler
);

// Defaults config si la tabla viene vacía (Opciones por defecto para auto-gestionable)
const defaultOptions = {
    objetivos: ["Clientes Potenciales", "Conversiones", "Tráfico", "Interacción", "Alcance", "Reconocimiento de Marca"],
    plataformas: ["Meta Ads", "Google Ads", "TikTok Ads", "LinkedIn Ads"],
    fases: ["Atracción", "Nutrición (Retención)", "Conversión (Venta)"],
    origenes: ["Formulario Nativo", "Landing Page", "WhatsApp", "Mensajes DM"]
};

// Formateadores
const fmt = (n, pfx = "$") => {
    if (n === undefined || n === null || isNaN(n)) return "—";
    return pfx + Number(n).toLocaleString("es-MX", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};
const fmtN = (n) => {
    if (n === undefined || n === null || isNaN(n)) return "0";
    return Number(n).toLocaleString("es-MX");
};

export default function AdsTrackerTab({ brokerId, toast, currentUser, isViewer }) {
    const [view, setView] = useState("dashboard"); // dashboard | campaigns | metrics_logs | config
    const [loading, setLoading] = useState(true);

    const [campaigns, setCampaigns] = useState([]);
    const [metrics, setMetrics] = useState([]);
    const [globalConfig, setGlobalConfig] = useState(defaultOptions);

    // Modals
    const [showCampaignModal, setShowCampaignModal] = useState(false);
    const [editCampId, setEditCampId] = useState(null);
    const [campForm, setCampForm] = useState({});

    const [showMetricModal, setShowMetricModal] = useState(false);
    const [editMetricId, setEditMetricId] = useState(null);
    const [metricForm, setMetricForm] = useState({});

    const isAdmin = currentUser?.rol === "Admin" || currentUser?.rol === "Equipo";

    useEffect(() => {
        loadData();
    }, [brokerId]);

    const loadData = async () => {
        setLoading(true);
        // Load Campaigns
        const { data: camps } = await supabase.from("ads_campaigns").select("*").eq("broker_id", brokerId).order('created_at', { ascending: false });
        if (camps) setCampaigns(camps);

        // Load Metrics
        if (camps && camps.length > 0) {
            const campIds = camps.map(c => c.id);
            const { data: metrs } = await supabase.from("ads_metrics").select("*").in("campaign_id", campIds).order('fecha', { ascending: false });
            if (metrs) setMetrics(metrs);
        } else {
            setMetrics([]);
        }

        // Podríamos cargar options dinámicos desde broker_config si existe:
        const { data: bconfig } = await supabase.from("broker_config").select("ads_config").eq("broker_id", brokerId).single();
        if (bconfig && bconfig.ads_config) {
            setGlobalConfig({ ...defaultOptions, ...bconfig.ads_config });
        }

        setLoading(false);
    };

    const saveOptions = async (newConfig) => {
        setGlobalConfig(newConfig);
        const { error } = await supabase.from("broker_config").upsert({ broker_id: brokerId, ads_config: newConfig });
        if (error) toast("Error guardando config", "error");
        else toast("Configuración actualizada", "success");
    };

    // --- SAVE CAMPAIGN ---
    const handleSaveCampaign = async (e) => {
        e.preventDefault();
        const configData = { ...campForm };
        delete configData.nombre;
        delete configData.estado;
        delete configData.presupuesto_mensual;

        const payload = {
            broker_id: brokerId,
            nombre: campForm.nombre || "Sin nombre",
            estado: campForm.estado || "Activa",
            presupuesto_mensual: Number(campForm.presupuesto_mensual || 0),
            config: configData
        };

        if (editCampId) { // Update
            const { data, error } = await supabase.from("ads_campaigns").update(payload).eq("id", editCampId).select().single();
            if (error) toast(error.message, "error");
            else {
                setCampaigns(prev => prev.map(c => c.id === editCampId ? data : c));
                toast("Campaña actualizada");
                setShowCampaignModal(false);
            }
        } else { // Create
            const { data, error } = await supabase.from("ads_campaigns").insert(payload).select().single();
            if (error) toast(error.message, "error");
            else {
                setCampaigns(prev => [data, ...prev]);
                toast("Campaña creada");
                setShowCampaignModal(false);
            }
        }
    };

    // --- SAVE METRIC LOG ---
    const handleSaveMetric = async (e) => {
        e.preventDefault();
        const metData = { ...metricForm };
        delete metData.campaign_id;
        delete metData.fecha;

        Object.keys(metData).forEach(k => { if (!isNaN(metData[k]) && metData[k] !== "") metData[k] = Number(metData[k]); });

        const payload = {
            campaign_id: metricForm.campaign_id,
            fecha: metricForm.fecha,
            metrics: metData,
            creado_por: currentUser.id
        };

        if (editMetricId) { // Update
            const { data, error } = await supabase.from("ads_metrics").update(payload).eq("id", editMetricId).select().single();
            if (error) toast(error.message, "error");
            else {
                setMetrics(prev => prev.map(m => m.id === editMetricId ? data : m));
                toast("Registro actualizado");
                setShowMetricModal(false);
            }
        } else { // Create
            // Upsert based on unique campaign+fecha to avoid errors ideally, but insert for now.
            const { data, error } = await supabase.from("ads_metrics").insert(payload).select().single();
            if (error) {
                if (error.code === '23505') toast("Ya existe un registro para esta fecha y campaña. Edita el existente.", "error");
                else toast(error.message, "error");
            } else {
                setMetrics(prev => [data, ...prev].sort((a,b) => new Date(b.fecha) - new Date(a.fecha)));
                toast("Registro añadido");
                setShowMetricModal(false);
            }
        }
    };

    const deleteCampaign = async (id) => {
        if (!confirm("¿Eliminar campaña y TODO su historial de métricas?")) return;
        const { error } = await supabase.from("ads_campaigns").delete().eq("id", id);
        if (!error) {
            setCampaigns(prev => prev.filter(c => c.id !== id));
            setMetrics(prev => prev.filter(m => m.campaign_id !== id));
            toast("Campaña eliminada");
        } else toast(error.message, "error");
    };

    const deleteMetric = async (id) => {
        if (!confirm("¿Eliminar este registro diario?")) return;
        const { error } = await supabase.from("ads_metrics").delete().eq("id", id);
        if (!error) {
            setMetrics(prev => prev.filter(m => m.id !== id));
            toast("Registro eliminado");
        } else toast(error.message, "error");
    };


    // --- RENDERING HELPERS ---
    const getCampName = (cid) => campaigns.find(c => c.id === cid)?.nombre || "Campaña Borrada";
    const getCampColor = (cid) => {
        const plat = campaigns.find(c => c.id === cid)?.config?.plataforma;
        if (plat?.includes("Meta")) return "#3b82f6";
        if (plat?.includes("Google")) return "#f59e0b";
        if (plat?.includes("TikTok")) return "#ec4899";
        return "#8b5cf6";
    };

    // Calculate Dashboard KPIs
    const totalGasto = metrics.reduce((acc, m) => acc + (m.metrics.gasto || 0), 0);
    const totalIngresos = metrics.reduce((acc, m) => acc + (m.metrics.ingresos || 0), 0);
    const totalLeads = metrics.reduce((acc, m) => acc + (m.metrics.leads || 0), 0);
    const cpl = totalLeads > 0 ? (totalGasto / totalLeads) : 0;
    const roas = totalGasto > 0 ? (totalIngresos / totalGasto) : 0;

    // --- CHART DATA GENERATION ---
    const [chartFilterCampId, setChartFilterCampId] = useState(""); // empty means all

    const filteredMetrics = chartFilterCampId ? metrics.filter(m => m.campaign_id === chartFilterCampId) : metrics;
    
    // Line Chart: Gasto vs Ingresos over time (aggregate by date)
    const dateMap = {};
    filteredMetrics.forEach(m => {
        if (!dateMap[m.fecha]) dateMap[m.fecha] = { gasto: 0, ingresos: 0, leads: 0 };
        dateMap[m.fecha].gasto += (m.metrics.gasto || 0);
        dateMap[m.fecha].ingresos += (m.metrics.ingresos || 0);
        dateMap[m.fecha].leads += (m.metrics.leads || 0);
    });
    const sortedDates = Object.keys(dateMap).sort();
    
    const lineChartData = {
        labels: sortedDates.map(d => new Date(d).toLocaleDateString('es-MX', { month: 'short', day: 'numeric'})),
        datasets: [
            {
                label: 'Gasto',
                data: sortedDates.map(d => dateMap[d].gasto),
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139,92,246,0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Ingresos / Ventas',
                data: sortedDates.map(d => dateMap[d].ingresos),
                borderColor: '#22c55e',
                backgroundColor: 'rgba(34,197,94,0.08)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    // Doughnut Chart: Gasto por Plataforma (only if showing all campaigns)
    const platGasto = {};
    campaigns.forEach(c => platGasto[c.config?.plataforma || "Otra"] = 0);
    metrics.forEach(m => {
        const c = campaigns.find(x => x.id === m.campaign_id);
        if (c) {
            const p = c.config?.plataforma || "Otra";
            platGasto[p] += (m.metrics.gasto || 0);
        }
    });

    const pieData = {
        labels: Object.keys(platGasto),
        datasets: [{
            data: Object.values(platGasto),
            backgroundColor: ['#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    // Bar Chart: Rendimiento por Objetivo (Leads generados por objetivo)
    const objLeads = {};
    campaigns.forEach(c => objLeads[c.config?.objetivo || "Varios"] = 0);
    metrics.forEach(m => {
        const c = campaigns.find(x => x.id === m.campaign_id);
        if (c) {
            const o = c.config?.objetivo || "Varios";
            objLeads[o] += (m.metrics.leads || 0);
        }
    });

    const barData = {
        labels: Object.keys(objLeads),
        datasets: [{
            label: "Leads Obtenidos",
            data: Object.values(objLeads),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderRadius: 4
        }]
    };

    const chartOptions = { responsive: true, maintainAspectRatio: false, color: G.muted };


    return (
        <div style={{ padding: 20, maxWidth: 1400, margin: "0 auto", color: G.white, fontFamily: "sans-serif" }}>
            {/* TABS SUPERIORES */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20, borderBottom: `1px solid ${G.border}`, paddingBottom: 15 }}>
                <button onClick={() => setView("dashboard")} style={{ ...css.btn(view === "dashboard" ? G.gPurple : "transparent"), border: view === "dashboard" ? 'none' : `1px solid ${G.border}`, borderRadius: 8 }}>📊 Dashboard</button>
                <button onClick={() => setView("campaigns")} style={{ ...css.btn(view === "campaigns" ? G.gPurple : "transparent"), border: view === "campaigns" ? 'none' : `1px solid ${G.border}`, borderRadius: 8 }}>📁 Campañas</button>
                <button onClick={() => setView("metrics")} style={{ ...css.btn(view === "metrics" ? G.gPurple : "transparent"), border: view === "metrics" ? 'none' : `1px solid ${G.border}`, borderRadius: 8 }}>🗓️ Registros Diarios</button>
                {isAdmin && <button onClick={() => setView("config")} style={{ ...css.btn(view === "config" ? G.gCyan : "transparent"), border: view === "config" ? 'none' : `1px solid ${G.border}`, borderRadius: 8, marginLeft: "auto" }}>⚙️ Configurar Entorno</button>}
            </div>

            {loading ? <div style={{ textAlign: "center", padding: 50, color: G.muted }}>Cargando información del Tracker...</div> : (
                <>
                    {/* DASHBOARD VIEW */}
                    {view === "dashboard" && (
                        <div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 15, marginBottom: 20 }}>
                                <div style={{ ...css.card, padding: 20 }}>
                                    <div style={{ fontSize: 11, color: G.muted, textTransform: "uppercase", letterSpacing: 1 }}>Gasto Total</div>
                                    <div style={{ fontSize: 26, fontWeight: 700, margin: "5px 0", fontFamily: "Georgia" }}>{fmt(totalGasto)}</div>
                                </div>
                                <div style={{ ...css.card, padding: 20 }}>
                                    <div style={{ fontSize: 11, color: G.muted, textTransform: "uppercase", letterSpacing: 1 }}>Ingresos / Ventas</div>
                                    <div style={{ fontSize: 26, fontWeight: 700, margin: "5px 0", fontFamily: "Georgia", color: '#4ade80' }}>{fmt(totalIngresos)}</div>
                                    <div style={{ fontSize: 12, color: roas >= 2 ? '#4ade80' : '#fbbf24' }}>ROAS: {roas.toFixed(2)}x</div>
                                </div>
                                <div style={{ ...css.card, padding: 20 }}>
                                    <div style={{ fontSize: 11, color: G.muted, textTransform: "uppercase", letterSpacing: 1 }}>Leads</div>
                                    <div style={{ fontSize: 26, fontWeight: 700, margin: "5px 0", fontFamily: "Georgia" }}>{fmtN(totalLeads)}</div>
                                </div>
                                <div style={{ ...css.card, padding: 20 }}>
                                    <div style={{ fontSize: 11, color: G.muted, textTransform: "uppercase", letterSpacing: 1 }}>CPL Promedio</div>
                                    <div style={{ fontSize: 26, fontWeight: 700, margin: "5px 0", fontFamily: "Georgia" }}>{fmt(cpl)}</div>
                                </div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                                <div style={{ fontSize: 16, fontWeight: 600 }}>Rendimiento Gráfico</div>
                                <select style={{ ...css.input, width: 250, padding: "6px 10px", fontSize: 12 }} value={chartFilterCampId} onChange={e => setChartFilterCampId(e.target.value)}>
                                    <option value="">Todas las campañas</option>
                                    {campaigns.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </select>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 15, marginBottom: 20 }}>
                                <div style={{ ...css.card, padding: 20 }}>
                                    <div style={{ marginBottom: 15 }}>Evolución Gasto vs Ingresos</div>
                                    <div style={{ height: 280 }}><Line data={lineChartData} options={{ ...chartOptions, scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { color: 'rgba(255,255,255,0.05)' } } } }} /></div>
                                </div>
                                <div style={{ ...css.card, padding: 20, display: "flex", flexDirection: "column" }}>
                                    <div style={{ marginBottom: 15 }}>Distribución de Gasto por Plataforma</div>
                                    <div style={{ flex: 1, position: "relative", minHeight: 200 }}><Doughnut data={pieData} options={{ ...chartOptions, cutout: '70%', plugins: { legend: { position: 'bottom', labels: { color: G.white } } } }} /></div>
                                </div>
                            </div>

                            <div style={{ ...css.card, padding: 20 }}>
                                <div style={{ marginBottom: 15 }}>Resultados (Leads) según Objetivo Estratégico</div>
                                <div style={{ height: 220 }}><Bar data={barData} options={{ ...chartOptions, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } } }} /></div>
                            </div>
                        </div>
                    )}

                    {/* CAMPAIGNS VIEW */}
                    {view === "campaigns" && (
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                                <div style={{ fontSize: 16, fontWeight: 600 }}>Tus Campañas Activas e Históricas</div>
                                {!isViewer && <button onClick={() => { setEditCampId(null); setCampForm({ plataforma: globalConfig.plataformas[0], objetivo: globalConfig.objetivos[0] }); setShowCampaignModal(true); }} style={{ ...css.btn(G.gCyan), fontSize: 13, padding: "8px 12px", borderRadius: 8 }}>+ Nueva Campaña</button>}
                            </div>
                            
                            <table style={{ width: "100%", borderCollapse: "collapse", background: G.card, borderRadius: 12, overflow: "hidden" }}>
                                <thead style={{ background: "rgba(255,255,255,0.05)", fontSize: 11, color: G.muted, textTransform: "uppercase" }}>
                                    <tr>
                                        <th style={{ padding: "12px 15px", textAlign: "left" }}>Campaña</th>
                                        <th style={{ padding: "12px 15px", textAlign: "left" }}>Configuración Básica</th>
                                        <th style={{ padding: "12px 15px", textAlign: "left" }}>Presupuesto / Estatus</th>
                                        <th style={{ padding: "12px 15px", textAlign: "left" }}>Total Gastado</th>
                                        <th style={{ padding: "12px 15px", textAlign: "right" }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {campaigns.length === 0 && <tr><td colSpan="5" style={{ padding: 20, textAlign: "center", color: G.dimmed }}>No hay campañas registradas.</td></tr>}
                                    {campaigns.map(c => {
                                        const cspent = metrics.filter(m => m.campaign_id === c.id).reduce((acc, m) => acc + (m.metrics.gasto||0), 0);
                                        return (
                                            <tr key={c.id} style={{ borderBottom: `1px solid ${G.border}`, transition: "background 0.2s" }}>
                                                <td style={{ padding: "14px 15px" }}>
                                                    <div style={{ fontWeight: 600 }}>{c.nombre}</div>
                                                    <div style={{ fontSize: 11, color: G.muted, marginTop: 4 }}>{c.config?.objetivo || "—"}</div>
                                                </td>
                                                <td style={{ padding: "14px 15px" }}>
                                                    <span style={{ fontSize: 10, background: "rgba(255,255,255,0.1)", padding: "3px 8px", borderRadius: 10, marginRight: 5 }}>{c.config?.plataforma || "—"}</span>
                                                    <span style={{ fontSize: 10, background: "rgba(255,255,255,0.1)", padding: "3px 8px", borderRadius: 10 }}>{c.config?.origen || "—"}</span>
                                                </td>
                                                <td style={{ padding: "14px 15px" }}>
                                                    <div style={{ color: c.estado === 'Activa' ? '#4ade80' : G.muted }}>● {c.estado}</div>
                                                    <div style={{ fontSize: 11, color: G.muted }}>Presupuesto: {fmt(c.presupuesto_mensual)}/mes</div>
                                                </td>
                                                <td style={{ padding: "14px 15px", fontFamily: "Georgia" }}>
                                                    {fmt(cspent)}
                                                </td>
                                                <td style={{ padding: "14px 15px", textAlign: "right" }}>
                                                    {!isViewer && (
                                                        <>
                                                            <button onClick={() => {
                                                                setEditCampId(c.id);
                                                                setCampForm({ nombre: c.nombre, estado: c.estado, presupuesto_mensual: c.presupuesto_mensual, ...c.config });
                                                                setShowCampaignModal(true);
                                                            }} style={{ background: "transparent", border: "none", color: G.white, cursor: "pointer", fontSize: 12, marginRight: 10 }}>Editar</button>
                                                            {isAdmin && <button onClick={() => deleteCampaign(c.id)} style={{ background: "transparent", border: "none", color: '#f87171', cursor: "pointer", fontSize: 12 }}>✕</button>}
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* METRICS / DAILY LOGS VIEW */}
                    {view === "metrics" && (
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                                <div style={{ fontSize: 16, fontWeight: 600 }}>Registros de Rendimiento</div>
                                {!isViewer && (
                                    <button onClick={() => { setEditMetricId(null); setMetricForm({ fecha: new Date().toISOString().slice(0, 10), gasto: '', leads: '', clicks: '', cpc: '', ingresos: '' }); setShowMetricModal(true); }} style={{ ...css.btn(G.gMagenta), fontSize: 13, padding: "8px 12px", borderRadius: 8 }}>
                                        + Agregar Registro Diario
                                    </button>
                                )}
                            </div>

                            <table style={{ width: "100%", borderCollapse: "collapse", background: G.card, borderRadius: 12, overflow: "hidden" }}>
                                <thead style={{ background: "rgba(255,255,255,0.05)", fontSize: 11, color: G.muted, textTransform: "uppercase" }}>
                                    <tr>
                                        <th style={{ padding: "12px 15px", textAlign: "left" }}>Fecha</th>
                                        <th style={{ padding: "12px 15px", textAlign: "left" }}>Campaña Asociada</th>
                                        <th style={{ padding: "12px 15px", textAlign: "right" }}>Gasto</th>
                                        <th style={{ padding: "12px 15px", textAlign: "right" }}>Leads</th>
                                        <th style={{ padding: "12px 15px", textAlign: "right" }}>Ingresos</th>
                                        <th style={{ padding: "12px 15px", textAlign: "left" }}>Otros (Custom config)</th>
                                        <th style={{ padding: "12px 15px", textAlign: "right" }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {metrics.length === 0 && <tr><td colSpan="7" style={{ padding: 20, textAlign: "center", color: G.dimmed }}>No hay registros de rendimiento todavía. Sube el primero.</td></tr>}
                                    {metrics.map(m => {
                                        // Extraer campos custom que no son gasto, leads, ingresos
                                        const standardKeys = ['gasto', 'leads', 'ingresos'];
                                        const customEntries = Object.entries(m.metrics).filter(([k,v]) => !standardKeys.includes(k) && v !== '');

                                        return (
                                            <tr key={m.id} style={{ borderBottom: `1px solid ${G.border}`, transition: "background 0.2s" }}>
                                                <td style={{ padding: "14px 15px", fontWeight: 500 }}>
                                                    {new Date(m.fecha).toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })}
                                                </td>
                                                <td style={{ padding: "14px 15px" }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                        <span style={{ display:"inline-block", width:8, height:8, borderRadius:'50%', background: getCampColor(m.campaign_id) }}></span>
                                                        {getCampName(m.campaign_id)}
                                                    </div>
                                                </td>
                                                <td style={{ padding: "14px 15px", textAlign: "right", fontFamily:"Georgia" }}>{fmt(m.metrics.gasto)}</td>
                                                <td style={{ padding: "14px 15px", textAlign: "right", fontFamily:"Georgia" }}>{fmtN(m.metrics.leads)}</td>
                                                <td style={{ padding: "14px 15px", textAlign: "right", fontFamily:"Georgia", color: m.metrics.ingresos > 0 ? '#4ade80' : 'inherit' }}>{fmt(m.metrics.ingresos)}</td>
                                                <td style={{ padding: "14px 15px", fontSize: 11, color: G.muted }}>
                                                    {customEntries.map(([k,v]) => <span key={k} style={{marginRight:5}}>{k}: {fmtN(v)}</span>)}
                                                </td>
                                                <td style={{ padding: "14px 15px", textAlign: "right" }}>
                                                    {!isViewer && (
                                                        <>
                                                            <button onClick={() => {
                                                                setEditMetricId(m.id);
                                                                setMetricForm({ campaign_id: m.campaign_id, fecha: m.fecha, ...m.metrics });
                                                                setShowMetricModal(true);
                                                            }} style={{ background: "transparent", border: "none", color: G.white, cursor: "pointer", fontSize: 12, marginRight: 10 }}>Editar</button>
                                                            {isAdmin && <button onClick={() => deleteMetric(m.id)} style={{ background: "transparent", border: "none", color: '#f87171', cursor: "pointer", fontSize: 12 }}>✕</button>}
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* CONFIG VIEW */}
                    {view === "config" && isAdmin && (
                        <div style={{ maxWidth: 800 }}>
                            <div style={{ fontSize: 18, marginBottom: 10 }}>Configuración de Etiquetas Auto-Gestionables</div>
                            <div style={{ color: G.muted, fontSize: 12, marginBottom: 20 }}>Esta configuración aplica a las campañas de este Broker para poblar los selects desplegables al momento de crearlas (añade separados por coma).</div>
                            
                            {["plataformas", "objetivos", "fases", "origenes"].map(key => (
                                <div key={key} style={{ marginBottom: 15, background: G.card, padding: 15, borderRadius: 10, border: `1px solid ${G.border}` }}>
                                    <label style={{ display: "block", fontSize: 12, textTransform: "uppercase", color: G.white, marginBottom: 8, letterSpacing: 1 }}>{key}</label>
                                    <textarea 
                                        style={{...css.input, minHeight: 60}}
                                        value={(globalConfig[key] || []).join(", ")}
                                        onChange={(e) => {
                                            const vals = e.target.value.split(",").map(v => v.trim()).filter(Boolean);
                                            setGlobalConfig({ ...globalConfig, [key]: vals });
                                        }}
                                        placeholder={`Escribe opciones separadas por coma...`}
                                    />
                                </div>
                            ))}
                            <button onClick={() => saveOptions(globalConfig)} style={{ ...css.btn(G.gCyan), fontSize: 13, padding: "10px 20px" }}>💾 Guardar Configuración Global</button>
                        </div>
                    )}
                </>
            )}

            {/* --- MODALS --- */}
            {/* Modal Campaña */}
            {showCampaignModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
                    <div style={{ ...css.card, padding: 30, width: 450 }}>
                        <div style={{ fontSize: 18, marginBottom: 20 }}>{editCampId ? "Modificar Campaña" : "Crear Nueva Campaña"}</div>
                        <form onSubmit={handleSaveCampaign} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                            <div>
                                <label style={{ ...css.label, fontSize: 11 }}>Nombre Identificador</label>
                                <input required style={css.input} value={campForm.nombre || ""} onChange={e => setCampForm({...campForm, nombre: e.target.value})} placeholder="Ej. Lanzamiento Residencial Etapa 1" />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                <div>
                                    <label style={{ ...css.label, fontSize: 11 }}>Plataforma (Red)</label>
                                    <select style={css.input} value={campForm.plataforma || ""} onChange={e => setCampForm({...campForm, plataforma: e.target.value})}>
                                        <option value="">Selecciona...</option>
                                        {(globalConfig.plataformas || []).map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ ...css.label, fontSize: 11 }}>Objetivo Estratégico</label>
                                    <select style={css.input} value={campForm.objetivo || ""} onChange={e => setCampForm({...campForm, objetivo: e.target.value})}>
                                        <option value="">Selecciona...</option>
                                        {(globalConfig.objetivos || []).map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                <div>
                                    <label style={{ ...css.label, fontSize: 11 }}>Fase del Embudo</label>
                                    <select style={css.input} value={campForm.fase || ""} onChange={e => setCampForm({...campForm, fase: e.target.value})}>
                                        <option value="">Selecciona...</option>
                                        {(globalConfig.fases || []).map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ ...css.label, fontSize: 11 }}>Origen (Método)</label>
                                    <select style={css.input} value={campForm.origen || ""} onChange={e => setCampForm({...campForm, origen: e.target.value})}>
                                        <option value="">Selecciona...</option>
                                        {(globalConfig.origenes || []).map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                <div>
                                    <label style={{ ...css.label, fontSize: 11 }}>Estado</label>
                                    <select style={css.input} value={campForm.estado || "Activa"} onChange={e => setCampForm({...campForm, estado: e.target.value})}>
                                        <option value="Activa">Activa</option>
                                        <option value="Pausada">Pausada</option>
                                        <option value="Terminada">Terminada</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ ...css.label, fontSize: 11 }}>Presupuesto Mensual ($)</label>
                                    <input type="number" step="0.01" style={css.input} value={campForm.presupuesto_mensual || ""} onChange={e => setCampForm({...campForm, presupuesto_mensual: e.target.value})} placeholder="0.00" />
                                </div>
                            </div>

                            {/* Custom metadata can be added here easily natively because it's JSONB! */}
                            <div style={{ marginTop: 10, background: "rgba(255,255,255,0.02)", padding: 10, borderRadius: 8 }}>
                                <label style={{ ...css.label, fontSize: 11 }}>Agrega un metadato custom (campo = valor)</label>
                                <div style={{ display: "flex", gap: 5 }}>
                                    <input style={{...css.input, flex:1}} placeholder="Ej. Agencia Externa" id="customKeyCamp" />
                                    <input style={{...css.input, flex:1}} placeholder="Ej. MediaBuyer SL" id="customValCamp" />
                                    <button type="button" onClick={() => {
                                        const k = document.getElementById('customKeyCamp').value;
                                        const v = document.getElementById('customValCamp').value;
                                        if (k && v) { setCampForm({...campForm, [k]: v}); document.getElementById('customKeyCamp').value=''; document.getElementById('customValCamp').value=''; }
                                    }} style={{...css.btn(), padding:"0 10px"}}>+</button>
                                </div>
                                {/* Lista de custom properties on the fly */}
                                {Object.keys(campForm).filter(k => !['nombre','plataforma','objetivo','fase','origen','estado','presupuesto_mensual'].includes(k)).map(k => (
                                    <div key={k} style={{fontSize: 11, color: G.muted, marginTop: 5}}>• {k}: {campForm[k]} <button type="button" onClick={()=>{const n={...campForm};delete n[k];setCampForm(n)}} style={{background:"none",border:"none",color:G.red,cursor:"pointer",marginLeft:5}}>x</button></div>
                                ))}
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
                                <button type="button" onClick={() => setShowCampaignModal(false)} style={{ background: "transparent", color: G.muted, border: "none", cursor: "pointer" }}>Cancelar</button>
                                <button type="submit" style={css.btn(G.gCyan)}>Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Metric Log */}
            {showMetricModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
                    <div style={{ ...css.card, padding: 30, width: 400 }}>
                        <div style={{ fontSize: 18, marginBottom: 20 }}>{editMetricId ? "Modificar Registro" : "Nuevo Registro Diario"}</div>
                        <form onSubmit={handleSaveMetric} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
                                <div>
                                    <label style={{ ...css.label, fontSize: 11 }}>Campaña (Origen de Datos)</label>
                                    <select required style={css.input} value={metricForm.campaign_id || ""} onChange={e => setMetricForm({...metricForm, campaign_id: e.target.value})}>
                                        <option value="">Selecciona...</option>
                                        {campaigns.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ ...css.label, fontSize: 11 }}>Fecha de Carga</label>
                                    <input type="date" required style={{...css.input, colorScheme: "dark"}} value={metricForm.fecha || ""} onChange={e => setMetricForm({...metricForm, fecha: e.target.value})} />
                                </div>
                            </div>
                            
                            <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${G.border}`, paddingBottom: 10, marginTop: 10 }}>
                                <div style={{ fontSize: 12, color: G.muted }}>Valores Obligatorios:</div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                                <div>
                                    <label style={{ ...css.label, fontSize: 11 }}>Gasto Ejercido</label>
                                    <input type="number" step="0.01" style={css.input} value={metricForm.gasto !== undefined ? metricForm.gasto : ""} onChange={e => setMetricForm({...metricForm, gasto: e.target.value})} placeholder="$ 0" />
                                </div>
                                <div>
                                    <label style={{ ...css.label, fontSize: 11 }}>Leads (Convers.)</label>
                                    <input type="number" style={css.input} value={metricForm.leads !== undefined ? metricForm.leads : ""} onChange={e => setMetricForm({...metricForm, leads: e.target.value})} placeholder="0" />
                                </div>
                                <div>
                                    <label style={{ ...css.label, fontSize: 11 }}>Ventas/Ingresos</label>
                                    <input type="number" step="0.01" style={css.input} value={metricForm.ingresos !== undefined ? metricForm.ingresos : ""} onChange={e => setMetricForm({...metricForm, ingresos: e.target.value})} placeholder="$ 0" />
                                </div>
                            </div>

                            {/* Flexible JSONB Metrics injection */}
                            <div style={{ marginTop: 10, background: "rgba(255,255,255,0.02)", padding: 10, borderRadius: 8 }}>
                                <label style={{ ...css.label, fontSize: 11 }}>Añadir métrica opcional nueva (Ej. Clicks, Alcance)</label>
                                <div style={{ display: "flex", gap: 5 }}>
                                    <input style={{...css.input, flex:2}} placeholder="Nombre métrica" id="customKeyMet" />
                                    <input style={{...css.input, flex:1}} placeholder="Valor" id="customValMet" />
                                    <button type="button" onClick={() => {
                                        const k = document.getElementById('customKeyMet').value.toLowerCase().replace(/ /g,'_');
                                        const v = document.getElementById('customValMet').value;
                                        if (k && v) { setMetricForm({...metricForm, [k]: v}); document.getElementById('customKeyMet').value=''; document.getElementById('customValMet').value=''; }
                                    }} style={{...css.btn(), padding:"0 10px"}}>+</button>
                                </div>
                                {/* Lista de custom properties on the fly */}
                                {Object.keys(metricForm).filter(k => !['campaign_id','fecha','gasto','leads','ingresos'].includes(k)).map(k => (
                                    <div key={k} style={{fontSize: 11, color: G.muted, marginTop: 5}}>• {k}: {metricForm[k]} <button type="button" onClick={()=>{const n={...metricForm};delete n[k];setMetricForm(n)}} style={{background:"none",border:"none",color:G.red,cursor:"pointer",marginLeft:5}}>x</button></div>
                                ))}
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
                                <button type="button" onClick={() => setShowMetricModal(false)} style={{ background: "transparent", color: G.muted, border: "none", cursor: "pointer" }}>Cancelar</button>
                                <button type="submit" style={css.btn(G.gMagenta)}>Guardar Día</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

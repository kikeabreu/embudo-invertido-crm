"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { G, css } from "@/lib/constants";

// Importaciones de Chart.js
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);
ChartJS.defaults.color = G.muted;
ChartJS.defaults.font.family = "sans-serif";

const defaultOptions = {
    objetivos: ["Clientes Potenciales", "Conversiones", "Tráfico", "Interacción", "Alcance", "Reconocimiento de Marca"],
    plataformas: ["Meta Ads", "Google Ads", "TikTok Ads", "LinkedIn Ads"],
    fases: ["Atracción", "Nutrición (Retención)", "Conversión (Venta)"],
    origenes: ["Formulario Nativo", "Landing Page", "WhatsApp", "Mensajes DM"],
    alertas: { cpl_max: 50, roas_min: 2 } // Limite Global por defecto
};

const fmt = (n, pfx = "$") => { if (n === undefined || n === null || isNaN(n)) return "—"; return pfx + Number(n).toLocaleString("es-MX", { minimumFractionDigits: 0, maximumFractionDigits: 0 }); };
const fmtN = (n) => { if (n === undefined || n === null || isNaN(n)) return "0"; return Number(n).toLocaleString("es-MX"); };

export default function AdsTrackerTab({ brokerId, toast, currentUser, isViewer }) {
    const [view, setView] = useState("dashboard"); 
    const [loading, setLoading] = useState(true);

    const [campaigns, setCampaigns] = useState([]);
    const [metrics, setMetrics] = useState([]);
    const [globalConfig, setGlobalConfig] = useState(defaultOptions);
    const [configInputs, setConfigInputs] = useState({});

    // UI States Interactivas
    const [dateRange, setDateRange] = useState("30"); 
    const [chartFilterCampId, setChartFilterCampId] = useState("");
    const [isTVMode, setIsTVMode] = useState(false); // Modo Sala de Guerra
    
    // Selectores para gráficas
    const [lineY1, setLineY1] = useState("gasto");
    const [lineY2, setLineY2] = useState("ingresos");
    const [pieGroup, setPieGroup] = useState("plataforma");
    const [pieMetric, setPieMetric] = useState("gasto");

    // Modals
    const [showCampaignModal, setShowCampaignModal] = useState(false);
    const [editCampId, setEditCampId] = useState(null);
    const [campForm, setCampForm] = useState({});
    
    const [showMetricModal, setShowMetricModal] = useState(false);
    const [editMetricId, setEditMetricId] = useState(null);
    const [metricForm, setMetricForm] = useState({});

    const isAdmin = currentUser?.rol === "Admin" || currentUser?.rol === "Equipo";

    useEffect(() => { loadData(); }, [brokerId]);
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape' && isTVMode) setIsTVMode(false); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isTVMode]);

    const loadData = async () => {
        setLoading(true);
        const { data: camps } = await supabase.from("ads_campaigns").select("*").eq("broker_id", brokerId).order('created_at', { ascending: false });
        if (camps) setCampaigns(camps);

        if (camps && camps.length > 0) {
            const campIds = camps.map(c => c.id);
            const { data: metrs } = await supabase.from("ads_metrics").select("*").in("campaign_id", campIds).order('fecha', { ascending: false });
            if (metrs) setMetrics(metrs);
        } else setMetrics([]);

        const { data: bconfig } = await supabase.from("broker_config").select("ads_config").eq("broker_id", brokerId).single();
        if (bconfig && bconfig.ads_config) setGlobalConfig({ ...defaultOptions, ...bconfig.ads_config });

        setLoading(false);
    };

    const saveOptions = async () => {
        const newConfig = { ...globalConfig };
        ["plataformas", "objetivos", "fases", "origenes"].forEach(k => {
            if (configInputs[k] !== undefined) newConfig[k] = configInputs[k].split(",").map(v => v.trim()).filter(Boolean);
        });
        if (configInputs.alertas) {
            newConfig.alertas = {
                cpl_max: Number(configInputs.alertas.cpl_max || 50),
                roas_min: Number(configInputs.alertas.roas_min || 2)
            };
        }
        setGlobalConfig(newConfig);
        const { error } = await supabase.from("broker_config").upsert({ broker_id: brokerId, ads_config: newConfig });
        if (error) toast("Error guardando", "error"); else toast("Guardado exitoso", "success");
    };

    const handleSaveCampaign = async (e) => {
        e.preventDefault();
        const conf = { ...campForm }; delete conf.nombre; delete conf.estado; delete conf.presupuesto_mensual;
        const payload = { broker_id: brokerId, nombre: campForm.nombre || "Sin nombre", estado: campForm.estado || "Activa", presupuesto_mensual: Number(campForm.presupuesto_mensual || 0), config: conf };
        const q = editCampId ? supabase.from("ads_campaigns").update(payload).eq("id", editCampId) : supabase.from("ads_campaigns").insert(payload);
        const { data, error } = await q.select().single();
        if (error) toast(error.message, "error");
        else { setCampaigns(prev => editCampId ? prev.map(c => c.id === editCampId ? data : c) : [data, ...prev]); toast(editCampId ? "Actualizada" : "Creada"); setShowCampaignModal(false); }
    };

    const handleSaveMetric = async (e) => {
        e.preventDefault();
        const mdata = { ...metricForm }; delete mdata.campaign_id; delete mdata.fecha;
        Object.keys(mdata).forEach(k => { if (!isNaN(mdata[k]) && mdata[k] !== "") mdata[k] = Number(mdata[k]); });
        const payload = { campaign_id: metricForm.campaign_id, fecha: metricForm.fecha, metrics: mdata, creado_por: currentUser.id };
        const q = editMetricId ? supabase.from("ads_metrics").update(payload).eq("id", editMetricId) : supabase.from("ads_metrics").insert(payload);
        const { data, error } = await q.select().single();
        if (error) toast(error.code==='23505' ? "Ya hay un registro en esa fecha" : error.message, "error");
        else {
            if(editMetricId) setMetrics(prev => prev.map(m => m.id === editMetricId ? data : m));
            else setMetrics(prev => [data, ...prev].sort((a,b) => new Date(b.fecha) - new Date(a.fecha)));
            toast(editMetricId ? "Actualizado" : "Añadido"); setShowMetricModal(false);
        }
    };

    const deleteCampaign = async (id) => { if (!confirm("¿Eliminar?")) return; if (!(await supabase.from("ads_campaigns").delete().eq("id", id)).error) { setCampaigns(prev => prev.filter(c => c.id !== id)); setMetrics(prev => prev.filter(m => m.campaign_id !== id)); toast("Borrada"); } };
    const deleteMetric = async (id) => { if (!confirm("¿Eliminar?")) return; if (!(await supabase.from("ads_metrics").delete().eq("id", id)).error) { setMetrics(prev => prev.filter(m => m.id !== id)); toast("Eliminado"); } };

    const getCampName = (cid) => campaigns.find(c => c.id === cid)?.nombre || "Desconocida";
    const getCampColor = (cid) => { const p = campaigns.find(c => c.id === cid)?.config?.plataforma; return p?.includes("Meta") ? "#3b82f6" : p?.includes("Google") ? "#f59e0b" : p?.includes("TikTok") ? "#ec4899" : "#8b5cf6"; };

    // ============================================
    // MOTOR DE DATOS Y NUEVAS FEATURES
    // ============================================
    
    // Obtener keys para selects dinámicos (incluye custom)
    const dynamicKeysSet = new Set(["gasto", "ingresos", "leads", "cpc", "clicks", "alcance"]);
    metrics.forEach(m => Object.keys(m.metrics || {}).forEach(k => dynamicKeysSet.add(k)));
    const dynamicKeys = Array.from(dynamicKeysSet).sort();

    // Filtro de tiempos
    const getCutoffDate = () => {
        const t = new Date(); t.setHours(23,59,59,999);
        if (dateRange === "7") { t.setDate(t.getDate() - 7); return t; }
        if (dateRange === "30") { t.setDate(t.getDate() - 30); return t; }
        if (dateRange === "month") { t.setDate(1); t.setHours(0,0,0,0); return t; }
        t.setFullYear(2000); return t;
    };
    const cutoffDate = getCutoffDate();
    const filteredMetrics = (chartFilterCampId ? metrics.filter(m => m.campaign_id === chartFilterCampId) : metrics)
        .filter(m => new Date(m.fecha + 'T12:00:00') >= cutoffDate);

    // Totales de KPI Maestro
    const tGasto = filteredMetrics.reduce((a,m) => a + ((m.metrics||{}).gasto || 0), 0);
    const tIngreso = filteredMetrics.reduce((a,m) => a + ((m.metrics||{}).ingresos || 0), 0);
    const tLeads = filteredMetrics.reduce((a,m) => a + ((m.metrics||{}).leads || 0), 0);
    const tAlcance = filteredMetrics.reduce((a,m) => a + ((m.metrics||{}).alcance || 0), 0);
    const tClics = filteredMetrics.reduce((a,m) => a + ((m.metrics||{}).clicks || (m.metrics||{}).clics || 0), 0);
    
    const dCpl = tLeads > 0 ? (tGasto / tLeads) : 0;
    const dRoas = tGasto > 0 ? (tIngreso / tGasto) : 0;

    // --- 1. TERMÓMETRO DE PRESUPUESTO (PACING) ---
    // Calculamos pacing mensual de todas las campañas Activas mostradas
    let totalMensual = 0;
    let gastoCampanasActivasEsteMes = 0;
    
    // Solo tomamos en cuenta las campañas activas para el pacing total
    const campsToPace = chartFilterCampId ? campaigns.filter(c => c.id === chartFilterCampId && c.estado==='Activa') : campaigns.filter(c => c.estado==='Activa');
    campsToPace.forEach(c => totalMensual += (c.presupuesto_mensual || 0));

    // Si estamos en "Este Mes", sacamos el gasto exacto del mes de las activas.
    const primerDiaMes = new Date(); primerDiaMes.setDate(1); primerDiaMes.setHours(0,0,0,0); 
    metrics.filter(m => new Date(m.fecha+'T12:00:00') >= primerDiaMes).forEach(m => {
        if(campsToPace.find(c => c.id === m.campaign_id)) gastoCampanasActivasEsteMes += ((m.metrics||{}).gasto || 0);
    });

    const hoy = new Date();
    const diaActual = hoy.getDate();
    const totalDiasMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
    const porcentajeMesTranscurrido = diaActual / totalDiasMes; // ej. 50%
    const presupuestoEsperadoAEstaFecha = totalMensual * porcentajeMesTranscurrido;
    
    // Status Pacing: < 85% UNDER, > 115% OVER, else ON TRACK
    const ratioPacing = presupuestoEsperadoAEstaFecha > 0 ? (gastoCampanasActivasEsteMes / presupuestoEsperadoAEstaFecha) : 0;
    let pacingColor = G.green; let pacingText = "A Ritmo Ideal";
    if (ratioPacing < 0.85) { pacingColor = G.cyan; pacingText = "Sub-ejerciendo (-)"; }
    else if (ratioPacing > 1.15) { pacingColor = G.orange; pacingText = "Sobre-ejerciendo (+)"; }


    // --- 2. EMBUDOGRAMA (CSS FUNNEL) ---
    const pctClics = tAlcance > 0 ? (tClics / tAlcance) * 100 : 0;
    const pctLeads = tClics > 0 ? (tLeads / tClics) * 100 : 0;

    // --- 3. SISTEMA DE ALERTAS INTELIGENTES ---
    const alertasGeneradas = [];
    // Chequeo global general:
    const gCplMax = globalConfig.alertas?.cpl_max || 50;
    const gRoasMin = globalConfig.alertas?.roas_min || 1.5;
    
    if (dCpl > gCplMax) alertasGeneradas.push(`CPL Global crítico: ${fmt(dCpl)} (Máx: ${fmt(gCplMax)})`);
    if (tGasto > 50 && dRoas < gRoasMin) alertasGeneradas.push(`ROAS Global bajo rojo: ${dRoas.toFixed(2)}x (Mín esperado: ${gRoasMin}x)`);

    // Chequeo por campaña (leyendo límite custom en dataset)
    campsToPace.forEach(c => {
        const cGasto = filteredMetrics.filter(m => m.campaign_id === c.id).reduce((a,m) => a + ((m.metrics||{}).gasto||0),0);
        const cIngresos= filteredMetrics.filter(m => m.campaign_id === c.id).reduce((a,m) => a + ((m.metrics||{}).ingresos||0),0);
        const cLeads = filteredMetrics.filter(m => m.campaign_id === c.id).reduce((a,m) => a + ((m.metrics||{}).leads||0),0);
        const cCpl = cLeads > 0 ? (cGasto / cLeads) : 0;
        const limitCpl = c.config?.limite_cpl ? Number(c.config.limite_cpl) : gCplMax;
        
        if (cCpl > limitCpl) alertasGeneradas.push(`[${c.nombre}] está pagando Leads altísimos a ${fmt(cCpl)}`);
    });

    // --- 4. SCOREBOARD (LEADERBOARD) ---
    // Encontrar qué "Etiqueta" usaremos. Si en las métricas no hay cosas como 'formato', rankearemos por Campaña directamente.
    const scoreboardRaw = {};
    filteredMetrics.forEach(m => {
        // Asignaremos puntaje por ID de campaña para hacerlo infalible
        if(!scoreboardRaw[m.campaign_id]) scoreboardRaw[m.campaign_id] = { gasto:0, leads:0 };
        scoreboardRaw[m.campaign_id].gasto += ((m.metrics||{}).gasto||0);
        scoreboardRaw[m.campaign_id].leads += ((m.metrics||{}).leads||0);
    });
    // Transformar a lista, calcular CPL, y tomar Top 3 (menor CPL con al menos 1 lead)
    const scoreboardSorted = Object.entries(scoreboardRaw)
        .filter(([id, s]) => s.leads > 0)
        .map(([id, s]) => ({ id, name: getCampName(id), cpl: s.gasto / s.leads, leads: s.leads }))
        .sort((a,b) => a.cpl - b.cpl)
        .slice(0, 3);

    // --- PREP GRÁFICAS DE CHARTJS ---
    const dateMap = {};
    filteredMetrics.forEach(m => {
        const met = m.metrics || {};
        if (!dateMap[m.fecha]) dateMap[m.fecha] = { y1: 0, y2: 0 };
        dateMap[m.fecha].y1 += (met[lineY1] || 0);
        dateMap[m.fecha].y2 += (met[lineY2] || 0);
    });
    const sortedDates = Object.keys(dateMap).sort();

    const lineData = {
        labels: sortedDates.map(d => new Date(d + 'T12:00:00').toLocaleDateString('es-MX', { month: 'short', day: 'numeric'})),
        datasets: [
            { label: (lineY1.charAt(0).toUpperCase() + lineY1.slice(1)), data: sortedDates.map(d => dateMap[d].y1), borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderWidth: 2, fill: true, tension: 0.4, yAxisID: 'y' },
            { label: (lineY2.charAt(0).toUpperCase() + lineY2.slice(1)), data: sortedDates.map(d => dateMap[d].y2), borderColor: '#a855f7', backgroundColor: 'rgba(168, 85, 247, 0.1)', borderWidth: 2, fill: true, tension: 0.4, yAxisID: 'y1' }
        ]
    };

    const pieDataMap = {};
    if (filteredMetrics.length > 0) {
        filteredMetrics.forEach(m => {
            const met = m.metrics || {};
            const c = campaigns.find(x => x.id === m.campaign_id);
            const grp = c?.config?.[pieGroup] || "Sin Definir";
            if (!pieDataMap[grp]) pieDataMap[grp] = 0;
            pieDataMap[grp] += (met[pieMetric] || 0);
        });
    }

    const pieData = {
        labels: Object.keys(pieDataMap),
        datasets: [{ data: Object.values(pieDataMap), backgroundColor: ['rgba(59,130,246,0.9)','rgba(168,85,247,0.9)','rgba(236,72,153,0.9)','rgba(16,185,129,0.9)','rgba(245,158,11,0.9)','rgba(6,182,212,0.9)'], borderWidth: 0, hoverOffset: 10 }]
    };
    const commonChartOptions = { responsive: true, maintainAspectRatio: false, plugins: { tooltip: { backgroundColor: 'rgba(0,0,0,0.85)', padding: 12, cornerRadius: 8 }, legend: { position: 'top', labels: { color: G.white, boxWidth: 10, usePointStyle: true } } } };


    // COMPONENTE CONTENEDOR (TV MODE ENVELOP)
    const containerStyle = isTVMode 
        ? { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 99999, background: G.bg, padding: 40, overflowY: "auto" } 
        : { padding: 25, maxWidth: 1400, margin: "0 auto", color: G.white, fontFamily: "sans-serif" };

    return (
        <div style={containerStyle}>
            {/* Si es modo Kiosk, avisamos cómo salir */}
            {isTVMode && <div style={{ position: "absolute", top: 20, right: 30, color: G.muted, fontSize: 12 }}>Presiona [Esc] para salir de Sala de Guerra</div>}

            {/* ALERTAS CRÍTICAS BANNER */}
            {view === "dashboard" && alertasGeneradas.length > 0 && (
                <div style={{ background: "rgba(239, 68, 68, 0.15)", borderLeft: `4px solid ${G.red}`, padding: 15, borderRadius: 8, marginBottom: 20, animation: "fadeIn 0.5s" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, color: G.red, fontWeight: 700, marginBottom: 5 }}>🚨 ALERTAS DE SISTEMA (ROAS / CPL LÍMITES)</div>
                    <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: G.white }}>
                        {alertasGeneradas.map((a, i) => <li key={i} style={{ marginBottom: 4 }}>{a}</li>)}
                    </ul>
                </div>
            )}

            {/* HEADER TABS & DATE RANGE (Ocultos parcial en TV Mode) */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 15, justifyContent: "space-between", alignItems: "center", marginBottom: 30, paddingBottom: 15, borderBottom: isTVMode ? 'none' : `1px solid ${G.border}` }}>
                
                {!isTVMode && (
                    <div style={{ display: "flex", gap: 8 }}>
                        {[{ v: "dashboard", l: "📊 Dashboard" }, { v: "campaigns", l: "📁 Campañas" }, { v: "metrics", l: "🗓️ Registros" }].map(t => (
                            <button key={t.v} onClick={() => setView(t.v)} style={{ ...css.btn(view === t.v ? G.gPurple : "transparent"), border: view === t.v ? 'none' : `1px solid ${G.borderHi}`, borderRadius: 12 }}>{t.l}</button>
                        ))}
                        {isAdmin && <button onClick={() => setView("config")} style={{ ...css.btn(view === "config" ? G.gCyan : "transparent"), border: view === "config" ? 'none' : `1px solid ${G.borderHi}`, borderRadius: 12 }}>⚙️</button>}
                    </div>
                )}
                
                {isTVMode && <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "Georgia", color: G.white }}>📡 War Room - Top Seller Tracking</div>}

                {view === "dashboard" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                        <div style={{ display: "flex", background: "rgba(0,0,0,0.2)", borderRadius: 12, padding: 4, border: `1px solid ${G.border}` }}>
                            {[{ v: "7", l: "7 Días" }, { v: "30", l: "30 Días" }, { v: "month", l: "Este Mes" }, { v: "all", l: "Siempre" }].map(d => (
                                <button key={d.v} onClick={() => setDateRange(d.v)} style={{ background: dateRange === d.v ? 'rgba(255,255,255,0.1)' : 'transparent', color: dateRange === d.v ? '#fff' : G.muted, border: 'none', padding: '6px 14px', borderRadius: 8, fontSize: 13, cursor: "pointer", transition: "0.2s" }}>{d.l}</button>
                            ))}
                        </div>
                        {!isTVMode && <button onClick={() => setIsTVMode(true)} style={{...css.btn(G.gCyan), borderRadius:12}}>📺 Sala de Guerra</button>}
                    </div>
                )}
            </div>

            {loading ? <div style={{ textAlign: "center", padding: 80, color: G.muted }}>Sincronizando modelos de alta prestación...</div> : (
                <>
                    {/* DASHBOARD VIEW */}
                    {view === "dashboard" && (
                        <div style={{ animation: "fadeIn 0.4s ease-out" }}>
                            
                            {/* KPI Grid */}
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 15, marginBottom: 25 }}>
                                <div style={{ ...css.cardGlow, padding: 25 }}>
                                    <div style={{ fontSize: 11, color: G.blue, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 5 }}>Inversión Real</div>
                                    <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "Georgia" }}>{fmt(tGasto)}</div>
                                </div>
                                <div style={{ ...css.cardGlow, padding: 25, borderColor: dRoas >= gRoasMin ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)' }}>
                                    <div style={{ fontSize: 11, color: dRoas >= gRoasMin ? G.green : G.orange, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 5 }}>Ventas / Ingresos</div>
                                    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}><div style={{ fontSize: 32, fontWeight: 800, fontFamily: "Georgia", color: dRoas >= gRoasMin ? '#4ade80' : 'inherit' }}>{fmt(tIngreso)}</div><div style={{ fontSize: 13, color: G.muted }}>ROAS {dRoas.toFixed(2)}x</div></div>
                                </div>
                                <div style={{ ...css.cardGlow, padding: 25 }}>
                                    <div style={{ fontSize: 11, color: G.magenta, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 5 }}>Volumen Leads</div>
                                    <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "Georgia" }}>{fmtN(tLeads)}</div>
                                </div>
                                <div style={{ ...css.cardGlow, padding: 25 }}>
                                    <div style={{ fontSize: 11, color: G.cyan, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 5 }}>Costo p/ Lead</div>
                                    <div style={{ fontSize: 32, fontWeight: 800, fontFamily: "Georgia", color: dCpl > gCplMax ? G.red : 'inherit' }}>{fmt(dCpl)}</div>
                                </div>
                            </div>

                            {/* BLOQUE SUPERIOR DE ALTAS PRESTACIONES (Pacing + Scoreboard) */}
                            <div style={{ display: "grid", gridTemplateColumns: isTVMode ? "2fr 1fr" : "auto", gap: 20, marginBottom: 25 }}>
                                
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                    {/* TERMÓMETRO PACING */}
                                    <div style={{ ...css.card, padding: 25, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 5 }}>Termómetro Mensual (Pacing)</div>
                                        <div style={{ fontSize: 12, color: G.muted, marginBottom: 15 }}>Ritmo de Módulo de Campañas Activas (Presupuesto Global)</div>
                                        
                                        <div style={{ width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: 10, height: 12, position: "relative", overflow: "hidden", marginBottom: 10 }}>
                                            {/* Ideal Pacing Indicator (Linea fantasma de dónde deberíamos ir) */}
                                            <div style={{ position: "absolute", left: `${porcentajeMesTranscurrido * 100}%`, width: 2, height: "100%", background: "rgba(255,255,255,0.5)", zIndex: 10 }} title={"Gasto Ideal Hoy"}></div>
                                            {/* Ritmo de Inversión (Fill Gauge) */}
                                            <div style={{ width: `${Math.min((gastoCampanasActivasEsteMes/totalMensual)*100, 100)}%`, height: "100%", background: pacingColor, transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)" }}></div>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                                            <span style={{ color: pacingColor, fontWeight: 600 }}>Gastado: {fmt(gastoCampanasActivasEsteMes)} / {fmt(totalMensual)}</span>
                                            <span style={{ color: G.muted }}>Día {diaActual} de {totalDiasMes}</span>
                                        </div>
                                        <div style={{ marginTop: 8, fontSize: 11, color: G.muted, fontStyle: "italic" }}>Estatus: <strong style={{color: pacingColor}}>{pacingText}</strong></div>
                                    </div>

                                    {/* SCOREBOARD (TOP 3 Campañas) */}
                                    <div style={{ ...css.card, padding: 25 }}>
                                        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 15 }}>Aceleradores (Top Eficiencia)</div>
                                        {scoreboardSorted.length === 0 ? <div style={{ color:G.muted, fontSize:12 }}>No hay suficientes datos de conversión para rankear.</div> : (
                                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                                {scoreboardSorted.map((c, i) => (
                                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 15, background: "rgba(255,255,255,0.03)", padding: "10px 15px", borderRadius: 8 }}>
                                                        <div style={{ fontSize:20, fontWeight:800, color: i===0?'#fbbf24':i===1?'#94a3b8':'#cd7f32' }}>#{i+1}</div>
                                                        <div style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                            <div style={{ fontWeight: 600, fontSize: 13, color: G.white }}>{c.name}</div>
                                                            <div style={{ fontSize: 11, color: G.muted }}>{fmtN(c.leads)} Leads logrados.</div>
                                                        </div>
                                                        <div style={{ textAlign: "right" }}>
                                                            <div style={{ fontSize: 10, color: G.cyan, textTransform: "uppercase" }}>CPL Estelar</div>
                                                            <div style={{ fontWeight: 700, fontFamily: "Georgia" }}>{fmt(c.cpl)}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* EMBUDOGRAMA VISUAL CSS */}
                                {isTVMode && (
                                    <div style={{ ...css.card, padding: 25, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>Túnel de Impacto Global</div>
                                        <div style={{ width: "100%", maxWidth: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                                            <div style={{ width: "100%", background: G.gBlue, padding: 12, borderRadius: 8, textAlign: "center", color: '#fff', fontSize: 14 }}>
                                                <strong>Alcance</strong> {fmtN(tAlcance)}
                                            </div>
                                            <div style={{ color: G.muted, fontSize: 11 }}>▼ {pctClics.toFixed(1)}% CVR ▼</div>
                                            <div style={{ width: "80%", background: G.gPurple, padding: 12, borderRadius: 8, textAlign: "center", color: '#fff', fontSize: 14 }}>
                                                <strong>Clics</strong> {fmtN(tClics)}
                                            </div>
                                            <div style={{ color: G.muted, fontSize: 11 }}>▼ {pctLeads.toFixed(1)}% CVR ▼</div>
                                            <div style={{ width: "60%", background: G.gMagenta, padding: 12, borderRadius: 8, textAlign: "center", color: '#fff', fontSize: 14 }}>
                                                <strong>Leads</strong> {fmtN(tLeads)}
                                            </div>
                                            <div style={{ color: G.muted, fontSize: 11 }}>▼ ▼</div>
                                            <div style={{ width: "40%", background: G.gGreen, padding: 12, borderRadius: 8, textAlign: "center", color: '#fff', fontSize: 14 }}>
                                                <strong>Ventas</strong> {fmt(tIngreso)}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Filtro Maestro Campañas */}
                            {campaigns.length > 0 && !isTVMode && (
                                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 15 }}>
                                    <select style={{ ...css.input, width: 280, padding: "8px 12px" }} value={chartFilterCampId} onChange={e => setChartFilterCampId(e.target.value)}>
                                        <option value="">🎯 Mostrar Todo el Portafolio</option>
                                        {campaigns.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                    </select>
                                </div>
                            )}

                            {/* GRÁFICAS */}
                            <div style={{ display: "grid", gridTemplateColumns: isTVMode ? "1fr 1fr" : "2fr 1fr", gap: 20, marginBottom: 25 }}>
                                <div style={{ ...css.card, padding: 25, display: "flex", flexDirection: "column" }}>
                                    {isTVMode ? <div style={{fontSize: 16, fontWeight:600, marginBottom:10}}>Evolución y Correlación</div> : (
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                                            <div style={{ fontSize: 15, fontWeight: 600 }}>Correlación de Métricas Libres</div>
                                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                                <select style={{...css.input, color: '#3b82f6', width: 140, padding: "4px 8px"}} value={lineY1} onChange={e=>setLineY1(e.target.value)}>
                                                    {dynamicKeys.map(k => <option key={k} value={k}>{k.toUpperCase()}</option>)}
                                                </select>
                                                <span style={{color: G.muted, fontSize: 12}}>vs</span>
                                                <select style={{...css.input, color: '#a855f7', width: 140, padding: "4px 8px"}} value={lineY2} onChange={e=>setLineY2(e.target.value)}>
                                                    {dynamicKeys.map(k => <option key={k} value={k}>{k.toUpperCase()}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                    <div style={{ flex: 1, minHeight: 300 }}>
                                        {sortedDates.length === 0 ? <div style={{textAlign:'center', padding:50, color:G.muted}}>Espera la recolección de datos...</div> : (
                                            <Line data={lineData} options={{ ...commonChartOptions, interaction: { mode: 'index', intersect: false }, scales: { y: { display: true, position: 'left', grid: { color: 'rgba(255,255,255,0.05)' } }, y1: { display: true, position: 'right', grid: { display: false } }, x: { grid: { color: 'rgba(255,255,255,0.05)' } } } }} />
                                        )}
                                    </div>
                                </div>

                                <div style={{ ...css.card, padding: 25, display: "flex", flexDirection: "column" }}>
                                    {isTVMode ? <div style={{fontSize: 16, fontWeight:600, marginBottom:10}}>Distribución de Fondos</div> : (
                                        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                                            <div style={{ fontSize: 15, fontWeight: 600 }}>Porciones de Mercado y Diseño</div>
                                            <div style={{ display: "flex", gap: 6 }}>
                                                <select style={{...css.input, padding: "5px", fontSize: 11, flex: 1}} value={pieGroup} onChange={e=>setPieGroup(e.target.value)}><option value="plataforma">Por Red</option><option value="objetivo">Por Objetivo</option><option value="fase">Por Fase</option></select>
                                                <select style={{...css.input, padding: "5px", fontSize: 11, flex: 1}} value={pieMetric} onChange={e=>setPieMetric(e.target.value)}>{dynamicKeys.map(k => <option key={k} value={k}>Métrica: {k}</option>)}</select>
                                            </div>
                                        </div>
                                    )}
                                    <div style={{ flex: 1, position: "relative", minHeight: 250 }}>
                                        {filteredMetrics.length === 0 ? <div style={{textAlign:'center', color:G.muted, padding:50}}>Sin Data</div> : <Doughnut data={pieData} options={{ ...commonChartOptions, cutout: '70%' }} />}
                                    </div>
                                </div>
                            </div>
                            
                            {/* EMBUDOGRAMA MODO REGULAR (No TV) */}
                            {!isTVMode && (
                                <div style={{ ...css.card, padding: "30px 40px", marginBottom: 25, display: "flex", flexDirection: "column", alignItems: "center", background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.4))" }}>
                                    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 25, letterSpacing: 1 }}>⚙️ FUNNEL DE CONVERSIÓN RASTREADO</div>
                                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                                        
                                        <div style={{ width: "80%", background: "rgba(59, 130, 246, 0.4)", border: "1px solid #3b82f6", padding: 15, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span style={{fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase"}}>Alcance Digital</span>
                                            <span style={{fontSize: 20, fontWeight: 800}}>{fmtN(tAlcance)}</span>
                                        </div>
                                        
                                        <div style={{ color: G.cyan, fontSize: 12, fontWeight: 700 }}>▼ {pctClics.toFixed(2)}% CTR ▼</div>
                                        
                                        <div style={{ width: "65%", background: "rgba(168, 85, 247, 0.4)", border: "1px solid #a855f7", padding: 15, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span style={{fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase"}}>Clics Link</span>
                                            <span style={{fontSize: 20, fontWeight: 800}}>{fmtN(tClics)}</span>
                                        </div>
                                        
                                        <div style={{ color: G.magenta, fontSize: 12, fontWeight: 700 }}>▼ {pctLeads.toFixed(2)}% de Conversión ▼</div>
                                        
                                        <div style={{ width: "50%", background: "rgba(236, 72, 153, 0.4)", border: "1px solid #ec4899", padding: 15, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span style={{fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase"}}>Leads Captados</span>
                                            <span style={{fontSize: 20, fontWeight: 800}}>{fmtN(tLeads)}</span>
                                        </div>

                                        <div style={{ color: G.green, fontSize: 12, fontWeight: 700 }}>▼ Retorno Real (Ventas) ▼</div>

                                        <div style={{ width: "35%", background: "rgba(16, 185, 129, 0.4)", border: "1px solid #10b981", padding: 15, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span style={{fontSize: 14, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase"}}>Cierre $</span>
                                            <span style={{fontSize: 20, fontWeight: 800}}>{fmt(tIngreso)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}

                    {/* VISTAS CLÁSICAS CAMPAÑAS Y METRICAS CORTADAS PARA ESPACIO. IDÉNTICAS PERO COMPLETAS. */}
                    {/* ... CAMPAIGNS VIEW ... */}
                    {view === "campaigns" && (
                        <div style={{ animation: "fadeIn 0.3s" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                                <div style={{ fontSize: 18, fontWeight: 600 }}>Arquitectura de Pauta</div>
                                {!isViewer && <button onClick={() => { setEditCampId(null); setCampForm({ plataforma: globalConfig.plataformas[0], objetivo: globalConfig.objetivos[0] }); setShowCampaignModal(true); }} style={{ ...css.btn(G.gCyan) }}>+ Estructurar Nueva</button>}
                            </div>
                            <table style={{ width: "100%", borderCollapse: "collapse", background: G.bgCard, borderRadius: 16, overflow: "hidden", border: `1px solid ${G.border}` }}>
                                <thead style={{ background: "rgba(0,0,0,0.3)" }}>
                                    <tr>{['Campaña','Configuración','Presupuesto / Estatus','Inversión y Retorno','Acciones'].map(h => <th key={h} style={{ padding: "14px 18px", textAlign: "left", fontSize:11, color:G.muted, textTransform:'uppercase' }}>{h}</th>)}</tr>
                                </thead>
                                <tbody>
                                    {campaigns.map(c => {
                                        const cGasto = metrics.filter(m => m.campaign_id === c.id).reduce((acc, m) => acc + ((m.metrics||{}).gasto||0), 0);
                                        const conf = c.config || {};
                                        return (
                                            <tr key={c.id} style={{ borderBottom: `1px solid ${G.border}`, transition: "background 0.2s", ":hover": { background: "rgba(255,255,255,0.02)" } }}>
                                                <td style={{ padding: "16px 18px" }}><div style={{ fontWeight: 600, color: G.white }}>{c.nombre}</div><div style={{ fontSize: 12, color: getCampColor(c.id), marginTop: 4 }}>{conf.objetivo}</div></td>
                                                <td style={{ padding: "16px 18px" }}><div style={{ display: "flex", gap: 6 }}><span style={css.tag(getCampColor(c.id))}>{conf.plataforma}</span><span style={css.tag(G.muted)}>{conf.fase}</span></div></td>
                                                <td style={{ padding: "16px 18px" }}><div style={{ color: c.estado==='Activa'?'#4ade80':G.muted, fontSize: 13 }}>● {c.estado}</div><div style={{ fontSize: 12, color: G.muted }}>Pto: {fmt(c.presupuesto_mensual)}</div></td>
                                                <td style={{ padding: "16px 18px", fontFamily: "Georgia" }}>{fmt(cGasto)}</td>
                                                <td style={{ padding: "16px 18px" }}>{!isViewer && (<><button onClick={() => { setEditCampId(c.id); setCampForm({ nombre: c.nombre, estado: c.estado, presupuesto_mensual: c.presupuesto_mensual, ...conf }); setShowCampaignModal(true); }} style={{ background: "transparent", border: "none", color: G.cyan, cursor: "pointer", fontSize: 12, marginRight: 15 }}>Editar</button>{isAdmin && <button onClick={() => deleteCampaign(c.id)} style={{ background: "transparent", border: "none", color: G.red, cursor: "pointer", fontSize: 12 }}>Eliminar</button>}</>)}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {view === "metrics" && (
                        <div style={{ animation: "fadeIn 0.3s" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                                <div style={{ fontSize: 18, fontWeight: 600 }}>Bitácora de Resultados</div>
                                {!isViewer && <button onClick={() => { setEditMetricId(null); setMetricForm({ fecha: new Date().toISOString().slice(0, 10) }); setShowMetricModal(true); }} style={{ ...css.btn(G.gMagenta) }}>+ Alimentar Bitácora</button>}
                            </div>
                            <table style={{ width: "100%", borderCollapse: "collapse", background: G.bgCard, borderRadius: 16, overflow: "hidden", border: `1px solid ${G.border}` }}>
                                <thead style={{ background: "rgba(0,0,0,0.3)" }}>
                                    <tr>{['Fecha','Origen','Gasto','Leads','Retorno','Campos Custom','Acciones'].map(h => <th key={h} style={{ padding: "14px 15px", textAlign: "left", fontSize:11, color:G.muted, textTransform:"uppercase" }}>{h}</th>)}</tr>
                                </thead>
                                <tbody>
                                    {metrics.map(m => {
                                        const stdKeys = ['gasto', 'leads', 'ingresos'];
                                        const met = m.metrics || {};
                                        const custEntries = Object.entries(met).filter(([k,v]) => !stdKeys.includes(k) && v !== '');
                                        return (
                                            <tr key={m.id} style={{ borderBottom: `1px solid ${G.border}`}}>
                                                <td style={{ padding: "14px 15px", fontWeight: 600, color: G.cyan }}>{new Date(m.fecha + 'T12:00:00').toLocaleDateString('es-MX', { weekday:'short', day:'numeric', month:'short' })}</td>
                                                <td style={{ padding: "14px 15px", fontSize: 13 }}><div style={{ display: "flex", gap: 6 }}><span style={{ width:8, height:8, borderRadius:'50%', background: getCampColor(m.campaign_id) }}></span>{getCampName(m.campaign_id)}</div></td>
                                                <td style={{ padding: "14px 15px", fontFamily:"Georgia" }}>{fmt(met.gasto)}</td>
                                                <td style={{ padding: "14px 15px", fontFamily:"Georgia" }}>{fmtN(met.leads)}</td>
                                                <td style={{ padding: "14px 15px", fontFamily:"Georgia", color: met.ingresos > 0 ? '#4ade80' : 'inherit' }}>{fmt(met.ingresos)}</td>
                                                <td style={{ padding: "14px 15px", fontSize: 11, color: G.muted }}><div style={{display:'flex', gap:5, flexWrap:'wrap'}}>{custEntries.map(([k,v]) => <span key={k} style={{background:'rgba(255,255,255,0.05)', padding:'2px 6px', borderRadius:4}}>{k}: {fmtN(v)}</span>)}</div></td>
                                                <td style={{ padding: "14px 15px" }}>{!isViewer && (<><button onClick={() => { setEditMetricId(m.id); setMetricForm({ campaign_id: m.campaign_id, fecha: m.fecha, ...met }); setShowMetricModal(true); }} style={{ background: "transparent", border: "none", color: G.white, cursor: "pointer", fontSize: 12, marginRight: 10 }}>Editar</button>{isAdmin && <button onClick={() => deleteMetric(m.id)} style={{ background: "transparent", border: "none", color: G.red, cursor: "pointer", fontSize: 12 }}>✕</button>}</>)}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {view === "config" && isAdmin && (
                        <div style={{ maxWidth: 800, animation: "fadeIn 0.3s" }}>
                            <div style={{ fontSize: 20, marginBottom: 5, fontWeight: 600 }}>Diccionarios y Alertas Centralizadas</div>
                            <div style={{ color: G.muted, fontSize: 13, marginBottom: 25 }}>Parámetros maestros para alimentar los sub-módulos.</div>
                            
                            <div style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${G.border}`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
                                <div style={{ fontSize: 14, color: G.red, fontWeight: 700, marginBottom: 15 }}>🚨 LÍMITES GLOBALES PARA AVISOS EN EL DASHBOARD</div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                    <div>
                                        <label style={css.label}>CPL Límite Global ($)</label>
                                        <input type="number" style={css.input} value={configInputs.alertas?.cpl_max ?? (globalConfig.alertas?.cpl_max || 50)} onChange={e => setConfigInputs({...configInputs, alertas: {...(configInputs.alertas||globalConfig.alertas), cpl_max: e.target.value}})} placeholder="Ej. 100" />
                                    </div>
                                    <div>
                                        <label style={css.label}>ROAS Mínimo Global (Ej. 2 = 2x)</label>
                                        <input type="number" step="0.1" style={css.input} value={configInputs.alertas?.roas_min ?? (globalConfig.alertas?.roas_min || 1.5)} onChange={e => setConfigInputs({...configInputs, alertas: {...(configInputs.alertas||globalConfig.alertas), roas_min: e.target.value}})} placeholder="Ej. 1.5" />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                                {["plataformas", "objetivos", "fases", "origenes"].map(key => (
                                    <div key={key} style={{ background: "rgba(0,0,0,0.2)", padding: 20, borderRadius: 16, border: `1px solid ${G.border}` }}>
                                        <label style={{ display: "block", fontSize: 11, textTransform: "uppercase", color: G.cyan, fontWeight:700, marginBottom: 12, letterSpacing: 1 }}>{key}</label>
                                        <textarea style={{...css.input, minHeight: 70, fontSize:13, lineHeight: 1.5}} value={configInputs[key] ?? (globalConfig[key] || []).join(", ")} onChange={(e) => setConfigInputs({ ...configInputs, [key]: e.target.value })} />
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => saveOptions()} style={{ ...css.btn(G.gCyan), fontSize: 14 }}>💾 Sincronizar Cambios de Base de Datos</button>
                        </div>
                    )}
                </>
            )}

            {/* MODALS REFINADOS MISMOS CONTENIDOS CON ESTILOS GLOW */}
            {showCampaignModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
                    <div style={{ ...css.cardGlow, padding: 35, width: 500, border: `1px solid ${G.borderHi}`, animation: "scaleIn 0.2s ease-out" }}>
                        <div style={{ fontSize: 20, marginBottom: 25, fontWeight:700, color: G.white }}>{editCampId ? "Modificar Estructura" : "Crear Nueva Arquitectura"}</div>
                        <form onSubmit={handleSaveCampaign} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                            <div><label style={css.label}>Identificador Interno</label><input required style={css.input} value={campForm.nombre || ""} onChange={e => setCampForm({...campForm, nombre: e.target.value})} placeholder="Ej. Lanzamiento" /></div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
                                <div><label style={css.label}>Tráfico</label><select style={css.input} value={campForm.plataforma || ""} onChange={e => setCampForm({...campForm, plataforma: e.target.value})}><option value="">Select...</option>{(globalConfig.plataformas || []).map(o => <option key={o} value={o}>{o}</option>)}</select></div>
                                <div><label style={css.label}>Propósito</label><select style={css.input} value={campForm.objetivo || ""} onChange={e => setCampForm({...campForm, objetivo: e.target.value})}><option value="">Select...</option>{(globalConfig.objetivos || []).map(o => <option key={o} value={o}>{o}</option>)}</select></div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
                                <div><label style={css.label}>Estatus</label><select style={{...css.input, color: campForm.estado==='Activa'?'#4ade80':'inherit'}} value={campForm.estado || "Activa"} onChange={e => setCampForm({...campForm, estado: e.target.value})}><option value="Activa">Activa</option><option value="Pausada">Pausada</option><option value="Terminada">Terminada</option></select></div>
                                <div><label style={css.label}>Pto Mensual Estimado</label><input type="number" step="0.01" style={css.input} value={campForm.presupuesto_mensual || ""} onChange={e => setCampForm({...campForm, presupuesto_mensual: e.target.value})} placeholder="$" /></div>
                            </div>

                            <div style={{ marginTop: 15, background: "rgba(0,0,0,0.3)", padding: 15, borderRadius: 12, border: `1px solid ${G.border}` }}>
                                <label style={{ ...css.label, color: G.red }}>Límite Exclusivo de Campaña (Opcional)</label>
                                <div>
                                    <input type="number" style={css.input} placeholder={`CPL Límite Estricto para [${campForm.nombre||'Campaña'}]`} value={campForm.limite_cpl || ""} onChange={e => setCampForm({...campForm, limite_cpl: e.target.value})} />
                                    <div style={{fontSize:10, color: G.muted, marginTop:4}}>Si dejas esto en blanco usará la configuración Global.</div>
                                </div>
                            </div>

                            <div style={{ marginTop: 15, background: "rgba(0,0,0,0.3)", padding: 15, borderRadius: 12, border: `1px solid ${G.border}` }}>
                                <label style={{ ...css.label, color: G.cyan }}>Data Custom (JSONB Payload)</label>
                                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                                    <input style={{...css.input, flex:1}} placeholder="Key" id="customKeyCamp" />
                                    <input style={{...css.input, flex:1}} placeholder="Valor" id="customValCamp" />
                                    <button type="button" onClick={() => { const k = document.getElementById('customKeyCamp').value; const v = document.getElementById('customValCamp').value; if (k && v) { setCampForm({...campForm, [k]: v}); document.getElementById('customKeyCamp').value=''; document.getElementById('customValCamp').value=''; } }} style={{...css.btn(G.gPurple), padding:"0 12px"}}>+</button>
                                </div>
                                {Object.keys(campForm).filter(k => !['nombre','plataforma','objetivo','fase','origen','estado','presupuesto_mensual','limite_cpl'].includes(k)).map(k => (
                                    <div key={k} style={{fontSize: 12, color: G.white, marginTop: 5, display:'flex', alignItems:'center'}}>• {k}: {campForm[k]} <button type="button" onClick={()=>{const n={...campForm};delete n[k];setCampForm(n)}} style={{background:"none",border:"none",color:G.red,cursor:"pointer",marginLeft:10}}>✕</button></div>
                                ))}
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 15, marginTop: 15 }}>
                                <button type="button" onClick={() => setShowCampaignModal(false)} style={{ background: "transparent", color: G.muted, border: "none", cursor: "pointer", fontWeight:600 }}>Cancelar</button>
                                <button type="submit" style={css.btn(G.gCyan)}>Establecer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showMetricModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
                    <div style={{ ...css.cardGlow, padding: 35, width: 450, border: `1px solid ${G.borderHi}`, animation: "scaleIn 0.2s ease-out" }}>
                        <div style={{ fontSize: 20, marginBottom: 25, fontWeight:700, color: G.white }}>{editMetricId ? "Alterar Registro" : "Inyección de Datos (Día)"}</div>
                        <form onSubmit={handleSaveMetric} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                            <div><label style={css.label}>Campaña Origen</label><select required style={css.input} value={metricForm.campaign_id || ""} onChange={e => setMetricForm({...metricForm, campaign_id: e.target.value})}><option value="">Select...</option>{campaigns.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}</select></div>
                            <div><label style={css.label}>Fecha Operativa</label><input type="date" required style={{...css.input, colorScheme: "dark"}} value={metricForm.fecha || ""} onChange={e => setMetricForm({...metricForm, fecha: e.target.value})} /></div>
                            
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                <div><label style={css.label}>Alcance Total</label><input type="number" style={css.input} value={metricForm.alcance !== undefined ? metricForm.alcance : ""} onChange={e => setMetricForm({...metricForm, alcance: e.target.value})} /></div>
                                <div><label style={css.label}>Clics Link</label><input type="number" style={css.input} value={metricForm.clics !== undefined ? metricForm.clics : ""} onChange={e => setMetricForm({...metricForm, clics: e.target.value})} /></div>
                            </div>
                            
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop:10 }}>
                                <div><label style={css.label}>Gasto ($)</label><input type="number" step="0.01" style={css.input} value={metricForm.gasto !== undefined ? metricForm.gasto : ""} onChange={e => setMetricForm({...metricForm, gasto: e.target.value})} /></div>
                                <div><label style={css.label}>Leads (#)</label><input type="number" style={css.input} value={metricForm.leads !== undefined ? metricForm.leads : ""} onChange={e => setMetricForm({...metricForm, leads: e.target.value})} /></div>
                                <div><label style={css.label}>Ingresos ($)</label><input type="number" step="0.01" style={css.input} value={metricForm.ingresos !== undefined ? metricForm.ingresos : ""} onChange={e => setMetricForm({...metricForm, ingresos: e.target.value})} /></div>
                            </div>

                            <div style={{ marginTop: 15, background: "rgba(0,0,0,0.3)", padding: 15, borderRadius: 12, border: `1px solid ${G.border}` }}>
                                <label style={{ ...css.label, color: G.magenta }}>Inyección Dinámica Adicional</label>
                                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                                    <input style={{...css.input, flex:2}} placeholder="Métrica (Ej. visualizaciones)" id="customKeyMet" />
                                    <input style={{...css.input, flex:1}} placeholder="Valor" id="customValMet" />
                                    <button type="button" onClick={() => { const k = document.getElementById('customKeyMet').value.toLowerCase().replace(/ /g,'_'); const v = document.getElementById('customValMet').value; if (k && v) { setMetricForm({...metricForm, [k]: v}); document.getElementById('customKeyMet').value=''; document.getElementById('customValMet').value=''; } }} style={{...css.btn(G.gPurple), padding:"0 12px"}}>+</button>
                                </div>
                                {Object.keys(metricForm).filter(k => !['campaign_id','fecha','gasto','leads','ingresos','alcance','clics'].includes(k)).map(k => (
                                    <div key={k} style={{fontSize: 12, color: G.white, marginTop: 5, display:'flex', alignItems:'center'}}>• {k}: {metricForm[k]} <button type="button" onClick={()=>{const n={...metricForm};delete n[k];setMetricForm(n)}} style={{background:"none",border:"none",color:G.red,cursor:"pointer",marginLeft:10}}>✕</button></div>
                                ))}
                            </div>

                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 15, marginTop: 25 }}>
                                <button type="button" onClick={() => setShowMetricModal(false)} style={{ background: "transparent", color: G.muted, border: "none", cursor: "pointer", fontWeight:600 }}>Cerrar</button>
                                <button type="submit" style={css.btn(G.gMagenta)}>Disparar Datos</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

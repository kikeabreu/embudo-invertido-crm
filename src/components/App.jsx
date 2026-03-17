"use client";

import { useState, useEffect } from "react";
import { G, css, uid, USERS, BANCO_TEMPLATE, mkLog } from "@/lib/constants";
import { useToast, Toasts } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/Confirm";
import BrokerList from "@/components/BrokerList";
import LoginScreen from "@/components/LoginScreen";
import { GText, PBar } from "@/components/ui/UIUtils";

// Tabs
import BancoTab from "@/components/tabs/BancoTab";
import SecuenciasTab from "@/components/tabs/SecuenciasTab";
import InstalacionTab from "@/components/tabs/InstalacionTab";
import OnboardingTab from "@/components/tabs/OnboardingTab";
import OfertaTab from "@/components/tabs/OfertaTab";
import AnalyticsTab from "@/components/tabs/AnalyticsTab";
import HistorialTab from "@/components/tabs/HistorialTab";

// Local storage helper (temporary until Supabase)
import { stor } from "@/lib/constants";
import PieceModal from "./ui/PieceModal";

const MES_TEMPLATE = () => ({
    id: uid(),
    label: `Mes ${new Date().toLocaleString("es-MX", { month: "long", year: "numeric" })}`,
    piezas: BANCO_TEMPLATE.map(p => ({ ...p, id: uid() })),
    onbChecked: {},
    secuencias: { ciclos: [], activoCicloId: null },
});

export default function App() {
    const { toasts, show: toast } = useToast();
    const { confirm, ConfirmUI } = useConfirm();
    const [screen, setScreen] = useState("loading");
    const [user, setUser] = useState(null);
    const [brokers, setBrokers] = useState([]);
    const [activeBrokerId, setActiveBrokerId] = useState(null);
    const [bd, setBd] = useState(null);
    const [activeMesId, setActiveMesId] = useState(null);
    const [logs, setLogs] = useState([]);
    const [tab, setTab] = useState("banco");
    const [showNewMes, setShowNewMes] = useState(false);
    const [newMesLabel, setNewMesLabel] = useState("");

    useEffect(() => {
        Promise.all([stor("get", "eiiBrokers"), stor("get", "eiiLogs")]).then(([b, l]) => {
            setBrokers(b || []); setLogs(l || []); setScreen("login");
        });
    }, []);

    const addLog = async (entry) => {
        const updated = [entry, ...logs].slice(0, 500);
        setLogs(updated); await stor("set", "eiiLogs", updated);
    };

    const selectBroker = async (id) => {
        const d = await stor("get", `eiiBD_${id}`);
        const data = { instalChecked: {}, vars: {}, meses: [], ...(d || {}) };
        if (data.meses.length === 0) {
            const m = MES_TEMPLATE();
            data.meses = [m];
        }
        // Ensure secuencias key exists on all meses
        data.meses = data.meses.map(m => ({
            secuencias: { ciclos: [], activoCicloId: null },
            ...m,
        }));
        setBd(data);
        setActiveBrokerId(id);
        setActiveMesId(data.meses[data.meses.length - 1].id);
        setTab("banco");
        setScreen("app");
    };

    const createBroker = async (name) => {
        const id = `b_${Date.now()}`;
        const upd = [...brokers, { id, name }];
        setBrokers(upd); await stor("set", "eiiBrokers", upd);
        await addLog(mkLog(user, name, "—", "crear", `Creó el broker "${name}"`));
        await selectBroker(id);
    };

    const deleteBroker = async (id) => {
        const b = brokers.find(x => x.id === id);
        const ok = await confirm(`¿Eliminar broker "${b?.name}"?`, "Se eliminará todo su contenido. Esta acción no se puede deshacer.", "Sí, eliminar");
        if (!ok) return;
        const upd = brokers.filter(x => x.id !== id);
        setBrokers(upd); await stor("set", "eiiBrokers", upd);
        try { await stor("set", `eiiBD_${id}`, null); } catch { } // Note: using stor set null instead of delete for localforage wrapper
        await addLog(mkLog(user, b?.name || id, "—", "eliminar", `Eliminó el broker "${b?.name}"`));
        toast(`Broker "${b?.name}" eliminado`, "warn");
    };

    const persist = async (next) => { setBd(next); await stor("set", `eiiBD_${activeBrokerId}`, next); };

    const broker = brokers.find(b => b.id === activeBrokerId);
    const mes = bd?.meses?.find(m => m.id === activeMesId);
    const mesLabel = mes?.label || "";
    const isViewer = user?.role === "Viewer";
    const isAdmin = user?.role === "Admin";
    const canEdit = user?.role === "Admin" || user?.role === "Editor";
    const canDelete = user?.role === "Admin" || user?.role === "Editor";

    const updateMes = async (updMes, logEntry = null) => {
        const meses = bd.meses.map(m => m.id === activeMesId ? updMes : m);
        await persist({ ...bd, meses });
        if (logEntry) await addLog(logEntry);
    };

    const savePieza = async (pieza) => {
        const old = mes.piezas.find(p => p.id === pieza.id);
        const changes = [];
        if (old) {
            const fields = { titulo: "Título", copy: "Copy", guion: "Guión", instrucciones: "Instrucciones", notasInternas: "Notas", linkRecursos: "Link recursos", linkFinal: "Link final", fechaProg: "Fecha programada", formato: "Formato", linkEvidencia: "Evidencia" };
            Object.entries(fields).forEach(([k, l]) => { if ((old[k] || "") !== (pieza[k] || "")) changes.push(`${l} actualizado`); });
            if (old.estado !== pieza.estado) changes.push(`Estado: "${old.estado}" → "${pieza.estado}"`);
        }
        const updMes = { ...mes, piezas: mes.piezas.map(p => p.id === pieza.id ? pieza : p) };
        await updateMes(updMes, changes.length ? mkLog(user, broker?.name, mesLabel, "banco", changes.join(" · "), pieza.id, pieza.titulo) : null);
        toast("Pieza guardada correctamente");
    };

    const addPieza = async (pieza) => {
        const updMes = { ...mes, piezas: [...mes.piezas, pieza] };
        await updateMes(updMes, mkLog(user, broker?.name, mesLabel, "banco", `Agregó pieza: "${pieza.titulo}"`, pieza.id, pieza.titulo));
        toast(`Pieza "${pieza.titulo}" agregada al Banco`);
    };

    const deletePieza = async (id) => {
        const p = mes.piezas.find(x => x.id === id);
        const ok = await confirm(`¿Eliminar esta pieza?`, `"${p?.titulo}"`, "Sí, eliminar");
        if (!ok) return;
        const updMes = { ...mes, piezas: mes.piezas.filter(x => x.id !== id) };
        await updateMes(updMes, mkLog(user, broker?.name, mesLabel, "eliminar", `Eliminó pieza: "${p?.titulo}"`, id, p?.titulo));
        toast(`Pieza eliminada`, "warn");
    };

    const toggleInstal = async (id) => {
        const newVal = !bd.instalChecked?.[id];
        // Re-import INSTALACION_SECTIONS if needed here or use from constants
        import("@/lib/constants").then(({ INSTALACION_SECTIONS }) => {
            const item = INSTALACION_SECTIONS.flatMap(s => s.items).find(i => i.id === id);
            persist({ ...bd, instalChecked: { ...bd.instalChecked, [id]: newVal } }).then(() => {
                addLog(mkLog(user, broker?.name, "—", "instalacion", `${newVal ? "Marcó" : "Desmarcó"} "${item?.text}"`));
                if (newVal) toast(`✓ ${item?.text?.slice(0, 40)}…`);
            });
        });
    };

    const toggleOnb = async (id) => {
        const newVal = !mes.onbChecked?.[id];
        import("@/lib/constants").then(({ ONBOARDING_STEPS }) => {
            const item = ONBOARDING_STEPS.flatMap(s => s.items).find(i => i.id === id);
            const updMes = { ...mes, onbChecked: { ...mes.onbChecked, [id]: newVal } };
            updateMes(updMes, mkLog(user, broker?.name, mesLabel, "onboarding", `${newVal ? "Completó" : "Desmarcó"} "${item?.text}"`));
        });
    };

    const updateVar = async (k, v) => {
        await persist({ ...bd, vars: { ...bd.vars, [k]: v } });
    };

    const saveSecuencias = async (updatedSeq) => {
        const updMes = { ...mes, secuencias: updatedSeq };
        await updateMes(updMes);
    };

    // Crear borrador en Banco desde una secuencia
    const crearPiezaDesdeSecuencia = async (piezaData, diaNum, cicloId) => {
        const nuevaPieza = {
            id: uid(),
            num: mes.piezas.length + 1,
            titulo: piezaData.titulo,
            hook: piezaData.hook || piezaData.titulo,
            fase: piezaData.fase,
            formato: piezaData.formato,
            avatar: "Todos",
            dolor: "",
            ctaDm: "",
            estado: "En cola",
            copy: piezaData.copy || "",
            guion: "",
            fechaProg: piezaData.fechaProg || "",
            instrucciones: "",
            notasInternas: `Desde Secuencia — Día ${diaNum} · Ciclo: ${cicloId}`,
            linkRecursos: "",
            linkFinal: "",
            linkEvidencia: "",
            origen: "secuencia",
            origenRef: `${cicloId}:${diaNum}`,
        };
        // Guardar pieza en banco
        const updMesBanco = { ...mes, piezas: [...mes.piezas, nuevaPieza] };
        // Guardar referencia bancoPiezaId en el día del ciclo
        const ciclosActualizados = (mes.secuencias?.ciclos || []).map(c =>
            c.id === cicloId ? { ...c, dias: { ...c.dias, [diaNum]: { ...(c.dias?.[diaNum] || {}), bancoPiezaId: nuevaPieza.id } } } : c
        );
        const updMesFinal = { ...updMesBanco, secuencias: { ...mes.secuencias, ciclos: ciclosActualizados } };
        await updateMes(updMesFinal, mkLog(user, broker?.name, mesLabel, "secuencias", `Creó borrador en Banco desde Día ${diaNum}: "${nuevaPieza.titulo}"`));
        toast(`📋 Borrador "${nuevaPieza.titulo}" creado en Banco`, "info");
    };

    // Crear historia en Banco desde el tracker de historias
    const crearHistoriaEnBanco = async (historia, diaNum, cicloId) => {
        // Get the cycle label and day fecha from the active cycle
        const cicloRef = (mes.secuencias?.ciclos || []).find(c => c.id === cicloId);
        const diaRef = cicloRef?.dias?.[diaNum] || {};
        const nuevaPieza = {
            id: uid(),
            num: mes.piezas.length + 1,
            titulo: `Historia D${diaNum}: ${historia.tipo}`,
            hook: historia.copy ? historia.copy.slice(0, 80) : `Historia del día ${diaNum} — ${historia.tipo}`,
            fase: "Conversión",
            formato: "Historia",
            avatar: "Todos",
            dolor: historia.tipo,
            ctaDm: "",
            estado: "En cola",
            copy: historia.copy || "",
            guion: "",
            fechaProg: diaRef.fechaProg || "",
            instrucciones: [
                historia.hora ? `Hora de publicación: ${historia.hora}` : "",
                `Tipo de historia: ${historia.tipo}`,
                diaRef.nota ? `Nota del día: ${diaRef.nota}` : "",
            ].filter(Boolean).join(" · "),
            notasInternas: `Historia desde Secuencia — Día ${diaNum} · Ciclo: ${cicloId}${cicloRef ? ` (${cicloRef.label})` : ""}`,
            linkRecursos: "",
            linkFinal: "",
            linkEvidencia: historia.linkEvidencia || "",
            origen: "secuencia",
            origenRef: `${cicloId}:${diaNum}:historia:${historia.id}`,
        };
        // Save pieza + mark historia with bancoPiezaId
        const updPiezas = [...mes.piezas, nuevaPieza];
        const ciclosActualizados = (mes.secuencias?.ciclos || []).map(c => {
            if (c.id !== cicloId) return c;
            const diaActual = c.dias?.[diaNum] || {};
            const historiasActualizadas = (diaActual.historias || []).map(h =>
                h.id === historia.id ? { ...h, bancoPiezaId: nuevaPieza.id } : h
            );
            return { ...c, dias: { ...c.dias, [diaNum]: { ...diaActual, historias: historiasActualizadas } } };
        });
        const updMes = { ...mes, piezas: updPiezas, secuencias: { ...mes.secuencias, ciclos: ciclosActualizados } };
        await updateMes(updMes, mkLog(user, broker?.name, mesLabel, "secuencias", `Envió historia al Banco: "${nuevaPieza.titulo}"`));
        toast(`⭕ Historia "${nuevaPieza.titulo}" enviada al Banco`, "info");
    };

    const createMes = async () => {
        if (!newMesLabel.trim()) return;
        const m = { ...MES_TEMPLATE(), label: newMesLabel.trim() };
        const meses = [...bd.meses, m];
        await persist({ ...bd, meses });
        setActiveMesId(m.id);
        setNewMesLabel(""); setShowNewMes(false);
        await addLog(mkLog(user, broker?.name, m.label, "crear", `Abrió nuevo mes: "${m.label}"`))
        toast(`Mes "${m.label}" creado`, "info");
    };

    const brokerLogs = logs.filter(l => l.brokerName === broker?.name);

    if (screen === "loading") return <div style={{ minHeight: "100vh", background: G.bg, display: "flex", alignItems: "center", justifyContent: "center", color: G.dimmed, fontFamily: "sans-serif", fontSize: 11, letterSpacing: 3 }}>CARGANDO...</div>;
    if (screen === "login") return <LoginScreen onLogin={u => { setUser(u); setScreen("list"); }} />;
    if (screen === "list") return <BrokerList brokers={brokers} onSelect={selectBroker} onCreate={createBroker} onDelete={deleteBroker} />;
    if (!bd || !mes) return null;

    const TABS = [
        { k: "banco", l: "📋 Banco" },
        { k: "secuencias", l: "📅 Secuencias" },
        { k: "instalacion", l: "⚡ Instalación" },
        { k: "onboarding", l: "🚀 Onboarding" },
        { k: "oferta", l: "💎 Oferta" },
        { k: "analitica", l: "📊 Analítica" },
        { k: "historial", l: "🕐 Historial" },
    ];

    const pubPct = pct(mes.piezas.filter(p => p.estado === "Publicado").length, mes.piezas.length);

    return (
        <div style={{ height: "100vh", background: G.bg, fontFamily: "Georgia,serif", color: G.white, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <Toasts toasts={toasts} />
            {ConfirmUI}
            {/* Header */}
            <header style={{ borderBottom: `1px solid ${G.border}`, padding: "10px 20px", display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)", flexShrink: 0 }}>
                <button onClick={() => setScreen("list")} style={{ background: "transparent", border: `1px solid ${G.border}`, borderRadius: 6, color: G.muted, fontSize: 9, padding: "5px 10px", cursor: "pointer", fontFamily: "sans-serif", letterSpacing: 1 }}>← BROKERS</button>
                <div style={{ width: 1, height: 24, background: G.border }} />
                <div style={{ flex: 1 }}>
                    <GText g={G.gMagenta} size={8} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 1 }}>Embudo Invertido™</GText>
                    <div style={{ fontSize: 14, fontWeight: 700, color: G.white }}>{broker?.name}</div>
                </div>

                {/* Month selector */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: `1px solid ${G.border}`, borderRadius: 10, padding: "6px 10px" }}>
                    <span style={{ fontSize: 9, color: G.muted, fontFamily: "sans-serif", letterSpacing: 1, textTransform: "uppercase" }}>Mes</span>
                    <select value={activeMesId} onChange={e => setActiveMesId(e.target.value)} style={{ background: "transparent", border: "none", color: G.purpleHi, fontSize: 11, fontFamily: "sans-serif", cursor: "pointer", outline: "none" }}>
                        {bd.meses.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                    </select>
                    {!isViewer && (
                        showNewMes
                            ? <div style={{ display: "flex", gap: 6 }}>
                                <input value={newMesLabel} onChange={e => setNewMesLabel(e.target.value)} onKeyDown={e => e.key === "Enter" && createMes()} placeholder="Ej: Febrero 2025" autoFocus style={{ ...css.input, width: 140, fontSize: 11, padding: "4px 8px" }} />
                                <button onClick={createMes} style={{ ...css.btn(G.gGreen), padding: "4px 10px", fontSize: 10 }}>✓</button>
                                <button onClick={() => setShowNewMes(false)} style={{ background: "transparent", border: `1px solid ${G.border}`, borderRadius: 6, color: G.muted, padding: "4px 8px", cursor: "pointer", fontSize: 10 }}>✕</button>
                            </div>
                            : <button onClick={() => setShowNewMes(true)} style={{ background: G.gPurple, border: "none", borderRadius: 6, color: G.white, padding: "4px 10px", cursor: "pointer", fontSize: 10, fontFamily: "sans-serif", fontWeight: 700 }}>+ Mes</button>
                    )}
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                    {TABS.map(t => (
                        <button key={t.k} onClick={() => setTab(t.k)} style={{ background: tab === t.k ? G.purpleDim : "transparent", border: `1px solid ${tab === t.k ? G.borderHi : G.border}`, borderRadius: 8, color: tab === t.k ? G.purpleHi : G.muted, fontSize: 10, padding: "6px 12px", cursor: "pointer", fontFamily: "sans-serif", transition: "all 0.15s" }}>
                            {t.l}{t.k === "historial" && brokerLogs.length > 0 ? <span style={{ marginLeft: 4, fontSize: 8, color: G.orange }}>({brokerLogs.length})</span> : ""}
                        </button>
                    ))}
                </div>

                {/* Progress + user */}
                <div style={{ width: 1, height: 24, background: G.border }} />
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 8, color: G.muted, fontFamily: "sans-serif", letterSpacing: 1, textTransform: "uppercase" }}>Publicado</span>
                        <div style={{ width: 50, height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                            <div style={{ width: `${pubPct}%`, height: "100%", background: G.gGreen, transition: "width 0.4s" }} />
                        </div>
                        <GText g={G.gGreen} size={10}>{pubPct}%</GText>
                    </div>
                    <div style={{ width: 1, height: 20, background: G.border }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ width: 26, height: 26, borderRadius: 20, background: G.gPurple, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 10px rgba(124,58,237,0.3)" }}>
                            <span style={{ fontSize: 11, color: G.white, fontWeight: 700 }}>{user?.name[0]}</span>
                        </div>
                        <span style={{ fontSize: 10, color: G.muted, fontFamily: "sans-serif" }}>{user?.name}</span>
                        <button onClick={() => { setUser(null); setScreen("login"); }} style={{ background: "transparent", border: `1px solid ${G.border}`, borderRadius: 5, color: G.dimmed, fontSize: 9, padding: "3px 7px", cursor: "pointer", fontFamily: "sans-serif" }}>salir</button>
                    </div>
                </div>
            </header>

            <div style={{ flex: 1, overflow: "hidden" }}>
                {tab === "banco" && <BancoTab piezas={mes.piezas} onSave={savePieza} onAdd={addPieza} onDelete={deletePieza} isViewer={isViewer} canEdit={canEdit} canDelete={canDelete} logs={brokerLogs} toast={toast} userRole={user?.role} />}
                {tab === "secuencias" && <SecuenciasTab data={mes.secuencias || { ciclos: [], activoCicloId: null }} onSave={saveSecuencias} isViewer={isViewer} onCrearEnBanco={crearPiezaDesdeSecuencia} onEnviarHistoriaAlBanco={crearHistoriaEnBanco} toast={toast} />}
                {tab === "instalacion" && <InstalacionTab data={bd} vars={bd.vars} onToggle={toggleInstal} onVarChange={updateVar} />}
                {tab === "onboarding" && <OnboardingTab checked={mes.onbChecked} onToggle={toggleOnb} mesLabel={mesLabel} toast={toast} />}
                {tab === "oferta" && <OfertaTab />}
                {tab === "analitica" && <AnalyticsTab piezas={mes.piezas} instalChecked={bd.instalChecked} onbChecked={mes.onbChecked} broker={broker} seqData={mes.secuencias || { ciclos: [] }} />}
                {tab === "historial" && <HistorialTab logs={brokerLogs} />}
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { G, css } from "@/lib/constants";
import { GText, PBar } from "@/components/ui/UIUtils";
import { useToast, Toasts } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";

// Tabs
import BancoTab from "@/components/tabs/BancoTab";
import SecuenciasTab from "@/components/tabs/SecuenciasTab";
import InstalacionTab from "@/components/tabs/InstalacionTab";
import OnboardingTab from "@/components/tabs/OnboardingTab";
import OfertaTab from "@/components/tabs/OfertaTab";
import AnalyticsTab from "@/components/tabs/AnalyticsTab";
import HistorialTab from "@/components/tabs/HistorialTab";
import AdminTab from "@/components/tabs/AdminTab";

export default function BrokerDashboard() {
    const params = useParams();
    const brokerId = params?.id;
    const router = useRouter();

    const [currentUser, setCurrentUser] = useState(null);
    const [broker, setBroker] = useState(null);
    const [tab, setTab] = useState("banco");
    const [loading, setLoading] = useState(true);

    // Estados de datos
    const [piezas, setPiezas] = useState([]);
    const [logs, setLogs] = useState([]);
    const [instalChecked, setInstalChecked] = useState({});
    const [onbChecked, setOnbChecked] = useState({});
    const [vars, setVars] = useState({});
    const [secuencias, setSecuencias] = useState({ ciclos: [], activoCicloId: null });

    const { toasts, show: toast } = useToast();
    const { confirm, ConfirmUI } = useConfirm();

    useEffect(() => {
        if (!brokerId) return;
        loadAllData();
    }, [brokerId]);

    const loadAllData = async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push("/");
            return;
        }
        const { data: profile } = await supabase.from('usuarios').select('*').eq('id', session.user.id).single();
        setCurrentUser(profile);

        const { data: brokerData } = await supabase.from('usuarios').select('*').eq('id', brokerId).single();
        if (!brokerData) {
            toast("Broker no encontrado", "error");
            router.push("/dashboard");
            return;
        }
        setBroker(brokerData);
        setInstalChecked(brokerData.instalacion_checked || {});
        setOnbChecked(brokerData.onboarding_checked || {});
        setVars(brokerData.broker_vars || {});
        setSecuencias(brokerData.secuencias_data || { ciclos: [], activoCicloId: null });

        const { data: pz } = await supabase.from('piezas_banco').select('*').eq('broker_id', brokerId);
        const mappedPiezas = (pz || []).map(p => {
            let parsedAnotaciones = [];
            try { parsedAnotaciones = JSON.parse(p.anotaciones || '[]'); } catch (e) { }
            return {
                ...p,
                copy: p.cuerpo || "",
                linkRecursos: p.recursos_url || "",
                linkFinal: p.link_final || "",
                ctaDm: p.cta_dm || "",
                fechaProg: p.fecha_prog || "",
                guion: p.guion || "",
                instrucciones: p.instrucciones || "",
                notasInternas: p.notas_internas || "",
                anotaciones: parsedAnotaciones
            };
        });
        setPiezas(mappedPiezas);

        const { data: lgs } = await supabase.from('logs').select('*').eq('broker_id', brokerId).order('created_at', { ascending: false }).limit(200);
        setLogs(lgs || []);
        setLoading(false);
    };

    const isAdmin = currentUser?.rol === 'Admin';
    const isEquipo = currentUser?.rol === 'Equipo';
    const isBroker = currentUser?.rol === 'Broker';
    const isCoordinador = currentUser?.rol === 'Coordinador';
    const canEdit = isAdmin || isEquipo || currentUser?.id === brokerId || (isCoordinador && currentUser?.parent_id === brokerId);
    const canDelete = isAdmin || isEquipo;

    const TABS = [
        { k: "banco", l: "📋 Banco" },
        { k: "secuencias", l: "📅 Secuencias" },
        { k: "instalacion", l: "⚡ Instalación" },
        { k: "onboarding", l: "🚀 Onboarding" },
        { k: "oferta", l: "💎 Oferta" },
        { k: "analitica", l: "📊 Analítica" },
        { k: "historial", l: "🕐 Historial" },
    ].filter(t => {
        if (t.k === "oferta" && isEquipo) return false;
        if (t.k === "secuencias" && (isBroker || isCoordinador)) return false;
        return true;
    });
    if (isAdmin) TABS.push({ k: "admin", l: "⚙️ Admin" });

    useEffect(() => {
        if (!TABS.find(t => t.k === tab)) {
            setTab("banco");
        }
    }, [currentUser, brokerId, tab]);

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", background: G.bg, display: "flex", alignItems: "center", justifyContent: "center", color: G.dimmed, fontFamily: "sans-serif", fontSize: 11, letterSpacing: 3 }}>
                CARGANDO...
            </div>
        );
    }

    const isViewer = currentUser?.rol === 'Broker' && currentUser.id !== brokerId;

    const addLog = async (tipo, descripcion, pieza_id = null) => {
        const actor = currentUser?.nombre || currentUser?.email || 'Sistema';
        const { data, error } = await supabase.from('logs').insert({
            broker_id: brokerId, tipo, descripcion, pieza_id, actor_nombre: actor
        }).select('*').single();
        if (data) setLogs(prev => [data, ...prev].slice(0, 200));
    };

    const updateBrokerConfig = async (column, value) => {
        const { error } = await supabase.from('usuarios').update({ [column]: value }).eq('id', brokerId);
        if (error) console.error("Error updating config:", error);
    };

    const savePieza = async (pieza) => {
        if (!canEdit) return;
        const { error } = await supabase.from('piezas_banco').update({
            titulo: pieza.titulo, hook: pieza.hook, fase: pieza.fase, formato: pieza.formato,
            avatar: pieza.avatar, dolor: pieza.dolor, cta_dm: pieza.ctaDm, estado: pieza.estado,
            cuerpo: pieza.copy, recursos_url: pieza.linkRecursos, link_final: pieza.linkFinal,
            guion: pieza.guion, instrucciones: pieza.instrucciones, notas_internas: pieza.notasInternas,
            anotaciones: JSON.stringify(pieza.anotaciones || []),
            fecha_prog: pieza.fechaProg || null
        }).eq('id', pieza.id);
        if (error) { toast("Error al guardar", "error"); return; }
        setPiezas(ps => ps.map(p => p.id === pieza.id ? { ...p, ...pieza } : p));
        toast("Pieza guardada");
        addLog("banco", `Actualizó pieza: "${pieza.titulo}"`, pieza.id);
    };

    const addPieza = async (pieza) => {
        if (!canEdit) return;
        const insertData = {
            broker_id: brokerId,
            titulo: pieza.titulo, hook: pieza.hook, fase: pieza.fase, formato: pieza.formato,
            avatar: pieza.avatar || "", dolor: pieza.dolor || "", cta_dm: pieza.ctaDm || "",
            estado: pieza.estado || 'En cola', cuerpo: pieza.copy || "", recursos_url: pieza.linkRecursos || "",
            link_final: pieza.linkFinal || "", guion: pieza.guion || "", instrucciones: pieza.instrucciones || "",
            notas_internas: pieza.notasInternas || "",
            fecha_prog: pieza.fechaProg || null, anotaciones: "[]"
        };
        const { data, error } = await supabase.from('piezas_banco').insert(insertData).select().single();
        if (error) { toast("Error al agregar", "error"); return; }
        setPiezas(ps => [...ps, { ...pieza, id: data.id, anotaciones: [], copy: pieza.copy || "" }]);
        toast(`Pieza agregada`);
        addLog("banco", `Agregó pieza: "${pieza.titulo}"`, data.id);
    };

    const deletePieza = async (id) => {
        if (!canDelete) return;
        const ok = await confirm(`¿Eliminar esta pieza?`, `Acción irreversible.`, "Eliminar");
        if (!ok) return;
        const { error } = await supabase.from('piezas_banco').delete().eq('id', id);
        if (error) { toast("Error al eliminar", "error"); return; }
        setPiezas(ps => ps.filter(p => p.id !== id));
        toast(`Pieza eliminada`, "warn");
        addLog("eliminar", `Eliminó una pieza`);
    };

    const toggleInstal = async (id) => {
        if (!canEdit) return;
        const newChecked = { ...instalChecked, [id]: !instalChecked[id] };
        setInstalChecked(newChecked);
        await updateBrokerConfig('instalacion_checked', newChecked);
    };

    const updateVar = async (k, v) => {
        if (!canEdit) return;
        const newVars = { ...vars, [k]: v };
        setVars(newVars);
        await updateBrokerConfig('broker_vars', newVars);
    };

    const toggleOnb = async (id) => {
        if (!canEdit) return;
        const newChecked = { ...onbChecked, [id]: !onbChecked[id] };
        setOnbChecked(newChecked);
        await updateBrokerConfig('onboarding_checked', newChecked);
    };

    const saveSecuencias = async (s) => {
        if (!canEdit) return;
        setSecuencias(s);
        await updateBrokerConfig('secuencias_data', s);
    };

    const crearPiezaDesdeSecuencia = async (p, diaNum, cId) => {
        if (!canEdit) return;
        const { data, error } = await supabase.from('piezas_banco').insert({
            broker_id: brokerId, titulo: p.titulo, hook: p.hook || p.titulo, fase: p.fase, formato: p.formato, estado: 'En cola', cuerpo: p.copy || "",
            guion: p.guion || "", instrucciones: p.instrucciones || "", notas_internas: p.notasInternas || ""
        }).select().single();
        if (error) return;
        setPiezas(ps => [...ps, { ...p, id: data.id, copy: p.copy || "" }]);
        const cUpd = secuencias.ciclos.map(c => c.id === cId ? { ...c, dias: { ...c.dias, [diaNum]: { ...(c.dias?.[diaNum] || {}), bancoPiezaId: data.id } } } : c);
        const sUpd = { ...secuencias, ciclos: cUpd };
        setSecuencias(sUpd);
        await updateBrokerConfig('secuencias_data', sUpd);
        toast(`📋 Borrador creado en Banco`);
    };

    const crearHistoriaEnBanco = async (h, diaNum, cId) => {
        if (!canEdit) return;
        const { data, error } = await supabase.from('piezas_banco').insert({
            broker_id: brokerId, titulo: `Historia D${diaNum}: ${h.tipo}`, hook: h.copy?.slice(0,80) || `Historia D${diaNum}`, fase: 'Conversión', formato: 'Historia', estado: 'En cola', cuerpo: h.copy || ""
        }).select().single();
        if (error) return;
        setPiezas(ps => [...ps, { id: data.id, ...h }]);
        const cUpd = secuencias.ciclos.map(c => {
            if (c.id !== cId) return c;
            const diaA = c.dias?.[diaNum] || {};
            const hUpd = (diaA.historias || []).map(x => x.id === h.id ? { ...x, bancoPiezaId: data.id } : x);
            return { ...c, dias: { ...c.dias, [diaNum]: { ...diaA, historias: hUpd } } };
        });
        const sUpd = { ...secuencias, ciclos: cUpd };
        setSecuencias(sUpd);
        await updateBrokerConfig('secuencias_data', sUpd);
        toast(`⭕ Historia enviada al Banco`);
    };

    const renderTabContent = () => {
        switch (tab) {
            case "banco": return <BancoTab piezas={piezas} onSave={savePieza} onAdd={addPieza} onDelete={deletePieza} isViewer={isViewer} canEdit={canEdit} canDelete={canDelete} logs={logs} toast={toast} userRole={currentUser?.rol} brokerId={brokerId} />;
            case "secuencias": return <SecuenciasTab data={secuencias} onSave={saveSecuencias} onCrearEnBanco={crearPiezaDesdeSecuencia} onEnviarHistoriaAlBanco={crearHistoriaEnBanco} isViewer={isViewer} toast={toast} />;
            case "instalacion": return <InstalacionTab data={{ vars, instalChecked }} vars={vars} onToggle={toggleInstal} onVarChange={updateVar} />;
            case "onboarding": return <OnboardingTab checked={onbChecked} onToggle={toggleOnb} mesLabel={"Mes Actual"} toast={toast} />;
            case "oferta": return <OfertaTab brokerId={brokerId} isViewer={isViewer} toast={toast} />;
            case "analitica": return <AnalyticsTab piezas={piezas} instalChecked={instalChecked} onbChecked={onbChecked} broker={broker} seqData={secuencias} />;
            case "historial": return <HistorialTab logs={logs} />;
            case "admin": return isAdmin ? <AdminTab brokerId={brokerId} toast={toast} /> : null;
            default: return null;
        }
    };

    return (
        <div style={{ height: "100%", background: G.bg, fontFamily: "Georgia,serif", color: G.white, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <Toasts toasts={toasts} />
            {ConfirmUI}
            <div style={{ borderBottom: `1px solid ${G.border}`, padding: "10px 20px", display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.01)", flexShrink: 0, flexWrap: "wrap" }}>
                <button onClick={() => router.push("/dashboard")} style={{ background: "transparent", border: `1px solid ${G.border}`, borderRadius: 6, color: G.muted, fontSize: 9, padding: "5px 10px", cursor: "pointer", fontFamily: "sans-serif" }}>← BROKERS</button>
                <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: G.white }}>{broker?.nombre || broker?.email}</div>
                    <div style={{ fontSize: 10, color: G.muted, fontFamily: "sans-serif" }}>Embudo Activo</div>
                </div>
                <div style={{ display: "flex", gap: 3, flexWrap: "wrap", flex: 2, justifyContent: "center" }}>
                    {TABS.map(t => (
                        <button key={t.k} onClick={() => setTab(t.k)} style={{ background: tab === t.k ? G.purpleDim : "transparent", border: `1px solid ${tab === t.k ? G.borderHi : G.border}`, borderRadius: 8, color: tab === t.k ? G.purpleHi : G.muted, fontSize: 10, padding: "6px 12px", cursor: "pointer", fontFamily: "sans-serif", transition: "all 0.15s" }}>{t.l}</button>
                    ))}
                </div>
            </div>
            <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
                {renderTabContent()}
            </div>
        </div>
    );
}

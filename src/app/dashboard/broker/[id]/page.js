"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
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

export default function BrokerDashboard({ params }) {
    const unwrappedParams = use(params);
    const brokerId = unwrappedParams.id;
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
        loadAllData();
    }, [brokerId]);

    const loadAllData = async () => {
        setLoading(true);
        // 1. Sesión actual
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push("/");
            return;
        }
        const { data: profile } = await supabase.from('usuarios').select('*').eq('id', session.user.id).single();
        setCurrentUser(profile);

        // 2. Datos del broker que estamos viendo
        const { data: brokerData } = await supabase.from('usuarios').select('*').eq('id', brokerId).single();
        if (!brokerData) {
            toast("Broker no encontrado", "error");
            router.push("/dashboard");
            return;
        }
        setBroker(brokerData);

        // Parse JSON config
        setInstalChecked(brokerData.instalacion_checked || {});
        setOnbChecked(brokerData.onboarding_checked || {});
        setVars(brokerData.broker_vars || {});
        setSecuencias(brokerData.secuencias_data || { ciclos: [], activoCicloId: null });

        // 3. Cargar Piezas
        const { data: pz } = await supabase.from('piezas_banco').select('*').eq('broker_id', brokerId);
        // Usamos datos extra en un JSON o los mapeamos si son idénticos
        setPiezas(pz || []);

        // 4. Cargar Logs
        const { data: lgs } = await supabase.from('logs').select('*').eq('broker_id', brokerId).order('created_at', { ascending: false }).limit(200);
        setLogs(lgs || []);

        setLoading(false);
    };

    if (loading) {
        return <div style={{ minHeight: "100vh", background: G.bg, display: "flex", alignItems: "center", justifyContent: "center", color: G.dimmed, fontFamily: "sans-serif", fontSize: 11, letterSpacing: 3 }}>CARGANDO...</div>;
    }

    const TABS = [
        { k: "banco", l: "📋 Banco" },
        { k: "secuencias", l: "📅 Secuencias" },
        { k: "instalacion", l: "⚡ Instalación" },
        { k: "onboarding", l: "🚀 Onboarding" },
        { k: "oferta", l: "💎 Oferta" },
        { k: "analitica", l: "📊 Analítica" },
        { k: "historial", l: "🕐 Historial" },
    ];

    if (currentUser?.rol === 'Admin') {
        TABS.push({ k: "admin", l: "⚙️ Admin" });
    }

    const isViewer = currentUser?.rol === 'Broker' && currentUser.id !== brokerId;
    const isAdmin = currentUser?.rol === 'Admin';
    const isEquipo = currentUser?.rol === 'Equipo';
    const canEdit = isAdmin || isEquipo || currentUser?.id === brokerId;
    const canDelete = isAdmin || isEquipo;

    // Helpers para actualizar Supabase
    const addLog = async (tipo, descripcion, pieza_id = null) => {
        const { data, error } = await supabase.from('logs').insert({ broker_id: brokerId, tipo, descripcion, pieza_id }).select('*').single();
        if (data) setLogs(prev => [data, ...prev].slice(0, 200));
    };

    const updateBrokerConfig = async (column, value) => {
        const { error } = await supabase.from('usuarios').update({ [column]: value }).eq('id', brokerId);
        if (error) console.error("Error updating config:", error);
    };

    // Funciones de Banco
    const savePieza = async (pieza) => {
        if (!canEdit) return;
        const { data, error } = await supabase.from('piezas_banco').update({
            titulo: pieza.titulo, hook: pieza.hook, fase: pieza.fase, formato: pieza.formato,
            avatar: pieza.avatar, dolor: pieza.dolor, cta_dm: pieza.ctaDm, estado: pieza.estado,
            cuerpo: pieza.copy, recursos_url: pieza.linkRecursos, anotaciones: JSON.stringify(pieza.anotaciones || [])
        }).eq('id', pieza.id).select().single();

        if (error) { toast("Error al guardar pieza", "error"); return; }

        setPiezas(ps => ps.map(p => p.id === pieza.id ? { ...p, ...pieza } : p));
        toast("Pieza guardada correctamente");
        addLog("banco", `Actualizó pieza: "${pieza.titulo}"`, pieza.id);
    };

    const addPieza = async (pieza) => {
        if (!canEdit) return;
        const insertData = {
            broker_id: brokerId,
            titulo: pieza.titulo, hook: pieza.hook, fase: pieza.fase, formato: pieza.formato,
            avatar: pieza.avatar, dolor: pieza.dolor, cta_dm: pieza.ctaDm, estado: pieza.estado || 'En cola',
            cuerpo: pieza.copy || "", recursos_url: pieza.linkRecursos || "", anotaciones: "[]"
        };
        const { data, error } = await supabase.from('piezas_banco').insert(insertData).select().single();
        if (error) { toast("Error al agregar pieza", "error"); return; }

        setPiezas(ps => [...ps, { ...pieza, id: data.id }]);
        toast(`Pieza "${pieza.titulo}" agregada al Banco`);
        addLog("banco", `Agregó pieza: "${pieza.titulo}"`, data.id);
    };

    const deletePieza = async (id) => {
        if (!canDelete) return;
        const ok = await confirm(`¿Eliminar esta pieza?`, `La pieza se eliminará para siempre.`, "Sí, eliminar");
        if (!ok) return;

        const { error } = await supabase.from('piezas_banco').delete().eq('id', id);
        if (error) { toast("Error al eliminar", "error"); return; }

        setPiezas(ps => ps.filter(p => p.id !== id));
        toast(`Pieza eliminada`, "warn");
        addLog("eliminar", `Eliminó una pieza del banco`);
    };

    // Funciones de Instalacion
    const toggleInstal = async (id) => {
        if (!canEdit) return;
        const newVal = !instalChecked[id];
        const newChecked = { ...instalChecked, [id]: newVal };
        setInstalChecked(newChecked);
        await updateBrokerConfig('instalacion_checked', newChecked);
        addLog("instalacion", `${newVal ? "Completó" : "Desmarcó"} tarea de instalación`);
    };

    const updateVar = async (k, v) => {
        if (!canEdit) return;
        const newVars = { ...vars, [k]: v };
        setVars(newVars);
        await updateBrokerConfig('broker_vars', newVars);
    };

    // Funciones de Onboarding
    const toggleOnb = async (id) => {
        if (!canEdit) return;
        const newVal = !onbChecked[id];
        const newChecked = { ...onbChecked, [id]: newVal };
        setOnbChecked(newChecked);
        await updateBrokerConfig('onboarding_checked', newChecked);
        addLog("onboarding", `${newVal ? "Completó" : "Desmarcó"} tarea de onboarding`);
    };

    // Funciones de Secuencias
    const saveSecuencias = async (updatedSeq) => {
        if (!canEdit) return;
        setSecuencias(updatedSeq);
        await updateBrokerConfig('secuencias_data', updatedSeq);
    };

    const crearPiezaDesdeSecuencia = async (piezaData, diaNum, cicloId) => {
        if (!canEdit) return;
        const insertData = {
            broker_id: brokerId,
            titulo: piezaData.titulo,
            hook: piezaData.hook || piezaData.titulo,
            fase: piezaData.fase,
            formato: piezaData.formato,
            estado: 'En cola',
            cuerpo: piezaData.copy || "",
            anotaciones: "[]"
        };
        const { data, error } = await supabase.from('piezas_banco').insert(insertData).select().single();
        if (error) { toast("Error al crear borrador", "error"); return; }

        const nuevaPieza = { ...piezaData, id: data.id, origen: 'secuencia' };
        setPiezas(ps => [...ps, nuevaPieza]);

        // Update secuencias state with bancoPiezaId
        const ciclosActualizados = secuencias.ciclos.map(c =>
            c.id === cicloId ? { ...c, dias: { ...c.dias, [diaNum]: { ...(c.dias?.[diaNum] || {}), bancoPiezaId: data.id } } } : c
        );
        const updatedSeq = { ...secuencias, ciclos: ciclosActualizados };
        setSecuencias(updatedSeq);
        await updateBrokerConfig('secuencias_data', updatedSeq);

        addLog("secuencias", `Creó borrador en Banco desde Día ${diaNum}: "${piezaData.titulo}"`);
        toast(`📋 Borrador creado en Banco`, "info");
    };

    const crearHistoriaEnBanco = async (historia, diaNum, cicloId) => {
        if (!canEdit) return;
        const insertData = {
            broker_id: brokerId,
            titulo: `Historia D${diaNum}: ${historia.tipo}`,
            hook: historia.copy ? historia.copy.slice(0, 80) : `Historia del día ${diaNum}`,
            fase: 'Conversión',
            formato: 'Historia',
            estado: 'En cola',
            cuerpo: historia.copy || "",
            recursos_url: historia.linkEvidencia || "",
            anotaciones: "[]"
        };
        const { data, error } = await supabase.from('piezas_banco').insert(insertData).select().single();
        if (error) { toast("Error al enviar historia", "error"); return; }

        const nuevaPieza = { id: data.id, titulo: insertData.titulo, fase: insertData.fase, estado: insertData.estado };
        setPiezas(ps => [...ps, nuevaPieza]);

        // Update secuencias state
        const ciclosActualizados = secuencias.ciclos.map(c => {
            if (c.id !== cicloId) return c;
            const diaActual = c.dias?.[diaNum] || {};
            const historiasActualizadas = (diaActual.historias || []).map(h => h.id === historia.id ? { ...h, bancoPiezaId: data.id } : h);
            return { ...c, dias: { ...c.dias, [diaNum]: { ...diaActual, historias: historiasActualizadas } } };
        });
        const updatedSeq = { ...secuencias, ciclos: ciclosActualizados };
        setSecuencias(updatedSeq);
        await updateBrokerConfig('secuencias_data', updatedSeq);

        addLog("secuencias", `Envió historia al Banco: "${insertData.titulo}"`);
        toast(`⭕ Historia enviada al Banco`, "info");
    };

    const renderTabContent = () => {
        switch (tab) {
            case "banco":
                return <BancoTab piezas={piezas} onSave={savePieza} onAdd={addPieza} onDelete={deletePieza} isViewer={isViewer} canEdit={canEdit} canDelete={canDelete} logs={logs} toast={toast} />;
            case "secuencias":
                return <SecuenciasTab data={secuencias} onSave={saveSecuencias} onCrearEnBanco={crearPiezaDesdeSecuencia} onEnviarHistoriaAlBanco={crearHistoriaEnBanco} isViewer={isViewer} toast={toast} />;
            case "instalacion":
                return <InstalacionTab data={{ vars, instalChecked }} vars={vars} onToggle={toggleInstal} onVarChange={updateVar} />;
            case "onboarding":
                return <OnboardingTab checked={onbChecked} onToggle={toggleOnb} mesLabel={"Mes Actual"} toast={toast} />;
            case "oferta":
                return <OfertaTab brokerId={brokerId} isViewer={isViewer} toast={toast} />;
            case "analitica":
                return <AnalyticsTab piezas={piezas} instalChecked={instalChecked} onbChecked={onbChecked} broker={broker} seqData={secuencias} />;
            case "historial":
                return <HistorialTab logs={logs} />;
            case "admin":
                return isAdmin ? <AdminTab brokerId={brokerId} toast={toast} /> : null;
            default:
                return null;
        }
    };

    return (
        <div style={{ height: "100%", background: G.bg, fontFamily: "Georgia,serif", color: G.white, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <Toasts toasts={toasts} />
            {ConfirmUI}

            {/* Header específico del Broker */}
            <div style={{ borderBottom: `1px solid ${G.border}`, padding: "10px 20px", display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.01)", flexShrink: 0, flexWrap: "wrap" }}>
                <button onClick={() => router.push("/dashboard")} style={{ background: "transparent", border: `1px solid ${G.border}`, borderRadius: 6, color: G.muted, fontSize: 9, padding: "5px 10px", cursor: "pointer", fontFamily: "sans-serif", letterSpacing: 1 }}>← BROKERS</button>
                <div style={{ width: 1, height: 24, background: G.border }} />
                <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: G.white }}>{broker?.nombre || broker?.email}</div>
                    <div style={{ fontSize: 10, color: G.muted, fontFamily: "sans-serif" }}>Embudo Activo</div>
                </div>

                {/* Tabs de navegación */}
                <div style={{ display: "flex", gap: 3, flexWrap: "wrap", flex: 2, justifyContent: "center" }}>
                    {TABS.map(t => (
                        <button
                            key={t.k}
                            onClick={() => setTab(t.k)}
                            style={{
                                background: tab === t.k ? G.purpleDim : "transparent",
                                border: `1px solid ${tab === t.k ? G.borderHi : G.border}`,
                                borderRadius: 8,
                                color: tab === t.k ? G.purpleHi : G.muted,
                                fontSize: 10,
                                padding: "6px 12px",
                                cursor: "pointer",
                                fontFamily: "sans-serif",
                                transition: "all 0.15s"
                            }}
                        >
                            {t.l}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
                {renderTabContent()}
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { G, css, pct } from "@/lib/constants";
import { INSTALACION_SECTIONS, ONBOARDING_STEPS } from "@/lib/data";
import { GText, PBar } from "@/components/ui/UIUtils";
import { useToast, Toasts } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";

// Tabs
import BancoTab from "@/components/tabs/BancoTab";
import InstalacionTab from "@/components/tabs/InstalacionTab";
import OnboardingTab from "@/components/tabs/OnboardingTab";
import OfertaTab from "@/components/tabs/OfertaTab";
import AnalyticsTab from "@/components/tabs/AnalyticsTab";
import HistorialTab from "@/components/tabs/HistorialTab";
import ProyectosTab from "@/components/tabs/ProyectosTab";
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
    const [instalSchema, setInstalSchema] = useState([]);
    const [onboardingSchema, setOnboardingSchema] = useState([]);
    const [varsLabels, setVarsLabels] = useState([
        { k: "nombre", l: "Nombre / Marca" },
        { k: "zona", l: "Zona / Colonia" },
        { k: "nicho", l: "Nicho (primerizo / patrimonial / lifestyle)" },
        { k: "cta", l: "CTA principal (ej: INVERTIR)" }
    ]);
    const [proyectos, setProyectos] = useState([]);
    const [tareas, setTareas] = useState([]);

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
        const { data: config } = await supabase.from('broker_config').select('*').eq('broker_id', brokerId).single();
        if (config) {
            setInstalChecked(config.instalacion_checked || {});
            setVars(config.broker_vars || {});
            setOnbChecked(config.onboarding_checked || {});
            setInstalSchema(config.instalacion_schema || INSTALACION_SECTIONS);
            setOnboardingSchema(config.onboarding_schema || ONBOARDING_STEPS);
            if (config.vars_labels) setVarsLabels(config.vars_labels);
        } else {
            setInstalSchema(INSTALACION_SECTIONS);
            setOnboardingSchema(ONBOARDING_STEPS);
        }

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
    
    const isOwnerOrTeam = currentUser?.id === brokerId || (isCoordinador && currentUser?.parent_id === brokerId) || isAdmin || isEquipo;
    const isViewer = !isOwnerOrTeam;
    const isBancoViewer = isBroker || isCoordinador || isViewer;

    const canEdit = isOwnerOrTeam;
    const canDelete = isAdmin || isEquipo;

    const TABS = [
        { k: "banco", l: "📋 Banco" },
        { k: "instalacion", l: "⚡ Instalación" },
        { k: "onboarding", l: "🚀 Onboarding" },
        { k: "oferta", l: "💎 Oferta" },
        { k: "analitica", l: "📊 Analítica" },
        { k: "proyectos", l: "🚀 Proyectos" },
        { k: "historial", l: "🕐 Historial" },
    ].filter(t => {
        if (t.k === "oferta" && isEquipo) return false;
        return true;
    });
    if (isAdmin) TABS.push({ k: "admin", l: "⚙️ Admin" });

    useEffect(() => {
        if (!TABS.find(t => t.k === tab)) {
            setTab("banco");
        }
        if (brokerId) {
            fetchProyectos();
            fetchTareas();
        }
    }, [currentUser, brokerId, tab]);

    useEffect(() => {
        const handleNavigate = (e) => {
            if (e.detail?.tab && TABS.find(t => t.k === e.detail.tab)) {
                setTab(e.detail.tab);
            }
            if (e.detail?.query) {
                const params = new URLSearchParams("?" + e.detail.query);
                const openTask = params.get("open_task");
                if (openTask) {
                    setTimeout(() => window.dispatchEvent(new CustomEvent("open-task-modal", { detail: { taskId: openTask } })), 100);
                }
                const openPiece = params.get("open_piece");
                if (openPiece) {
                    setTimeout(() => window.dispatchEvent(new CustomEvent("open-piece-modal", { detail: { pieceId: openPiece } })), 100);
                }
            }
        };
        window.addEventListener("navigate-tab", handleNavigate);
        return () => window.removeEventListener("navigate-tab", handleNavigate);
    }, [TABS]);

    const fetchProyectos = async () => {
        const { data } = await supabase.from('proyectos').select('*').eq('broker_id', brokerId).order('created_at', { ascending: false });
        if (data) setProyectos(data);
    };

    const fetchTareas = async () => {
        const { data } = await supabase.from('tareas').select('*, comentarios_tareas(*)').order('created_at', { ascending: false });
        if (data) setTareas(data);
    };

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", background: G.bg, display: "flex", alignItems: "center", justifyContent: "center", color: G.dimmed, fontFamily: "sans-serif", fontSize: 11, letterSpacing: 3 }}>
                CARGANDO...
            </div>
        );
    }


    const addLog = async (tipo, descripcion, pieza_id = null, payload = {}) => {
        const actor = currentUser?.nombre || currentUser?.email || 'Sistema';
        const { data, error } = await supabase.from('logs').insert({
            broker_id: brokerId, tipo, descripcion, pieza_id, actor_nombre: actor, payload
        }).select('*').single();
        if (data) setLogs(prev => [data, ...prev].slice(0, 200));
    };

    const undoAction = async (log) => {
        if (!log.payload || Object.keys(log.payload).length === 0) {
            toast("No hay datos para deshacer esta acción", "error");
            return;
        }

        const { tipo, payload } = log;
        try {
            if (tipo === 'Eliminación') {
                // Re-insertar pieza eliminada
                const { data, error } = await supabase.from('piezas_banco').insert(payload).select().single();
                if (error) throw error;
                setPiezas(prev => [...prev, { ...data, anotaciones: JSON.parse(data.anotaciones || '[]') }]);
                toast("Acción deshecha: Pieza restaurada");
            } else if (tipo === 'Actualización') {
                // Revertir a valores anteriores
                const { error } = await supabase.from('piezas_banco').update(payload.prev).eq('id', payload.id);
                if (error) throw error;
                setPiezas(prev => prev.map(p => p.id === payload.id ? { ...p, ...payload.prev } : p));
                toast("Acción deshecha: Valores restaurados");
            } else if (tipo === 'Importación' || tipo === 'Importación Masiva') {
                // Eliminar piezas importadas
                const ids = payload.ids;
                const { error } = await supabase.from('piezas_banco').delete().in('id', ids);
                if (error) throw error;
                setPiezas(prev => prev.filter(p => !ids.includes(p.id)));
                toast(`Acción deshecha: ${ids.length} piezas eliminadas`);
            } else if (tipo === 'Eliminación Masiva') {
                // Re-insertar múltiples piezas
                const { data, error } = await supabase.from('piezas_banco').insert(payload.items).select();
                if (error) throw error;
                setPiezas(prev => [...prev, ...data.map(d => ({ ...d, anotaciones: JSON.parse(d.anotaciones || '[]') }))]);
                toast(`Acción deshecha: ${data.length} piezas restauradas`);
            } else if (tipo === 'Actualización Masiva') {
                // Revertir múltiples piezas
                for (const item of payload.prevItems) {
                    await supabase.from('piezas_banco').update(item).eq('id', item.id);
                }
                setPiezas(prev => prev.map(p => {
                    const old = payload.prevItems.find(x => x.id === p.id);
                    return old ? { ...p, ...old } : p;
                }));
                toast("Acción masiva deshecha");
            }

            // Eliminar el log de deshacer para evitar bucles (opcional, pero mejor marcarlo como 'Deshecho')
            await supabase.from('logs').update({ tipo: 'Undo: ' + tipo, descripcion: 'DESHECHO: ' + log.descripcion }).eq('id', log.id);
            setLogs(prev => prev.map(l => l.id === log.id ? { ...l, tipo: 'Undo: ' + tipo, decoded: true } : l));

        } catch (err) {
            toast("Error al deshacer: " + err.message, "error");
        }
    };

    const updateBrokerConfig = async (column, value) => {
        const { error } = await supabase.from('usuarios').update({ [column]: value }).eq('id', brokerId);
        if (error) console.error("Error updating config:", error);
    };

    const savePieza = async (pieza) => {
        if (!canEdit) return;
        const old = piezas.find(p => p.id === pieza.id);
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
        addLog("Actualización", `Actualizó pieza: "${pieza.titulo}"`, pieza.id, { id: pieza.id, prev: old });
    };

    const addPieza = async (pieza) => {
        if (!canEdit) return;
        const insertData = {
            broker_id: brokerId,
            titulo: pieza.titulo, hook: pieza.hook, fase: pieza.fase || 'Atraer', formato: pieza.formato,
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
        const pieza = piezas.find(x => x.id === id);
        const ok = await confirm(`¿Eliminar esta pieza?`, `Acción irreversible.`, "Eliminar");
        if (!ok) return;
        const { error } = await supabase.from('piezas_banco').delete().eq('id', id);
        if (!error) {
            setPiezas(prev => prev.filter(p => p.id !== id));
            addLog('Eliminación', `Se eliminó la pieza #${pieza?.num}`, null, pieza);
            toast("Pieza eliminada");
        } else {
            toast("Error al eliminar", "error");
        }
    };

    const bulkDeletePiezas = async (ids) => {
        const items = piezas.filter(p => ids.includes(p.id));
        const ok = await confirm(`¿Eliminar ${ids.length} piezas?`, `Acción irreversible.`, "Eliminar Todas");
        if (!ok) return;
        const { error } = await supabase.from('piezas_banco').delete().in('id', ids);
        if (!error) {
            setPiezas(prev => prev.filter(p => !ids.includes(p.id)));
            addLog('Eliminación Masiva', `Se eliminaron ${ids.length} piezas`, null, { items });
            toast(`${ids.length} piezas eliminadas`);
        } else {
            toast("Error al eliminar piezas", "error");
        }
    };

    const bulkUpdatePiezas = async (ids, updates) => {
        const prevItems = piezas.filter(p => ids.includes(p.id)).map(p => ({ ...p }));
        const { error } = await supabase.from('piezas_banco').update(updates).in('id', ids);
        if (!error) {
            setPiezas(prev => prev.map(p => ids.includes(p.id) ? { ...p, ...updates } : p));
            addLog('Actualización Masiva', `Se actualizaron ${ids.length} piezas`, null, { ids, prevItems, updates });
            toast(`${ids.length} piezas actualizadas`);
        } else {
            toast("Error al actualizar piezas", "error");
        }
    };

    const importPiezas = async (dataArray) => {
        try {
            const lastNum = piezas.length > 0 ? Math.max(...piezas.map(p => p.num || 0)) : 0;
            const toInsert = dataArray.map((item, idx) => {
                // Normalización robusta de fase (Atraer, Retener, Convertir)
                const rawFase = (item.fase || "").trim().toLowerCase();
                let f = "Atraer"; // Default seguro
                
                if (rawFase.includes("atra")) f = "Atraer";
                else if (rawFase.includes("val") || rawFase.includes("rete") || rawFase.includes("nutri") || rawFase.includes("adoc")) f = "Retener";
                else if (rawFase.includes("conv") || rawFase.includes("vent") || rawFase.includes("cierr") || rawFase.includes("prom")) f = "Convertir";

                // Normalización de formato
                const rawFmt = (item.formato || "").trim().toLowerCase();
                let fmt = "Reel";
                if (rawFmt.includes("reel")) fmt = "Reel";
                else if (rawFmt.includes("carru")) fmt = "Carrusel";
                else if (rawFmt.includes("hist") || rawFmt.includes("story")) fmt = "Historia";
                else if (rawFmt.includes("foto") || rawFmt.includes("estat")) fmt = "Foto estática";
                else if (rawFmt.includes("vid") || rawFmt.includes("long")) fmt = "Video largo (YouTube/IGTV)";

                return {
                    broker_id: brokerId,
                    num: lastNum + idx + 1,
                    fase: f,
                    estado: "En cola",
                    titulo: item.titulo || "Sin título",
                    hook: item.hook || "",
                    cuerpo: item.copy || "",
                    guion: item.guion || "",
                    instrucciones: item.instrucciones || "",
                    notas_internas: item.notasInternas || "",
                    fecha_prog: item.fechaProg || null,
                    formato: fmt,
                    origen: "manual"
                };
            });

            const { data, error } = await supabase.from('piezas_banco').insert(toInsert).select('*');
            if (error) throw error;

            const mappedNew = (data || []).map(p => {
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
                    notasInternas: p.notasInternas || "",
                    anotaciones: parsedAnotaciones
                };
            });

            setPiezas(prev => [...prev, ...mappedNew]);
            addLog('Importación Masiva', `Se importaron ${data.length} piezas masivamente`, null, { ids: data.map(d => d.id) });
            toast(`¡${data.length} piezas importadas con éxito!`);
        } catch (err) {
            toast("Error en importación: " + err.message, "error");
        }
    };

    const toggleInstal = async (id) => {
        if (!isAdmin && !isEquipo) return;
        const newChecked = { ...instalChecked, [id]: !instalChecked[id] };
        setInstalChecked(newChecked);
        await updateBrokerConfig('instalacion_checked', newChecked);
    };

    const updateVar = async (k, v) => {
        if (!isAdmin && !isEquipo) return;
        const newVars = { ...vars, [k]: v };
        setVars(newVars);
        await updateBrokerConfig('broker_vars', newVars);
    };

    const toggleOnb = async (id) => {
        if (!isAdmin && !isEquipo) return;
        const newChecked = { ...onbChecked, [id]: !onbChecked[id] };
        setOnbChecked(newChecked);
        await updateBrokerConfig('onboarding_checked', newChecked);
    };

    const saveInstalSchema = async (sch) => {
        if (!isAdmin && !isEquipo) return;
        setInstalSchema(sch);
        await updateBrokerConfig('instalacion_schema', sch);
    };

    const saveOnboardingSchema = async (sch) => {
        if (!isAdmin && !isEquipo) return;
        setOnboardingSchema(sch);
        await updateBrokerConfig('onboarding_schema', sch);
    };

    const saveVarsLabels = async (labels) => {
        if (!isAdmin && !isEquipo) return;
        setVarsLabels(labels);
        await updateBrokerConfig('vars_labels', labels);
    };

    // ── GESTIÓN DE PROYECTOS ──────────────────────────────────────────────
    const saveProyecto = async (proj) => {
        const { data, error } = await supabase.from('proyectos').upsert({ ...proj, broker_id: brokerId }).select().single();
        if (!error) {
            setProyectos(prev => {
                const exists = prev.find(p => p.id === data.id);
                return exists ? prev.map(p => p.id === data.id ? data : p) : [data, ...prev];
            });
            toast(proj.id ? "Proyecto actualizado" : "Proyecto creado");
        }
    };

    const deleteProyecto = async (id) => {
        const ok = await confirm("¿Eliminar proyecto?", "Se borrarán todas sus tareas.", "Eliminar");
        if (!ok) return;
        const { error } = await supabase.from('proyectos').delete().eq('id', id);
        if (!error) {
            setProyectos(prev => prev.filter(p => p.id !== id));
            setTareas(prev => prev.filter(t => t.proyecto_id !== id));
            toast("Proyecto eliminado");
        }
    };

    const saveTarea = async (task) => {
        const { comentarios_tareas, ...dbTask } = task;
        const { data, error } = await supabase.from('tareas').upsert(dbTask).select().single();
        if (!error) {
            setTareas(prev => {
                const exists = prev.find(t => t.id === data.id);
                return exists ? prev.map(t => t.id === data.id ? { ...data, comentarios_tareas: t.comentarios_tareas || [] } : t) : [{ ...data, comentarios_tareas: [] }, ...prev];
            });
            toast(task.id ? "Tarea actualizada" : "Tarea creada");
        }
    };

    const deleteTarea = async (id) => {
        const { error } = await supabase.from('tareas').delete().eq('id', id);
        if (!error) {
            setTareas(prev => prev.filter(t => t.id !== id));
            toast("Tarea eliminada");
        }
    };

    const addComentario = async (tarea_id, texto, archivos = []) => {
        const { data, error } = await supabase.from('comentarios_tareas').insert({
            tarea_id, autor_id: currentUser.id, texto, archivos
        }).select().single();
        if (!error) {
            setTareas(prev => prev.map(t => t.id === tarea_id ? { ...t, comentarios_tareas: [...(t.comentarios_tareas || []), data] } : t));
        }
    };

    const renderTabContent = () => {
        switch (tab) {
            case "banco": return <BancoTab piezas={piezas} tareas={tareas} onSave={savePieza} onAdd={addPieza} onImport={importPiezas} onDelete={deletePieza} onBulkDelete={bulkDeletePiezas} onBulkUpdate={bulkUpdatePiezas} isViewer={isBancoViewer} canEdit={canEdit} canDelete={canDelete} canImport={isAdmin || isEquipo} logs={logs} toast={toast} userRole={currentUser?.rol} brokerId={brokerId} currentUser={currentUser} onCreateTarea={(t) => setTareas(prev => [{ ...t, comentarios_tareas: [] }, ...prev])} />;
            case "instalacion": return <InstalacionTab data={{ vars, instalChecked }} vars={vars} varsLabels={varsLabels} schema={instalSchema} onToggle={toggleInstal} onVarChange={updateVar} onSaveSchema={saveInstalSchema} onSaveVarsLabels={saveVarsLabels} canEditAdmin={isAdmin || isEquipo} />;
            case "onboarding": return <OnboardingTab checked={onbChecked} schema={onboardingSchema} onToggle={toggleOnb} onSaveSchema={saveOnboardingSchema} canEditAdmin={isAdmin || isEquipo} mesLabel={"Mes Actual"} toast={toast} />;
            case "oferta": return <OfertaTab brokerId={brokerId} isViewer={isViewer} toast={toast} />;
            case "analitica": return <AnalyticsTab piezas={piezas} instalChecked={instalChecked} onbChecked={onbChecked} broker={broker} />;
            case "historial": return <HistorialTab logs={logs} onUndo={undoAction} isViewer={isViewer} />;
            case "proyectos": return <ProyectosTab proyectos={proyectos} tareas={tareas} onSaveProyecto={saveProyecto} onDeleteProyecto={deleteProyecto} onSaveTarea={saveTarea} onDeleteTarea={deleteTarea} onAddComentario={addComentario} isViewer={isViewer} currentUser={currentUser} brokerId={brokerId} toast={toast} />;
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

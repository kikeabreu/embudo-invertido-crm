import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { G, css } from "@/lib/constants";
import { GText, StatCard } from "@/components/ui/UIUtils";

export default function EditorAnalyticsTab({ tareas, broker }) {
    const [selectedEditor, setSelectedEditor] = useState("Todos");
    const [team, setTeam] = useState([]);
    const [loadingTeam, setLoadingTeam] = useState(true);
    const [weeklySalary, setWeeklySalary] = useState(broker?.precio_pactado || 300);
    const [isEditingSalary, setIsEditingSalary] = useState(false);
    const [tempSalary, setTempSalary] = useState(broker?.precio_pactado || 300);

    useEffect(() => {
        const fetchTeam = async () => {
            const { data } = await supabase.from('usuarios').select('*').eq('rol', 'Equipo');
            if (data) setTeam(data);
            setLoadingTeam(false);
        };
        fetchTeam();
    }, []);

    useEffect(() => {
        if (broker?.precio_pactado) {
            setWeeklySalary(broker.precio_pactado);
            setTempSalary(broker.precio_pactado);
        }
    }, [broker]);

    const handleSaveSalary = async () => {
        const salaryNum = parseFloat(tempSalary) || 0;
        setWeeklySalary(salaryNum);
        setIsEditingSalary(false);
        if (broker?.id) {
            await supabase.from('usuarios').update({ precio_pactado: salaryNum }).eq('id', broker.id);
        }
    };

    // Filter completed tasks (Aprobado / Hecho)
    const completedTasks = tareas.filter(t => t.estado === "Aprobado" || t.estado === "Hecho");
    
    const displayTasks = selectedEditor === "Todos" 
        ? completedTasks 
        : completedTasks.filter(t => t.asignado_a === selectedEditor);

    // Calculate metrics
    const totalPoints = displayTasks.reduce((acc, t) => acc + (t.puntos_esfuerzo || 1), 0);
    const totalVideos = displayTasks.length;
    
    // Cycle Time: Avg time from Edición to Aprobado
    let totalCycleMs = 0;
    let cycleCount = 0;
    displayTasks.forEach(t => {
        if (t.fecha_inicio && t.fecha_fin) {
            const ms = new Date(t.fecha_fin) - new Date(t.fecha_inicio);
            if (ms > 0) {
                totalCycleMs += ms;
                cycleCount++;
            }
        }
    });
    
    const avgCycleHours = cycleCount > 0 ? (totalCycleMs / (1000 * 60 * 60 * cycleCount)).toFixed(1) : 0;
    
    const costPerVideo = totalVideos > 0 ? (weeklySalary / totalVideos).toFixed(2) : 0;
    const costPerPoint = totalPoints > 0 ? (weeklySalary / totalPoints).toFixed(2) : 0;

    return (
        <div style={{ padding: "28px 32px", overflowY: "auto", height: "100%", boxSizing: "border-box", background: G.bg }}>
            {/* Header / Eyebrow */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <span style={{ fontSize: 11, letterSpacing: "0.14em", color: G.naranja, fontFamily: "Gilroy, sans-serif", textTransform: "uppercase", fontWeight: 800, display: "block", marginBottom: 4 }}>
                        DESEMPEÑO Y PRODUCTIVIDAD
                    </span>
                    <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: G.purple, fontFamily: "Gilroy, sans-serif", textTransform: "uppercase", letterSpacing: "-0.02em" }}>
                        ANALÍTICA DEL EDITOR
                    </h1>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {/* Select Editor */}
                    <select value={selectedEditor} onChange={e => setSelectedEditor(e.target.value)} style={{ ...css.input, padding: "8px 14px", fontSize: 12, fontWeight: 700, width: "auto" }}>
                        <option value="Todos">TODOS LOS EDITORES</option>
                        {team.map(e => <option key={e.id} value={e.id}>{e.nombre.toUpperCase()}</option>)}
                    </select>

                    {/* Salary Configuration Control */}
                    <div style={{ background: "#FFFFFF", border: `1px solid ${G.border}`, borderRadius: 10, padding: "6px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 10, color: G.muted, fontWeight: 800, letterSpacing: "0.08em" }}>SUELDO SEMANAL:</span>
                        {isEditingSalary ? (
                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                <input type="number" value={tempSalary} onChange={e => setTempSalary(e.target.value)} style={{ ...css.input, width: 80, padding: "4px 8px", fontSize: 12 }} />
                                <button onClick={handleSaveSalary} style={{ ...css.btn(G.gPurple), padding: "4px 10px", fontSize: 10 }}>GUARDAR</button>
                            </div>
                        ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 13, fontWeight: 800, color: G.purple }}>${weeklySalary}</span>
                                <button onClick={() => setIsEditingSalary(true)} style={{ background: "transparent", border: "none", color: G.naranja, cursor: "pointer", fontSize: 11, fontWeight: 800 }}>[EDITAR]</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
                <StatCard label="Videos Completados" value={totalVideos} g={G.gPurple} sub="Total histórico entregado" />
                <StatCard label="Puntos Entregados" value={`${totalPoints} pts`} g={G.gOrange} sub="Suma de complejidad" />
                <StatCard label="Tiempo Promedio de Entrega" value={`${avgCycleHours} hrs`} g={G.gCyan} sub="De Edición a Aprobación" />
                <StatCard label="Costo por Video" value={`$${costPerVideo}`} g={G.gViolet} sub={`Basado en $${weeklySalary}/sem`} />
                <StatCard label="Costo por Punto" value={`$${costPerPoint}`} g={G.gMagenta} sub="Costo unitario por complejidad" />
            </div>

            {/* Table / Breakdown */}
            <div style={{ ...css.card, padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontSize: 11, letterSpacing: "0.14em", color: G.naranja, fontFamily: "Gilroy, sans-serif", textTransform: "uppercase", fontWeight: 800, marginBottom: 4 }}>
                    DESGLOSE DE TAREAS ENTREGADAS
                </div>
                <div style={{ display: "flex", borderBottom: `2px solid ${G.border}`, paddingBottom: 10, fontSize: 10, color: G.muted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 800 }}>
                    <div style={{ flex: 2 }}>TITULO DE LA PIEZA / VIDEO</div>
                    <div style={{ width: 140, textAlign: "center" }}>PUNTOS DE ESFUERZO</div>
                    <div style={{ width: 160, textAlign: "center" }}>TIEMPO DE EDICIÓN</div>
                </div>
                {displayTasks.map(t => {
                    let hrs = "N/A";
                    if (t.fecha_inicio && t.fecha_fin) {
                        hrs = ((new Date(t.fecha_fin) - new Date(t.fecha_inicio)) / (1000 * 60 * 60)).toFixed(1) + " hrs";
                    }
                    return (
                        <div key={t.id} style={{ display: "flex", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${G.border}` }}>
                            <div style={{ flex: 2, fontSize: 13, fontWeight: 700, color: G.purple }}>{t.titulo.toUpperCase()}</div>
                            <div style={{ width: 140, textAlign: "center" }}>
                                <span style={{ background: "#FEF2EB", color: G.naranja, border: `1px solid ${G.naranja}`, borderRadius: 12, padding: "3px 10px", fontSize: 11, fontWeight: 800 }}>
                                    {t.puntos_esfuerzo || 1} PTS
                                </span>
                            </div>
                            <div style={{ width: 160, textAlign: "center", fontSize: 12, fontWeight: 700, color: hrs === "N/A" ? G.muted : G.purple }}>{hrs}</div>
                        </div>
                    );
                })}
                {displayTasks.length === 0 && <div style={{ textAlign: "center", color: G.muted, fontSize: 12, padding: 30, fontWeight: 600 }}>No hay tareas completadas registradas.</div>}
            </div>
        </div>
    );
}

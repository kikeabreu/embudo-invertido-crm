import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { G, css } from "@/lib/constants";
import { GText, StatCard } from "@/components/ui/UIUtils";

export default function EditorAnalyticsTab({ tareas, broker }) {
    const [selectedEditor, setSelectedEditor] = useState("Todos");
    const [team, setTeam] = useState([]);
    const [loadingTeam, setLoadingTeam] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            const { data } = await supabase.from('usuarios').select('*').eq('rol', 'Equipo');
            if (data) setTeam(data);
            setLoadingTeam(false);
        };
        fetchTeam();
    }, []);

    // Filter completed tasks (Aprobado / Hecho)
    const completedTasks = tareas.filter(t => t.estado === "Aprobado" || t.estado === "Hecho");
    
    // Get editors
    const editors = team;
    
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
    
    // Cost calculation (assuming broker.precio_pactado is weekly salary)
    const weeklySalary = broker?.precio_pactado || 300; // default 300 if not set
    const costPerVideo = totalVideos > 0 ? (weeklySalary / totalVideos).toFixed(2) : 0;
    const costPerPoint = totalPoints > 0 ? (weeklySalary / totalPoints).toFixed(2) : 0;

    return (
        <div style={{ padding: "28px 32px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <GText g={G.gViolet} size={10} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase" }}>Rendimiento del Editor</GText>
                <select value={selectedEditor} onChange={e => setSelectedEditor(e.target.value)} style={{ ...css.input, padding: "6px 10px", fontSize: 11, width: "auto" }}>
                    <option value="Todos">👥 Todos los Editores</option>
                    {editors.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                </select>
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
                <StatCard label="Videos Completados" value={totalVideos} g={G.gGreen} sub="Total histórico" />
                <StatCard label="Puntos Entregados" value={totalPoints} g={G.gOrange} sub="Suma de esfuerzo" />
                <StatCard label="Tiempo Promedio (Ciclo)" value={`${avgCycleHours} hrs`} g={G.gCyan} sub="De Edición a Aprobado" />
                <StatCard label="Costo por Video" value={`$${costPerVideo}`} g={G.gViolet} sub={`Sueldo Semanal: $${weeklySalary}`} />
                <StatCard label="Costo por Punto" value={`$${costPerPoint}`} g={G.gMagenta} sub="Eficiencia real" />
            </div>

            <div style={{ ...css.card, padding: "20px", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: G.muted, fontFamily: "sans-serif", textTransform: "uppercase", marginBottom: 8 }}>Desglose de Tareas Completadas</div>
                <div style={{ display: "flex", borderBottom: `1px solid ${G.border}`, paddingBottom: 8, fontSize: 9, color: G.muted, textTransform: "uppercase", letterSpacing: 1 }}>
                    <div style={{ flex: 1 }}>Video</div>
                    <div style={{ width: 80, textAlign: "center" }}>Puntos</div>
                    <div style={{ width: 120, textAlign: "center" }}>Tiempo Invertido</div>
                </div>
                {displayTasks.map(t => {
                    let hrs = "N/A";
                    if (t.fecha_inicio && t.fecha_fin) {
                        hrs = ((new Date(t.fecha_fin) - new Date(t.fecha_inicio)) / (1000 * 60 * 60)).toFixed(1) + " hrs";
                    }
                    return (
                        <div key={t.id} style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: `1px dashed ${G.borderHi}` }}>
                            <div style={{ flex: 1, fontSize: 12, color: G.white }}>{t.titulo}</div>
                            <div style={{ width: 80, textAlign: "center", fontSize: 11, color: G.orange }}>{t.puntos_esfuerzo || 1} pts</div>
                            <div style={{ width: 120, textAlign: "center", fontSize: 11, color: hrs === "N/A" ? G.dimmed : G.cyan }}>{hrs}</div>
                        </div>
                    );
                })}
                {displayTasks.length === 0 && <div style={{ textAlign: "center", color: G.dimmed, fontSize: 11, padding: 20 }}>No hay tareas completadas aún.</div>}
            </div>
        </div>
    );
}

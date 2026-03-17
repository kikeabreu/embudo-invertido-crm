"use client";

import { G, css, pct, FASES, ESTADOS_PIEZA, faseColor, faseGrad, estadoColor } from "@/lib/constants";
import { SECUENCIA_VALOR, SECUENCIA_VENTA, INSTALACION_SECTIONS, ONBOARDING_STEPS } from "@/lib/data";
import { GText, PBar, StatCard } from "@/components/ui/UIUtils";

export default function AnalyticsTab({ piezas, instalChecked, onbChecked, broker, seqData }) {
    const instIds = INSTALACION_SECTIONS.flatMap(s => s.items.map(i => i.id));
    const onbIds = ONBOARDING_STEPS.flatMap(s => s.items.map(i => i.id));
    const instPct = pct(instIds.filter(id => instalChecked?.[id]).length, instIds.length);
    const onbPct = pct(onbIds.filter(id => onbChecked?.[id]).length, onbIds.length);
    const pubPct = pct(piezas.filter(p => p.estado === "Publicado").length, piezas.length);

    const ciclos = seqData?.ciclos || [];
    const valorCiclos = ciclos.filter(c => c.tipo === "valor");
    const ventaCiclos = ciclos.filter(c => c.tipo === "venta");

    const hoyAn = new Date();
    const en7 = new Date(hoyAn);
    en7.setDate(hoyAn.getDate() + 7);

    const proximasPiezas = piezas.filter(p => {
        if (!p.fechaProg) return false;
        const d = new Date(p.fechaProg + "T12:00:00");
        return d >= hoyAn && d <= en7 && p.estado !== "Publicado";
    }).length;

    const valorDone = valorCiclos.reduce((acc, c) => acc + SECUENCIA_VALOR.filter(d => c.dias?.[d.dia]?.completado).length, 0);
    const valorTotal = valorCiclos.length * SECUENCIA_VALOR.length || SECUENCIA_VALOR.length;
    const ventaDone = ventaCiclos.reduce((acc, c) => acc + SECUENCIA_VENTA.filter(d => c.dias?.[d.dia]?.completado).length, 0);
    const ventaTotal = ventaCiclos.length * SECUENCIA_VENTA.length || SECUENCIA_VENTA.length;

    return (
        <div style={{ padding: "28px 32px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
            <GText g={G.gViolet} size={10} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 20 }}>Panel de Analítica</GText>

            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
                <StatCard label="Piezas totales" value={piezas.length} g={G.gViolet} />
                <StatCard label="Publicadas" value={piezas.filter(p => p.estado === "Publicado").length} g={G.gGreen} sub={`${pubPct}% del banco`} />
                <StatCard label="En producción" value={piezas.filter(p => p.estado === "Producción").length} g={G.gOrange} />
                <StatCard label="En cola" value={piezas.filter(p => p.estado === "En cola").length} g={{ background: G.bgCard }} sub="pendientes" />
                <StatCard label="Esta semana" value={proximasPiezas} g={G.gCyan} sub="programadas" />
                <StatCard label="Ciclos" value={ciclos.length} g={G.gViolet} sub={`${valorCiclos.length}V · ${ventaCiclos.length}S`} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
                {[
                    { label: "Instalación del perfil", val: instPct, g: G.gViolet },
                    { label: "Onboarding 15 días", val: onbPct, g: G.gGreen },
                    { label: "Banco publicado", val: pubPct, g: G.gMagenta },
                    { label: "Seq. de Valor", val: pct(valorDone, valorTotal), g: G.gCyan },
                    { label: "Seq. de Venta", val: pct(ventaDone, ventaTotal), g: G.gOrange },
                ].map(({ label, val, g }) => (
                    <div key={label} style={{ ...css.card, padding: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                            <div style={{ fontSize: 11, color: G.white, fontFamily: "sans-serif" }}>{label}</div>
                            <GText g={g} size={18} weight={800}>{val}%</GText>
                        </div>
                        <PBar val={val} g={g} h={6} />
                    </div>
                ))}
            </div>

            <div style={{ ...css.card, padding: "20px" }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: G.muted, fontFamily: "sans-serif", textTransform: "uppercase", marginBottom: 16 }}>Estado del banco por fase</div>
                {FASES.map(f => {
                    const fp = piezas.filter(p => p.fase === f);
                    return (
                        <div key={f} style={{ marginBottom: 16 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                <span style={css.tag(faseColor(f))}>{f}</span>
                                <div style={{ display: "flex", gap: 12 }}>
                                    {ESTADOS_PIEZA.map(e => <span key={e} style={{ fontSize: 10, color: estadoColor(e), fontFamily: "sans-serif" }}>{fp.filter(p => p.estado === e).length} {e}</span>)}
                                </div>
                            </div>
                            <PBar val={pct(fp.filter(p => p.estado === "Publicado").length, fp.length)} g={faseGrad(f)} h={4} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

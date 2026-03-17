"use client";

import { G, css } from "@/lib/constants";
import { GText } from "@/components/ui/UIUtils";

export default function OfertaTab() {
    const Block = ({ title, g, children }) => (
        <div style={{ ...css.card, padding: "20px 24px", marginBottom: 16 }}>
            <GText g={g} size={9} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 12 }}>{title}</GText>
            {children}
        </div>
    );

    const Li = ({ children, color = G.green }) => (
        <div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
            <span style={{ color, marginTop: 2, flexShrink: 0 }}>▸</span>
            <span style={{ fontSize: 12, color: G.muted, fontFamily: "sans-serif", lineHeight: 1.5 }}>{children}</span>
        </div>
    );

    const ObjRow = ({ n, obj, resp }) => (
        <div style={{ ...css.card, padding: "14px 18px", marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 10 }}>
                <span style={{ fontSize: 9, color: G.purpleHi, fontFamily: "monospace", fontWeight: 700, minWidth: 20 }}>#{n}</span>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: G.white, fontFamily: "sans-serif", fontWeight: 600, marginBottom: 4 }}>{obj}</div>
                    <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", lineHeight: 1.5 }}>{resp}</div>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ padding: "24px 28px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
            <GText g={G.gMagenta} size={10} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 8 }}>One Pager de Oferta</GText>
            <div style={{ fontSize: 22, color: G.white, fontFamily: "Georgia,serif", marginBottom: 24 }}>Sistema de Embudo Invertido™</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <Block title="✓ Es para ti si..." g={G.gGreen}>
                    {["Eres broker o asesor inmobiliario en Mérida con ventas activas", "Dependes de portales o referidos para conseguir clientes", "Estás cansado de leads fríos que solo piden precio y desaparecen", "Quieres ser el referente de tu zona, no uno más del montón", "Estás dispuesto a invertir en marketing que genere resultados reales"].map((t, i) => <Li key={i}>{t}</Li>)}
                </Block>
                <Block title="✗ No es para ti si..." g={G.gOrange}>
                    {["Apenas estás empezando y no tienes ventas todavía", "Buscas seguidores o likes en lugar de prospectos reales", "No estás dispuesto a aparecer en cámara ocasionalmente", "Quieres resultados sin invertir en pauta publicitaria", "Buscas el servicio más barato del mercado"].map((t, i) => <Li key={i} color={G.orange}>{t}</Li>)}
                </Block>
            </div>

            <Block title="La transformación" g={G.gViolet}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center" }}>
                    <div style={{ ...css.card, padding: "14px", borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)" }}>
                        <div style={{ fontSize: 10, color: G.red, fontFamily: "sans-serif", fontWeight: 700, marginBottom: 6 }}>DE</div>
                        <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", lineHeight: 1.6 }}>Broker invisible en redes, compitiendo por precio con otros 15 equipos iguales en Mérida.</div>
                    </div>
                    <GText g={G.gViolet} size={24}>→</GText>
                    <div style={{ ...css.card, padding: "14px", borderColor: "rgba(16,185,129,0.2)", background: "rgba(16,185,129,0.05)" }}>
                        <div style={{ fontSize: 10, color: G.green, fontFamily: "sans-serif", fontWeight: 700, marginBottom: 6 }}>A</div>
                        <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", lineHeight: 1.6 }}>Referente de tu zona con 10-20 prospectos calificados mensuales llegando a tu DM ya con confianza.</div>
                    </div>
                </div>
            </Block>

            <Block title="El mecanismo — Fases del Embudo" g={G.gMagenta}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    {[{ f: "Atracción", pct: "60%", desc: "Reels de alto alcance para traer gente nueva al perfil. Sin hablar de proyectos.", g: G.gMagenta }, { f: "Retención/Valor", pct: "30%", desc: "Carruseles y videos de valor sobre el mercado para generar confianza ciega.", g: G.gViolet }, { f: "Conversión", pct: "10% + Stories", desc: "Historias estratégicas y pauta directo al WhatsApp del broker.", g: G.gGreen }].map(({ f, pct: p, desc, g }) => (
                        <div key={f} style={{ ...css.card, padding: "16px", textAlign: "center" }}>
                            <GText g={g} size={24} weight={800} style={{ display: "block", marginBottom: 4 }}>{p}</GText>
                            <div style={{ fontSize: 11, color: G.white, fontFamily: "sans-serif", fontWeight: 600, marginBottom: 8 }}>{f}</div>
                            <div style={{ fontSize: 10, color: G.muted, fontFamily: "sans-serif", lineHeight: 1.5 }}>{desc}</div>
                        </div>
                    ))}
                </div>
            </Block>

            <Block title="Precio & ROI" g={G.gGreen}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                        <div style={{ fontSize: 28, fontWeight: 800 }}><GText g={G.gGreen} size={28}>$10,000 MXN/mes</GText></div>
                        <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", marginTop: 4 }}>+ presupuesto de pauta del cliente ($2,000–5,000 MXN)</div>
                        <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", marginTop: 8 }}>Trimestral: $27,000 MXN (10% descuento)</div>
                    </div>
                    <div style={{ ...css.card, padding: "14px", borderColor: "rgba(16,185,129,0.2)" }}>
                        <div style={{ fontSize: 10, color: G.green, fontFamily: "sans-serif", fontWeight: 700, marginBottom: 6 }}>ROI para el broker</div>
                        <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", lineHeight: 1.7 }}>Una comisión de propiedad a $3M MXN = $90,000–150,000 MXN. Este servicio cuesta menos del 7% de UNA comisión. ROI potencial: 10–15x.</div>
                    </div>
                </div>
            </Block>

            <Block title="10 Objeciones + Respuestas" g={G.gViolet}>
                {[
                    ["Ya pagué por marketing antes y no funcionó", "Probablemente te entregaron posts bonitos y midieron likes. Nosotros medimos prospectos en tu DM."],
                    ["¿10–20 prospectos es realista?", "Sí, con orgánico + pauta estratégica. Si no llegas a 10 en el primer mes, el segundo mes es gratis."],
                    ["No tengo tiempo para grabar contenido", "Incluimos Guía de Grabación Simple. Son 2–3 horas al mes de tu tiempo. Nosotros hacemos todo lo demás."],
                    ["¿Por qué $10,000 MXN si hay opciones más baratas?", "Una comisión de $3M MXN genera $90–150K. Esto cuesta <7% de una comisión."],
                    ["No sé si las redes funcionan para vender inmuebles", "Funcionan cuando se hacen bien. El Embudo Invertido™ atrae primero, vende después."],
                    ["¿Qué pasa si los prospectos no son de calidad?", "Optimizamos cada mes. El reporte muestra qué contenido trajo mejores prospectos."],
                    ["¿Cuánto tengo que invertir en pauta?", "$2,000–5,000 MXN/mes para llegar a compradores reales de tu zona."],
                    ["¿Y si mi competencia ya está haciendo esto?", "Si ellos publican 'casa en venta' genérico y tú usas el Embudo Invertido™, tú te ves experto."],
                    ["No me gusta aparecer en cámara", "No tienes que aparecer en todo. Te damos una guía para que sea fácil y natural."],
                    ["¿Hay contrato de permanencia?", "No. Mes a mes. Te quedas porque funciona, no por estar atrapado."]
                ].map(([obj, resp], i) => <ObjRow key={i} n={i + 1} obj={obj} resp={resp} />)}
            </Block>
        </div>
    );
}

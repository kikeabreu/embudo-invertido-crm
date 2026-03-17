import { useState, useEffect } from "react";

// ── DESIGN SYSTEM ─────────────────────────────────────────────────────────────
const G = {
  bg: "#07071A",
  bgCard: "rgba(255,255,255,0.04)",
  bgCardHover: "rgba(255,255,255,0.07)",
  bgGlass: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.08)",
  borderHi: "rgba(139,92,246,0.5)",
  gPurple: "linear-gradient(135deg,#6D28D9,#7C3AED)",
  gViolet: "linear-gradient(135deg,#7C3AED,#A855F7)",
  gMagenta: "linear-gradient(135deg,#A855F7,#EC4899)",
  gGreen: "linear-gradient(135deg,#10B981,#34D399)",
  gOrange: "linear-gradient(135deg,#F59E0B,#EF4444)",
  gBlue: "linear-gradient(135deg,#3B82F6,#6D28D9)",
  gCyan: "linear-gradient(135deg,#06B6D4,#3B82F6)",
  purple: "#7C3AED", purpleHi: "#A855F7", purpleDim: "rgba(124,58,237,0.2)",
  magenta: "#EC4899", green: "#10B981", orange: "#F59E0B", blue: "#3B82F6", red: "#EF4444", cyan: "#06B6D4",
  white: "#F8F8FF", muted: "rgba(255,255,255,0.45)", dimmed: "rgba(255,255,255,0.2)",
};

const css = {
  card: { background: G.bgCard, border: `1px solid ${G.border}`, borderRadius: 16, backdropFilter: "blur(12px)" },
  cardGlow: { background: G.bgCard, border: `1px solid ${G.borderHi}`, borderRadius: 16, backdropFilter: "blur(12px)", boxShadow: "0 0 30px rgba(124,58,237,0.15)" },
  input: { background: "rgba(255,255,255,0.06)", border: `1px solid ${G.border}`, borderRadius: 8, color: G.white, fontSize: 13, padding: "9px 13px", fontFamily: "sans-serif", width: "100%", boxSizing: "border-box", outline: "none" },
  label: { fontSize: 9, letterSpacing: 2, color: G.muted, fontFamily: "sans-serif", textTransform: "uppercase", marginBottom: 6, display: "block" },
  btn: (g = G.gPurple) => ({ background: g, border: "none", borderRadius: 8, color: G.white, padding: "9px 20px", cursor: "pointer", fontSize: 12, fontFamily: "sans-serif", fontWeight: 700, letterSpacing: 0.5 }),
  tag: (c) => ({ fontSize: 9, letterSpacing: 1.5, color: c, border: `1px solid ${c}`, borderRadius: 20, padding: "2px 9px", fontFamily: "sans-serif", textTransform: "uppercase", whiteSpace: "nowrap", display: "inline-block" }),
};



// ── CONFIRM DIALOG ───────────────────────────────────────────────────────────
function ConfirmDialog({ msg, subMsg, confirmLabel = "Eliminar", onConfirm, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9000, padding: 24 }}>
      <div style={{ background: "#0E0E24", border: "1px solid rgba(239,68,68,0.4)", borderRadius: 16, padding: "28px 32px", maxWidth: 400, width: "100%", boxShadow: "0 0 40px rgba(239,68,68,0.15)" }}>
        <div style={{ fontSize: 28, textAlign: "center", marginBottom: 12 }}>⚠️</div>
        <div style={{ fontSize: 15, color: G.white, fontFamily: "Georgia,serif", textAlign: "center", marginBottom: 8 }}>{msg}</div>
        {subMsg && <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", textAlign: "center", marginBottom: 20 }}>{subMsg}</div>}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
          <button onClick={onCancel} style={{ background: "transparent", border: `1px solid ${G.border}`, borderRadius: 8, color: G.muted, padding: "10px 24px", cursor: "pointer", fontSize: 13, fontFamily: "sans-serif" }}>Cancelar</button>
          <button onClick={onConfirm} autoFocus style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.5)", borderRadius: 8, color: "#EF4444", padding: "10px 24px", cursor: "pointer", fontSize: 13, fontFamily: "sans-serif", fontWeight: 700 }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

function useConfirm() {
  const [dialog, setDialog] = useState(null);
  const confirm = (msg, subMsg, confirmLabel) => new Promise(resolve => {
    setDialog({ msg, subMsg, confirmLabel: confirmLabel || "Eliminar", resolve });
  });
  const handleConfirm = () => { dialog?.resolve(true); setDialog(null); };
  const handleCancel = () => { dialog?.resolve(false); setDialog(null); };
  const ConfirmUI = dialog ? <ConfirmDialog msg={dialog.msg} subMsg={dialog.subMsg} confirmLabel={dialog.confirmLabel} onConfirm={handleConfirm} onCancel={handleCancel} /> : null;
  return { confirm, ConfirmUI };
}

// ── TOAST SYSTEM ─────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = (msg, type = "success", duration = 3000) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration);
  };
  return { toasts, show };
}

const TOAST_COLORS = {
  success: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.4)", color: "#10B981", icon: "✓" },
  error: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.4)", color: "#EF4444", icon: "✕" },
  info: { bg: "rgba(6,182,212,0.12)", border: "rgba(6,182,212,0.4)", color: "#06B6D4", icon: "ℹ" },
  warn: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.4)", color: "#F59E0B", icon: "⚠" },
};

function Toasts({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, maxWidth: 360 }}>
      {toasts.map(t => {
        const c = TOAST_COLORS[t.type] || TOAST_COLORS.success;
        return (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: c.bg, border: `1px solid ${c.border}`, borderRadius: 12, backdropFilter: "blur(20px)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", animation: "slideIn 0.2s ease" }}>
            <span style={{ fontSize: 14, color: c.color, fontWeight: 800, flexShrink: 0 }}>{c.icon}</span>
            <span style={{ fontSize: 12, color: "#F8F8FF", fontFamily: "sans-serif", lineHeight: 1.4 }}>{t.msg}</span>
          </div>
        );
      })}
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </div>
  );
}

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const USERS = [
  { id: "u1", name: "Kike", role: "Admin", password: "admin123" },
  { id: "u2", name: "Equipo", role: "Editor", password: "equipo123" },
  { id: "u3", name: "Cliente", role: "Viewer", password: "cliente123" },
];
const FASES = ["Atracción", "Valor", "Conversión"];
const ESTADOS_PIEZA = ["En cola", "Producción", "Aprobado", "Programado", "Publicado"];
const estadoColor = e => ({ "En cola": G.muted, "Producción": G.orange, "Aprobado": G.blue, "Programado": G.cyan, "Publicado": G.green }[e] || G.muted);
const faseColor = f => ({ Atracción: G.magenta, Valor: G.purple, Conversión: G.green }[f] || G.muted);
const faseGrad = f => ({ Atracción: G.gMagenta, Valor: G.gViolet, Conversión: G.gGreen }[f] || G.gPurple);

const uid = () => Math.random().toString(36).slice(2, 9);
const pct = (d, t) => t ? Math.round(d / t * 100) : 0;
const fmtDate = iso => { const d = new Date(iso); return `${d.toLocaleDateString("es-MX")} ${d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`; };

// ── SECUENCIAS DATA ────────────────────────────────────────────────────────────
const SECUENCIA_VALOR = [
  {
    dia: 1, diaNombre: "Lunes", tipo: "StoryTelling / Antes y Después",
    objetivo: "Mostrar cómo pasaste de tu momento anterior a través de tu vehículo al resultado.",
    estructura: [
      { paso: "Capta la atención", items: ["Cómo lograste X resultados en X tiempo", "Cómo pasaste del punto A al punto B", "Los beneficios que obtuviste"] },
      { paso: "Narrar el ANTES", items: ["Emociones dolorosas", "Lo que ocurría a tu alrededor y el caos", "Las barreras de ese momento"] },
      { paso: "Narrar el DESPUÉS", items: ["El resultado que tu vehículo te permitió tener", "Describe cómo cambió todo", "Las acciones que tomaste y los resultados"] },
      { paso: "Momentos WOW / Aprendizajes", items: ["¿Qué hiciste para mejorar?", "¿Cuáles medidas tomaste?", "¿Qué hiciste para cambiar?", "Vender el método con pasos"] },
      { paso: "Inspirar al público", items: ["Agradecimiento", "Aprendizaje que tuviste"] },
      { paso: "CTA", items: ["Preguntarles sobre el sueño", "Si quieren conocer el vehículo"] },
      { paso: "Formato", items: ["Foto de ANTES y DESPUÉS", "Que se note la diferencia y se vea tu rostro", "Capturas de pantalla o puntos comparativos"] },
    ],
    color: G.magenta, grad: G.gMagenta,
  },
  {
    dia: 2, diaNombre: "Martes", tipo: "Post de contenido de valor",
    objetivo: "Mostrar tu autoridad. Demostrar que sabes, ser de utilidad y generar más curiosidad.",
    estructura: [
      { paso: "Gancho", items: ["Cuantitativo (3 Consejos, 4 Secretos...)", "Basado en el beneficio (Cómo obtuve X resultado)"] },
      { paso: "Credibilidad", items: ["Resultados que tú y/o tu cliente obtuvieron"] },
      { paso: "Valor detallado", items: ["Qué (lo que deben hacer) y por qué (el beneficio)", "Puntos clave/lecciones + ejemplos reales", "Paso a paso numerado o con puntos clave"] },
      { paso: "Acción", items: ["Qué pueden hacer ahora para obtener resultados"] },
      { paso: "Formato", items: ["Carrusel o video educativo"] },
    ],
    color: G.purple, grad: G.gViolet,
  },
  {
    dia: 3, diaNombre: "Miércoles", tipo: "Post de descubrimiento – Momento Wow",
    objetivo: "Contar los diferentes acontecimientos que te llevaron a encontrar una solución.",
    estructura: [
      { paso: "Gancho", items: ["Posicionar el problema y por qué es importante", "Controversial / Observación / Pregunta"] },
      { paso: "Creencias más comunes", items: ["'Esto es lo que piensa la mayoría…'"] },
      { paso: "Defiende tu posición", items: ["'Estoy a punto de mostrarte por qué esto no funciona, y qué hacer'"] },
      { paso: "Prueba social", items: ["Historia donde respaldas tu posición", "Argumentos lógicos y emocionales", "Tu historia de antes"] },
      { paso: "Consecuencias de creencias comunes", items: ["El daño que estas creencias pueden crear", "'Si sigues creyéndolas, esto es lo que te va a pasar'"] },
      { paso: "Revela la solución", items: ["Lo que has hecho para resolver el problema", "La pieza faltante", "Cómo cambió tu vida"] },
      { paso: "Conclusión / Lección", items: ["Resume los beneficios", "Dales tarea o pasos de acción"] },
      { paso: "Formato", items: ["Foto"] },
    ],
    color: G.blue, grad: G.gBlue,
  },
  {
    dia: 4, diaNombre: "Jueves", tipo: "Post de contenido de valor",
    objetivo: "Mostrar tu autoridad.",
    estructura: [
      { paso: "Gancho", items: ["Cuantitativo (3 Consejos, 4 Secretos...)", "Basado en el beneficio"] },
      { paso: "Credibilidad", items: ["Resultados que tú y/o tu cliente obtuvieron"] },
      { paso: "Valor detallado", items: ["Qué y por qué", "Puntos clave + ejemplos reales", "Paso a paso"] },
      { paso: "Acción", items: ["Qué pueden hacer ahora"] },
      { paso: "Formato elegido", items: ["Carrusel o video"] },
    ],
    color: G.purple, grad: G.gViolet,
  },
  {
    dia: 5, diaNombre: "Viernes", tipo: "Caso de éxito o Reel de valor",
    objetivo: "Mostrar resultados concretos y aumentar autoridad.",
    estructura: [
      { paso: "Gancho", items: ["Cuantitativo (3 Consejos, 4 Secretos...)", "Basado en el beneficio (Cómo obtener X resultado)"] },
      { paso: "Resalta el problema principal", items: ["Relevante: dolor del infierno actual", "Escena de película: descripción vívida", "Emociones: cómo les hace sentir eso"] },
      { paso: "3 a 5 consejos", items: ["Que contribuyan a resolver el problema"] },
      { paso: "CTA", items: ["Comentar una palabra clave para generar interacción"] },
    ],
    color: G.green, grad: G.gGreen,
  },
  {
    dia: 6, diaNombre: "Sábado", tipo: "Día a día o motivación",
    objetivo: "Conectar emocionalmente con la audiencia y humanizar tu marca.",
    estructura: [
      { paso: "Emoción que te genera tu hoy", items: ["¿Cómo estás hoy?", "Relato de un momento actual", "Descripción de lo que estás viviendo hoy"] },
      { paso: "El cómo te sentías antes", items: ["En una o dos oraciones", "Las emociones más difíciles"] },
      { paso: "Cómo superaste los retos", items: ["Aquello que marcó tu vida", "Palabras inspiradoras", "Motivo de tomar acción"] },
      { paso: "Mensaje motivacional", items: ["Inspíralos a sentirse capaces"] },
      { paso: "Invítalos a seguir trabajando en ellos", items: ["CTA suave de conexión"] },
    ],
    color: G.orange, grad: G.gOrange,
  },
  {
    dia: 7, diaNombre: "Domingo", tipo: "Subiendo nivel de consciencia",
    objetivo: "Aumentar interacciones en comentarios y temperatura del lead.",
    estructura: [
      { paso: "Ofrece contenido de regalo", items: ["Descargables o lead magnet", "Episodios de podcast", "Videos de YouTube", "Entrenamientos"] },
      { paso: "CTA para comentar", items: ["'Comenta YO' o palabra clave para recibir el regalo"] },
    ],
    color: G.cyan, grad: G.gCyan,
  },
];

const SECUENCIA_VENTA = [
  {
    dia: 1, diaNombre: "Lunes", tipo: "Lanzamiento para atraer leads",
    objetivo: "Atraer un número concreto de prospectos o leads.",
    estructura: [
      { paso: "Audiencia", items: ["'Estoy buscando a X, X y X'"] },
      { paso: "Resultado de la transformación", items: ["'Llevarlos a conseguir X resultados'"] },
      { paso: "Escasez", items: ["Buscamos # de personas", "Número limitado"] },
      { paso: "Método", items: ["Vender que el resultado se da a través de tu método"] },
      { paso: "CTA", items: ["¿Quién se suma?", "Comenta 'XX'"] },
    ],
    color: G.magenta, grad: G.gMagenta,
  },
  {
    dia: 2, diaNombre: "Martes", tipo: "Post de Oferta completa",
    objetivo: "Lanzar la oferta de forma completa a la audiencia.",
    estructura: [
      { paso: "Gancho", items: ["Preguntar si quiere obtener el resultado o la transformación"] },
      { paso: "Credibilidad", items: ["Resultados que tú y/o tu cliente obtuvieron"] },
      { paso: "Transición", items: ["Mostrar que no fue siempre así"] },
      { paso: "Barrera", items: ["Dolor del cliente en este momento", "Describir el momento de vida", "Emociones internas que está enfrentando"] },
      { paso: "Aprendizaje", items: ["Cambios que adoptaste", "Pasos que seguiste", "Claves de tu vida"] },
      { paso: "Lanzamiento de la oferta", items: ["Anunciar la tensión de compra", "Motivos que te llevan a esa decisión"] },
      { paso: "Urgencia y resultados", items: ["Los resultados que van a tener"] },
      { paso: "CTA de palabra clave", items: ["Comenta la palabra clave"] },
    ],
    color: G.purple, grad: G.gViolet,
  },
  {
    dia: 3, diaNombre: "Miércoles", tipo: "Derribar objeciones",
    objetivo: "Tumbar objeciones haciendo evidentes las creencias o errores que cometen.",
    estructura: [
      { paso: "Gancho", items: ["Posicionar el problema y por qué es importante", "Controversial / Observación / Pregunta"] },
      { paso: "Creencias más comunes", items: ["'Esto es lo que piensa la mayoría…'"] },
      { paso: "Defiende tu posición", items: ["'Estoy a punto de mostrarte por qué esto no funciona, y qué hacer'"] },
      { paso: "Dolores de esas creencias", items: ["Enlista los dolores o consecuencias"] },
      { paso: "Momento WOW", items: ["Por qué estas creencias son falsas", "Qué les falta para obtener el resultado"] },
      { paso: "Revela la solución", items: ["Describe la pieza faltante", "Cómo cambió tu vida"] },
      { paso: "Prueba social", items: ["Historia que respalda tu posición", "Argumentos lógicos y emocionales"] },
      { paso: "Consecuencias de las creencias", items: ["El daño que estas creencias pueden crear", "'Si sigues creyéndolas…'"] },
      { paso: "Lanzamiento de la oferta", items: ["Tensión de compra", "Urgencia y resultados"] },
      { paso: "CTA de palabra clave", items: ["Comenta la palabra clave"] },
    ],
    color: G.red, grad: G.gOrange,
  },
  {
    dia: 4, diaNombre: "Jueves", tipo: "Post de Antes y Después",
    objetivo: "Mostrar cómo pasaste de tu momento anterior a través de tu vehículo al resultado.",
    estructura: [
      { paso: "Capta la atención", items: ["Cómo lograste X resultados en X tiempo", "Cómo pasaste del punto A al B", "Los beneficios que obtuviste"] },
      { paso: "Narrar el ANTES", items: ["Emociones dolorosas", "Lo que ocurría a tu alrededor y el caos", "Las barreras de ese momento"] },
      { paso: "Narrar el DESPUÉS", items: ["El resultado que tu vehículo te permitió tener", "Cómo cambió todo", "Las acciones y los resultados"] },
      { paso: "Momentos WOW / Aprendizajes", items: ["Qué hiciste para mejorar", "Vender el método con pasos"] },
      { paso: "Inspirar al público", items: ["Agradecimiento", "Aprendizaje"] },
      { paso: "Formato", items: ["Foto ANTES y DESPUÉS", "Que se note la diferencia", "Capturas de pantalla"] },
    ],
    color: G.blue, grad: G.gBlue,
  },
  {
    dia: 5, diaNombre: "Viernes", tipo: "Caso de éxito o Reel de valor",
    objetivo: "Mostrar resultados y aumentar credibilidad.",
    estructura: [
      { paso: "Gancho", items: ["Cuantitativo (3 Consejos, 4 Secretos...)", "Basado en el beneficio"] },
      { paso: "Resalta el problema principal", items: ["Dolor del infierno actual", "Escena vívida", "Emociones"] },
      { paso: "3 a 5 consejos", items: ["Que contribuyan a resolver el problema"] },
      { paso: "CTA", items: ["Comentar palabra clave para interacción"] },
    ],
    color: G.green, grad: G.gGreen,
  },
  {
    dia: 6, diaNombre: "Sábado", tipo: "Día a día o motivación",
    objetivo: "Conectar emocionalmente con la audiencia.",
    estructura: [
      { paso: "Gancho", items: ["Preguntar si quiere obtener el resultado"] },
      { paso: "Credibilidad", items: ["Resultados propios o de clientes"] },
      { paso: "Transición", items: ["Mostrar que no fue siempre así"] },
      { paso: "Barrera", items: ["Dolor del cliente", "Emociones internas"] },
      { paso: "Aprendizaje", items: ["Cambios que adoptaste", "Pasos que seguiste"] },
      { paso: "Lanzamiento de la oferta", items: ["Tensión de compra"] },
      { paso: "CTA de palabra clave", items: ["Comenta la palabra clave"] },
    ],
    color: G.orange, grad: G.gOrange,
  },
  {
    dia: 7, diaNombre: "Domingo", tipo: "Post de contenido de valor",
    objetivo: "Mostrar autoridad y mantener caliente la audiencia.",
    estructura: [
      { paso: "Gancho", items: ["Cuantitativo", "Basado en el beneficio"] },
      { paso: "Credibilidad", items: ["Resultados propios o de clientes"] },
      { paso: "Valor detallado", items: ["Qué y por qué", "Puntos clave + ejemplos reales", "Paso a paso"] },
      { paso: "Acción", items: ["Qué pueden hacer ahora"] },
    ],
    color: G.purple, grad: G.gViolet,
  },
  {
    dia: 8, diaNombre: "Lunes", tipo: "Caso de éxito o Antes y Después",
    objetivo: "Reforzar credibilidad con evidencia concreta.",
    estructura: [
      { paso: "Capta la atención", items: ["X resultados en X tiempo", "Punto A a punto B", "Los beneficios"] },
      { paso: "Narrar el ANTES y DESPUÉS", items: ["Emociones dolorosas antes", "El resultado y las acciones después"] },
      { paso: "Momentos WOW", items: ["Qué hiciste para mejorar", "Vender el método"] },
      { paso: "Lanzamiento de la oferta", items: ["Tensión de compra", "Urgencia"] },
      { paso: "CTA de palabra clave", items: ["Comenta la palabra clave"] },
      { paso: "Formato", items: ["Foto ANTES y DESPUÉS"] },
    ],
    color: G.magenta, grad: G.gMagenta,
  },
  {
    dia: 9, diaNombre: "Martes", tipo: "Derribar objeciones (2da ronda)",
    objetivo: "Segunda oleada de derribo de objeciones más profunda.",
    estructura: [
      { paso: "Gancho", items: ["Controversial / Observación / Pregunta"] },
      { paso: "Creencias más comunes", items: ["'Esto es lo que piensa la mayoría…'"] },
      { paso: "Defiende tu posición", items: ["Por qué no funciona lo que están haciendo"] },
      { paso: "Dolores de esas creencias", items: ["Consecuencias de seguir así"] },
      { paso: "Momento WOW", items: ["Por qué estas creencias son falsas"] },
      { paso: "Revela la solución", items: ["Pieza faltante", "Tu transformación"] },
      { paso: "Prueba social", items: ["Historia de respaldo"] },
      { paso: "Consecuencias", items: ["'Si sigues creyéndolas…'"] },
      { paso: "Lanzamiento de la oferta + urgencia", items: ["Tensión de compra", "CTA"] },
    ],
    color: G.red, grad: G.gOrange,
  },
  {
    dia: 10, diaNombre: "Miércoles", tipo: "Historia personal",
    objetivo: "Relatar una historia donde derribaste una objeción o limitación.",
    estructura: [
      { paso: "Historia de tu ANTES", items: ["El momento previo a la transformación"] },
      { paso: "Vehículo y acciones", items: ["Las acciones que superaste"] },
      { paso: "Objeción o creencia superada", items: ["La creencia que venciste"] },
      { paso: "Urgencia o escasez", items: ["El tiempo se acaba / plazas limitadas"] },
      { paso: "CTA", items: ["Comenta la palabra clave"] },
    ],
    color: G.cyan, grad: G.gCyan,
  },
  {
    dia: 11, diaNombre: "Jueves", tipo: "Caso de éxito o Antes y Después (3ra ronda)",
    objetivo: "Reforzar con más evidencia social.",
    estructura: [
      { paso: "Capta la atención", items: ["X resultados en X tiempo"] },
      { paso: "Narrar ANTES y DESPUÉS", items: ["Emociones dolorosas antes", "Resultado y acciones después"] },
      { paso: "Momentos WOW", items: ["Qué hiciste para cambiar"] },
      { paso: "Lanzamiento de la oferta", items: ["Tensión de compra", "Urgencia"] },
      { paso: "CTA + Formato", items: ["Foto ANTES y DESPUÉS", "Comenta la palabra clave"] },
    ],
    color: G.blue, grad: G.gBlue,
  },
  {
    dia: 12, diaNombre: "Viernes", tipo: "Oferta directa",
    objetivo: "Hablar directamente de la oferta sin rodeos.",
    estructura: [
      { paso: "Por qué deberían tomar la oferta", items: ["Los beneficios concretos"] },
      { paso: "El resultado que obtendrán", items: ["Descripción detallada de la transformación"] },
      { paso: "Urgencia de la fecha", items: ["¿Cuándo cierra la oferta?"] },
      { paso: "CTA directo", items: ["Comenta la palabra clave", "Link directo al WhatsApp o checkout"] },
    ],
    color: G.green, grad: G.gGreen,
  },
  {
    dia: 13, diaNombre: "Sábado", tipo: "Cuenta regresiva",
    objetivo: "Activar urgencia final con los días que faltan.",
    estructura: [
      { paso: "Lanzamiento + cuenta regresiva", items: ["Adaptar el post de lanzamiento agregando los días que faltan"] },
      { paso: "Tensión de compra", items: ["Mencionar la escasez o deadline"] },
      { paso: "CTA", items: ["Comenta la palabra clave"] },
    ],
    color: G.orange, grad: G.gOrange,
  },
  {
    dia: 14, diaNombre: "Domingo", tipo: "Último día – Cierre",
    objetivo: "Máxima urgencia. FALTAN 24 HORAS.",
    estructura: [
      { paso: "Lanzamiento + FALTAN 24 HORAS", items: ["Adaptar el post de lanzamiento con urgencia máxima"] },
      { paso: "Tensión de compra final", items: ["Esta es la última oportunidad"] },
      { paso: "CTA final", items: ["Comenta la palabra clave", "Último llamado al WhatsApp"] },
    ],
    color: G.red, grad: G.gOrange,
  },
];

const TENSIONES_COMPRA = [
  { id: "t1", label: "Primer lanzamiento", desc: "Primera vez que ofreces esto públicamente" },
  { id: "t2", label: "Aumento de precios", desc: "El precio sube al terminar el período" },
  { id: "t3", label: "Exclusividad – Primer grupo", desc: "Solo los primeros X acceden a condiciones especiales" },
  { id: "t4", label: "Cuenta regresiva", desc: "La oferta cierra en una fecha fija" },
];

// ── BANCO TEMPLATE (20 piezas Native) ─────────────────────────────────────────
const BANCO_TEMPLATE = [
  { fase: "Atracción", avatar: "Primerizo", dolor: "Miedo al error", titulo: "3 errores al comprar tierra en Yucatán", hook: "El 90% de los que compran terreno en Yucatán cometen este error...", ctaDm: "CHECKLIST" },
  { fase: "Atracción", avatar: "Primerizo", dolor: "Miedo a fraude", titulo: "Cómo detectar un fraude inmobiliario", hook: "Si un vendedor evita mostrarte esto... cuidado.", ctaDm: "GUIA" },
  { fase: "Atracción", avatar: "Patrimonial", dolor: "Plusvalía", titulo: "Por qué el dinero de CDMX fluye a Yucatán", hook: "Hay una razón por la que el dinero inteligente está llegando aquí.", ctaDm: "MAPA" },
  { fase: "Atracción", avatar: "Primerizo", dolor: "Presupuesto", titulo: "¿Qué compras realmente con $200k?", hook: "Si tienes $200,000 pesos esto es lo que puedes comprar hoy.", ctaDm: "OPCIONES" },
  { fase: "Atracción", avatar: "Lifestyle", dolor: "Libertad", titulo: "Por qué todos se mudan a Yucatán", hook: "Esto está pasando en Mérida y pocos lo ven venir.", ctaDm: "MERIDA" },
  { fase: "Atracción", avatar: "Patrimonial", dolor: "Comparativa", titulo: "Terreno vs Departamento: ¿Cuál gana?", hook: "Si buscas plusvalía pura, esta opción suele ganar.", ctaDm: "PLUS" },
  { fase: "Atracción", avatar: "Primerizo", dolor: "Miedo financiero", titulo: "El error más caro al invertir", hook: "He visto gente perder mucho dinero por este pequeño detalle.", ctaDm: "ERROR" },
  { fase: "Atracción", avatar: "Patrimonial", dolor: "Crecimiento", titulo: "Las 3 zonas con mayor crecimiento en 2024", hook: "Estas 3 zonas están creciendo más rápido que el resto.", ctaDm: "ZONAS" },
  { fase: "Atracción", avatar: "Lifestyle", dolor: "Aspiración", titulo: "Un fin de semana en la costa de Yucatán", hook: "Así es la vida cuando inviertes cerca de la playa.", ctaDm: "PLAYA" },
  { fase: "Atracción", avatar: "Primerizo", dolor: "Incertidumbre", titulo: "La verdad sobre la plusvalía", hook: "La plusvalía no es magia, es infraestructura. Mira esto.", ctaDm: "PLUSVALIA" },
  { fase: "Atracción", avatar: "Patrimonial", dolor: "Protección", titulo: "Por qué la tierra protege tu patrimonio", hook: "Muchos empresarios invierten en tierra por esta razón estratégica.", ctaDm: "PATRIMONIO" },
  { fase: "Atracción", avatar: "Todos", dolor: "Educación básica", titulo: "Lo que nadie te dice del costo real", hook: "Invertir en tierra tiene costos ocultos. Aquí te los digo.", ctaDm: "INVERTIR" },
  { fase: "Valor", avatar: "Todos", dolor: "Confianza", titulo: "Cómo funciona el sistema Native", hook: "Así filtramos los proyectos antes de recomendarlos.", ctaDm: "SISTEMA" },
  { fase: "Valor", avatar: "Todos", dolor: "Seguridad Legal", titulo: "Documentos que debe tener un terreno seguro", hook: "Si un terreno no tiene esto... corre.", ctaDm: "DOCUMENTOS" },
  { fase: "Valor", avatar: "Patrimonial", dolor: "Estrategia", titulo: "Cómo elegimos zonas con plusvalía", hook: "Antes de invertir revisamos estos 3 factores clave.", ctaDm: "ZONA" },
  { fase: "Valor", avatar: "Primerizo", dolor: "Proceso", titulo: "Paso a paso para tu primera inversión", hook: "Así es el proceso completo, desde el clic hasta la firma.", ctaDm: "PASOS" },
  { fase: "Valor", avatar: "Todos", dolor: "Miedo Legal", titulo: "Qué revisar antes de firmar un contrato", hook: "Nunca firmes nada sin verificar estos puntos.", ctaDm: "CONTRATO" },
  { fase: "Valor", avatar: "Patrimonial", dolor: "Análisis", titulo: "Cómo evaluar una oportunidad inmobiliaria", hook: "Así analizamos nosotros si un terreno vale la pena.", ctaDm: "ANALISIS" },
  { fase: "Conversión", avatar: "Primerizo", dolor: "Guía Directa", titulo: "¿Quieres invertir pero no sabes por dónde empezar?", hook: "He ayudado a decenas de personas a invertir seguro en Yucatán.", ctaDm: "INVERTIR" },
  { fase: "Conversión", avatar: "Todos", dolor: "Oportunidad", titulo: "Oportunidades de inversión activas este mes", hook: "Aquí están los proyectos que pasaron nuestro filtro hoy.", ctaDm: "TERRENOS" },
].map((p, i) => ({ ...p, id: uid(), num: i + 1, estado: "En cola", formato: "", fechaProg: "", copy: "", guion: "", instrucciones: "", notasInternas: "", linkRecursos: "", linkFinal: "", linkEvidencia: "", origen: "manual", origenRef: null, anotaciones: [] }));

const ONBOARDING_STEPS = [
  {
    id: "ob1", dias: "Días 1–4", titulo: "Auditoría & Setup", items: [
      { id: "o1", text: "Auditoría completa del perfil actual" },
      { id: "o2", text: "Setup de Business Manager y Meta Ads" },
      { id: "o3", text: "Cuestionario de posicionamiento completado" },
      { id: "o4", text: "Diagnóstico de zona y cliente ideal definido" },
    ]
  },
  {
    id: "ob2", dias: "Días 5–8", titulo: "Contenido & Guiones", items: [
      { id: "o5", text: "Guiones de video entregados al broker" },
      { id: "o6", text: "Primera sesión de fotos/videos coordinada" },
      { id: "o7", text: "Material base recibido del broker" },
      { id: "o8", text: "Calendario del mes listo y aprobado" },
    ]
  },
  {
    id: "ob3", dias: "Días 9–12", titulo: "Producción & Aprobación", items: [
      { id: "o9", text: "Primeras piezas editadas y diseñadas" },
      { id: "o10", text: "Revisión y aprobación del broker" },
      { id: "o11", text: "Programación de los primeros posts" },
      { id: "o12", text: "Optimización de perfil aplicada" },
    ]
  },
  {
    id: "ob4", dias: "Día 15", titulo: "Lanzamiento", items: [
      { id: "o13", text: "Lanzamiento oficial de campañas de tráfico" },
      { id: "o14", text: "Pauta activada con presupuesto definido" },
      { id: "o15", text: "Grupo de WhatsApp activo con cliente" },
      { id: "o16", text: "Reporte de arranque enviado" },
    ]
  },
];

const INSTALACION_SECTIONS = [
  {
    id: "in1", label: "Bio & SEO", icon: "✦", items: [
      { id: "i1", text: "Nombre SEO optimizado con palabras clave buscables" },
      { id: "i2", text: "Gancho de bio cambiado de 'empresa líder' a metodología protectora" },
      { id: "i3", text: "CTA directo en bio (Agenda asesoría / WhatsApp link)" },
      { id: "i4", text: "Link de bio apuntando a lead magnet o agenda" },
    ]
  },
  {
    id: "in2", label: "Arquitectura de Destacadas", icon: "◈", items: [
      { id: "i5", text: "Orden estratégico: Invertir → Proyectos → Casos → Terrenos → FAQ" },
      { id: "i6", text: "Story fija de conversión en highlight INVERTIR" },
      { id: "i7", text: "CTA al final de cada highlight ('Escribe INVERTIR')" },
      { id: "i8", text: "Diseño visual coherente con marca personal" },
    ]
  },
  {
    id: "in3", label: "3 Posts Fijados", icon: "◉", items: [
      { id: "i9", text: "Post 1 — El Manual: Cómo invertir paso a paso (video tutorial)" },
      { id: "i10", text: "Post 2 — El Filtro: 3 errores fatales (establece autoridad)" },
      { id: "i11", text: "Post 3 — El Origen: Por qué creamos esto (conexión emocional)" },
    ]
  },
  {
    id: "in4", label: "Puntos Ciegos a Evitar", icon: "◆", items: [
      { id: "i12", text: "Perfil no parece valla publicitaria de los 90s" },
      { id: "i13", text: "Cada sección tiene CTA directo visible" },
      { id: "i14", text: "Sin renders de proyectos en contenido de Atracción" },
      { id: "i15", text: "Velocidad de respuesta a DM < 15 minutos configurada" },
    ]
  },
];

// ── STORAGE ───────────────────────────────────────────────────────────────────
async function stor(op, key, val) {
  try {
    if (op === "get") { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; }
    if (op === "set") await window.storage.set(key, JSON.stringify(val));
    if (op === "del") await window.storage.delete(key);
  } catch { return null; }
}

// ── AUDIT ─────────────────────────────────────────────────────────────────────
function mkLog(user, brokerName, mes, type, desc, pieceId = null, pieceTitulo = null) {
  return { id: uid(), ts: new Date().toISOString(), user: user.name, role: user.role, brokerName, mes, type, desc, pieceId, pieceTitulo };
}

// ── GRADIENT TEXT ─────────────────────────────────────────────────────────────
function GText({ children, g = G.gViolet, size = 14, weight = 700, style = {} }) {
  return <span style={{ background: g, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: size, fontWeight: weight, fontFamily: "sans-serif", ...style }}>{children}</span>;
}

// ── PROGRESS BAR ─────────────────────────────────────────────────────────────
function PBar({ val, g = G.gPurple, h = 5 }) {
  return (
    <div style={{ height: h, background: "rgba(255,255,255,0.08)", borderRadius: h, overflow: "hidden" }}>
      <div style={{ width: `${val}%`, height: "100%", background: g, borderRadius: h, transition: "width 0.5s ease" }} />
    </div>
  );
}

// ── STAT CARD ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, g, sub }) {
  return (
    <div style={{ ...css.card, padding: "16px 20px", flex: 1, minWidth: 100 }}>
      <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "monospace", marginBottom: 2 }}>
        <GText g={g} size={24}>{value}</GText>
      </div>
      <div style={{ fontSize: 9, color: G.muted, fontFamily: "sans-serif", letterSpacing: 1.5, textTransform: "uppercase" }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: G.dimmed, fontFamily: "sans-serif", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [sel, setSel] = useState(USERS[0].id);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const handle = () => {
    const u = USERS.find(x => x.id === sel);
    if (u.password === pw) onLogin(u);
    else setErr("Contraseña incorrecta.");
  };
  return (
    <div style={{ minHeight: "100vh", background: G.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, background: G.gPurple, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28, boxShadow: "0 0 40px rgba(124,58,237,0.4)" }}>▼</div>
          <GText g={G.gMagenta} size={11} weight={600} style={{ letterSpacing: 4, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Sistema de Embudo Invertido™</GText>
          <div style={{ fontSize: 24, color: G.white, fontFamily: "Georgia,serif", marginBottom: 6 }}>Bienvenido</div>
          <div style={{ fontSize: 12, color: G.muted, fontFamily: "sans-serif" }}>Inicia sesión para continuar</div>
        </div>
        <div style={{ ...css.cardGlow, padding: 28 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={css.label}>Usuario</label>
            <select value={sel} onChange={e => setSel(e.target.value)} style={{ ...css.input, color: G.purpleHi }}>
              {USERS.map(u => <option key={u.id} value={u.id}>{u.name} — {u.role}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={css.label}>Contraseña</label>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} placeholder="••••••••" style={{ ...css.input, borderColor: err ? G.red : G.border }} />
            {err && <div style={{ fontSize: 10, color: G.red, fontFamily: "sans-serif", marginTop: 5 }}>{err}</div>}
          </div>
          <button onClick={handle} style={{ ...css.btn(), width: "100%", padding: "12px", fontSize: 13, boxShadow: "0 4px 20px rgba(124,58,237,0.3)" }}>Iniciar sesión →</button>
        </div>
        <div style={{ ...css.card, padding: "12px 16px", marginTop: 12 }}>
          <div style={{ fontSize: 8, color: G.dimmed, fontFamily: "sans-serif", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>Credenciales</div>
          {USERS.map(u => <div key={u.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif" }}>{u.name}</span>
            <span style={{ fontSize: 11, color: G.dimmed, fontFamily: "monospace" }}>{u.password}</span>
          </div>)}
        </div>
      </div>
    </div>
  );
}

// ── CLIENT LIST ───────────────────────────────────────────────────────────────
function BrokerList({ brokers, onSelect, onCreate, onDelete }) {
  const [name, setName] = useState("");
  return (
    <div style={{ minHeight: "100vh", background: G.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, background: G.gMagenta, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28, boxShadow: "0 0 40px rgba(236,72,153,0.3)" }}>▼</div>
          <GText g={G.gMagenta} size={10} weight={600} style={{ letterSpacing: 4, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Agencia Top Seller</GText>
          <div style={{ fontSize: 26, color: G.white, fontFamily: "Georgia,serif", marginBottom: 6 }}>Embudo Invertido™</div>
          <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", letterSpacing: 1 }}>Selecciona o crea un broker</div>
        </div>
        {brokers.length === 0 && <div style={{ ...css.card, padding: "20px", textAlign: "center", color: G.dimmed, fontFamily: "sans-serif", fontSize: 12, marginBottom: 16, borderStyle: "dashed" }}>Aún no tienes brokers. Crea el primero.</div>}
        {brokers.map(b => (
          <div key={b.id} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <button onClick={() => onSelect(b.id)} style={{ flex: 1, ...css.card, border: `1px solid ${G.border}`, padding: "14px 20px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 14, color: G.white, fontFamily: "Georgia,serif" }}>{b.name}</div>
                <div style={{ fontSize: 10, color: G.muted, fontFamily: "sans-serif", marginTop: 2 }}>{b.zona || "Mérida, Yucatán"}</div>
              </div>
              <GText g={G.gViolet} size={11}>Abrir →</GText>
            </button>
            <button onClick={() => onDelete(b.id)} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "14px 12px", cursor: "pointer", color: G.red, fontSize: 12 }}>✕</button>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && name.trim()) { onCreate(name.trim()); setName(""); } }} placeholder="Nombre del broker..." style={{ ...css.input, flex: 1, borderRadius: 10 }} />
          <button onClick={() => { if (name.trim()) { onCreate(name.trim()); setName(""); } }} style={{ ...css.btn(), borderRadius: 10, whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(124,58,237,0.3)" }}>+ Crear</button>
        </div>
      </div>
    </div>
  );
}


// ── ANOTACION INPUT ──────────────────────────────────────────────────────────
function AnotacionInput({ onAdd }) {
  const [texto, setTexto] = useState("");
  const handleAdd = () => {
    if (!texto.trim()) return;
    onAdd(texto.trim());
    setTexto("");
  };
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input value={texto} onChange={e => setTexto(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()}
        placeholder="Escribe tu comentario o sugerencia..." style={{ ...css.input, flex: 1, fontSize: 11, borderColor: "rgba(245,158,11,0.3)" }} />
      <button onClick={handleAdd} style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 8, color: G.orange, padding: "8px 14px", cursor: "pointer", fontSize: 11, fontFamily: "sans-serif", fontWeight: 700, whiteSpace: "nowrap" }}>
        Agregar 💬
      </button>
    </div>
  );
}

// ── PIECE MODAL ───────────────────────────────────────────────────────────────
// TA extracted outside to avoid remount-on-every-keystroke bug
function PieceTextArea({ value, onChange, label, rows = 3, placeholder = "", readOnly = false, locked = false }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={css.label}>{label}</label>
      {locked
        ? <div style={{ fontSize: 11, color: G.dimmed, fontFamily: "sans-serif", fontStyle: "italic" }}>🔒 Solo visible para el equipo</div>
        : <textarea value={value || ""} onChange={onChange} placeholder={placeholder} rows={rows} readOnly={readOnly}
          style={{ ...css.input, resize: "vertical", lineHeight: 1.6, opacity: readOnly ? 0.7 : 1 }} />}
    </div>
  );
}

function PieceModal({ piece, isViewer, canEdit, canDelete, userRole, onSave, onClose, onDelete, logs, toast }) {
  const [form, setForm] = useState({ formato: "", fechaProg: "", linkEvidencia: "", origen: "manual", anotaciones: [], ...piece });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const pLogs = logs.filter(l => l.pieceId === piece.id).sort((a, b) => b.ts.localeCompare(a.ts));
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
      <div style={{ background: "#0E0E24", border: `1px solid ${G.borderHi}`, borderRadius: 20, width: 600, maxWidth: "100%", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 0 60px rgba(124,58,237,0.2)" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${G.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <span style={css.tag(faseColor(piece.fase))}>{piece.fase}</span>
              <span style={{ fontSize: 9, color: G.muted, fontFamily: "sans-serif", alignSelf: "center" }}>#{piece.num}</span>
            </div>
            <div style={{ fontSize: 16, color: G.white, fontFamily: "Georgia,serif", lineHeight: 1.3 }}>{piece.titulo}</div>
            <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", marginTop: 4, fontStyle: "italic" }}>"{piece.hook}"</div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: G.muted, fontSize: 18, cursor: "pointer", flexShrink: 0 }}>✕</button>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <div style={{ marginBottom: 18 }}>
            <label style={css.label}>Estado</label>
            <div style={{ display: "flex", gap: 6 }}>
              {ESTADOS_PIEZA.map(e => (
                <button key={e} onClick={() => !isViewer && f("estado", e)} style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: `1px solid ${form.estado === e ? estadoColor(e) : G.border}`, background: form.estado === e ? `${estadoColor(e)}22` : "transparent", color: form.estado === e ? estadoColor(e) : G.muted, fontSize: 9, fontFamily: "sans-serif", cursor: isViewer ? "default" : "pointer", letterSpacing: 0.5, textTransform: "uppercase" }}>
                  {form.estado === e ? "● " : ""}{e}
                </button>
              ))}
            </div>
          </div>
          {/* Formato + Origen badge */}
          <div style={{ display: "flex", gap: 10, marginBottom: 18, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <label style={css.label}>Formato</label>
              <select value={form.formato || ""} onChange={e => f("formato", e.target.value)} disabled={isViewer}
                style={{ ...css.input, color: G.purpleHi }}>
                <option value="">Sin definir</option>
                {FORMATOS.map(fmt => <option key={fmt} value={fmt}>{FORMATO_ICON[fmt]} {fmt}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={css.label}>Link de evidencia</label>
              <input value={form.linkEvidencia || ""} onChange={e => f("linkEvidencia", e.target.value)} readOnly={isViewer} placeholder="URL del post, Drive, screenshot..." style={css.input} />
            </div>
            {form.origen === "secuencia" && (
              <div style={{ alignSelf: "flex-end", paddingBottom: 2 }}>
                <span style={{ fontSize: 9, color: G.cyan, fontFamily: "sans-serif", border: `1px solid ${G.cyan}44`, borderRadius: 6, padding: "6px 10px", display: "block" }}>📅 Desde secuencia</span>
              </div>
            )}
          </div>
          {/* Fecha programada */}
          <div style={{ marginBottom: 18 }}>
            <label style={css.label}>Fecha programada de publicación</label>
            <input type="date" value={form.fechaProg || ""} onChange={e => f("fechaProg", e.target.value)} readOnly={isViewer}
              style={{ ...css.input, colorScheme: "dark", width: "auto", minWidth: 200 }} />
            {form.fechaProg && <span style={{ fontSize: 10, color: G.muted, fontFamily: "sans-serif", marginLeft: 10 }}>
              {new Date(form.fechaProg + "T12:00:00").toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>}
          </div>
          <div style={{ fontSize: 8, letterSpacing: 3, color: G.dimmed, textTransform: "uppercase", fontFamily: "sans-serif", paddingBottom: 8, borderBottom: `1px solid ${G.border}`, marginBottom: 14 }}>Contenido del post</div>
          <PieceTextArea value={form.copy} onChange={e => f("copy", e.target.value)} label="Copy completo" rows={4} placeholder="Escribe el copy completo del post aquí..." readOnly={isViewer} />
          <PieceTextArea value={form.guion} onChange={e => f("guion", e.target.value)} label="Hook & estructura del guión" rows={3} placeholder="Hook, desarrollo, CTA..." readOnly={isViewer} />
          <div style={{ fontSize: 8, letterSpacing: 3, color: G.dimmed, textTransform: "uppercase", fontFamily: "sans-serif", paddingBottom: 8, borderBottom: `1px solid ${G.border}`, marginBottom: 14 }}>Producción</div>
          <PieceTextArea value={form.instrucciones} onChange={e => f("instrucciones", e.target.value)} label="Instrucciones de grabación / diseño" rows={3} placeholder="Ej: Grabar en locación, fondo neutro, ropa casual..." readOnly={isViewer} />
          <PieceTextArea value={form.notasInternas} onChange={e => f("notasInternas", e.target.value)} label="Notas internas del equipo 🔒" rows={2} placeholder="Solo visible para Kike y Equipo..." readOnly={isViewer} locked={isViewer} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[{ k: "linkRecursos", l: "Link de recursos" }, { k: "linkFinal", l: "Link diseño / video final" }].map(({ k, l }) => (
              <div key={k}>
                <label style={css.label}>{l}</label>
                <input value={form[k] || ""} onChange={e => f(k, e.target.value)} readOnly={isViewer} placeholder="https://..." style={{ ...css.input, opacity: isViewer ? 0.7 : 1 }} />
              </div>
            ))}
          </div>
          {pLogs.length > 0 && (
            <>
              <div style={{ fontSize: 8, letterSpacing: 3, color: G.dimmed, textTransform: "uppercase", fontFamily: "sans-serif", paddingBottom: 8, borderBottom: `1px solid ${G.border}`, marginBottom: 14, marginTop: 20 }}>Actividad ({pLogs.length})</div>
              <div style={{ maxHeight: 150, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
                {pLogs.map(l => (
                  <div key={l.id} style={{ display: "flex", gap: 10, padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: `1px solid ${G.border}` }}>
                    <div style={{ width: 28, height: 28, borderRadius: 20, background: G.gPurple, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: G.white, fontWeight: 700 }}>{l.user[0]}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 2, alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: G.white, fontFamily: "sans-serif", fontWeight: 700 }}>{l.user}</span>
                        <span style={{ fontSize: 9, color: G.dimmed, fontFamily: "monospace", marginLeft: "auto" }}>{fmtDate(l.ts)}</span>
                      </div>
                      <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif" }}>{l.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {/* ── ANOTACIONES DEL CLIENTE ── */}
          <div style={{ marginTop: 20, padding: "16px", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: G.orange, fontFamily: "sans-serif", textTransform: "uppercase", fontWeight: 700 }}>
                💬 Anotaciones{userRole === "Viewer" ? " del cliente" : " / Sugerencias del cliente"}
              </div>
              {canEdit && form.anotaciones?.some(a => !a.revisada) && (
                <span style={{ fontSize: 9, color: G.orange, fontFamily: "sans-serif", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 10, padding: "2px 8px" }}>
                  {form.anotaciones.filter(a => !a.revisada).length} sin revisar
                </span>
              )}
            </div>
            {/* Existing annotations */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
              {(form.anotaciones || []).length === 0 && (
                <div style={{ fontSize: 11, color: G.dimmed, fontFamily: "sans-serif", fontStyle: "italic" }}>
                  {userRole === "Viewer" ? "Escribe aquí tus comentarios o sugerencias sobre esta pieza." : "Sin anotaciones del cliente."}
                </div>
              )}
              {(form.anotaciones || []).map((a, ai) => (
                <div key={a.id} style={{ padding: "10px 12px", background: a.revisada ? "rgba(16,185,129,0.05)" : "rgba(245,158,11,0.06)", border: `1px solid ${a.revisada ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.2)"}`, borderRadius: 8, display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 4, alignItems: "center" }}>
                      <span style={{ fontSize: 9, color: G.orange, fontFamily: "sans-serif", fontWeight: 700 }}>Cliente</span>
                      <span style={{ fontSize: 9, color: G.dimmed, fontFamily: "monospace" }}>{a.ts ? fmtDate(a.ts) : ""}</span>
                      {a.revisada && <span style={{ fontSize: 8, color: G.green, fontFamily: "sans-serif" }}>✓ Revisada</span>}
                    </div>
                    <div style={{ fontSize: 12, color: G.white, fontFamily: "sans-serif", lineHeight: 1.5 }}>{a.texto}</div>
                  </div>
                  {canEdit && !a.revisada && (
                    <button onClick={() => f("anotaciones", form.anotaciones.map((x, xi) => xi === ai ? { ...x, revisada: true } : x))}
                      style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 6, color: G.green, fontSize: 10, padding: "3px 8px", cursor: "pointer", fontFamily: "sans-serif", whiteSpace: "nowrap", flexShrink: 0 }}>
                      ✓ Marcar revisada
                    </button>
                  )}
                </div>
              ))}
            </div>
            {/* New annotation input - only for Viewer */}
            {userRole === "Viewer" && (
              <AnotacionInput onAdd={(texto) => f("anotaciones", [...(form.anotaciones || []), { id: uid(), texto, ts: new Date().toISOString(), revisada: false }])} />
            )}
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
            {!isViewer && onDelete && !confirmDelete && (
              <button onClick={() => setConfirmDelete(true)} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, color: G.red, padding: "9px 16px", cursor: "pointer", fontSize: 12, fontFamily: "sans-serif", marginRight: "auto" }}>
                🗑 Eliminar
              </button>
            )}
            {confirmDelete && (
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginRight: "auto", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "6px 12px" }}>
                <span style={{ fontSize: 11, color: G.red, fontFamily: "sans-serif" }}>¿Confirmar eliminación?</span>
                <button onClick={() => onDelete(piece.id)} style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.5)", borderRadius: 6, color: G.red, padding: "4px 12px", cursor: "pointer", fontSize: 11, fontFamily: "sans-serif", fontWeight: 700 }}>Sí, eliminar</button>
                <button onClick={() => setConfirmDelete(false)} style={{ background: "transparent", border: `1px solid ${G.border}`, borderRadius: 6, color: G.muted, padding: "4px 10px", cursor: "pointer", fontSize: 11, fontFamily: "sans-serif" }}>Cancelar</button>
              </div>
            )}
            <button onClick={onClose} style={{ background: "transparent", border: `1px solid ${G.border}`, borderRadius: 8, color: G.muted, padding: "9px 20px", cursor: "pointer", fontSize: 12, fontFamily: "sans-serif" }}>Cerrar</button>
            {!isViewer && <button onClick={() => { onSave(form); if (toast) toast("Cambios guardados"); }} style={{ ...css.btn(), boxShadow: "0 4px 20px rgba(124,58,237,0.3)" }}>Guardar cambios</button>}
            {isViewer && <button onClick={() => { onSave(form); if (toast) toast("Anotación guardada 💬", "info"); }} style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.35)", borderRadius: 8, color: G.orange, padding: "9px 20px", cursor: "pointer", fontSize: 12, fontFamily: "sans-serif", fontWeight: 700 }}>Guardar anotación 💬</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── FORMATOS ─────────────────────────────────────────────────────────────────
const FORMATOS = ["Reel", "Carrusel", "Foto estática", "Historia", "Video largo (YouTube/IGTV)"];
const FORMATO_ICON = { "Reel": "🎬", "Carrusel": "🖼️", "Foto estática": "📷", "Historia": "⭕", "Video largo (YouTube/IGTV)": "▶️" };

// Sugerir formato según tipo de día
const sugeriFormatoParaDia = (tipo) => {
  if (/reel/i.test(tipo)) return "Reel";
  if (/carrusel|antes.*después|caso/i.test(tipo)) return "Carrusel";
  if (/historia personal|día a día|motivación/i.test(tipo)) return "Foto estática";
  if (/valor|autoridad|conscien/i.test(tipo)) return "Carrusel";
  if (/lanzamiento|oferta|venta/i.test(tipo)) return "Reel";
  return "Reel";
};

// Sugerir fase según tipo de secuencia y día
const sugerirFaseParaDia = (seqType, diaNum) => {
  if (seqType === "venta") return "Conversión";
  if (diaNum <= 2) return "Atracción";
  if (diaNum <= 5) return "Valor";
  return "Atracción";
};

// ── HISTORIAS DEL DÍA ─────────────────────────────────────────────────────────
const TIPOS_HISTORIA = ["Compartir post del día", "CTA directo", "Behind the scenes", "Testimonial", "Cuenta regresiva", "Encuesta/Interacción", "Otra"];

function HistoriasDelDia({ historias = [], onChange, isViewer, onEnviarAlBanco }) {
  const addHistoria = () => {
    onChange([...historias, { id: uid(), tipo: "Compartir post del día", copy: "", publicada: false, linkEvidencia: "", hora: "", bancoPiezaId: null }]);
  };
  const updateHistoria = (id, field, val) => onChange(historias.map(h => h.id === id ? { ...h, [field]: val } : h));
  const removeHistoria = (id) => onChange(historias.filter(h => h.id !== id));
  const sinEnviar = historias.filter(h => !h.bancoPiezaId).length;

  return (
    <div>
      <div style={{ fontSize: 8, letterSpacing: 3, color: G.cyan, textTransform: "uppercase", fontFamily: "sans-serif", paddingBottom: 8, borderBottom: `1px solid ${G.border}`, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>⭕ Historias del día ({historias.length})</span>
        <div style={{ display: "flex", gap: 6 }}>
          {!isViewer && sinEnviar > 0 && onEnviarAlBanco && (
            <button onClick={() => historias.filter(h => !h.bancoPiezaId).forEach(h => onEnviarAlBanco(h))}
              style={{ background: G.purple + "22", border: `1px solid ${G.purpleHi}44`, borderRadius: 6, color: G.purpleHi, fontSize: 9, padding: "3px 10px", cursor: "pointer", fontFamily: "sans-serif", fontWeight: 700 }}>
              📋 Enviar {sinEnviar > 1 ? `todas (${sinEnviar})` : "al Banco"}
            </button>
          )}
          {!isViewer && <button onClick={addHistoria} style={{ background: G.cyan + "22", border: `1px solid ${G.cyan}44`, borderRadius: 6, color: G.cyan, fontSize: 9, padding: "3px 10px", cursor: "pointer", fontFamily: "sans-serif", fontWeight: 700 }}>+ Historia</button>}
        </div>
      </div>
      {historias.length === 0 && (
        <div style={{ fontSize: 11, color: G.dimmed, fontFamily: "sans-serif", fontStyle: "italic", marginBottom: 12, padding: "10px 0" }}>
          Sin historias programadas. MentorKings recomienda compartir el post del día en stories.
          {!isViewer && <button onClick={addHistoria} style={{ marginLeft: 8, background: "transparent", border: `1px solid ${G.cyan}44`, borderRadius: 4, color: G.cyan, fontSize: 10, padding: "2px 8px", cursor: "pointer", fontFamily: "sans-serif" }}>Agregar →</button>}
        </div>
      )}
      {historias.map((h, hi) => (
        <div key={h.id} style={{ marginBottom: 10, padding: "12px 14px", background: h.publicada ? "rgba(6,182,212,0.06)" : "rgba(255,255,255,0.03)", borderRadius: 10, border: `1px solid ${h.bancoPiezaId ? G.purple + "44" : h.publicada ? G.cyan + "44" : G.border}` }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: h.publicada ? G.cyan + "33" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 9, color: h.publicada ? G.cyan : G.dimmed, fontWeight: 800 }}>{hi + 1}</span>
            </div>
            <select value={h.tipo} onChange={e => updateHistoria(h.id, "tipo", e.target.value)} disabled={isViewer}
              style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${G.border}`, borderRadius: 6, color: G.purpleHi, fontSize: 11, padding: "4px 8px", fontFamily: "sans-serif", flex: 1 }}>
              {TIPOS_HISTORIA.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input value={h.hora} onChange={e => updateHistoria(h.id, "hora", e.target.value)} placeholder="Hora (ej: 10:00am)" readOnly={isViewer}
              style={{ ...css.input, width: 110, fontSize: 10, padding: "4px 8px" }} />
            <button onClick={() => updateHistoria(h.id, "publicada", !h.publicada)}
              style={{ background: h.publicada ? "rgba(6,182,212,0.15)" : "transparent", border: `1px solid ${h.publicada ? G.cyan : G.border}`, borderRadius: 6, color: h.publicada ? G.cyan : G.muted, fontSize: 10, padding: "4px 8px", cursor: "pointer", fontFamily: "sans-serif", whiteSpace: "nowrap" }}>
              {h.publicada ? "✓ Pub." : "Publicar"}
            </button>
            {!isViewer && !h.bancoPiezaId && onEnviarAlBanco && (
              <button onClick={() => onEnviarAlBanco(h)}
                style={{ background: "transparent", border: `1px solid ${G.purpleHi}44`, borderRadius: 6, color: G.purpleHi, fontSize: 10, padding: "4px 8px", cursor: "pointer", fontFamily: "sans-serif", whiteSpace: "nowrap" }}>
                📋
              </button>
            )}
            {h.bancoPiezaId && <span style={{ fontSize: 8, color: G.purple, fontFamily: "sans-serif", whiteSpace: "nowrap", border: `1px solid ${G.purple}44`, borderRadius: 4, padding: "2px 6px" }}>✓ Banco</span>}
            {!isViewer && <button onClick={e => { e.stopPropagation(); removeHistoria(h.id); }} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 5, color: G.red, fontSize: 11, cursor: "pointer", padding: "3px 8px", fontFamily: "sans-serif" }}>✕ Eliminar</button>}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <label style={{ ...css.label, marginBottom: 4 }}>Copy / texto de la historia</label>
              <textarea value={h.copy} onChange={e => updateHistoria(h.id, "copy", e.target.value)} placeholder="Texto, CTA o descripción..." rows={2} readOnly={isViewer}
                style={{ ...css.input, resize: "none", fontSize: 11, lineHeight: 1.5 }} />
            </div>
            <div>
              <label style={{ ...css.label, marginBottom: 4 }}>Link de evidencia</label>
              <input value={h.linkEvidencia} onChange={e => updateHistoria(h.id, "linkEvidencia", e.target.value)} placeholder="Drive, screenshot, URL..." readOnly={isViewer}
                style={{ ...css.input, fontSize: 11 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── DÍA MODAL (Secuencias) ────────────────────────────────────────────────────
function DiaModal({ diaData, diaNum, seqType, cicloLabel, savedData, onSave, onClose, onCrearEnBanco, bancoPiezaId, isViewer, onEnviarHistoriaAlBanco, toast }) {
  const formatoSugerido = sugeriFormatoParaDia(diaData.tipo);
  const faseSugerida = sugerirFaseParaDia(seqType, diaNum);

  const [copy, setCopy] = useState(savedData?.copy || "");
  const [completado, setCompletado] = useState(savedData?.completado || false);
  const [nota, setNota] = useState(savedData?.nota || "");
  const [formato, setFormato] = useState(savedData?.formato || formatoSugerido);
  const [fase, setFase] = useState(savedData?.fase || faseSugerida);
  const [fechaProg, setFechaProg] = useState(savedData?.fechaProg || "");
  const [linkEvidencia, setLinkEvidencia] = useState(savedData?.linkEvidencia || "");
  const [historias, setHistorias] = useState(savedData?.historias || []);
  const [activeSection, setActiveSection] = useState("guia");

  const handleSave = () => onSave({ copy, completado, nota, formato, fase, fechaProg, linkEvidencia, historias });

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
      <div style={{ background: "#0E0E24", border: `1px solid ${diaData.color}44`, borderRadius: 20, width: 700, maxWidth: "100%", maxHeight: "94vh", overflowY: "auto", boxShadow: `0 0 60px ${diaData.color}22`, display: "flex", flexDirection: "column" }}>

        {/* Header */}
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${G.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 }}>
          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: diaData.grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 13, color: G.white, fontWeight: 800 }}>{diaNum}</span>
              </div>
              <span style={css.tag(diaData.color)}>{diaData.diaNombre}</span>
              <span style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif" }}>{seqType === "valor" ? "Sec. Valor" : "Sec. Venta"} · {cicloLabel}</span>
              {bancoPiezaId && <span style={{ fontSize: 9, color: G.green, fontFamily: "sans-serif", border: `1px solid ${G.green}44`, borderRadius: 4, padding: "1px 6px" }}>✓ En Banco</span>}
            </div>
            <div style={{ fontSize: 15, color: G.white, fontFamily: "Georgia,serif" }}>{diaData.tipo}</div>
            <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", marginTop: 3 }}>{diaData.objetivo}</div>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: G.muted, fontSize: 18, cursor: "pointer" }}>✕</button>
        </div>

        {/* Section tabs */}
        <div style={{ padding: "12px 24px", borderBottom: `1px solid ${G.border}`, display: "flex", gap: 6, flexShrink: 0 }}>
          <button onClick={() => setActiveSection("guia")} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${activeSection === "guia" ? diaData.color + "88" : G.border}`, background: activeSection === "guia" ? diaData.color + "11" : "transparent", color: activeSection === "guia" ? diaData.color : G.muted, fontSize: 10, fontFamily: "sans-serif", cursor: "pointer", fontWeight: activeSection === "guia" ? 700 : 400 }}>📖 Guía</button>
          <button onClick={() => setActiveSection("produccion")} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${activeSection === "produccion" ? diaData.color + "88" : G.border}`, background: activeSection === "produccion" ? diaData.color + "11" : "transparent", color: activeSection === "produccion" ? diaData.color : G.muted, fontSize: 10, fontFamily: "sans-serif", cursor: "pointer", fontWeight: activeSection === "produccion" ? 700 : 400 }}>✏️ Producción</button>
          <button onClick={() => setActiveSection("historias")} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${activeSection === "historias" ? diaData.color + "88" : G.border}`, background: activeSection === "historias" ? diaData.color + "11" : "transparent", color: activeSection === "historias" ? diaData.color : G.muted, fontSize: 10, fontFamily: "sans-serif", cursor: "pointer", fontWeight: activeSection === "historias" ? 700 : 400 }}>⭕ Historias ({historias.length})</button>
          <button onClick={() => setActiveSection("banco")} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${activeSection === "banco" ? diaData.color + "88" : G.border}`, background: activeSection === "banco" ? diaData.color + "11" : "transparent", color: activeSection === "banco" ? diaData.color : G.muted, fontSize: 10, fontFamily: "sans-serif", cursor: "pointer", fontWeight: activeSection === "banco" ? 700 : 400 }}>📋 Banco</button>
        </div>

        <div style={{ padding: "20px 24px", flex: 1 }}>

          {/* ── GUÍA ── */}
          {activeSection === "guia" && (
            <div>
              <div style={{ ...css.card, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Formato sugerido</div>
                  <div style={{ fontSize: 13, color: G.white, fontFamily: "sans-serif", fontWeight: 700 }}>{FORMATO_ICON[formatoSugerido]} {formatoSugerido}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Fase sugerida</div>
                  <div style={{ fontSize: 13, color: faseColor(faseSugerida), fontFamily: "sans-serif", fontWeight: 700 }}>{faseSugerida}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Recomendación</div>
                  <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif" }}>Máx 400 palabras · 200–300 ideal</div>
                </div>
              </div>
              {diaData.estructura.map((bloque, bi) => (
                <div key={bi} style={{ marginBottom: 10, padding: "12px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, borderLeft: `3px solid ${diaData.color}66` }}>
                  <div style={{ fontSize: 10, color: diaData.color, fontFamily: "sans-serif", fontWeight: 700, marginBottom: 6, letterSpacing: 0.5 }}>{bi + 1}. {bloque.paso}</div>
                  {bloque.items.map((item, ii) => (
                    <div key={ii} style={{ display: "flex", gap: 8, marginBottom: 3 }}>
                      <span style={{ color: G.dimmed, fontSize: 10, marginTop: 1 }}>▸</span>
                      <span style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* ── PRODUCCIÓN ── */}
          {activeSection === "produccion" && (
            <div>
              {/* Formato + Fase + Fecha */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={css.label}>Formato final</label>
                  <select value={formato} onChange={e => setFormato(e.target.value)} disabled={isViewer}
                    style={{ ...css.input, color: G.purpleHi }}>
                    {FORMATOS.map(f => <option key={f} value={f}>{FORMATO_ICON[f]} {f}</option>)}
                  </select>
                </div>
                <div>
                  <label style={css.label}>Fase del Banco</label>
                  <select value={fase} onChange={e => setFase(e.target.value)} disabled={isViewer}
                    style={{ ...css.input, color: faseColor(fase) }}>
                    {FASES.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label style={css.label}>Fecha programada</label>
                  <input type="date" value={fechaProg} onChange={e => setFechaProg(e.target.value)} readOnly={isViewer}
                    style={{ ...css.input, colorScheme: "dark" }} />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={css.label}>Copy del post</label>
                <textarea value={copy} onChange={e => setCopy(e.target.value)} readOnly={isViewer}
                  placeholder="Pega o escribe aquí el copy final listo para publicar..." rows={6}
                  style={{ ...css.input, resize: "vertical", lineHeight: 1.6 }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={css.label}>Nota del equipo</label>
                  <input value={nota} onChange={e => setNota(e.target.value)} readOnly={isViewer}
                    placeholder="Instrucciones, referencias, contexto..." style={css.input} />
                </div>
                <div>
                  <label style={css.label}>Link de evidencia (post publicado)</label>
                  <input value={linkEvidencia} onChange={e => setLinkEvidencia(e.target.value)} readOnly={isViewer}
                    placeholder="URL, Drive, screenshot..." style={css.input} />
                </div>
              </div>

              {/* Publicado toggle */}
              <button onClick={() => !isViewer && setCompletado(v => !v)}
                style={{ display: "flex", alignItems: "center", gap: 10, background: completado ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${completado ? G.green : G.border}`, borderRadius: 10, padding: "10px 16px", cursor: isViewer ? "default" : "pointer", width: "100%", marginBottom: 4 }}>
                <div style={{ width: 18, height: 18, borderRadius: 5, border: `1px solid ${completado ? G.green : G.border}`, background: completado ? "rgba(16,185,129,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {completado && <span style={{ fontSize: 10, color: G.green, fontWeight: 700 }}>✓</span>}
                </div>
                <span style={{ fontSize: 12, color: completado ? G.green : G.muted, fontFamily: "sans-serif" }}>
                  {completado ? "✓ Post publicado" : "Marcar como publicado"}
                </span>
              </button>
            </div>
          )}

          {/* ── HISTORIAS ── */}
          {activeSection === "historias" && (
            <HistoriasDelDia historias={historias} onChange={setHistorias} isViewer={isViewer} onEnviarAlBanco={onEnviarHistoriaAlBanco ? (h) => { onEnviarHistoriaAlBanco(h, diaNum); } : null} />
          )}

          {/* ── BANCO ── */}
          {activeSection === "banco" && (
            <div>
              <div style={{ ...css.card, padding: "16px 20px", marginBottom: 16 }}>
                <div style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Conexión con Banco de contenido</div>
                {bancoPiezaId ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: G.green, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: G.white, fontFamily: "sans-serif" }}>Pieza vinculada al Banco</span>
                    </div>
                    <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", lineHeight: 1.6 }}>
                      Esta pieza ya existe en el Banco. Desde ahí el equipo gestiona producción, aprobación y publicación. Los cambios de copy aquí <span style={{ color: G.orange }}>no se sincronizan automáticamente</span> — actualiza la pieza directamente en Banco si necesitas reflejar cambios.
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: 9, color: G.green, fontFamily: "sans-serif", border: `1px solid ${G.green}44`, borderRadius: 4, padding: "2px 8px" }}>ID: {bancoPiezaId.slice(0, 8)}…</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", lineHeight: 1.6 }}>
                      Esta pieza aún no está en el Banco. Al crear el borrador, se pre-llenará con el copy, formato (<strong style={{ color: G.white }}>{formato}</strong>), fase (<strong style={{ color: faseColor(fase) }}>{fase}</strong>){fechaProg ? ` y fecha programada (${fechaProg})` : ""}. El equipo podrá confirmarla y gestionar su producción desde Banco.
                    </div>
                    {!isViewer && (
                      <button onClick={() => { handleSave(); onCrearEnBanco({ copy, formato, fase, fechaProg, titulo: diaData.tipo, hook: diaData.objetivo }); if (toast) toast("📋 Borrador creado en Banco", "info"); }}
                        style={{ ...css.btn(diaData.grad), alignSelf: "flex-start", boxShadow: `0 4px 20px ${diaData.color}33`, display: "flex", alignItems: "center", gap: 8 }}>
                        📋 Crear borrador en Banco
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Resumen del día */}
              <div style={{ ...css.card, padding: "14px 18px" }}>
                <div style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>Resumen de configuración</div>
                {[
                  { l: "Formato", v: `${FORMATO_ICON[formato] || ""} ${formato}`, c: G.purpleHi },
                  { l: "Fase del Banco", v: fase, c: faseColor(fase) },
                  { l: "Fecha programada", v: fechaProg || "Sin definir", c: fechaProg ? G.white : G.dimmed },
                  { l: "Copy", v: copy ? `${copy.slice(0, 50)}…` : "Sin copy", c: copy ? G.muted : G.dimmed },
                  { l: "Historias", v: `${historias.length} del día · ${historias.filter(h => h.publicada).length} publicadas`, c: G.cyan },
                  { l: "Evidencia", v: linkEvidencia || "Sin link", c: linkEvidencia ? G.green : G.dimmed },
                ].map(({ l, v, c }) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: G.dimmed, fontFamily: "sans-serif" }}>{l}</span>
                    <span style={{ fontSize: 11, color: c, fontFamily: "sans-serif", maxWidth: 260, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{ padding: "14px 24px", borderTop: `1px solid ${G.border}`, display: "flex", gap: 10, justifyContent: "flex-end", flexShrink: 0 }}>
          <button onClick={onClose} style={{ background: "transparent", border: `1px solid ${G.border}`, borderRadius: 8, color: G.muted, padding: "9px 20px", cursor: "pointer", fontSize: 12, fontFamily: "sans-serif" }}>Cerrar</button>
          {!isViewer && <button onClick={() => { handleSave(); if (toast) toast(`Día ${diaNum} guardado`); }} style={{ ...css.btn(diaData.grad), boxShadow: `0 4px 20px ${diaData.color}44` }}>Guardar cambios</button>}
        </div>
      </div>
    </div>
  );
}

// ── SECUENCIAS TAB ─────────────────────────────────────────────────────────────
// data = { ciclos: [ { id, label, tipo, tension, dias: {1:{copy,completado,nota},...} } ], activoCicloId }
function SecuenciasTab({ data, onSave, isViewer, onCrearEnBanco, onEnviarHistoriaAlBanco, toast }) {
  const ciclos = data?.ciclos || [];
  const [activoCicloId, setActivoCicloId] = useState(() => {
    if (data?.activoCicloId) return data.activoCicloId;
    if (ciclos.length > 0) return ciclos[ciclos.length - 1].id;
    return null;
  });
  const [openDia, setOpenDia] = useState(null);
  const [showNuevoCiclo, setShowNuevoCiclo] = useState(false);
  const [nuevoCicloLabel, setNuevoCicloLabel] = useState("");
  const [nuevoCicloTipo, setNuevoCicloTipo] = useState("valor");
  const [vistaHistorial, setVistaHistorial] = useState(false);

  const cicloActivo = ciclos.find(c => c.id === activoCicloId) || null;
  const seqData = cicloActivo?.tipo === "venta" ? SECUENCIA_VENTA : SECUENCIA_VALOR;
  const days = cicloActivo?.dias || {};
  const tension = cicloActivo?.tension || "t1";

  const completados = seqData.filter(d => days[d.dia]?.completado).length;
  const progress = pct(completados, seqData.length);

  const persistCiclos = (updatedCiclos, newActivoId) => {
    onSave({ ciclos: updatedCiclos, activoCicloId: newActivoId ?? activoCicloId });
  };

  const crearCiclo = () => {
    if (!nuevoCicloLabel.trim()) return;
    const nuevo = { id: uid(), label: nuevoCicloLabel.trim(), tipo: nuevoCicloTipo, tension: "t1", dias: {}, creadoEn: new Date().toISOString() };
    const updated = [...ciclos, nuevo];
    setActivoCicloId(nuevo.id);
    setNuevoCicloLabel(""); setShowNuevoCiclo(false); setVistaHistorial(false);
    persistCiclos(updated, nuevo.id);
  };

  const eliminarCiclo = (id) => {
    const updated = ciclos.filter(c => c.id !== id);
    const newActivo = updated.length > 0 ? updated[updated.length - 1].id : null;
    setActivoCicloId(newActivo);
    persistCiclos(updated, newActivo);
  };

  const handleSaveDia = (diaNum, diaDataSaved) => {
    const updatedCiclos = ciclos.map(c => c.id === activoCicloId ? { ...c, dias: { ...c.dias, [diaNum]: diaDataSaved } } : c);
    persistCiclos(updatedCiclos);
    setOpenDia(null);
  };

  const handleTensionChange = (t) => {
    const updatedCiclos = ciclos.map(c => c.id === activoCicloId ? { ...c, tension: t } : c);
    persistCiclos(updatedCiclos);
  };

  const openDiaData = openDia ? seqData.find(d => d.dia === openDia) : null;

  // ── Empty state ──
  if (ciclos.length === 0 && !showNuevoCiclo) {
    return (
      <div style={{ padding: "24px 28px", overflowY: "auto", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📅</div>
          <GText g={G.gCyan} size={10} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Sin ciclos activos</GText>
          <div style={{ fontSize: 14, color: G.white, fontFamily: "Georgia,serif", marginBottom: 8 }}>Crea tu primer ciclo de secuencia</div>
          <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", marginBottom: 24 }}>Cada ciclo es un período completo de contenido (7 días de Valor o 14 días de Venta) con su propio historial y copy guardado.</div>
          {!isViewer && <button onClick={() => setShowNuevoCiclo(true)} style={{ ...css.btn(G.gCyan), boxShadow: `0 4px 20px ${G.cyan}33` }}>+ Nuevo ciclo</button>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 28px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
      {openDiaData && cicloActivo && (
        <DiaModal
          key={`${cicloActivo.id}-${openDia}`}
          diaData={openDiaData}
          diaNum={openDia}
          seqType={cicloActivo.tipo}
          cicloLabel={cicloActivo.label}
          savedData={days[openDia] || {}}
          onSave={(d) => handleSaveDia(openDia, d)}
          onClose={() => setOpenDia(null)}
          onCrearEnBanco={(piezaData) => onCrearEnBanco(piezaData, openDia, cicloActivo.id)}
          bancoPiezaId={days[openDia]?.bancoPiezaId || null}
          isViewer={isViewer}
          onEnviarHistoriaAlBanco={onEnviarHistoriaAlBanco ? (h, d) => onEnviarHistoriaAlBanco(h, d, cicloActivo.id) : null}
          toast={toast}
        />
      )}

      {/* ── HEADER ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <GText g={G.gCyan} size={10} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Secuencias de Contenido</GText>
          <div style={{ fontSize: 20, color: G.white, fontFamily: "Georgia,serif" }}>Ciclos de Publicación</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setVistaHistorial(v => !v)} style={{ background: vistaHistorial ? G.purpleDim : "transparent", border: `1px solid ${vistaHistorial ? G.borderHi : G.border}`, borderRadius: 8, color: vistaHistorial ? G.purpleHi : G.muted, fontSize: 10, padding: "7px 14px", cursor: "pointer", fontFamily: "sans-serif" }}>
            🕐 Historial ({ciclos.length})
          </button>
          {!isViewer && (
            <button onClick={() => { setShowNuevoCiclo(v => !v); setVistaHistorial(false); }} style={{ ...css.btn(showNuevoCiclo ? undefined : G.gCyan), fontSize: 11, boxShadow: showNuevoCiclo ? "none" : `0 4px 20px ${G.cyan}33` }}>
              {showNuevoCiclo ? "Cancelar" : "+ Nuevo ciclo"}
            </button>
          )}
        </div>
      </div>

      {/* ── NUEVO CICLO FORM ── */}
      {showNuevoCiclo && (
        <div style={{ ...css.cardGlow, padding: 20, marginBottom: 20, borderColor: G.cyan + "44" }}>
          <GText g={G.gCyan} size={9} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Nuevo ciclo</GText>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, alignItems: "end" }}>
            <div>
              <label style={css.label}>Nombre del ciclo</label>
              <input value={nuevoCicloLabel} onChange={e => setNuevoCicloLabel(e.target.value)} onKeyDown={e => e.key === "Enter" && crearCiclo()} placeholder="Ej: Semana Valor — Abril 2025" autoFocus style={css.input} />
            </div>
            <div>
              <label style={css.label}>Tipo de secuencia</label>
              <select value={nuevoCicloTipo} onChange={e => setNuevoCicloTipo(e.target.value)} style={{ ...css.input, color: G.purpleHi }}>
                <option value="valor">Secuencia de Valor (7 días)</option>
                <option value="venta">Secuencia de Venta (14 días)</option>
              </select>
            </div>
            <button onClick={crearCiclo} style={{ ...css.btn(G.gCyan), boxShadow: `0 4px 20px ${G.cyan}33`, whiteSpace: "nowrap" }}>Crear ciclo →</button>
          </div>
        </div>
      )}

      {/* ── HISTORIAL DE CICLOS ── */}
      {vistaHistorial && (
        <div style={{ ...css.card, padding: "16px 20px", marginBottom: 20 }}>
          <GText g={G.gViolet} size={9} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Todos los ciclos</GText>
          {ciclos.length === 0 && <div style={{ fontSize: 11, color: G.dimmed, fontFamily: "sans-serif" }}>Sin ciclos aún.</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[...ciclos].reverse().map(c => {
              const cSeqData = c.tipo === "venta" ? SECUENCIA_VENTA : SECUENCIA_VALOR;
              const cDone = cSeqData.filter(d => c.dias?.[d.dia]?.completado).length;
              const cPct = pct(cDone, cSeqData.length);
              const isActivo = c.id === activoCicloId;
              const cColor = c.tipo === "venta" ? G.magenta : G.purpleHi;
              const cGrad = c.tipo === "venta" ? G.gMagenta : G.gViolet;
              return (
                <div key={c.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", borderRadius: 10, border: `1px solid ${isActivo ? cColor + "55" : G.border}`, background: isActivo ? cColor + "08" : "transparent" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: isActivo ? G.white : G.muted, fontFamily: "sans-serif", fontWeight: 700 }}>{c.label}</span>
                      <span style={css.tag(cColor)}>{c.tipo === "venta" ? "Venta 14d" : "Valor 7d"}</span>
                      {isActivo && <span style={{ fontSize: 8, color: G.green, fontFamily: "sans-serif", border: `1px solid ${G.green}44`, borderRadius: 3, padding: "1px 6px" }}>● ACTIVO</span>}
                    </div>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ flex: 1, maxWidth: 200 }}><PBar val={cPct} g={cGrad} h={3} /></div>
                      <span style={{ fontSize: 10, color: G.dimmed, fontFamily: "monospace" }}>{cDone}/{cSeqData.length} días</span>
                      {c.creadoEn && <span style={{ fontSize: 9, color: G.dimmed, fontFamily: "monospace" }}>{new Date(c.creadoEn).toLocaleDateString("es-MX")}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {!isActivo && (
                      <button onClick={() => { setActivoCicloId(c.id); setVistaHistorial(false); persistCiclos(ciclos, c.id); }} style={{ background: "transparent", border: `1px solid ${cColor}44`, borderRadius: 6, color: cColor, fontSize: 10, padding: "5px 12px", cursor: "pointer", fontFamily: "sans-serif" }}>Abrir</button>
                    )}
                    {!isViewer && (
                      <button onClick={() => eliminarCiclo(c.id)} style={{ background: "transparent", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, color: G.red, fontSize: 10, padding: "5px 8px", cursor: "pointer" }}>✕</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── CICLO ACTIVO ── */}
      {cicloActivo && !vistaHistorial && (
        <>
          {/* Ciclo selector breadcrumb */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16, padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: `1px solid ${G.border}` }}>
            <span style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>Ciclo activo</span>
            <span style={{ fontSize: 12, color: G.white, fontFamily: "sans-serif", fontWeight: 700 }}>{cicloActivo.label}</span>
            <span style={css.tag(cicloActivo.tipo === "venta" ? G.magenta : G.purpleHi)}>{cicloActivo.tipo === "venta" ? "Venta 14d" : "Valor 7d"}</span>
            {ciclos.length > 1 && (
              <select
                value={activoCicloId}
                onChange={e => { setActivoCicloId(e.target.value); persistCiclos(ciclos, e.target.value); }}
                style={{ marginLeft: "auto", background: "rgba(255,255,255,0.06)", border: `1px solid ${G.border}`, borderRadius: 6, color: G.purpleHi, fontSize: 10, padding: "4px 8px", fontFamily: "sans-serif", cursor: "pointer" }}
              >
                {ciclos.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            )}
          </div>

          {/* Tensión de compra */}
          {cicloActivo.tipo === "venta" && (
            <div style={{ ...css.cardGlow, padding: 18, marginBottom: 20 }}>
              <GText g={G.gMagenta} size={9} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 12 }}>⚡ Tensión de compra — {cicloActivo.label}</GText>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {TENSIONES_COMPRA.map(t => (
                  <button key={t.id} onClick={() => !isViewer && handleTensionChange(t.id)} style={{ flex: "1 1 auto", padding: "10px 14px", borderRadius: 10, border: `1px solid ${tension === t.id ? G.magenta + "88" : G.border}`, background: tension === t.id ? G.magenta + "11" : "transparent", cursor: isViewer ? "default" : "pointer", textAlign: "left", transition: "all 0.2s" }}>
                    <div style={{ fontSize: 11, color: tension === t.id ? G.magenta : G.white, fontFamily: "sans-serif", fontWeight: 700, marginBottom: 3 }}>{tension === t.id ? "● " : ""}{t.label}</div>
                    <div style={{ fontSize: 10, color: G.dimmed, fontFamily: "sans-serif" }}>{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recomendaciones */}
          <div style={{ ...css.card, padding: "12px 16px", marginBottom: 20 }}>
            <div style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
              {cicloActivo.tipo === "valor" ? "Recomendaciones — Secuencia de Valor" : "Recomendaciones — Secuencia de Venta"}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(cicloActivo.tipo === "valor" ? [
                "Máx 400 palabras por post (200–300 ideal)",
                "Si no obtienes engagement, borra y republica",
                "Reserva 30–60 min para responder comentarios",
                "Comparte el post en historias junto con el video",
              ] : [
                "Máx 400 palabras por post (200–300 ideal)",
                "Úsala después de 1–2 semanas de Secuencia de Valor",
                "Define tu tensión de compra antes de empezar",
                "Cada post debe mencionar la tensión elegida",
              ]).map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start", width: "calc(50% - 4px)" }}>
                  <span style={{ color: cicloActivo.tipo === "valor" ? G.cyan : G.magenta, fontSize: 10, marginTop: 1, flexShrink: 0 }}>▸</span>
                  <span style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", lineHeight: 1.5 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grid de días */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {seqData.map((diaItem) => {
              const saved = days[diaItem.dia] || {};
              const isDone = saved.completado;
              const hasCopy = !!saved.copy;
              return (
                <div key={diaItem.dia} onClick={() => setOpenDia(diaItem.dia)}
                  style={{ ...css.card, padding: "16px 18px", cursor: "pointer", borderColor: isDone ? G.green + "44" : hasCopy ? diaItem.color + "33" : G.border, background: isDone ? "rgba(16,185,129,0.04)" : hasCopy ? diaItem.color + "08" : G.bgCard, transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = isDone ? G.green + "88" : diaItem.color + "66"; e.currentTarget.style.background = isDone ? "rgba(16,185,129,0.08)" : diaItem.color + "11"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = isDone ? G.green + "44" : hasCopy ? diaItem.color + "33" : G.border; e.currentTarget.style.background = isDone ? "rgba(16,185,129,0.04)" : hasCopy ? diaItem.color + "08" : G.bgCard; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: isDone ? "rgba(16,185,129,0.2)" : diaItem.grad, display: "flex", alignItems: "center", justifyContent: "center", border: isDone ? `1px solid ${G.green}44` : "none" }}>
                        <span style={{ fontSize: 11, color: isDone ? G.green : G.white, fontWeight: 800 }}>{isDone ? "✓" : diaItem.dia}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 9, color: isDone ? G.green : diaItem.color, fontFamily: "sans-serif", fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>{diaItem.diaNombre}</div>
                        <div style={{ fontSize: 10, color: isDone ? G.green + "88" : G.dimmed, fontFamily: "sans-serif" }}>{isDone ? "Publicado" : hasCopy ? "Copy listo" : "Pendiente"}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 9, color: G.dimmed, fontFamily: "monospace" }}>D{diaItem.dia}</span>
                  </div>
                  <div style={{ fontSize: 11, color: G.white, fontFamily: "sans-serif", fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>{diaItem.tipo}</div>
                  <div style={{ fontSize: 10, color: G.muted, fontFamily: "sans-serif", lineHeight: 1.5, marginBottom: 10 }}>{diaItem.objetivo.slice(0, 70)}{diaItem.objetivo.length > 70 ? "…" : ""}</div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 8, color: G.dimmed, fontFamily: "sans-serif", border: `1px solid ${G.border}`, borderRadius: 4, padding: "1px 6px" }}>{diaItem.estructura.length} pasos</span>
                    {hasCopy && !isDone && <span style={{ fontSize: 8, color: diaItem.color, fontFamily: "sans-serif" }}>● copy</span>}
                    {saved.fechaProg && <span style={{ fontSize: 8, color: G.blue, fontFamily: "sans-serif" }}>📅 {saved.fechaProg}</span>}
                    {saved.nota && <span style={{ fontSize: 8, color: G.orange, fontFamily: "sans-serif" }}>📌 nota</span>}
                  </div>
                  {hasCopy && (
                    <div style={{ marginTop: 8, padding: "8px 10px", background: "rgba(255,255,255,0.04)", borderRadius: 6, borderLeft: `2px solid ${isDone ? G.green : diaItem.color}66` }}>
                      <div style={{ fontSize: 10, color: G.dimmed, fontFamily: "sans-serif", lineHeight: 1.5 }}>{saved.copy.slice(0, 80)}{saved.copy.length > 80 ? "…" : ""}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Summary footer */}
          <div style={{ ...css.card, padding: "16px 20px", marginTop: 20, display: "flex", gap: 20, alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Progreso · {cicloActivo.label}</div>
              <PBar val={progress} g={cicloActivo.tipo === "valor" ? G.gViolet : G.gMagenta} h={6} />
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              {[
                { val: completados, label: "publicados", g: cicloActivo.tipo === "valor" ? G.gViolet : G.gMagenta },
                { val: seqData.filter(d => days[d.dia]?.copy && !days[d.dia]?.completado).length, label: "con copy", g: G.gOrange },
                { val: seqData.length - completados, label: "pendientes", g: G.gBlue },
              ].map(({ val, label, g }) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <GText g={g} size={20} weight={800}>{val}</GText>
                  <div style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── BANCO TAB ─────────────────────────────────────────────────────────────────
// BancoSel — defined outside BancoTab to avoid remount bug
function BancoSel({ val, set, opts }) {
  return (
    <select value={val} onChange={e => set(e.target.value)} style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${G.border}`, borderRadius: 8, color: G.purpleHi, fontSize: 11, padding: "6px 10px", fontFamily: "sans-serif", cursor: "pointer" }}>
      {opts.map(o => <option key={o.v ?? o} value={o.v ?? o}>{o.l ?? o}</option>)}
    </select>
  );
}

function BancoTab({ piezas, onSave, onAdd, onDelete, isViewer, canEdit, canDelete, logs, toast, userRole }) {
  const [filterFase, setFilterFase] = useState("Todas");
  const [filterEst, setFilterEst] = useState("Todos");
  const [filterFormato, setFilterFormato] = useState("Todos");
  const [filterOrigen, setFilterOrigen] = useState("Todos");
  const [sortBy, setSortBy] = useState("num");
  const [search, setSearch] = useState("");
  const [vista, setVista] = useState("lista"); // lista | kanban | calendario | cards
  const [editPiece, setEditPiece] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [calMes, setCalMes] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const [form, setForm] = useState({ fase: "Atracción", avatar: "", dolor: "", titulo: "", hook: "", ctaDm: "", formato: "", fechaProg: "" });

  const filtered = piezas
    .filter(p =>
      (filterFase === "Todas" || p.fase === filterFase) &&
      (filterEst === "Todos" || p.estado === filterEst) &&
      (filterFormato === "Todos" || p.formato === filterFormato) &&
      (filterOrigen === "Todos" || p.origen === filterOrigen) &&
      (!search || p.titulo?.toLowerCase().includes(search.toLowerCase()) || p.hook?.toLowerCase().includes(search.toLowerCase()) || p.copy?.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "fecha") {
        if (!a.fechaProg && !b.fechaProg) return a.num - b.num;
        if (!a.fechaProg) return 1; if (!b.fechaProg) return -1;
        return a.fechaProg.localeCompare(b.fechaProg);
      }
      return a.num - b.num;
    });



  const byFase = FASES.map(f => ({ f, total: piezas.filter(p => p.fase === f).length, pub: piezas.filter(p => p.fase === f && p.estado === "Publicado").length }));
  const hoy = new Date();
  const enSieteDias = new Date(hoy); enSieteDias.setDate(hoy.getDate() + 7);
  const proximasAll = piezas.filter(p => { if (!p.fechaProg) return false; const d = new Date(p.fechaProg + "T12:00:00"); return d >= hoy && d <= enSieteDias; });
  const proximasPorEstado = ESTADOS_PIEZA.reduce((acc, e) => { acc[e] = proximasAll.filter(p => p.estado === e).length; return acc; }, {});
  const proximas = proximasAll.filter(p => p.estado !== "Publicado").length;

  // ── Vista: LISTA ──────────────────────────────────────────────────────────
  const vistaListaJSX = (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {filtered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: G.dimmed, fontFamily: "sans-serif", fontSize: 12 }}>Sin piezas que coincidan con los filtros.</div>}
      {filtered.map((p) => {
        const pLogCount = logs.filter(l => l.pieceId === p.id).length;
        const hasDetails = p.copy || p.guion || p.instrucciones;
        const isFromSeq = p.origen === "secuencia";
        const bc = isFromSeq ? G.cyan + "33" : G.border;
        return (
          <div key={p.id} style={{ ...css.card, padding: "12px 16px", display: "grid", gridTemplateColumns: "28px 78px 92px 1fr 150px 76px", gap: 10, alignItems: "center", cursor: "pointer", borderColor: bc, transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = G.borderHi; e.currentTarget.style.background = G.bgCardHover; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = bc; e.currentTarget.style.background = G.bgCard; }}>
            <span style={{ fontSize: 9, color: G.dimmed, fontFamily: "monospace" }}>#{p.num}</span>
            <span style={css.tag(faseColor(p.fase))}>{p.fase}</span>
            <span style={{ ...css.tag(estadoColor(p.estado)), borderRadius: 4 }}>{p.estado}</span>
            <div onClick={() => setEditPiece(p)}>
              <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 2 }}>
                <span style={{ fontSize: 12, color: G.white, fontFamily: "sans-serif", fontWeight: 600 }}>{p.titulo}</span>
                {isFromSeq && <span style={{ fontSize: 7, color: G.cyan, border: `1px solid ${G.cyan}33`, borderRadius: 3, padding: "1px 4px" }}>📅 Seq</span>}
              </div>
              <div style={{ fontSize: 10, color: G.muted, fontFamily: "sans-serif", fontStyle: "italic" }}>"{p.hook?.slice(0, 60)}{(p.hook?.length ?? 0) > 60 ? "…" : ""}"</div>
              <div style={{ display: "flex", gap: 8, marginTop: 3 }}>
                {hasDetails && <span style={{ fontSize: 7, color: G.purple }}>● contenido</span>}
                {p.fechaProg && <span style={{ fontSize: 7, color: G.blue }}>📅 {p.fechaProg}</span>}
                {p.linkEvidencia && <span style={{ fontSize: 7, color: G.green }}>🔗 evidencia</span>}
                {(p.anotaciones?.filter(a => !a.revisada).length > 0) && <span style={{ fontSize: 7, color: G.orange }}>💬 {p.anotaciones.filter(a => !a.revisada).length}</span>}
                {pLogCount > 0 && <span style={{ fontSize: 7, color: G.muted }}>🕐 {pLogCount}</span>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
              {p.formato ? <span style={{ fontSize: 9, color: G.purpleHi, border: `1px solid ${G.purpleHi}33`, borderRadius: 4, padding: "1px 5px" }}>{FORMATO_ICON[p.formato]} {p.formato}</span>
                : <span style={{ ...css.tag(G.blue), fontSize: 7 }}>{p.avatar || "—"}</span>}
            </div>
            <div style={{ display: "flex", gap: 5, justifyContent: "flex-end" }}>
              <button onClick={() => setEditPiece(p)} style={{ background: "transparent", border: `1px solid ${G.border}`, borderRadius: 5, cursor: "pointer", color: G.purpleHi, fontSize: 10, padding: "3px 8px" }}>✎</button>
              {!isViewer && <button onClick={() => onDelete(p.id)} style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 5, cursor: "pointer", color: G.red, fontSize: 10, padding: "3px 8px", fontFamily: "sans-serif" }}>✕</button>}
            </div>
          </div>
        );
      })}
    </div>
  );

  // ── Vista: CARDS ─────────────────────────────────────────────────────────
  const vistaCardsJSX = (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
      {filtered.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 40, color: G.dimmed, fontFamily: "sans-serif", fontSize: 12 }}>Sin piezas.</div>}
      {filtered.map(p => {
        const bc = p.origen === "secuencia" ? G.cyan + "33" : G.border;
        return (
          <div key={p.id} onClick={() => setEditPiece(p)} style={{ ...css.card, padding: "16px", cursor: "pointer", borderColor: bc, transition: "all 0.15s", display: "flex", flexDirection: "column", gap: 10 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = G.borderHi; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = bc; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
            {/* Top row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span style={css.tag(faseColor(p.fase))}>{p.fase}</span>
                {p.formato && <span style={{ fontSize: 9, color: G.purpleHi, border: `1px solid ${G.purpleHi}33`, borderRadius: 10, padding: "2px 7px" }}>{FORMATO_ICON[p.formato]} {p.formato}</span>}
              </div>
              <span style={{ ...css.tag(estadoColor(p.estado)), borderRadius: 4, fontSize: 8 }}>{p.estado}</span>
            </div>
            {/* Title */}
            <div>
              <div style={{ fontSize: 13, color: G.white, fontFamily: "sans-serif", fontWeight: 700, marginBottom: 5, lineHeight: 1.3 }}>{p.titulo}</div>
              <div style={{ fontSize: 10, color: G.muted, fontFamily: "sans-serif", fontStyle: "italic", lineHeight: 1.5 }}>"{p.hook?.slice(0, 80)}{(p.hook?.length ?? 0) > 80 ? "…" : ""}"</div>
            </div>
            {/* Copy preview */}
            {p.copy && <div style={{ fontSize: 10, color: G.dimmed, fontFamily: "sans-serif", lineHeight: 1.5, padding: "8px 10px", background: "rgba(255,255,255,0.04)", borderRadius: 6, borderLeft: `2px solid ${faseColor(p.fase)}44` }}>
              {p.copy.slice(0, 100)}{p.copy.length > 100 ? "…" : ""}
            </div>}
            {/* Footer */}
            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginTop: "auto" }}>
              {p.fechaProg && <span style={{ fontSize: 9, color: G.blue }}>📅 {p.fechaProg}</span>}
              {p.linkEvidencia && <span style={{ fontSize: 9, color: G.green }}>🔗</span>}
              {p.origen === "secuencia" && <span style={{ fontSize: 8, color: G.cyan, border: `1px solid ${G.cyan}33`, borderRadius: 3, padding: "1px 4px" }}>Seq</span>}
              <span style={{ marginLeft: "auto", fontSize: 9, color: G.dimmed }}>#{p.num}</span>
            </div>
          </div>
        );
      })}
    </div>
  );

  // ── Vista: KANBAN ─────────────────────────────────────────────────────────
  const vistaKanbanJSX = (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${ESTADOS_PIEZA.length}, minmax(180px, 1fr))`, gap: 12, alignItems: "start" }}>
      {ESTADOS_PIEZA.map(estado => {
        const col = filtered.filter(p => p.estado === estado);
        const ec = estadoColor(estado);
        return (
          <div key={estado} style={{ ...css.card, overflow: "hidden" }}>
            <div style={{ padding: "10px 14px", borderBottom: `1px solid ${G.border}`, background: ec + "11", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, color: ec, fontFamily: "sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{estado}</span>
              <span style={{ fontSize: 11, color: ec, fontFamily: "monospace", fontWeight: 800 }}>{col.length}</span>
            </div>
            <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: 6, maxHeight: 500, overflowY: "auto" }}>
              {col.length === 0 && <div style={{ fontSize: 10, color: G.dimmed, fontFamily: "sans-serif", textAlign: "center", padding: "16px 0" }}>—</div>}
              {col.map(p => (
                <div key={p.id} onClick={() => setEditPiece(p)} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 8, border: `1px solid ${p.origen === "secuencia" ? G.cyan + "33" : G.border}`, cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}>
                  <div style={{ display: "flex", gap: 5, marginBottom: 5, flexWrap: "wrap" }}>
                    <span style={{ ...css.tag(faseColor(p.fase)), fontSize: 7, padding: "1px 5px" }}>{p.fase}</span>
                    {p.formato && <span style={{ fontSize: 9 }}>{FORMATO_ICON[p.formato]}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: G.white, fontFamily: "sans-serif", fontWeight: 600, lineHeight: 1.3, marginBottom: 4 }}>{p.titulo}</div>
                  {p.fechaProg && <div style={{ fontSize: 9, color: G.blue }}>📅 {p.fechaProg}</div>}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  // ── Vista: CALENDARIO ─────────────────────────────────────────────────────
  const vistaCalendarioJSX = (() => {
    const { y, m } = calMes;
    const primerDia = new Date(y, m, 1).getDay(); // 0=Dom
    const diasEnMes = new Date(y, m + 1, 0).getDate();
    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    // Map filtered piezas by date (respects all active filters)
    const byDate = {};
    filtered.forEach(p => {
      if (!p.fechaProg) return;
      if (!byDate[p.fechaProg]) byDate[p.fechaProg] = [];
      byDate[p.fechaProg].push(p);
    });

    const prevMes = () => setCalMes(({ y, m }) => m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 });
    const nextMes = () => setCalMes(({ y, m }) => m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 });

    const cells = [];
    for (let i = 0; i < primerDia; i++) cells.push(null);
    for (let d = 1; d <= diasEnMes; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);

    const todayStr = new Date().toISOString().slice(0, 10);

    return (
      <div>
        {/* Cal header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <button onClick={prevMes} style={{ background: "transparent", border: `1px solid ${G.border}`, borderRadius: 8, color: G.muted, padding: "6px 14px", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13 }}>←</button>
          <GText g={G.gViolet} size={16} weight={700}>{meses[m]} {y}</GText>
          <button onClick={nextMes} style={{ background: "transparent", border: `1px solid ${G.border}`, borderRadius: 8, color: G.muted, padding: "6px 14px", cursor: "pointer", fontFamily: "sans-serif", fontSize: 13 }}>→</button>
        </div>
        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
          {dias.map(d => <div key={d} style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif", textAlign: "center", letterSpacing: 1, textTransform: "uppercase", padding: "4px 0" }}>{d}</div>)}
        </div>
        {/* Cells */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {cells.map((d, i) => {
            if (!d) return <div key={`e${i}`} />;
            const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            const dayPiezas = byDate[dateStr] || [];
            const isToday = dateStr === todayStr;
            return (
              <div key={dateStr} style={{ minHeight: 72, padding: "6px", background: isToday ? "rgba(124,58,237,0.1)" : "rgba(255,255,255,0.02)", border: `1px solid ${isToday ? G.purpleHi + "44" : G.border}`, borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: isToday ? G.purpleHi : G.muted, fontFamily: "monospace", fontWeight: isToday ? 800 : 400, marginBottom: 4 }}>{d}</div>
                {dayPiezas.slice(0, 3).map(p => (
                  <div key={p.id} onClick={() => setEditPiece(p)} style={{ fontSize: 8, color: G.white, fontFamily: "sans-serif", background: faseColor(p.fase) + "33", border: `1px solid ${faseColor(p.fase)}55`, borderRadius: 4, padding: "2px 5px", marginBottom: 3, cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = faseColor(p.fase) + "66"}
                    onMouseLeave={e => e.currentTarget.style.background = faseColor(p.fase) + "33"}
                    title={p.titulo}>
                    {FORMATO_ICON[p.formato] || "●"} {p.titulo.slice(0, 18)}{p.titulo.length > 18 ? "…" : ""}
                  </div>
                ))}
                {dayPiezas.length > 3 && <div style={{ fontSize: 8, color: G.dimmed, fontFamily: "sans-serif" }}>+{dayPiezas.length - 3} más</div>}
              </div>
            );
          })}
        </div>
        {/* Legend */}
        <div style={{ display: "flex", gap: 12, marginTop: 16, padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
          {FASES.map(f => <div key={f} style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: faseColor(f) + "66", border: `1px solid ${faseColor(f)}88` }} />
            <span style={{ fontSize: 10, color: G.muted, fontFamily: "sans-serif" }}>{f}</span>
          </div>)}
          <span style={{ fontSize: 10, color: G.dimmed, fontFamily: "sans-serif", marginLeft: "auto" }}>{Object.values(byDate).flat().length} de {piezas.filter(p => p.fechaProg).length} piezas visibles</span>
        </div>
      </div>
    );
  })();

  const VISTAS = [
    { id: "lista", icon: "≡", label: "Lista" },
    { id: "cards", icon: "⊞", label: "Cards" },
    { id: "kanban", icon: "▦", label: "Kanban" },
    { id: "calendario", icon: "📅", label: "Calendario" },
  ];

  return (
    <div style={{ padding: "24px 28px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
      {editPiece && <PieceModal piece={editPiece} isViewer={isViewer} canEdit={canEdit} canDelete={canDelete} userRole={userRole} onSave={p => { if (canEdit) { onSave(p); setEditPiece(null); } }} onClose={() => setEditPiece(null)} onDelete={canDelete ? (id => { onDelete(id); setEditPiece(null); }) : null} logs={logs} toast={toast} />}

      {/* Phase summary */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        {byFase.map(({ f, total, pub }) => (
          <div key={f} style={{ ...css.card, flex: 1, padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <span style={css.tag(faseColor(f))}>{f}</span>
              <GText g={faseGrad(f)} size={16} weight={800}>{pub}/{total}</GText>
            </div>
            <PBar val={pct(pub, total)} g={faseGrad(f)} />
          </div>
        ))}
      </div>

      {proximasAll.length > 0 && (
        <div style={{ ...css.card, padding: "10px 16px", marginBottom: 12, borderColor: G.cyan + "44", background: G.cyan + "06", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13 }}>📅</span>
          <span style={{ fontSize: 11, color: G.white, fontFamily: "sans-serif", fontWeight: 700 }}>Próximos 7 días ({proximasAll.length})</span>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {ESTADOS_PIEZA.filter(e => proximasPorEstado[e] > 0).map(e => (
              <span key={e} style={{ fontSize: 10, color: estadoColor(e), fontFamily: "sans-serif", border: `1px solid ${estadoColor(e)}44`, borderRadius: 10, padding: "2px 9px" }}>
                {proximasPorEstado[e]} {e}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Controls row */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, alignItems: "center", flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 180px", minWidth: 140 }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: G.dimmed, fontSize: 12 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar título, hook, copy..." style={{ ...css.input, paddingLeft: 30, fontSize: 11 }} />
        </div>
        <BancoSel val={filterFase} set={setFilterFase} opts={[{ v: "Todas", l: "Fase: Todas" }, ...FASES.map(f => ({ v: f, l: f }))]} />
        <BancoSel val={filterEst} set={setFilterEst} opts={[{ v: "Todos", l: "Estado: Todos" }, ...ESTADOS_PIEZA.map(e => ({ v: e, l: e }))]} />
        <BancoSel val={filterFormato} set={setFilterFormato} opts={[{ v: "Todos", l: "Formato: Todos" }, ...FORMATOS.map(f => ({ v: f, l: f }))]} />
        <BancoSel val={filterOrigen} set={setFilterOrigen} opts={[{ v: "Todos", l: "Origen: Todos" }, { v: "manual", l: "Manual" }, { v: "secuencia", l: "Secuencia" }]} />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${G.border}`, borderRadius: 8, color: G.purpleHi, fontSize: 11, padding: "6px 10px", fontFamily: "sans-serif", cursor: "pointer" }}>
          <option value="num">Orden: #</option>
          <option value="fecha">Orden: Fecha</option>
        </select>
        {/* Vista switcher */}
        <div style={{ display: "flex", gap: 2, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: 3, border: `1px solid ${G.border}` }}>
          {VISTAS.map(v => (
            <button key={v.id} onClick={() => setVista(v.id)} title={v.label}
              style={{ background: vista === v.id ? G.purpleDim : "transparent", border: `1px solid ${vista === v.id ? G.borderHi : "transparent"}`, borderRadius: 6, color: vista === v.id ? G.purpleHi : G.muted, fontSize: 13, padding: "4px 9px", cursor: "pointer", transition: "all 0.15s" }}>
              {v.icon}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 10, color: G.dimmed, fontFamily: "sans-serif" }}>{filtered.length} piezas</span>
        {!isViewer && <button onClick={() => setShowForm(v => !v)} style={{ ...css.btn(showForm ? undefined : G.gMagenta), fontSize: 11 }}>{showForm ? "Cancelar" : "+ Nueva pieza"}</button>}
      </div>

      {/* New piece form */}
      {showForm && (
        <div style={{ ...css.cardGlow, padding: 16, marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
            {[{ k: "titulo", l: "Título" }, { k: "hook", l: "Hook" }, { k: "avatar", l: "Avatar" }, { k: "ctaDm", l: "CTA DM" }].map(({ k, l }) => (
              <div key={k}><label style={css.label}>{l}</label><input value={form[k] || ""} onChange={e => setForm({ ...form, [k]: e.target.value })} placeholder={l + "..."} style={css.input} /></div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 10, alignItems: "end" }}>
            <div><label style={css.label}>Fase</label>
              <select value={form.fase} onChange={e => setForm({ ...form, fase: e.target.value })} style={{ ...css.input, color: faseColor(form.fase) }}>
                {FASES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div><label style={css.label}>Formato</label>
              <select value={form.formato || ""} onChange={e => setForm({ ...form, formato: e.target.value })} style={{ ...css.input, color: G.purpleHi }}>
                <option value="">Sin definir</option>
                {FORMATOS.map(f => <option key={f} value={f}>{FORMATO_ICON[f]} {f}</option>)}
              </select>
            </div>
            <div><label style={css.label}>Fecha programada</label>
              <input type="date" value={form.fechaProg || ""} onChange={e => setForm({ ...form, fechaProg: e.target.value })} style={{ ...css.input, colorScheme: "dark" }} />
            </div>
            <button onClick={() => { if (form.titulo.trim()) { onAdd({ ...form, id: uid(), num: piezas.length + 1, estado: "En cola", copy: "", guion: "", instrucciones: "", notasInternas: "", linkRecursos: "", linkFinal: "", linkEvidencia: "", origen: "manual", origenRef: null, anotaciones: [] }); setShowForm(false); setForm({ fase: "Atracción", avatar: "", dolor: "", titulo: "", hook: "", ctaDm: "", formato: "", fechaProg: "" }); } }} style={{ ...css.btn(G.gGreen) }}>+ Agregar</button>
          </div>
        </div>
      )}

      {/* Views */}
      {vista === "lista" && vistaListaJSX}
      {vista === "cards" && vistaCardsJSX}
      {vista === "kanban" && vistaKanbanJSX}
      {vista === "calendario" && vistaCalendarioJSX}
    </div>
  );
}

// ── INSTALACION TAB ───────────────────────────────────────────────────────────
function InstalacionTab({ data, vars, onToggle, onVarChange }) {
  const allIds = INSTALACION_SECTIONS.flatMap(s => s.items.map(i => i.id));
  const done = allIds.filter(id => data.checked?.[id]).length;
  return (
    <div style={{ padding: "24px 28px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
      <div style={{ marginBottom: 24 }}>
        <GText g={G.gViolet} size={10} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Fase de Instalación</GText>
        <div style={{ fontSize: 20, color: G.white, fontFamily: "Georgia,serif", marginBottom: 16 }}>Optimización de Perfil</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <PBar val={pct(done, allIds.length)} g={G.gViolet} h={6} />
          <GText g={G.gViolet} size={13}>{pct(done, allIds.length)}%</GText>
        </div>
      </div>
      <div style={{ ...css.cardGlow, padding: 20, marginBottom: 24 }}>
        <GText g={G.gMagenta} size={9} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 14 }}>◈ Variables del Broker</GText>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[{ k: "nombre", l: "Nombre / Marca" }, { k: "zona", l: "Zona / Colonia" }, { k: "nicho", l: "Nicho (primerizo / patrimonial / lifestyle)" }, { k: "cta", l: "CTA principal (ej: INVERTIR)" }].map(({ k, l }) => (
            <div key={k}>
              <label style={css.label}>{l}</label>
              <input value={vars?.[k] || ""} onChange={e => onVarChange(k, e.target.value)} placeholder="Escribe aquí..." style={css.input} />
            </div>
          ))}
        </div>
      </div>
      {INSTALACION_SECTIONS.map(sec => {
        const secDone = sec.items.filter(i => data.checked?.[i.id]).length;
        return (
          <div key={sec.id} style={{ ...css.card, marginBottom: 14, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: `1px solid ${G.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14, color: G.purpleHi }}>{sec.icon}</span>
                <span style={{ fontSize: 12, color: G.white, fontFamily: "sans-serif", fontWeight: 600 }}>{sec.label}</span>
              </div>
              <span style={{ fontSize: 10, color: secDone === sec.items.length ? G.green : G.purpleHi, fontFamily: "monospace" }}>
                {secDone}/{sec.items.length}{secDone === sec.items.length ? " ✓" : ""}
              </span>
            </div>
            {sec.items.map(item => {
              const isDone = !!data.checked?.[item.id];
              return (
                <button key={item.id} onClick={() => onToggle(item.id)} style={{ width: "100%", background: isDone ? "rgba(16,185,129,0.04)" : "transparent", border: "none", borderBottom: `1px solid ${G.border}`, cursor: "pointer", padding: "11px 18px", display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                  <div style={{ width: 16, height: 16, borderRadius: 5, flexShrink: 0, border: `1px solid ${isDone ? G.green : G.border}`, background: isDone ? "rgba(16,185,129,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {isDone && <span style={{ fontSize: 9, color: G.green, fontWeight: 700 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 12, fontFamily: "sans-serif", color: isDone ? G.muted : G.white, textDecoration: isDone ? "line-through" : "none", lineHeight: 1.4 }}>{item.text}</span>
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ── ONBOARDING TAB ────────────────────────────────────────────────────────────
function OnboardingTab({ checked, onToggle, mesLabel, toast }) {
  const allIds = ONBOARDING_STEPS.flatMap(s => s.items.map(i => i.id));
  const done = allIds.filter(id => checked?.[id]).length;
  return (
    <div style={{ padding: "24px 28px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
      <div style={{ marginBottom: 24 }}>
        <GText g={G.gGreen} size={10} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Onboarding · {mesLabel}</GText>
        <div style={{ fontSize: 20, color: G.white, fontFamily: "Georgia,serif", marginBottom: 16 }}>Los primeros 15 días</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <PBar val={pct(done, allIds.length)} g={G.gGreen} h={6} />
          <GText g={G.gGreen} size={13}>{pct(done, allIds.length)}%</GText>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {ONBOARDING_STEPS.map((step) => {
          const sDone = step.items.filter(i => checked?.[i.id]).length;
          const isComplete = sDone === step.items.length;
          return (
            <div key={step.id} style={{ ...css.card, overflow: "hidden", borderColor: isComplete ? "rgba(16,185,129,0.3)" : G.border }}>
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${G.border}`, background: isComplete ? "rgba(16,185,129,0.06)" : "transparent" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <GText g={isComplete ? G.gGreen : G.gViolet} size={10} weight={600} style={{ letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 4 }}>{step.dias}</GText>
                    <div style={{ fontSize: 13, color: G.white, fontFamily: "sans-serif", fontWeight: 600 }}>{step.titulo}</div>
                  </div>
                  <span style={{ fontSize: 11, color: isComplete ? G.green : G.muted, fontFamily: "monospace" }}>{sDone}/{step.items.length}</span>
                </div>
                <div style={{ marginTop: 10 }}><PBar val={pct(sDone, step.items.length)} g={isComplete ? G.gGreen : G.gViolet} /></div>
              </div>
              {step.items.map(item => {
                const isDone = !!checked?.[item.id];
                return (
                  <button key={item.id} onClick={() => { onToggle(item.id); if (!isDone && toast) toast(`✓ ${item.text.slice(0, 40)}`); }} style={{ width: "100%", background: isDone ? "rgba(16,185,129,0.04)" : "transparent", border: "none", borderBottom: `1px solid ${G.border}`, cursor: "pointer", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, textAlign: "left" }}>
                    <div style={{ width: 15, height: 15, borderRadius: 4, flexShrink: 0, border: `1px solid ${isDone ? G.green : G.border}`, background: isDone ? "rgba(16,185,129,0.2)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {isDone && <span style={{ fontSize: 8, color: G.green, fontWeight: 700 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 11, fontFamily: "sans-serif", color: isDone ? G.muted : G.white, textDecoration: isDone ? "line-through" : "none", lineHeight: 1.4 }}>{item.text}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── OFERTA TAB ────────────────────────────────────────────────────────────────
function OfertaTab() {
  const Block = ({ title, g, children }) => (
    <div style={{ ...css.card, padding: "20px 24px", marginBottom: 16 }}>
      <GText g={g} size={9} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 12 }}>{title}</GText>
      {children}
    </div>
  );
  const Li = ({ children, color = G.green }) => <div style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
    <span style={{ color, marginTop: 2, flexShrink: 0 }}>▸</span>
    <span style={{ fontSize: 12, color: G.muted, fontFamily: "sans-serif", lineHeight: 1.5 }}>{children}</span>
  </div>;
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
        {[["Ya pagué por marketing antes y no funcionó", "Probablemente te entregaron posts bonitos y midieron likes. Nosotros medimos prospectos en tu DM."], ["¿10–20 prospectos es realista?", "Sí, con orgánico + pauta estratégica. Si no llegas a 10 en el primer mes, el segundo mes es gratis."], ["No tengo tiempo para grabar contenido", "Incluimos Guía de Grabación Simple. Son 2–3 horas al mes de tu tiempo. Nosotros hacemos todo lo demás."], ["¿Por qué $10,000 MXN si hay opciones más baratas?", "Una comisión de $3M MXN genera $90–150K. Esto cuesta <7% de una comisión."], ["No sé si las redes funcionan para vender inmuebles", "Funcionan cuando se hacen bien. El Embudo Invertido™ atrae primero, vende después."], ["¿Qué pasa si los prospectos no son de calidad?", "Optimizamos cada mes. El reporte muestra qué contenido trajo mejores prospectos."], ["¿Cuánto tengo que invertir en pauta?", "$2,000–5,000 MXN/mes para llegar a compradores reales de tu zona."], ["¿Y si mi competencia ya está haciendo esto?", "Si ellos publican 'casa en venta' genérico y tú usas el Embudo Invertido™, tú te ves experto."], ["No me gusta aparecer en cámara", "No tienes que aparecer en todo. Te damos una guía para que sea fácil y natural."], ["¿Hay contrato de permanencia?", "No. Mes a mes. Te quedas porque funciona, no por estar atrapado."]].map(([obj, resp], i) => <ObjRow key={i} n={i + 1} obj={obj} resp={resp} />)}
      </Block>
    </div>
  );
}

// ── ANALYTICS TAB ─────────────────────────────────────────────────────────────
function AnalyticsTab({ piezas, instalChecked, onbChecked, broker, seqData }) {
  const instIds = INSTALACION_SECTIONS.flatMap(s => s.items.map(i => i.id));
  const onbIds = ONBOARDING_STEPS.flatMap(s => s.items.map(i => i.id));
  const instPct = pct(instIds.filter(id => instalChecked?.[id]).length, instIds.length);
  const onbPct = pct(onbIds.filter(id => onbChecked?.[id]).length, onbIds.length);
  const pubPct = pct(piezas.filter(p => p.estado === "Publicado").length, piezas.length);

  const ciclos = seqData?.ciclos || [];
  const valorCiclos = ciclos.filter(c => c.tipo === "valor");
  const ventaCiclos = ciclos.filter(c => c.tipo === "venta");
  const hoyAn = new Date();
  const en7 = new Date(hoyAn); en7.setDate(hoyAn.getDate() + 7);
  const proximasPiezas = piezas.filter(p => { if (!p.fechaProg) return false; const d = new Date(p.fechaProg + "T12:00:00"); return d >= hoyAn && d <= en7 && p.estado !== "Publicado"; }).length;
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

// ── HISTORIAL TAB ─────────────────────────────────────────────────────────────
function HistorialTab({ logs }) {
  const [fu, setFu] = useState("Todos");
  const [ft, setFt] = useState("Todos");
  const types = [...new Set(logs.map(l => l.type))];
  const filtered = logs.filter(l => (fu === "Todos" || l.user === fu) && (ft === "Todos" || l.type === ft)).sort((a, b) => b.ts.localeCompare(a.ts));
  const Sel = ({ val, set, opts }) => <select value={val} onChange={e => set(e.target.value)} style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${G.border}`, borderRadius: 8, color: G.purpleHi, fontSize: 11, padding: "6px 12px", fontFamily: "sans-serif" }}>{opts.map(o => <option key={o} value={o}>{o}</option>)}</select>;
  const typeG = t => ({ banco: G.gViolet, instalacion: G.gMagenta, onboarding: G.gGreen, secuencias: G.gCyan, crear: G.gGreen, eliminar: G.gOrange }[t] || G.gPurple);
  return (
    <div style={{ padding: "24px 28px", overflowY: "auto", height: "100%", boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <GText g={G.gViolet} size={10} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Auditoría</GText>
          <div style={{ fontSize: 20, color: G.white, fontFamily: "Georgia,serif" }}>Historial de cambios</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Sel val={fu} set={setFu} opts={["Todos", ...USERS.map(u => u.name)]} />
          <Sel val={ft} set={setFt} opts={["Todos", ...types]} />
          <span style={{ fontSize: 10, color: G.dimmed, fontFamily: "sans-serif", alignSelf: "center" }}>{filtered.length} registros</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {USERS.map(u => {
          const ul = logs.filter(l => l.user === u.name); return (
            <div key={u.id} style={{ ...css.card, padding: "14px 18px", minWidth: 130 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 20, background: G.gPurple, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 11, color: G.white, fontWeight: 700 }}>{u.name[0]}</span>
                </div>
                <span style={{ fontSize: 12, color: G.white, fontFamily: "sans-serif", fontWeight: 600 }}>{u.name}</span>
              </div>
              <GText g={G.gViolet} size={20} weight={800}>{ul.length}</GText>
              <div style={{ fontSize: 9, color: G.dimmed, fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: 1 }}>cambios</div>
            </div>
          );
        })}
      </div>
      {filtered.length === 0
        ? <div style={{ textAlign: "center", padding: "60px", color: G.dimmed, fontFamily: "sans-serif", fontSize: 13 }}>{logs.length === 0 ? "Aún no hay cambios registrados." : "Sin resultados."}</div>
        : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(l => (
            <div key={l.id} style={{ ...css.card, padding: "14px 18px", display: "flex", gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 20, background: G.gPurple, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: G.white, fontWeight: 700 }}>{l.user[0]}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: G.white, fontFamily: "sans-serif", fontWeight: 700 }}>{l.user}</span>
                  <span style={{ fontSize: 8, color: G.dimmed, fontFamily: "sans-serif", border: `1px solid ${G.border}`, borderRadius: 3, padding: "1px 6px" }}>{l.role}</span>
                  <GText g={typeG(l.type)} size={8} style={{ border: `1px solid rgba(255,255,255,0.1)`, borderRadius: 3, padding: "1px 6px", textTransform: "uppercase", letterSpacing: 1 }}>{l.type}</GText>
                  {l.mes && <span style={{ fontSize: 9, color: G.purple, fontFamily: "sans-serif" }}>· {l.mes}</span>}
                  <span style={{ fontSize: 9, color: G.muted, fontFamily: "monospace", marginLeft: "auto" }}>{fmtDate(l.ts)}</span>
                </div>
                <div style={{ fontSize: 12, color: G.muted, fontFamily: "sans-serif", lineHeight: 1.5 }}>{l.desc}</div>
                {l.pieceTitulo && <div style={{ fontSize: 10, color: G.dimmed, fontFamily: "sans-serif", marginTop: 3 }}>📄 {l.pieceTitulo}</div>}
              </div>
            </div>
          ))}
        </div>}
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
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
    try { await window.storage.delete(`eiiBD_${id}`); } catch { }
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
    const item = INSTALACION_SECTIONS.flatMap(s => s.items).find(i => i.id === id);
    await persist({ ...bd, instalChecked: { ...bd.instalChecked, [id]: newVal } });
    await addLog(mkLog(user, broker?.name, "—", "instalacion", `${newVal ? "Marcó" : "Desmarcó"} "${item?.text}"`));
    if (newVal) toast(`✓ ${item?.text?.slice(0, 40)}…`);
  };

  const toggleOnb = async (id) => {
    const newVal = !mes.onbChecked?.[id];
    const item = ONBOARDING_STEPS.flatMap(s => s.items).find(i => i.id === id);
    const updMes = { ...mes, onbChecked: { ...mes.onbChecked, [id]: newVal } };
    await updateMes(updMes, mkLog(user, broker?.name, mesLabel, "onboarding", `${newVal ? "Completó" : "Desmarcó"} "${item?.text}"`));
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
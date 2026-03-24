export const G = {
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

export const css = {
    card: { background: G.bgCard, border: `1px solid ${G.border}`, borderRadius: 16, backdropFilter: "blur(12px)" },
    cardGlow: { background: G.bgCard, border: `1px solid ${G.borderHi}`, borderRadius: 16, backdropFilter: "blur(12px)", boxShadow: "0 0 30px rgba(124,58,237,0.15)" },
    input: { background: "rgba(255,255,255,0.06)", border: `1px solid ${G.border}`, borderRadius: 8, color: G.white, fontSize: 13, padding: "9px 13px", fontFamily: "sans-serif", width: "100%", boxSizing: "border-box", outline: "none" },
    label: { fontSize: 9, letterSpacing: 2, color: G.muted, fontFamily: "sans-serif", textTransform: "uppercase", marginBottom: 6, display: "block" },
    btn: (g = G.gPurple) => ({ background: g, border: "none", borderRadius: 8, color: G.white, padding: "9px 20px", cursor: "pointer", fontSize: 12, fontFamily: "sans-serif", fontWeight: 700, letterSpacing: 0.5 }),
    tag: (c) => ({ fontSize: 9, letterSpacing: 1.5, color: c, border: `1px solid ${c}`, borderRadius: 20, padding: "2px 9px", fontFamily: "sans-serif", textTransform: "uppercase", whiteSpace: "nowrap", display: "inline-block" }),
};

export const TOAST_COLORS = {
    success: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.4)", color: "#10B981", icon: "✓" },
    error: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.4)", color: "#EF4444", icon: "✕" },
    info: { bg: "rgba(6,182,212,0.12)", border: "rgba(6,182,212,0.4)", color: "#06B6D4", icon: "ℹ" },
    warn: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.4)", color: "#F59E0B", icon: "⚠" },
};

export const USERS = [
    { id: "u1", name: "Kike", role: "Admin", password: "admin123" },
    { id: "u2", name: "Equipo", role: "Editor", password: "equipo123" },
    { id: "u3", name: "Cliente", role: "Viewer", password: "cliente123" },
];
export const FASES = ["Atraer", "Retener", "Convertir"];
export const ESTADOS_PIEZA = ["En cola", "Producción", "Aprobado", "Programado", "Publicado"];

export const estadoColor = e => ({ "En cola": G.muted, "Producción": G.orange, "Aprobado": G.blue, "Programado": G.cyan, "Publicado": G.green }[e] || G.muted);
export const faseColor = f => ({ "Atraer": G.magenta, "Retener": G.purple, "Convertir": G.green, "Atracción": G.magenta, "Valor": G.purple, "Conversión": G.green }[f] || G.muted);
export const faseGrad = f => ({ "Atraer": G.gMagenta, "Retener": G.gViolet, "Convertir": G.gGreen, "Atracción": G.gMagenta, "Valor": G.gViolet, "Conversión": G.gGreen }[f] || G.gPurple);

export const uid = () => Math.random().toString(36).slice(2, 9);
export const pct = (d, t) => t ? Math.round(d / t * 100) : 0;
export const fmtDate = iso => { const d = new Date(iso); return `${d.toLocaleDateString("es-MX")} ${d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`; };

export const FORMATOS = ["Reel", "Carrusel", "Foto estática", "Historia", "Video largo (YouTube/IGTV)"];
export const FORMATO_ICON = { "Reel": "🎬", "Carrusel": "🖼️", "Foto estática": "📷", "Historia": "⭕", "Video largo (YouTube/IGTV)": "▶️" };

export const stor = async (op, key, val) => {
    if (typeof window === "undefined") return null;
    if (op === "get") {
        const d = localStorage.getItem(key);
        try { return d ? JSON.parse(d) : null; } catch (e) { return null; }
    }
    if (op === "set") localStorage.setItem(key, JSON.stringify(val));
};

export const mkLog = (u, b, m, t, d) => ({ id: uid(), ts: new Date().toISOString(), uName: u?.name || "Sistema", brokerName: b || "-", mesLabel: m || "-", tipo: t, desc: d });

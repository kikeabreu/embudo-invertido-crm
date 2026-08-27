export const G = {
    bg: "#F6F7F9",
    bgCard: "#FFFFFF",
    bgCardHover: "#F9FAFB",
    bgGlass: "#F3F4F6",
    border: "#E5E7EB",
    borderHi: "#B8C0CC",
    gPurple: "linear-gradient(135deg,#6D28D9,#7C3AED)",
    gViolet: "linear-gradient(135deg,#5B21B6,#7C3AED)",
    gMagenta: "linear-gradient(135deg,#9D174D,#BE185D)",
    gGreen: "linear-gradient(135deg,#047857,#059669)",
    gOrange: "linear-gradient(135deg,#B45309,#D97706)",
    gBlue: "linear-gradient(135deg,#1E40AF,#2563EB)",
    gCyan: "linear-gradient(135deg,#0E7490,#0891B2)",
    purple: "#7C3AED", purpleHi: "#111827", purpleDim: "#F3E8FF",
    magenta: "#BE185D", green: "#047857", orange: "#B45309", blue: "#1E40AF", red: "#DC2626", cyan: "#0E7490",
    white: "#111827", muted: "#4B5563", dimmed: "#6B7280",
};

export const css = {
    card: { background: G.bgCard, border: `1px solid ${G.border}`, borderRadius: 12, boxShadow: "0 1px 2px rgba(15,23,42,0.04)" },
    cardGlow: { background: G.bgCard, border: `1px solid ${G.border}`, borderRadius: 12, boxShadow: "0 16px 40px rgba(15,23,42,0.08)" },
    input: { background: "#FFFFFF", border: `1px solid ${G.border}`, borderRadius: 8, color: G.white, fontSize: 13, padding: "9px 13px", fontFamily: "sans-serif", width: "100%", boxSizing: "border-box", outline: "none" },
    label: { fontSize: 9, letterSpacing: 2, color: G.muted, fontFamily: "sans-serif", textTransform: "uppercase", marginBottom: 6, display: "block" },
    btn: (g = G.gPurple) => ({ background: g, border: "none", borderRadius: 8, color: "#FFFFFF", padding: "9px 20px", cursor: "pointer", fontSize: 12, fontFamily: "sans-serif", fontWeight: 700, letterSpacing: 0.5 }),
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

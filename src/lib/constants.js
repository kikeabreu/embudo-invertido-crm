export const G = {
    bg: "#F6F7F9",
    bgCard: "#FFFFFF",
    bgCardHover: "#F9FAFB",
    bgGlass: "#F3F4F6",
    border: "#E5E7EB",
    borderHi: "#B8C0CC",
    gPurple: "linear-gradient(135deg,#E5E7EB,#CBD5E1)",
    gViolet: "linear-gradient(135deg,#DDE3EA,#F3F4F6)",
    gMagenta: "linear-gradient(135deg,#111827,#6B7280)",
    gGreen: "linear-gradient(135deg,#CCFBF1,#99F6E4)",
    gOrange: "linear-gradient(135deg,#FEF3C7,#FED7AA)",
    gBlue: "linear-gradient(135deg,#DBEAFE,#E2E8F0)",
    gCyan: "linear-gradient(135deg,#CFFAFE,#DBEAFE)",
    purple: "#374151", purpleHi: "#111827", purpleDim: "#EEF2F7",
    magenta: "#6B7280", green: "#0F766E", orange: "#B45309", blue: "#2563EB", red: "#DC2626", cyan: "#0E7490",
    white: "#111827", muted: "#6B7280", dimmed: "#9CA3AF",
};

export const css = {
    card: { background: G.bgCard, border: `1px solid ${G.border}`, borderRadius: 12, boxShadow: "0 1px 2px rgba(15,23,42,0.04)" },
    cardGlow: { background: G.bgCard, border: `1px solid ${G.border}`, borderRadius: 12, boxShadow: "0 16px 40px rgba(15,23,42,0.08)" },
    input: { background: "#FFFFFF", border: `1px solid ${G.border}`, borderRadius: 8, color: G.white, fontSize: 13, padding: "9px 13px", fontFamily: "sans-serif", width: "100%", boxSizing: "border-box", outline: "none" },
    label: { fontSize: 9, letterSpacing: 2, color: G.muted, fontFamily: "sans-serif", textTransform: "uppercase", marginBottom: 6, display: "block" },
    btn: (g = G.gPurple) => ({ background: g, border: `1px solid ${G.border}`, borderRadius: 8, color: G.white, padding: "9px 20px", cursor: "pointer", fontSize: 12, fontFamily: "sans-serif", fontWeight: 700, letterSpacing: 0.5 }),
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

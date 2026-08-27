export const G = {
    bg: "#F7F9F9",
    bgCard: "#FFFFFF",
    bgCardHover: "#F1EFFC",
    bgGlass: "#F7F9F9",
    border: "#DFE3E3",
    borderHi: "#7060D8",
    morado: "#7060D8",
    naranja: "#F08048",
    gPurple: "linear-gradient(135deg,#7060D8,#5A48C4)",
    gViolet: "linear-gradient(135deg,#7060D8,#4738A0)",
    gMagenta: "linear-gradient(135deg,#7060D8,#F08048)",
    gGreen: "linear-gradient(135deg,#1F9D6B,#10B981)",
    gOrange: "linear-gradient(135deg,#F08048,#E96A2C)",
    gBlue: "linear-gradient(135deg,#7060D8,#38BDF8)",
    gCyan: "linear-gradient(135deg,#0E7490,#0891B2)",
    purple: "#7060D8", purpleHi: "#081010", purpleDim: "#E2DEF8",
    magenta: "#F08048", green: "#1F9D6B", orange: "#F08048", blue: "#7060D8", red: "#E0473C", cyan: "#0891B2",
    white: "#081010", muted: "#6B7374", dimmed: "#939B9C",
};

export const css = {
    card: { background: G.bgCard, border: `1px solid ${G.border}`, borderRadius: 14, boxShadow: "0 2px 6px rgba(8,16,16,0.07)" },
    cardGlow: { background: G.bgCard, border: `1px solid ${G.morado}`, borderRadius: 14, boxShadow: "0 10px 28px rgba(112,96,216,0.2)" },
    input: { background: "#FFFFFF", border: `1px solid ${G.border}`, borderRadius: 10, color: G.white, fontSize: 13, padding: "9px 13px", fontFamily: "Gilroy, sans-serif", width: "100%", boxSizing: "border-box", outline: "none" },
    label: { fontSize: 11, letterSpacing: "0.14em", color: G.naranja, fontFamily: "Gilroy, sans-serif", textTransform: "uppercase", fontWeight: 800, marginBottom: 6, display: "block" },
    btn: (g = G.gPurple) => ({ background: g, border: "none", borderRadius: 10, color: "#FFFFFF", padding: "10px 20px", cursor: "pointer", fontSize: 12, fontFamily: "Gilroy, sans-serif", fontWeight: 800, letterSpacing: 0.5, boxShadow: "0 4px 12px rgba(112,96,216,0.28)" }),
    tag: (c) => ({ fontSize: 10, letterSpacing: 1.5, color: c, border: `1px solid ${c}`, borderRadius: 20, padding: "2px 9px", fontFamily: "Gilroy, sans-serif", textTransform: "uppercase", fontWeight: 700, whiteSpace: "nowrap", display: "inline-block" }),
};

export const TOAST_COLORS = {
    success: { bg: "#E5F4ED", border: "#1F9D6B", color: "#1F9D6B", icon: "✓" },
    error: { bg: "#FBE6E4", border: "#E0473C", color: "#E0473C", icon: "✕" },
    info: { bg: "#E2DEF8", border: "#7060D8", color: "#7060D8", icon: "ℹ" },
    warn: { bg: "#FBF0DC", border: "#E9A23B", color: "#E9A23B", icon: "⚠" },
};

export const USERS = [
    { id: "u1", name: "Kike", role: "Admin", password: "admin123" },
    { id: "u2", name: "Equipo", role: "Editor", password: "equipo123" },
    { id: "u3", name: "Cliente", role: "Viewer", password: "cliente123" },
];
export const FASES = ["Atraer", "Retener", "Convertir"];
export const ESTADOS_PIEZA = ["En cola", "Producción", "Aprobado", "Programado", "Publicado"];

export const estadoColor = e => ({ "En cola": G.muted, "Producción": G.orange, "Aprobado": G.blue, "Programado": G.cyan, "Publicado": G.green }[e] || G.muted);
export const faseColor = f => ({ "Atraer": G.purple, "Retener": G.naranja, "Convertir": G.green, "Atracción": G.purple, "Valor": G.naranja, "Conversión": G.green }[f] || G.muted);
export const faseGrad = f => ({ "Atraer": G.gPurple, "Retener": G.gOrange, "Convertir": G.gGreen, "Atracción": G.gPurple, "Valor": G.gOrange, "Conversión": G.gGreen }[f] || G.gPurple);

export const uid = () => Math.random().toString(36).slice(2, 9);
export const pct = (d, t) => t ? Math.round(d / t * 100) : 0;
export const fmtDate = iso => { const d = new Date(iso); return `${d.toLocaleDateString("es-MX")} ${d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`; };

export const FORMATOS = ["Reel", "Carrusel", "Foto estática", "Historia", "Video largo (YouTube/IGTV)"];
export const FORMATO_ICON = { "Reel": "REEL", "Carrusel": "CARRUSEL", "Foto estática": "FOTO", "Historia": "STORY", "Video largo (YouTube/IGTV)": "VIDEO" };

export const stor = async (op, key, val) => {
    if (typeof window === "undefined") return null;
    if (op === "get") {
        const d = localStorage.getItem(key);
        try { return d ? JSON.parse(d) : null; } catch (e) { return null; }
    }
    if (op === "set") localStorage.setItem(key, JSON.stringify(val));
};

export const mkLog = (u, b, m, t, d) => ({ id: uid(), ts: new Date().toISOString(), uName: u?.name || "Sistema", brokerName: b || "-", mesLabel: m || "-", tipo: t, desc: d });

"use client";

import { G, css } from "@/lib/constants";

export function GText({ children, g = G.gViolet, size = 14, weight = 700, style = {} }) {
    return (
        <span style={{ background: g, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: size, fontWeight: weight, fontFamily: "sans-serif", ...style }}>
            {children}
        </span>
    );
}

export function PBar({ val, g = G.gPurple, h = 5 }) {
    return (
        <div style={{ height: h, background: "rgba(255,255,255,0.08)", borderRadius: h, overflow: "hidden" }}>
            <div style={{ width: `${val}%`, height: "100%", background: g, borderRadius: h, transition: "width 0.5s ease" }} />
        </div>
    );
}

export function StatCard({ label, value, g, sub }) {
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

"use client";

import { useState } from "react";
import { TOAST_COLORS } from "@/lib/constants";

export function useToast() {
    const [toasts, setToasts] = useState([]);

    const show = (msg, type = "success", duration = 3000) => {
        const id = Math.random().toString(36).slice(2);
        setToasts(t => [...t, { id, msg, type }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration);
    };

    return { toasts, show };
}

export function Toasts({ toasts }) {
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

"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { G } from "@/lib/constants";

export default function NotificationBell({ currentUserId }) {
    const [notifs, setNotifs] = useState([]);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const unread = notifs.filter(n => !n.leida).length;

    const fetchNotifs = async () => {
        if (!currentUserId) return;
        const { data } = await supabase
            .from("notificaciones")
            .select("*")
            .eq("usuario_id", currentUserId)
            .order("created_at", { ascending: false })
            .limit(30);
        if (data) setNotifs(data);
    };

    useEffect(() => {
        fetchNotifs();
        // Real-time subscription
        const channel = supabase
            .channel("notifs-" + currentUserId)
            .on("postgres_changes", {
                event: "INSERT",
                schema: "public",
                table: "notificaciones",
                filter: `usuario_id=eq.${currentUserId}`,
            }, payload => {
                setNotifs(prev => [payload.new, ...prev]);
            })
            .subscribe();
        return () => supabase.removeChannel(channel);
    }, [currentUserId]);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const markAllRead = async () => {
        const ids = notifs.filter(n => !n.leida).map(n => n.id);
        if (!ids.length) return;
        await supabase.from("notificaciones").update({ leida: true }).in("id", ids);
        setNotifs(prev => prev.map(n => ({ ...n, leida: true })));
    };

    const markRead = async (n) => {
        if (!n.leida) {
            await supabase.from("notificaciones").update({ leida: true }).eq("id", n.id);
            setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, leida: true } : x));
        }
    };

    const handleClick = (n) => {
        markRead(n);
        if (n.link && n.link.startsWith("tab:")) {
            const raw = n.link.split(":")[1];
            const [tab, query] = raw.split("?");
            window.dispatchEvent(new CustomEvent("navigate-tab", { detail: { tab, query } }));
        }
        setOpen(false);
    };

    const ICONS = { mencion: "🏷️", asignacion: "📌", vencimiento: "⏰", workflow: "🔗" };

    const fmtDate = (ts) => {
        if (!ts) return "";
        const d = new Date(ts);
        const now = new Date();
        const diff = (now - d) / 1000;
        if (diff < 60) return "ahora";
        if (diff < 3600) return `${Math.floor(diff / 60)}m`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
        return d.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
    };

    return (
        <div ref={ref} style={{ position: "relative" }}>
            <button
                onClick={() => { setOpen(o => !o); if (!open) fetchNotifs(); }}
                style={{
                    background: "transparent",
                    border: `1px solid ${unread > 0 ? "rgba(245,158,11,0.5)" : G.border}`,
                    borderRadius: 8,
                    padding: "5px 10px",
                    cursor: "pointer",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 16,
                    transition: "all 0.2s",
                }}
            >
                🔔
                {unread > 0 && (
                    <span style={{
                        position: "absolute",
                        top: -4,
                        right: -4,
                        background: "rgba(245,158,11,1)",
                        color: "#000",
                        borderRadius: "50%",
                        width: 16,
                        height: 16,
                        fontSize: 9,
                        fontFamily: "sans-serif",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        {unread > 9 ? "9+" : unread}
                    </span>
                )}
            </button>

            {open && (
                <div style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    width: 340,
                    background: "#0B0B19",
                    border: `1px solid ${G.border}`,
                    borderRadius: 12,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
                    zIndex: 999999,
                    overflow: "hidden",
                }}>
                    {/* Header */}
                    <div style={{ padding: "14px 16px 10px", borderBottom: `1px solid ${G.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: G.white, fontFamily: "sans-serif", letterSpacing: 1 }}>
                            NOTIFICACIONES
                        </span>
                        {unread > 0 && (
                            <button onClick={markAllRead} style={{ background: "transparent", border: "none", color: "rgba(245,158,11,0.8)", fontSize: 10, cursor: "pointer", fontFamily: "sans-serif" }}>
                                Marcar todas leídas
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div style={{ maxHeight: 380, overflowY: "auto" }}>
                        {notifs.length === 0 ? (
                            <div style={{ padding: 24, textAlign: "center", color: G.dimmed, fontSize: 11, fontFamily: "sans-serif" }}>
                                Sin notificaciones 🎉
                            </div>
                        ) : notifs.map(n => (
                            <div
                                key={n.id}
                                onClick={() => handleClick(n)}
                                style={{
                                    padding: "12px 16px",
                                    borderBottom: `1px solid ${G.border}`,
                                    display: "flex",
                                    gap: 10,
                                    alignItems: "flex-start",
                                    cursor: "pointer",
                                    background: n.leida ? "transparent" : "rgba(245,158,11,0.04)",
                                    transition: "background 0.15s",
                                }}
                            >
                                <span style={{ fontSize: 16 }}>{ICONS[n.tipo] || "📣"}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 12, color: n.leida ? G.muted : G.white, fontFamily: "sans-serif", lineHeight: 1.4 }}>
                                        {n.mensaje}
                                    </div>
                                    <div style={{ fontSize: 10, color: G.dimmed, fontFamily: "monospace", marginTop: 3 }}>
                                        {fmtDate(n.created_at)}
                                    </div>
                                </div>
                                {!n.leida && (
                                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(245,158,11,1)", flexShrink: 0, marginTop: 4 }} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

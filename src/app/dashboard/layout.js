"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { G } from "@/lib/constants";
import { GText } from "@/components/ui/UIUtils";
import NotificationBell from "@/components/ui/NotificationBell";

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.push("/");
            } else {
                fetchUserRole(session.user);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                router.push("/");
            } else {
                fetchUserRole(session.user);
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    const fetchUserRole = async (fbUser) => {
        // Aquí buscaremos el rol del usuario en la tabla `usuarios`
        const { data } = await supabase.from('usuarios').select('*').eq('id', fbUser.id).single();
        setUser({ ...fbUser, ...data });
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", background: G.bg, display: "flex", alignItems: "center", justifyContent: "center", color: G.dimmed, fontFamily: "sans-serif", fontSize: 11, letterSpacing: 3 }}>
                CARGANDO...
            </div>
        );
    }

    return (
        <div style={{ height: "100vh", background: G.bg, fontFamily: "Georgia,serif", color: G.white, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Top Header Placeholder */}
            <header style={{ borderBottom: `1px solid ${G.border}`, padding: "10px 20px", display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)", flexShrink: 0, position: "relative", zIndex: 50 }}>
                <div style={{ flex: 1 }}>
                    <GText g={G.gMagenta} size={8} weight={600} style={{ letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 1 }}>Embudo Invertido™</GText>
                    <div style={{ fontSize: 14, fontWeight: 700, color: G.white }}>Panel de Control</div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <NotificationBell currentUserId={user?.id} />
                    <div style={{ width: 26, height: 26, borderRadius: 20, background: G.gPurple, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 10px rgba(124,58,237,0.3)" }}>
                        <span style={{ fontSize: 11, color: G.white, fontWeight: 700 }}>{user?.nombre?.[0] || user?.email?.[0] || "U"}</span>
                    </div>
                    <span style={{ fontSize: 10, color: G.muted, fontFamily: "sans-serif" }}>{user?.nombre || user?.email}</span>
                    <button onClick={handleLogout} style={{ background: "transparent", border: `1px solid ${G.border}`, borderRadius: 5, color: G.dimmed, fontSize: 9, padding: "3px 7px", cursor: "pointer", fontFamily: "sans-serif" }}>salir</button>
                </div>
            </header>

            {/* Main Content Area */}
            <main style={{ flex: 1, overflow: "hidden" }}>
                {children}
            </main>
        </div>
    );
}

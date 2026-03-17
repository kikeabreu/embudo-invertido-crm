"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { G, css } from "@/lib/constants";
import { useRouter } from "next/navigation";

function GText({ children, g = G.gViolet, size = 14, weight = 700, style = {} }) {
    return <span style={{ background: g, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: size, fontWeight: weight, fontFamily: "sans-serif", ...style }}>{children}</span>;
}

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setErr("");

        if (!email || !password) {
            setErr("Por favor ingresa tu correo y contraseña.");
            return;
        }

        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (error) {
            setErr("Credenciales incorrectas o error en el servidor.");
        } else {
            router.push("/dashboard");
        }
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
                        <label style={css.label}>Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="tu@correo.com"
                            style={{ ...css.input }}
                        />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <label style={css.label}>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleLogin()}
                            placeholder="••••••••"
                            style={{ ...css.input, borderColor: err ? G.red : G.border }}
                        />
                        {err && <div style={{ fontSize: 10, color: G.red, fontFamily: "sans-serif", marginTop: 5 }}>{err}</div>}
                    </div>
                    <button
                        disabled={loading}
                        onClick={handleLogin}
                        style={{ ...css.btn(), width: "100%", padding: "12px", fontSize: 13, boxShadow: "0 4px 20px rgba(124,58,237,0.3)", opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? "Cargando..." : "Iniciar sesión →"}
                    </button>
                </div>
            </div>
        </div>
    );
}

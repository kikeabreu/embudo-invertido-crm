"use client";

import { useState } from "react";
import { G, css, USERS } from "@/lib/constants";
import { GText } from "@/components/ui/UIUtils";

export default function LoginScreen({ onLogin }) {
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

"use client";

import { useState } from "react";
import { G, css } from "@/lib/constants";

export function ConfirmDialog({ msg, subMsg, confirmLabel = "Eliminar", onConfirm, onCancel }) {
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9000, padding: 24 }}>
            <div style={{ background: "#0E0E24", border: "1px solid rgba(239,68,68,0.4)", borderRadius: 16, padding: "28px 32px", maxWidth: 400, width: "100%", boxShadow: "0 0 40px rgba(239,68,68,0.15)" }}>
                <div style={{ fontSize: 28, textAlign: "center", marginBottom: 12 }}>⚠️</div>
                <div style={{ fontSize: 15, color: G.white, fontFamily: "Georgia,serif", textAlign: "center", marginBottom: 8 }}>{msg}</div>
                {subMsg && <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", textAlign: "center", marginBottom: 20 }}>{subMsg}</div>}
                <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
                    <button onClick={onCancel} style={{ background: "transparent", border: `1px solid ${G.border}`, borderRadius: 8, color: G.muted, padding: "10px 24px", cursor: "pointer", fontSize: 13, fontFamily: "sans-serif" }}>Cancelar</button>
                    <button onClick={onConfirm} autoFocus style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.5)", borderRadius: 8, color: "#EF4444", padding: "10px 24px", cursor: "pointer", fontSize: 13, fontFamily: "sans-serif", fontWeight: 700 }}>{confirmLabel}</button>
                </div>
            </div>
        </div>
    );
}

export function useConfirm() {
    const [dialog, setDialog] = useState(null);
    const confirm = (msg, subMsg, confirmLabel) => new Promise(resolve => {
        setDialog({ msg, subMsg, confirmLabel: confirmLabel || "Eliminar", resolve });
    });
    const handleConfirm = () => { dialog?.resolve(true); setDialog(null); };
    const handleCancel = () => { dialog?.resolve(false); setDialog(null); };
    const ConfirmUI = dialog ? <ConfirmDialog msg={dialog.msg} subMsg={dialog.subMsg} confirmLabel={dialog.confirmLabel} onConfirm={handleConfirm} onCancel={handleCancel} /> : null;
    return { confirm, ConfirmUI };
}

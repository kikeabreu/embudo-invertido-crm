"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { G, css } from "@/lib/constants";
import { GText, StatCard } from "@/components/ui/UIUtils";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useToast, Toasts } from "@/components/ui/Toast";

function BrokerList({ brokers, onSelect, onCreate, onDelete, isAdmin }) {
    const [name, setName] = useState("");
    return (
        <div style={{ background: G.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
            <div style={{ width: "100%", maxWidth: 580 }}>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <div style={{ width: 64, height: 64, background: G.gMagenta, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28, boxShadow: "0 0 40px rgba(236,72,153,0.3)" }}>▼</div>
                    <GText g={G.gMagenta} size={10} weight={600} style={{ letterSpacing: 4, textTransform: "uppercase", display: "block", marginBottom: 10 }}>Agencia Top Seller</GText>
                    <div style={{ fontSize: 26, color: G.white, fontFamily: "Georgia,serif", marginBottom: 6 }}>Embudo Invertido™</div>
                    <div style={{ fontSize: 11, color: G.muted, fontFamily: "sans-serif", letterSpacing: 1 }}>{isAdmin ? "Selecciona o crea un broker" : "Selecciona tu cuenta de Broker"}</div>
                </div>

                {brokers.length === 0 && <div style={{ ...css.card, padding: "20px", textAlign: "center", color: G.dimmed, fontFamily: "sans-serif", fontSize: 12, marginBottom: 16, borderStyle: "dashed" }}>Aún no hay brokers registrados.</div>}

                {brokers.map(b => (
                    <div key={b.id} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                        <button onClick={() => onSelect(b.id)} style={{ flex: 1, ...css.card, border: `1px solid ${G.border}`, padding: "14px 20px", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <div style={{ fontSize: 14, color: G.white, fontFamily: "Georgia,serif" }}>{b.nombre || b.email}</div>
                                <div style={{ fontSize: 10, color: G.muted, fontFamily: "sans-serif", marginTop: 2 }}>{b.rol || "Broker"} • Estado: {b.estado_pago || 'Al día'}</div>
                            </div>
                            <GText g={G.gViolet} size={11}>Abrir Embudo →</GText>
                        </button>
                        {isAdmin && (
                            <button onClick={() => onDelete(b.id)} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "14px 12px", cursor: "pointer", color: G.red, fontSize: 12 }}>✕</button>
                        )}
                    </div>
                ))}

                {isAdmin && (
                    <div style={{ display: "flex", gap: 8, marginTop: 16, padding: 16, background: "rgba(255,255,255,0.02)", borderRadius: 12 }}>
                        <div style={{ flex: 1 }}>
                            <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && name.trim()) { onCreate(name.trim()); setName(""); } }} placeholder="Correo del nuevo broker (ej: juan@agencia.com)" style={{ ...css.input, flex: 1, borderRadius: 10 }} />
                        </div>
                        <button onClick={() => { if (name.trim()) { onCreate(name.trim()); setName(""); } }} style={{ ...css.btn(), borderRadius: 10, whiteSpace: "nowrap", boxShadow: "0 4px 20px rgba(124,58,237,0.3)" }}>+ Invitar</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function DashboardHome() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [brokers, setBrokers] = useState([]);
    const { confirm, ConfirmUI } = useConfirm();
    const { toasts, show: toast } = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Obtenemos el perfil
        const { data: profile } = await supabase.from('usuarios').select('*').eq('id', session.user.id).single();
        setUser({ ...session.user, ...profile });

        // Si es admin, cargamos todos. Si no, solo el suyo
        let query = supabase.from('usuarios').select('*');
        if (profile?.rol !== 'Admin') {
            query = query.eq('id', session.user.id);
        }
        const { data: brokerList } = await query;
        setBrokers(brokerList || []);
        setLoading(false);
    };

    const selectBroker = (id) => {
        router.push(`/dashboard/broker/${id}`);
    };

    const createBroker = async (email) => {
        toast("Funcionalidad de invitación en desarrollo. Se requiere la Admin API de Supabase.", "warn");
        // TODO: Usar Supabase Admin API para crear cuentas o mandar magic links
    };

    const deleteBroker = async (id) => {
        const b = brokers.find(x => x.id === id);
        const ok = await confirm(`¿Eliminar broker "${b?.nombre || b?.email}"?`, "Se eliminará también su acceso al sistema.", "Sí, eliminar");
        if (!ok) return;

        const { error } = await supabase.from('usuarios').delete().eq('id', id);
        if (error) {
            toast("Error al eliminar", "error");
        } else {
            toast("Broker eliminado", "success");
            loadData();
        }
    };

    if (loading) {
        return <div style={{ padding: 40, textAlign: "center", color: G.muted }}>Cargando lista de brokers...</div>;
    }

    return (
        <div style={{ height: "100%", overflowY: "auto" }}>
            <Toasts toasts={toasts} />
            {ConfirmUI}
            <BrokerList
                brokers={brokers}
                onSelect={selectBroker}
                onCreate={createBroker}
                onDelete={deleteBroker}
                isAdmin={user?.rol === 'Admin'}
            />
        </div>
    );
}

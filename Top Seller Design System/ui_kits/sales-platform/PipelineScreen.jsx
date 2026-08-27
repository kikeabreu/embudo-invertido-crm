/* Top Seller — Pipeline (kanban) screen. */
(function () {
  const DS = window.TopSellerDesignSystem_57ba3c;
  const I = window.TSIcons;
  const { Badge, Avatar, Tag } = DS;

  const COLS = [
    { id: "qualified", label: "Qualified", tone: "neutral", deals: [
      { name: "Vela Logistics", value: "$8.9k", owner: "Carmen Díaz", tag: "inbound" },
      { name: "Orion Foods", value: "$5.2k", owner: "Beto Luna", tag: "referral" },
    ]},
    { id: "proposal", label: "Proposal", tone: "purple", deals: [
      { name: "Acme Corp — Annual", value: "$24k", owner: "Ana Ríos", tag: "enterprise" },
      { name: "Pine & Co", value: "$11k", owner: "Diego Mora", tag: "expansion" },
    ]},
    { id: "negotiation", label: "Negotiation", tone: "orange", deals: [
      { name: "Lunar Retail rollout", value: "$12.4k", owner: "Beto Luna", tag: "priority" },
    ]},
    { id: "won", label: "Won", tone: "success", deals: [
      { name: "Nimbus SaaS", value: "$31.2k", owner: "Diego Mora", tag: "annual" },
      { name: "Kite Media", value: "$6.8k", owner: "Ana Ríos", tag: "renewal" },
    ]},
  ];

  function PipelineScreen() {
    return (
      <div style={{ padding: 24, background: "var(--surface-sunken)", minHeight: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, alignItems: "start" }}>
          {COLS.map((col) => (
            <div key={col.id} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 4px" }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background:
                  col.tone === "orange" ? "var(--ts-orange)" : col.tone === "success" ? "var(--ts-success)" : col.tone === "purple" ? "var(--ts-purple)" : "var(--ts-ink-400)" }} />
                <h3 style={{ fontSize: 14 }}>{col.label}</h3>
                <span style={{ fontSize: 12, color: "var(--text-faint)" }}>{col.deals.length}</span>
              </div>
              {col.deals.map((d, i) => (
                <div key={i} style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: 14, boxShadow: "var(--shadow-xs)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 8 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, color: "var(--text-strong)", lineHeight: 1.25 }}>{d.name}</div>
                    <I.Dots size={16} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--text-strong)", margin: "10px 0 12px" }}>{d.value}</div>
                  <div style={{ marginBottom: 12 }}><Tag tone={col.tone === "orange" ? "orange" : "purple"}>{d.tag}</Tag></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid var(--border-subtle)", paddingTop: 10 }}>
                    <Avatar name={d.owner} tone={col.tone === "orange" ? "orange" : "purple"} size="xs" />
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{d.owner}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
  window.TSPipeline = PipelineScreen;
})();

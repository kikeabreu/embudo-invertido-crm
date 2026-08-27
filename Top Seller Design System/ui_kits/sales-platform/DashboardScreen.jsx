/* Top Seller — Dashboard screen. Composes DS primitives + Stat/Card/Progress. */
(function () {
  const DS = window.TopSellerDesignSystem_57ba3c;
  const I = window.TSIcons;
  const { Card, Stat, Progress, Badge, Button, Avatar } = DS;

  const DEALS = [
    { name: "Acme Corp — Annual",   owner: "Ana Ríos",    value: "$24,000", stage: "Proposal",   tone: "purple",  pct: 70 },
    { name: "Lunar Retail rollout", owner: "Beto Luna",   value: "$12,400", stage: "Negotiation", tone: "orange",  pct: 85 },
    { name: "Vela Logistics",       owner: "Carmen Díaz", value: "$8,900",  stage: "Qualified",   tone: "neutral", pct: 40 },
    { name: "Nimbus SaaS",          owner: "Diego Mora",  value: "$31,200", stage: "Won",         tone: "success", pct: 100 },
  ];

  function DashboardScreen() {
    return (
      <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 20, background: "var(--surface-sunken)", minHeight: "100%", boxSizing: "border-box" }}>
        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          <Card padding="md"><Stat label="Revenue (MTD)" value="$148k" delta="12.4%" trend="up" icon={<I.Bolt size={15} />} /></Card>
          <Card padding="md"><Stat label="Open deals" value="24" delta="3" trend="up" icon={<I.Pipeline size={15} />} /></Card>
          <Card padding="md"><Stat label="Win rate" value="34%" delta="2.1%" trend="down" icon={<I.Target size={15} />} /></Card>
          <Card variant="brand" padding="md">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <I.Trophy size={16} />
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase", opacity: .9 }}>Quota</span>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 34, lineHeight: 1 }}>82%</div>
            <div style={{ marginTop: 12 }}><Progress value={82} tone="orange" /></div>
          </Card>
        </div>

        {/* Deals + leaderboard */}
        <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 16 }}>
          <Card padding="none">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
              <h3 style={{ fontSize: 16 }}>Deals in motion</h3>
              <Button variant="ghost" size="sm" iconRight={<I.Arrow size={15} />}>View all</Button>
            </div>
            <div>
              {DEALS.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 20px", borderBottom: i < DEALS.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, color: "var(--text-strong)" }}>{d.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{d.owner}</div>
                  </div>
                  <div style={{ width: 120 }}><Progress value={d.pct} tone={d.tone === "orange" ? "orange" : d.tone === "success" ? "success" : "purple"} /></div>
                  <Badge tone={d.tone} size="sm">{d.stage}</Badge>
                  <div style={{ width: 78, textAlign: "right", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, color: "var(--text-strong)" }}>{d.value}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="none">
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
              <h3 style={{ fontSize: 16 }}>Team leaderboard</h3>
            </div>
            <div style={{ padding: "6px 12px" }}>
              {[["Ana Ríos","$92k",1],["Diego Mora","$78k",2],["Beto Luna","$61k",3],["Carmen Díaz","$54k",4]].map(([n,v,r]) => (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px" }}>
                  <span style={{ width: 20, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, color: r === 1 ? "var(--ts-orange)" : "var(--text-faint)" }}>{r}</span>
                  <Avatar name={n} tone={r === 1 ? "orange" : "purple"} size="sm" />
                  <span style={{ flex: 1, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, color: "var(--text-strong)" }}>{n}</span>
                  <span style={{ fontSize: 13, color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }
  window.TSDashboard = DashboardScreen;
})();

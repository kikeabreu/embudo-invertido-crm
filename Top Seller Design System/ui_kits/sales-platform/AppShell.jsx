/* Top Seller — App shell: sidebar + topbar. Composes DS primitives. */
(function () {
  const DS = window.TopSellerDesignSystem_57ba3c;
  const I = window.TSIcons;
  const { Avatar, Badge, Input, IconButton } = DS;

  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: I.Dashboard },
    { id: "pipeline", label: "Pipeline", icon: I.Pipeline, badge: "24" },
    { id: "leads", label: "Leads", icon: I.Leads, badge: "8" },
    { id: "reports", label: "Reports", icon: I.Reports },
    { id: "inbox", label: "Inbox", icon: I.Inbox },
  ];

  function Sidebar({ active, onNavigate }) {
    return (
      <aside style={{
        width: 248, flexShrink: 0, height: "100%", boxSizing: "border-box",
        background: "var(--ts-black)", color: "var(--ts-ink-300)",
        display: "flex", flexDirection: "column", padding: "22px 16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "0 8px 22px" }}>
          <img src="../../assets/logos/topseller-mark-white.png" style={{ height: 30 }} alt="" />
          <img src="../../assets/logos/topseller-wordmark-white.png" style={{ height: 16 }} alt="Top Seller" />
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {NAV.map((n) => {
            const on = n.id === active;
            return (
              <button key={n.id} onClick={() => onNavigate(n.id)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
                border: "none", borderRadius: "var(--radius-md)", cursor: "pointer",
                textAlign: "left", width: "100%",
                fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14,
                color: on ? "#fff" : "var(--ts-ink-400)",
                backgroundColor: on ? "#7060D8" : "transparent",
              }}>
                <n.icon size={18} />
                <span style={{ flex: 1 }}>{n.label}</span>
                {n.badge && (
                  <span style={{
                    fontSize: 11, padding: "1px 7px", borderRadius: 999,
                    background: on ? "rgba(255,255,255,.22)" : "var(--ts-ink-800)",
                    color: on ? "#fff" : "var(--ts-ink-300)",
                  }}>{n.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
          <button onClick={() => onNavigate("settings")} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
            border: "none", borderRadius: "var(--radius-md)", cursor: "pointer", width: "100%",
            fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14,
            color: "var(--ts-ink-400)", background: "transparent", textAlign: "left",
          }}>
            <I.Settings size={18} /><span>Settings</span>
          </button>
          <div style={{
            display: "flex", alignItems: "center", gap: 11, padding: "10px 8px", marginTop: 6,
            borderTop: "1px solid var(--ts-ink-800)",
          }}>
            <Avatar name="Diego Mora" tone="orange" size="sm" />
            <div style={{ lineHeight: 1.25, minWidth: 0 }}>
              <div style={{ color: "#fff", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13 }}>Diego Mora</div>
              <div style={{ fontSize: 11, color: "var(--ts-ink-500)" }}>Account Executive</div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  function Topbar({ title, subtitle, actions }) {
    return (
      <header style={{
        display: "flex", alignItems: "center", gap: 16, padding: "20px 28px",
        borderBottom: "1px solid var(--border-subtle)", background: "var(--surface-card)",
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: 22 }}>{title}</h1>
          {subtitle && <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{subtitle}</div>}
        </div>
        <div style={{ width: 240 }}>
          <Input iconLeft={<I.Search size={15} />} placeholder="Search…" size="sm" />
        </div>
        <IconButton variant="secondary" aria-label="Notifications"><I.Bell size={18} /></IconButton>
        {actions}
      </header>
    );
  }

  window.TSShell = { Sidebar, Topbar, NAV };
})();

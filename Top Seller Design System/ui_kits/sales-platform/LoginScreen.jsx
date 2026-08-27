/* Top Seller — Login screen. */
(function () {
  const DS = window.TopSellerDesignSystem_57ba3c;
  const I = window.TSIcons;
  const { Button, Input, Checkbox } = DS;

  function LoginScreen({ onLogin }) {
    const [email, setEmail] = React.useState("diego@topseller.io");
    const submit = (e) => { e && e.preventDefault(); onLogin(); };
    return (
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Form side */}
        <div style={{ flex: "0 0 46%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-card)", padding: 40 }}>
          <form onSubmit={submit} style={{ width: 360 }}>
            <img src="../../assets/logos/topseller-wordmark-purple.png" style={{ height: 26 }} alt="Top Seller" />
            <h1 style={{ fontSize: 30, margin: "28px 0 6px" }}>Close more, faster.</h1>
            <p style={{ fontSize: 15, color: "var(--text-muted)", margin: "0 0 26px" }}>Sign in to your sales workspace.</p>
            <label style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, marginBottom: 7 }}>Work email</label>
            <Input iconLeft={<I.Mail size={15} />} value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginBottom: 16 }} />
            <label style={{ display: "block", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, marginBottom: 7 }}>Password</label>
            <Input type="password" defaultValue="password" style={{ marginBottom: 18 }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <Checkbox checked label="Remember me" />
              <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 13, fontWeight: 700 }}>Forgot?</a>
            </div>
            <Button type="submit" variant="primary" fullWidth iconRight={<I.Arrow size={16} />} onClick={submit}>Sign in</Button>
          </form>
        </div>
        {/* Brand side */}
        <div style={{ flex: 1, position: "relative", background: "var(--ts-black)", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", padding: 56, color: "#fff" }}>
          <img src="../../assets/logos/topseller-mark-purple.png" alt="" style={{ position: "absolute", right: -80, top: -40, height: 520, opacity: .22 }} />
          <div className="ts-eyebrow" style={{ color: "var(--ts-orange)" }}>Sales intelligence</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 40, lineHeight: 1.05, letterSpacing: "-.02em", margin: "14px 0 18px", maxWidth: 420 }}>
            The cunning edge for high-performing teams.
          </div>
          <p style={{ fontSize: 16, color: "var(--ts-ink-300)", maxWidth: 380, fontWeight: 300 }}>
            Track every lead from first touch to closed-won, and always know who's the top seller.
          </p>
        </div>
      </div>
    );
  }
  window.TSLogin = LoginScreen;
})();

/* Top Seller — Landing "Sistema Referente Inmobiliario™".
   Secciones de la landing, construidas con los primitivos del DS.
   Copy derivado de los docs de estrategia (gran slam offer, pricing, avatares). */
(function () {
  const DS = window.TopSellerDesignSystem_57ba3c;
  const { Button, Badge, Card } = DS;
  const L = "../../assets/logos";

  const Eyebrow = ({ children, light }) => (
    <div style={{
      fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 12,
      letterSpacing: ".16em", textTransform: "uppercase",
      color: light ? "var(--ts-orange)" : "var(--text-accent)",
    }}>{children}</div>
  );

  const Check = ({ c = "var(--ts-purple)" }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="11" fill={c} opacity="0.12" />
      <path d="M7 12.5l3.2 3.2L17 9" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const Cross = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="11" fill="#E0473C" opacity="0.12" />
      <path d="M8 8l8 8M16 8l-8 8" stroke="#E0473C" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );

  const WRAP = { maxWidth: 1100, margin: "0 auto", padding: "0 32px" };

  /* ---------------- NAV ---------------- */
  function Nav({ onApply }) {
    return (
      <nav style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(255,255,255,.86)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ ...WRAP, display: "flex", alignItems: "center", height: 68 }}>
          <img src={`${L}/topseller-wordmark-purple.png`} alt="Top Seller" style={{ height: 22 }} />
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 24 }}>
            <a href="#sistema" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, color: "var(--text-body)" }}>El sistema</a>
            <a href="#valor" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, color: "var(--text-body)" }}>Qué incluye</a>
            <a href="#precio" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, color: "var(--text-body)" }}>Inversión</a>
            <Button size="sm" onClick={onApply}>Aplicar a mi zona</Button>
          </div>
        </div>
      </nav>
    );
  }

  /* ---------------- HERO ---------------- */
  function Hero({ onApply }) {
    return (
      <header style={{ position: "relative", overflow: "hidden", background: "var(--ts-black)", color: "#fff" }}>
        <img src={`${L}/topseller-mark-purple.png`} alt="" style={{ position: "absolute", right: -120, top: -60, height: 640, opacity: .16, pointerEvents: "none" }} />
        <div style={{ ...WRAP, position: "relative", padding: "92px 32px 100px" }}>
          <div style={{ maxWidth: 720 }}>
            <Eyebrow light>Sistema Referente Inmobiliario™</Eyebrow>
            <h1 style={{ color: "#fff", fontSize: "clamp(38px,5.4vw,66px)", lineHeight: 1.02, letterSpacing: "-.025em", margin: "20px 0 0" }}>
              Deja de ser un asesor <span style={{ color: "var(--ts-ink-500)" }}>invisible</span> y conviértete en <span style={{ color: "var(--ts-orange)" }}>referente</span> en 30 días.
            </h1>
            <p style={{ fontSize: 19, lineHeight: 1.55, color: "var(--ts-ink-300)", fontWeight: 300, margin: "24px 0 0", maxWidth: 600 }}>
              Un sistema que genera prospectos constantes desde redes y te da control real sobre tus ventas — sin depender de portales ni improvisar tu marketing.
            </p>
            <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 34, flexWrap: "wrap" }}>
              <Button size="lg" variant="accent" onClick={onApply}>Aplicar a mi zona</Button>
              <a href="#sistema" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, color: "#fff", display: "inline-flex", alignItems: "center", gap: 8 }}>
                Ver cómo funciona →
              </a>
            </div>
            <div style={{ display: "flex", gap: 28, marginTop: 44, flexWrap: "wrap" }}>
              {[["30 días", "implementación"], ["hasta 10", "prospectos / mes"], ["1 zona", "exclusiva por asesor"]].map(([a, b]) => (
                <div key={a}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: "var(--ts-orange)" }}>{a}</div>
                  <div style={{ fontSize: 13, color: "var(--ts-ink-400)" }}>{b}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>
    );
  }

  /* ---------------- ENEMIGO ---------------- */
  function Enemigo() {
    const items = [
      "Publicas todos los días… y nadie te escribe.",
      "Dependes de portales y referidos para generar clientes.",
      "Los leads solo preguntan precio y no avanzan.",
      "Pierdes prospectos en WhatsApp, sin seguimiento.",
      "Ves a otros asesores vendiendo más gracias a redes.",
    ];
    return (
      <section style={{ background: "var(--surface-card)", padding: "84px 0" }}>
        <div style={WRAP}>
          <Eyebrow>El enemigo</Eyebrow>
          <h2 style={{ fontSize: "clamp(30px,4vw,46px)", letterSpacing: "-.02em", margin: "14px 0 0", maxWidth: 760 }}>
            El problema no eres tú. Es <span style={{ color: "var(--ts-purple)" }}>“el Modelo Invisible”</span>.
          </h2>
          <p style={{ fontSize: 17, color: "var(--text-muted)", maxWidth: 640, margin: "16px 0 40px", fontWeight: 300 }}>
            Un modelo obsoleto basado en improvisar contenido, depender de portales y competir por precio — que te mantiene invisible y reemplazable.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 40px", maxWidth: 880 }}>
            {items.map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Cross /><span style={{ fontSize: 16, color: "var(--text-body)" }}>{t}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40, padding: "22px 26px", borderLeft: "3px solid var(--ts-orange)", background: "var(--ts-orange-50)", borderRadius: "0 var(--radius-md) var(--radius-md) 0", maxWidth: 880 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--text-strong)" }}>
              No es que no sepas vender. Es que no tienes un sistema que te haga visible.
            </span>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- SISTEMA / EMBUDO INVERTIDO ---------------- */
  function Sistema() {
    const steps = [
      ["01", "Atracción", "Estrategia, copywriting y contenido grabado contigo que detiene el scroll y posiciona tu autoridad."],
      ["02", "Conversación", "Automatizaciones en Instagram + Protocolo de Conversión por DM™ que convierten interacción en prospectos filtrados."],
      ["03", "Seguimiento", "CRM de ventas sin límite de usuarios: cada oportunidad organizada, nada se pierde."],
      ["04", "Optimización", "Pauta gestionada y reportes que te dicen qué genera dinero — y qué no."],
    ];
    return (
      <section id="sistema" style={{ background: "var(--surface-sunken)", padding: "84px 0" }}>
        <div style={WRAP}>
          <Eyebrow>El sistema · Método Embudo Invertido™</Eyebrow>
          <h2 style={{ fontSize: "clamp(30px,4vw,46px)", letterSpacing: "-.02em", margin: "14px 0 12px", maxWidth: 780 }}>
            No es contenido. Es una <span style={{ color: "var(--ts-purple)" }}>infraestructura de ventas</span> completa.
          </h2>
          <p style={{ fontSize: 17, color: "var(--text-muted)", maxWidth: 640, margin: "0 0 44px", fontWeight: 300 }}>
            Cuatro etapas integradas que hacen que las personas lleguen, te escriban y no se pierdan en el proceso.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 18 }}>
            {steps.map(([n, t, d]) => (
              <Card key={n} padding="lg" style={{ display: "flex", gap: 20 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 30, color: "var(--ts-purple-300)", lineHeight: 1 }}>{n}</div>
                <div>
                  <h3 style={{ fontSize: 20, marginBottom: 6 }}>{t}</h3>
                  <p style={{ fontSize: 15, color: "var(--text-muted)", fontWeight: 300, lineHeight: 1.55 }}>{d}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- STACK DE VALOR ---------------- */
  function Valor() {
    const rows = [
      ["Diagnóstico estratégico inicial", "$2,000"],
      ["Implementación del Método Embudo Invertido™", "$5,000"],
      ["Estrategia de posicionamiento y calendario mensual", "$5,000"],
      ["Copywriting estratégico (hooks, guiones, captions)", "$4,000"],
      ["Grabación de contenido contigo", "$4,000"],
      ["Edición de videos", "$8,000"],
      ["Diseño y edición de carruseles", "$3,000"],
      ["Programación y publicación de contenido e historias", "$5,000"],
      ["Gestión y optimización de pauta", "$5,000"],
      ["CRM de ventas sin límite de usuarios ni prospectos", "$3,000"],
      ["Automatizaciones en Instagram", "$4,000"],
      ["Reporte y análisis de resultados", "$2,000"],
    ];
    return (
      <section id="valor" style={{ background: "var(--surface-card)", padding: "84px 0" }}>
        <div style={{ ...WRAP, maxWidth: 880 }}>
          <Eyebrow>Qué incluye</Eyebrow>
          <h2 style={{ fontSize: "clamp(30px,4vw,46px)", letterSpacing: "-.02em", margin: "14px 0 36px" }}>
            Un ecosistema completo de atracción, conversación y seguimiento.
          </h2>
          <Card padding="none" style={{ overflow: "hidden" }}>
            {rows.map(([t, v], i) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 22px", borderBottom: i < rows.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
                <Check />
                <span style={{ flex: 1, fontSize: 15.5, color: "var(--text-body)" }}>{t}</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, color: "var(--text-faint)", textDecoration: "line-through", fontVariantNumeric: "tabular-nums" }}>{v} MXN</span>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 22px", background: "var(--ts-black)", color: "#fff" }}>
              <span style={{ flex: 1, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17 }}>Valor total percibido</span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--ts-orange)" }}>$50,000 MXN</span>
            </div>
          </Card>
          <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
            <Badge tone="purple" variant="soft" size="md">+ Protocolo de Conversión por DM™</Badge>
            <Badge tone="purple" variant="soft" size="md">+ Optimización de Perfil Inmobiliario™</Badge>
            <Badge tone="purple" variant="soft" size="md">+ Maletín de Gatillos Mentales™</Badge>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- AVATARES ---------------- */
  function Avatares() {
    const cards = [
      ["El Asesor Invisible", "Visibilidad", "Ya vendes, pero nadie te escribe. Recupera visibilidad y deja de depender de la suerte."],
      ["El Competidor Oculto", "Optimización", "Ya generas, pero pierdes oportunidades. Optimiza tu sistema y convierte más de lo que ya inviertes."],
      ["El Arquitecto del Mercado", "Dominio", "Tienes inventario y equipo. Controla la demanda con un sistema replicable en cada proyecto."],
    ];
    return (
      <section style={{ background: "var(--surface-sunken)", padding: "84px 0" }}>
        <div style={WRAP}>
          <Eyebrow>Para quién es</Eyebrow>
          <h2 style={{ fontSize: "clamp(30px,4vw,46px)", letterSpacing: "-.02em", margin: "14px 0 36px", maxWidth: 720 }}>
            La misma estructura. Distinto nivel del juego.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {cards.map(([t, k, d], i) => (
              <Card key={t} variant={i === 1 ? "brand" : "default"} padding="lg">
                <Badge tone={i === 1 ? "orange" : "purple"} variant={i === 1 ? "solid" : "soft"} size="sm">{k}</Badge>
                <h3 style={{ fontSize: 21, margin: "16px 0 8px", color: i === 1 ? "#fff" : "var(--text-strong)" }}>{t}</h3>
                <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.55, color: i === 1 ? "rgba(255,255,255,.85)" : "var(--text-muted)" }}>{d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- GARANTÍA ---------------- */
  function Garantia() {
    return (
      <section style={{ background: "var(--surface-card)", padding: "72px 0" }}>
        <div style={{ ...WRAP, maxWidth: 880 }}>
          <Card variant="accent-edge" padding="xl">
            <Eyebrow>Garantía de activación</Eyebrow>
            <h2 style={{ fontSize: "clamp(26px,3.4vw,38px)", letterSpacing: "-.02em", margin: "12px 0 14px" }}>
              No estás pagando por intentos.
            </h2>
            <p style={{ fontSize: 17, color: "var(--text-body)", fontWeight: 300, lineHeight: 1.6, maxWidth: 680 }}>
              Si en los primeros 30 días no tienes el sistema implementado — contenido publicado, automatizaciones activas, CRM funcionando y flujo real de conversaciones — <strong style={{ fontWeight: 700, color: "var(--text-strong)" }}>trabajamos contigo sin costo adicional hasta que esté completamente activo.</strong>
            </p>
          </Card>
        </div>
      </section>
    );
  }

  /* ---------------- PRECIO ---------------- */
  function Precio({ onApply }) {
    return (
      <section id="precio" style={{ background: "var(--ts-black)", color: "#fff", padding: "92px 0" }}>
        <div style={{ ...WRAP, maxWidth: 760, textAlign: "center" }}>
          <Eyebrow light>Tu inversión</Eyebrow>
          <h2 style={{ color: "#fff", fontSize: "clamp(30px,4vw,46px)", letterSpacing: "-.02em", margin: "14px 0 8px" }}>
            Recibes más de $50,000 MXN en valor integrado.
          </h2>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 16, margin: "28px 0 8px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color: "var(--ts-ink-500)", textDecoration: "line-through" }}>$50,000</span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 64, lineHeight: 1, color: "var(--ts-orange)" }}>$10,000</span>
            <span style={{ fontSize: 18, color: "var(--ts-ink-300)" }}>MXN / mes</span>
          </div>
          <p style={{ fontSize: 16, color: "var(--ts-ink-400)", fontWeight: 300, maxWidth: 520, margin: "0 auto 32px" }}>
            Una sola venta cubre el sistema. El resto del año, es retorno.
          </p>
          <Button size="lg" variant="accent" onClick={onApply}>Aplicar a mi zona</Button>
          <div style={{ marginTop: 20, fontSize: 13.5, color: "var(--ts-ink-500)" }}>
            Exclusividad por zona — solo trabajamos con <strong style={{ color: "var(--ts-ink-300)", fontWeight: 700 }}>un asesor por mercado</strong>.
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- FOOTER ---------------- */
  function Footer() {
    return (
      <footer style={{ background: "var(--ts-ink-900)", color: "var(--ts-ink-400)", padding: "36px 0" }}>
        <div style={{ ...WRAP, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <img src={`${L}/topseller-wordmark-white.png`} alt="Top Seller" style={{ height: 18 }} />
          <span style={{ fontSize: 13 }}>Marketing inmobiliario que vende sistemas, no servicios.</span>
          <span style={{ marginLeft: "auto", fontSize: 12.5, color: "var(--ts-ink-600)" }}>© Top Seller · Sistema Referente Inmobiliario™</span>
        </div>
      </footer>
    );
  }

  window.TSLanding = { Nav, Hero, Enemigo, Sistema, Valor, Avatares, Garantia, Precio, Footer };
})();

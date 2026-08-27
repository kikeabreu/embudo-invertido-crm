import React from "react";

/**
 * Top Seller — Button
 * Geometric, confident actions. Primary = morado, accent = naranja.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  disabled = false,
  type = "button",
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);

  const sizes = {
    sm: { height: "var(--control-sm)", padding: "0 14px", font: "var(--text-sm)", gap: "6px" },
    md: { height: "var(--control-md)", padding: "0 20px", font: "var(--text-base)", gap: "8px" },
    lg: { height: "var(--control-lg)", padding: "0 28px", font: "var(--text-lg)", gap: "10px" },
  };
  const s = sizes[size] || sizes.md;

  const palettes = {
    primary: {
      bg: hover ? "var(--action-primary-hover)" : "var(--action-primary)",
      color: "var(--text-on-brand)",
      border: "1px solid transparent",
      shadow: hover ? "var(--shadow-brand-md)" : "var(--shadow-brand-sm)",
    },
    accent: {
      bg: hover ? "var(--action-accent-hover)" : "var(--action-accent)",
      color: "var(--text-on-accent)",
      border: "1px solid transparent",
      shadow: hover ? "var(--shadow-md)" : "var(--shadow-accent-sm)",
    },
    secondary: {
      bg: hover ? "var(--ts-ink-50)" : "var(--surface-card)",
      color: "var(--text-strong)",
      border: "1px solid var(--border-default)",
      shadow: "var(--shadow-xs)",
    },
    ghost: {
      bg: hover ? "var(--surface-brand-soft)" : "transparent",
      color: "var(--text-brand)",
      border: "1px solid transparent",
      shadow: "none",
    },
    inverse: {
      bg: hover ? "var(--ts-ink-800)" : "var(--surface-inverse)",
      color: "var(--ts-white)",
      border: "1px solid transparent",
      shadow: "var(--shadow-sm)",
    },
  };
  const p = palettes[variant] || palettes.primary;

  return (
    <button
      type={type}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        width: fullWidth ? "100%" : "auto",
        height: s.height,
        padding: s.padding,
        font: "inherit",
        fontFamily: "var(--font-display)",
        fontWeight: "var(--weight-black)",
        fontSize: s.font,
        letterSpacing: "0.01em",
        lineHeight: 1,
        color: p.color,
        background: p.bg,
        border: p.border,
        borderRadius: "var(--radius-md)",
        boxShadow: disabled ? "none" : p.shadow,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transform: active && !disabled ? "translateY(1px) scale(0.99)" : "translateY(0)",
        transition: "background var(--transition), box-shadow var(--transition), transform var(--dur-fast) var(--ease-out)",
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {iconLeft && <span style={{ display: "inline-flex" }}>{iconLeft}</span>}
      {children}
      {iconRight && <span style={{ display: "inline-flex" }}>{iconRight}</span>}
    </button>
  );
}

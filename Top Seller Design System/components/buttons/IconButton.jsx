import React from "react";

/**
 * Top Seller — IconButton
 * Square action for toolbars and compact UIs.
 */
export function IconButton({
  children,
  variant = "secondary",
  size = "md",
  disabled = false,
  "aria-label": ariaLabel,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);

  const dims = { sm: 32, md: 40, lg: 48 }[size] || 40;

  const palettes = {
    primary: { bg: hover ? "var(--action-primary-hover)" : "var(--action-primary)", color: "var(--text-on-brand)", border: "1px solid transparent" },
    accent: { bg: hover ? "var(--action-accent-hover)" : "var(--action-accent)", color: "var(--text-on-accent)", border: "1px solid transparent" },
    secondary: { bg: hover ? "var(--ts-ink-50)" : "var(--surface-card)", color: "var(--text-strong)", border: "1px solid var(--border-default)" },
    ghost: { bg: hover ? "var(--surface-brand-soft)" : "transparent", color: "var(--text-brand)", border: "1px solid transparent" },
  };
  const p = palettes[variant] || palettes.secondary;

  return (
    <button
      aria-label={ariaLabel}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: dims,
        height: dims,
        color: p.color,
        background: p.bg,
        border: p.border,
        borderRadius: "var(--radius-md)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transform: active && !disabled ? "scale(0.94)" : "scale(1)",
        transition: "background var(--transition), transform var(--dur-fast) var(--ease-out)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

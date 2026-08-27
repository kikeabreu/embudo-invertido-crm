import React from "react";

/**
 * Top Seller — Badge
 * Small status/label pill. Solid + soft tones across the palette.
 */
export function Badge({
  children,
  tone = "purple",     // purple | orange | neutral | success | warning | danger
  variant = "soft",    // soft | solid | outline
  size = "md",
  dot = false,
  style = {},
  ...rest
}) {
  const tones = {
    purple:  { solid: "var(--ts-purple)",  soft: "var(--ts-purple-50)",  text: "var(--ts-purple-700)",  on: "#fff" },
    orange:  { solid: "var(--ts-orange)",  soft: "var(--ts-orange-50)",  text: "var(--ts-orange-700)",  on: "#fff" },
    neutral: { solid: "var(--ts-ink-700)", soft: "var(--ts-ink-100)",    text: "var(--ts-ink-700)",     on: "#fff" },
    success: { solid: "var(--ts-success)", soft: "var(--ts-success-bg)", text: "var(--ts-success)",     on: "#fff" },
    warning: { solid: "var(--ts-warning)", soft: "var(--ts-warning-bg)", text: "#9A6510",               on: "#fff" },
    danger:  { solid: "var(--ts-danger)",  soft: "var(--ts-danger-bg)",  text: "var(--ts-danger)",      on: "#fff" },
  };
  const t = tones[tone] || tones.purple;

  const styles = {
    soft:    { background: t.soft, color: t.text, border: "1px solid transparent" },
    solid:   { background: t.solid, color: t.on, border: "1px solid transparent" },
    outline: { background: "transparent", color: t.text, border: `1px solid ${t.solid}` },
  }[variant];

  const sz = size === "sm"
    ? { padding: "2px 8px", font: "var(--text-2xs)" }
    : { padding: "4px 10px", font: "var(--text-xs)" };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: sz.padding,
        fontFamily: "var(--font-display)",
        fontWeight: "var(--weight-black)",
        fontSize: sz.font,
        letterSpacing: "0.03em",
        lineHeight: 1.4,
        borderRadius: "var(--radius-pill)",
        whiteSpace: "nowrap",
        ...styles,
        ...style,
      }}
      {...rest}
    >
      {dot && (
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: variant === "solid" ? t.on : t.solid,
        }} />
      )}
      {children}
    </span>
  );
}

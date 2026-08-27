import React from "react";

/**
 * Top Seller — Avatar
 * Image or initials. Falls back to a brand-tinted monogram.
 */
export function Avatar({
  src,
  name = "",
  size = "md",
  tone = "purple",
  style = {},
  ...rest
}) {
  const dims = { xs: 24, sm: 32, md: 40, lg: 56, xl: 72 }[size] || 40;
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const tones = {
    purple: { bg: "var(--ts-purple-100)", color: "var(--ts-purple-700)" },
    orange: { bg: "var(--ts-orange-100)", color: "var(--ts-orange-700)" },
    ink:    { bg: "var(--ts-ink-200)", color: "var(--ts-ink-700)" },
  };
  const t = tones[tone] || tones.purple;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: dims,
        height: dims,
        flexShrink: 0,
        borderRadius: "50%",
        overflow: "hidden",
        background: t.bg,
        color: t.color,
        fontFamily: "var(--font-display)",
        fontWeight: "var(--weight-black)",
        fontSize: dims * 0.38,
        letterSpacing: "0.02em",
        userSelect: "none",
        ...style,
      }}
      {...rest}
    >
      {src ? (
        <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        initials || "?"
      )}
    </span>
  );
}

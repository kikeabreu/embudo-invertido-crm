import React from "react";

/**
 * Top Seller — Tag (removable chip)
 */
export function Tag({
  children,
  onRemove,
  tone = "neutral",
  style = {},
  ...rest
}) {
  const tones = {
    neutral: { bg: "var(--ts-ink-100)", color: "var(--ts-ink-700)" },
    purple:  { bg: "var(--ts-purple-50)", color: "var(--ts-purple-700)" },
    orange:  { bg: "var(--ts-orange-50)", color: "var(--ts-orange-700)" },
  };
  const t = tones[tone] || tones.neutral;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: onRemove ? "4px 6px 4px 12px" : "4px 12px",
        background: t.bg,
        color: t.color,
        fontFamily: "var(--font-body)",
        fontWeight: "var(--weight-medium)",
        fontSize: "var(--text-sm)",
        borderRadius: "var(--radius-pill)",
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Remove"
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 16, height: 16, padding: 0, border: "none", cursor: "pointer",
            borderRadius: "50%", background: "transparent", color: "inherit", opacity: 0.65,
          }}
        >
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
            <path d="M1 1L8 8M8 1L1 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
}

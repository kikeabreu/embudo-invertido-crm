import React from "react";

/**
 * Top Seller — Progress (linear)
 */
export function Progress({
  value = 0,
  max = 100,
  tone = "purple",      // purple | orange | success
  size = "md",
  showLabel = false,
  style = {},
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const h = size === "sm" ? 6 : size === "lg" ? 12 : 8;
  const fills = {
    purple: "var(--ts-purple)",
    orange: "var(--ts-orange)",
    success: "var(--ts-success)",
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", ...style }} {...rest}>
      <div style={{
        flex: 1, height: h, borderRadius: "var(--radius-pill)",
        background: "var(--ts-ink-100)", overflow: "hidden",
      }}>
        <div style={{
          width: `${pct}%`, height: "100%", borderRadius: "var(--radius-pill)",
          background: fills[tone] || fills.purple,
          transition: "width var(--dur-slow) var(--ease-out)",
        }} />
      </div>
      {showLabel && (
        <span style={{
          fontFamily: "var(--font-display)", fontWeight: "var(--weight-black)",
          fontSize: "var(--text-xs)", color: "var(--text-muted)", minWidth: 34, textAlign: "right",
        }}>
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}

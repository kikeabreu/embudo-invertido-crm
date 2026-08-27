import React from "react";

/**
 * Top Seller — Stat
 * KPI display with optional delta. Used across sales dashboards.
 */
export function Stat({
  label,
  value,
  delta,
  trend = "up",        // up | down | flat
  icon = null,
  style = {},
  ...rest
}) {
  const trendColor =
    trend === "up" ? "var(--ts-success)" : trend === "down" ? "var(--ts-danger)" : "var(--text-muted)";
  const arrow = trend === "up" ? "▲" : trend === "down" ? "▼" : "—";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", ...style }} {...rest}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {icon && (
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 28, height: 28, borderRadius: "var(--radius-sm)",
            background: "var(--surface-brand-soft)", color: "var(--text-brand)",
          }}>
            {icon}
          </span>
        )}
        <span style={{
          fontFamily: "var(--font-display)", fontWeight: "var(--weight-black)",
          fontSize: "var(--text-2xs)", letterSpacing: "var(--tracking-eyebrow)",
          textTransform: "uppercase", color: "var(--text-muted)",
        }}>
          {label}
        </span>
      </div>
      <div style={{
        fontFamily: "var(--font-display)", fontWeight: "var(--weight-black)",
        fontSize: "var(--text-display-md)", lineHeight: 1, letterSpacing: "var(--tracking-tight)",
        color: "var(--text-strong)",
      }}>
        {value}
      </div>
      {delta != null && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "5px",
          fontSize: "var(--text-sm)", fontWeight: "var(--weight-bold)",
          fontFamily: "var(--font-display)", color: trendColor,
        }}>
          <span style={{ fontSize: "0.7em" }}>{arrow}</span>
          {delta}
        </div>
      )}
    </div>
  );
}

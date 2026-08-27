import React from "react";

/**
 * Top Seller — Alert
 */
export function Alert({
  children,
  title,
  tone = "info",      // info | success | warning | danger
  onClose,
  icon = null,
  style = {},
  ...rest
}) {
  const tones = {
    info:    { bg: "var(--ts-info-bg)",    bar: "var(--ts-purple)",  text: "var(--ts-purple-800)" },
    success: { bg: "var(--ts-success-bg)", bar: "var(--ts-success)", text: "#0F5A3C" },
    warning: { bg: "var(--ts-warning-bg)", bar: "var(--ts-warning)", text: "#8A5A0F" },
    danger:  { bg: "var(--ts-danger-bg)",  bar: "var(--ts-danger)",  text: "#A52A22" },
  };
  const t = tones[tone] || tones.info;

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        gap: "12px",
        padding: "14px 16px",
        background: t.bg,
        borderRadius: "var(--radius-md)",
        borderLeft: `3px solid ${t.bar}`,
        color: t.text,
        ...style,
      }}
      {...rest}
    >
      {icon && <span style={{ display: "inline-flex", flexShrink: 0, marginTop: 1 }}>{icon}</span>}
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div style={{
            fontFamily: "var(--font-display)", fontWeight: "var(--weight-black)",
            fontSize: "var(--text-sm)", marginBottom: children ? 2 : 0,
          }}>
            {title}
          </div>
        )}
        {children && (
          <div style={{ fontSize: "var(--text-sm)", lineHeight: "var(--leading-normal)", opacity: 0.9 }}>
            {children}
          </div>
        )}
      </div>
      {onClose && (
        <button onClick={onClose} aria-label="Dismiss" style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 20, height: 20, padding: 0, border: "none", background: "transparent",
          color: "inherit", opacity: 0.6, cursor: "pointer", flexShrink: 0,
        }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M1 1L10 10M10 1L1 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

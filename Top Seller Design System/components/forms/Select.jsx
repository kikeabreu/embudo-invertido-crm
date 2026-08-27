import React from "react";

/**
 * Top Seller — Select (native, brand-styled)
 */
export function Select({
  size = "md",
  invalid = false,
  disabled = false,
  children,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const heights = { sm: "var(--control-sm)", md: "var(--control-md)", lg: "var(--control-lg)" };
  const fonts = { sm: "var(--text-sm)", md: "var(--text-base)", lg: "var(--text-lg)" };

  const borderColor = invalid
    ? "var(--ts-danger)"
    : focus
    ? "var(--border-brand)"
    : "var(--border-default)";

  return (
    <div style={{ position: "relative", display: "inline-flex", width: "100%", ...style }}>
      <select
        disabled={disabled}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          width: "100%",
          height: heights[size],
          padding: "0 38px 0 14px",
          font: "inherit",
          fontFamily: "var(--font-body)",
          fontSize: fonts[size],
          color: "var(--text-strong)",
          background: disabled ? "var(--ts-ink-50)" : "var(--surface-card)",
          border: `1px solid ${borderColor}`,
          borderRadius: "var(--radius-md)",
          boxShadow: focus ? "var(--ring)" : "none",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
          transition: "border-color var(--transition), box-shadow var(--transition)",
        }}
        {...rest}
      >
        {children}
      </select>
      <span style={{
        position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
        pointerEvents: "none", display: "inline-flex", color: "var(--text-muted)",
      }}>
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}

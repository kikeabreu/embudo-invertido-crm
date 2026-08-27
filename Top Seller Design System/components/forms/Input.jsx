import React from "react";

/**
 * Top Seller — Input
 */
export function Input({
  size = "md",
  invalid = false,
  iconLeft = null,
  disabled = false,
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        height: heights[size],
        padding: iconLeft ? "0 14px 0 12px" : "0 14px",
        background: disabled ? "var(--ts-ink-50)" : "var(--surface-card)",
        border: `1px solid ${borderColor}`,
        borderRadius: "var(--radius-md)",
        boxShadow: focus ? "var(--ring)" : "none",
        transition: "border-color var(--transition), box-shadow var(--transition)",
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      {iconLeft && (
        <span style={{ display: "inline-flex", color: "var(--text-faint)", flexShrink: 0 }}>
          {iconLeft}
        </span>
      )}
      <input
        disabled={disabled}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          flex: 1,
          minWidth: 0,
          border: "none",
          outline: "none",
          background: "transparent",
          font: "inherit",
          fontFamily: "var(--font-body)",
          fontSize: fonts[size],
          color: "var(--text-strong)",
        }}
        {...rest}
      />
    </div>
  );
}

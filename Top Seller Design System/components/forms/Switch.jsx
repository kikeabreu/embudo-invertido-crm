import React from "react";

/**
 * Top Seller — Switch (toggle)
 */
export function Switch({
  checked = false,
  onChange,
  disabled = false,
  size = "md",
  style = {},
  ...rest
}) {
  const dims = size === "sm"
    ? { w: 36, h: 20, knob: 14 }
    : { w: 46, h: 26, knob: 20 };
  const pad = (dims.h - dims.knob) / 2;

  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange && onChange(!checked)}
      style={{
        position: "relative",
        width: dims.w,
        height: dims.h,
        flexShrink: 0,
        padding: 0,
        border: "none",
        borderRadius: "var(--radius-pill)",
        background: checked ? "var(--action-primary)" : "var(--ts-ink-300)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "background var(--transition)",
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          position: "absolute",
          top: pad,
          left: checked ? dims.w - dims.knob - pad : pad,
          width: dims.knob,
          height: dims.knob,
          borderRadius: "50%",
          background: "var(--ts-white)",
          boxShadow: "var(--shadow-sm)",
          transition: "left var(--transition)",
        }}
      />
    </button>
  );
}

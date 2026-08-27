import React from "react";

/**
 * Top Seller — Card
 * Clean surface with a hairline border + soft shadow. Optional
 * brand variant flips to morado with light text.
 */
export function Card({
  children,
  variant = "default",   // default | brand | inverse | accent-edge
  padding = "lg",
  interactive = false,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);

  const pads = { none: 0, sm: "var(--space-4)", md: "var(--space-5)", lg: "var(--space-6)", xl: "var(--space-8)" };

  const variants = {
    default: {
      background: "var(--surface-card)",
      color: "var(--text-body)",
      border: "1px solid var(--border-subtle)",
    },
    brand: {
      background: "var(--surface-brand)",
      color: "var(--text-on-brand)",
      border: "1px solid transparent",
    },
    inverse: {
      background: "var(--surface-inverse)",
      color: "var(--ts-ink-100)",
      border: "1px solid transparent",
    },
    "accent-edge": {
      background: "var(--surface-card)",
      color: "var(--text-body)",
      border: "1px solid var(--border-subtle)",
      borderTop: "3px solid var(--ts-orange)",
    },
  };
  const v = variants[variant] || variants.default;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: "var(--radius-lg)",
        padding: pads[padding],
        boxShadow: interactive && hover ? "var(--shadow-lg)" : "var(--shadow-sm)",
        transform: interactive && hover ? "translateY(-2px)" : "none",
        transition: "box-shadow var(--transition), transform var(--transition)",
        cursor: interactive ? "pointer" : "default",
        ...v,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

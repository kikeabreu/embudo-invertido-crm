/* @ds-bundle: {"format":4,"namespace":"TopSellerDesignSystem_57ba3c","components":[{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Progress","sourcePath":"components/display/Progress.jsx"},{"name":"Stat","sourcePath":"components/display/Stat.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Tabs","sourcePath":"components/feedback/Tabs.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"}],"sourceHashes":{"components/brand/Logo.jsx":"ba3e44cd66db","components/buttons/Button.jsx":"ce3856319887","components/buttons/IconButton.jsx":"46adc962dad5","components/display/Avatar.jsx":"837da3f5ec1f","components/display/Badge.jsx":"d04a2a68748b","components/display/Card.jsx":"4511ed53783b","components/display/Progress.jsx":"ec43e9c71aea","components/display/Stat.jsx":"f1e4ca8f0888","components/display/Tag.jsx":"a624b3072a29","components/feedback/Alert.jsx":"422fd312d2c7","components/feedback/Tabs.jsx":"8505979df803","components/forms/Checkbox.jsx":"5cf13a39d732","components/forms/Input.jsx":"e514f1922558","components/forms/Select.jsx":"a60efdf90e1b","components/forms/Switch.jsx":"648cb169a004","ui_kits/sales-platform/AppShell.jsx":"44132781b95d","ui_kits/sales-platform/DashboardScreen.jsx":"11289dac5451","ui_kits/sales-platform/Icons.jsx":"d8e7b423dd8b","ui_kits/sales-platform/LoginScreen.jsx":"2e1358c50bc4","ui_kits/sales-platform/PipelineScreen.jsx":"ed748435fe32","ui_kits/sistema-referente/Sections.jsx":"5f5b76016fbe"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TopSellerDesignSystem_57ba3c = window.TopSellerDesignSystem_57ba3c || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Top Seller — Logo
 * Renders the official wordmark or the fox mark from brand PNGs.
 * Color variants map to the supplied logo files; no recoloring via CSS.
 */
function Logo({
  variant = "wordmark",
  // "wordmark" | "mark"
  color = "purple",
  // "purple" | "black" | "white" | "orange"
  height,
  assetBase = "/assets/logos",
  alt = "Top Seller",
  style = {},
  ...rest
}) {
  const file = variant === "mark" ? `topseller-mark-${color}.png` : `topseller-wordmark-${color}.png`;
  const defaultHeight = variant === "mark" ? 40 : 28;
  return /*#__PURE__*/React.createElement("img", _extends({
    src: `${assetBase}/${file}`,
    alt: alt,
    style: {
      height: height || defaultHeight,
      width: "auto",
      display: "block",
      userSelect: "none",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Top Seller — Button
 * Geometric, confident actions. Primary = morado, accent = naranja.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  disabled = false,
  type = "button",
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const sizes = {
    sm: {
      height: "var(--control-sm)",
      padding: "0 14px",
      font: "var(--text-sm)",
      gap: "6px"
    },
    md: {
      height: "var(--control-md)",
      padding: "0 20px",
      font: "var(--text-base)",
      gap: "8px"
    },
    lg: {
      height: "var(--control-lg)",
      padding: "0 28px",
      font: "var(--text-lg)",
      gap: "10px"
    }
  };
  const s = sizes[size] || sizes.md;
  const palettes = {
    primary: {
      bg: hover ? "var(--action-primary-hover)" : "var(--action-primary)",
      color: "var(--text-on-brand)",
      border: "1px solid transparent",
      shadow: hover ? "var(--shadow-brand-md)" : "var(--shadow-brand-sm)"
    },
    accent: {
      bg: hover ? "var(--action-accent-hover)" : "var(--action-accent)",
      color: "var(--text-on-accent)",
      border: "1px solid transparent",
      shadow: hover ? "var(--shadow-md)" : "var(--shadow-accent-sm)"
    },
    secondary: {
      bg: hover ? "var(--ts-ink-50)" : "var(--surface-card)",
      color: "var(--text-strong)",
      border: "1px solid var(--border-default)",
      shadow: "var(--shadow-xs)"
    },
    ghost: {
      bg: hover ? "var(--surface-brand-soft)" : "transparent",
      color: "var(--text-brand)",
      border: "1px solid transparent",
      shadow: "none"
    },
    inverse: {
      bg: hover ? "var(--ts-ink-800)" : "var(--surface-inverse)",
      color: "var(--ts-white)",
      border: "1px solid transparent",
      shadow: "var(--shadow-sm)"
    }
  };
  const p = palettes[variant] || palettes.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: s.gap,
      width: fullWidth ? "100%" : "auto",
      height: s.height,
      padding: s.padding,
      font: "inherit",
      fontFamily: "var(--font-display)",
      fontWeight: "var(--weight-black)",
      fontSize: s.font,
      letterSpacing: "0.01em",
      lineHeight: 1,
      color: p.color,
      background: p.bg,
      border: p.border,
      borderRadius: "var(--radius-md)",
      boxShadow: disabled ? "none" : p.shadow,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      transform: active && !disabled ? "translateY(1px) scale(0.99)" : "translateY(0)",
      transition: "background var(--transition), box-shadow var(--transition), transform var(--dur-fast) var(--ease-out)",
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex"
    }
  }, iconLeft), children, iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex"
    }
  }, iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Top Seller — IconButton
 * Square action for toolbars and compact UIs.
 */
function IconButton({
  children,
  variant = "secondary",
  size = "md",
  disabled = false,
  "aria-label": ariaLabel,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const dims = {
    sm: 32,
    md: 40,
    lg: 48
  }[size] || 40;
  const palettes = {
    primary: {
      bg: hover ? "var(--action-primary-hover)" : "var(--action-primary)",
      color: "var(--text-on-brand)",
      border: "1px solid transparent"
    },
    accent: {
      bg: hover ? "var(--action-accent-hover)" : "var(--action-accent)",
      color: "var(--text-on-accent)",
      border: "1px solid transparent"
    },
    secondary: {
      bg: hover ? "var(--ts-ink-50)" : "var(--surface-card)",
      color: "var(--text-strong)",
      border: "1px solid var(--border-default)"
    },
    ghost: {
      bg: hover ? "var(--surface-brand-soft)" : "transparent",
      color: "var(--text-brand)",
      border: "1px solid transparent"
    }
  };
  const p = palettes[variant] || palettes.secondary;
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": ariaLabel,
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: dims,
      height: dims,
      color: p.color,
      background: p.bg,
      border: p.border,
      borderRadius: "var(--radius-md)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      transform: active && !disabled ? "scale(0.94)" : "scale(1)",
      transition: "background var(--transition), transform var(--dur-fast) var(--ease-out)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/display/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Top Seller — Avatar
 * Image or initials. Falls back to a brand-tinted monogram.
 */
function Avatar({
  src,
  name = "",
  size = "md",
  tone = "purple",
  style = {},
  ...rest
}) {
  const dims = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 72
  }[size] || 40;
  const initials = name.split(" ").map(p => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  const tones = {
    purple: {
      bg: "var(--ts-purple-100)",
      color: "var(--ts-purple-700)"
    },
    orange: {
      bg: "var(--ts-orange-100)",
      color: "var(--ts-orange-700)"
    },
    ink: {
      bg: "var(--ts-ink-200)",
      color: "var(--ts-ink-700)"
    }
  };
  const t = tones[tone] || tones.purple;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
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
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initials || "?");
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Top Seller — Badge
 * Small status/label pill. Solid + soft tones across the palette.
 */
function Badge({
  children,
  tone = "purple",
  // purple | orange | neutral | success | warning | danger
  variant = "soft",
  // soft | solid | outline
  size = "md",
  dot = false,
  style = {},
  ...rest
}) {
  const tones = {
    purple: {
      solid: "var(--ts-purple)",
      soft: "var(--ts-purple-50)",
      text: "var(--ts-purple-700)",
      on: "#fff"
    },
    orange: {
      solid: "var(--ts-orange)",
      soft: "var(--ts-orange-50)",
      text: "var(--ts-orange-700)",
      on: "#fff"
    },
    neutral: {
      solid: "var(--ts-ink-700)",
      soft: "var(--ts-ink-100)",
      text: "var(--ts-ink-700)",
      on: "#fff"
    },
    success: {
      solid: "var(--ts-success)",
      soft: "var(--ts-success-bg)",
      text: "var(--ts-success)",
      on: "#fff"
    },
    warning: {
      solid: "var(--ts-warning)",
      soft: "var(--ts-warning-bg)",
      text: "#9A6510",
      on: "#fff"
    },
    danger: {
      solid: "var(--ts-danger)",
      soft: "var(--ts-danger-bg)",
      text: "var(--ts-danger)",
      on: "#fff"
    }
  };
  const t = tones[tone] || tones.purple;
  const styles = {
    soft: {
      background: t.soft,
      color: t.text,
      border: "1px solid transparent"
    },
    solid: {
      background: t.solid,
      color: t.on,
      border: "1px solid transparent"
    },
    outline: {
      background: "transparent",
      color: t.text,
      border: `1px solid ${t.solid}`
    }
  }[variant];
  const sz = size === "sm" ? {
    padding: "2px 8px",
    font: "var(--text-2xs)"
  } : {
    padding: "4px 10px",
    font: "var(--text-xs)"
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
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
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: variant === "solid" ? t.on : t.solid
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Top Seller — Card
 * Clean surface with a hairline border + soft shadow. Optional
 * brand variant flips to morado with light text.
 */
function Card({
  children,
  variant = "default",
  // default | brand | inverse | accent-edge
  padding = "lg",
  interactive = false,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const pads = {
    none: 0,
    sm: "var(--space-4)",
    md: "var(--space-5)",
    lg: "var(--space-6)",
    xl: "var(--space-8)"
  };
  const variants = {
    default: {
      background: "var(--surface-card)",
      color: "var(--text-body)",
      border: "1px solid var(--border-subtle)"
    },
    brand: {
      background: "var(--surface-brand)",
      color: "var(--text-on-brand)",
      border: "1px solid transparent"
    },
    inverse: {
      background: "var(--surface-inverse)",
      color: "var(--ts-ink-100)",
      border: "1px solid transparent"
    },
    "accent-edge": {
      background: "var(--surface-card)",
      color: "var(--text-body)",
      border: "1px solid var(--border-subtle)",
      borderTop: "3px solid var(--ts-orange)"
    }
  };
  const v = variants[variant] || variants.default;
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      borderRadius: "var(--radius-lg)",
      padding: pads[padding],
      boxShadow: interactive && hover ? "var(--shadow-lg)" : "var(--shadow-sm)",
      transform: interactive && hover ? "translateY(-2px)" : "none",
      transition: "box-shadow var(--transition), transform var(--transition)",
      cursor: interactive ? "pointer" : "default",
      ...v,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Progress.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Top Seller — Progress (linear)
 */
function Progress({
  value = 0,
  max = 100,
  tone = "purple",
  // purple | orange | success
  size = "md",
  showLabel = false,
  style = {},
  ...rest
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  const h = size === "sm" ? 6 : size === "lg" ? 12 : 8;
  const fills = {
    purple: "var(--ts-purple)",
    orange: "var(--ts-orange)",
    success: "var(--ts-success)"
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: h,
      borderRadius: "var(--radius-pill)",
      background: "var(--ts-ink-100)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: "100%",
      borderRadius: "var(--radius-pill)",
      background: fills[tone] || fills.purple,
      transition: "width var(--dur-slow) var(--ease-out)"
    }
  })), showLabel && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: "var(--weight-black)",
      fontSize: "var(--text-xs)",
      color: "var(--text-muted)",
      minWidth: 34,
      textAlign: "right"
    }
  }, Math.round(pct), "%"));
}
Object.assign(__ds_scope, { Progress });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Progress.jsx", error: String((e && e.message) || e) }); }

// components/display/Stat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Top Seller — Stat
 * KPI display with optional delta. Used across sales dashboards.
 */
function Stat({
  label,
  value,
  delta,
  trend = "up",
  // up | down | flat
  icon = null,
  style = {},
  ...rest
}) {
  const trendColor = trend === "up" ? "var(--ts-success)" : trend === "down" ? "var(--ts-danger)" : "var(--text-muted)";
  const arrow = trend === "up" ? "▲" : trend === "down" ? "▼" : "—";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px"
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 28,
      height: 28,
      borderRadius: "var(--radius-sm)",
      background: "var(--surface-brand-soft)",
      color: "var(--text-brand)"
    }
  }, icon), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: "var(--weight-black)",
      fontSize: "var(--text-2xs)",
      letterSpacing: "var(--tracking-eyebrow)",
      textTransform: "uppercase",
      color: "var(--text-muted)"
    }
  }, label)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: "var(--weight-black)",
      fontSize: "var(--text-display-md)",
      lineHeight: 1,
      letterSpacing: "var(--tracking-tight)",
      color: "var(--text-strong)"
    }
  }, value), delta != null && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-bold)",
      fontFamily: "var(--font-display)",
      color: trendColor
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "0.7em"
    }
  }, arrow), delta));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Stat.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Top Seller — Tag (removable chip)
 */
function Tag({
  children,
  onRemove,
  tone = "neutral",
  style = {},
  ...rest
}) {
  const tones = {
    neutral: {
      bg: "var(--ts-ink-100)",
      color: "var(--ts-ink-700)"
    },
    purple: {
      bg: "var(--ts-purple-50)",
      color: "var(--ts-purple-700)"
    },
    orange: {
      bg: "var(--ts-orange-50)",
      color: "var(--ts-orange-700)"
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
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
      ...style
    }
  }, rest), children, onRemove && /*#__PURE__*/React.createElement("button", {
    onClick: onRemove,
    "aria-label": "Remove",
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 16,
      height: 16,
      padding: 0,
      border: "none",
      cursor: "pointer",
      borderRadius: "50%",
      background: "transparent",
      color: "inherit",
      opacity: 0.65
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "9",
    viewBox: "0 0 9 9",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1L8 8M8 1L1 8",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }))));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Top Seller — Alert
 */
function Alert({
  children,
  title,
  tone = "info",
  // info | success | warning | danger
  onClose,
  icon = null,
  style = {},
  ...rest
}) {
  const tones = {
    info: {
      bg: "var(--ts-info-bg)",
      bar: "var(--ts-purple)",
      text: "var(--ts-purple-800)"
    },
    success: {
      bg: "var(--ts-success-bg)",
      bar: "var(--ts-success)",
      text: "#0F5A3C"
    },
    warning: {
      bg: "var(--ts-warning-bg)",
      bar: "var(--ts-warning)",
      text: "#8A5A0F"
    },
    danger: {
      bg: "var(--ts-danger-bg)",
      bar: "var(--ts-danger)",
      text: "#A52A22"
    }
  };
  const t = tones[tone] || tones.info;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "alert",
    style: {
      display: "flex",
      gap: "12px",
      padding: "14px 16px",
      background: t.bg,
      borderRadius: "var(--radius-md)",
      borderLeft: `3px solid ${t.bar}`,
      color: t.text,
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      flexShrink: 0,
      marginTop: 1
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: "var(--weight-black)",
      fontSize: "var(--text-sm)",
      marginBottom: children ? 2 : 0
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      lineHeight: "var(--leading-normal)",
      opacity: 0.9
    }
  }, children)), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Dismiss",
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 20,
      height: 20,
      padding: 0,
      border: "none",
      background: "transparent",
      color: "inherit",
      opacity: 0.6,
      cursor: "pointer",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 11 11",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1L10 10M10 1L1 10",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round"
  }))));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Top Seller — Tabs
 * Controlled or uncontrolled. Active tab gets an orange underline.
 */
function Tabs({
  tabs = [],
  // [{ id, label, badge? }]
  value,
  defaultValue,
  onChange,
  style = {},
  ...rest
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? (tabs[0] && tabs[0].id));
  const active = value !== undefined ? value : internal;
  const select = id => {
    if (value === undefined) setInternal(id);
    onChange && onChange(id);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      gap: "4px",
      borderBottom: "1px solid var(--border-subtle)",
      ...style
    }
  }, rest), tabs.map(tab => {
    const on = tab.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: tab.id,
      onClick: () => select(tab.id),
      style: {
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 16px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontFamily: "var(--font-display)",
        fontWeight: "var(--weight-black)",
        fontSize: "var(--text-sm)",
        color: on ? "var(--text-strong)" : "var(--text-muted)",
        transition: "color var(--transition)"
      }
    }, tab.label, tab.badge != null && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "var(--text-2xs)",
        padding: "1px 7px",
        borderRadius: "var(--radius-pill)",
        background: on ? "var(--ts-purple-100)" : "var(--ts-ink-100)",
        color: on ? "var(--ts-purple-700)" : "var(--text-muted)"
      }
    }, tab.badge), /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: 12,
        right: 12,
        bottom: -1,
        height: 3,
        borderRadius: "3px 3px 0 0",
        background: on ? "var(--ts-orange)" : "transparent",
        transition: "background var(--transition)"
      }
    }));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Top Seller — Checkbox
 */
function Checkbox({
  checked = false,
  onChange,
  label,
  disabled = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      fontFamily: "var(--font-body)",
      fontSize: "var(--text-sm)",
      color: "var(--text-body)",
      userSelect: "none",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", _extends({
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 20,
      height: 20,
      flexShrink: 0,
      borderRadius: "var(--radius-xs)",
      border: checked ? "1px solid var(--action-primary)" : "1px solid var(--border-default)",
      background: checked ? "var(--action-primary)" : "var(--surface-card)",
      transition: "background var(--transition), border-color var(--transition)"
    }
  }, rest), checked && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2.5 6.2L5 8.7L9.6 3.5",
    stroke: "white",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Top Seller — Input
 */
function Input({
  size = "md",
  invalid = false,
  iconLeft = null,
  disabled = false,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const heights = {
    sm: "var(--control-sm)",
    md: "var(--control-md)",
    lg: "var(--control-lg)"
  };
  const fonts = {
    sm: "var(--text-sm)",
    md: "var(--text-base)",
    lg: "var(--text-lg)"
  };
  const borderColor = invalid ? "var(--ts-danger)" : focus ? "var(--border-brand)" : "var(--border-default)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
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
      ...style
    }
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      color: "var(--text-faint)",
      flexShrink: 0
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: "none",
      outline: "none",
      background: "transparent",
      font: "inherit",
      fontFamily: "var(--font-body)",
      fontSize: fonts[size],
      color: "var(--text-strong)"
    }
  }, rest)));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Top Seller — Select (native, brand-styled)
 */
function Select({
  size = "md",
  invalid = false,
  disabled = false,
  children,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const heights = {
    sm: "var(--control-sm)",
    md: "var(--control-md)",
    lg: "var(--control-lg)"
  };
  const fonts = {
    sm: "var(--text-sm)",
    md: "var(--text-base)",
    lg: "var(--text-lg)"
  };
  const borderColor = invalid ? "var(--ts-danger)" : focus ? "var(--border-brand)" : "var(--border-default)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "inline-flex",
      width: "100%",
      ...style
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
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
      transition: "border-color var(--transition), box-shadow var(--transition)"
    }
  }, rest), children), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 14,
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
      display: "inline-flex",
      color: "var(--text-muted)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "8",
    viewBox: "0 0 12 8",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1.5L6 6.5L11 1.5",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Top Seller — Switch (toggle)
 */
function Switch({
  checked = false,
  onChange,
  disabled = false,
  size = "md",
  style = {},
  ...rest
}) {
  const dims = size === "sm" ? {
    w: 36,
    h: 20,
    knob: 14
  } : {
    w: 46,
    h: 26,
    knob: 20
  };
  const pad = (dims.h - dims.knob) / 2;
  return /*#__PURE__*/React.createElement("button", _extends({
    role: "switch",
    "aria-checked": checked,
    disabled: disabled,
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
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
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: pad,
      left: checked ? dims.w - dims.knob - pad : pad,
      width: dims.knob,
      height: dims.knob,
      borderRadius: "50%",
      background: "var(--ts-white)",
      boxShadow: "var(--shadow-sm)",
      transition: "left var(--transition)"
    }
  }));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sales-platform/AppShell.jsx
try { (() => {
/* Top Seller — App shell: sidebar + topbar. Composes DS primitives. */
(function () {
  const DS = window.TopSellerDesignSystem_57ba3c;
  const I = window.TSIcons;
  const {
    Avatar,
    Badge,
    Input,
    IconButton
  } = DS;
  const NAV = [{
    id: "dashboard",
    label: "Dashboard",
    icon: I.Dashboard
  }, {
    id: "pipeline",
    label: "Pipeline",
    icon: I.Pipeline,
    badge: "24"
  }, {
    id: "leads",
    label: "Leads",
    icon: I.Leads,
    badge: "8"
  }, {
    id: "reports",
    label: "Reports",
    icon: I.Reports
  }, {
    id: "inbox",
    label: "Inbox",
    icon: I.Inbox
  }];
  function Sidebar({
    active,
    onNavigate
  }) {
    return /*#__PURE__*/React.createElement("aside", {
      style: {
        width: 248,
        flexShrink: 0,
        height: "100%",
        boxSizing: "border-box",
        background: "var(--ts-black)",
        color: "var(--ts-ink-300)",
        display: "flex",
        flexDirection: "column",
        padding: "22px 16px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 11,
        padding: "0 8px 22px"
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/logos/topseller-mark-white.png",
      style: {
        height: 30
      },
      alt: ""
    }), /*#__PURE__*/React.createElement("img", {
      src: "../../assets/logos/topseller-wordmark-white.png",
      style: {
        height: 16
      },
      alt: "Top Seller"
    })), /*#__PURE__*/React.createElement("nav", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 3
      }
    }, NAV.map(n => {
      const on = n.id === active;
      return /*#__PURE__*/React.createElement("button", {
        key: n.id,
        onClick: () => onNavigate(n.id),
        style: {
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 12px",
          border: "none",
          borderRadius: "var(--radius-md)",
          cursor: "pointer",
          textAlign: "left",
          width: "100%",
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: 14,
          color: on ? "#fff" : "var(--ts-ink-400)",
          backgroundColor: on ? "#7060D8" : "transparent"
        }
      }, /*#__PURE__*/React.createElement(n.icon, {
        size: 18
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          flex: 1
        }
      }, n.label), n.badge && /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          padding: "1px 7px",
          borderRadius: 999,
          background: on ? "rgba(255,255,255,.22)" : "var(--ts-ink-800)",
          color: on ? "#fff" : "var(--ts-ink-300)"
        }
      }, n.badge));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 3
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onNavigate("settings"),
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 12px",
        border: "none",
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        width: "100%",
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 14,
        color: "var(--ts-ink-400)",
        background: "transparent",
        textAlign: "left"
      }
    }, /*#__PURE__*/React.createElement(I.Settings, {
      size: 18
    }), /*#__PURE__*/React.createElement("span", null, "Settings")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 11,
        padding: "10px 8px",
        marginTop: 6,
        borderTop: "1px solid var(--ts-ink-800)"
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: "Diego Mora",
      tone: "orange",
      size: "sm"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        lineHeight: 1.25,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: "#fff",
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 13
      }
    }, "Diego Mora"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--ts-ink-500)"
      }
    }, "Account Executive")))));
  }
  function Topbar({
    title,
    subtitle,
    actions
  }) {
    return /*#__PURE__*/React.createElement("header", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "20px 28px",
        borderBottom: "1px solid var(--border-subtle)",
        background: "var(--surface-card)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 22
      }
    }, title), subtitle && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: "var(--text-muted)",
        marginTop: 2
      }
    }, subtitle)), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 240
      }
    }, /*#__PURE__*/React.createElement(Input, {
      iconLeft: /*#__PURE__*/React.createElement(I.Search, {
        size: 15
      }),
      placeholder: "Search\u2026",
      size: "sm"
    })), /*#__PURE__*/React.createElement(IconButton, {
      variant: "secondary",
      "aria-label": "Notifications"
    }, /*#__PURE__*/React.createElement(I.Bell, {
      size: 18
    })), actions);
  }
  window.TSShell = {
    Sidebar,
    Topbar,
    NAV
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sales-platform/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sales-platform/DashboardScreen.jsx
try { (() => {
/* Top Seller — Dashboard screen. Composes DS primitives + Stat/Card/Progress. */
(function () {
  const DS = window.TopSellerDesignSystem_57ba3c;
  const I = window.TSIcons;
  const {
    Card,
    Stat,
    Progress,
    Badge,
    Button,
    Avatar
  } = DS;
  const DEALS = [{
    name: "Acme Corp — Annual",
    owner: "Ana Ríos",
    value: "$24,000",
    stage: "Proposal",
    tone: "purple",
    pct: 70
  }, {
    name: "Lunar Retail rollout",
    owner: "Beto Luna",
    value: "$12,400",
    stage: "Negotiation",
    tone: "orange",
    pct: 85
  }, {
    name: "Vela Logistics",
    owner: "Carmen Díaz",
    value: "$8,900",
    stage: "Qualified",
    tone: "neutral",
    pct: 40
  }, {
    name: "Nimbus SaaS",
    owner: "Diego Mora",
    value: "$31,200",
    stage: "Won",
    tone: "success",
    pct: 100
  }];
  function DashboardScreen() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 28,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        background: "var(--surface-sunken)",
        minHeight: "100%",
        boxSizing: "border-box"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "md"
    }, /*#__PURE__*/React.createElement(Stat, {
      label: "Revenue (MTD)",
      value: "$148k",
      delta: "12.4%",
      trend: "up",
      icon: /*#__PURE__*/React.createElement(I.Bolt, {
        size: 15
      })
    })), /*#__PURE__*/React.createElement(Card, {
      padding: "md"
    }, /*#__PURE__*/React.createElement(Stat, {
      label: "Open deals",
      value: "24",
      delta: "3",
      trend: "up",
      icon: /*#__PURE__*/React.createElement(I.Pipeline, {
        size: 15
      })
    })), /*#__PURE__*/React.createElement(Card, {
      padding: "md"
    }, /*#__PURE__*/React.createElement(Stat, {
      label: "Win rate",
      value: "34%",
      delta: "2.1%",
      trend: "down",
      icon: /*#__PURE__*/React.createElement(I.Target, {
        size: 15
      })
    })), /*#__PURE__*/React.createElement(Card, {
      variant: "brand",
      padding: "md"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement(I.Trophy, {
      size: 16
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 11,
        letterSpacing: ".14em",
        textTransform: "uppercase",
        opacity: .9
      }
    }, "Quota")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 34,
        lineHeight: 1
      }
    }, "82%"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement(Progress, {
      value: 82,
      tone: "orange"
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1.7fr 1fr",
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "none"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        borderBottom: "1px solid var(--border-subtle)"
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 16
      }
    }, "Deals in motion"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      iconRight: /*#__PURE__*/React.createElement(I.Arrow, {
        size: 15
      })
    }, "View all")), /*#__PURE__*/React.createElement("div", null, DEALS.map((d, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "13px 20px",
        borderBottom: i < DEALS.length - 1 ? "1px solid var(--border-subtle)" : "none"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 14,
        color: "var(--text-strong)"
      }
    }, d.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: "var(--text-muted)",
        marginTop: 2
      }
    }, d.owner)), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 120
      }
    }, /*#__PURE__*/React.createElement(Progress, {
      value: d.pct,
      tone: d.tone === "orange" ? "orange" : d.tone === "success" ? "success" : "purple"
    })), /*#__PURE__*/React.createElement(Badge, {
      tone: d.tone,
      size: "sm"
    }, d.stage), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 78,
        textAlign: "right",
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 14,
        color: "var(--text-strong)"
      }
    }, d.value))))), /*#__PURE__*/React.createElement(Card, {
      padding: "none"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "16px 20px",
        borderBottom: "1px solid var(--border-subtle)"
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 16
      }
    }, "Team leaderboard")), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "6px 12px"
      }
    }, [["Ana Ríos", "$92k", 1], ["Diego Mora", "$78k", 2], ["Beto Luna", "$61k", 3], ["Carmen Díaz", "$54k", 4]].map(([n, v, r]) => /*#__PURE__*/React.createElement("div", {
      key: n,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 8px"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 20,
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 13,
        color: r === 1 ? "var(--ts-orange)" : "var(--text-faint)"
      }
    }, r), /*#__PURE__*/React.createElement(Avatar, {
      name: n,
      tone: r === 1 ? "orange" : "purple",
      size: "sm"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 13,
        color: "var(--text-strong)"
      }
    }, n), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: "var(--text-muted)",
        fontVariantNumeric: "tabular-nums"
      }
    }, v)))))));
  }
  window.TSDashboard = DashboardScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sales-platform/DashboardScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sales-platform/Icons.jsx
try { (() => {
/* Top Seller — thin geometric line icons, matching the line-art fox mark.
   Stroke 1.75, round caps. Registered on window for the UI kit screens. */
(function () {
  const S = ({
    children,
    size = 18,
    style
  }) => React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style
  }, children);
  const P = d => React.createElement("path", {
    d
  });
  const make = (...parts) => props => React.createElement(S, props, parts.map((p, i) => React.cloneElement(p, {
    key: i
  })));
  const Icons = {
    Dashboard: make(P("M3 3h7v7H3z"), P("M14 3h7v4h-7z"), P("M14 11h7v10h-7z"), P("M3 14h7v7H3z")),
    Pipeline: make(P("M3 6h18"), P("M6 12h12"), P("M9 18h6")),
    Leads: make(React.createElement("circle", {
      cx: 9,
      cy: 8,
      r: 3.2
    }), P("M3.5 19a5.5 5.5 0 0 1 11 0"), P("M17 8h4"), P("M17 12h4")),
    Reports: make(P("M4 20V10"), P("M10 20V4"), P("M16 20v-7"), P("M22 20H2")),
    Inbox: make(P("M3 13l3-8h12l3 8"), P("M3 13v6h18v-6"), P("M3 13h5l1.5 2.5h5L21 13")),
    Settings: make(React.createElement("circle", {
      cx: 12,
      cy: 12,
      r: 3
    }), P("M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1")),
    Search: make(React.createElement("circle", {
      cx: 11,
      cy: 11,
      r: 7
    }), P("M21 21l-4-4")),
    Plus: make(P("M12 5v14M5 12h14")),
    Bell: make(P("M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"), P("M13.7 21a2 2 0 0 1-3.4 0")),
    Bolt: make(P("M13 2L4 14h7l-1 8 9-12h-7l1-8z")),
    Trophy: make(P("M7 4h10v5a5 5 0 0 1-10 0z"), P("M7 6H4v1a3 3 0 0 0 3 3"), P("M17 6h3v1a3 3 0 0 1-3 3"), P("M10 14h4M9 20h6M12 17v3")),
    Phone: make(P("M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z")),
    Mail: make(P("M3 6h18v12H3z"), P("M3 7l9 6 9-6")),
    Arrow: make(P("M5 12h14M13 6l6 6-6 6")),
    Check: make(P("M4 12l5 5L20 6")),
    Filter: make(P("M3 5h18l-7 8v5l-4 2v-7z")),
    Dots: make(React.createElement("circle", {
      cx: 5,
      cy: 12,
      r: 1.4
    }), React.createElement("circle", {
      cx: 12,
      cy: 12,
      r: 1.4
    }), React.createElement("circle", {
      cx: 19,
      cy: 12,
      r: 1.4
    })),
    Calendar: make(P("M4 6h16v15H4z"), P("M4 10h16M8 3v4M16 3v4")),
    Target: make(React.createElement("circle", {
      cx: 12,
      cy: 12,
      r: 8
    }), React.createElement("circle", {
      cx: 12,
      cy: 12,
      r: 4
    }), React.createElement("circle", {
      cx: 12,
      cy: 12,
      r: 1
    })),
    TrendUp: make(P("M3 17l6-6 4 4 8-8"), P("M15 7h6v6"))
  };
  window.TSIcons = Icons;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sales-platform/Icons.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sales-platform/LoginScreen.jsx
try { (() => {
/* Top Seller — Login screen. */
(function () {
  const DS = window.TopSellerDesignSystem_57ba3c;
  const I = window.TSIcons;
  const {
    Button,
    Input,
    Checkbox
  } = DS;
  function LoginScreen({
    onLogin
  }) {
    const [email, setEmail] = React.useState("diego@topseller.io");
    const submit = e => {
      e && e.preventDefault();
      onLogin();
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        height: "100vh"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: "0 0 46%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--surface-card)",
        padding: 40
      }
    }, /*#__PURE__*/React.createElement("form", {
      onSubmit: submit,
      style: {
        width: 360
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/logos/topseller-wordmark-purple.png",
      style: {
        height: 26
      },
      alt: "Top Seller"
    }), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 30,
        margin: "28px 0 6px"
      }
    }, "Close more, faster."), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 15,
        color: "var(--text-muted)",
        margin: "0 0 26px"
      }
    }, "Sign in to your sales workspace."), /*#__PURE__*/React.createElement("label", {
      style: {
        display: "block",
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 13,
        marginBottom: 7
      }
    }, "Work email"), /*#__PURE__*/React.createElement(Input, {
      iconLeft: /*#__PURE__*/React.createElement(I.Mail, {
        size: 15
      }),
      value: email,
      onChange: e => setEmail(e.target.value),
      style: {
        marginBottom: 16
      }
    }), /*#__PURE__*/React.createElement("label", {
      style: {
        display: "block",
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 13,
        marginBottom: 7
      }
    }, "Password"), /*#__PURE__*/React.createElement(Input, {
      type: "password",
      defaultValue: "password",
      style: {
        marginBottom: 18
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 22
      }
    }, /*#__PURE__*/React.createElement(Checkbox, {
      checked: true,
      label: "Remember me"
    }), /*#__PURE__*/React.createElement("a", {
      href: "#",
      onClick: e => e.preventDefault(),
      style: {
        fontSize: 13,
        fontWeight: 700
      }
    }, "Forgot?")), /*#__PURE__*/React.createElement(Button, {
      type: "submit",
      variant: "primary",
      fullWidth: true,
      iconRight: /*#__PURE__*/React.createElement(I.Arrow, {
        size: 16
      }),
      onClick: submit
    }, "Sign in"))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        position: "relative",
        background: "var(--ts-black)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 56,
        color: "#fff"
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/logos/topseller-mark-purple.png",
      alt: "",
      style: {
        position: "absolute",
        right: -80,
        top: -40,
        height: 520,
        opacity: .22
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "ts-eyebrow",
      style: {
        color: "var(--ts-orange)"
      }
    }, "Sales intelligence"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 40,
        lineHeight: 1.05,
        letterSpacing: "-.02em",
        margin: "14px 0 18px",
        maxWidth: 420
      }
    }, "The cunning edge for high-performing teams."), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 16,
        color: "var(--ts-ink-300)",
        maxWidth: 380,
        fontWeight: 300
      }
    }, "Track every lead from first touch to closed-won, and always know who's the top seller.")));
  }
  window.TSLogin = LoginScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sales-platform/LoginScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sales-platform/PipelineScreen.jsx
try { (() => {
/* Top Seller — Pipeline (kanban) screen. */
(function () {
  const DS = window.TopSellerDesignSystem_57ba3c;
  const I = window.TSIcons;
  const {
    Badge,
    Avatar,
    Tag
  } = DS;
  const COLS = [{
    id: "qualified",
    label: "Qualified",
    tone: "neutral",
    deals: [{
      name: "Vela Logistics",
      value: "$8.9k",
      owner: "Carmen Díaz",
      tag: "inbound"
    }, {
      name: "Orion Foods",
      value: "$5.2k",
      owner: "Beto Luna",
      tag: "referral"
    }]
  }, {
    id: "proposal",
    label: "Proposal",
    tone: "purple",
    deals: [{
      name: "Acme Corp — Annual",
      value: "$24k",
      owner: "Ana Ríos",
      tag: "enterprise"
    }, {
      name: "Pine & Co",
      value: "$11k",
      owner: "Diego Mora",
      tag: "expansion"
    }]
  }, {
    id: "negotiation",
    label: "Negotiation",
    tone: "orange",
    deals: [{
      name: "Lunar Retail rollout",
      value: "$12.4k",
      owner: "Beto Luna",
      tag: "priority"
    }]
  }, {
    id: "won",
    label: "Won",
    tone: "success",
    deals: [{
      name: "Nimbus SaaS",
      value: "$31.2k",
      owner: "Diego Mora",
      tag: "annual"
    }, {
      name: "Kite Media",
      value: "$6.8k",
      owner: "Ana Ríos",
      tag: "renewal"
    }]
  }];
  function PipelineScreen() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 24,
        background: "var(--surface-sunken)",
        minHeight: "100%",
        boxSizing: "border-box"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: 16,
        alignItems: "start"
      }
    }, COLS.map(col => /*#__PURE__*/React.createElement("div", {
      key: col.id,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "0 4px"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 999,
        background: col.tone === "orange" ? "var(--ts-orange)" : col.tone === "success" ? "var(--ts-success)" : col.tone === "purple" ? "var(--ts-purple)" : "var(--ts-ink-400)"
      }
    }), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 14
      }
    }, col.label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text-faint)"
      }
    }, col.deals.length)), col.deals.map((d, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        padding: 14,
        boxShadow: "var(--shadow-xs)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 14,
        color: "var(--text-strong)",
        lineHeight: 1.25
      }
    }, d.name), /*#__PURE__*/React.createElement(I.Dots, {
      size: 16,
      style: {
        color: "var(--text-faint)",
        flexShrink: 0
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 18,
        color: "var(--text-strong)",
        margin: "10px 0 12px"
      }
    }, d.value), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement(Tag, {
      tone: col.tone === "orange" ? "orange" : "purple"
    }, d.tag)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        borderTop: "1px solid var(--border-subtle)",
        paddingTop: 10
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: d.owner,
      tone: col.tone === "orange" ? "orange" : "purple",
      size: "xs"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text-muted)"
      }
    }, d.owner))))))));
  }
  window.TSPipeline = PipelineScreen;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sales-platform/PipelineScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/sistema-referente/Sections.jsx
try { (() => {
/* Top Seller — Landing "Sistema Referente Inmobiliario™".
   Secciones de la landing, construidas con los primitivos del DS.
   Copy derivado de los docs de estrategia (gran slam offer, pricing, avatares). */
(function () {
  const DS = window.TopSellerDesignSystem_57ba3c;
  const {
    Button,
    Badge,
    Card
  } = DS;
  const L = "../../assets/logos";
  const Eyebrow = ({
    children,
    light
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 800,
      fontSize: 12,
      letterSpacing: ".16em",
      textTransform: "uppercase",
      color: light ? "var(--ts-orange)" : "var(--text-accent)"
    }
  }, children);
  const Check = ({
    c = "var(--ts-purple)"
  }) => /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "11",
    fill: c,
    opacity: "0.12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 12.5l3.2 3.2L17 9",
    stroke: c,
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
  const Cross = () => /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "11",
    fill: "#E0473C",
    opacity: "0.12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 8l8 8M16 8l-8 8",
    stroke: "#E0473C",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  }));
  const WRAP = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 32px"
  };

  /* ---------------- NAV ---------------- */
  function Nav({
    onApply
  }) {
    return /*#__PURE__*/React.createElement("nav", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(255,255,255,.86)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--border-subtle)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...WRAP,
        display: "flex",
        alignItems: "center",
        height: 68
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: `${L}/topseller-wordmark-purple.png`,
      alt: "Top Seller",
      style: {
        height: 22
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: "auto",
        display: "flex",
        alignItems: "center",
        gap: 24
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: "#sistema",
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 14,
        color: "var(--text-body)"
      }
    }, "El sistema"), /*#__PURE__*/React.createElement("a", {
      href: "#valor",
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 14,
        color: "var(--text-body)"
      }
    }, "Qu\xE9 incluye"), /*#__PURE__*/React.createElement("a", {
      href: "#precio",
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 14,
        color: "var(--text-body)"
      }
    }, "Inversi\xF3n"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      onClick: onApply
    }, "Aplicar a mi zona"))));
  }

  /* ---------------- HERO ---------------- */
  function Hero({
    onApply
  }) {
    return /*#__PURE__*/React.createElement("header", {
      style: {
        position: "relative",
        overflow: "hidden",
        background: "var(--ts-black)",
        color: "#fff"
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: `${L}/topseller-mark-purple.png`,
      alt: "",
      style: {
        position: "absolute",
        right: -120,
        top: -60,
        height: 640,
        opacity: .16,
        pointerEvents: "none"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        ...WRAP,
        position: "relative",
        padding: "92px 32px 100px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 720
      }
    }, /*#__PURE__*/React.createElement(Eyebrow, {
      light: true
    }, "Sistema Referente Inmobiliario\u2122"), /*#__PURE__*/React.createElement("h1", {
      style: {
        color: "#fff",
        fontSize: "clamp(38px,5.4vw,66px)",
        lineHeight: 1.02,
        letterSpacing: "-.025em",
        margin: "20px 0 0"
      }
    }, "Deja de ser un asesor ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--ts-ink-500)"
      }
    }, "invisible"), " y convi\xE9rtete en ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--ts-orange)"
      }
    }, "referente"), " en 30 d\xEDas."), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 19,
        lineHeight: 1.55,
        color: "var(--ts-ink-300)",
        fontWeight: 300,
        margin: "24px 0 0",
        maxWidth: 600
      }
    }, "Un sistema que genera prospectos constantes desde redes y te da control real sobre tus ventas \u2014 sin depender de portales ni improvisar tu marketing."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 14,
        alignItems: "center",
        marginTop: 34,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      variant: "accent",
      onClick: onApply
    }, "Aplicar a mi zona"), /*#__PURE__*/React.createElement("a", {
      href: "#sistema",
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 15,
        color: "#fff",
        display: "inline-flex",
        alignItems: "center",
        gap: 8
      }
    }, "Ver c\xF3mo funciona \u2192")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 28,
        marginTop: 44,
        flexWrap: "wrap"
      }
    }, [["30 días", "implementación"], ["hasta 10", "prospectos / mes"], ["1 zona", "exclusiva por asesor"]].map(([a, b]) => /*#__PURE__*/React.createElement("div", {
      key: a
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 26,
        color: "var(--ts-orange)"
      }
    }, a), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: "var(--ts-ink-400)"
      }
    }, b)))))));
  }

  /* ---------------- ENEMIGO ---------------- */
  function Enemigo() {
    const items = ["Publicas todos los días… y nadie te escribe.", "Dependes de portales y referidos para generar clientes.", "Los leads solo preguntan precio y no avanzan.", "Pierdes prospectos en WhatsApp, sin seguimiento.", "Ves a otros asesores vendiendo más gracias a redes."];
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: "var(--surface-card)",
        padding: "84px 0"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: WRAP
    }, /*#__PURE__*/React.createElement(Eyebrow, null, "El enemigo"), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: "clamp(30px,4vw,46px)",
        letterSpacing: "-.02em",
        margin: "14px 0 0",
        maxWidth: 760
      }
    }, "El problema no eres t\xFA. Es ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--ts-purple)"
      }
    }, "\u201Cel Modelo Invisible\u201D"), "."), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 17,
        color: "var(--text-muted)",
        maxWidth: 640,
        margin: "16px 0 40px",
        fontWeight: 300
      }
    }, "Un modelo obsoleto basado en improvisar contenido, depender de portales y competir por precio \u2014 que te mantiene invisible y reemplazable."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "14px 40px",
        maxWidth: 880
      }
    }, items.map(t => /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Cross, null), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16,
        color: "var(--text-body)"
      }
    }, t)))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 40,
        padding: "22px 26px",
        borderLeft: "3px solid var(--ts-orange)",
        background: "var(--ts-orange-50)",
        borderRadius: "0 var(--radius-md) var(--radius-md) 0",
        maxWidth: 880
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 18,
        color: "var(--text-strong)"
      }
    }, "No es que no sepas vender. Es que no tienes un sistema que te haga visible."))));
  }

  /* ---------------- SISTEMA / EMBUDO INVERTIDO ---------------- */
  function Sistema() {
    const steps = [["01", "Atracción", "Estrategia, copywriting y contenido grabado contigo que detiene el scroll y posiciona tu autoridad."], ["02", "Conversación", "Automatizaciones en Instagram + Protocolo de Conversión por DM™ que convierten interacción en prospectos filtrados."], ["03", "Seguimiento", "CRM de ventas sin límite de usuarios: cada oportunidad organizada, nada se pierde."], ["04", "Optimización", "Pauta gestionada y reportes que te dicen qué genera dinero — y qué no."]];
    return /*#__PURE__*/React.createElement("section", {
      id: "sistema",
      style: {
        background: "var(--surface-sunken)",
        padding: "84px 0"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: WRAP
    }, /*#__PURE__*/React.createElement(Eyebrow, null, "El sistema \xB7 M\xE9todo Embudo Invertido\u2122"), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: "clamp(30px,4vw,46px)",
        letterSpacing: "-.02em",
        margin: "14px 0 12px",
        maxWidth: 780
      }
    }, "No es contenido. Es una ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--ts-purple)"
      }
    }, "infraestructura de ventas"), " completa."), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 17,
        color: "var(--text-muted)",
        maxWidth: 640,
        margin: "0 0 44px",
        fontWeight: 300
      }
    }, "Cuatro etapas integradas que hacen que las personas lleguen, te escriban y no se pierdan en el proceso."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(2,1fr)",
        gap: 18
      }
    }, steps.map(([n, t, d]) => /*#__PURE__*/React.createElement(Card, {
      key: n,
      padding: "lg",
      style: {
        display: "flex",
        gap: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 30,
        color: "var(--ts-purple-300)",
        lineHeight: 1
      }
    }, n), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 20,
        marginBottom: 6
      }
    }, t), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 15,
        color: "var(--text-muted)",
        fontWeight: 300,
        lineHeight: 1.55
      }
    }, d)))))));
  }

  /* ---------------- STACK DE VALOR ---------------- */
  function Valor() {
    const rows = [["Diagnóstico estratégico inicial", "$2,000"], ["Implementación del Método Embudo Invertido™", "$5,000"], ["Estrategia de posicionamiento y calendario mensual", "$5,000"], ["Copywriting estratégico (hooks, guiones, captions)", "$4,000"], ["Grabación de contenido contigo", "$4,000"], ["Edición de videos", "$8,000"], ["Diseño y edición de carruseles", "$3,000"], ["Programación y publicación de contenido e historias", "$5,000"], ["Gestión y optimización de pauta", "$5,000"], ["CRM de ventas sin límite de usuarios ni prospectos", "$3,000"], ["Automatizaciones en Instagram", "$4,000"], ["Reporte y análisis de resultados", "$2,000"]];
    return /*#__PURE__*/React.createElement("section", {
      id: "valor",
      style: {
        background: "var(--surface-card)",
        padding: "84px 0"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...WRAP,
        maxWidth: 880
      }
    }, /*#__PURE__*/React.createElement(Eyebrow, null, "Qu\xE9 incluye"), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: "clamp(30px,4vw,46px)",
        letterSpacing: "-.02em",
        margin: "14px 0 36px"
      }
    }, "Un ecosistema completo de atracci\xF3n, conversaci\xF3n y seguimiento."), /*#__PURE__*/React.createElement(Card, {
      padding: "none",
      style: {
        overflow: "hidden"
      }
    }, rows.map(([t, v], i) => /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 22px",
        borderBottom: i < rows.length - 1 ? "1px solid var(--border-subtle)" : "none"
      }
    }, /*#__PURE__*/React.createElement(Check, null), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontSize: 15.5,
        color: "var(--text-body)"
      }
    }, t), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 14,
        color: "var(--text-faint)",
        textDecoration: "line-through",
        fontVariantNumeric: "tabular-nums"
      }
    }, v, " MXN"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "18px 22px",
        background: "var(--ts-black)",
        color: "#fff"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 17
      }
    }, "Valor total percibido"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 22,
        color: "var(--ts-orange)"
      }
    }, "$50,000 MXN"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 12,
        marginTop: 18,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "purple",
      variant: "soft",
      size: "md"
    }, "+ Protocolo de Conversi\xF3n por DM\u2122"), /*#__PURE__*/React.createElement(Badge, {
      tone: "purple",
      variant: "soft",
      size: "md"
    }, "+ Optimizaci\xF3n de Perfil Inmobiliario\u2122"), /*#__PURE__*/React.createElement(Badge, {
      tone: "purple",
      variant: "soft",
      size: "md"
    }, "+ Malet\xEDn de Gatillos Mentales\u2122"))));
  }

  /* ---------------- AVATARES ---------------- */
  function Avatares() {
    const cards = [["El Asesor Invisible", "Visibilidad", "Ya vendes, pero nadie te escribe. Recupera visibilidad y deja de depender de la suerte."], ["El Competidor Oculto", "Optimización", "Ya generas, pero pierdes oportunidades. Optimiza tu sistema y convierte más de lo que ya inviertes."], ["El Arquitecto del Mercado", "Dominio", "Tienes inventario y equipo. Controla la demanda con un sistema replicable en cada proyecto."]];
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: "var(--surface-sunken)",
        padding: "84px 0"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: WRAP
    }, /*#__PURE__*/React.createElement(Eyebrow, null, "Para qui\xE9n es"), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: "clamp(30px,4vw,46px)",
        letterSpacing: "-.02em",
        margin: "14px 0 36px",
        maxWidth: 720
      }
    }, "La misma estructura. Distinto nivel del juego."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 18
      }
    }, cards.map(([t, k, d], i) => /*#__PURE__*/React.createElement(Card, {
      key: t,
      variant: i === 1 ? "brand" : "default",
      padding: "lg"
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: i === 1 ? "orange" : "purple",
      variant: i === 1 ? "solid" : "soft",
      size: "sm"
    }, k), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 21,
        margin: "16px 0 8px",
        color: i === 1 ? "#fff" : "var(--text-strong)"
      }
    }, t), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 15,
        fontWeight: 300,
        lineHeight: 1.55,
        color: i === 1 ? "rgba(255,255,255,.85)" : "var(--text-muted)"
      }
    }, d))))));
  }

  /* ---------------- GARANTÍA ---------------- */
  function Garantia() {
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: "var(--surface-card)",
        padding: "72px 0"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...WRAP,
        maxWidth: 880
      }
    }, /*#__PURE__*/React.createElement(Card, {
      variant: "accent-edge",
      padding: "xl"
    }, /*#__PURE__*/React.createElement(Eyebrow, null, "Garant\xEDa de activaci\xF3n"), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: "clamp(26px,3.4vw,38px)",
        letterSpacing: "-.02em",
        margin: "12px 0 14px"
      }
    }, "No est\xE1s pagando por intentos."), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 17,
        color: "var(--text-body)",
        fontWeight: 300,
        lineHeight: 1.6,
        maxWidth: 680
      }
    }, "Si en los primeros 30 d\xEDas no tienes el sistema implementado \u2014 contenido publicado, automatizaciones activas, CRM funcionando y flujo real de conversaciones \u2014 ", /*#__PURE__*/React.createElement("strong", {
      style: {
        fontWeight: 700,
        color: "var(--text-strong)"
      }
    }, "trabajamos contigo sin costo adicional hasta que est\xE9 completamente activo.")))));
  }

  /* ---------------- PRECIO ---------------- */
  function Precio({
    onApply
  }) {
    return /*#__PURE__*/React.createElement("section", {
      id: "precio",
      style: {
        background: "var(--ts-black)",
        color: "#fff",
        padding: "92px 0"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...WRAP,
        maxWidth: 760,
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement(Eyebrow, {
      light: true
    }, "Tu inversi\xF3n"), /*#__PURE__*/React.createElement("h2", {
      style: {
        color: "#fff",
        fontSize: "clamp(30px,4vw,46px)",
        letterSpacing: "-.02em",
        margin: "14px 0 8px"
      }
    }, "Recibes m\xE1s de $50,000 MXN en valor integrado."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "baseline",
        justifyContent: "center",
        gap: 16,
        margin: "28px 0 8px",
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 28,
        color: "var(--ts-ink-500)",
        textDecoration: "line-through"
      }
    }, "$50,000"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 64,
        lineHeight: 1,
        color: "var(--ts-orange)"
      }
    }, "$10,000"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18,
        color: "var(--ts-ink-300)"
      }
    }, "MXN / mes")), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 16,
        color: "var(--ts-ink-400)",
        fontWeight: 300,
        maxWidth: 520,
        margin: "0 auto 32px"
      }
    }, "Una sola venta cubre el sistema. El resto del a\xF1o, es retorno."), /*#__PURE__*/React.createElement(Button, {
      size: "lg",
      variant: "accent",
      onClick: onApply
    }, "Aplicar a mi zona"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 20,
        fontSize: 13.5,
        color: "var(--ts-ink-500)"
      }
    }, "Exclusividad por zona \u2014 solo trabajamos con ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: "var(--ts-ink-300)",
        fontWeight: 700
      }
    }, "un asesor por mercado"), ".")));
  }

  /* ---------------- FOOTER ---------------- */
  function Footer() {
    return /*#__PURE__*/React.createElement("footer", {
      style: {
        background: "var(--ts-ink-900)",
        color: "var(--ts-ink-400)",
        padding: "36px 0"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...WRAP,
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: `${L}/topseller-wordmark-white.png`,
      alt: "Top Seller",
      style: {
        height: 18
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13
      }
    }, "Marketing inmobiliario que vende sistemas, no servicios."), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: "auto",
        fontSize: 12.5,
        color: "var(--ts-ink-600)"
      }
    }, "\xA9 Top Seller \xB7 Sistema Referente Inmobiliario\u2122")));
  }
  window.TSLanding = {
    Nav,
    Hero,
    Enemigo,
    Sistema,
    Valor,
    Avatares,
    Garantia,
    Precio,
    Footer
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sistema-referente/Sections.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Progress = __ds_scope.Progress;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

})();

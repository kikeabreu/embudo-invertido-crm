import React from "react";

/**
 * Top Seller — Tabs
 * Controlled or uncontrolled. Active tab gets an orange underline.
 */
export function Tabs({
  tabs = [],            // [{ id, label, badge? }]
  value,
  defaultValue,
  onChange,
  style = {},
  ...rest
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? (tabs[0] && tabs[0].id));
  const active = value !== undefined ? value : internal;

  const select = (id) => {
    if (value === undefined) setInternal(id);
    onChange && onChange(id);
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
        borderBottom: "1px solid var(--border-subtle)",
        ...style,
      }}
      {...rest}
    >
      {tabs.map((tab) => {
        const on = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => select(tab.id)}
            style={{
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
              transition: "color var(--transition)",
            }}
          >
            {tab.label}
            {tab.badge != null && (
              <span style={{
                fontSize: "var(--text-2xs)", padding: "1px 7px", borderRadius: "var(--radius-pill)",
                background: on ? "var(--ts-purple-100)" : "var(--ts-ink-100)",
                color: on ? "var(--ts-purple-700)" : "var(--text-muted)",
              }}>
                {tab.badge}
              </span>
            )}
            <span style={{
              position: "absolute", left: 12, right: 12, bottom: -1, height: 3,
              borderRadius: "3px 3px 0 0",
              background: on ? "var(--ts-orange)" : "transparent",
              transition: "background var(--transition)",
            }} />
          </button>
        );
      })}
    </div>
  );
}

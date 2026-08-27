import React from "react";

/**
 * Top Seller — Logo
 * Renders the official wordmark or the fox mark from brand PNGs.
 * Color variants map to the supplied logo files; no recoloring via CSS.
 */
export function Logo({
  variant = "wordmark",        // "wordmark" | "mark"
  color = "purple",            // "purple" | "black" | "white" | "orange"
  height,
  assetBase = "/assets/logos",
  alt = "Top Seller",
  style = {},
  ...rest
}) {
  const file =
    variant === "mark"
      ? `topseller-mark-${color}.png`
      : `topseller-wordmark-${color}.png`;

  const defaultHeight = variant === "mark" ? 40 : 28;

  return (
    <img
      src={`${assetBase}/${file}`}
      alt={alt}
      style={{
        height: height || defaultHeight,
        width: "auto",
        display: "block",
        userSelect: "none",
        ...style,
      }}
      {...rest}
    />
  );
}

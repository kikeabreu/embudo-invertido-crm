import React from "react";

/**
 * Primary call-to-action button for Top Seller.
 *
 * @startingPoint section="Buttons" subtitle="Brand action button — 5 variants, 3 sizes" viewport="700x180"
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. primary = morado, accent = naranja. */
  variant?: "primary" | "accent" | "secondary" | "ghost" | "inverse";
  size?: "sm" | "md" | "lg";
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

/** Primary call-to-action button for Top Seller. */
export function Button(props: ButtonProps): JSX.Element;

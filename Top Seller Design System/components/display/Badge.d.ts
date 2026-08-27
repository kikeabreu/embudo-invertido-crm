import React from "react";

export interface BadgeProps {
  children?: React.ReactNode;
  tone?: "purple" | "orange" | "neutral" | "success" | "warning" | "danger";
  variant?: "soft" | "solid" | "outline";
  size?: "sm" | "md";
  dot?: boolean;
}

/** Status / label pill in the brand palette. */
export function Badge(props: BadgeProps): JSX.Element;

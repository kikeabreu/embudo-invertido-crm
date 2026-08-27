import React from "react";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  "aria-label": string;
  children?: React.ReactNode;
}

/** Square icon-only button for toolbars and compact controls. */
export function IconButton(props: IconButtonProps): JSX.Element;

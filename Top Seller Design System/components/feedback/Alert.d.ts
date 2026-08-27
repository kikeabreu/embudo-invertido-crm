import React from "react";

export interface AlertProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  tone?: "info" | "success" | "warning" | "danger";
  onClose?: () => void;
  icon?: React.ReactNode;
}

/** Inline notification banner with tone + optional dismiss. */
export function Alert(props: AlertProps): JSX.Element;

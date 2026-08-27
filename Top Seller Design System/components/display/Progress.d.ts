import React from "react";

export interface ProgressProps {
  value?: number;
  max?: number;
  tone?: "purple" | "orange" | "success";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

/** Linear progress / quota bar. */
export function Progress(props: ProgressProps): JSX.Element;

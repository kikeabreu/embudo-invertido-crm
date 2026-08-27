import React from "react";

export interface TagProps {
  children?: React.ReactNode;
  tone?: "neutral" | "purple" | "orange";
  /** When provided, renders a remove (×) affordance. */
  onRemove?: () => void;
}

/** Removable chip for filters and multi-select values. */
export function Tag(props: TagProps): JSX.Element;

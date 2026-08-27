import React from "react";

export interface SwitchProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
}

/** Binary toggle switch. Morado when on. */
export function Switch(props: SwitchProps): JSX.Element;

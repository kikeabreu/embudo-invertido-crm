import React from "react";

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
}

/** Checkbox with optional inline label. */
export function Checkbox(props: CheckboxProps): JSX.Element;

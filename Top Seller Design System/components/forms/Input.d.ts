import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  iconLeft?: React.ReactNode;
}

/** Text input with brand focus ring and optional leading icon. */
export function Input(props: InputProps): JSX.Element;

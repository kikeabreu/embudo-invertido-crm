import React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
}

/** Native select styled to the brand, with custom chevron. */
export function Select(props: SelectProps): JSX.Element;

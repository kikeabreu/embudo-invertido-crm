import React from "react";

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  tone?: "purple" | "orange" | "ink";
}

/** Circular user avatar — image or initials monogram. */
export function Avatar(props: AvatarProps): JSX.Element;

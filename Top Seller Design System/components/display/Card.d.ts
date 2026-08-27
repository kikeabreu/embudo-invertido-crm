import React from "react";

/**
 * Surface container with hairline border and soft elevation.
 *
 * @startingPoint section="Surfaces" subtitle="Card surface — default, brand, inverse, accent-edge" viewport="700x260"
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "brand" | "inverse" | "accent-edge";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  /** Adds hover lift + pointer cursor. */
  interactive?: boolean;
  children?: React.ReactNode;
}

/** Surface container with hairline border and soft elevation. */
export function Card(props: CardProps): JSX.Element;

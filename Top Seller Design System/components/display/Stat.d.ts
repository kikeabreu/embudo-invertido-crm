import React from "react";

export interface StatProps {
  label: string;
  value: React.ReactNode;
  delta?: React.ReactNode;
  trend?: "up" | "down" | "flat";
  icon?: React.ReactNode;
}

/** KPI / metric block with directional delta — for sales dashboards. */
export function Stat(props: StatProps): JSX.Element;

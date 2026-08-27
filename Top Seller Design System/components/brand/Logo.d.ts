import React from "react";

/**
 * Official Top Seller logo (wordmark or fox mark) in brand colors.
 *
 * @startingPoint section="Brand" subtitle="Wordmark + fox mark, 4 colorways" viewport="700x200"
 */
export interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Full "TOP SELLER" wordmark, or the fox mark alone. */
  variant?: "wordmark" | "mark";
  color?: "purple" | "black" | "white" | "orange";
  height?: number | string;
  /** Path to the logos folder, relative to the consuming page. */
  assetBase?: string;
  alt?: string;
}

/** Official Top Seller logo (wordmark or fox mark) in brand colors. */
export function Logo(props: LogoProps): JSX.Element;

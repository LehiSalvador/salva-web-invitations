import type { CSSProperties } from "react";

/** Geometría del logo oficial (public/brand/salva-systems-logo.svg). */
const STRUCTURE =
  "M 246 496 L 243 502 L 244 590 L 249 596 L 304 628 L 304 804 L 248 840 L 247 932 L 252 939 L 326 982 L 339 982 L 410 940 L 416 930 L 416 875 L 625 746 L 833 873 L 837 884 L 837 932 L 840 937 L 916 982 L 929 981 L 1003 936 L 1004 841 L 996 833 L 946 804 L 946 628 L 1004 591 L 1003 497 L 926 451 L 916 451 L 893 464 L 711 322 L 707 253 L 636 210 L 622 208 L 547 253 L 544 258 L 544 319 L 360 466 L 334 452 L 321 451 Z M 393 607 L 583 719 L 402 831 L 394 825 L 465 687 L 429 667 L 424 672 L 355 803 L 351 804 L 349 631 Z M 859 606 L 901 631 L 899 806 L 826 669 L 822 666 L 787 687 L 859 828 L 851 832 L 670 719 Z M 400 490 L 565 360 L 581 371 L 479 565 L 516 587 L 624 385 L 631 387 L 735 587 L 773 566 L 672 370 L 687 360 L 853 489 L 836 503 L 835 569 L 627 693 L 416 568 L 415 503 Z";

export const SALVA_LOGO_NODES = [
  { cx: 626.41, cy: 299.95, r: 43 },
  { cx: 920.46, cy: 544.11, r: 43 },
  { cx: 329.1, cy: 544.24, r: 43.5 },
  { cx: 330.51, cy: 886.88, r: 43 },
  { cx: 920.28, cy: 886.9, r: 43 },
] as const;

export const SALVA_LOGO_VIEWBOX = { x: 238, y: 203, width: 771, height: 784 } as const;

const STRUCTURE_COLOR = { light: "#F4F1EA", dark: "#020506" } as const;
const NODE_COLOR = "#C37780";

type SalvaLogoProps = {
  className?: string;
  style?: CSSProperties;
  /** "light" para fondos oscuros (variante inversa), "dark" para fondos claros (colores originales). */
  tone?: keyof typeof STRUCTURE_COLOR;
  /** Entrada animada única; se desactiva con prefers-reduced-motion. */
  intro?: "none" | "compact" | "hero";
  title?: string;
};

export function SalvaLogo({ className = "", style, tone = "light", intro = "none", title }: SalvaLogoProps) {
  const { x, y, width, height } = SALVA_LOGO_VIEWBOX;
  return (
    <svg
      viewBox={`${x} ${y} ${width} ${height}`}
      className={`salva-logo ${intro !== "none" ? `salva-logo--${intro}` : ""} ${className}`}
      style={style}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {intro === "hero" && (
        <defs>
          <linearGradient id="salva-logo-glint" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#E8D6AE" stopOpacity="0" />
            <stop offset="0.5" stopColor="#E8D6AE" stopOpacity="0.9" />
            <stop offset="1" stopColor="#E8D6AE" stopOpacity="0" />
          </linearGradient>
          <clipPath id="salva-logo-structure">
            <path d={STRUCTURE} clipRule="evenodd" />
          </clipPath>
        </defs>
      )}
      <path className="salva-logo__structure" d={STRUCTURE} fill={STRUCTURE_COLOR[tone]} fillRule="evenodd" />
      {intro === "hero" && (
        <g clipPath="url(#salva-logo-structure)">
          <rect className="salva-logo__glint" x="-60" y={y} width="300" height={height} fill="url(#salva-logo-glint)" />
        </g>
      )}
      {SALVA_LOGO_NODES.map(({ cx, cy, r }, index) => (
        <circle
          key={`${cx}-${cy}`}
          className="salva-logo__node"
          style={{ "--node-index": index } as CSSProperties}
          cx={cx}
          cy={cy}
          r={r}
          fill={NODE_COLOR}
        />
      ))}
    </svg>
  );
}

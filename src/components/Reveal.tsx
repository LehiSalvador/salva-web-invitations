import type { CSSProperties, ElementType, HTMLAttributes } from "react";

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  /** fade: entrada suave · group: solo dispara a los hijos (.draw, .appear). */
  variant?: "fade" | "group";
  /** Retraso en milisegundos. */
  delay?: number;
};

/** Entrada al hacer scroll: CSS en globals.css, activada por MotionObserver. */
export function Reveal({ as: Tag = "div", variant = "fade", delay = 0, style, children, ...rest }: RevealProps) {
  return (
    <Tag data-reveal={variant} style={{ "--reveal-delay": `${delay}ms`, ...style } as CSSProperties} {...rest}>
      {children}
    </Tag>
  );
}

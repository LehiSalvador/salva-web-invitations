import type { CSSProperties, ElementType, HTMLAttributes } from "react";

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  /** Retraso de la transición en milisegundos. */
  delay?: number;
  /** Solo dispara la entrada de los hijos (.reveal-item, .reveal-line-*), sin animar el contenedor. */
  group?: boolean;
};

/** Entrada al hacer scroll: CSS en globals.css, activada por RevealObserver. */
export function Reveal({ as: Tag = "div", delay = 0, group = false, style, children, ...rest }: RevealProps) {
  return (
    <Tag data-reveal={group ? "group" : ""} style={{ "--reveal-delay": `${delay}ms`, ...style } as CSSProperties} {...rest}>
      {children}
    </Tag>
  );
}

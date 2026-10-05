import type { CSSProperties, ElementType, HTMLAttributes } from "react";

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  /**
   * fade: entrada suave · mask: recorte que se abre de abajo hacia arriba ·
   * scale: entrada con profundidad · group: solo dispara a los hijos (.draw, .appear, .stagger).
   */
  variant?: "fade" | "mask" | "scale" | "group";
  /** Retraso en milisegundos. */
  delay?: number;
};

/** Entrada al hacer scroll: CSS en styles/motion.css, activada por MotionObserver. */
export function Reveal({ as: Tag = "div", variant = "fade", delay = 0, style, children, ...rest }: RevealProps) {
  return (
    <Tag data-reveal={variant} style={{ "--reveal-delay": `${delay}ms`, ...style } as CSSProperties} {...rest}>
      {children}
    </Tag>
  );
}

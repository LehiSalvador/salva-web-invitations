import type { CSSProperties, ElementType, HTMLAttributes } from "react";

type StepProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  /** Ventana del ciclo de la escena (fracciones 0–1) en la que el elemento está visible. */
  at: [number, number];
  /** Cómo entra: up, down, left, right, scale, pop, grow-x, grow-y o fade. */
  fx?: "up" | "down" | "left" | "right" | "scale" | "pop" | "grow-x" | "grow-y" | "fade";
  /** Opacidad fuera de la ventana (0 = oculto). Útil para resaltar en lugar de ocultar. */
  min?: number;
  /** Con reduced motion: "hide" lo oculta (por ejemplo, un estado intermedio que duplicaría información). */
  rm?: "hide";
};

/**
 * Paso de una línea de tiempo declarativa. Debe vivir dentro de un contenedor con data-live y
 * data-cycle (duración del ciclo en ms); MotionObserver lo anima con Web Animations.
 * Sin JS o con reduced motion se muestra en su estado final, así que la escena se lee completa.
 */
export function Step({ as: Tag = "div", at, fx = "up", min, rm, style, children, ...rest }: StepProps) {
  return (
    <Tag
      data-step=""
      data-in={at[0]}
      data-out={at[1]}
      data-fx={fx}
      data-min={min}
      data-rm={rm}
      style={style as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}

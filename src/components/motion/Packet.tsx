import type { CSSProperties } from "react";

export type Point = [number, number];

/** Muestrea una curva cúbica para que un paquete pueda seguirla como polilínea. */
export function cubic(p0: Point, p1: Point, p2: Point, p3: Point, steps = 8): Point[] {
  return Array.from({ length: steps + 1 }, (_, step) => {
    const t = step / steps;
    const u = 1 - t;
    return [0, 1].map(
      (axis) => u * u * u * p0[axis] + 3 * u * u * t * p1[axis] + 3 * u * t * t * p2[axis] + t * t * t * p3[axis],
    ) as Point;
  });
}

type PacketProps = {
  route: Point[];
  /** Duración de un ciclo en ms. */
  dur?: number;
  delay?: number;
  /** Fracción del ciclo que el paquete espera en el destino. */
  hold?: number;
  kind?: "dot" | "msg" | "truck" | "doc";
  tone?: "signal" | "gold" | "bone";
  /** Tamaño del sistema de coordenadas de la ruta. */
  size?: [number, number];
  /**
   * Ventana dentro del ciclo de la escena (data-cycle del contenedor), en fracciones 0–1.
   * Si se indica, dur y delay se ignoran y el recorrido se sincroniza con los pasos de la escena.
   */
  at?: [number, number];
  className?: string;
};

/**
 * Elemento que recorre una ruta sobre un diagrama. Se dibuja en HTML encima del SVG
 * y se anima con transform/opacity desde MotionObserver, solo mientras está en pantalla.
 */
export function Packet({ route, dur = 5000, delay = 0, hold = 0, kind = "dot", tone = "signal", size = [640, 400], at, className = "" }: PacketProps) {
  return (
    <span
      className={`packet packet--${kind} packet--${tone} ${className}`}
      data-in={at?.[0]}
      data-out={at?.[1]}
      data-route={route.map(([x, y]) => `${Math.round(x)},${Math.round(y)}`).join(";")}
      data-dur={dur}
      data-delay={delay}
      data-hold={hold || undefined}
      data-w={size[0]}
      data-h={size[1]}
    >
      {kind === "truck" ? (
        <span data-heading className="packet__body">
          <svg viewBox="0 0 30 14" aria-hidden="true">
            <rect x="0.75" y="1.75" width="19" height="10.5" rx="1" className="packet__load" />
            <rect x="21" y="2.75" width="8" height="8.5" rx="1.5" className="packet__cab" />
          </svg>
        </span>
      ) : (
        <span className="packet__body" />
      )}
    </span>
  );
}

/** Capa HTML alineada con el SVG del diagrama: mide lo mismo que la figura. */
export function PacketLayer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div aria-hidden="true" className={`packet-layer ${className}`}>
      {children}
    </div>
  );
}

/** Marcador fijo con pulso (anillo que se expande). */
export function Beacon({ x, y, delay = 0, tone = "gold", size = [640, 400] }: { x: number; y: number; delay?: number; tone?: "gold" | "signal" | "rose"; size?: [number, number] }) {
  return (
    <span
      className={`beacon beacon--${tone}`}
      style={{ left: `${(x / size[0]) * 100}%`, top: `${(y / size[1]) * 100}%`, "--delay": `-${delay}ms` } as CSSProperties}
    />
  );
}

/** Punto que parpadea suavemente (opacidad), por ejemplo un proceso en curso. */
export function Blink({ x, y, delay = 0, dur = 1200, size = [640, 400] }: { x: number; y: number; delay?: number; dur?: number; size?: [number, number] }) {
  return (
    <span
      className="blink pulse"
      style={{ left: `${(x / size[0]) * 100}%`, top: `${(y / size[1]) * 100}%`, "--delay": `-${dur - delay}ms`, "--dur": `${dur}ms` } as CSSProperties}
    />
  );
}

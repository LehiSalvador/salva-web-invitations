import type { CSSProperties, ReactNode } from "react";
import { Packet, PacketLayer, type Point } from "@/components/motion/Packet";
import { Step } from "@/components/motion/Step";
import styles from "./CapabilityVisuals.module.css";

/*
 * Kit común de los visuales de "Qué hacemos": misma retícula, mismos paneles, misma tipografía
 * y el mismo riel de fases con cabezal. Cada visual es una escena [data-live] con su propio ciclo.
 *
 * - La estructura (marcos, paneles, mensajes) es estática y persiste entre ciclos; solo los estados se reinician.
 * - Los estados finales duran hasta END (fin del ciclo): el desenlace se sostiene y el reinicio es breve.
 * - Escenario de alto fijo por variante (ver .stage en el CSS): 166/186 px en mobile, 244 px desde @lg y 300 px
 *   cuando el visor es alto (1024 px). Las capas de paquetes nunca dependen del alto variable del visor.
 * - Texto: nunca truncate con leading-none (recorta tildes y descendentes); usar TRUNC.
 */

export const END = 1;

export type Phase = { label: string; at: [number, number] };

/** Etiqueta mono pequeña (≥10 px reales en mobile). Sin overflow: puede ir con leading-none. */
export const MICRO = "font-mono text-[10px] uppercase leading-none tracking-[0.1em]";
/** Recorte de una línea sin comerse tildes ni descendentes. */
export const TRUNC = "truncate leading-[1.35]";
/** Panel fino del sistema visual. */
export const PANEL = "rounded-[3px] border border-line-strong bg-ink-900/90";

export const pos = (x: number, y: number): CSSProperties => ({ left: `${x}%`, top: `${y}%` });

/** Trazo de una curva cúbica en coordenadas del viewBox (las mismas que usa el paquete). */
export const curvePath = ([a, b, c, d]: [Point, Point, Point, Point]) =>
  `M${a[0]} ${a[1]}C${b[0]} ${b[1]} ${c[0]} ${c[1]} ${d[0]} ${d[1]}`;

export const linePath = (points: Point[]) => `M${points.map((point) => point.join(" ")).join("L")}`;

export function Scene({ cycle, phases, children }: { cycle: number; phases: Phase[]; children: ReactNode }) {
  return (
    <div
      data-live
      data-cycle={cycle}
      aria-hidden="true"
      className={`${styles.scene} absolute inset-0 overflow-hidden`}
      style={{ "--cycle": `${cycle}ms` } as CSSProperties}
    >
      <div className="flex h-full flex-col justify-center gap-2 p-3 @lg:gap-3 @lg:px-5 @lg:py-3">
        <div className={`${styles.stage} relative w-full shrink-0`}>{children}</div>
        <Rail phases={phases} />
      </div>
    </div>
  );
}

/**
 * Riel de fases: cada tramo mide lo que dura su fase y un cabezal lo recorre al ritmo del ciclo.
 * Desde @lg muestra las cuatro fases (atenuadas) y resalta la activa; en mobile es una línea de estado
 * con la fase actual. Con movimiento reducido queda resaltada la última fase (el desenlace).
 */
function Rail({ phases }: { phases: Phase[] }) {
  const start = phases[0].at[0];
  const end = phases[phases.length - 1].at[1];
  const label = "block truncate font-mono text-[10px] leading-[1.35] tracking-[0.06em] uppercase";
  return (
    <div className="relative shrink-0">
      <div className="h-px bg-line-strong" />
      <div className="grid @max-lg:grid-cols-1!" style={{ gridTemplateColumns: phases.map((phase) => `${((phase.at[1] - phase.at[0]) * 100).toFixed(2)}fr`).join(" ") }}>
        {phases.map((phase, index) => (
          <div key={phase.label} className="relative min-w-0 @max-lg:col-start-1 @max-lg:row-start-1">
            <span className={`${label} hidden pt-1.5 pr-2 text-fog/80 @lg:block`}>
              0{index + 1} {phase.label}
            </span>
            <Step at={phase.at} fx="fade" rm={index < phases.length - 1 ? "hide" : undefined} className="pt-1.5 pr-2 @lg:absolute @lg:inset-0">
              <span className="absolute inset-x-0 -top-px hidden h-px bg-signal @lg:block" />
              <span className={`${label} flex items-center gap-1.5 text-bone`}>
                <span className="size-[5px] shrink-0 rounded-full bg-signal @lg:hidden" />
                <span className="truncate">
                  <span className="text-signal">0{index + 1}</span> {phase.label}
                </span>
              </span>
            </Step>
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 -top-0.5 h-[5px]">
        <PacketLayer>
          <Packet size={[100, 5]} route={[[0, 2.5], [100, 2.5]]} at={[start, end]} />
        </PacketLayer>
      </div>
    </div>
  );
}

/** Cables de un diagrama normalizado (0–100 en ambos ejes): el trazo no se deforma al estirarse. */
export function Wires({
  paths,
  className = "",
}: {
  paths: { d: string; tone?: "faint" | "line" | "signal" | "gold" | "bone"; dashed?: boolean }[];
  className?: string;
}) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={`absolute inset-0 size-full overflow-visible ${className}`} fill="none">
      {paths.map(({ d, tone = "faint", dashed }) => (
        <path key={d} d={d} vectorEffect="non-scaling-stroke" className={`${styles.wire} ${styles[tone]} ${dashed ? styles.dashed : ""}`} />
      ))}
    </svg>
  );
}

/** Avatar genérico (silueta), sin nombres ni fotos. */
export function Avatar({ tone = "signal", className = "", children }: { tone?: "signal" | "gold" | "cool" | "bone"; className?: string; children?: ReactNode }) {
  return (
    <span className={`${styles.avatar} ${styles[`avatar_${tone}`]} ${className}`}>
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="6.2" r="2.6" />
        <path d="M3.4 13.6c.7-2.4 2.5-3.7 4.6-3.7s3.9 1.3 4.6 3.7" />
      </svg>
      {children}
    </span>
  );
}

/** Marca de verificación en línea. */
export function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true" className={`inline-block size-[0.9em] shrink-0 ${className}`} fill="none">
      <path d="M2.2 6.4 4.9 9l4.9-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

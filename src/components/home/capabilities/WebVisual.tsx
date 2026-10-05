import { cubic, Packet, PacketLayer, type Point } from "@/components/motion/Packet";
import { Step } from "@/components/motion/Step";
import styles from "./CapabilityVisuals.module.css";
import { Check, END, MICRO, PANEL, pos, Scene } from "./kit";

/*
 * Desarrollo web: un navegador ensambla el sitio (retícula → secciones → contenido) y un visitante hace
 * clic en el CTA. Luego el viewport se angosta (sus bordes avanzan hacia el centro), la vista de escritorio
 * queda atrás y las mismas secciones se reacomodan en una columna móvil: reflujo responsive.
 * Coordenadas normalizadas (0–100) del área de contenido del navegador.
 */

const CTA = { x: 20, y: 53 };
/** Columna móvil: más estrecha en proporción cuando el navegador es ancho. */
const COLUMN = { sm: [32, 68], lg: [38.5, 61.5] } as const;
const REFLOW: [number, number] = [0.62, END];
/** Los bordes llegan a la columna en ~0.69 y ahí se quedan. */
const EDGE_HOLD = 1 - (0.69 - REFLOW[0]) / (REFLOW[1] - REFLOW[0]);

const BAR = "absolute rounded-[1.5px] origin-left";
const SLOT = "absolute rounded-[2px] border border-dashed border-line-strong";

function Edges({ column: [left, right], className }: { column: readonly [number, number]; className: string }) {
  const edge = (from: number, to: number): Point[] => [
    [from, 0],
    [to, 0],
  ];
  return (
    <PacketLayer className={className}>
      <Packet className={styles.edge} size={[100, 100]} route={edge(0.4, left)} at={REFLOW} hold={EDGE_HOLD} />
      <Packet className={styles.edge} size={[100, 100]} route={edge(99.6, right)} at={REFLOW} hold={EDGE_HOLD} />
    </PacketLayer>
  );
}

function Desktop() {
  return (
    <Step at={[0, REFLOW[0] + 0.01]} fx="fade" min={0.13} className="absolute inset-0">
      {/* 01 Estructura: retícula, navegación y huecos de cada sección (persisten atenuados). */}
      <Step at={[0.02, 0.3]} fx="fade" rm="hide" className={`${styles.columns} absolute inset-y-[4%] left-[4%] right-[4%]`} />
      <Step at={[0.04, END]} fx="grow-x" min={0.25} className="absolute top-[4%] right-[4%] left-[4%] flex h-[11%] origin-left items-center justify-between border-b border-line">
        <span className="flex items-center gap-1.5">
          <span className="size-[7px] rotate-45 border border-signal" />
          <span className="h-[4px] w-[34px] rounded-[1px] bg-bone/70" />
        </span>
        <span className="flex items-center gap-[7%]">
          <span className="hidden h-[3px] w-[16px] rounded-[1px] bg-mist/50 @lg:block" />
          <span className="h-[3px] w-[16px] rounded-[1px] bg-mist/50" />
          <span className="h-[3px] w-[16px] rounded-[1px] bg-mist/50" />
          <span className="h-[9px] w-[26px] rounded-[2px] border border-gold-400/70" />
        </span>
      </Step>
      <Step at={[0.08, END]} fx="fade" min={0.35} className={SLOT} style={{ ...pos(4, 21), width: "46%", height: "42%" }} />
      <Step at={[0.11, END]} fx="fade" min={0.35} className={SLOT} style={{ ...pos(54, 21), width: "42%", height: "42%" }} />
      <Step at={[0.14, END]} fx="fade" min={0.35} className={SLOT} style={{ ...pos(4, 68), width: "92%", height: "27%" }} />

      {/* 02 Contenido. */}
      <Step at={[0.2, END]} fx="grow-x" className={`${BAR} h-[7px] bg-bone/85 @lg:h-[9px]`} style={{ ...pos(7, 27), width: "36%" }} />
      <Step at={[0.23, END]} fx="grow-x" className={`${BAR} h-[7px] bg-bone/85 @lg:h-[9px]`} style={{ ...pos(7, 34.5), width: "25%" }} />
      <Step at={[0.26, END]} fx="grow-x" className={`${BAR} h-[3px] bg-mist/45`} style={{ ...pos(7, 43), width: "34%" }} />
      <Step at={[0.22, END]} fx="scale" className="absolute overflow-hidden rounded-[2px] border border-line bg-linear-to-br from-signal/20 via-cool/10 to-gold-400/15" style={{ ...pos(55.5, 24), width: "39%", height: "36%" }}>
        <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full" aria-hidden="true">
          <circle cx="72" cy="20" r="7" className="fill-gold-300/70" />
          <path d="M0 60 30 28l16 15 14-11 40 28Z" className="fill-signal/25 stroke-signal/60" strokeWidth="0.8" />
        </svg>
      </Step>
      <Step
        at={[0.29, END]}
        fx="pop"
        className="absolute flex h-[16px] w-[26%] -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1 rounded-[2px] bg-signal font-mono text-[10px] leading-none font-medium text-ink-950 @lg:h-[22px] @lg:text-[11px]"
        style={pos(CTA.x, CTA.y)}
      >
        Cotizar<span className="hidden @2xl:inline"> proyecto →</span>
      </Step>
      <div className="absolute grid grid-cols-3 gap-[3%] p-[1.2%]" style={{ ...pos(4, 68), width: "92%", height: "27%" }}>
        {[0.32, 0.35, 0.38].map((at, index) => (
          <Step key={at} at={[at, END]} fx="up" className="flex flex-col justify-center gap-[5px] rounded-[2px] border border-line bg-ink-850 px-[7%]">
            <span className={`size-[7px] rounded-[1.5px] ${index === 1 ? "bg-gold-300/80" : "bg-signal/70"}`} />
            <span className="h-[3px] w-[78%] rounded-[1px] bg-bone/60" />
            <span className="hidden h-[3px] w-[52%] rounded-[1px] bg-mist/35 @lg:block" />
          </Step>
        ))}
      </div>

      {/* 03 Interacción: el visitante hace clic en el CTA. */}
      <PacketLayer>
        <Packet
          className={styles.cursor}
          size={[100, 100]}
          tone="bone"
          route={cubic([70, 96], [58, 80], [34, 74], [CTA.x + 1.5, CTA.y + 1.5], 14)}
          at={[0.4, 0.61]}
          hold={0.42}
        />
      </PacketLayer>
      <Step
        at={[0.515, 0.6]}
        fx="pop"
        rm="hide"
        className="absolute size-[30px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal @lg:size-[40px]"
        style={pos(CTA.x, CTA.y)}
      />
      <Step
        at={[0.515, 0.57]}
        fx="fade"
        rm="hide"
        className="absolute flex h-[16px] w-[26%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2px] bg-bone text-ink-950 @lg:h-[22px]"
        style={pos(CTA.x, CTA.y)}
      >
        <Check />
      </Step>
      <Step at={[0.54, END]} fx="left" className={`${PANEL} absolute top-[25%] right-[3%] flex items-center gap-1.5 px-1.5 py-1 text-signal shadow-[0_6px_18px_-8px_rgb(0_0_0/0.8)] @lg:px-2 @lg:py-1.5`}>
        <Check />
        <span className={`${MICRO} text-bone`}>
          <span className="@lg:hidden">enviada</span>
          <span className="hidden @lg:inline">solicitud enviada</span>
        </span>
      </Step>
    </Step>
  );
}

/** 04 Responsive: la misma página, reacomodada en una columna dentro del viewport angosto. */
function MobileColumn() {
  return (
    <Step
      at={[0.69, END]}
      fx="fade"
      className="absolute inset-y-[3%] left-[32%] flex w-[36%] flex-col gap-[3.5%] overflow-hidden bg-ink-900 px-[3%] pt-[3%] pb-[3%] @lg:left-[38.5%] @lg:w-[23%] @lg:px-[1.6%]"
    >
      <Step at={[0.7, END]} fx="up" className="flex flex-col gap-[6px]">
        <span className="flex items-center justify-between border-b border-line pb-[5px]">
          <span className="size-[6px] rotate-45 border border-signal" />
          <span className="flex flex-col gap-[2px]">
            <span className="h-px w-[9px] bg-mist" />
            <span className="h-px w-[9px] bg-mist" />
            <span className="h-px w-[9px] bg-mist" />
          </span>
        </span>
        <span className="h-[5px] w-[88%] rounded-[1px] bg-bone/85 @lg:h-[7px]" />
        <span className="h-[5px] w-[60%] rounded-[1px] bg-bone/85 @lg:h-[7px]" />
        <span className="h-[26px] rounded-[2px] border border-line bg-linear-to-br from-signal/20 via-cool/10 to-gold-400/15 @lg:h-[40px]" />
      </Step>
      <Step at={[0.74, END]} fx="pop" className="flex h-[13px] shrink-0 items-center justify-center rounded-[2px] bg-signal font-mono text-[10px] leading-none text-ink-950 @lg:h-[18px]">
        Cotizar
      </Step>
      <Step at={[0.78, END]} fx="up" className="flex min-h-0 flex-1 flex-col gap-[5px]">
        {[0, 1, 2].map((card) => (
          <span key={card} className="flex max-h-[30px] min-h-[12px] flex-1 items-center gap-[5px] rounded-[2px] border border-line bg-ink-850 px-[8%]">
            <span className={`size-[6px] shrink-0 rounded-[1px] ${card === 1 ? "bg-gold-300/80" : "bg-signal/70"}`} />
            <span className="h-[3px] flex-1 rounded-[1px] bg-bone/55" />
          </span>
        ))}
      </Step>
    </Step>
  );
}

export function WebVisual() {
  return (
    <Scene
      cycle={11000}
      phases={[
        { label: "estructura", at: [0, 0.19] },
        { label: "contenido", at: [0.19, 0.4] },
        { label: "interacción", at: [0.4, 0.62] },
        { label: "responsive", at: [0.62, END] },
      ]}
    >
      <div className={`${PANEL} absolute inset-0 flex flex-col overflow-hidden`}>
        <div className="flex h-[22px] shrink-0 items-center gap-2 border-b border-line px-2 @lg:h-[26px] @lg:px-2.5">
          <span className="flex gap-[3px]">
            {[0, 1, 2].map((dot) => (
              <span key={dot} className="size-[5px] rounded-full bg-fog/45" />
            ))}
          </span>
          <span className="flex h-[14px] min-w-0 flex-1 items-center gap-1.5 rounded-[2px] bg-ink-800 px-1.5 font-mono text-[10px] leading-none text-mist @lg:h-[16px] @lg:max-w-[220px]">
            <svg viewBox="0 0 10 10" className="size-[8px] shrink-0 text-signal" fill="none" aria-hidden="true">
              <rect x="1.5" y="4.5" width="7" height="5" rx="1" fill="currentColor" />
              <path d="M3 4.5V3a2 2 0 0 1 4 0v1.5" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            /inicio
          </span>
          <span className={`${MICRO} relative ml-auto flex h-[14px] items-center text-fog`}>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 14 10" className="h-[8px] w-[11px]" fill="none" aria-hidden="true">
                <rect x="0.5" y="0.5" width="13" height="7" rx="1" stroke="currentColor" />
                <path d="M4 9.5h6" stroke="currentColor" />
              </svg>
              escritorio
            </span>
            <Step at={[0.64, END]} fx="up" className="absolute inset-y-0 -left-1 right-0 flex items-center justify-end gap-1.5 bg-ink-900 text-signal">
              <svg viewBox="0 0 8 12" className="h-[10px] w-[7px]" fill="none" aria-hidden="true">
                <rect x="0.5" y="0.5" width="7" height="11" rx="1.5" stroke="currentColor" />
              </svg>
              móvil
            </Step>
          </span>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <Desktop />
          <MobileColumn />
          <Edges column={COLUMN.sm} className="@lg:hidden" />
          <Edges column={COLUMN.lg} className="hidden @lg:block" />
        </div>
      </div>
    </Scene>
  );
}

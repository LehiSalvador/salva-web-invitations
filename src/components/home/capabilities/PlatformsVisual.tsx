import type { CSSProperties } from "react";
import { cubic, Packet, PacketLayer, type Point } from "@/components/motion/Packet";
import { Step } from "@/components/motion/Step";
import styles from "./CapabilityVisuals.module.css";
import { Avatar, Check, END, MICRO, PANEL, Scene } from "./kit";

/*
 * Plataformas: varios usuarios conectados a la misma app. Alguien crea un registro en escritorio, viaja por la
 * API hasta el móvil; desde el móvil otra persona lo confirma (su avatar late y en escritorio se ve que está
 * editando) y el cambio regresa. Todas las vistas terminan consistentes.
 *
 * Las rutas van en píxeles de una caja de alto fijo anclada arriba (las filas también se miden desde arriba),
 * así sirven igual en el escenario normal y en el alto: fila nueva del escritorio → API → fila nueva del móvil.
 */

const ROUTES = {
  sm: { size: [42, 166] as [number, number], row: 108, api: [21, 100] as Point, phone: 93 },
  lg: { size: [96, 244] as [number, number], row: 165, api: [48, 123] as Point, phone: 124 },
};

function route({ size: [w], row, api, phone }: (typeof ROUTES)["sm"]): Point[] {
  const half = api[0] / 2;
  return [...cubic([0, row], [half, row], [half, api[1]], api, 8), ...cubic(api, [api[0] + half, api[1]], [api[0] + half, phone], [w, phone], 8).slice(1)];
}

const rows = [
  { id: "R-04", state: "confirmado", tone: "signal", bar: "w-[70%]", who: "gold" },
  { id: "R-05", state: "en ruta", tone: "cool", bar: "w-[52%]", who: "signal" },
  { id: "R-06", state: "confirmado", tone: "signal", bar: "w-[62%]", who: "cool" },
] as const;

const CHIP = "h-[14px] items-center gap-1 rounded-[2px] px-1 font-mono text-[10px] leading-none @lg:h-[16px] @lg:px-1.5";
const TONE = { signal: "bg-signal/12 text-signal", cool: "bg-cool/12 text-cool", gold: "bg-gold-400/15 text-gold-300" };
const ROW = "flex h-[20px] items-center gap-2 border-b border-line px-1.5 @lg:h-[26px] @lg:px-2.5";
const NEW_BG = "bg-[color-mix(in_srgb,var(--color-signal)_7%,var(--color-ink-900))]";

function Desktop() {
  return (
    <div className={`${PANEL} relative flex min-w-0 flex-1 flex-col overflow-hidden [--av:13px] @lg:[--av:17px]`}>
      <div className="flex h-[22px] shrink-0 items-center gap-2 border-b border-line px-1.5 @lg:h-[28px] @lg:px-2.5">
        <span className="hidden gap-[3px] @lg:flex">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="size-[5px] rounded-full bg-fog/45" />
          ))}
        </span>
        <span className={`${MICRO} text-mist`}>registros</span>
        <span className="ml-auto flex items-center gap-2 [--av:14px] @lg:[--av:18px]">
          <span className={`${MICRO} hidden text-fog @2xl:inline`}>en línea</span>
          <span className="flex -space-x-1">
            {(["signal", "gold", "cool"] as const).map((tone, index) => (
              <Step key={tone} at={[0.02 + index * 0.03, END]} fx="pop" min={0.3} className="flex">
                <Avatar tone={tone} />
              </Step>
            ))}
          </span>
        </span>
      </div>

      <div className="hidden h-[26px] shrink-0 items-center gap-2 border-b border-line px-2.5 @lg:flex">
        <span className="flex h-[16px] flex-1 items-center rounded-[2px] bg-ink-800 px-2 font-mono text-[10px] leading-none text-fog">buscar…</span>
        <span className="relative flex h-[16px] items-center rounded-[2px] border border-gold-400/60 px-2 font-mono text-[10px] leading-none text-gold-300">
          + nuevo
          <Step at={[0.115, 0.17]} fx="fade" rm="hide" className="absolute -inset-px rounded-[2px] bg-gold-300/25" />
          {/* El usuario de escritorio hace clic en "+ nuevo". */}
          <span className="pointer-events-none absolute top-0 right-0 h-[70px] w-[150px]">
            <PacketLayer>
              <Packet className={styles.cursor} size={[150, 70]} tone="bone" route={cubic([28, 68], [60, 64], [104, 34], [124, 10], 12)} at={[0.05, 0.16]} hold={0.4} />
            </PacketLayer>
          </span>
        </span>
      </div>

      <div className={`${MICRO} flex h-[16px] shrink-0 items-center gap-2 border-b border-line px-1.5 text-fog @lg:h-[20px] @lg:px-2.5`}>
        <span className="w-[30px] @lg:w-[40px]">id</span>
        <span className="flex-1">cliente</span>
        <span className="w-[68px] @lg:w-[84px]">estado</span>
        <span className="w-[13px] @lg:w-[17px]" />
      </div>

      {rows.map((row) => (
        <div key={row.id} className={ROW}>
          <span className="w-[30px] font-mono text-[10px] leading-none text-mist @lg:w-[40px] @lg:text-[10.5px]">{row.id}</span>
          <span className="flex-1">
            <span className={`block h-[3px] rounded-[1px] bg-bone/35 ${row.bar}`} />
          </span>
          <span className="w-[68px] @lg:w-[84px]">
            <span className={`${CHIP} inline-flex ${TONE[row.tone]}`}>{row.state}</span>
          </span>
          <Avatar tone={row.who} className="opacity-70" />
        </div>
      ))}

      {/* Registro nuevo: se crea aquí y se confirma desde el móvil. */}
      <div className={`${ROW} relative`}>
        <Step at={[0.15, END]} fx="grow-x" className="absolute inset-0 origin-left border-l-2 border-signal bg-signal/[0.07]" />
        <Step at={[0.17, END]} fx="fade" className="relative flex min-w-0 flex-1 items-center gap-2">
          <span className="w-[30px] font-mono text-[10px] leading-none text-bone @lg:w-[40px] @lg:text-[10.5px]">R-07</span>
          <span className="flex-1">
            <span className="block h-[3px] w-[58%] rounded-[1px] bg-bone/70" />
          </span>
          <span className="w-[68px] @lg:w-[84px]">
            <span className={`${CHIP} inline-flex ${TONE.gold}`}>nuevo</span>
          </span>
          <Avatar tone="signal" />
        </Step>
        <Step at={[0.72, END]} fx="fade" className={`absolute top-1/2 right-[27px] w-[68px] -translate-y-1/2 ${NEW_BG} @lg:right-[35px] @lg:w-[84px]`}>
          <span className={`${CHIP} inline-flex ${TONE.signal}`}>confirmado</span>
        </Step>
        <Step at={[0.72, END]} fx="pop" className="absolute top-1/2 right-1.5 flex -translate-y-1/2 @lg:right-2.5">
          <Avatar tone="cool" />
        </Step>
        {/* Presencia: otra persona edita R-07 desde el móvil. */}
        <Step
          at={[0.48, 0.72]}
          fx="down"
          rm="hide"
          className="absolute -top-[9px] right-[24px] flex items-center gap-1 rounded-[2px] border border-cool/60 bg-ink-900 py-px pr-1.5 pl-[3px] font-mono text-[10px] leading-[1.35] text-cool [--av:12px] @lg:right-[32px] @lg:[--av:14px]"
        >
          <Avatar tone="cool" />
          editando
        </Step>
      </div>
      <div className="relative mt-auto hidden h-[30px] shrink-0 @lg:block">
        <Step at={[0.76, END]} fx="up" className={`${MICRO} absolute inset-y-0 left-2.5 flex items-center gap-1.5 text-signal`}>
          <Check /> sincronizado en cada dispositivo
        </Step>
      </div>
    </div>
  );
}

function Channel() {
  const sm = route(ROUTES.sm);
  const lg = route(ROUTES.lg);
  const svgPath = (points: Point[]) => `M${points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}`;
  return (
    <div className="relative w-[42px] shrink-0 @lg:w-[96px]">
      <div className="absolute inset-x-0 top-0 h-[166px] @lg:h-[244px]">
        <svg viewBox="0 0 42 166" className="absolute inset-0 size-full @lg:hidden" fill="none" aria-hidden="true">
          <path d={svgPath(sm)} stroke="rgb(238 235 228 / 0.3)" strokeDasharray="3 3" />
        </svg>
        <svg viewBox="0 0 96 244" className="absolute inset-0 hidden size-full @lg:block" fill="none" aria-hidden="true">
          <path d={svgPath(lg)} stroke="rgb(238 235 228 / 0.3)" strokeDasharray="3 4" />
        </svg>

        <PacketLayer className="@lg:hidden">
          <Packet size={ROUTES.sm.size} kind="doc" tone="gold" route={sm} at={[0.22, 0.4]} />
          <Packet size={ROUTES.sm.size} tone="signal" route={[...sm].reverse()} at={[0.57, 0.72]} />
        </PacketLayer>
        <PacketLayer className="hidden @lg:block">
          <Packet size={ROUTES.lg.size} kind="doc" tone="gold" route={lg} at={[0.22, 0.4]} />
          <Packet size={ROUTES.lg.size} tone="signal" route={[...lg].reverse()} at={[0.57, 0.72]} />
        </PacketLayer>

        {/* API: el punto por el que pasan todos los cambios. */}
        <div className="absolute top-[100px] left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 @lg:top-[123px]">
          <span className="relative grid size-[18px] place-items-center rounded-[3px] border border-line-strong bg-ink-850 text-cool @lg:size-[30px]">
            <svg viewBox="0 0 12 12" className="size-[10px] @lg:size-[14px]" fill="none" aria-hidden="true">
              <ellipse cx="6" cy="3" rx="4" ry="1.6" stroke="currentColor" strokeWidth="1" />
              <path d="M2 3v6c0 .9 1.8 1.6 4 1.6s4-.7 4-1.6V3M2 6c0 .9 1.8 1.6 4 1.6S10 6.9 10 6" stroke="currentColor" strokeWidth="1" />
            </svg>
            <Step at={[0.28, 0.36]} fx="scale" rm="hide" className="absolute -inset-[4px] rounded-[5px] border border-gold-300/80" />
            <Step at={[0.62, 0.69]} fx="scale" rm="hide" className="absolute -inset-[4px] rounded-[5px] border border-signal/80" />
          </span>
          <span className={`${MICRO} absolute top-full mt-1 hidden text-fog @lg:block`}>api</span>
        </div>
      </div>
    </div>
  );
}

const PHONE_ROW = "flex h-[18px] items-center gap-1.5 border-b border-line px-1.5 @lg:h-[24px] @lg:px-2";
const DOT = { signal: "bg-signal", cool: "bg-cool", gold: "bg-gold-300" };

function Phone() {
  return (
    <div className="relative aspect-[1/2] h-full shrink-0 rounded-[11px] border border-line-strong bg-ink-900 p-[3px]">
      <div className="flex h-full flex-col overflow-hidden rounded-[8px]">
        <span className="flex h-[8px] shrink-0 items-start justify-center @lg:h-[12px]">
          <span className="mt-[2px] h-[3px] w-[34%] rounded-full bg-line-strong @lg:mt-[4px]" />
        </span>
        <span className="flex h-[18px] shrink-0 items-center justify-between border-b border-line px-1.5 [--av:12px] @lg:h-[24px] @lg:px-2 @lg:[--av:15px]">
          <span className={`${MICRO} hidden text-mist @lg:inline`}>registros</span>
          <span className="h-[3px] w-[40%] rounded-[1px] bg-bone/50 @lg:hidden" />
          <Step at={[0.1, END]} fx="pop" min={0.3} className="flex">
            <Avatar tone="cool">
              <Step at={[0.46, 0.6]} fx="fade" rm="hide" className="absolute inset-0">
                <span className={styles.ping} />
              </Step>
            </Avatar>
          </Step>
        </span>
        {rows.map((row) => (
          <span key={row.id} className={PHONE_ROW}>
            <span className={`size-[5px] shrink-0 rounded-full ${DOT[row.tone]}`} />
            <span className="font-mono text-[10px] leading-none whitespace-nowrap text-mist">{row.id}</span>
            <span className={`${CHIP} ${TONE[row.tone]} ml-auto hidden @lg:inline-flex`}>{row.state === "confirmado" ? "ok" : row.state}</span>
          </span>
        ))}
        <Step at={[0.4, END]} fx="down" className={`${PHONE_ROW} relative bg-signal/[0.07] shadow-[inset_2px_0_0_var(--color-signal)]`}>
          <span className="size-[5px] shrink-0 rounded-full bg-gold-300" />
          <span className="font-mono text-[10px] leading-none whitespace-nowrap text-bone">R-07</span>
          <span className={`${CHIP} ${TONE.gold} ml-auto hidden @lg:inline-flex`}>nuevo</span>
          <Step at={[0.54, END]} fx="fade" className={`absolute inset-0 flex items-center gap-1.5 ${NEW_BG} px-1.5 shadow-[inset_2px_0_0_var(--color-signal)] @lg:px-2`}>
            <span className="size-[5px] shrink-0 rounded-full bg-signal" />
            <span className="font-mono text-[10px] leading-none whitespace-nowrap text-bone">R-07</span>
            <span className={`${CHIP} ${TONE.signal} ml-auto hidden @lg:inline-flex`}>
              <Check /> ok
            </span>
          </Step>
          <Step at={[0.5, 0.57]} fx="pop" rm="hide" className="absolute top-1/2 right-[2px] size-[20px] -translate-y-1/2 rounded-full border border-bone/80 bg-bone/10 @lg:right-[10px] @lg:size-[26px]" />
        </Step>
        <span className="mt-auto flex h-[16px] shrink-0 items-center justify-around border-t border-line @lg:h-[22px]">
          {[0, 1, 2].map((tab) => (
            <span key={tab} className={`size-[5px] rounded-[1px] ${tab ? "bg-fog/50" : "bg-signal/80"}`} />
          ))}
        </span>
      </div>
    </div>
  );
}

export function PlatformsVisual() {
  return (
    <Scene
      cycle={10500}
      phases={[
        { label: "usuarios", at: [0, 0.2] },
        { label: "sincronía", at: [0.2, 0.44] },
        { label: "edición móvil", at: [0.44, 0.7] },
        { label: "consistencia", at: [0.7, END] },
      ]}
    >
      <div className="flex h-full" style={{ "--av": "13px" } as CSSProperties}>
        <Desktop />
        <Channel />
        <Phone />
      </div>
    </Scene>
  );
}

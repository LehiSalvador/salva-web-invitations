import type { CSSProperties, ReactNode } from "react";
import { cubic, Packet, PacketLayer, type Point } from "@/components/motion/Packet";
import { Step } from "@/components/motion/Step";
import { Check, curvePath, MICRO, PANEL, Scene, Wires } from "./kit";

/*
 * IA aplicada: un mensaje entra, se marcan sus fragmentos útiles, viajan al modelo y salen
 * etiquetas de clasificación y campos extraídos listos para el proceso.
 */

type Tone = "signal" | "gold" | "bone";

const HL: Record<Tone, string> = {
  signal: "bg-signal/15 border-signal",
  gold: "bg-gold-400/15 border-gold-300",
  bone: "bg-bone/10 border-bone/70",
};
const DOT: Record<Tone, string> = { signal: "bg-signal", gold: "bg-gold-300", bone: "bg-bone" };

const inputs: { y: number; tone: Tone; at: number }[] = [
  { y: 30, tone: "signal", at: 0.07 },
  { y: 50, tone: "gold", at: 0.11 },
  { y: 70, tone: "bone", at: 0.15 },
];
const into = (y: number): [Point, Point, Point, Point] => [[0, y], [24, y], [28, 50], [50, 50]];
const out = (y: number): [Point, Point, Point, Point] => [[50, 50], [72, 50], [76, y], [100, y]];

const fields: { key: string; value: string; tone: Tone; at: number }[] = [
  { key: "pedido", value: "P-07", tone: "signal", at: 0.66 },
  { key: "entrega", value: "sucursal", tone: "gold", at: 0.7 },
  { key: "fecha", value: "martes", tone: "bone", at: 0.74 },
];

function Fragment({ tone, at, children }: { tone: Tone; at: number; children: ReactNode }) {
  return (
    <span className="relative inline-block whitespace-nowrap text-bone">
      <Step as="span" at={[at, 0.94]} fx="grow-x" className={`absolute -inset-x-[2px] inset-y-[1px] origin-left rounded-[2px] border-b ${HL[tone]}`} />
      <span className="relative">{children}</span>
    </span>
  );
}

function Message() {
  return (
    <Step at={[0.02, 0.94]} fx="up" className={`${PANEL} flex w-[37%] shrink-0 flex-col self-center overflow-hidden @lg:w-[31%]`}>
      <div className="flex h-[20px] shrink-0 items-center justify-between border-b border-line px-2 @lg:h-[26px] @lg:px-2.5">
        <span className={`${MICRO} text-fog`}>mensaje</span>
        <span className={`${MICRO} flex items-center gap-2.5 text-mist`}>
          <span className="live-dot" />
          <span className="hidden @2xl:inline">canal web</span>
        </span>
      </div>
      <p className="px-2 py-2 text-[10.5px] leading-[1.6] text-mist @lg:px-3 @lg:py-3 @lg:text-[12.5px]">
        Hola, ¿puedo cambiar mi{" "}
        <Fragment tone="signal" at={0.07}>
          pedido P-07
        </Fragment>{" "}
        para recogerlo{" "}
        <Fragment tone="gold" at={0.11}>
          en sucursal
        </Fragment>{" "}
        <Fragment tone="bone" at={0.15}>
          el martes
        </Fragment>
        ? Gracias.
      </p>
      <span className="mt-auto hidden truncate border-t border-line px-3 py-2 font-mono text-[10px] leading-none text-fog @lg:block">msg-219 · por clasificar</span>
    </Step>
  );
}

function Model() {
  return (
    <div className="relative min-w-0 flex-1">
      <Wires
        paths={[
          ...inputs.map((input) => ({ d: curvePath(into(input.y)), tone: "line" as const })),
          { d: curvePath(out(22)), tone: "line" },
          { d: curvePath(out(66)), tone: "line" },
        ]}
      />
      <PacketLayer>
        {inputs.map((input, index) => (
          <Packet key={input.y} size={[100, 100]} kind="msg" tone={input.tone} route={cubic(...into(input.y), 12)} at={[0.1 + index * 0.03, 0.24 + index * 0.03]} />
        ))}
        <Packet size={[100, 100]} route={cubic(...out(22), 12)} at={[0.44, 0.54]} />
        <Packet size={[100, 100]} tone="gold" route={cubic(...out(66), 12)} at={[0.56, 0.66]} />
      </PacketLayer>

      <div className="absolute top-1/2 left-1/2 size-[42px] -translate-x-1/2 -translate-y-1/2 @lg:size-[66px]">
        <span className="spin absolute inset-0 rounded-full border border-dashed border-signal/55" style={{ "--dur": "14s" } as CSSProperties} />
        <span className="absolute inset-[5px] rounded-full border border-line-strong bg-ink-850 @lg:inset-[8px]" />
        <Step at={[0.26, 0.46]} fx="scale" rm="hide" className="absolute inset-[5px] rounded-full border border-signal bg-signal/10 @lg:inset-[8px]" />
        <svg viewBox="0 0 24 24" className="absolute inset-0 m-auto size-[16px] text-signal @lg:size-[24px]" fill="none" aria-hidden="true">
          <path d="M5 7l7-3 7 3M5 7v10l7 3 7-3V7M5 7l7 3 7-3M12 10v10" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" opacity="0.85" />
          <circle cx="12" cy="10" r="1.6" fill="currentColor" />
        </svg>

        <span className={`${MICRO} absolute bottom-full left-1/2 mb-2 -translate-x-1/2 text-bone`}>modelo</span>
        <span className="absolute top-full left-1/2 mt-2 flex -translate-x-1/2 flex-col items-center gap-1.5 whitespace-nowrap">
          <span className="relative block h-[10px] w-[78px]">
            <Step at={[0.26, 0.46]} fx="fade" rm="hide" className={`${MICRO} absolute inset-0 text-center text-mist`}>
              <span className="pulse" style={{ "--dur": "0.9s" } as CSSProperties}>
                analiza<span className="hidden @lg:inline">ndo</span>
              </span>
            </Step>
            <Step at={[0.46, 0.94]} fx="fade" className={`${MICRO} absolute inset-0 flex items-center justify-center gap-1 text-signal`}>
              <Check /> listo
            </Step>
          </span>
          <span className="hidden font-mono text-[10px] leading-none text-fog @lg:block">proveedor IA 1</span>
        </span>
      </div>
    </div>
  );
}

const CHIP = "h-[16px] items-center gap-1 rounded-[2px] border px-1.5 font-mono text-[10px] leading-none @lg:h-[20px] @lg:text-[10.5px]";

function Outputs() {
  return (
    <div className="relative w-[38%] shrink-0 @lg:w-[34%]">
      <div className="absolute inset-x-0 top-[4%] flex flex-col gap-1.5 @lg:gap-2">
        <span className={`${MICRO} text-fog`}>clasificación</span>
        <span className="flex flex-wrap gap-1 @lg:gap-1.5">
          <Step as="span" at={[0.54, 0.94]} fx="pop" className={`${CHIP} inline-flex border-signal/50 bg-signal/10 text-signal`}>
            cambio de entrega
          </Step>
          <Step as="span" at={[0.57, 0.94]} fx="pop" className={`${CHIP} inline-flex border-gold-400/50 bg-gold-400/10 text-gold-300`}>
            prioridad media
          </Step>
          <Step as="span" at={[0.6, 0.94]} fx="pop" className={`${CHIP} hidden border-cool/50 bg-cool/10 text-cool @lg:inline-flex`}>
            atención
          </Step>
        </span>
      </div>

      <div className="absolute inset-x-0 top-[46%] flex flex-col gap-1.5 @lg:gap-2">
        <span className={`${MICRO} text-fog`}>campos extraídos</span>
        <span className="flex flex-col">
          {fields.map((field) => (
            <span key={field.key} className="flex h-[17px] items-center gap-2 border-b border-line @lg:h-[22px]">
              <span className="w-[46px] shrink-0 font-mono text-[10px] leading-none text-fog @lg:w-[60px]">{field.key}</span>
              <span className="relative flex h-full flex-1 items-center">
                <span className="h-[3px] w-[64%] rounded-[1px] bg-line-strong" />
                <Step at={[field.at, 0.94]} fx="left" className="absolute inset-0 flex items-center gap-1.5 font-mono text-[10px] leading-none text-bone @lg:text-[11px]">
                  <span className="absolute inset-y-[2px] inset-x-0 bg-ink-900" />
                  <span className={`relative size-[5px] shrink-0 rounded-full ${DOT[field.tone]}`} />
                  <span className="relative">{field.value}</span>
                </Step>
              </span>
            </span>
          ))}
        </span>
      </div>

      <Step at={[0.8, 0.94]} fx="up" className={`${MICRO} absolute bottom-0 left-0 hidden items-center gap-1.5 text-gold-300 @lg:flex`}>
        <span className="size-[6px] rounded-full bg-gold-300" /> respuesta lista
      </Step>
    </div>
  );
}

export function AiVisual() {
  return (
    <Scene
      cycle={10500}
      phases={[
        { label: "lectura", at: [0, 0.2] },
        { label: "modelo", at: [0.2, 0.44] },
        { label: "clasificación", at: [0.44, 0.66] },
        { label: "extracción", at: [0.66, 0.94] },
      ]}
    >
      <div className="flex h-full">
        <Message />
        <Model />
        <Outputs />
      </div>
    </Scene>
  );
}

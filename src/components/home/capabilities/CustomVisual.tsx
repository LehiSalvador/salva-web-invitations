import { cubic, Packet, PacketLayer, type Point } from "@/components/motion/Packet";
import { Step } from "@/components/motion/Step";
import styles from "./CapabilityVisuals.module.css";
import { Check, curvePath, linePath, MICRO, PANEL, Scene, Wires } from "./kit";

/*
 * Soluciones a medida: cada requerimiento pasa por diseño y se convierte en un módulo que encaja
 * exactamente en su hueco de una estructura hecha para ese negocio.
 * Todo el escenario usa coordenadas normalizadas (0–100), así que paquetes, cables y huecos coinciden en cualquier ancho.
 */

const FRAME = { x: 46, w: 54 };
const D: Point = [39, 50];

type Box = { x: number; y: number; w: number; h: number };
/** Hueco en coordenadas de la estructura → coordenadas del escenario. */
const slot = (fx: number, fy: number, fw: number, fh: number): Box => ({ x: FRAME.x + (fx * FRAME.w) / 100, y: fy, w: (fw * FRAME.w) / 100, h: fh });
const center = (box: Box): Point => [box.x + box.w / 2, box.y + box.h / 2];
const boxStyle = (box: Box) => ({ left: `${box.x}%`, top: `${box.y}%`, width: `${box.w}%`, height: `${box.h}%` });

const items = [
  { need: "Cotizar en línea", short: "Cotizar", module: "Cotizador", box: slot(5, 5, 53, 26), glyph: "M1 2.5h11M1 6.5h8M1 10.5h10M15 4.5h8v8h-8z" },
  { need: "Stock en tiempo real", short: "Stock", module: "Inventario", short2: "Stock", box: slot(62, 5, 33, 53), glyph: "M2 7h8v6H2zM12 7h8v6h-8zM7 1h8v6H7z" },
  { need: "Reportes por sucursal", short: "Reportes", module: "Reportes", box: slot(5, 35, 53, 23), glyph: "M2 13V8M7 13V4M12 13V6M17 13V1.5" },
  { need: "Accesos por rol", short: "Accesos", module: "Roles", box: slot(62, 62, 33, 33), glyph: "M8 1.5l5.5 2v4c0 3-2.4 5-5.5 6-3.1-1-5.5-3-5.5-6v-4zM8 6v3" },
];
const base = slot(5, 62, 53, 33);

const CARD_Y = [12.5, 37.5, 62.5, 87.5];
const DEPART = (index: number) => 0.2 + index * 0.115;
const ARRIVE = (index: number) => DEPART(index) + 0.12;

const toDesign = (y: number): [Point, Point, Point, Point] => [[32, y], [36, y], [35.5, 50], D];
const toSlot = (target: Point): [Point, Point, Point, Point] => [D, [45, 50], [target[0] - 10, target[1]], target];

function Requirements() {
  return (
    <>
      {items.map((item, index) => (
        <Step
          key={item.need}
          at={[0.02 + index * 0.03, 0.94]}
          fx="left"
          className={`${PANEL} absolute left-0 flex w-[32%] flex-col justify-center gap-1 overflow-hidden pr-6 pl-2 @lg:pr-7 @lg:pl-2.5`}
          style={{ top: `${CARD_Y[index] - 10.5}%`, height: "21%" }}
        >
          <span className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] leading-none text-gold-300">R{index + 1}</span>
            <span className="truncate text-[10.5px] leading-tight text-bone @lg:text-[11.5px] @2xl:hidden">{item.short}</span>
            <span className="hidden truncate text-[12px] leading-tight text-bone @2xl:inline">{item.need}</span>
          </span>
          <span className="hidden font-mono text-[10px] leading-none text-fog @lg:block">requerimiento</span>
          <Step at={[DEPART(index), 0.94]} fx="fade" className="absolute inset-0 flex items-center justify-end bg-ink-900/55 pr-2 text-signal @lg:pr-2.5">
            <Check />
          </Step>
        </Step>
      ))}
    </>
  );
}

function Structure() {
  return (
    <div className={`${styles.blueprint} absolute inset-y-0 rounded-[3px] border border-cool/30 bg-ink-900/80`} style={{ left: `${FRAME.x}%`, width: `${FRAME.w}%` }} />
  );
}

export function CustomVisual() {
  return (
    <Scene
      cycle={11500}
      phases={[
        { label: "diagnóstico", at: [0, 0.2] },
        { label: "diseño", at: [0.2, 0.42] },
        { label: "implementación", at: [0.42, 0.7] },
        { label: "a medida", at: [0.7, 0.94] },
      ]}
    >
      <Wires
        paths={[
          ...CARD_Y.map((y) => ({ d: curvePath(toDesign(y)), tone: "line" as const })),
          { d: linePath([D, [FRAME.x, 50]]), tone: "line" },
        ]}
      />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 hidden size-full @lg:block" fill="none" aria-hidden="true">
        <path d={`M${D[0]} 2V98`} vectorEffect="non-scaling-stroke" className="stroke-line-strong" />
        {Array.from({ length: 25 }, (_, tick) => (
          <path key={tick} d={`M${D[0] - (tick % 4 ? 0.5 : 1)} ${2 + tick * 4}H${D[0]}`} vectorEffect="non-scaling-stroke" className="stroke-fog/50" />
        ))}
      </svg>

      <Structure />
      {items.map((item) => (
        <span key={item.module} className={`${styles.slot} absolute`} style={boxStyle(item.box)} />
      ))}
      <span className="absolute flex items-center justify-between gap-2 rounded-[2px] border border-cool/40 bg-cool/[0.07] px-2" style={boxStyle(base)}>
        <span className={`${MICRO} text-cool`}>
          núcleo<span className="hidden @lg:inline"> de datos</span>
        </span>
      </span>

      <Requirements />

      <PacketLayer>
        {items.map((item, index) => (
          <Packet
            key={item.need}
            size={[100, 100]}
            kind="doc"
            tone="gold"
            route={[...cubic(...toDesign(CARD_Y[index]), 8), ...cubic(...toSlot(center(item.box)), 10).slice(1)]}
            at={[DEPART(index), ARRIVE(index)]}
          />
        ))}
      </PacketLayer>

      {/* Diseño: todo requerimiento se mide antes de construirse. */}
      <span className={`${MICRO} absolute top-0 hidden -translate-x-1/2 -translate-y-[calc(100%+2px)] bg-ink-900 px-1 text-gold-300 @lg:block`} style={{ left: `${D[0]}%` }}>
        diseño
      </span>
      <div className="absolute size-[14px] -translate-x-1/2 -translate-y-1/2 @lg:size-[20px]" style={{ left: `${D[0]}%`, top: `${D[1]}%` }}>
        <span className="absolute inset-0 rotate-45 rounded-[2px] border border-gold-300 bg-ink-900" />
        <Step at={[0.2, 0.67]} fx="scale" className="absolute inset-[3px] rotate-45 rounded-[1px] bg-gold-300/70 @lg:inset-[5px]" />
      </div>

      {items.map((item, index) => (
        <Step
          key={item.module}
          at={[ARRIVE(index), 0.94]}
          fx="down"
          className="absolute flex flex-col justify-between overflow-hidden rounded-[2px] border border-signal/60 bg-[color-mix(in_srgb,var(--color-signal)_13%,var(--color-ink-900))] p-1.5 @lg:p-2"
          style={boxStyle(item.box)}
        >
          <span className="h-[2px] w-[34%] min-w-[12px] rounded-full bg-signal/70 @lg:hidden" />
          <svg viewBox="0 0 24 14" className="hidden h-[14px] w-[24px] text-signal @lg:block" fill="none" aria-hidden="true">
            <path d={item.glyph} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="truncate font-mono text-[10px] leading-none text-bone @lg:text-[10.5px]">
            <span className="@lg:hidden">{item.short2 ?? item.module}</span>
            <span className="hidden @lg:inline">{item.module}</span>
          </span>
        </Step>
      ))}

      <Step at={[0.72, 0.94]} fx="fade" className="absolute inset-y-0 rounded-[3px] border border-gold-300/80" style={{ left: `${FRAME.x}%`, width: `${FRAME.w}%` }} />
      <Step
        at={[0.74, 0.94]}
        fx="pop"
        className={`${MICRO} absolute flex -translate-y-1/2 items-center gap-1 rounded-[2px] border border-gold-300/60 bg-ink-900 px-1.5 py-1 text-gold-300`}
        style={{ right: "3%", top: 0 }}
      >
        <Check /> a medida
      </Step>
    </Scene>
  );
}

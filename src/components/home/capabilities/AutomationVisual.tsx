import type { CSSProperties } from "react";
import { cubic, Packet, PacketLayer, type Point } from "@/components/motion/Packet";
import { Step } from "@/components/motion/Step";
import styles from "./CapabilityVisuals.module.css";
import { Check, curvePath, linePath, MICRO, PANEL, pos, Scene, Wires } from "./kit";

/*
 * Automatización: un disparador manda el evento a una condición; si se cumple, se ramifica en tres
 * acciones que se encienden (interruptores) y cada una deja su notificación.
 */

const T: Point = [12, 50];
const C: Point = [41, 50];
const actions = [
  { y: 17, title: "Inventario", sub: "descontar stock", note: "Inventario actualizado", id: "op-014", icon: "box" },
  { y: 50, title: "Factura", sub: "generar y enviar", note: "Factura emitida", id: "op-015", icon: "doc" },
  { y: 83, title: "Avisar equipo", sub: "canal interno", note: "Equipo avisado", id: "op-016", icon: "bell" },
] as const;

const A = (y: number): Point => [79, y];
const branch = (y: number): [Point, Point, Point, Point] => [C, [62, 50], [58, y], A(y)];
const ARRIVE = (index: number) => 0.42 + index * 0.03;
const NOTE = (index: number) => 0.6 + index * 0.04;

const NODE = "absolute -translate-x-1/2 -translate-y-1/2";

function Icon({ name }: { name: "bolt" | "box" | "doc" | "bell" | "diamond" }) {
  const paths = {
    bolt: <path d="M6.5 1 2.5 7h3l-1 4 4-6h-3z" fill="currentColor" />,
    box: <path d="M1.5 3.5 6 1.5l4.5 2v5L6 10.5l-4.5-2zM1.5 3.5 6 5.5l4.5-2M6 5.5v5" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />,
    doc: <path d="M2.5 1h5l2 2v8h-7zM4 5h4M4 7h4M4 9h2.5" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />,
    bell: <path d="M3 8.5V5.5a3 3 0 0 1 6 0v3l1 1H2zM5 10.5h2" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />,
    diamond: <path d="M6 1 11 6 6 11 1 6z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />,
  };
  return (
    <svg viewBox="0 0 12 12" className="size-[11px] shrink-0" fill="none" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function Flow() {
  return (
    <div className="relative min-w-0 flex-1">
      <Wires
        paths={[
          { d: linePath([T, C]), tone: "line" },
          ...actions.map((action) => ({ d: curvePath(branch(action.y)), tone: "line" as const })),
        ]}
      />
      <Wires className="hidden @2xl:block" paths={actions.map((action) => ({ d: linePath([A(action.y), [100, action.y]]), dashed: true }))} />

      <PacketLayer>
        <Packet size={[100, 100]} kind="msg" route={[T, C]} at={[0.08, 0.22]} />
        {actions.map((action, index) => (
          <Packet key={action.y} size={[100, 100]} route={cubic(...branch(action.y), 14)} at={[0.3 + index * 0.03, ARRIVE(index)]} />
        ))}
      </PacketLayer>
      <PacketLayer className="hidden @2xl:block">
        {actions.map((action, index) => (
          <Packet key={action.y} size={[100, 100]} tone="gold" route={[A(action.y), [100, action.y]]} at={[NOTE(index) - 0.1, NOTE(index)]} />
        ))}
      </PacketLayer>

      {/* Disparador */}
      <div className={`${NODE} w-[74px] @lg:w-[108px]`} style={pos(...T)}>
        <div className={`${PANEL} relative px-1.5 py-1.5 @lg:px-2.5 @lg:py-2`}>
          <span className={`${MICRO} flex items-center gap-1 text-signal`}>
            <Icon name="bolt" />
            <span className="@lg:hidden">evento</span>
            <span className="hidden @lg:inline">disparador</span>
          </span>
          <span className="mt-1.5 block text-[10.5px] leading-tight text-bone @lg:text-[12px]">Nuevo pedido</span>
          <span className="mt-1 hidden font-mono text-[10px] leading-none text-fog @lg:block">webhook</span>
          <Step at={[0.04, 0.13]} fx="scale" rm="hide" className="absolute -inset-[5px] rounded-[5px] border border-signal/80" />
        </div>
        <Step at={[0.04, 0.94]} fx="down" className="absolute top-full left-0 mt-1.5 flex items-center gap-1 font-mono text-[10px] leading-none whitespace-nowrap text-mist">
          <span className="size-[5px] rounded-full bg-signal" />
          pedido.creado
        </Step>
      </div>

      {/* Condición */}
      <div className={`${NODE} w-[66px] @lg:w-[104px]`} style={pos(...C)}>
        <div className={`${PANEL} px-1.5 py-1.5 @lg:px-2.5 @lg:py-2`}>
          <span className={`${MICRO} flex items-center gap-1 text-cool`}>
            <Icon name="diamond" />
            <span className="hidden @lg:inline">condición</span>
            <span className="@lg:hidden">regla</span>
          </span>
          <span className="mt-1.5 block text-[10.5px] leading-tight text-bone @lg:text-[12px]">¿Pagado?</span>
          <span className="relative mt-1.5 block h-[14px]">
            <Step at={[0.21, 0.31]} fx="fade" rm="hide" className="absolute inset-0 flex items-center font-mono text-[10px] leading-none text-fog">
              <span className="pulse" style={{ "--dur": "0.8s" } as CSSProperties}>
                evalúa…
              </span>
            </Step>
            <Step at={[0.3, 0.94]} fx="pop" className={`${MICRO} absolute inset-y-0 left-0 flex items-center gap-1 rounded-[2px] bg-signal/15 px-1 text-signal`}>
              <Check /> sí
            </Step>
          </span>
        </div>
      </div>

      {/* Acciones */}
      {actions.map((action, index) => (
        <div key={action.y} className={`${NODE} w-[118px] @lg:w-[172px]`} style={pos(...A(action.y))}>
          <div className={`${PANEL} relative flex items-center gap-2 px-1.5 py-1.5 @lg:px-2 @lg:py-2`}>
            <span className="hidden size-[20px] shrink-0 place-items-center rounded-[2px] bg-signal/10 text-signal @lg:grid">
              <Icon name={action.icon} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[10.5px] leading-tight text-bone @lg:text-[11.5px]">{action.title}</span>
              <span className="mt-0.5 hidden truncate font-mono text-[10px] leading-none text-fog @lg:block">{action.sub}</span>
            </span>
            <span className={styles.toggle} />
            <Step at={[ARRIVE(index), 0.94]} fx="fade" className="absolute -inset-px rounded-[3px] border border-signal/70">
              <span className={`${styles.toggleOn} absolute top-1/2 right-[6px] -translate-y-1/2 @lg:right-[8px]`} />
            </Step>
            <Step at={[ARRIVE(index), 0.94]} fx="left" className="absolute top-1/2 right-[9px] -mt-[3px] size-[6px] rounded-full bg-signal @lg:right-[11px]" />
          </div>
        </div>
      ))}

      {/* Resultado compacto cuando no hay columna de notificaciones. */}
      <Step at={[0.62, 0.94]} fx="up" className={`${PANEL} absolute bottom-0 left-0 flex items-center gap-1.5 px-1.5 py-1 text-signal @2xl:hidden`}>
        <Check />
        <span className={`${MICRO} text-bone`}>flujo completo</span>
      </Step>
    </div>
  );
}

function Notifications() {
  return (
    <div className={`${PANEL} hidden w-[188px] shrink-0 flex-col overflow-hidden @2xl:flex`}>
      <div className="flex h-[26px] shrink-0 items-center justify-between border-b border-line px-2.5">
        <span className={`${MICRO} text-fog`}>notificaciones</span>
        <span className="live-dot mr-1" />
      </div>
      <ul className="flex flex-col">
        {actions.map((action, index) => (
          <Step as="li" key={action.y} at={[NOTE(index), 0.94]} fx="left" className="flex items-start gap-2 border-b border-line px-2.5 py-2">
            <span className={`mt-px grid size-[18px] shrink-0 place-items-center rounded-full ${index === 2 ? "bg-gold-400/15 text-gold-300" : "bg-signal/15 text-signal"}`}>
              <Icon name={action.icon} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[11.5px] leading-tight text-bone">{action.note}</span>
              <span className="mt-1 block font-mono text-[10px] leading-none text-fog">
                {action.id} · ahora
              </span>
            </span>
          </Step>
        ))}
      </ul>
      <Step at={[0.74, 0.94]} fx="fade" className={`${MICRO} mt-auto flex items-center gap-1.5 px-2.5 py-2 text-signal`}>
        <Check /> sin pasos manuales
      </Step>
    </div>
  );
}

export function AutomationVisual() {
  return (
    <Scene
      cycle={10000}
      phases={[
        { label: "disparo", at: [0, 0.22] },
        { label: "condición", at: [0.22, 0.4] },
        { label: "acciones", at: [0.4, 0.58] },
        { label: "avisos", at: [0.58, 0.94] },
      ]}
    >
      <div className="flex h-full gap-4">
        <Flow />
        <Notifications />
      </div>
    </Scene>
  );
}

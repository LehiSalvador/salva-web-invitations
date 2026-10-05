import type { CSSProperties } from "react";
import { cubic, Packet, PacketLayer, type Point } from "@/components/motion/Packet";
import { Step } from "@/components/motion/Step";
import styles from "./CapabilityVisuals.module.css";
import { Check, curvePath, END, linePath, MICRO, PANEL, pos, Scene, TRUNC, Wires } from "./kit";

/*
 * Automatización: un disparador manda el evento a una condición; si se cumple ("sí"), se ramifica en tres
 * acciones que se encienden y cada una deja su notificación (las anteriores bajan en el historial).
 * Si no se cumpliera, la rama "no" espera el pago.
 */

const CYCLE = 9500;
const T: Point = [12, 50];
const C: Point = [41, 50];
const NO: Point = [41, 87];
const actions = [
  { y: 17, title: "Inventario", sub: "descontar stock", note: "Inventario actualizado", id: "op-014", icon: "box" },
  { y: 50, title: "Factura", sub: "generar y enviar", note: "Factura emitida", id: "op-015", icon: "doc" },
  { y: 83, title: "Avisar equipo", sub: "canal interno", note: "Equipo avisado", id: "op-016", icon: "bell" },
] as const;
const history = [
  { note: "Factura emitida", id: "op-012", icon: "doc" },
  { note: "Inventario actualizado", id: "op-011", icon: "box" },
] as const;

const A = (y: number): Point => [79, y];
const branch = (y: number): [Point, Point, Point, Point] => [C, [62, 50], [58, y], A(y)];
const ARRIVE = (index: number) => 0.34 + index * 0.03;
/** Debe coincidir con @keyframes history del CSS (0.44, 0.49, 0.54). */
const NOTE = (index: number) => 0.44 + index * 0.05;

const NODE = "absolute -translate-x-1/2 -translate-y-1/2";

type IconName = "bolt" | "box" | "doc" | "bell" | "diamond";

function Icon({ name }: { name: IconName }) {
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
          { d: linePath([C, NO]), dashed: true },
        ]}
      />
      <Wires className="hidden @2xl:block" paths={actions.map((action) => ({ d: linePath([A(action.y), [100, action.y]]), dashed: true }))} />

      <PacketLayer>
        <Packet size={[100, 100]} kind="msg" route={[T, C]} at={[0.05, 0.15]} />
        {actions.map((action, index) => (
          <Packet key={action.y} size={[100, 100]} route={cubic(...branch(action.y), 14)} at={[0.26 + index * 0.03, ARRIVE(index)]} />
        ))}
      </PacketLayer>
      <PacketLayer className="hidden @2xl:block">
        {actions.map((action, index) => (
          <Packet key={action.y} size={[100, 100]} tone="gold" route={[A(action.y), [100, action.y]]} at={[NOTE(index) - 0.06, NOTE(index)]} />
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
          <span className="mt-1 hidden font-mono text-[10px] leading-[1.35] text-fog @lg:block">webhook</span>
          <Step at={[0.03, 0.11]} fx="scale" rm="hide" className="absolute -inset-[5px] rounded-[5px] border border-signal/80" />
        </div>
        <Step at={[0.03, END]} fx="down" className="absolute top-full left-0 mt-1.5 flex items-center gap-1 font-mono text-[10px] leading-none whitespace-nowrap text-mist">
          <span className="size-[5px] rounded-full bg-signal" />
          pedido.creado
        </Step>
      </div>

      {/* Condición: se resalta mientras evalúa; la rama "no" queda atenuada. */}
      <div className={`${NODE} w-[70px] @lg:w-[104px]`} style={pos(...C)}>
        <div className={`${PANEL} relative px-1.5 py-1.5 @lg:px-2.5 @lg:py-2`}>
          <span className={`${MICRO} flex items-center gap-1 text-cool`}>
            <Icon name="diamond" />
            <span className="hidden @lg:inline">condición</span>
            <span className="@lg:hidden">regla</span>
          </span>
          <span className="mt-1.5 block text-[10.5px] leading-tight text-bone @lg:text-[12px]">¿Pagado?</span>
          <span className="relative mt-1.5 block h-[14px]">
            <span className="absolute inset-y-0 left-0 flex items-center font-mono text-[10px] leading-none text-mist">sí / no</span>
            <Step at={[0.25, END]} fx="pop" className={`${MICRO} absolute inset-y-0 left-0 flex min-w-[46px] items-center gap-1 rounded-[2px] bg-[color-mix(in_srgb,var(--color-signal)_16%,var(--color-ink-900))] px-1 text-signal`}>
              <Check /> sí
            </Step>
          </span>
          <Step at={[0.14, 0.3]} fx="fade" rm="hide" className="absolute -inset-px rounded-[3px] border border-signal bg-signal/[0.06]" />
        </div>
      </div>
      <div className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-[2px] border border-dashed border-line-strong bg-ink-900 px-1.5 py-[3px] font-mono text-[10px] leading-[1.35] whitespace-nowrap text-fog" style={pos(...NO)}>
        no · <span className="@lg:hidden">espera</span>
        <span className="hidden @lg:inline">esperar pago</span>
      </div>

      {/* Acciones: el interruptor se enciende cuando llega su paquete. */}
      {actions.map((action, index) => (
        <div key={action.y} className={`${NODE} w-[118px] @lg:w-[172px]`} style={pos(...A(action.y))}>
          <div className={`${PANEL} relative flex items-center gap-2 px-1.5 py-1.5 @lg:px-2 @lg:py-2`}>
            <span className="hidden size-[20px] shrink-0 place-items-center rounded-[2px] bg-signal/10 text-signal @lg:grid">
              <Icon name={action.icon} />
            </span>
            <span className="min-w-0 flex-1">
              <span className={`${TRUNC} block text-[10.5px] text-bone @lg:text-[11.5px]`}>{action.title}</span>
              <span className={`${TRUNC} hidden font-mono text-[10px] text-fog @lg:block`}>{action.sub}</span>
            </span>
            <span className={styles.toggle} />
            <Step at={[ARRIVE(index), END]} fx="fade" className="absolute -inset-px rounded-[3px] border border-signal/70">
              <span className={`${styles.toggleOn} absolute top-1/2 right-[6px] -translate-y-1/2 @lg:right-[8px]`} />
            </Step>
          </div>
        </div>
      ))}

      {/* Resultado compacto cuando no hay columna de notificaciones. */}
      <Step at={[0.46, END]} fx="down" className={`${PANEL} absolute top-0 left-0 flex items-center gap-1.5 px-1.5 py-1 text-signal @2xl:hidden`}>
        <Check />
        <span className={`${MICRO} text-bone`}>flujo completo</span>
      </Step>
    </div>
  );
}

function Note({ icon, note, id, when, tone = "signal" }: { icon: IconName; note: string; id: string; when: string; tone?: "signal" | "gold" }) {
  return (
    <>
      <span className={`mt-px grid size-[18px] shrink-0 place-items-center rounded-full ${tone === "gold" ? "bg-gold-400/15 text-gold-300" : "bg-signal/15 text-signal"}`}>
        <Icon name={icon} />
      </span>
      <span className="min-w-0">
        <span className={`${TRUNC} block text-[11.5px] text-bone`}>{note}</span>
        <span className="block font-mono text-[10px] leading-[1.35] text-fog">
          {id} · {when}
        </span>
      </span>
    </>
  );
}

const NOTE_ROW = "flex h-[42px] shrink-0 items-center gap-2 border-b border-line px-2.5";

function Notifications() {
  return (
    <div className={`${PANEL} hidden w-[188px] shrink-0 flex-col overflow-hidden @2xl:flex`}>
      <div className="flex h-[26px] shrink-0 items-center justify-between border-b border-line px-2.5">
        <span className={`${MICRO} text-fog`}>notificaciones</span>
        <span className="live-dot mr-1" />
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {/* Las nuevas entran arriba y el historial baja una fila por cada una. */}
        <ul className={`${styles.history} flex flex-col`} style={{ "--row": "42px" } as CSSProperties}>
          {[...actions].reverse().map((action) => {
            const index = actions.indexOf(action);
            return (
              <Step as="li" key={action.id} at={[NOTE(index), END]} fx="fade" className={NOTE_ROW}>
                <Note icon={action.icon} note={action.note} id={action.id} when="ahora" tone={index === 2 ? "gold" : "signal"} />
              </Step>
            );
          })}
          {history.map((item) => (
            <li key={item.id} className={`${NOTE_ROW} opacity-40`}>
              <Note icon={item.icon} note={item.note} id={item.id} when="antes" />
            </li>
          ))}
        </ul>
      </div>
      <Step at={[0.6, END]} fx="fade" className={`${MICRO} flex shrink-0 items-center gap-1.5 border-t border-line px-2.5 py-2 text-signal`}>
        <Check /> sin pasos manuales
      </Step>
    </div>
  );
}

export function AutomationVisual() {
  return (
    <Scene
      cycle={CYCLE}
      phases={[
        { label: "disparo", at: [0, 0.15] },
        { label: "condición", at: [0.15, 0.3] },
        { label: "acciones", at: [0.3, 0.44] },
        { label: "avisos", at: [0.44, END] },
      ]}
    >
      <div className="flex h-full gap-4">
        <Flow />
        <Notifications />
      </div>
    </Scene>
  );
}

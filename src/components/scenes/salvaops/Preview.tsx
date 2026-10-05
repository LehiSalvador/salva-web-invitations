import type { CSSProperties } from "react";
import { Packet, PacketLayer, type Point } from "@/components/motion/Packet";
import { Step } from "@/components/motion/Step";
import s from "../SalvaOpsScene.module.css";
import { agents, history, keyframes, ops, orth, stair } from "./model";

/*
 * Vista previa compacta: dos proyectos aislados, broker con compuerta de política, dos proveedores
 * y el libro de evidencia. Usa las tres primeras operaciones de la escena (permitida, permitida, bloqueada).
 * Animaciones: 3 tarjetas (6) + 3 veredictos + 3 registros + la fila "última" del broker (CSS) = 13.
 */

const W = 640;
const H = 400;
const CYCLE = 9000;
const Y = 120; // canal del broker
const GATE = 430; // compuerta (dentro del broker, a la derecha)

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");
const cap = (extra = "") => cx(s.pCap, /(^|\s)text-/.test(extra) ? extra : `text-fog ${extra}`);

type Box = readonly [number, number, number, number];
const box = ([x, y, w, h]: Box): CSSProperties =>
  ({ "--x": `${(x / W) * 100}%`, "--y": `${(y / H) * 100}%`, "--w": `${(w / W) * 100}%`, "--h": `${(h / H) * 100}%` }) as CSSProperties;

function At({ b, className, children }: { b: Box; className?: string; children?: React.ReactNode }) {
  return (
    <div className={cx(s.pAt, className)} style={box(b)}>
      {children}
    </div>
  );
}

const nodes = {
  a: [10, 34, 132, 74] as Box,
  b: [10, 130, 132, 74] as Box,
  broker: [180, 34, 280, 170] as Box,
  ia1: [500, 34, 126, 74] as Box,
  ia2: [500, 130, 126, 74] as Box,
};

/** Zonas del broker: operación en curso (sobre el canal), lámparas y última operación (bajo el canal). */
const inspect: Box = [192, 75, 256, 20];
const lamps: Box = [188, 140, 266, 24];
const last: Box = [192, 172, 256, 24];

const port = { a: [142, 71] as Point, b: [142, 167] as Point };
const lane = { ia1: 71, ia2: 167 };

const head = (from: Point): Point[] => [from, [161, from[1]], [161, Y], [180, Y], [GATE, Y]];
const toLane = (y: number): Point[] => [[460, Y], [480, Y], [480, y], [494, y]];

const length = (points: Point[], upto = points.length - 1) =>
  points.slice(1, upto + 1).reduce((sum, [x, y], index) => sum + Math.hypot(x - points[index][0], y - points[index][1]), 0);

/** Tarjeta: ventana [inicio, salida], llegada al destino y el instante en que alcanza la compuerta. */
function card(index: number, start: number, arrive: number, out: number) {
  const item = ops[index];
  const project = agents[item.agent].project;
  const blocked = item.to === "bloqueada";
  const route: Point[] = blocked ? [...head(port[project]).slice(0, 4), [GATE - 40, Y]] : [...head(port[project]), ...toLane(lane[item.to as "ia1" | "ia2"])];
  const gate = blocked ? arrive : start + (length(route, 4) / length(route)) * (arrive - start);
  return { item, project, route, at: [start, out] as [number, number], hold: (out - arrive) / (out - start), gate, arrive };
}

const cards = [card(0, 0.02, 0.26, 0.28), card(1, 0.31, 0.55, 0.57), card(2, 0.6, 0.73, 0.88)];

const ledgerAt = (index: number) => Number((cards[index].item.to === "bloqueada" ? cards[index].gate + 0.04 : cards[index].arrive + 0.015).toFixed(3));

/** Fila "última" del broker: la última operación resuelta, en gris, siempre visible (también al empezar el ciclo). */
const lastStates = [cards[2], cards[0], cards[1], cards[2]];
const LAST_ROW = 1.4; // em
export const previewCss = keyframes(
  "sops-p-last",
  "transform",
  stair(
    [
      { at: ledgerAt(0), value: `translateY(${-LAST_ROW}em)` },
      { at: ledgerAt(1), value: `translateY(${-2 * LAST_ROW}em)` },
      { at: ledgerAt(2), value: `translateY(${-3 * LAST_ROW}em)` },
    ],
    "translateY(0em)",
  ),
);

const wires = [
  orth(head(port.a).slice(0, 4), 8),
  orth(head(port.b).slice(0, 4), 8),
  orth([[460, Y], [480, Y], [480, lane.ia1], [500, lane.ia1]], 8),
  orth([[460, Y], [480, Y], [480, lane.ia2], [500, lane.ia2]], 8),
];
const open = {
  ia1: orth([[GATE, Y], [480, Y], [480, lane.ia1], [500, lane.ia1]], 8),
  ia2: orth([[GATE, Y], [480, Y], [480, lane.ia2], [500, lane.ia2]], 8),
};

function Lamp({ label, state }: { label: string; state?: "ok" | "no" }) {
  return (
    <span className="flex items-center gap-[0.35em]">
      <span className={cx(s.lamp, state === "ok" && s.lampOk, state === "no" && s.lampNo)}>{state === "ok" ? "✓" : state === "no" ? "✕" : ""}</span>
      <span className={cx(s.mono, state === "no" ? "text-rose" : state === "ok" ? "text-signal" : "text-fog")}>{label}</span>
    </span>
  );
}

function Lamps({ verdict }: { verdict?: "ok" | "no" }) {
  return (
    <>
      <Lamp label="permisos" state={verdict && "ok"} />
      <Lamp label="alcance" state={verdict} />
    </>
  );
}

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={s.svg} aria-hidden="true">
      {children}
    </svg>
  );
}

const lampRow = cx(s.pCap, s.pLamps, "flex items-center gap-[0.9em] !normal-case !tracking-normal");
const lineRow = cx(s.pCap, "flex items-center gap-[0.6em] !normal-case !tracking-normal");

export function Preview() {
  return (
    <div className={s.preview} aria-hidden="true" data-live data-cycle={CYCLE}>
      <style dangerouslySetInnerHTML={{ __html: previewCss }} />
      <div className={s.pStage}>
        <Svg>
          <rect x="4" y="17" width="470" height="196" rx="10" className={s.boundary} />
          {wires.map((d) => (
            <path key={d} d={d} className={s.wire} />
          ))}
        </Svg>

        <At b={[14, 6, 300, 22]} className="flex items-center">
          <span className={cx(s.boundaryChip, s.pCap, "h-full")}>
            local-first<span className={s.pWide}>&nbsp;· en tu equipo</span>
          </span>
        </At>

        {(["a", "b"] as const).map((id) => (
          <At key={id} b={nodes[id]} className={cx(s.sandbox, "flex flex-col justify-center px-[0.5em]", s.pText)}>
            <span className="font-medium whitespace-nowrap text-bone">Proyecto {id.toUpperCase()}</span>
            <span className={cx(s.pCap, "mt-[0.3em] !normal-case !tracking-normal text-signal")}>2 agentes</span>
          </At>
        ))}

        <At b={nodes.broker} className={s.node}>
          <div className="flex items-center justify-between px-[0.8em] pt-[0.45em]">
            <span className={cap("text-bone")}>Broker</span>
            <span className={cap(s.pWide)}>política</span>
          </div>
        </At>
        <At b={lamps} className={lampRow}>
          <Lamps />
        </At>
        <At b={last} className={lineRow}>
          <span className="text-fog">última</span>
          <span className={s.pLastView}>
            <span className={cx(s.pLastStack, s.timeline)} style={{ animation: `sops-p-last ${CYCLE}ms linear infinite` }}>
              {lastStates.map(({ item }, index) => (
                <span key={index} className={cx(s.mono, "block text-fog")}>
                  {item.id} {item.to === "bloqueada" ? "✕" : "✓"}
                </span>
              ))}
            </span>
          </span>
        </At>

        {(["ia1", "ia2"] as const).map((id) => (
          <At key={id} b={nodes[id]} className={cx(s.node, "flex flex-col justify-center px-[0.7em]")}>
            <span className={cx(s.pText, "text-fog")}>Proveedor</span>
            <span className={cx(s.pText, "font-medium text-bone")}>IA {id === "ia1" ? "1" : "2"}</span>
          </At>
        ))}

        <Svg>
          <rect x="180" y={Y - 11} width="280" height="22" className={s.track} />
          <path d={`M186 ${Y}H454`} className={s.ticks} />
          <path d={`M${GATE} ${Y - 26}V${Y - 14}M${GATE} ${Y + 14}V${Y + 26}`} className={s.post} />
        </Svg>

        {cards.map(({ item, gate, arrive, at }) => {
          const blocked = item.to === "bloqueada";
          const target = blocked ? null : (item.to as "ia1" | "ia2");
          return (
            <Step
              key={item.id}
              at={[Number((gate - (blocked ? 0.02 : 0.012)).toFixed(3)), Number((blocked ? at[1] : arrive + 0.03).toFixed(3))]}
              fx="fade"
              rm={blocked ? undefined : "hide"}
              className={s.layer}
            >
              <Svg>
                {target ? (
                  <path d={open[target]} className={target === "ia1" ? s.laneSignal : s.laneCool} />
                ) : (
                  <>
                    <path d={`M${GATE} ${Y - 11}V${Y + 11}`} className={s.barrier} />
                    <rect x={GATE - 72} y={Y - 13} width="64" height="26" rx="6" className={cx(s.ring, "motion-only")} />
                  </>
                )}
              </Svg>
              {target && <At b={nodes[target]} className={cx(s.receive, target === "ia2" && s.receiveCool)} />}
              <At b={inspect} className={cx(lineRow, s.cover)}>
                <span className={cx(s.mono, "text-gold-300")}>{item.id}</span>
                {target ? <span className={target === "ia1" ? "text-signal" : "text-cool"}>→ IA {target === "ia1" ? "1" : "2"}</span> : <span className="text-rose">bloqueada</span>}
              </At>
              <At b={lamps} className={cx(lampRow, s.cover)}>
                <Lamps verdict={blocked ? "no" : "ok"} />
              </At>
            </Step>
          );
        })}

        <At b={[10, 212, 620, 184]} className={cx(s.pane, "overflow-hidden")}>
          <div className="flex items-center justify-between border-b border-line px-[2.5%] py-[1.1%]">
            <span className={cap("text-bone")}>Libro de evidencia</span>
            <span className={cap()}>solo agregar</span>
          </div>
          <ol className="flex flex-col gap-[0.25em] px-[2.5%] py-[1.2%]">
            {history.map((entry, index) => (
              <li key={entry.id} className={cx(s.pRow, index === 0 && s.pWideRow, "opacity-50")}>
                <span className={s.chain} />
                <span className="text-gold-400">{entry.id}</span>
                <span className="truncate text-mist">
                  Proyecto {entry.project} · Proveedor {entry.to}
                </span>
                <span className="text-signal">✓</span>
              </li>
            ))}
            {cards.map(({ item, project }, index) => {
              const ok = item.to !== "bloqueada";
              return (
                <Step key={item.id} as="li" at={[ledgerAt(index), 0.97]} fx="fade" min={0.5} className={s.pRow}>
                  <span className={cx(s.chain, ok ? s.chainNew : s.chainNo)} />
                  <span className="text-gold-300">{item.id}</span>
                  <span className="truncate text-bone">
                    Proyecto {project.toUpperCase()} · <span className={ok ? "text-mist" : "text-rose"}>{ok ? `Proveedor IA ${item.to === "ia1" ? 1 : 2}` : "política"}</span>
                  </span>
                  <span className={ok ? "text-signal" : "text-rose"}>{ok ? "✓" : "✕ bloqueada"}</span>
                </Step>
              );
            })}
          </ol>
        </At>

        <PacketLayer>
          {cards.map(({ item, route, at, hold }) => (
            <span key={item.id} className={cx(s.card, s.pCard)} style={{ "--op": `"${item.id.slice(3)}"` } as CSSProperties}>
              <Packet
                route={route}
                size={[W, H]}
                at={at}
                hold={Number(hold.toFixed(4))}
                className={cx(s.op, item.to === "ia2" && s.cool, item.to === "bloqueada" && s.neutral)}
              />
            </span>
          ))}
        </PacketLayer>
      </div>
    </div>
  );
}

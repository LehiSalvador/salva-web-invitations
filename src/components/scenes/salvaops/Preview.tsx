import type { CSSProperties } from "react";
import { Packet, PacketLayer, type Point } from "@/components/motion/Packet";
import { Step } from "@/components/motion/Step";
import s from "../SalvaOpsScene.module.css";
import { orth } from "./model";

/*
 * Vista previa compacta: dos proyectos aislados, broker con compuerta de política, dos proveedores
 * y el libro de evidencia que se va llenando. 6 pasos + 3 tarjetas (12 animaciones) + el punto vivo.
 */

const W = 640;
const H = 400;
const CYCLE = 9000;
const Y = 141; // canal del broker
const GATE = 400; // compuerta (dentro del broker, a la derecha)

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
  a: [20, 66, 132, 66] as Box,
  b: [20, 150, 132, 66] as Box,
  broker: [218, 66, 204, 150] as Box,
  ia1: [490, 66, 130, 66] as Box,
  ia2: [490, 150, 130, 66] as Box,
};

/** Zona del inspector (sobre el canal) y de las lámparas (bajo el canal). */
const inspect: Box = [230, 98, 160, 30];
const lamps: Box = [230, 164, 160, 44];

const port = { a: [152, 99] as Point, b: [152, 183] as Point };
const lane = { ia1: 99, ia2: 183 };

const head = (from: Point): Point[] => [from, [185, from[1]], [185, Y], [218, Y], [GATE, Y]];
const routes = {
  ia1: [...head(port.a), [422, Y], [456, Y], [456, lane.ia1], [482, lane.ia1]] as Point[],
  ia2: [...head(port.b), [422, Y], [456, Y], [456, lane.ia2], [482, lane.ia2]] as Point[],
  no: [...head(port.b).slice(0, 4), [372, Y]] as Point[],
};

const length = (points: Point[], upto = points.length - 1) =>
  points.slice(1, upto + 1).reduce((sum, [x, y], index) => sum + Math.hypot(x - points[index][0], y - points[index][1]), 0);

/** Tarjeta: ventana [inicio, salida], llegada al destino y el instante en que alcanza la compuerta. */
function card(id: string, route: Point[], start: number, arrive: number, out: number, tone: "signal" | "cool" | "bone") {
  const total = length(route);
  const atGate = route.length > 5 ? length(route, 4) / total : 1;
  const gate = start + atGate * (arrive - start);
  return { id, route, at: [start, out] as [number, number], hold: (out - arrive) / (out - start), gate, arrive, tone };
}

const cards = [
  card("op-012", routes.ia1, 0.03, 0.27, 0.29, "signal"),
  card("op-013", routes.ia2, 0.33, 0.57, 0.59, "cool"),
  card("op-015", routes.no, 0.62, 0.75, 0.88, "bone"),
];

const ledger = [
  { id: "op-012", project: "A", to: "Proveedor IA 1", at: cards[0].arrive + 0.015, ok: true },
  { id: "op-013", project: "B", to: "Proveedor IA 2", at: cards[1].arrive + 0.015, ok: true },
  { id: "op-015", project: "B", to: "política", at: cards[2].gate + 0.04, ok: false },
];

const wires = [
  orth(head(port.a).slice(0, 4), 8),
  orth(head(port.b).slice(0, 4), 8),
  orth([[422, Y], [456, Y], [456, lane.ia1], [490, lane.ia1]], 8),
  orth([[422, Y], [456, Y], [456, lane.ia2], [490, lane.ia2]], 8),
];
const open = [
  orth([[GATE, Y], [456, Y], [456, lane.ia1], [490, lane.ia1]], 8),
  orth([[GATE, Y], [456, Y], [456, lane.ia2], [490, lane.ia2]], 8),
];

function Lamp({ label, state }: { label: string; state?: "ok" | "no" }) {
  return (
    <span className="flex items-center gap-[0.5em]">
      <span className={cx(s.lamp, state === "ok" && s.lampOk, state === "no" && s.lampNo)}>{state === "ok" ? "✓" : state === "no" ? "✕" : ""}</span>
      <span className={cx(s.mono, state === "no" ? "text-rose" : state === "ok" ? "text-signal" : "text-fog")}>{label}</span>
    </span>
  );
}

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={s.svg} aria-hidden="true">
      {children}
    </svg>
  );
}

const lampBox = cx(s.pCap, "flex flex-col justify-between !normal-case !tracking-normal");

export function Preview() {
  return (
    <div className={s.preview} aria-hidden="true" data-live data-cycle={CYCLE}>
      <div className={s.pStage}>
        <Svg>
          <rect x="6" y="48" width="430" height="180" rx="10" className={s.boundary} />
          {wires.map((d) => (
            <path key={d} d={d} className={s.wire} />
          ))}
        </Svg>

        <At b={[20, 10, 400, 26]} className={cx(s.pText, "flex items-center gap-[0.6em] font-medium text-bone")}>
          <span className="live-dot" />
          <span className={s.mono}>salvaops</span>
          <span className={cap()}>
            consola<span className={s.pWide}> de orquestación</span>
          </span>
        </At>
        <At b={[440, 10, 180, 26]} className={cap("flex items-center justify-end")}>
          <span className={s.pWide}>broker activo</span>
        </At>
        <At b={[18, 37, 260, 20]} className="flex items-center">
          <span className={cx(s.boundaryChip, s.pCap, "h-full")}>
            local-first<span className={s.pWide}> · en tu equipo</span>
          </span>
        </At>

        {(["a", "b"] as const).map((id) => (
          <At key={id} b={nodes[id]} className={cx(s.sandbox, "flex flex-col justify-center px-[0.9em]", s.pText)}>
            <span className="font-medium whitespace-nowrap text-bone">Proyecto {id.toUpperCase()}</span>
            <span className={cx(s.pCap, "mt-[0.3em] !normal-case !tracking-normal text-signal")}>2 agentes</span>
          </At>
        ))}

        <At b={nodes.broker} className={s.node}>
          <div className="flex items-center justify-between px-[0.8em] pt-[0.6em]">
            <span className={cap("text-bone")}>Broker</span>
            <span className={cap(s.pWide)}>política</span>
          </div>
        </At>
        <At b={lamps} className={lampBox}>
          <Lamp label="permisos" />
          <Lamp label="alcance" />
        </At>

        {(["ia1", "ia2"] as const).map((id) => (
          <At key={id} b={nodes[id]} className={cx(s.node, "flex flex-col justify-center px-[0.7em]")}>
            <span className={cx(s.pText, "text-fog")}>Proveedor</span>
            <span className={cx(s.pText, "font-medium text-bone")}>IA {id === "ia1" ? "1" : "2"}</span>
          </At>
        ))}

        <Svg>
          <rect x="218" y={Y - 11} width="204" height="22" className={s.track} />
          <path d={`M224 ${Y}H416`} className={s.ticks} />
          <path d={`M${GATE} ${Y - 28}V${Y - 14}M${GATE} ${Y + 14}V${Y + 28}`} className={s.post} />
        </Svg>

        {cards.slice(0, 2).map((item, index) => (
          <Step key={item.id} at={[Number((item.gate - 0.012).toFixed(3)), Number((item.arrive + 0.02).toFixed(3))]} fx="fade" rm="hide" className={s.layer}>
            <Svg>
              <path d={open[index]} className={index === 0 ? s.laneSignal : s.laneCool} />
            </Svg>
            <At b={inspect} className={cx(s.pCap, s.cover, s.pWideFlex, "items-center gap-[0.6em] !normal-case !tracking-normal")}>
              <span className={cx(s.mono, "text-gold-300")}>{item.id}</span>
              <span className={index === 0 ? "text-signal" : "text-cool"}>→ IA {index + 1}</span>
            </At>
            <At b={lamps} className={cx(lampBox, s.cover)}>
              <Lamp label="permisos" state="ok" />
              <Lamp label="alcance" state="ok" />
            </At>
          </Step>
        ))}
        <Step at={[Number((cards[2].gate - 0.02).toFixed(3)), cards[2].at[1]]} fx="fade" className={s.layer}>
          <Svg>
            <path d={`M${GATE} ${Y - 11}V${Y + 11}`} className={s.barrier} />
          </Svg>
          <At b={inspect} className={cx(s.pCap, s.cover, s.pWideFlex, "items-center gap-[0.6em] !normal-case !tracking-normal")}>
            <span className={cx(s.mono, "text-gold-300")}>op-015</span>
            <span className="text-rose">bloqueada</span>
          </At>
          <At b={lamps} className={cx(lampBox, s.cover)}>
            <Lamp label="permisos" state="ok" />
            <Lamp label="alcance" state="no" />
          </At>
        </Step>

        <At b={[20, 238, 600, 156]} className={cx(s.pane, "overflow-hidden")}>
          <div className="flex items-center justify-between border-b border-line px-[2.5%] py-[1.4%]">
            <span className={cap("text-bone")}>Libro de evidencia</span>
            <span className={cap()}>solo agregar</span>
          </div>
          <ol className="flex flex-col gap-[0.4em] px-[2.5%] py-[1.6%]">
            <li className={cx(s.pRow, s.pWideRow, "opacity-50")}>
              <span className={s.chain} />
              <span className="text-gold-400">op-011</span>
              <span className="truncate text-mist">Proyecto A · Proveedor IA 1</span>
              <span className="text-signal">✓</span>
            </li>
            {ledger.map((entry) => (
              <Step key={entry.id} as="li" at={[Number(entry.at.toFixed(3)), 0.95]} fx="up" className={s.pRow}>
                <span className={cx(s.chain, entry.ok ? s.chainNew : s.chainNo)} />
                <span className="text-gold-300">{entry.id}</span>
                <span className="truncate text-bone">
                  Proyecto {entry.project} · <span className={entry.ok ? "text-mist" : "text-rose"}>{entry.to}</span>
                </span>
                <span className={entry.ok ? "text-signal" : "text-rose"}>{entry.ok ? "✓" : "✕ bloqueada"}</span>
              </Step>
            ))}
          </ol>
        </At>

        <PacketLayer>
          {cards.map((item) => (
            <span key={item.id} className={cx(s.card, s.pCard)} style={{ "--op": `"${item.id.slice(3)}"` } as CSSProperties}>
              <Packet
                route={item.route}
                size={[W, H]}
                at={item.at}
                hold={Number(item.hold.toFixed(4))}
                className={cx(s.op, item.tone === "cool" && s.cool, item.tone === "bone" && s.neutral)}
              />
            </span>
          ))}
        </PacketLayer>
      </div>
    </div>
  );
}

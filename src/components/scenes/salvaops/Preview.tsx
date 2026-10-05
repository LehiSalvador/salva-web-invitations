import type { CSSProperties } from "react";
import { Packet, PacketLayer, type Point } from "@/components/motion/Packet";
import { Step } from "@/components/motion/Step";
import s from "../SalvaOpsScene.module.css";
import { orth } from "./model";

/*
 * Vista previa compacta: dos proyectos, broker con compuerta de política, dos proveedores
 * y el libro de evidencia que se va llenando. 6 pasos + 3 tarjetas (12 animaciones).
 */

const W = 640;
const H = 400;
const CYCLE = 9000;
const Y = 136; // canal del broker

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
  a: [20, 56, 128, 70] as Box,
  b: [20, 146, 128, 70] as Box,
  broker: [218, 56, 204, 160] as Box,
  ia1: [492, 56, 128, 70] as Box,
  ia2: [492, 146, 128, 70] as Box,
};

const port = { a: [148, 91] as Point, b: [148, 181] as Point };
const lane = { ia1: 91, ia2: 181 };

const head = (from: Point): Point[] => [from, [183, from[1]], [183, Y], [218, Y], [404, Y]];
const routes = {
  ia1: [...head(port.a), [422, Y], [457, Y], [457, lane.ia1], [484, lane.ia1]] as Point[],
  ia2: [...head(port.b), [422, Y], [457, Y], [457, lane.ia2], [484, lane.ia2]] as Point[],
  no: [...head(port.b), [384, Y]] as Point[],
};

const length = (points: Point[], upto = points.length - 1) =>
  points.slice(1, upto + 1).reduce((sum, [x, y], index) => sum + Math.hypot(x - points[index][0], y - points[index][1]), 0);

/** Tarjeta: ventana [inicio, salida], fin del recorrido y el instante en que cruza la compuerta (x = 404). */
function card(id: string, route: Point[], start: number, arrive: number, out: number, tone: "signal" | "cool" | "bone") {
  const total = length(route);
  const gate = start + (length(route, 4) / total) * (arrive - start);
  return { id, route, at: [start, out] as [number, number], hold: (out - arrive) / (out - start), gate, arrive, tone };
}

const cards = [
  card("012", routes.ia1, 0.03, 0.27, 0.29, "signal"),
  card("013", routes.ia2, 0.33, 0.57, 0.59, "cool"),
  card("015", routes.no, 0.62, 0.76, 0.88, "bone"),
];

const ledger = [
  { id: "op-012", project: "A", to: "Proveedor IA 1", at: cards[0].arrive + 0.015, ok: true },
  { id: "op-013", project: "B", to: "Proveedor IA 2", at: cards[1].arrive + 0.015, ok: true },
  { id: "op-015", project: "B", to: "política", at: cards[2].gate + 0.05, ok: false },
];

const wires = [
  orth(head(port.a).slice(0, 4), 8),
  orth(head(port.b).slice(0, 4), 8),
  orth([[422, Y], [457, Y], [457, lane.ia1], [492, lane.ia1]], 8),
  orth([[422, Y], [457, Y], [457, lane.ia2], [492, lane.ia2]], 8),
];

function Lamp({ label, state }: { label: string; state?: "ok" | "no" }) {
  return (
    <span className="flex items-center gap-[0.5em]">
      <span className={cx(s.lamp, state === "ok" && s.lampOk, state === "no" && s.lampNo)}>{state === "ok" ? "✓" : state === "no" ? "✕" : ""}</span>
      <span className={cx(s.mono, state === "no" ? "text-rose" : state === "ok" ? "text-signal" : "text-fog")}>{label}</span>
    </span>
  );
}

export function Preview() {
  return (
    <div className={s.preview} aria-hidden="true">
      <div data-live data-cycle={CYCLE} className={s.pStage}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={s.svg} aria-hidden="true">
          <rect x="6" y="46" width="430" height="180" rx="10" className={s.boundary} />
          {wires.map((d) => (
            <path key={d} d={d} className={s.wire} />
          ))}
        </svg>

        <At b={[20, 10, 260, 26]} className={cx(s.pText, "flex items-center gap-2 font-medium text-bone")}>
          <span className="live-dot" />
          <span className={s.mono}>salvaops</span>
          <span className={cap("text-fog")}>· consola</span>
        </At>
        <At b={[392, 10, 228, 24]} className={cx(s.boundaryChip, s.pCap, "justify-center !text-signal")}>
          local-first · en tu equipo
        </At>

        {(["a", "b"] as const).map((id) => (
          <At key={id} b={nodes[id]} className={cx(s.sandbox, "flex flex-col justify-center px-[5%]")}>
            <span className={cx(s.pText, "font-medium text-bone")}>Proyecto {id.toUpperCase()}</span>
            <span className={cx(s.mono, s.pCap, "mt-[0.35em] !normal-case !tracking-normal text-signal")}>2 agentes</span>
          </At>
        ))}

        <At b={nodes.broker} className={s.node}>
          <div className="flex items-center justify-between px-[6%] pt-[5%]">
            <span className={cap("text-bone")}>Broker</span>
            <span className={cap()}>política</span>
          </div>
        </At>
        <At b={[230, 162, 180, 48]} className={cx(s.pCap, "flex flex-col justify-between !normal-case !tracking-normal")}>
          <Lamp label="permisos" />
          <Lamp label="alcance" />
        </At>

        {(["ia1", "ia2"] as const).map((id) => (
          <At key={id} b={nodes[id]} className={cx(s.node, "flex flex-col justify-center px-[6%]")}>
            <span className={cap()}>Proveedor</span>
            <span className={cx(s.pText, "mt-[0.2em] font-medium text-bone")}>IA {id === "ia1" ? "1" : "2"}</span>
          </At>
        ))}

        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={s.svg} aria-hidden="true">
          <rect x="218" y={Y - 11} width="204" height="22" className={s.track} />
          <path d={`M224 ${Y}H416`} className={s.ticks} />
          <path d={`M404 ${Y - 30}V${Y - 14}M404 ${Y + 14}V${Y + 30}`} className={s.post} />
        </svg>

        {cards.slice(0, 2).map((item, index) => (
          <Step key={item.id} at={[item.gate - 0.01, item.arrive + 0.02]} fx="fade" className={s.layer}>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={s.svg} aria-hidden="true">
              <path d={wires[index + 2]} className={index === 0 ? s.laneSignal : s.laneCool} />
            </svg>
            <At b={[230, 162, 180, 48]} className={cx(s.pCap, s.cover, "flex flex-col justify-between !normal-case !tracking-normal")}>
              <Lamp label="permisos" state="ok" />
              <Lamp label="alcance" state="ok" />
            </At>
          </Step>
        ))}
        <Step at={[cards[2].gate - 0.03, cards[2].at[1]]} fx="fade" className={s.layer}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={s.svg} aria-hidden="true">
            <path d={`M404 ${Y - 12}V${Y + 12}`} className={s.barrier} />
            <rect x="354" y={Y - 13} width="60" height="26" rx="6" className={cx(s.ring, "motion-only")} />
          </svg>
          <At b={[230, 162, 180, 48]} className={cx(s.pCap, s.cover, "flex flex-col justify-between !normal-case !tracking-normal")}>
            <Lamp label="permisos" state="ok" />
            <Lamp label="alcance ✕ bloqueada" state="no" />
          </At>
        </Step>

        <At b={[20, 238, 600, 150]} className={cx(s.pane, "overflow-hidden")}>
          <div className="flex items-center justify-between border-b border-line px-[2.5%] py-[1.6%]">
            <span className={cap("text-bone")}>Libro de evidencia</span>
            <span className={cap()}>solo agregar</span>
          </div>
          <ol className="flex flex-col gap-[0.42em] px-[2.5%] py-[1.8%]">
            <li className={cx(s.pRow, "opacity-50")}>
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
            <span key={item.id} className={cx(s.card, s.pCard)} style={{ "--op": `"${item.id}"` } as CSSProperties}>
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

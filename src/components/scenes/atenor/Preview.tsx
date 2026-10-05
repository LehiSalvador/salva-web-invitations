import type { CSSProperties } from "react";
import { cubic, Packet, PacketLayer, type Point } from "@/components/motion/Packet";
import { Step } from "@/components/motion/Step";
import s from "@/components/scenes/atenor/Preview.module.css";

/*
 * Vista previa de Atenor: mensajes de tres negocios fluyen hacia el nodo de automatización + IA,
 * se clasifican y salen hacia Atención, Clientes y Operación. 13 animaciones en total.
 */

const W = 640;
const H = 400;
const CYCLE = 9000;
const IA: Point = [320, 200];
const RING = 34;
const ROWS = [96, 200, 304];
const LEFT = 196;
const RIGHT = 444;

const FLOWS = [
  { from: 0, to: 2, intent: "Pedido", tag: "+ tarea" },
  { from: 1, to: 1, intent: "Seguimiento", tag: "+ cliente" },
  { from: 2, to: 0, intent: "Cita", tag: "+ ticket" },
];

const BUBBLES = [
  { n: "01", biz: "Cafetería", text: "¿Me apartan un pastel hoy?" },
  { n: "02", biz: "Taller", text: "¿Ya quedó mi camioneta?" },
  { n: "03", biz: "Clínica", text: "Quiero cita el jueves." },
];

const LANES = ["Atención", "Clientes", "Operación"];
/** Cada flujo ocupa 0.3 del ciclo; arranca cada 0.27. */
const start = (index: number) => 0.04 + index * 0.27;

const inCurve = (y: number) => cubic([LEFT, y], [LEFT + 60, y], [IA[0] - RING - 60, IA[1]], [IA[0] - RING, IA[1]], 12);
const outCurve = (y: number) => cubic([IA[0] + RING, IA[1]], [IA[0] + RING + 60, IA[1]], [RIGHT - 60, y], [RIGHT, y], 12);
/** Media vuelta por arriba del nodo: el mensaje "pasa" por la IA. */
const arc: Point[] = Array.from({ length: 13 }, (_, index) => {
  const angle = Math.PI + (index / 12) * Math.PI;
  return [IA[0] + RING * Math.cos(angle), IA[1] + RING * Math.sin(angle)];
});
const pathOf = (points: Point[]) => points.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
const pos = (x: number, y: number) => ({ "--x": `${(x / W) * 100}%`, "--y": `${(y / H) * 100}%` }) as CSSProperties;

export function AtenorPreview() {
  return (
    <div aria-hidden="true" data-live data-cycle={CYCLE} className={s.preview}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={s.lines}>
        {ROWS.map((y) => (
          <path key={`i${y}`} d={pathOf(inCurve(y))} className={s.line} />
        ))}
        {ROWS.map((y) => (
          <path key={`o${y}`} d={pathOf(outCurve(y))} className={`${s.line} ${s.lineOut}`} />
        ))}
      </svg>

      {BUBBLES.map((bubble, index) => (
        <div key={bubble.n} className={s.bubble} style={pos(LEFT, ROWS[index])}>
          <span className={s.bubbleHead}>
            <span className={s.bubbleN}>N{bubble.n}</span>
            {bubble.biz}
          </span>
          <span className={s.bubbleText}>{bubble.text}</span>
          <span className={s.bubbleBody}>
            <i />
            <i />
          </span>
        </div>
      ))}

      <div className={s.core} style={pos(IA[0], IA[1])}>
        <span className={s.coreLabel}>Automatización + IA</span>
        <span className={s.glow} />
        <span className={`${s.ring} spin`} style={{ "--dur": "8s" } as CSSProperties} />
        <span className={s.node}>IA</span>
        <span className={s.chipSlot}>
          {FLOWS.map((flow, index) => (
            <Step
              key={flow.intent}
              at={[start(index) + 0.16, index < 2 ? start(index + 1) + 0.14 : 0.96]}
              fx="scale"
              rm={index < 2 ? "hide" : undefined}
              className={s.chip}
            >
              {flow.intent}
            </Step>
          ))}
        </span>
      </div>

      {LANES.map((lane, index) => {
        const flowIndex = FLOWS.findIndex((flow) => flow.to === index);
        const flow = FLOWS[flowIndex];
        return (
          <div key={lane} className={s.lane} style={pos(RIGHT, ROWS[index])}>
            <span className={s.laneName}>{lane}</span>
            <span className={s.laneSlot}>
              <Step at={[start(flowIndex) + 0.27, 0.96]} fx="left" className={s.tag}>
                {flow.tag}
              </Step>
            </span>
          </div>
        );
      })}

      <PacketLayer>
        {FLOWS.map((flow, index) => (
          <Packet
            key={flow.intent}
            size={[W, H]}
            kind="msg"
            tone="signal"
            route={[...inCurve(ROWS[flow.from]), ...arc.slice(1, -1), ...outCurve(ROWS[flow.to])]}
            at={[start(index), start(index) + 0.3]}
            hold={0.1}
          />
        ))}
      </PacketLayer>
    </div>
  );
}

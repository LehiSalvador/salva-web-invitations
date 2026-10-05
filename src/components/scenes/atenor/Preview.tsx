import type { CSSProperties } from "react";
import { cubic, Packet, PacketLayer, type Point } from "@/components/motion/Packet";
import { Step } from "@/components/motion/Step";
import s from "@/components/scenes/atenor/Preview.module.css";

/*
 * Vista previa de Atenor: mensajes de tres negocios fluyen hacia el nodo de automatización + IA,
 * se clasifican y salen hacia Atención, Clientes y Operación; el chat de origen pasa a "respondido".
 * Animaciones: 6 de paquetes, 3 Step (carriles), 3 estados de chat, 1 tira de intención y 1 anillo = 14.
 * Diseño por container query: compacto bajo 480 px de ancho de la caja.
 */

const W = 640;
const H = 400;
const CYCLE = 9000;
const IA: Point = [320, 200];
/** Radio del anillo IA en unidades (5cqw = 32/640 del ancho): el mensaje lo recorre por arriba. */
const RING = 32;
const ROWS = [80, 200, 320];
const LEFT = 0.35 * W;
const RIGHT = 0.65 * W;
const HOLD = 0.08;

const FLOWS = [
  { n: "01", biz: "Cafetería", text: "¿Me apartan un pastel hoy?", short: "¿Pastel hoy?", intent: "Pedido", to: 2, tag: "+ tarea" },
  { n: "02", biz: "Taller", text: "¿Ya quedó mi camioneta?", short: "¿Mi camioneta?", intent: "Seguimiento", to: 1, tag: "+ cliente" },
  { n: "03", biz: "Clínica", text: "Quiero cita el jueves.", short: "¿Cita jueves?", intent: "Cita", to: 0, tag: "+ ticket" },
];

const LANES = [
  { name: "Atención", sub: "tickets" },
  { name: "Clientes", sub: "fichas" },
  { name: "Operación", sub: "tareas" },
];

const inCurve = (y: number) => cubic([LEFT, y], [LEFT + 50, y], [IA[0] - RING - 50, IA[1]], [IA[0] - RING, IA[1]], 12);
const outCurve = (y: number) => cubic([IA[0] + RING, IA[1]], [IA[0] + RING + 50, IA[1]], [RIGHT - 50, y], [RIGHT, y], 12);
/** Media vuelta por arriba del anillo: el mensaje "pasa" por la IA. */
const arc: Point[] = Array.from({ length: 15 }, (_, index) => {
  const angle = Math.PI + (index / 14) * Math.PI;
  return [IA[0] + RING * Math.cos(angle), IA[1] + RING * Math.sin(angle)];
});

const length = (points: Point[]) => points.slice(1).reduce((sum, [x, y], index) => sum + Math.hypot(x - points[index][0], y - points[index][1]), 0);

/** Cada flujo ocupa 0.3 del ciclo y arranca cada 0.28. */
const flows = FLOWS.map((flow, index) => {
  const from = inCurve(ROWS[index]);
  const to = outCurve(ROWS[flow.to]);
  const route = [...from, ...arc.slice(1, -1), ...to];
  const start = 0.04 + index * 0.28;
  const end = start + 0.3;
  const travel = (end - start) * (1 - HOLD);
  const total = length(route);
  const arcOut = start + ((length(from) + length(arc)) / total) * travel;
  return { ...flow, index, route, start, end, arcOut, dock: start + travel };
});

/* Tiras generadas (duración = ciclo): estado del chat (pendiente → procesando → respondido) e intención. */
const STATUS_H = 13;
const CHIP_H = 20;
const RESET = 0.955;
const pct = (fraction: number) => `${(Math.min(Math.max(fraction, 0), 1) * 100).toFixed(2)}%`;
const ty = (px: number, opacity = 1) => `transform:translate3d(0,${px}px,0);opacity:${opacity}`;

function strip(name: string, stops: [number, number][]) {
  const list: [number, string][] = [[0, ty(0)]];
  let current = 0;
  for (const [at, offset] of stops) {
    list.push([at, ty(current)], [at + 0.04, ty(offset)]);
    current = offset;
  }
  list.push([RESET - 0.03, ty(current)], [RESET, ty(current, 0)], [RESET + 0.005, ty(0, 0)], [RESET + 0.035, ty(0)], [1, ty(0)]);
  const body = list.map(([at, css]) => `${pct(at)}{${css}}`).join("");
  return `@keyframes ${name}{${body}}`;
}

const PREVIEW_CSS = [
  ...flows.map((flow) => strip(`atp-status-${flow.index}`, [[flow.start, -STATUS_H], [flow.dock, -STATUS_H * 2]])),
  strip(
    "atp-chip",
    flows.map((flow) => [flow.arcOut - 0.02, -(flow.index + 1) * CHIP_H]),
  ),
  "@media (scripting: enabled) and (prefers-reduced-motion: no-preference){",
  ...flows.map((flow) => `[data-atp="status-${flow.index}"]{animation:atp-status-${flow.index} ${CYCLE}ms cubic-bezier(0.16,1,0.3,1) infinite}`),
  `[data-atp="chip"]{animation:atp-chip ${CYCLE}ms cubic-bezier(0.16,1,0.3,1) infinite}`,
  "}",
].join("");

const pathOf = (points: Point[]) => points.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
const pos = (x: number, y: number) => ({ "--x": `${(x / W) * 100}%`, "--y": `${(y / H) * 100}%` }) as CSSProperties;

export function AtenorPreview() {
  return (
    <div aria-hidden="true" data-live data-cycle={CYCLE} className={s.preview}>
      <style>{PREVIEW_CSS}</style>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className={s.lines}>
        {ROWS.map((y) => (
          <path key={`i${y}`} d={pathOf(inCurve(y))} className={s.line} />
        ))}
        {ROWS.map((y) => (
          <path key={`o${y}`} d={pathOf(outCurve(y))} className={`${s.line} ${s.lineOut}`} />
        ))}
      </svg>

      <span className={`${s.heading} ${s.headLeft}`}>
        <b>01</b> Bandeja WhatsApp
      </span>
      <span className={`${s.heading} ${s.headCenter}`}>
        <b>02</b> Automatización + IA
      </span>
      <span className={`${s.heading} ${s.headRight}`}>
        <b>03</b> Áreas
      </span>

      {flows.map((flow) => (
        <div key={flow.n} className={s.bubble} style={pos(LEFT, ROWS[flow.index])}>
          <span className={s.bubbleHead}>
            <span className={s.bubbleN}>N{flow.n}</span>
            {flow.biz}
          </span>
          <span className={s.bubbleText}>
            <span className={s.long}>{flow.text}</span>
            <span className={s.short}>{flow.short}</span>
          </span>
          <span className={s.status}>
            <span data-atp={`status-${flow.index}`} className={s.statusList}>
              <span className={s.pending}>pendiente</span>
              <span className={s.busy}>
                <i />
                procesando
              </span>
              <span className={s.done}>✓ respondido</span>
            </span>
          </span>
        </div>
      ))}

      <div className={s.core} style={pos(IA[0], IA[1])}>
        <span className={s.glow} />
        <span className={`${s.ring} spin`} style={{ "--dur": "8s" } as CSSProperties} />
        <span className={s.node}>IA</span>
        <span className={s.chipWindow}>
          <span data-atp="chip" className={s.chipList}>
            <span className={s.chipIdle}>intención</span>
            {flows.map((flow) => (
              <span key={flow.intent} className={s.chip}>
                {flow.intent}
              </span>
            ))}
          </span>
        </span>
        <span className={s.stages}>recepción · regla · ruta</span>
      </div>

      {LANES.map((lane, index) => {
        const flow = flows.find((candidate) => candidate.to === index) ?? flows[0];
        return (
          <div key={lane.name} className={s.lane} style={pos(RIGHT, ROWS[index])}>
            <span className={s.laneHead}>
              <span className={s.laneName}>{lane.name}</span>
              <span className={s.laneSub}>{lane.sub}</span>
            </span>
            <span className={s.laneSlot}>
              <Step at={[flow.dock, 0.955]} fx="left" className={s.tag}>
                {flow.tag}
              </Step>
            </span>
          </div>
        );
      })}

      <PacketLayer>
        {flows.map((flow) => (
          <Packet key={flow.n} size={[W, H]} kind="msg" tone="signal" route={flow.route} at={[flow.start, flow.end]} hold={HOLD} />
        ))}
      </PacketLayer>
    </div>
  );
}

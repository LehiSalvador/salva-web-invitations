import type { CSSProperties } from "react";
import type { Point } from "@/components/motion/Packet";

/*
 * Modelo de la consola de SalvaOps: geometría de las dos composiciones (horizontal desde md,
 * vertical en mobile), las operaciones que recorren el sistema y su línea de tiempo.
 * Los mismos elementos (pasos sincronizados) sirven a las dos composiciones; solo cambian
 * sus coordenadas (variables CSS) y las rutas de las tarjetas.
 */

export const CYCLE = 18000;

/** Sistema de coordenadas de cada composición. */
export const D = { w: 1000, h: 420 } as const;
export const M = { w: 360, h: 612 } as const;

export type Box = readonly [x: number, y: number, w: number, h: number];

const pct = (value: number, total: number) => `${((value / total) * 100).toFixed(3)}%`;

/** Posición de un elemento en ambas composiciones (porcentajes del escenario). */
export function place(d: Box, m: Box): CSSProperties {
  return {
    "--dx": pct(d[0], D.w),
    "--dy": pct(d[1], D.h),
    "--dw": pct(d[2], D.w),
    "--dh": pct(d[3], D.h),
    "--mx": pct(m[0], M.w),
    "--my": pct(m[1], M.h),
    "--mw": pct(m[2], M.w),
    "--mh": pct(m[3], M.h),
  } as CSSProperties;
}

/* ───────────── Geometría ───────────── */

export type AgentId = "a1" | "a2" | "b1" | "b2";
export type ProviderId = "ia1" | "ia2";

export const agents: Record<AgentId, { project: "a" | "b"; name: string; role: string; d: Box; m: Box }> = {
  a1: { project: "a", name: "agt-a1", role: "refactor", d: [30, 98, 192, 40], m: [22, 86, 72, 44] },
  a2: { project: "a", name: "agt-a2", role: "pruebas", d: [30, 144, 192, 40], m: [98, 86, 72, 44] },
  b1: { project: "b", name: "agt-b1", role: "docs", d: [30, 290, 192, 40], m: [194, 86, 72, 44] },
  b2: { project: "b", name: "agt-b2", role: "migración", d: [30, 336, 192, 40], m: [270, 86, 72, 44] },
};

export const layout = {
  boundary: { d: [2, 14, 724, 402] as Box, m: [2, 14, 356, 482] as Box },
  boundaryChip: { d: [16, 5, 228, 19] as Box, m: [12, 5, 214, 19] as Box },
  projects: {
    a: { d: [18, 36, 220, 180] as Box, m: [12, 34, 164, 132] as Box },
    b: { d: [18, 228, 220, 180] as Box, m: [184, 34, 164, 132] as Box },
  },
  broker: { d: [296, 36, 236, 372] as Box, m: [12, 200, 336, 150] as Box },
  /** Inspector del broker: zona superior (operación) e inferior (ruta y alcance). */
  inspectTop: { d: [308, 80, 212, 118] as Box, m: [22, 228, 126, 114] as Box },
  inspectLow: { d: [308, 246, 212, 150] as Box, m: [212, 228, 128, 114] as Box },
  gate: { d: [548, 36, 136, 372] as Box, m: [12, 362, 336, 76] as Box },
  lamps: {
    permisos: { d: [558, 112, 116, 58] as Box, m: [22, 382, 124, 48] as Box },
    alcance: { d: [558, 276, 116, 58] as Box, m: [214, 382, 124, 48] as Box },
  },
  stamp: { d: [558, 344, 116, 54] as Box, m: [196, 441, 150, 34] as Box },
  providers: {
    ia1: { d: [800, 36, 200, 136] as Box, m: [12, 520, 164, 88] as Box },
    ia2: { d: [800, 272, 200, 136] as Box, m: [184, 520, 164, 88] as Box },
  },
};

/** Puertos de salida de cada agente (D: borde derecho del proyecto; M: bajo la insignia). */
const portD: Record<AgentId, Point> = { a1: [238, 118], a2: [238, 164], b1: [238, 310], b2: [238, 356] };
const portM: Record<AgentId, Point> = { a1: [58, 130], a2: [134, 130], b1: [230, 130], b2: [306, 130] };

export const geo = {
  d: { busX: 264, channelY: 222, brokerIn: 296, gateIn: 548, gateOut: 684, splitX: 704, laneY: { ia1: 104, ia2: 340 }, end: 772, hold: 580 },
  m: { busY: 184, channelX: 180, gateIn: 362, gateOut: 438, splitY: 478, laneX: { ia1: 94, ia2: 266 }, end: 512, hold: 382 },
};

/** Ruta y el índice del punto donde la tarjeta entra a la compuerta de política. */
type Route = { points: Point[]; gate: number };

function routeD(agent: AgentId, to: ProviderId | "bloqueada"): Route {
  const g = geo.d;
  const [px, py] = portD[agent];
  const head: Point[] = [
    [px, py],
    [g.busX, py],
    [g.busX, g.channelY],
    [g.brokerIn, g.channelY],
    [g.gateIn, g.channelY],
  ];
  if (to === "bloqueada") return { points: [...head, [g.hold, g.channelY]], gate: 4 };
  const lane = g.laneY[to];
  return {
    points: [...head, [g.gateOut, g.channelY], [g.splitX, g.channelY], [g.splitX, lane], [g.end, lane]],
    gate: 4,
  };
}

function routeM(agent: AgentId, to: ProviderId | "bloqueada"): Route {
  const g = geo.m;
  const [px, py] = portM[agent];
  const head: Point[] = [
    [px, py],
    [px, g.busY],
    [g.channelX, g.busY],
    [g.channelX, g.gateIn],
  ];
  if (to === "bloqueada") return { points: [...head, [g.channelX, g.hold]], gate: 3 };
  const lane = g.laneX[to];
  return {
    points: [...head, [g.channelX, g.gateOut], [g.channelX, g.splitY], [lane, g.splitY], [lane, g.end]],
    gate: 3,
  };
}

/* ───────────── Operaciones y línea de tiempo ───────────── */

export type Op = {
  id: string;
  agent: AgentId;
  to: ProviderId | "bloqueada";
  /** Fracción del ciclo en que la tarjeta llega a la compuerta. */
  gate: number;
  /** Llegada al proveedor (operaciones permitidas). */
  end: number;
  /** Fin de la ventana de la tarjeta (espera en el destino hasta aquí). */
  out: number;
  task: string;
  scope: string;
  hash: string;
};

const PASS = 0.07; // tiempo entre la compuerta y el proveedor

export const ops: Op[] = [
  { id: "op-012", agent: "a1", to: "ia1", gate: 0.11, end: 0.11 + PASS, out: 0.192, task: "refactor", scope: "~/proyectos/a", hash: "7c1e" },
  { id: "op-013", agent: "b1", to: "ia2", gate: 0.265, end: 0.265 + PASS, out: 0.347, task: "docs", scope: "~/proyectos/b", hash: "a94f" },
  { id: "op-014", agent: "a2", to: "ia1", gate: 0.42, end: 0.42 + PASS, out: 0.502, task: "pruebas", scope: "~/proyectos/a", hash: "3d08" },
  { id: "op-015", agent: "b2", to: "bloqueada", gate: 0.63, end: 0.63, out: 0.705, task: "migración", scope: "~/proyectos/a", hash: "e5b2" },
  { id: "op-016", agent: "a1", to: "ia2", gate: 0.82, end: 0.82 + PASS, out: 0.902, task: "refactor", scope: "~/proyectos/a", hash: "41fa" },
];

const lengths = (points: Point[]) => {
  const cumulative = [0];
  points.slice(1).forEach(([x, y], index) => {
    cumulative.push(cumulative[index] + Math.hypot(x - points[index][0], y - points[index][1]));
  });
  return cumulative;
};

/** Velocidad de referencia de cada composición (px del sistema por fracción de ciclo). */
const speed = (route: Route) => {
  const cumulative = lengths(route.points);
  return (cumulative[cumulative.length - 1] - cumulative[route.gate]) / PASS;
};
const SPEED_D = speed(routeD("a1", "ia1"));
const SPEED_M = speed(routeM("a1", "ia1"));

/**
 * Ventana de la tarjeta para que llegue a la compuerta y al proveedor en los mismos instantes
 * en ambas composiciones (velocidad constante por tramo completo).
 */
function schedule(route: Route, op: Op, reference: number) {
  const cumulative = lengths(route.points);
  const total = cumulative[cumulative.length - 1];
  const atGate = cumulative[route.gate];
  const v = op.to === "bloqueada" ? reference : (total - atGate) / (op.end - op.gate);
  const start = op.gate - atGate / v;
  const arrive = op.gate + (total - atGate) / v;
  const hold = Math.max(0, (op.out - arrive) / (op.out - start));
  return { points: route.points, at: [Number(start.toFixed(4)), op.out] as [number, number], hold: Number(hold.toFixed(4)) };
}

export const packetsD = ops.map((op) => ({ op, ...schedule(routeD(op.agent, op.to), op, SPEED_D) }));
export const packetsM = ops.map((op) => ({ op, ...schedule(routeM(op.agent, op.to), op, SPEED_M) }));

/** Inspector del broker: desde que la operación se despacha hasta que cruza la compuerta. */
export const inspectWindow = (op: Op, index: number): [number, number] => {
  const start = Math.min(...[packetsD[index], packetsM[index]].map((packet) => packet.at[0]));
  return [Number(Math.max(0.005, start - 0.004).toFixed(3)), op.to === "bloqueada" ? op.out : Number((op.gate + 0.03).toFixed(3))];
};

/** Veredicto de la compuerta (lámparas, carril abierto o barrera). */
export const verdictWindow = (op: Op): [number, number] =>
  op.to === "bloqueada" ? [op.gate - 0.004, op.out + 0.01] : [op.gate - 0.004, Number((op.end + 0.006).toFixed(3))];

/** Proveedor recibiendo la operación. */
export const receiveWindow = (op: Op): [number, number] => [Number((op.end - 0.004).toFixed(3)), Number(Math.min(op.end + 0.09, 0.985).toFixed(3))];

/** Entrada en el libro de evidencia. */
export const ledgerAt = (op: Op) => (op.to === "bloqueada" ? op.gate + 0.045 : op.end + 0.012);

/* ───────────── Trazos ───────────── */

/** Polilínea ortogonal con esquinas redondeadas. */
export function orth(points: Point[], radius = 8) {
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let index = 1; index < points.length - 1; index++) {
    const [px, py] = points[index - 1];
    const [x, y] = points[index];
    const [nx, ny] = points[index + 1];
    const inLen = Math.hypot(x - px, y - py);
    const outLen = Math.hypot(nx - x, ny - y);
    const r = Math.min(radius, inLen / 2, outLen / 2);
    const ax = x - ((x - px) / inLen) * r;
    const ay = y - ((y - py) / inLen) * r;
    const bx = x + ((nx - x) / outLen) * r;
    const by = y + ((ny - y) / outLen) * r;
    d += ` L${ax.toFixed(1)} ${ay.toFixed(1)} Q${x} ${y} ${bx.toFixed(1)} ${by.toFixed(1)}`;
  }
  const [lx, ly] = points[points.length - 1];
  return `${d} L${lx} ${ly}`;
}

export const wiresD = {
  agents: (Object.keys(portD) as AgentId[]).map((agent) => {
    const py = portD[agent][1];
    return orth([[agents[agent].d[0] + agents[agent].d[2], py], [geo.d.busX, py], [geo.d.busX, geo.d.channelY], [geo.d.brokerIn, geo.d.channelY]], 10);
  }),
  lanes: {
    ia1: orth([[geo.d.gateOut, geo.d.channelY], [geo.d.splitX, geo.d.channelY], [geo.d.splitX, geo.d.laneY.ia1], [800, geo.d.laneY.ia1]], 12),
    ia2: orth([[geo.d.gateOut, geo.d.channelY], [geo.d.splitX, geo.d.channelY], [geo.d.splitX, geo.d.laneY.ia2], [800, geo.d.laneY.ia2]], 12),
  },
  ports: portD,
};

export const wiresM = {
  agents: (Object.keys(portM) as AgentId[]).map((agent) => {
    const [px, py] = portM[agent];
    return orth([[px, py], [px, geo.m.busY], [geo.m.channelX, geo.m.busY], [geo.m.channelX, 200]], 10);
  }),
  lanes: {
    ia1: orth([[geo.m.channelX, geo.m.gateOut], [geo.m.channelX, geo.m.splitY], [geo.m.laneX.ia1, geo.m.splitY], [geo.m.laneX.ia1, 520]], 10),
    ia2: orth([[geo.m.channelX, geo.m.gateOut], [geo.m.channelX, geo.m.splitY], [geo.m.laneX.ia2, geo.m.splitY], [geo.m.laneX.ia2, 520]], 10),
  },
  ports: portM,
};

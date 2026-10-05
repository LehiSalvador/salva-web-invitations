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
export const M = { w: 360, h: 630 } as const;

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
  a1: { project: "a", name: "agt-a1", role: "refactor", d: [30, 102, 192, 38], m: [18, 90, 76, 44] },
  a2: { project: "a", name: "agt-a2", role: "pruebas", d: [30, 146, 192, 38], m: [96, 90, 76, 44] },
  b1: { project: "b", name: "agt-b1", role: "docs", d: [30, 294, 192, 38], m: [190, 90, 76, 44] },
  b2: { project: "b", name: "agt-b2", role: "datos", d: [30, 338, 192, 38], m: [268, 90, 76, 44] },
};

export const layout = {
  boundary: { d: [2, 14, 724, 402] as Box, m: [2, 14, 356, 494] as Box },
  boundaryChip: { d: [16, 5, 228, 19] as Box, m: [12, 5, 214, 19] as Box },
  projects: {
    a: { d: [18, 36, 220, 180] as Box, m: [12, 34, 164, 136] as Box },
    b: { d: [18, 228, 220, 180] as Box, m: [184, 34, 164, 136] as Box },
  },
  broker: { d: [296, 36, 236, 372] as Box, m: [12, 204, 336, 150] as Box },
  /** Inspector del broker: zona superior (operación) e inferior (ruta y alcance). */
  inspectTop: { d: [308, 80, 212, 118] as Box, m: [22, 232, 126, 114] as Box },
  inspectLow: { d: [308, 246, 212, 92] as Box, m: [214, 232, 128, 114] as Box },
  /** Disponibilidad de proveedores (pie del broker, solo desde md). */
  brokerFoot: { d: [308, 344, 212, 54] as Box, m: [0, 0, 0, 0] as Box },
  gate: { d: [548, 36, 136, 372] as Box, m: [12, 366, 336, 88] as Box },
  lamps: {
    permisos: { d: [556, 112, 124, 58] as Box, m: [20, 394, 120, 48] as Box },
    alcance: { d: [556, 276, 124, 58] as Box, m: [222, 394, 120, 48] as Box },
  },
  stamp: { d: [554, 344, 124, 54] as Box, m: [196, 458, 150, 34] as Box },
  providers: {
    ia1: { d: [800, 46, 200, 116] as Box, m: [12, 536, 164, 88] as Box },
    ia2: { d: [800, 282, 200, 116] as Box, m: [184, 536, 164, 88] as Box },
  },
};

/** Puertos de salida de cada agente (D: borde derecho del proyecto; M: bajo la insignia). */
const portD: Record<AgentId, Point> = { a1: [238, 121], a2: [238, 165], b1: [238, 313], b2: [238, 357] };
const portM: Record<AgentId, Point> = { a1: [56, 134], a2: [134, 134], b1: [228, 134], b2: [306, 134] };

export const geo = {
  d: { busX: 264, channelY: 222, brokerIn: 296, gateIn: 548, gateOut: 684, splitX: 704, laneY: { ia1: 104, ia2: 340 }, end: 772, hold: 580 },
  m: { busY: 188, channelX: 180, brokerIn: 204, gateIn: 366, gateOut: 454, postY: 424, splitY: 500, laneX: { ia1: 94, ia2: 266 }, providerY: 536, end: 528, hold: 394 },
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
  { id: "op-014", agent: "a2", to: "ia1", gate: 0.13, end: 0.13 + PASS, out: 0.212, task: "pruebas", scope: "~/proyectos/a", hash: "3d08" },
  { id: "op-015", agent: "b2", to: "bloqueada", gate: 0.345, end: 0.345, out: 0.42, task: "migración", scope: "~/proyectos/a", hash: "e5b2" },
  { id: "op-016", agent: "b1", to: "ia2", gate: 0.525, end: 0.525 + PASS, out: 0.607, task: "docs", scope: "~/proyectos/b", hash: "a94f" },
  { id: "op-017", agent: "a1", to: "ia2", gate: 0.685, end: 0.685 + PASS, out: 0.767, task: "refactor", scope: "~/proyectos/a", hash: "7c1e" },
  { id: "op-018", agent: "b1", to: "ia1", gate: 0.84, end: 0.84 + PASS, out: 0.922, task: "docs", scope: "~/proyectos/b", hash: "41fa" },
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
export const verdictWindow = (op: Op): [number, number] => [
  Number((op.gate - 0.004).toFixed(3)),
  Number((op.to === "bloqueada" ? op.out + 0.01 : op.end + 0.03).toFixed(3)),
];

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
  /** Carril abierto por la compuerta (resaltado del veredicto): desde la entrada de la compuerta. */
  open: {
    ia1: orth([[geo.d.gateIn, geo.d.channelY], [geo.d.splitX, geo.d.channelY], [geo.d.splitX, geo.d.laneY.ia1], [800, geo.d.laneY.ia1]], 12),
    ia2: orth([[geo.d.gateIn, geo.d.channelY], [geo.d.splitX, geo.d.channelY], [geo.d.splitX, geo.d.laneY.ia2], [800, geo.d.laneY.ia2]], 12),
  },
  ports: portD,
};

export const wiresM = {
  agents: (Object.keys(portM) as AgentId[]).map((agent) => {
    const [px, py] = portM[agent];
    return orth([[px, py], [px, geo.m.busY], [geo.m.channelX, geo.m.busY], [geo.m.channelX, geo.m.brokerIn]], 10);
  }),
  lanes: {
    ia1: orth([[geo.m.channelX, geo.m.gateOut], [geo.m.channelX, geo.m.splitY], [geo.m.laneX.ia1, geo.m.splitY], [geo.m.laneX.ia1, geo.m.providerY]], 10),
    ia2: orth([[geo.m.channelX, geo.m.gateOut], [geo.m.channelX, geo.m.splitY], [geo.m.laneX.ia2, geo.m.splitY], [geo.m.laneX.ia2, geo.m.providerY]], 10),
  },
  open: {
    ia1: orth([[geo.m.channelX, geo.m.gateIn], [geo.m.channelX, geo.m.splitY], [geo.m.laneX.ia1, geo.m.splitY], [geo.m.laneX.ia1, geo.m.providerY]], 10),
    ia2: orth([[geo.m.channelX, geo.m.gateIn], [geo.m.channelX, geo.m.splitY], [geo.m.laneX.ia2, geo.m.splitY], [geo.m.laneX.ia2, geo.m.providerY]], 10),
  },
  ports: portM,
};

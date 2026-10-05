import type { CSSProperties } from "react";
import type { Point } from "@/components/motion/Packet";

/*
 * Modelo de la consola de SalvaOps: geometría de las dos composiciones (horizontal desde md,
 * vertical en mobile), las operaciones que recorren el sistema y su línea de tiempo.
 * Los mismos elementos (pasos sincronizados) sirven a las dos composiciones; solo cambian
 * sus coordenadas (variables CSS) y las rutas de las tarjetas.
 */

export const CYCLE = 16000;

/** Sistema de coordenadas de cada composición. */
export const D = { w: 1000, h: 420 } as const;
export const M = { w: 360, h: 630 } as const;

export type Box = readonly [x: number, y: number, w: number, h: number];

const pct = (value: number, total: number) => `${((value / total) * 100).toFixed(3)}%`;
const round = (value: number) => Number(value.toFixed(4));

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
  b2: { project: "b", name: "agt-b2", role: "migración", d: [30, 338, 192, 38], m: [268, 90, 76, 44] },
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
  /** Cola del broker (D: pie del panel; M: cabecera, a la derecha del canal). */
  queue: { d: [308, 348, 212, 48] as Box, m: [198, 209, 144, 18] as Box },
  gate: { d: [548, 36, 136, 372] as Box, m: [12, 366, 336, 88] as Box },
  lamps: {
    permisos: { d: [556, 112, 124, 58] as Box, m: [20, 394, 120, 48] as Box },
    alcance: { d: [556, 276, 124, 58] as Box, m: [222, 394, 120, 48] as Box },
  },
  stamp: { d: [556, 344, 124, 54] as Box, m: [196, 458, 150, 30] as Box },
  providers: {
    ia1: { d: [800, 46, 200, 116] as Box, m: [12, 536, 164, 88] as Box },
    ia2: { d: [800, 282, 200, 116] as Box, m: [184, 536, 164, 88] as Box },
  },
  remote: { d: [812, 176, 180, 96] as Box, m: [0, 0, 0, 0] as Box },
};

/** Puertos de salida de cada agente (D: borde derecho del proyecto; M: bajo la insignia). */
const portD: Record<AgentId, Point> = { a1: [238, 121], a2: [238, 165], b1: [238, 313], b2: [238, 357] };
const portM: Record<AgentId, Point> = { a1: [56, 134], a2: [134, 134], b1: [228, 134], b2: [306, 134] };

export const geo = {
  d: { busX: 264, channelY: 222, brokerIn: 296, gateIn: 548, gateOut: 684, armX: 616, splitX: 704, laneY: { ia1: 104, ia2: 340 }, end: 772, hold: 580 },
  m: { busY: 188, channelX: 180, brokerIn: 204, gateIn: 366, gateOut: 454, armY: 424, splitY: 500, laneX: { ia1: 94, ia2: 266 }, providerY: 536, end: 522, hold: 394 },
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
  /** Llegada al proveedor (o fin del recorrido, si se bloquea). */
  end: number;
  /** Fin de la ventana de la tarjeta (espera en el destino hasta aquí). */
  out: number;
  task: string;
  scope: string;
  hash: string;
};

/** Tiempo entre la compuerta y el proveedor. */
const PASS = 0.08;

const op = (id: string, agent: AgentId, to: Op["to"], gate: number, hash: string): Op => {
  const blocked = to === "bloqueada";
  const end = blocked ? gate : gate + PASS;
  return {
    id,
    agent,
    to,
    gate,
    end,
    out: round(blocked ? gate + 0.075 : end + 0.012),
    task: agents[agent].role,
    scope: `~/proyectos/${blocked ? "a" : agents[agent].project}`,
    hash,
  };
};

/**
 * Seis operaciones solapadas: mientras una va por su carril, la siguiente ya está en el broker.
 * op-016 (agt-b2, proyecto b) pide escribir en ~/proyectos/a: la política la bloquea por alcance.
 */
export const ops: Op[] = [
  op("op-014", "a2", "ia1", 0.13, "3d08"),
  op("op-015", "b1", "ia2", 0.265, "a94f"),
  op("op-016", "b2", "bloqueada", 0.4, "e5b2"),
  op("op-017", "a1", "ia2", 0.535, "7c1e"),
  op("op-018", "b1", "ia1", 0.67, "41fa"),
  op("op-019", "a2", "ia1", 0.805, "b630"),
];

/** Operación que queda en la vista estática (reduced motion): la bloqueada. */
export const STILL = "op-016";

/** Registros previos del libro de evidencia (escena y vista previa). */
export const history = [
  { id: "op-012", project: "B", to: "IA 2", detail: "docs · evidencia · sha 02be" },
  { id: "op-013", project: "A", to: "IA 1", detail: "refactor · evidencia · sha 9a61" },
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
function schedule(route: Route, item: Op, reference: number) {
  const cumulative = lengths(route.points);
  const total = cumulative[cumulative.length - 1];
  const atGate = cumulative[route.gate];
  const v = item.to === "bloqueada" ? reference : (total - atGate) / (item.end - item.gate);
  const start = item.gate - atGate / v;
  const arrive = item.gate + (total - atGate) / v;
  const hold = Math.max(0, (item.out - arrive) / (item.out - start));
  return { points: route.points, at: [round(start), item.out] as [number, number], hold: round(hold) };
}

export const packetsD = ops.map((item) => ({ op: item, ...schedule(routeD(item.agent, item.to), item, SPEED_D) }));
export const packetsM = ops.map((item) => ({ op: item, ...schedule(routeM(item.agent, item.to), item, SPEED_M) }));

/** Despacho de cada operación (sale del agente en la composición horizontal). */
export const dispatch = (index: number) => packetsD[index].at[0];

/** Inspector del broker (y agente resaltado): desde el despacho hasta que la tarjeta cruza la compuerta. */
export const inspectWindow = (item: Op, index: number): [number, number] => [round(Math.max(0.004, dispatch(index) - 0.004)), round(item.gate + 0.025)];

/** Veredicto de la compuerta: lámparas, carril abierto, proveedor que recibe o barrera y sello. */
export const verdictWindow = (item: Op): [number, number] => [round(item.gate - 0.004), round(item.to === "bloqueada" ? item.out + 0.01 : item.end + 0.04)];

/** Entrada en el libro de evidencia. */
export const ledgerAt = (item: Op) => round(item.to === "bloqueada" ? item.gate + 0.045 : item.end + 0.012);

/* ───────────── Líneas de tiempo en CSS (un solo keyframe por elemento) ───────────── */

type Frame = [offset: number, value: string];

/** Keyframes de un solo valor (transform u opacity) a partir de pares [fracción, valor]. */
export function keyframes(name: string, property: "transform" | "opacity", frames: Frame[]) {
  const sorted = [...frames].sort((a, b) => a[0] - b[0]);
  const body = sorted.map(([offset, value]) => `${(Math.min(Math.max(offset, 0), 1) * 100).toFixed(3)}%{${property}:${value}}`).join("");
  return `@keyframes ${name}{${body}}`;
}

/** Escalera: el valor cambia de un estado al siguiente en `ramp` (fracción del ciclo) a partir de cada instante. */
export function stair(states: { at: number; value: string }[], initial: string, ramp = 0.006): Frame[] {
  const frames: Frame[] = [[0, initial]];
  let previous = initial;
  for (const { at, value } of states) {
    frames.push([at, previous], [Math.min(at + ramp, 1), value]);
    previous = value;
  }
  frames.push([1, previous]);
  return frames;
}

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

const laneD = (from: number, to: ProviderId) =>
  orth([[from, geo.d.channelY], [geo.d.splitX, geo.d.channelY], [geo.d.splitX, geo.d.laneY[to]], [800, geo.d.laneY[to]]], 12);
const laneM = (from: number, to: ProviderId) =>
  orth([[geo.m.channelX, from], [geo.m.channelX, geo.m.splitY], [geo.m.laneX[to], geo.m.splitY], [geo.m.laneX[to], geo.m.providerY]], 10);

export const wiresD = {
  agents: (Object.keys(portD) as AgentId[]).map((agent) => {
    const py = portD[agent][1];
    return orth([[agents[agent].d[0] + agents[agent].d[2], py], [geo.d.busX, py], [geo.d.busX, geo.d.channelY], [geo.d.brokerIn, geo.d.channelY]], 10);
  }),
  lanes: { ia1: laneD(geo.d.gateOut, "ia1"), ia2: laneD(geo.d.gateOut, "ia2") },
  /** Carril abierto por la compuerta (resaltado del veredicto): desde la entrada de la compuerta. */
  open: { ia1: laneD(geo.d.gateIn, "ia1"), ia2: laneD(geo.d.gateIn, "ia2") },
  ports: portD,
};

export const wiresM = {
  agents: (Object.keys(portM) as AgentId[]).map((agent) => {
    const [px, py] = portM[agent];
    return orth([[px, py], [px, geo.m.busY], [geo.m.channelX, geo.m.busY], [geo.m.channelX, geo.m.brokerIn]], 10);
  }),
  lanes: { ia1: laneM(geo.m.gateOut, "ia1"), ia2: laneM(geo.m.gateOut, "ia2") },
  open: { ia1: laneM(geo.m.gateIn, "ia1"), ia2: laneM(geo.m.gateIn, "ia2") },
  ports: portM,
};

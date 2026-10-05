import type { Point } from "@/components/motion/Packet";

/*
 * Línea de tiempo de la escena de Atenor.
 * Todo se deriva de la geometría: las rutas de los paquetes se miden y de esa medida salen los momentos en que
 * el mensaje llega al núcleo, pasa por cada nodo, se clasifica, cae en su carril y la respuesta vuelve al chat.
 * Así los Step, los nodos que se encienden y el registro quedan sincronizados con el movimiento real.
 */

export const CYCLE = 15000;
const SECONDS = CYCLE / 1000;
/** Fin del estado completo: todo se desvanece y el ciclo vuelve a empezar. */
export const END = 14.25;
/** Segundos del ciclo → fracción 0–1 (para `at`). */
export const f = (seconds: number) => Math.min(Math.max(seconds / SECONDS, 0), 1);
export const win = (from: number, to: number): [number, number] => [f(from), f(to)];

/* ───────── Geometría del escenario de escritorio (lg+) ─────────
 * x: milésimas del ancho del escenario · y: píxeles. La capa de paquetes escala ambos ejes por separado,
 * así que las columnas pueden ser fluidas (porcentajes) con alturas fijas en píxeles. */
export const STAGE_H = 420;
export const COLS = { inbox: [0, 280], core: [365, 655], lanes: [740, 1000] } as const;
/** Parte superior de cada fila (hilo de chat y carril) y su alto. */
export const ROWS = [36, 167, 298];
export const ROW_H = 121;
/** Puerto de cada fila: a media altura del hilo o carril. */
export const PORTS = ROWS.map((top) => top + 60);
export const CORE_TOP = 36;
/** Banda del pipeline dentro del panel del núcleo (px desde el borde superior del panel). */
export const BAND = { top: 132, height: 112, y0: 59, y1: 93 };
export const Y0 = CORE_TOP + BAND.top + BAND.y0;
export const Y1 = CORE_TOP + BAND.top + BAND.y1;
/** Posición de los cuatro nodos como porcentaje del ancho del núcleo. */
export const NODES = [12, 40, 65, 87];
/** Buses verticales entre columnas (canal WhatsApp a la izquierda, acciones a la derecha). */
export const BUS_L = 322.5;
export const BUS_R = 697.5;
const CORNER = 10;
const coreX = (pct: number) => COLS.core[0] + ((COLS.core[1] - COLS.core[0]) * pct) / 100;
const NX = NODES.map(coreX);

/** Radio de la órbita alrededor del nodo IA, en px (escritorio) y su equivalente en x. */
const ORBIT_PX = 19;
const ORBIT_X = 15;
/** Banda del núcleo en mobile/tablet: x en milésimas del ancho del núcleo, y en décimas de px. */
export const BAND_SIZE: [number, number] = [1000, BAND.height * 10];
const MB = { y0: BAND.y0 * 10, y1: BAND.y1 * 10, rx: 44, ry: ORBIT_PX * 10 };

/** Velocidades (unidades del escenario por segundo). */
const SPEED = 235;
const REPLY_SPEED = 300;
const DOCK_HOLD = 0.32;

/* ───────── Contenido ───────── */
export const LANES = [
  { name: "Atención", sub: "tickets", tag: "ATENCIÓN", old: { ref: "T-07", text: "Cafetería", state: "resuelto" } },
  { name: "Clientes", sub: "fichas", tag: "CLIENTES", old: { ref: "C-030", text: "Clínica", state: "al día" } },
  { name: "Operación", sub: "tareas", tag: "OPERACIÓN", old: { ref: "OP-11", text: "Taller", state: "en curso" } },
];

export const INTENTS = ["Consulta", "Pedido", "Seguimiento", "Cita"] as const;
export type Intent = (typeof INTENTS)[number];

type MessageDef = {
  op: string;
  n: string;
  biz: string;
  initial: string;
  text: string;
  reply: string;
  intent: Intent;
  lane: number;
  card: { title: string; ref: string; detail: string };
  /** Datos que la IA extrae del mensaje. */
  data: [string, string][];
  /** Segundo del ciclo en que el cliente empieza a escribir. */
  t0: number;
};

const DEFS: MessageDef[] = [
  {
    op: "op-014",
    n: "01",
    biz: "Cafetería",
    initial: "C",
    text: "¿Me apartan un pastel hoy?",
    reply: "Claro, queda apartado.",
    intent: "Pedido",
    lane: 2,
    card: { title: "Tarea creada", ref: "OP-12", detail: "apartado" },
    data: [
      ["producto", "pastel"],
      ["para", "hoy"],
    ],
    t0: 0.25,
  },
  {
    op: "op-015",
    n: "02",
    biz: "Taller",
    initial: "T",
    text: "¿Ya quedó mi camioneta?",
    reply: "Está en revisión final.",
    intent: "Seguimiento",
    lane: 1,
    card: { title: "Cliente actualizado", ref: "C-031", detail: "seguimiento" },
    data: [
      ["vehículo", "camioneta"],
      ["orden", "abierta"],
    ],
    t0: 4.0,
  },
  {
    op: "op-016",
    n: "03",
    biz: "Clínica",
    initial: "Cl",
    text: "Quiero cita el jueves.",
    reply: "Hay espacio. ¿Te agendo?",
    intent: "Cita",
    lane: 0,
    card: { title: "Ticket creado", ref: "T-08", detail: "cita jueves" },
    data: [
      ["servicio", "consulta"],
      ["día", "jueves"],
    ],
    t0: 6.65,
  },
];

/* ───────── Rutas ───────── */
const same = (a: Point, b: Point) => Math.abs(a[0] - b[0]) < 1e-6 && Math.abs(a[1] - b[1]) < 1e-6;
const dist = (a: Point, b: Point) => Math.hypot(b[0] - a[0], b[1] - a[1]);

/** Redondea las esquinas de una polilínea ortogonal (las rectas se conservan para poder marcar puntos sobre ellas). */
function rounded(points: Point[], radius = CORNER): Point[] {
  const out: Point[] = [points[0]];
  for (let index = 1; index < points.length - 1; index++) {
    const [prev, at, next] = [points[index - 1], points[index], points[index + 1]];
    const d1 = dist(prev, at);
    const d2 = dist(at, next);
    const cross = (at[0] - prev[0]) * (next[1] - at[1]) - (at[1] - prev[1]) * (next[0] - at[0]);
    if (Math.abs(cross) < 1e-6 || d1 < 1e-6 || d2 < 1e-6) {
      out.push(at);
      continue;
    }
    const r = Math.min(radius, d1 / 2, d2 / 2);
    const a: Point = [at[0] + ((prev[0] - at[0]) * r) / d1, at[1] + ((prev[1] - at[1]) * r) / d1];
    const b: Point = [at[0] + ((next[0] - at[0]) * r) / d2, at[1] + ((next[1] - at[1]) * r) / d2];
    for (let step = 0; step <= 4; step++) {
      const t = step / 4;
      const u = 1 - t;
      out.push([u * u * a[0] + 2 * u * t * at[0] + t * t * b[0], u * u * a[1] + 2 * u * t * at[1] + t * t * b[1]]);
    }
  }
  out.push(points[points.length - 1]);
  return out.filter((point, index) => index === 0 || !same(point, out[index - 1]));
}

/** Órbita alrededor de un centro: entra por la izquierda y sale por la derecha tras `turns` vueltas. */
function orbit(center: Point, rx: number, ry: number, turns: number): Point[] {
  const count = Math.round(turns * 20);
  return Array.from({ length: count + 1 }, (_, index) => {
    const angle = Math.PI + (index / count) * turns * Math.PI * 2;
    return [center[0] + rx * Math.cos(angle), center[1] + ry * Math.sin(angle)] as Point;
  });
}

/** Mide una ruta y devuelve en qué fracción de su longitud está cada punto marcado. */
function measure(route: Point[], marks: Record<string, Point>) {
  const cumulative = [0];
  for (let index = 1; index < route.length; index++) cumulative.push(cumulative[index - 1] + dist(route[index - 1], route[index]));
  const total = cumulative[cumulative.length - 1];
  const at: Record<string, number> = {};
  for (const [name, point] of Object.entries(marks)) {
    // La órbita pasa varias veces por sus extremos: la salida es el último paso.
    const match = (candidate: Point) => same(candidate, point);
    const index = name === "orbitOut" ? route.findLastIndex(match) : route.findIndex(match);
    at[name] = index >= 0 ? cumulative[index] / total : NaN;
  }
  return { total, at };
}

/** Pasa una ruta a otra escala (la capa redondea a enteros: más resolución, curvas más limpias). */
const scale = (route: Point[], k: number): Point[] => route.map(([x, y]) => [x * k, y * k]);
export const STAGE_SIZE: [number, number] = [1000 * 4, STAGE_H * 4];

function buildMessage(def: MessageDef, index: number) {
  const p = PORTS[index];
  const q = PORTS[def.lane];
  const marks: Record<string, Point> = {
    portIn: [COLS.core[0], Y0],
    n1: [NX[0], Y0],
    orbitIn: [NX[1] - ORBIT_X, Y0],
    orbitOut: [NX[1] + ORBIT_X, Y0],
    n3: [NX[2], Y0],
    n4: [NX[3], Y0],
    portOut: [COLS.core[1], Y0],
  };
  const inbound = rounded([[COLS.inbox[1] + 2, p], [BUS_L, p], [BUS_L, Y0], marks.portIn, marks.n1, marks.orbitIn]);
  const outbound = rounded([marks.orbitOut, marks.n3, marks.n4, marks.portOut, [BUS_R, Y0], [BUS_R, q], [COLS.lanes[0] + 10, q]]);
  const route = [...inbound, ...orbit([NX[1], Y0], ORBIT_X, ORBIT_PX, 2.5).slice(1, -1), ...outbound];
  const { total, at } = measure(route, marks);

  const typing = def.t0;
  const bubble = def.t0 + 0.95;
  const depart = bubble + 0.3;
  const travel = total / SPEED;
  const time = (name: string) => depart + at[name] * travel;
  const dock = depart + travel;

  const replyRoute = rounded([marks.n4, [NX[3], Y1], [COLS.core[0], Y1], [BUS_L, Y1], [BUS_L, p], [COLS.inbox[1] + 2, p]]);
  const replyLength = measure(replyRoute, {}).total;
  const replyStart = time("n4") + 0.05;
  const replyArrive = replyStart + replyLength / REPLY_SPEED;

  // En mobile/tablet la banda del núcleo tiene su propia capa: la ventana se ajusta para cruzar N1 y N4 a la misma hora.
  const mobileRoute: Point[] = [
    [0, MB.y0],
    [NODES[0] * 10, MB.y0],
    ...orbit([NODES[1] * 10, MB.y0], MB.rx, MB.ry, 2.5),
    [NODES[2] * 10, MB.y0],
    [NODES[3] * 10, MB.y0],
    [1000, MB.y0],
  ];
  const mobile = measure(mobileRoute, { n1: [NODES[0] * 10, MB.y0], n4: [NODES[3] * 10, MB.y0] });
  const span = (time("n4") - time("n1")) / (mobile.at.n4 - mobile.at.n1);
  const mobileStart = time("n1") - mobile.at.n1 * span;

  return {
    ...def,
    index,
    times: {
      typing,
      bubble,
      depart,
      portIn: time("portIn"),
      n1: time("n1"),
      orbitIn: time("orbitIn"),
      orbitOut: time("orbitOut"),
      n3: time("n3"),
      n4: time("n4"),
      portOut: time("portOut"),
      dock,
      replyStart,
      replyArrive,
    },
    packets: {
      main: { route: scale(route, 4), at: win(depart, dock + DOCK_HOLD), hold: DOCK_HOLD / (travel + DOCK_HOLD) },
      reply: { route: scale(replyRoute, 4), at: win(replyStart, replyArrive + 0.22), hold: 0.22 / (replyArrive + 0.22 - replyStart) },
      mobile: { route: mobileRoute, at: win(mobileStart, mobileStart + span) },
      mobileReply: {
        route: [
          [NODES[3] * 10, MB.y0],
          [NODES[3] * 10, MB.y1],
          [0, MB.y1],
        ] as Point[],
        at: win(replyStart, replyStart + 1.1),
      },
    },
  };
}

export const MESSAGES = DEFS.map(buildMessage);
export type Message = (typeof MESSAGES)[number];

/** Trazos del escenario de escritorio (mismo sistema de coordenadas que los paquetes). */
const pathOf = (points: Point[]) => points.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
export const WIRES = {
  /** Canal WhatsApp: un solo bus de ida y vuelta entre los hilos y el núcleo. */
  inbound: PORTS.map((p) => pathOf(rounded([[COLS.inbox[1], p], [BUS_L, p], [BUS_L, Y0], [COLS.core[0], Y0]]))),
  reply: pathOf([
    [COLS.core[0], Y1],
    [BUS_L, Y1],
  ]),
  outbound: PORTS.map((q) => pathOf(rounded([[COLS.core[1], Y0], [BUS_R, Y0], [BUS_R, q], [COLS.lanes[0], q]]))),
};

/* ───────── Registro (log) ───────── */
export const LOG_LINE = 20;
export const LOG_VISIBLE = 6;

type LogLine = { time: string; tag: string; tone: "mist" | "signal" | "cool" | "gold"; text: string; at: number };
const clock = (seconds: number) => {
  const total = Math.floor(9 * 3600 + 41 * 60 + seconds);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor(total / 60) % 60)}:${pad(total % 60)}`;
};

export const LOG_PREAMBLE: LogLine[] = [
  { time: clock(-3), tag: "SIS", tone: "mist", text: "canal WhatsApp · 3 negocios", at: 0 },
  { time: clock(-2), tag: "IA", tone: "signal", text: "Proveedor IA 1 · activo", at: 0 },
  { time: clock(-1), tag: "REGLA", tone: "cool", text: "reglas por negocio listas", at: 0 },
];

const events: LogLine[] = MESSAGES.flatMap((m) => [
  { at: m.times.bubble, tag: "WA", tone: "mist" as const, text: `entrante · N${m.n} ${m.biz}` },
  { at: m.times.portIn, tag: "NÚCLEO", tone: "signal" as const, text: `${m.op} recibido` },
  { at: m.times.orbitOut - 0.35, tag: "IA", tone: "signal" as const, text: `intención: ${m.intent}` },
  { at: m.times.n3, tag: "REGLA", tone: "cool" as const, text: `${m.intent.toLowerCase()} → ${LANES[m.lane].name}` },
  { at: m.times.dock, tag: LANES[m.lane].tag, tone: "gold" as const, text: `${m.card.title.toLowerCase()} · ${m.card.ref}` },
  { at: m.times.replyArrive, tag: "WA", tone: "signal" as const, text: `respuesta enviada · N${m.n}` },
])
  .sort((a, b) => a.at - b.at)
  .map((line) => ({ ...line, time: clock(line.at) }));

// Si dos líneas llegan casi juntas, la segunda espera un instante para que el desplazamiento se lea.
for (let index = 1; index < events.length; index++) events[index].at = Math.max(events[index].at, events[index - 1].at + 0.34);

export const LOG_EVENTS = events;
export const LOG_LINES = [...LOG_PREAMBLE, ...events];
const logOffset = (shown: number) => (LOG_VISIBLE - shown) * LOG_LINE;
export const LOG_FINAL = logOffset(LOG_LINES.length);

/* ───────── Keyframes generados (estados con varias ventanas por ciclo y el desplazamiento del log) ───────── */
const pct = (seconds: number) => `${(f(seconds) * 100).toFixed(3)}%`;

function frames(list: [number, string][]) {
  const sorted = [...list].sort((a, b) => a[0] - b[0]);
  for (let index = 1; index < sorted.length; index++) {
    if (sorted[index][0] <= sorted[index - 1][0]) sorted[index][0] = sorted[index - 1][0] + 0.002;
  }
  return sorted.map(([seconds, css]) => `${pct(Math.min(seconds, SECONDS))}{${css}}`).join("");
}

/** Elemento que se enciende en varias ventanas del ciclo (solo opacidad). */
function litKeyframes(name: string, windows: [number, number][]) {
  const off = "opacity:0";
  const on = "opacity:1";
  const list: [number, string][] = [[0, off]];
  for (const [from, to] of windows) list.push([from, off], [from + 0.16, on], [to - 0.22, on], [to, off]);
  list.push([SECONDS, off]);
  return `@keyframes ${name}{${frames(list)}}`;
}

function logKeyframes(name: string) {
  const start = LOG_PREAMBLE.length;
  const move = (shown: number, opacity = 1) => `transform:translate3d(0,${logOffset(shown)}px,0);opacity:${opacity}`;
  const list: [number, string][] = [[0, move(start)]];
  events.forEach((line, index) => {
    list.push([line.at, move(start + index)], [line.at + 0.3, move(start + index + 1)]);
  });
  const last = LOG_LINES.length;
  list.push([END - 0.3, move(last)], [END, move(last, 0)], [END + 0.05, move(start, 0)], [END + 0.45, move(start)], [SECONDS, move(start)]);
  return `@keyframes ${name}{${frames(list)}}`;
}

/** Ventanas en que cada nodo del pipeline está encendido (uno por mensaje). */
export const NODE_WINDOWS: [number, number][][] = [
  MESSAGES.map((m) => [m.times.n1 - 0.12, m.times.n1 + 0.62]),
  MESSAGES.map((m) => [m.times.orbitIn - 0.1, m.times.orbitOut + 0.2]),
  MESSAGES.map((m) => [m.times.n3 - 0.12, m.times.n3 + 0.62]),
  MESSAGES.map((m) => [m.times.n4 - 0.12, m.times.n4 + 0.7]),
];

const EASE = "cubic-bezier(0.16,1,0.3,1)";
export const SCENE_CSS = [
  ...NODE_WINDOWS.map((windows, index) => litKeyframes(`atn-node-${index}`, windows)),
  logKeyframes("atn-log"),
  "@media (scripting: enabled) and (prefers-reduced-motion: no-preference){",
  ...NODE_WINDOWS.map((_, index) => `[data-atn="node-${index}"]{animation:atn-node-${index} ${CYCLE}ms ${EASE} infinite}`),
  `[data-atn="log"]{animation:atn-log ${CYCLE}ms ${EASE} infinite}`,
  "}",
].join("");

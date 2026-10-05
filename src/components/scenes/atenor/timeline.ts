import type { Point } from "@/components/motion/Packet";

/*
 * Línea de tiempo de la escena de Atenor.
 * Todo se deriva de la geometría: las rutas de los paquetes se miden y de esa medida salen los momentos en que
 * el mensaje llega al núcleo, pasa por cada nodo, se clasifica, cae en su carril y la respuesta vuelve al chat.
 * Así los Step, los nodos que se encienden, las tiras (chat, tarjeta en proceso, estado) y el registro quedan
 * sincronizados con el movimiento real.
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
/** Puerto de cada fila: a media altura del hilo o carril. */
export const PORTS = ROWS.map((top) => top + 60);
export const CORE_TOP = 36;
/** Banda del pipeline dentro del panel del núcleo (px desde el borde superior del panel). */
export const BAND = { top: 132, height: 112, y0: 59, y1: 96 };
export const Y0 = CORE_TOP + BAND.top + BAND.y0;
export const Y1 = CORE_TOP + BAND.top + BAND.y1;
/** Posición de los cuatro nodos como porcentaje del ancho del núcleo. */
export const NODES = [14, 40, 64, 86];
/** Buses verticales entre columnas (canal WhatsApp a la izquierda, acciones a la derecha). */
export const BUS_L = 322.5;
export const BUS_R = 697.5;
const CORNER = 10;
const CORE_W = COLS.core[1] - COLS.core[0];
const coreX = (pct: number) => COLS.core[0] + (CORE_W * pct) / 100;
const NX = NODES.map(coreX);

/** Órbita alrededor del nodo IA: corre sobre el anillo punteado (26 px). En x, unidades del escenario (~1.33 px). */
export const ORBIT_PX = 26;
const ORBIT_X = 19.5;

/**
 * Banda del núcleo en mobile/tablet: mismas unidades que el tramo del núcleo en escritorio (x 0–290, y en px),
 * multiplicadas por 10. Al ser una copia exacta de ese tramo, el paquete pasa por cada nodo a la misma hora.
 */
const K = 10;
export const BAND_SIZE: [number, number] = [CORE_W * K, BAND.height * K];
export const STAGE_SIZE: [number, number] = [1000 * 4, STAGE_H * 4];

/** Velocidades (unidades del escenario por segundo). */
const SPEED = 235;
const REPLY_SPEED = 300;
const DOCK_HOLD = 0.32;

/* ───────── Contenido ───────── */
export const LANES = [
  { name: "Atención", sub: "tickets", old: { ref: "T-07", text: "Cafetería", state: "resuelto" } },
  { name: "Clientes", sub: "fichas", old: { ref: "C-030", text: "Clínica", state: "al día" } },
  { name: "Operación", sub: "tareas", old: { ref: "OP-11", text: "Taller", state: "en curso" } },
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
  /** Intercambio anterior (atenuado) que el hilo muestra antes del mensaje nuevo. */
  history: { in: string; out: string; when: string };
  intent: Intent;
  lane: number;
  card: { title: string; ref: string; detail: string; log: string };
  /** Datos que la IA extrae del mensaje. */
  data: string;
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
    history: { in: "¿Abren el domingo?", out: "Sí, de 8 a 14 h.", when: "ayer" },
    intent: "Pedido",
    lane: 2,
    card: { title: "Tarea creada", ref: "OP-12", detail: "apartado", log: "tarea OP-12 creada" },
    data: "producto: pastel · para: hoy",
    t0: 0.25,
  },
  {
    op: "op-015",
    n: "02",
    biz: "Taller",
    initial: "T",
    text: "¿Ya quedó mi camioneta?",
    reply: "Está en revisión final.",
    history: { in: "¿Hacen afinación?", out: "Sí, con cita previa.", when: "ayer" },
    intent: "Seguimiento",
    lane: 1,
    card: { title: "Cliente actualizado", ref: "C-031", detail: "seguimiento", log: "ficha C-031 al día" },
    data: "vehículo: camioneta · orden: abierta",
    t0: 4.0,
  },
  {
    op: "op-016",
    n: "03",
    biz: "Clínica",
    initial: "Cl",
    text: "Quiero cita el jueves.",
    reply: "Hay espacio. ¿Te agendo?",
    history: { in: "¿Atienden sábados?", out: "Sí, por la mañana.", when: "lun" },
    intent: "Cita",
    lane: 0,
    card: { title: "Ticket creado", ref: "T-08", detail: "cita jueves", log: "ticket T-08 creado" },
    data: "servicio: consulta · día: jueves",
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

const scale = (route: Point[], k: number): Point[] => route.map(([x, y]) => [x * k, y * k]);
/** Tramo del escenario → coordenadas de la banda del núcleo (mobile/tablet). */
const toBand = (route: Point[]): Point[] => route.map(([x, y]) => [(x - COLS.core[0]) * K, (y - Y0 + BAND.y0) * K]);

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
  const loop = orbit([NX[1], Y0], ORBIT_X, ORBIT_PX, 2.5).slice(1, -1);
  const core: Point[] = [marks.portIn, marks.n1, marks.orbitIn, ...loop, marks.orbitOut, marks.n3, marks.n4, marks.portOut];
  const outbound = rounded([marks.orbitOut, marks.n3, marks.n4, marks.portOut, [BUS_R, Y0], [BUS_R, q], [COLS.lanes[0] + 10, q]]);
  const route = [...inbound, ...loop, ...outbound];
  const { total, at } = measure(route, marks);

  const typing = def.t0;
  const bubble = def.t0 + 0.95;
  const depart = bubble + 0.3;
  const travel = total / SPEED;
  const time = (name: string) => depart + at[name] * travel;
  const dock = depart + travel;

  const replyCore: Point[] = [marks.n4, [NX[3], Y1], [COLS.core[0], Y1]];
  const replyRoute = rounded([...replyCore, [BUS_L, Y1], [BUS_L, p], [COLS.inbox[1] + 2, p]]);
  const replyLength = measure(replyRoute, {}).total;
  const replyStart = time("n4") + 0.05;
  const replyArrive = replyStart + replyLength / REPLY_SPEED;
  const replyCoreTime = measure(replyCore, {}).total / REPLY_SPEED;

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
      // Mismo tramo y misma velocidad que en escritorio: entra al núcleo en portIn y sale en portOut.
      band: { route: toBand(core), at: win(time("portIn"), time("portOut")) },
      bandReply: { route: toBand(replyCore), at: win(replyStart, replyStart + replyCoreTime) },
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

const clock = (seconds: number) => {
  const total = Math.floor(9 * 3600 + 41 * 60 + seconds);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor(total / 60) % 60)}:${pad(total % 60)}`;
};
export const arrivalClock = (message: Message) => clock(message.times.portIn);

type Tone = "mist" | "signal" | "cool" | "gold";
type LogLine = { time: string; tag: string; tone: Tone; text: string; at: number };

export const LOG_PREAMBLE: LogLine[] = [
  { time: clock(-3), tag: "SIS", tone: "mist", text: "WhatsApp · 3 negocios", at: 0 },
  { time: clock(-2), tag: "IA", tone: "signal", text: "Proveedor IA 1 · activo", at: 0 },
  { time: clock(-1), tag: "REGLA", tone: "cool", text: "reglas por negocio listas", at: 0 },
];

const events: LogLine[] = MESSAGES.flatMap((m) => [
  { at: m.times.bubble, tag: "WA", tone: "mist" as const, text: `entrante · N${m.n} ${m.biz}` },
  { at: m.times.portIn, tag: "NÚCLEO", tone: "signal" as const, text: `${m.op} recibido` },
  { at: m.times.orbitOut - 0.35, tag: "IA", tone: "signal" as const, text: `intención: ${m.intent}` },
  { at: m.times.n3, tag: "REGLA", tone: "cool" as const, text: `${m.intent.toLowerCase()} → ${LANES[m.lane].name}` },
  { at: m.times.dock, tag: LANES[m.lane].name.toUpperCase(), tone: "gold" as const, text: m.card.log },
  { at: m.times.replyArrive, tag: "WA", tone: "signal" as const, text: `respuesta enviada · N${m.n}` },
])
  .sort((a, b) => a.at - b.at)
  .map((line) => ({ ...line, time: clock(line.at) }));

// Si dos líneas llegan casi juntas, la segunda espera un instante para que el desplazamiento se lea.
for (let index = 1; index < events.length; index++) events[index].at = Math.max(events[index].at, events[index - 1].at + 0.34);

export const LOG_LINES = [...LOG_PREAMBLE, ...events];
const logOffset = (shown: number) => (LOG_VISIBLE - shown) * LOG_LINE;
export const LOG_FINAL = logOffset(LOG_LINES.length);

/* ───────── Tiras: alturas compartidas con el CSS ───────── */
/** Hilo de chat: burbuja entrante 28 px, saliente 42 px, separación 6 px. Ventana de 76 px. */
export const CHAT = { inH: 28, outH: 42, gap: 6 };
/** Desplazamientos de la tira del chat: historial → mensaje nuevo → respuesta. */
export const CHAT_STOPS = [0, -(CHAT.inH + CHAT.gap), -(CHAT.inH + CHAT.outH + CHAT.gap * 2)];
/** Estado en la cabecera del hilo: en línea → escribiendo → procesando → respondido. */
export const STATUS_H = 14;
/** Tarjeta en proceso del núcleo: una por mensaje, con 12 px de separación. */
export const CARD_PITCH = 76 + 12;
/** Puntos de "escribiendo": separación entre puntos. */
export const DOT_STEP = 6;

/* ───────── Keyframes generados (todas con la duración del ciclo) ───────── */
const pct = (seconds: number) => `${(f(seconds) * 100).toFixed(3)}%`;

function frames(list: [number, string][]) {
  const sorted = [...list].sort((a, b) => a[0] - b[0]);
  for (let index = 1; index < sorted.length; index++) {
    if (sorted[index][0] <= sorted[index - 1][0]) sorted[index][0] = sorted[index - 1][0] + 0.002;
  }
  return sorted.map(([seconds, css]) => `${pct(Math.min(seconds, SECONDS))}{${css}}`).join("");
}

const ty = (px: number, opacity = 1) => `transform:translate3d(0,${px}px,0);opacity:${opacity}`;

/** Elemento que se enciende en varias ventanas del ciclo (solo opacidad). */
function litKeyframes(name: string, windows: [number, number][]) {
  const list: [number, string][] = [[0, "opacity:0"]];
  for (const [from, to] of windows) list.push([from, "opacity:0"], [from + 0.16, "opacity:1"], [to - 0.22, "opacity:1"], [to, "opacity:0"]);
  list.push([SECONDS, "opacity:0"]);
  return `@keyframes ${name}{${frames(list)}}`;
}

/**
 * Tira que avanza por posiciones (translateY) en momentos dados y, al final del ciclo, se desvanece y vuelve
 * a la primera posición. `stops`: [segundo, desplazamiento en px].
 */
function stripKeyframes(name: string, start: number, stops: [number, number][], move = 0.45) {
  const list: [number, string][] = [[0, ty(start)]];
  let current = start;
  for (const [at, offset] of stops) {
    list.push([at, ty(current)], [at + move, ty(offset)]);
    current = offset;
  }
  list.push([END - 0.3, ty(current)], [END, ty(current, 0)], [END + 0.05, ty(start, 0)], [END + 0.45, ty(start)], [SECONDS, ty(start)]);
  return `@keyframes ${name}{${frames(list)}}`;
}

/** Punto encendido que recorre los tres puntos de "escribiendo" mientras el cliente escribe. */
function typingKeyframes(name: string, from: number, to: number) {
  const tx = (step: number, opacity: number) => `transform:translate3d(${step * DOT_STEP}px,0,0);opacity:${opacity}`;
  const list: [number, string][] = [[0, tx(0, 0)], [from, tx(0, 0)], [from + 0.05, tx(0, 1)]];
  let step = 0;
  for (let t = from + 0.2; t < to - 0.1; t += 0.2) {
    list.push([t - 0.01, tx(step, 1)]);
    step = (step + 1) % 3;
    list.push([t, tx(step, 1)]);
  }
  list.push([to, tx(step, 0)], [SECONDS, tx(0, 0)]);
  return `@keyframes ${name}{${frames(list)}}`;
}

/** Ventanas en que cada nodo del pipeline está encendido (uno por mensaje). */
export const NODE_WINDOWS: [number, number][][] = [
  MESSAGES.map((m) => [m.times.n1 - 0.12, m.times.n1 + 0.62]),
  MESSAGES.map((m) => [m.times.orbitIn - 0.1, m.times.orbitOut + 0.2]),
  MESSAGES.map((m) => [m.times.n3 - 0.12, m.times.n3 + 0.62]),
  MESSAGES.map((m) => [m.times.n4 - 0.12, m.times.n4 + 0.7]),
];

const chatStops = (m: Message): [number, number][] => [
  [m.times.bubble, CHAT_STOPS[1]],
  [m.times.replyArrive - 0.05, CHAT_STOPS[2]],
];
const statusStops = (m: Message): [number, number][] => [
  [m.times.typing, -STATUS_H],
  [m.times.bubble + 0.2, -STATUS_H * 2],
  [m.times.replyArrive - 0.05, -STATUS_H * 3],
];
const cardStops: [number, number][] = MESSAGES.map((m, index) => [m.times.portIn - 0.15, -(index + 1) * CARD_PITCH]);

/** Valores finales (vista estática): el estado completo al terminar el ciclo. */
export const FINAL = {
  chat: CHAT_STOPS[2],
  status: -STATUS_H * 3,
  card: -MESSAGES.length * CARD_PITCH,
};

const EASE = "cubic-bezier(0.16,1,0.3,1)";
const run = (selector: string, name: string, easing = EASE) => `[data-atn="${selector}"]{animation:atn-${name} ${CYCLE}ms ${easing} infinite}`;

export const SCENE_CSS = [
  ...NODE_WINDOWS.map((windows, index) => litKeyframes(`atn-node-${index}`, windows)),
  logKeyframes(),
  stripKeyframes("atn-card", 0, cardStops, 0.55),
  ...MESSAGES.map((m) => stripKeyframes(`atn-chat-${m.index}`, 0, chatStops(m))),
  ...MESSAGES.map((m) => stripKeyframes(`atn-status-${m.index}`, 0, statusStops(m), 0.35)),
  ...MESSAGES.map((m) => typingKeyframes(`atn-dots-${m.index}`, m.times.typing, m.times.bubble)),
  "@media (scripting: enabled) and (prefers-reduced-motion: no-preference){",
  ...NODE_WINDOWS.map((_, index) => run(`node-${index}`, `node-${index}`)),
  run("log", "log"),
  run("card", "card"),
  ...MESSAGES.map((m) => run(`chat-${m.index}`, `chat-${m.index}`)),
  ...MESSAGES.map((m) => run(`status-${m.index}`, `status-${m.index}`)),
  ...MESSAGES.map((m) => run(`dots-${m.index}`, `dots-${m.index}`, "linear")),
  "}",
].join("");

/** Registro: cada evento empuja una línea hacia arriba (como una terminal). */
function logKeyframes() {
  const start = LOG_PREAMBLE.length;
  const move = (shown: number, opacity = 1) => ty(logOffset(shown), opacity);
  const list: [number, string][] = [[0, move(start)]];
  events.forEach((line, index) => {
    list.push([line.at, move(start + index)], [line.at + 0.3, move(start + index + 1)]);
  });
  const last = LOG_LINES.length;
  list.push([END - 0.3, move(last)], [END, move(last, 0)], [END + 0.05, move(start, 0)], [END + 0.45, move(start)], [SECONDS, move(start)]);
  return `@keyframes atn-log{${frames(list)}}`;
}

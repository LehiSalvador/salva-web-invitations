import type { CSSProperties } from "react";

/*
 * Línea de tiempo y geometría del recorrido de compra (Salva Exclusive Caps).
 * Una sola fuente de verdad: los Step, el Packet y los keyframes del cursor, el cajón, el comprobante y
 * los indicadores se calculan desde aquí, así que todo queda sincronizado con el ciclo de la escena.
 */

export const CYCLE = 16000;

/** Momentos clave, en fracciones del ciclo. */
export const T = {
  cursorIn: 0.03,
  decoy: 0.095,
  decoyOut: 0.14,
  target: 0.185,
  click1: 0.205,
  view2: 0.235,
  color: 0.295,
  colorOut: 0.32,
  talla: 0.35,
  click2: 0.362,
  add: 0.42,
  click3: 0.435,
  flyEnd: 0.495,
  drawer: 0.515,
  confirm: 0.595,
  click4: 0.61,
  confirmed: 0.618,
  print: 0.628,
  printEnd: 0.735,
  emit: 0.63,
  trigger: 0.668,
  /** Inicio de cada automatización; cada una corre RUN del ciclo. */
  rows: [0.676, 0.726, 0.776, 0.826],
  done: 0.88,
  out: 0.95,
} as const;

export const RUN = 0.05;

/* Catálogo: modelos genéricos, sin precios ni cifras. */
export type Product = { id: string; color: string; name: string; tag?: string };

export const products: Product[] = [
  { id: "01", name: "Negra", color: "#2c3134", tag: "Nuevo" },
  { id: "02", name: "Arena", color: "#c4ad82" },
  { id: "03", name: "Marino", color: "#36526d" },
  { id: "04", name: "Hueso", color: "#dcd4c4" },
  { id: "05", name: "Olivo", color: "#6f7b50", tag: "Nuevo" },
  { id: "06", name: "Vino", color: "#703a44" },
];

export const TARGET = 4;
export const DECOY = 1;

/*
 * Geometría en porcentajes del visor de la tienda: "w" (escritorio y tablet, 16:9.5) y "m" (teléfono, 3:4).
 * Cada caja es [x, y, ancho, alto]; el alto puede omitirse.
 */
export type Box = readonly [number, number, number, number?];
type Pair = { w: Box; m: Box };

export function box({ w, m }: Pair, extra?: CSSProperties): CSSProperties {
  const unit = (value: number | undefined) => (value === undefined ? "auto" : `${value}%`);
  return {
    "--wx": unit(w[0]),
    "--wy": unit(w[1]),
    "--ww": unit(w[2]),
    "--wh": unit(w[3]),
    "--mx": unit(m[0]),
    "--my": unit(m[1]),
    "--mw": unit(m[2]),
    "--mh": unit(m[3]),
    ...extra,
  } as CSSProperties;
}

const grid = (index: number, layout: "w" | "m"): Box => {
  if (layout === "w") return [3 + (index % 3) * 32, 22.5 + Math.floor(index / 3) * 38.5, 30, 35.5];
  return [4 + (index % 2) * 47, 18.5 + Math.floor(index / 2) * 26.5, 45, 24.5];
};

export const L = {
  header: { w: [0, 0, 100, 10], m: [0, 0, 100, 9] },
  catalogTitle: { w: [3, 12, 50, 8], m: [4, 10.5, 92, 6.5] },
  filters: { w: [55, 12, 42, 8], m: [4, 10.5, 92, 6.5] },
  card: (index: number): Pair => ({ w: grid(index, "w"), m: grid(index, "m") }),
  crumb: { w: [3, 12.5, 47, 5], m: [4, 10.5, 92, 4] },
  turntable: { w: [2, 17, 50, 82], m: [0, 13, 100, 38] },
  name: { w: [55, 20, 42, 8], m: [4, 50.5, 92, 7] },
  desc: { w: [55, 28.5, 38, 10], m: [4, 57, 92, 5] },
  colorLabel: { w: [55, 40.5, 30, 4], m: [4, 60, 40, 4] },
  colorDot: (index: number): Pair => ({ w: [55 + index * 4.4, 45.5, 3.1, 5.22], m: [4 + index * 9, 64.5, 6.4, 4.8] }),
  tallaLabel: { w: [55, 55, 30, 4], m: [4, 70, 40, 4] },
  talla: (index: number): Pair => ({ w: [55 + index * 10.5, 60, 9.5, 9], m: [4 + index * 21.5, 74.5, 19.5, 7.5] }),
  add: { w: [55, 73.5, 42, 10], m: [4, 84.5, 92, 10] },
  fine: { w: [55, 87, 42, 5], m: [4, 96, 92, 3] },
  scrim: { w: [0, 10, 60, 90], m: [0, 9, 100, 91] },
  drawer: { w: [60, 10, 40, 90], m: [0, 23, 100, 77] },
} satisfies Record<string, Pair | ((index: number) => Pair)>;

/* Contenido del cajón, en porcentajes del propio cajón. */
export const D = {
  head: { w: [7, 2.5, 86, 8.5], m: [5, 4, 90, 8] },
  item: { w: [7, 13, 86, 17], m: [5, 13.5, 90, 16] },
  delivery: { w: [7, 32, 86, 8], m: [5, 31.5, 90, 9] },
  confirm: { w: [7, 43, 86, 10.5], m: [5, 43, 90, 12] },
  receipt: { w: [11, 57, 78, 39.4], m: [10, 59, 80, 37.6] },
  slot: { w: [4, 96.4, 92, 1.8], m: [4, 96.6, 92, 1.8] },
} satisfies Record<string, Pair>;

/** Centro de una caja del cajón en coordenadas del visor. */
const inDrawer = (inner: Box, drawer: Box, fx = 0.5, fy = 0.5): [number, number] => [
  drawer[0] + (drawer[2] * (inner[0] + inner[2] * fx)) / 100,
  drawer[1] + ((drawer[3] ?? 0) * (inner[1] + (inner[3] ?? 0) * fy)) / 100,
];

const center = (b: Box, fx = 0.5, fy = 0.5): [number, number] => [b[0] + b[2] * fx, b[1] + (b[3] ?? b[2]) * fy];

/** Recorrido del cursor por punto de interés, en % del visor. */
const cursor = {
  w: {
    start: [91, 97],
    decoy: center(L.card(DECOY).w, 0.52, 0.42),
    target: center(L.card(TARGET).w, 0.5, 0.4),
    color: center(L.colorDot(TARGET).w, 0.6, 0.85),
    talla: center(L.talla(1).w, 0.55, 0.6),
    add: center(L.add.w, 0.42, 0.6),
    confirm: inDrawer(D.confirm.w, L.drawer.w, 0.48, 0.6),
    exit: [97, 34],
    cart: [96.2, 5],
  },
  m: {
    start: [86, 99],
    decoy: center(L.card(DECOY).m, 0.5, 0.4),
    target: center(L.card(TARGET).m, 0.5, 0.42),
    color: center(L.colorDot(TARGET).m, 0.6, 0.85),
    talla: center(L.talla(1).m, 0.5, 0.6),
    add: center(L.add.m, 0.5, 0.55),
    confirm: inDrawer(D.confirm.m, L.drawer.m, 0.5, 0.55),
    exit: [94, 46],
    cart: [91.5, 4.5],
  },
} as const;

type PointName = keyof typeof cursor.w;

/* ---------- keyframes generados ---------- */

const MOVE = "cubic-bezier(.5,0,.2,1)";
const OUT = "cubic-bezier(.16,1,.3,1)";
const LIN = "linear";

type Frame = [at: number, decl: string, ease?: string];

const pct = (at: number) => `${+(Math.min(Math.max(at, 0), 1) * 100).toFixed(3)}%`;

function keyframes(name: string, frames: Frame[]) {
  const sorted = [...frames].sort((a, b) => a[0] - b[0]);
  return `@keyframes ${name}{${sorted.map(([at, decl, ease]) => `${pct(at)}{${decl}${ease ? `;animation-timing-function:${ease}` : ""}}`).join("")}}`;
}

const at = (name: PointName) => `translate3d(var(--${name}-x),var(--${name}-y),0)`;

function cursorFrames(): Frame[] {
  const go = (time: number, name: PointName, ease = MOVE, opacity = 1): Frame => [time, `transform:${at(name)};opacity:${opacity}`, ease];
  return [
    go(0, "start", LIN, 0),
    go(T.cursorIn, "start"),
    go(T.decoy, "decoy"),
    go(T.decoyOut, "decoy"),
    go(T.target, "target"),
    go(T.view2 + 0.02, "target"),
    go(T.color, "color"),
    go(T.colorOut, "color"),
    go(T.talla, "talla"),
    go(T.click2 + 0.022, "talla"),
    go(T.add, "add"),
    go(T.drawer + 0.03, "add"),
    go(T.confirm, "confirm"),
    go(T.click4 + 0.03, "confirm", "ease-in"),
    go(0.7, "exit", LIN, 0),
    go(1, "exit", LIN, 0),
  ];
}

const clicks = [T.click1, T.click2, T.click3, T.click4];

function pressFrames(): Frame[] {
  const frames: Frame[] = [[0, "transform:scale(1)"], [1, "transform:scale(1)"]];
  for (const click of clicks) {
    frames.push([click - 0.008, "transform:scale(1)", "ease-in"], [click, "transform:scale(.8)", OUT], [click + 0.016, "transform:scale(1)"]);
  }
  return frames;
}

function rippleFrames(): Frame[] {
  const frames: Frame[] = [[0, "transform:scale(.2);opacity:0"], [1, "transform:scale(.2);opacity:0"]];
  for (const click of clicks) {
    frames.push(
      [click - 0.001, "transform:scale(.2);opacity:0"],
      [click, "transform:scale(.3);opacity:.95", OUT],
      [click + 0.04, "transform:scale(1.9);opacity:0"],
    );
  }
  return frames;
}

/** Ticker vertical: muestra la línea `index` de `count` (translateY en % del propio bloque). */
const line = (index: number, count: number) => `transform:translate3d(0,${-((100 / count) * index).toFixed(3)}%,0)`;

function tickerFrames(changes: number[], count: number, resetAt = T.out): Frame[] {
  const frames: Frame[] = [[0, `${line(0, count)};opacity:1`]];
  changes.forEach((time, index) => {
    frames.push([time, `${line(index, count)};opacity:1`, OUT], [time + 0.014, `${line(index + 1, count)};opacity:1`]);
  });
  frames.push(
    [resetAt, `${line(count - 1, count)};opacity:1`, "ease-in"],
    [resetAt + 0.018, `${line(count - 1, count)};opacity:0`],
    [resetAt + 0.022, `${line(0, count)};opacity:0`, "ease-out"],
    [1, `${line(0, count)};opacity:1`],
  );
  return frames;
}

/** Eventos del registro del sistema (el último es el estado final). */
export const LOG: { tag: "ui" | "cart" | "api" | "auto" | "ok"; text: string; at: number }[] = [
  { tag: "ui", text: "sesión iniciada", at: 0 },
  { tag: "ui", text: "catálogo cargado", at: 0.02 },
  { tag: "ui", text: "vista rápida · gorra-02", at: T.decoy },
  { tag: "ui", text: "producto · gorra-05", at: T.view2 },
  { tag: "ui", text: "talla seleccionada · M", at: T.click2 },
  { tag: "cart", text: "artículo agregado", at: T.flyEnd },
  { tag: "api", text: "pedido.confirmado", at: T.confirmed },
  { tag: "auto", text: "pedido registrado", at: T.rows[0] + RUN },
  { tag: "auto", text: "confirmación enviada", at: T.rows[1] + RUN },
  { tag: "auto", text: "inventario actualizado", at: T.rows[2] + RUN },
  { tag: "auto", text: "envío preparado", at: T.rows[3] + RUN },
  { tag: "ok", text: "flujo completado", at: T.done },
];

export const LOG_ROWS = 5;
export const LOG_LINE = 20;

function logFrames(): Frame[] {
  // La columna está anclada abajo: el evento `index` queda en la última fila y el bloque sube una línea por evento.
  const y = (index: number) => `transform:translate3d(0,${(LOG.length - 1 - index) * LOG_LINE}px,0)`;
  const frames: Frame[] = [[0, `${y(0)};opacity:1`]];
  LOG.forEach((event, index) => {
    if (index === 0) return;
    frames.push([event.at, `${y(index - 1)};opacity:1`, OUT], [event.at + 0.012, `${y(index)};opacity:1`]);
  });
  const last = LOG.length - 1;
  frames.push([T.out, `${y(last)};opacity:1`, "ease-in"], [T.out + 0.018, `${y(last)};opacity:0`], [T.out + 0.022, `${y(0)};opacity:0`], [1, `${y(0)};opacity:1`]);
  return frames;
}

const STAGES = [0, T.view2, T.drawer, T.trigger];

function fillFrames(): Frame[] {
  return [
    [0, "transform:scaleX(0);opacity:1", LIN],
    [T.view2, "transform:scaleX(.25);opacity:1", LIN],
    [T.drawer, "transform:scaleX(.5);opacity:1", LIN],
    [T.trigger, "transform:scaleX(.75);opacity:1", LIN],
    [T.done, "transform:scaleX(1);opacity:1", LIN],
    [T.out, "transform:scaleX(1);opacity:1", "ease-in"],
    [T.out + 0.02, "transform:scaleX(1);opacity:0"],
    [T.out + 0.025, "transform:scaleX(0);opacity:0"],
    [1, "transform:scaleX(0);opacity:1"],
  ];
}

function markFrames(): Frame[] {
  const x = (index: number) => `transform:translate3d(${index * 100}%,0,0)`;
  const frames: Frame[] = [[0, `${x(0)};opacity:1`]];
  STAGES.slice(1).forEach((time, index) => frames.push([time - 0.004, `${x(index)};opacity:1`, OUT], [time + 0.02, `${x(index + 1)};opacity:1`]));
  frames.push([T.out, `${x(3)};opacity:1`, "ease-in"], [T.out + 0.02, `${x(3)};opacity:0`], [T.out + 0.025, `${x(0)};opacity:0`], [1, `${x(0)};opacity:1`]);
  return frames;
}

function drawerFrames(): Frame[] {
  const hidden = "transform:translate3d(var(--hide-x),var(--hide-y),0)";
  return [
    [0, hidden],
    [T.drawer, hidden, OUT],
    [T.drawer + 0.04, "transform:translate3d(0,0,0)"],
    [T.out - 0.004, "transform:translate3d(0,0,0)", "cubic-bezier(.7,0,.84,0)"],
    [T.out + 0.024, hidden],
    [1, hidden],
  ];
}

function printFrames(): Frame[] {
  // Alimentación por tramos, como una impresora térmica: el papel sube desde la ranura.
  const y = (value: number) => `transform:translate3d(0,${value}%,0)`;
  const span = T.printEnd - T.print;
  const feed = [101, 80, 58, 36, 16, 0];
  const frames: Frame[] = [[0, `${y(101)};opacity:1`]];
  feed.forEach((value, index) => {
    if (index === 0) return;
    const start = T.print + ((index - 1) / (feed.length - 1)) * span;
    frames.push([start, y(feed[index - 1]), "cubic-bezier(.3,0,.2,1)"], [start + (span / (feed.length - 1)) * 0.55, y(value)]);
  });
  frames.push([T.out, `${y(0)};opacity:1`, "ease-in"], [T.out + 0.02, `${y(0)};opacity:0`], [T.out + 0.024, `${y(101)};opacity:0`], [1, `${y(101)};opacity:1`]);
  return frames;
}

function flyFrames(axis: "x" | "y"): Frame[] {
  const from = axis === "x" ? "translate3d(var(--add-x),0,0)" : "translate3d(0,var(--add-y),0)";
  const to = axis === "x" ? "translate3d(var(--cart-x),0,0)" : "translate3d(0,var(--cart-y),0) scale(.5)";
  const start = T.click3 + 0.004;
  const ease = axis === "x" ? "cubic-bezier(.45,0,.75,1)" : "cubic-bezier(.12,.75,.3,1)";
  return [
    [0, `transform:${from};opacity:0`],
    [start, `transform:${from};opacity:0`, LIN],
    [start + 0.006, `transform:${from};opacity:1`, ease],
    [T.flyEnd, `transform:${to};opacity:1`, LIN],
    [T.flyEnd + 0.008, `transform:${to};opacity:0`],
    [1, `transform:${to};opacity:0`],
  ];
}

function emitFrames(): Frame[] {
  const from = "transform:translate3d(0,0,0)";
  const to = "transform:translate3d(var(--emit-x),var(--emit-y),0)";
  return [
    [0, `${from};opacity:0`],
    [T.emit, `${from};opacity:0`, LIN],
    [T.emit + 0.006, `${from};opacity:1`, "cubic-bezier(.5,0,.3,1)"],
    [T.trigger - 0.004, `${to};opacity:1`, LIN],
    [T.trigger + 0.004, `${to};opacity:0`],
    [1, `${to};opacity:0`],
  ];
}

function pipeFrames(): Frame[] {
  return [
    [0, "transform:scaleY(0);opacity:1"],
    [T.rows[0], "transform:scaleY(0);opacity:1", LIN],
    [T.rows[3], "transform:scaleY(1);opacity:1"],
    [T.out, "transform:scaleY(1);opacity:1", "ease-in"],
    [T.out + 0.02, "transform:scaleY(1);opacity:0"],
    [T.out + 0.025, "transform:scaleY(0);opacity:0"],
    [1, "transform:scaleY(0);opacity:1"],
  ];
}

/** Clases globales (prefijo capsx-) que la escena aplica a sus elementos animados. */
export const A = {
  cursor: "capsx-a capsx-cur",
  press: "capsx-a capsx-press",
  ripple: "capsx-a capsx-ripple",
  flyX: "capsx-a capsx-flyx",
  flyY: "capsx-a capsx-flyy",
  drawer: "capsx-a capsx-drawer",
  print: "capsx-a capsx-print",
  address: "capsx-a capsx-addr",
  stage: "capsx-a capsx-stage",
  fill: "capsx-a capsx-fill",
  mark: "capsx-a capsx-mark",
  trigger: "capsx-a capsx-trig",
  row: (index: number) => `capsx-a capsx-st${index}`,
  log: "capsx-a capsx-log",
  pipe: "capsx-a capsx-pipe",
  emit: "capsx-a capsx-emit",
};

const vars = (layout: "w" | "m") =>
  Object.entries(cursor[layout])
    .map(([name, [x, y]]) => `--${name}-x:${x.toFixed(2)}cqw;--${name}-y:${y.toFixed(2)}cqh;`)
    .join("");

/** Hoja generada: variables del recorrido por diseño, keyframes y reglas de animación. */
export function sceneCss() {
  const anims: [string, Frame[]][] = [
    ["capsx-cur", cursorFrames()],
    ["capsx-press", pressFrames()],
    ["capsx-ripple", rippleFrames()],
    ["capsx-flyx", flyFrames("x")],
    ["capsx-flyy", flyFrames("y")],
    ["capsx-drawer", drawerFrames()],
    ["capsx-print", printFrames()],
    ["capsx-addr", tickerFrames([T.view2, T.drawer, T.confirmed], 4)],
    ["capsx-stage", tickerFrames(STAGES.slice(1), 4)],
    ["capsx-fill", fillFrames()],
    ["capsx-mark", markFrames()],
    ["capsx-trig", tickerFrames([T.trigger], 2)],
    ...T.rows.map((start, index): [string, Frame[]] => [`capsx-st${index}`, tickerFrames([start, start + RUN], 3)]),
    ["capsx-log", logFrames()],
    ["capsx-pipe", pipeFrames()],
    ["capsx-emit", emitFrames()],
  ];
  return [
    `.capsx-layer{${vars("m")}}@media (width>=40rem){.capsx-layer{${vars("w")}}}`,
    ...anims.map(([name, frames]) => `${keyframes(name, frames)}.${name}{animation:${name} ${CYCLE}ms linear infinite}`),
    "@media (prefers-reduced-motion:reduce),(scripting:none){.capsx-a{animation:none!important}}",
  ].join("");
}

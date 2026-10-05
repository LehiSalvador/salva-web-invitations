import { groundShadow, headingOf, hull, iso, mound, nearness, PAL, prism, ptsOf, rect, silo, truck, type Heading, type Palette, type Poly, type Pt } from "./iso";

/*
 * Modelo del patio: retícula de ubicaciones (columnas A–G × filas 01–08), zonas, volúmenes,
 * rutas de camiones y la línea de tiempo compartida. Todo se calcula una vez en el servidor.
 */

export const CYCLE = 18000;
/** Ciclo de la vista previa: cabe en una diapositiva del showcase (máx. 12 s). */
export const PREVIEW_CYCLE = 11600;

/* ───────── Retícula ───────── */
export const COLS = ["A", "B", "C", "D", "E", "F", "G"] as const;
export const COL_W = 150;
export const ROW0 = 60;
export const ROW_H = 65;
export const ROWS = 8;
export const colX = (index: number) => index * COL_W;
export const rowY = (row: number) => ROW0 + (row - 1) * ROW_H;
export const rowMid = (row: number) => rowY(row) + ROW_H / 2;
const STORE = (index: number): [number, number] => [colX(index) + 52, colX(index) + 146];
export const NORTH_ROAD = 29;
export const SOUTH_ROAD = 612;
export const GATE_IN = { x0: 935, x1: 1015, lane: 975 };
export const GATE_OUT = { x0: 140, x1: 210, lane: 175 };

export type Zone = { id: string; col: number; kind: string; note: string };
export const ZONES: Zone[] = [
  { id: "A", col: 0, kind: "Bloques", note: "A-01 → A-08" },
  { id: "B", col: 1, kind: "Granel", note: "B-01 → B-08" },
  { id: "C", col: 2, kind: "Perfiles", note: "C-01 → C-08" },
  { id: "D", col: 3, kind: "Granel", note: "D-01 → D-08" },
  { id: "E", col: 4, kind: "Tarimas", note: "E-01 → E-08" },
  { id: "F", col: 5, kind: "Silos", note: "F-01 → F-06" },
];

/** Ubicación destacada y destino de T-02. */
export const B07 = { x: (STORE(1)[0] + STORE(1)[1]) / 2, y: rowMid(7) };
export const D06 = { x: (STORE(3)[0] + STORE(3)[1]) / 2, y: rowMid(6) };
export const AISLE_D = colX(3) + 25;

/* ───────── Rutas y tiempos ───────── */

type Drive = { path: Pt[]; t0: number; t1: number; accel: number; decel: number };

const lengthOf = (path: Pt[]) => path.slice(1).reduce((sum, p, index) => sum + Math.hypot(p[0] - path[index][0], p[1] - path[index][1]), 0);

/** Perfil trapezoidal de velocidad: acelera, avanza y frena. Devuelve el tiempo (fracción del ciclo) en la distancia s. */
function timeAt(drive: Drive, s: number) {
  const total = lengthOf(drive.path);
  const span = drive.t1 - drive.t0;
  const vmax = (total + drive.accel + drive.decel) / span;
  const ta = (2 * drive.accel) / vmax;
  const td = (2 * drive.decel) / vmax;
  if (drive.accel && s < drive.accel) return drive.t0 + ta * Math.sqrt(Math.max(s, 0) / drive.accel);
  if (drive.decel && s > total - drive.decel) return drive.t1 - td * Math.sqrt(Math.max(total - s, 0) / drive.decel);
  return drive.t0 + ta + (s - drive.accel) / vmax;
}

function pointAt(path: Pt[], s: number): { p: Pt; dir: Pt } {
  let left = s;
  for (let index = 1; index < path.length; index++) {
    const [x0, y0] = path[index - 1];
    const [x1, y1] = path[index];
    const length = Math.hypot(x1 - x0, y1 - y0);
    if (left <= length || index === path.length - 1) {
      const k = length ? Math.min(left / length, 1) : 0;
      return { p: [x0 + (x1 - x0) * k, y0 + (y1 - y0) * k], dir: [x1 - x0, y1 - y0] };
    }
    left -= length;
  }
  return { p: path[path.length - 1], dir: [0, -1] };
}

export type Sample = { t: number; p: Pt; heading: Heading };

/** Muestras (t, posición, rumbo): en cada vértice y cada pocas unidades donde la velocidad cambia. */
function sample(drive: Drive): Sample[] {
  const total = lengthOf(drive.path);
  const marks = new Set<number>([0, total]);
  let walked = 0;
  drive.path.slice(1).forEach((p, index) => {
    walked += Math.hypot(p[0] - drive.path[index][0], p[1] - drive.path[index][1]);
    marks.add(walked);
  });
  for (let s = 0; s < drive.accel; s += 9) marks.add(s);
  for (let s = total - drive.decel; s < total; s += 9) marks.add(Math.max(s, 0));
  return [...marks]
    .sort((a, b) => a - b)
    .map((s) => {
      const { dir } = pointAt(drive.path, Math.min(s + 0.01, total));
      return { t: timeAt(drive, s), p: pointAt(drive.path, s).p, heading: headingOf(dir[0], dir[1]) };
    });
}

/** Distancia recorrida hasta el primer punto de la ruta que cruza la recta y = value (o x = value). */
function distanceTo(path: Pt[], axis: 0 | 1, value: number) {
  let walked = 0;
  for (let index = 1; index < path.length; index++) {
    const a = path[index - 1];
    const b = path[index];
    const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if ((a[axis] - value) * (b[axis] - value) <= 0 && a[axis] !== b[axis]) return walked + (length * (value - a[axis])) / (b[axis] - a[axis]);
    walked += length;
  }
  return walked;
}

const accessIn: Pt[] = [
  [GATE_IN.lane, 770],
  [GATE_IN.lane, 668],
];
const accessTo = (aisle: number, stop: number): Pt[] => [
  [GATE_IN.lane, 668],
  [GATE_IN.lane, SOUTH_ROAD + 14],
  [GATE_IN.lane - 14, SOUTH_ROAD],
  [aisle + 14, SOUTH_ROAD],
  [aisle, SOUTH_ROAD - 14],
  [aisle, stop],
];

export type TruckPlan = {
  id: string;
  appear: number;
  vanish: number;
  drives: Drive[];
  /** Instante en que cambia de vacío a cargado (o al revés). */
  swap: number;
  loadedAtStart: boolean;
  pal: Palette;
};

export const T01: TruckPlan = {
  id: "T-01",
  appear: 0,
  vanish: 0.6,
  loadedAtStart: true,
  swap: 0.44,
  pal: PAL.cab,
  drives: [
    { path: accessIn, t0: 0, t1: 0.048, accel: 0, decel: 60 },
    { path: accessTo(GATE_OUT.lane, B07.y), t0: 0.074, t1: 0.272, accel: 50, decel: 70 },
    {
      path: [
        [GATE_OUT.lane, B07.y],
        [GATE_OUT.lane, -130],
      ],
      t0: 0.468,
      t1: 0.6,
      accel: 55,
      decel: 0,
    },
  ],
};

export const T02: TruckPlan = {
  id: "T-02",
  appear: 0.4,
  vanish: 0.915,
  loadedAtStart: false,
  swap: 0.736,
  pal: PAL.cabCool,
  drives: [
    { path: accessIn, t0: 0.4, t1: 0.448, accel: 0, decel: 60 },
    { path: accessTo(AISLE_D, D06.y), t0: 0.472, t1: 0.64, accel: 50, decel: 70 },
    {
      path: [
        [AISLE_D, D06.y],
        [AISLE_D, NORTH_ROAD + 14],
        [AISLE_D - 14, NORTH_ROAD],
        [GATE_OUT.lane + 14, NORTH_ROAD],
        [GATE_OUT.lane, NORTH_ROAD - 14],
        [GATE_OUT.lane, -130],
      ],
      t0: 0.752,
      t1: 0.915,
      accel: 55,
      decel: 0,
    },
  ],
};

export const samplesOf = (plan: TruckPlan) => plan.drives.flatMap(sample);

/** Momentos clave derivados de las rutas (para el log, chips y barreras). */
const cross = (drive: Drive, axis: 0 | 1, value: number) => timeAt(drive, distanceTo(drive.path, axis, value));
export const MOMENTS = {
  t01Gate: cross(T01.drives[1], 1, 640),
  t01Road: cross(T01.drives[1], 0, GATE_IN.lane - 20),
  t01ZoneB: cross(T01.drives[1], 0, GATE_OUT.lane + 16),
  t01Arrive: T01.drives[1].t1,
  unloadStart: 0.292,
  unloadEnd: 0.44,
  t01Leave: T01.drives[2].t0,
  t01Exit: cross(T01.drives[2], 1, 0),
  t02Gate: cross(T02.drives[1], 1, 640),
  t02Road: cross(T02.drives[1], 0, GATE_IN.lane - 20),
  t02Arrive: T02.drives[1].t1,
  loadStart: 0.656,
  loadEnd: 0.736,
  t02Leave: T02.drives[2].t0,
  t02Exit: cross(T02.drives[2], 1, 0),
  reset: 0.965,
};

/* ───────── Volúmenes ───────── */

export type Volume = { polys: Poly[]; near: number; box: [number, number, number, number]; screen: [number, number, number, number] };

const screenBox = (polys: Poly[]): Volume["screen"] => {
  const xs: number[] = [];
  const ys: number[] = [];
  polys.forEach((poly) =>
    poly.pts.split(" ").forEach((pair) => {
      const [x, y] = pair.split(",").map(Number);
      xs.push(x);
      ys.push(y);
    }),
  );
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
};

function volume(polys: Poly[], box: Volume["box"]): Volume {
  return { polys, near: nearness((box[0] + box[2]) / 2, (box[1] + box[3]) / 2), box, screen: screenBox(polys) };
}

/** Pila de bloques con líneas de capa en las caras visibles. */
type Detail = "full" | "lite";

function stack(x0: number, y0: number, x1: number, y1: number, layers: number, layerH: number, pal: Palette, lines = true): Volume | null {
  if (!layers) return null;
  const top = layers * layerH;
  const polys = prism(rect(x0, y0, x1, y1), 0, top, pal);
  for (let layer = 1; lines && layer < layers; layer++) {
    const z = layer * layerH;
    polys.push({ pts: ptsOf([iso(x0, y0, z), iso(x0, y1, z), iso(x1, y1, z)]), fill: "none", stroke: "rgb(6 8 9 / 0.55)", sw: 0.8 });
  }
  return volume(polys, [x0, y0, x1, y1]);
}

function pile(cx: number, cy: number, rx: number, ry: number, h: number, pal: Palette, seed: number, sides = 14): Volume {
  const polys: Poly[] = [{ pts: ptsOf(groundShadow(cx, cy, rx * 1.02, ry * 1.02, h * 0.35)), fill: "rgb(0 0 0 / 0.32)" }, ...mound(cx, cy, rx, ry, h, pal, seed, sides)];
  return volume(polys, [cx - rx, cy - ry, cx + rx, cy + ry]);
}

function parked(x: number, y: number, heading: Heading, loaded: boolean, pal: Palette): Volume {
  const [px, py] = iso(x, y, 0);
  const polys = truck(heading, loaded, pal).map((poly) => ({
    ...poly,
    pts: poly.pts
      .split(" ")
      .map((pair) => {
        const [dx, dy] = pair.split(",").map(Number);
        return `${Math.round((dx + px) * 10) / 10},${Math.round((dy + py) * 10) / 10}`;
      })
      .join(" "),
  }));
  return volume(polys, [x - 22, y - 9, x + 22, y + 9]);
}

function buildVolumes(detail: Detail): Volume[] {
  const out: (Volume | null)[] = [];
  const lite = detail === "lite";
  const sides = lite ? 10 : 14;

  // Zona A · bloques (dos pilas por ubicación; la fila 07 queda baja para no tapar a T-01).
  const aLayers = [
    [3, 2],
    [4, 3],
    [2, 0],
    [3, 4],
    [2, 1],
    [0, 3],
    [1, 1],
    [2, 3],
  ];
  aLayers.forEach(([west, east], index) => {
    const y = rowY(index + 1);
    out.push(stack(56, y + 8, 97, y + 57, west, 11, PAL.block, !lite));
    out.push(stack(101, y + 8, 142, y + 57, east, 11, PAL.block, !lite));
  });

  // Zona B · granel en bahías con muros bajos; B-07 es la ubicación destacada.
  const [bx0, bx1] = STORE(1);
  for (let row = 1; row <= ROWS + 1; row++) {
    const y = rowY(row);
    out.push(volume(prism(rect(bx0, y - 2, bx1, y + 2), 0, 12, PAL.concrete), [bx0, y - 2, bx1, y + 2]));
  }
  out.push(volume(prism(rect(bx1 - 4, ROW0 - 2, bx1, rowY(ROWS + 1) + 2), 0, 14, PAL.concrete), [bx1 - 4, ROW0, bx1, rowY(ROWS + 1)]));
  // B-07 (fila 07) empieza vacía: su material llega con la descarga de T-01.
  const bHeights = [20, 26, 15, 24, 0, 22, 0, 26];
  bHeights.forEach((h, index) => {
    if (!h) return;
    const row = index + 1;
    out.push(pile((bx0 + bx1) / 2 - 2, rowMid(row), 36, 21, h, PAL.bulk, row * 1.7, sides));
  });

  // Zona C · perfiles (atados largos, tono frío).
  const [cx0, cx1] = STORE(2);
  const cLayers = [
    [2, 1],
    [1, 2],
    [2, 2],
    [1, 0],
    [2, 1],
    [0, 1],
    [2, 2],
    [1, 1],
  ];
  cLayers.forEach(([north, south], index) => {
    const y = rowY(index + 1);
    out.push(stack(cx0 + 4, y + 9, cx1 - 4, y + 29, north, 8, PAL.bundle, !lite));
    out.push(stack(cx0 + 4, y + 36, cx1 - 4, y + 56, south, 8, PAL.bundle, !lite));
  });

  // Zona D · granel en pilas grandes que abarcan dos filas.
  const [dx0, dx1] = STORE(3);
  [44, 34, 52, 30].forEach((h, index) => {
    out.push(pile((dx0 + dx1) / 2, rowY(index * 2 + 1) + ROW_H, 44, 54, h, PAL.bulk, index * 2.3 + 0.6, sides));
  });

  // Zona E · tarimas.
  const [ex0, ex1] = STORE(4);
  [26, 34, 0, 26, 34, 18, 0, 26].forEach((h, index) => {
    const y = rowY(index + 1);
    out.push(stack(ex0 + 4, y + 6, ex1 - 4, y + 59, h ? Math.round(h / 9) : 0, 9, PAL.crate, !lite));
  });

  // Zona F · silos de granel (abarcan dos filas cada uno).
  const [fx0, fx1] = STORE(5);
  [96, 108, 84].forEach((h, index) => {
    const cy = rowY(index * 2 + 1) + ROW_H;
    const polys = silo((fx0 + fx1) / 2, cy, 36, h, PAL.concrete, lite ? 12 : 18);
    out.push(volume(polys, [(fx0 + fx1) / 2 - 36, cy - 36, (fx0 + fx1) / 2 + 36, cy + 36]));
  });
  out.push(stack(fx0 + 6, rowY(7) + 10, fx1 - 6, rowY(7) + 54, 2, 9, PAL.crate, !lite));

  // G · maniobras: dos unidades estacionadas.
  out.push(parked(GATE_IN.lane + 4, rowMid(2), "W", false, PAL.cabCool));
  out.push(parked(GATE_IN.lane + 4, rowMid(4), "W", true, PAL.cab));

  // Caseta de control junto al acceso.
  const house = prism(rect(1006, 532, 1040, 574), 0, 24, PAL.house);
  house.push(...prism(rect(1002, 528, 1044, 578), 24, 27, PAL.concrete));
  house.push({ pts: ptsOf([iso(1010, 574, 11), iso(1034, 574, 11), iso(1034, 574, 19), iso(1010, 574, 19)]), fill: "rgb(111 214 176 / 0.28)", stroke: "rgb(111 214 176 / 0.55)", sw: 0.6 });
  house.push({ pts: ptsOf([iso(1006, 538, 11), iso(1006, 568, 11), iso(1006, 568, 19), iso(1006, 538, 19)]), fill: "rgb(111 214 176 / 0.18)", stroke: "rgb(111 214 176 / 0.4)", sw: 0.6 });
  out.push(volume(house, [1002, 528, 1044, 578]));

  // Postes de las plumas.
  out.push(volume(prism(rect(GATE_IN.x1, 637, GATE_IN.x1 + 7, 644), 0, 26, PAL.house), [GATE_IN.x1, 637, GATE_IN.x1 + 7, 644]));
  out.push(volume(prism(rect(GATE_IN.x0 - 5, 637, GATE_IN.x0, 643), 0, 18, PAL.house), [GATE_IN.x0 - 5, 637, GATE_IN.x0, 643]));
  out.push(volume(prism(rect(GATE_OUT.x0 - 7, -4, GATE_OUT.x0, 3), 0, 26, PAL.house), [GATE_OUT.x0 - 7, -4, GATE_OUT.x0, 3]));
  out.push(volume(prism(rect(GATE_OUT.x1, -3, GATE_OUT.x1 + 5, 3), 0, 18, PAL.house), [GATE_OUT.x1, -3, GATE_OUT.x1 + 5, 3]));

  return out.filter((item): item is Volume => item !== null).sort((a, b) => a.near - b.near);
}

/**
 * Un volumen va al frente (encima de los camiones) si algún camión pasa detrás de él
 * y sus siluetas se cruzan en pantalla. Así los camiones quedan ocultos parcialmente donde deben.
 */
function classify(volumes: Volume[]) {
  const points = [...samplesOf(T01), ...samplesOf(T02)].flatMap((sampleAt, index, all) => {
    const next = all[index + 1];
    if (!next) return [sampleAt.p];
    const steps = Math.ceil(Math.hypot(next.p[0] - sampleAt.p[0], next.p[1] - sampleAt.p[1]) / 12);
    return Array.from({ length: steps }, (_, step) => [sampleAt.p[0] + ((next.p[0] - sampleAt.p[0]) * step) / steps, sampleAt.p[1] + ((next.p[1] - sampleAt.p[1]) * step) / steps] as Pt);
  });
  const front: Volume[] = [];
  const back: Volume[] = [];
  volumes.forEach((item) => {
    const [x0, y0, x1, y1] = item.box;
    const occludes = points.some(([x, y]) => {
      const [sx, sy] = iso(x, y, 0);
      const [l, t, r, b] = item.screen;
      if (sx + 24 < l || sx - 24 > r || sy - 30 > b || sy + 10 < t) return false;
      const qx = Math.min(Math.max(x, x0), x1);
      const qy = Math.min(Math.max(y, y0), y1);
      return nearness(x, y) < nearness(qx, qy) - 1;
    });
    (occludes ? front : back).push(item);
  });
  return { front, back };
}

export const VOLUMES = classify(buildVolumes("full"));
export const VOLUMES_LITE = classify(buildVolumes("lite"));

/* ───────── Cerca perimetral ───────── */

function fenceRun(from: Pt, to: Pt, gaps: [number, number][] = [], step = 50): Poly[] {
  const polys: Poly[] = [];
  const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const unit: Pt = [(to[0] - from[0]) / length, (to[1] - from[1]) / length];
  const at = (s: number): Pt => [from[0] + unit[0] * s, from[1] + unit[1] * s];
  const inGap = (s: number) => gaps.some(([a, b]) => s > a && s < b);
  const cuts = [0, ...gaps.flat(), length].sort((a, b) => a - b);
  for (let index = 0; index < cuts.length - 1; index += 2) {
    const [a, b] = [cuts[index], cuts[index + 1]];
    if (b - a < 1) continue;
    for (const z of [7, 16]) polys.push({ pts: ptsOf([iso(...at(a), z), iso(...at(b), z)]), fill: "none", stroke: "rgb(238 235 228 / 0.34)", sw: 0.9 });
    polys.push({ pts: ptsOf([iso(...at(a), 0), iso(...at(b), 0)]), fill: "none", stroke: "rgb(238 235 228 / 0.2)", sw: 0.8 });
  }
  for (let s = 0; s <= length + 0.1; s += step) {
    if (inGap(s)) continue;
    polys.push({ pts: ptsOf([iso(...at(s), 0), iso(...at(s), 17)]), fill: "none", stroke: "rgb(238 235 228 / 0.42)", sw: 1 });
  }
  return polys;
}

export const FENCE_LITE = {
  back: [...fenceRun([0, 0], [1050, 0], [[GATE_OUT.x0, GATE_OUT.x1]], 90), ...fenceRun([1050, 0], [1050, 640], [], 90)],
  front: [...fenceRun([0, 0], [0, 640], [], 90), ...fenceRun([0, 640], [1050, 640], [[GATE_IN.x0 - 5, GATE_IN.x1 + 7]], 90)],
};

export const FENCE = {
  back: [
    ...fenceRun([0, 0], [1050, 0], [[GATE_OUT.x0, GATE_OUT.x1]]),
    ...fenceRun([1050, 0], [1050, 640]),
  ],
  front: [
    ...fenceRun([0, 0], [0, 640]),
    ...fenceRun([0, 640], [1050, 640], [[GATE_IN.x0 - 5, GATE_IN.x1 + 7]]),
  ],
};

/* ───────── Sprites de camión (tiras de celdas, una por rumbo y estado) ───────── */

export type Strip = { cells: { heading: Heading; loaded: boolean }[]; w: number; h: number; ax: number; ay: number; polys: Poly[][] };

function stripFor(plan: TruckPlan): Strip {
  const cells: Strip["cells"] = [];
  const add = (heading: Heading, loaded: boolean) => {
    if (!cells.some((cell) => cell.heading === heading && cell.loaded === loaded)) cells.push({ heading, loaded });
  };
  samplesOf(plan).forEach((item) => add(item.heading, item.t < plan.swap ? plan.loadedAtStart : !plan.loadedAtStart));
  const polys = cells.map((cell) => truck(cell.heading, cell.loaded, plan.pal));
  const box = screenBox(polys.flat());
  const pad = 3;
  return { cells, w: Math.ceil(box[2] - box[0] + pad * 2), h: Math.ceil(box[3] - box[1] + pad * 2), ax: Math.ceil(-box[0] + pad), ay: Math.ceil(-box[1] + pad), polys };
}

export const STRIPS = { T01: stripFor(T01), T02: stripFor(T02) };

/* ───────── Keyframes generados ───────── */

export type Props = Record<string, string>;
const pct = (t: number) => `${Math.min(100, Math.max(0, t * 100)).toFixed(3)}%`;
export const r2 = (n: number) => Math.round(n * 100) / 100;

export function keyframes(name: string, frames: [number, Props][]) {
  const merged = new Map<string, Props>();
  frames
    .slice()
    .sort((a, b) => a[0] - b[0])
    .forEach(([t, props]) => {
      const key = pct(t);
      merged.set(key, { ...(merged.get(key) ?? {}), ...props });
    });
  return `@keyframes ${name}{${[...merged].map(([key, props]) => `${key}{${Object.entries(props).map(([k, v]) => `${k}:${v}`).join(";")}}`).join("")}}`;
}

const move = ([x, y]: Pt) => {
  const [sx, sy] = iso(x, y, 0);
  return `translate(${r2(sx)}%,${r2(sy)}%)`;
};

/** Desplazamiento (mover de 100u × 100u: 1% = 1 unidad) y opacidad de un camión. */
function truckFrames(plan: TruckPlan): [number, Props][] {
  const samples = samplesOf(plan);
  const first = samples[0].p;
  const last = samples[samples.length - 1].p;
  return [
    [0, { transform: move(first), opacity: "0" }],
    [plan.appear, { transform: move(first), opacity: "0" }],
    [plan.appear + 0.014, { opacity: "1" }],
    ...samples.map((item): [number, Props] => [item.t, { transform: move(item.p) }]),
    [plan.vanish - 0.014, { opacity: "1" }],
    [plan.vanish, { opacity: "0" }],
    [1, { transform: move(last), opacity: "0" }],
  ];
}

export const BEAM_H = 205 * 0.8387;

function stripFrames(plan: TruckPlan, strip: Strip): [number, Props][] {
  const cellOf = (heading: Heading, t: number) =>
    strip.cells.findIndex((cell) => cell.heading === heading && cell.loaded === (t < plan.swap ? plan.loadedAtStart : !plan.loadedAtStart));
  const frames: [number, Props][] = [];
  const shift = (index: number) => ({ transform: `translateY(${r2((-index * 100) / strip.cells.length)}%)` });
  const samples = samplesOf(plan);
  let current = cellOf(samples[0].heading, 0);
  frames.push([0, shift(current)]);
  samples.forEach((item) => {
    const index = cellOf(item.heading, item.t);
    if (index !== current) {
      frames.push([item.t, shift(index)]);
      current = index;
    }
  });
  const swapHeading = samples.filter((item) => item.t <= plan.swap).pop()?.heading ?? samples[0].heading;
  const swapIndex = strip.cells.findIndex((cell) => cell.heading === swapHeading && cell.loaded === !plan.loadedAtStart);
  frames.push([plan.swap, shift(swapIndex)]);
  frames.push([1, shift(current)]);
  return frames;
}

/** Traza iluminada: escala del tramo según el avance real de T-01. */
function trailFrames(progress: (p: Pt) => number, axis: "X" | "Y"): [number, Props][] {
  const frames: [number, Props][] = [[0, { transform: `scale${axis}(0)`, opacity: "1" }]];
  // Se emite también la última muestra de cada tramo constante, para que el trazo no "repte" durante una espera.
  let previous: { t: number; value: number; emitted: boolean } | null = null;
  samplesOf(T01).forEach((item) => {
    const value = Math.round(Math.min(1, Math.max(0, progress(item.p))) * 1000) / 1000;
    if (previous && value !== previous.value) {
      if (!previous.emitted) frames.push([previous.t, { transform: `scale${axis}(${previous.value})` }]);
      frames.push([item.t, { transform: `scale${axis}(${value})` }]);
      previous = { t: item.t, value, emitted: true };
    } else previous = { t: item.t, value, emitted: !previous };
  });
  frames.push([0.95, { opacity: "1" }], [0.985, { opacity: "0" }], [1, { transform: `scale${axis}(1)`, opacity: "0" }]);
  return frames;
}

/** Pluma: se levanta antes de que pase el camión y baja cuando ya pasó. */
function barrierFrames(windows: [number, number][]): [number, Props][] {
  const frames: [number, Props][] = [[0, { transform: "rotate(0deg)" }]];
  windows.forEach(([open, close]) => {
    frames.push([open, { transform: "rotate(0deg)" }], [open + 0.02, { transform: "rotate(-84deg)" }], [close, { transform: "rotate(-84deg)" }], [close + 0.022, { transform: "rotate(0deg)" }]);
  });
  frames.push([1, { transform: "rotate(0deg)" }]);
  return frames;
}

/** Partícula de material: viaja en arco de la caja de T-01 al montículo de B-07, varias veces. */
function particleFrames(offset: number): [number, Props][] {
  const from = iso(GATE_OUT.lane + 4, B07.y + 6, 24);
  const peak = iso((GATE_OUT.lane + B07.x) / 2 + 6, B07.y - 2, 46);
  const to = iso(B07.x - 6, B07.y, 22);
  const at = ([x, y]: Pt) => `translate(${r2(x)}%,${r2(y)}%)`;
  const frames: [number, Props][] = [[0, { transform: at(from), opacity: "0" }]];
  const trip = 0.026;
  for (let start = MOMENTS.unloadStart + offset; start + trip <= MOMENTS.unloadEnd + 0.002; start += trip + 0.006) {
    frames.push(
      [start, { transform: at(from), opacity: "0" }],
      [start + trip * 0.15, { opacity: "1" }],
      [start + trip * 0.5, { transform: at(peak) }],
      [start + trip * 0.85, { opacity: "1" }],
      [start + trip, { transform: at(to), opacity: "0" }],
      [start + trip + 0.004, { transform: at(from) }],
    );
  }
  frames.push([1, { transform: at(from), opacity: "0" }]);
  return frames;
}

function exitWindow(plan: TruckPlan) {
  const drive = plan.drives[2];
  const s = distanceTo(drive.path, 1, 0);
  return [timeAt(drive, s - 120), timeAt(drive, s + 70)] as [number, number];
}

function entryWindow(plan: TruckPlan) {
  const drive = plan.drives[1];
  const s = distanceTo(drive.path, 1, 640);
  return [plan.drives[0].t1 + 0.004, timeAt(drive, s + 46)] as [number, number];
}

/** Pulsos repartidos en el ciclo (una sola iteración por ciclo, sin bucles cortos). */
function pulses(count: number, frame: (start: number, period: number) => [number, Props][]): [number, Props][] {
  const period = 1 / count;
  return Array.from({ length: count }, (_, index) => frame(index * period, period)).flat();
}

const ping = pulses(6, (start, period) => [
  [start, { transform: "scale(0.35)", opacity: "0.85", "animation-timing-function": "cubic-bezier(0.2,0.7,0.3,1)" }],
  [start + period * 0.8, { transform: "scale(1.25)", opacity: "0" }],
  [start + period - 0.0002, { transform: "scale(1.25)", opacity: "0" }],
]);

const rise = pulses(7, (start, period) => [
  [start, { transform: "translateY(0)", opacity: "0", "animation-timing-function": "cubic-bezier(0.5,0,0.6,1)" }],
  [start + period * 0.12, { opacity: "1" }],
  [start + period * 0.78, { opacity: "0.9" }],
  [start + period - 0.0002, { transform: "translateY(-100%)", opacity: "0" }],
]);

/** Avance de T-01 en el tramo de acceso (de la línea de alto a la calle sur). */
export const APPROACH = { from: 668, to: SOUTH_ROAD };
/** Fracción del pasillo B iluminada al quedar T-01 en B-07 (vista estática). */
export const AISLE_AT_B07 = (SOUTH_ROAD - B07.y) / SOUTH_ROAD;

export function sceneKeyframes(prefix: string) {
  return [
    keyframes(`${prefix}-t01`, truckFrames(T01)),
    keyframes(`${prefix}-t02`, truckFrames(T02)),
    keyframes(`${prefix}-s01`, stripFrames(T01, STRIPS.T01)),
    keyframes(`${prefix}-s02`, stripFrames(T02, STRIPS.T02)),
    keyframes(`${prefix}-approach`, trailFrames(([x, y]) => (x >= GATE_IN.lane - 1 ? (APPROACH.from - y) / (APPROACH.from - APPROACH.to) : 1), "Y")),
    keyframes(`${prefix}-road`, trailFrames(([x]) => (GATE_IN.lane - x) / (GATE_IN.lane - GATE_OUT.lane), "X")),
    keyframes(`${prefix}-aisle`, trailFrames(([x, y]) => (x <= GATE_OUT.lane + 1 ? (SOUTH_ROAD - y) / SOUTH_ROAD : 0), "Y")),
    keyframes(`${prefix}-gate-in`, barrierFrames([entryWindow(T01), entryWindow(T02)])),
    keyframes(`${prefix}-gate-out`, barrierFrames([exitWindow(T01), exitWindow(T02)])),
    keyframes(`${prefix}-particle`, particleFrames(0)),
    keyframes(`${prefix}-ping`, ping),
    keyframes(`${prefix}-rise`, rise),
    keyframes(`${prefix}-fill`, [
      [0, { transform: "scale(0.62,0.2)", opacity: "0" }],
      [MOMENTS.unloadStart, { transform: "scale(0.62,0.2)", opacity: "0" }],
      [MOMENTS.unloadStart + 0.01, { opacity: "1" }],
      [MOMENTS.unloadEnd, { transform: "scale(1,1)" }],
      [MOMENTS.reset, { transform: "scale(1,1)", opacity: "1" }],
      [0.99, { opacity: "0" }],
      [1, { transform: "scale(0.62,0.2)", opacity: "0" }],
    ]),
    keyframes(`${prefix}-progress`, [
      [0, { transform: "scaleX(0)" }],
      [MOMENTS.unloadStart, { transform: "scaleX(0)" }],
      [MOMENTS.unloadEnd, { transform: "scaleX(1)" }],
      [1, { transform: "scaleX(1)" }],
    ]),
    keyframes(`${prefix}-loadbar`, [
      [0, { transform: "scaleX(0)" }],
      [MOMENTS.loadStart, { transform: "scaleX(0)" }],
      [MOMENTS.loadEnd, { transform: "scaleX(1)" }],
      [1, { transform: "scaleX(1)" }],
    ]),
  ].join("");
}

/* ───────── Piso: utilidades para el dibujo ───────── */

export const zoneHull = (zone: Zone) => {
  const x0 = colX(zone.col);
  const corners = rect(x0, ROW0, x0 + COL_W, rowY(ROWS + 1));
  return ptsOf(hull(corners.flatMap(([x, y]) => [iso(x, y, 0), iso(x, y, 50)])));
};

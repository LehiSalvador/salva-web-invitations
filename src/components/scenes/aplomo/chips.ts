import { iso, type Pt } from "./iso";
import { BEAM_H, B07, COLS, colX, GATE_IN, GATE_OUT, MOMENTS, rowMid, ROWS, samplesOf, T01, T02, type TruckPlan } from "./yard";

/*
 * Cámaras del escenario y colocación de los chips que viajan con los camiones.
 * Los chips miden lo mismo en píxeles a cualquier ancho (texto de 10 px), pero el patio escala con
 * var(--u): en un contenedor angosto un chip "ocupa" muchas más unidades del mundo. Por eso los
 * keyframes de cada chip se calculan por rango de ancho, contra el rectángulo visible real de esa
 * cámara y contra las etiquetas fijas (B-07, filas, columnas, accesos, HUD): el chip se desplaza,
 * pasa debajo del camión o se oculta antes que encimarse o salirse del cuadro.
 */

export type Camera = { w: number; h: number; cx: number; cy: number };

export const CAMERA = {
  /** Contenedor > 600 px: patio completo. */
  wide: { w: 1290, h: 712, cx: 24, cy: 2 },
  /** Contenedor ≤ 600 px: del pasillo B al acceso (incluye la pluma). */
  narrow: { w: 920, h: 640, cx: 166, cy: 30 },
  /** Vista previa (tarjeta 16:10 o 16:11). */
  preview: { w: 1300, h: 700, cx: 22, cy: 6 },
} satisfies Record<string, Camera>;

type Rect = [number, number, number, number];
type Range = { id: string; max: number | null; cam: Camera; u: number; narrow: boolean; hud: boolean };

/** Rangos de ancho del contenedor; u es el peor caso (el ancho mínimo del rango). */
export const RANGES: Range[] = [
  { id: "w", max: null, cam: CAMERA.wide, u: 900 / CAMERA.wide.w, narrow: false, hud: true },
  { id: "m", max: 900, cam: CAMERA.wide, u: 600 / CAMERA.wide.w, narrow: false, hud: true },
  { id: "n2", max: 600, cam: CAMERA.narrow, u: 440 / CAMERA.narrow.w, narrow: true, hud: false },
  { id: "n1", max: 440, cam: CAMERA.narrow, u: 318 / CAMERA.narrow.w, narrow: true, hud: false },
];

/** Tamaños medidos en el navegador (px, fuente mono de 10 px). [ancho angosto, ancho, alto] */
export const CHIP_PX = {
  T01: [
    { from: 0.004, to: MOMENTS.t01Arrive, wide: 128, narrow: 128 },
    { from: MOMENTS.t01Arrive, to: MOMENTS.t01Leave - 0.004, wide: 176, narrow: 136 },
    { from: MOMENTS.t01Leave, to: T01.vanish - 0.014, wide: 122, narrow: 122 },
  ],
  T02: [
    { from: T02.appear + 0.004, to: MOMENTS.t02Arrive, wide: 128, narrow: 128 },
    { from: MOMENTS.t02Arrive, to: MOMENTS.t02Leave - 0.004, wide: 155, narrow: 115 },
    { from: MOMENTS.t02Leave, to: T02.vanish - 0.014, wide: 122, narrow: 122 },
  ],
};
const CHIP_H = 22;
const PIN_PX = { tag: [64, 40], status: [82, 22], gap: 6 };
/** Altura del borde inferior del chip sobre el punto del camión (unidades). */
export const LIFT = 46;
const BELOW = 18;

const rectAround = ([x, y]: Pt, w: number, h: number, ax = 0.5, ay = 0.5): Rect => [x - w * ax, y - h * ay, x + w * (1 - ax), y + h * (1 - ay)];
const overlaps = (a: Rect, b: Rect) => a[0] < b[2] && a[2] > b[0] && a[1] < b[3] && a[3] > b[1];
const inside = (a: Rect, b: Rect) => a[0] >= b[0] && a[2] <= b[2] && a[1] >= b[1] && a[3] <= b[3];
const grow = (a: Rect, m: number): Rect => [a[0] - m, a[1] - m, a[2] + m, a[3] + m];

const beamBase = iso(B07.x, B07.y, 0);
const pinAt: Pt = [beamBase[0], beamBase[1] - BEAM_H - 10];

/** Etiquetas fijas que un chip nunca debe tapar (en unidades, según el rango). */
function keepOut(range: Range, t: number): Rect[] {
  const k = 1 / range.u;
  const rects: Rect[] = [];
  const [tw, th] = PIN_PX.tag;
  rects.push(rectAround(pinAt, tw * k, th * k, 0.5, 1));
  // Montículo y anillo de B-07: el foco de la escena no se tapa (el haz, una línea fina, sí puede cruzarse).
  rects.push([beamBase[0] - 62, beamBase[1] - 44, beamBase[0] + 62, beamBase[1] + 30]);
  if (t >= MOMENTS.unloadEnd - 0.01) rects.push(rectAround([pinAt[0], pinAt[1] - (th + PIN_PX.gap) * k], PIN_PX.status[0] * k, PIN_PX.status[1] * k, 0.5, 1));
  for (let index = 0; index < ROWS; index++) {
    if (range.narrow && index % 2) continue;
    rects.push(rectAround(iso(-30, rowMid(index + 1)), 18 * k, 16 * k));
  }
  COLS.forEach((_, index) => {
    const at = index === 6 ? iso(1034, 668) : iso(colX(index) + 84, 668);
    rects.push(rectAround(at, (range.narrow || index === 6 ? 23 : 60) * k, 22 * k));
  });
  if (!range.narrow) {
    rects.push(rectAround(iso(GATE_OUT.lane - 96, -46), 58 * k, 17 * k));
    rects.push(rectAround(iso(GATE_IN.x0 - 34, 756), 58 * k, 17 * k));
  }
  if (range.hud) {
    const { cam } = range;
    const left = cam.cx - cam.w / 2;
    const top = cam.cy - cam.h / 2;
    const right = cam.cx + cam.w / 2;
    const bottom = cam.cy + cam.h / 2;
    rects.push([left, top, left + 264 * k, top + 52 * k]);
    rects.push([right - 204 * k, bottom - 128 * k, right, bottom]);
  }
  return rects;
}

function positionAt(plan: TruckPlan, t: number): Pt {
  const samples = samplesOf(plan);
  if (t <= samples[0].t) return iso(...samples[0].p);
  for (let index = 1; index < samples.length; index++) {
    const a = samples[index - 1];
    const b = samples[index];
    if (t <= b.t) {
      const k = b.t === a.t ? 1 : (t - a.t) / (b.t - a.t);
      return iso(a.p[0] + (b.p[0] - a.p[0]) * k, a.p[1] + (b.p[1] - a.p[1]) * k);
    }
  }
  return iso(...samples[samples.length - 1].p);
}

type Place = { dx: number; dy: number; key: string };
export type ChipFrame = { t: number; x: number; y: number; op: number };

/** Mejor colocación por muestra (con histéresis); null si no cabe en ningún lado. */
function place(plan: TruckPlan, range: Range, others: Map<number, Rect>, out: Map<number, Rect>): ChipFrame[] {
  const states = CHIP_PX[plan.id === "T-01" ? "T01" : "T02"];
  const k = 1 / range.u;
  const { cam } = range;
  const view: Rect = grow([cam.cx - cam.w / 2, cam.cy - cam.h / 2, cam.cx + cam.w / 2, cam.cy + cam.h / 2], -8 * k);
  const truckView: Rect = grow(view, -24);
  const frames: ChipFrame[] = [];
  let previous: Place | null = null;
  const step = 0.0025;
  for (let t = 0; t <= 1.0001; t += step) {
    const state = states.find((item) => t >= item.from && t <= item.to);
    const [x, y] = positionAt(plan, t);
    let chosen: Place | null = null;
    if (state && inside([x, y, x, y], truckView)) {
      const w = (range.narrow ? state.narrow : state.wide) * k;
      const h = CHIP_H * k;
      const blocked = [...keepOut(range, t), ...(others.has(Math.round(t / step)) ? [others.get(Math.round(t / step)) as Rect] : [])].map((rect) => grow(rect, 5 * k));
      const shifts = [0, -0.22, 0.22, -0.44, 0.44].map((f) => f * w);
      const clamp = Math.min(0, view[2] - (x + w / 2)) + Math.max(0, view[0] - (x - w / 2));
      if (Math.abs(clamp) <= 0.44 * w) shifts.push(clamp);
      const candidates: (Place & { cost: number; rect: Rect })[] = [];
      for (const dx of shifts) {
        for (const [key, dy, base] of [
          ["up", 0, 0],
          ["up2", -(h + 6 * k), 0.9],
          ["down", LIFT + h + BELOW, 1.3],
        ] as const) {
          const bottom = y - LIFT + dy;
          const rect: Rect = [x + dx - w / 2, bottom - h, x + dx + w / 2, bottom];
          if (!inside(rect, view) || blocked.some((other) => overlaps(rect, other))) continue;
          const id = `${key}:${Math.round(dx)}`;
          const sameSide = previous && previous.key.split(":")[0] === key;
          const cost = base + Math.abs(dx) / w + (previous ? (sameSide ? Math.abs(dx - previous.dx) / w : 0.8) : 0);
          candidates.push({ dx, dy, key: id, cost, rect });
        }
      }
      candidates.sort((a, b) => a.cost - b.cost);
      if (candidates[0]) {
        chosen = candidates[0];
        out.set(Math.round(t / step), candidates[0].rect);
      }
    }
    const jump = chosen && previous && (Math.abs(chosen.dy - previous.dy) > 1 || Math.abs(chosen.dx - previous.dx) > 30);
    if (jump && previous) {
      // Cambio de lado: desvanecer, mover y volver a mostrar (sin barrer el chip sobre el camión).
      const [px, py] = positionAt(plan, t - 0.002);
      frames.push({ t: t - 0.004, x: px + previous.dx, y: py - LIFT + previous.dy, op: 1 }, { t: t - 0.0015, x: px + previous.dx, y: py - LIFT + previous.dy, op: 0 });
      frames.push({ t: t - 0.0012, x: x + (chosen?.dx ?? 0), y: y - LIFT + (chosen?.dy ?? 0), op: 0 });
    }
    const p = chosen ?? previous ?? { dx: 0, dy: 0, key: "" };
    frames.push({ t: jump ? t + 0.002 : t, x: x + p.dx, y: y - LIFT + p.dy, op: chosen ? 1 : 0 });
    if (chosen) previous = chosen;
    else if (!state) previous = null;
  }
  return simplify(parkHidden(frames));
}

/** Mientras el chip está oculto se queda donde va a reaparecer (o donde desapareció): nunca barre ni sale del cuadro. */
function parkHidden(frames: ChipFrame[]) {
  const sorted = frames.sort((a, b) => a.t - b.t);
  let anchor: ChipFrame | null = null;
  for (let index = sorted.length - 1; index >= 0; index--) {
    if (sorted[index].op > 0) anchor = sorted[index];
    else if (anchor) Object.assign(sorted[index], { x: anchor.x, y: anchor.y });
  }
  anchor = null;
  for (const frame of sorted) {
    if (frame.op > 0) anchor = frame;
    else if (anchor && !sorted.some((other) => other.t > frame.t && other.op > 0)) Object.assign(frame, { x: anchor.x, y: anchor.y });
  }
  return sorted;
}

/** Quita fotogramas que la interpolación lineal ya reproduce (tolerancia 0.5 u). */
function simplify(frames: ChipFrame[]) {
  const sorted = frames.sort((a, b) => a.t - b.t);
  const kept = [sorted[0]];
  for (let index = 1; index < sorted.length - 1; index++) {
    const a = kept[kept.length - 1];
    const b = sorted[index];
    const c = sorted[index + 1];
    const k = c.t === a.t ? 0 : (b.t - a.t) / (c.t - a.t);
    const lerp = (key: "x" | "y" | "op") => a[key] + (c[key] - a[key]) * k;
    if (Math.abs(lerp("x") - b.x) > 0.5 || Math.abs(lerp("y") - b.y) > 0.5 || Math.abs(lerp("op") - b.op) > 0.02) kept.push(b);
  }
  kept.push(sorted[sorted.length - 1]);
  return kept;
}

/** Fotogramas de los dos chips para cada rango de ancho. */
export const CHIP_FRAMES = Object.fromEntries(
  RANGES.map((range) => {
    const first = new Map<number, Rect>();
    const t01 = place(T01, range, new Map(), first);
    const t02 = place(T02, range, first, new Map());
    return [range.id, { t01, t02 }];
  }),
) as Record<string, { t01: ChipFrame[]; t02: ChipFrame[] }>;

const fmt = (n: number) => Math.round(n * 100) / 100;
const pct = (t: number) => `${(Math.min(1, Math.max(0, t)) * 100).toFixed(3)}%`;

function chipKeyframes(name: string, frames: ChipFrame[]) {
  return `@keyframes ${name}{${frames.map((frame) => `${pct(frame.t)}{transform:translate(${fmt(frame.x)}%,${fmt(frame.y)}%);opacity:${fmt(frame.op)}}`).join("")}}`;
}

const cameraVars = (cam: Camera) => `--cx:${cam.cx};--cy:${cam.cy}`;

/**
 * CSS generado del escenario: cámaras por ancho de contenedor y la animación de cada chip por rango.
 * (Las reglas de los chips van en hoja de estilo, no inline, para que las container queries las cambien.)
 */
export function stageCss(prefix: string, stage: string, cycle: number, preview?: string) {
  const { wide, narrow } = CAMERA;
  const css = [
    `.${stage}{--u:calc(100cqw / ${wide.w});${cameraVars(wide)};min-height:calc(var(--u) * ${wide.h})}`,
    `@container (max-width:600px){.${stage}{--u:calc(100cqw / ${narrow.w});${cameraVars(narrow)};min-height:calc(var(--u) * ${narrow.h})}}`,
  ];
  if (preview) {
    const cam = CAMERA.preview;
    css.push(`.${preview} .${stage}{--u:min(calc(100cqw / ${cam.w}),calc(100cqh / ${cam.h}));${cameraVars(cam)};min-height:0}`);
    return css.join("");
  }
  RANGES.forEach((range) => {
    const frames = CHIP_FRAMES[range.id];
    css.push(chipKeyframes(`${prefix}-c01-${range.id}`, frames.t01), chipKeyframes(`${prefix}-c02-${range.id}`, frames.t02));
  });
  const rule = (id: string) => `.${stage} [data-chip="1"]{animation-name:${prefix}-c01-${id}}.${stage} [data-chip="2"]{animation-name:${prefix}-c02-${id}}`;
  css.push(`.${stage} [data-chip]{animation-duration:${cycle}ms;animation-timing-function:linear;animation-iteration-count:infinite}`, rule("w"));
  RANGES.filter((range) => range.max).forEach((range) => css.push(`@container (max-width:${range.max}px){${rule(range.id)}}`));
  return css.join("");
}

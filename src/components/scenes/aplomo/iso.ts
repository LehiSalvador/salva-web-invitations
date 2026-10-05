/*
 * Proyección axonométrica del patio (equivalente a rotateZ(-40deg) + rotateX(57deg) sin perspectiva).
 * Todo lo estático se proyecta aquí a polígonos SVG nítidos; lo que se mueve usa los mismos puntos
 * proyectados, así que piso, volúmenes, camiones y etiquetas comparten un solo sistema de coordenadas.
 * Unidades: 1 unidad del mundo = 1 unidad de pantalla = var(--u) píxeles.
 */

export type Pt = [number, number];
export type V3 = [number, number, number];

const TILT = (57 * Math.PI) / 180;
const YAW = (40 * Math.PI) / 180;
const cT = Math.cos(TILT);
const sT = Math.sin(TILT);
const cY = Math.cos(YAW);
const sY = Math.sin(YAW);

/** Tamaño del patio en unidades del mundo (x hacia el este, y hacia el sur). */
export const YARD = { w: 1050, h: 640 };
const OX = YARD.w / 2;
const OY = YARD.h / 2;

export function iso(x: number, y: number, z = 0): Pt {
  const dx = x - OX;
  const dy = y - OY;
  return [cY * dx + sY * dy, (-sY * dx + cY * dy) * cT - z * sT];
}

/** Cercanía al observador de un punto del piso (mayor = más cerca). */
export const nearness = (x: number, y: number) => -sY * (x - OX) + cY * (y - OY);

/** Matriz afín del piso (z = 0): sirve para dibujar en coordenadas del mundo dentro de un <g> o un div. */
export const GROUND = {
  a: cY,
  b: -sY * cT,
  c: sY,
  d: cY * cT,
  e: -(cY * OX + sY * OY),
  f: -(-sY * cT * OX + cY * cT * OY),
};
export const groundMatrix = `matrix(${[GROUND.a, GROUND.b, GROUND.c, GROUND.d, GROUND.e, GROUND.f].map((n) => n.toFixed(5)).join(" ")})`;

/** Plano vertical que contiene la dirección (dx, dy) del piso: x local = esa dirección, y local = hacia abajo. */
export function wallMatrix(dx: number, dy: number) {
  const [x0, y0] = iso(0, 0, 0);
  const [x1, y1] = iso(dx, dy, 0);
  return `matrix(${(x1 - x0).toFixed(5)}, ${(y1 - y0).toFixed(5)}, 0, ${sT.toFixed(5)}, 0, 0)`;
}

const VIEW: V3 = [-sY * sT, cY * sT, cT];
const LIGHT: V3 = norm([-0.52, -0.32, 0.8]);

function norm(v: V3): V3 {
  const l = Math.hypot(...v) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** Paleta de un material: tono en sombra y tono iluminado (RGB). */
export type Palette = { dark: V3; light: V3; edge?: string };

export const PAL = {
  block: { dark: [17, 22, 25], light: [86, 97, 101], edge: "rgb(238 235 228 / 0.2)" },
  bundle: { dark: [15, 22, 29], light: [70, 98, 120], edge: "rgb(143 184 216 / 0.24)" },
  crate: { dark: [22, 21, 19], light: [92, 86, 76], edge: "rgb(238 235 228 / 0.18)" },
  bulk: { dark: [20, 19, 17], light: [104, 96, 82] },
  bulkGold: { dark: [58, 46, 26], light: [226, 201, 152] },
  concrete: { dark: [20, 25, 27], light: [78, 88, 92], edge: "rgb(238 235 228 / 0.16)" },
  cab: { dark: [64, 64, 61], light: [236, 233, 226], edge: "rgb(6 8 9 / 0.5)" },
  cabCool: { dark: [40, 58, 72], light: [170, 204, 228], edge: "rgb(6 8 9 / 0.5)" },
  steel: { dark: [17, 21, 23], light: [76, 86, 90], edge: "rgb(238 235 228 / 0.22)" },
  cargo: { dark: [92, 74, 42], light: [232, 210, 164] },
  house: { dark: [22, 27, 29], light: [96, 106, 109], edge: "rgb(238 235 228 / 0.24)" },
} satisfies Record<string, Palette>;

const mix = (p: Palette, k: number) => {
  const t = Math.min(1, Math.max(0, k));
  const [r, g, b] = [0, 1, 2].map((i) => Math.round(p.dark[i] + (p.light[i] - p.dark[i]) * t));
  return `rgb(${r} ${g} ${b})`;
};

const shadeOf = (n: V3, ambient = 0.16) => ambient + (1 - ambient) * Math.max(0, dot(n, LIGHT));

export type Poly = { pts: string; fill: string; stroke?: string; sw?: number };

const r1 = (n: number) => Math.round(n * 10) / 10;
export const ptsOf = (points: Pt[]) => points.map(([x, y]) => `${r1(x)},${r1(y)}`).join(" ");

/** Prisma vertical sobre un polígono convexo del piso: caras visibles + tapa, ya sombreadas. */
export function prism(base: Pt[], z0: number, z1: number, pal: Palette, opts: { top?: string; topStroke?: string } = {}): Poly[] {
  const cx = base.reduce((sum, p) => sum + p[0], 0) / base.length;
  const cy = base.reduce((sum, p) => sum + p[1], 0) / base.length;
  const faces: Poly[] = [];
  base.forEach((a, index) => {
    const b = base[(index + 1) % base.length];
    // Normal de la cara, orientada hacia afuera del prisma.
    let n: V3 = norm([b[1] - a[1], -(b[0] - a[0]), 0]);
    if (n[0] * ((a[0] + b[0]) / 2 - cx) + n[1] * ((a[1] + b[1]) / 2 - cy) < 0) n = [-n[0], -n[1], 0];
    if (dot(n, VIEW) <= 0.001) return;
    faces.push({
      pts: ptsOf([iso(a[0], a[1], z0), iso(b[0], b[1], z0), iso(b[0], b[1], z1), iso(a[0], a[1], z1)]),
      fill: mix(pal, shadeOf(n)),
      stroke: pal.edge,
    });
  });
  faces.push({
    pts: ptsOf(base.map(([x, y]) => iso(x, y, z1))),
    fill: opts.top ?? mix(pal, shadeOf([0, 0, 1])),
    stroke: opts.topStroke ?? pal.edge,
  });
  return faces;
}

export const rect = (x0: number, y0: number, x1: number, y1: number): Pt[] => [
  [x0, y0],
  [x1, y0],
  [x1, y1],
  [x0, y1],
];

/** Montículo de material a granel: cono bajo de base elíptica, facetado (low-poly) y sombreado por faceta. */
export function mound(cx: number, cy: number, rx: number, ry: number, h: number, pal: Palette, seed = 0, sides = 18): Poly[] {
  const apex: V3 = [cx + Math.sin(seed * 3.1) * rx * 0.08, cy + Math.cos(seed * 2.3) * ry * 0.08, h];
  const ring: V3[] = Array.from({ length: sides }, (_, index) => {
    const angle = (index / sides) * Math.PI * 2 + seed;
    const k = 1 + 0.07 * Math.sin(angle * 3 + seed * 5) + 0.04 * Math.sin(angle * 5 + seed);
    return [cx + rx * k * Math.cos(angle), cy + ry * k * Math.sin(angle), 0];
  });
  // Hombro intermedio: el montículo no es un cono perfecto.
  const shoulder: V3[] = ring.map(([x, y], index) => {
    const k = 0.55 + 0.05 * Math.sin(index * 1.7 + seed);
    return [apex[0] + (x - apex[0]) * k, apex[1] + (y - apex[1]) * k, h * (0.62 + 0.06 * Math.cos(index * 2.1 + seed))];
  });
  const faces: { poly: Poly; depth: number }[] = [];
  const add = (points: V3[]) => {
    let n = norm(cross(sub(points[1], points[0]), sub(points[2], points[0])));
    if (n[2] < 0) n = [-n[0], -n[1], -n[2]];
    if (dot(n, VIEW) <= 0) return;
    const fill = mix(pal, shadeOf(n, 0.12));
    const depth = points.reduce((sum, p) => sum + dot(p, VIEW), 0) / points.length;
    faces.push({ poly: { pts: ptsOf(points.map(([x, y, z]) => iso(x, y, z))), fill, stroke: fill, sw: 0.6 }, depth });
  };
  for (let index = 0; index < sides; index++) {
    const next = (index + 1) % sides;
    add([ring[index], ring[next], shoulder[next], shoulder[index]].slice(0, 3));
    add([ring[index], shoulder[next], shoulder[index]]);
    add([shoulder[index], shoulder[next], apex]);
  }
  return faces.sort((a, b) => a.depth - b.depth).map((face) => face.poly);
}

/** Silo: cilindro facetado con techo cónico y anillos de refuerzo en la cara visible. */
export function silo(cx: number, cy: number, radius: number, h: number, pal: Palette, sides = 22): Poly[] {
  const ring = (z: number, k = 1): V3[] =>
    Array.from({ length: sides }, (_, index) => {
      const angle = (index / sides) * Math.PI * 2;
      return [cx + radius * k * Math.cos(angle), cy + radius * k * Math.sin(angle), z];
    });
  const base = ring(0);
  const top = ring(h);
  const faces: Poly[] = [{ pts: ptsOf(groundShadow(cx, cy, radius * 1.05, radius * 1.05, 26)), fill: "rgb(0 0 0 / 0.36)" }];
  const visible: number[] = [];
  for (let index = 0; index < sides; index++) {
    const next = (index + 1) % sides;
    const mid = ((index + 0.5) / sides) * Math.PI * 2;
    const n: V3 = [Math.cos(mid), Math.sin(mid), 0];
    if (dot(n, VIEW) <= 0) continue;
    visible.push(index);
    const fill = mix(pal, shadeOf(n, 0.14));
    faces.push({ pts: ptsOf([base[index], base[next], top[next], top[index]].map(([x, y, z]) => iso(x, y, z))), fill, stroke: fill, sw: 0.6 });
  }
  const apex: V3 = [cx, cy, h + radius * 0.42];
  for (let index = 0; index < sides; index++) {
    const next = (index + 1) % sides;
    let n = norm(cross(sub(top[next], apex), sub(top[index], apex)));
    if (n[2] < 0) n = [-n[0], -n[1], -n[2]];
    if (dot(n, VIEW) <= 0) continue;
    const fill = mix(pal, shadeOf(n, 0.2) * 1.08);
    faces.push({ pts: ptsOf([top[index], top[next], apex].map(([x, y, z]) => iso(x, y, z))), fill, stroke: fill, sw: 0.6 });
  }
  // Anillos de refuerzo sobre la cara visible (el arco visible puede cruzar el índice 0).
  const gap = visible.findIndex((value, index) => index > 0 && value - visible[index - 1] > 1);
  const run = gap > 0 ? [...visible.slice(gap), ...visible.slice(0, gap)] : visible;
  const arc = (z: number) => {
    const points = ring(z);
    const ordered = run.map((index) => points[index]).concat([points[(run[run.length - 1] + 1) % sides]]);
    return ordered.map(([x, y]) => iso(x, y, z));
  };
  [0.28, 0.56, 0.84].forEach((k) => faces.push({ pts: ptsOf(arc(h * k)), fill: "none", stroke: "rgb(6 8 9 / 0.45)", sw: 0.9 }));
  faces.push({ pts: ptsOf(arc(h)), fill: "none", stroke: "rgb(238 235 228 / 0.3)", sw: 0.7 });
  return faces;
}

/** Sombra proyectada en el piso (luz del noroeste): una elipse corrida hacia el sureste. */
export function groundShadow(cx: number, cy: number, rx: number, ry: number, reach = 10): Pt[] {
  return Array.from({ length: 20 }, (_, index) => {
    const angle = (index / 20) * Math.PI * 2;
    return iso(cx + reach * 0.6 + rx * Math.cos(angle), cy + reach * 0.4 + ry * Math.sin(angle), 0);
  });
}

/* ───────── Camión (en coordenadas locales: l hacia adelante, w a la derecha) ───────── */

export type Heading = "N" | "NW" | "W" | "NE" | "E" | "S" | "SW" | "SE";
const ANGLE: Record<Heading, number> = { E: 0, SE: 45, S: 90, SW: 135, W: 180, NW: 225, N: 270, NE: 315 };

export function headingOf(dx: number, dy: number): Heading {
  const angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
  const names: Heading[] = ["E", "SE", "S", "SW", "W", "NW", "N", "NE"];
  return names[Math.round(angle / 45) % 8];
}

type Part = { l: [number, number]; w: [number, number]; z: [number, number] };
const TRUCK_SCALE = 1.16;

/**
 * Camión de volteo en isometría: chasis, caja (con carga dorada o vacía) y cabina con ventanas.
 * Devuelve polígonos relativos al punto del piso bajo el centro del camión.
 */
export function truck(heading: Heading, loaded: boolean, cabPal: Palette): Poly[] {
  const a = (ANGLE[heading] * Math.PI) / 180;
  const k = TRUCK_SCALE;
  const f: Pt = [Math.cos(a) * k, Math.sin(a) * k];
  const r: Pt = [-Math.sin(a) * k, Math.cos(a) * k];
  const at = (l: number, w: number): Pt => [l * f[0] + w * r[0], l * f[1] + w * r[1]];
  const [ox, oy] = iso(0, 0, 0);
  const local = (l: number, w: number, z: number): Pt => {
    const [x, y] = at(l, w);
    const [px, py] = iso(x, y, z * k);
    return [px - ox, py - oy];
  };
  const box = (part: Part, pal: Palette, opts: { top?: string; topStroke?: string } = {}) => {
    const base = [at(part.l[0], part.w[0]), at(part.l[1], part.w[0]), at(part.l[1], part.w[1]), at(part.l[0], part.w[1])];
    return prism(base, part.z[0] * k, part.z[1] * k, pal, opts).map((poly) => ({
      ...poly,
      pts: poly.pts
        .split(" ")
        .map((pair) => {
          const [x, y] = pair.split(",").map(Number);
          return `${r1(x - ox)},${r1(y - oy)}`;
        })
        .join(" "),
    }));
  };
  const centerNear = (part: Part) => {
    const [x, y] = at((part.l[0] + part.l[1]) / 2, (part.w[0] + part.w[1]) / 2);
    return nearness(x + OX, y + OY);
  };

  const shadow: Poly = {
    pts: ptsOf([
      [-25, -10.5],
      [25, -10.5],
      [25, 10.5],
      [-25, 10.5],
    ].map(([l, w]) => {
      const [x, y] = at(l, w);
      const [px, py] = iso(x + 6, y + 4, 0);
      return [px - ox, py - oy] as Pt;
    })),
    fill: "rgb(0 0 0 / 0.5)",
  };
  const chassis: Part = { l: [-21, 21], w: [-6.5, 6.5], z: [1.5, 5] };
  const cab: Part = { l: [12, 22], w: [-8, 8], z: [4.5, 17.5] };
  const bed: Part = { l: [-22.5, 10], w: [-8.5, 8.5], z: [5, 14.5] };

  const cabPolys = box(cab, cabPal);
  // Ventanas: banda oscura en la parte alta de cada cara visible de la cabina.
  const windows: Poly[] = [];
  const glass = "rgb(14 22 26)";
  const faces: [Pt, Pt][] = [
    [
      [22, -6.5],
      [22, 6.5],
    ],
    [
      [13.5, -8],
      [20.5, -8],
    ],
    [
      [20.5, 8],
      [13.5, 8],
    ],
  ];
  const normals: Pt[] = [f, [-r[0], -r[1]], r];
  faces.forEach(([p0, p1], index) => {
    const n = normals[index];
    if (dot([n[0], n[1], 0], VIEW) <= 0.05) return;
    windows.push({
      pts: ptsOf([local(p0[0], p0[1], 11), local(p1[0], p1[1], 11), local(p1[0], p1[1], 15.5), local(p0[0], p0[1], 15.5)]),
      fill: glass,
    });
  });

  const bedPolys = box(bed, PAL.steel, loaded ? {} : { top: "rgb(9 12 13)", topStroke: "rgb(238 235 228 / 0.32)" });
  const cargo: Part = { l: [-20.5, 8], w: [-6.8, 6.8], z: [14.5, 17.5] };
  const cargoPolys = loaded ? box(cargo, PAL.cargo) : [];

  const order = centerNear(cab) > centerNear(bed) ? [...bedPolys, ...cargoPolys, ...cabPolys, ...windows] : [...cabPolys, ...windows, ...bedPolys, ...cargoPolys];
  return [shadow, ...box(chassis, { dark: [6, 8, 9], light: [30, 34, 36] }), ...order];
}

/** Envolvente convexa (cadena monótona). */
export function hull(points: Pt[]): Pt[] {
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const turn = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Pt[] = [];
  for (const p of sorted) {
    while (lower.length >= 2 && turn(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: Pt[] = [];
  for (const p of [...sorted].reverse()) {
    while (upper.length >= 2 && turn(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

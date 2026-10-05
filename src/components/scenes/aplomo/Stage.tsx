import type { CSSProperties } from "react";
import { Step } from "@/components/motion/Step";
import s from "../AplomoScene.module.css";
import { stageCss } from "./chips";
import { GROUND, groundMatrix, iso, mound, PAL, wallMatrix, type Poly, type Pt } from "./iso";
import {
  AISLE_AT_B07,
  APPROACH,
  B07,
  BEAM_H,
  COL_W,
  COLS,
  colX,
  D06,
  FENCE,
  FENCE_LITE,
  GATE_IN,
  GATE_OUT,
  MOMENTS,
  NORTH_ROAD,
  ROW0,
  ROW_H,
  ROWS,
  rowMid,
  rowY,
  sceneKeyframes,
  SOUTH_ROAD,
  STRIPS,
  type Strip,
  T01,
  T02,
  type Volume,
  VOLUMES,
  VOLUMES_LITE,
  zoneHull,
  ZONES,
} from "./yard";

/*
 * Escenario isométrico del patio. Capas (de abajo hacia arriba):
 * piso, cerca y volúmenes del fondo (SVG) · zonas para hover (SVG transparente, debajo de todo lo animado) ·
 * plano HTML del piso (resaltado de zona, traza iluminada, anillo) · plumas · camiones ·
 * volúmenes del frente (SVG recortado a su caja) · haz de B-07 · etiquetas y chips.
 * Todo lo animado dura exactamente un ciclo (data-cycle), así MotionObserver lo alinea con los Step.
 */

const r = (n: number) => Math.round(n * 100) / 100;
const u = (n: number) => `calc(${r(n)} * var(--u))`;
const place = ([x, y]: Pt): CSSProperties => ({ left: u(x), top: u(y) });
const VB = { x: -700, y: -440, w: 1400, h: 880 };
const VIEWBOX = `${VB.x} ${VB.y} ${VB.w} ${VB.h}`;
const LAYER: CSSProperties = { left: u(VB.x), top: u(VB.y), width: u(VB.w), height: u(VB.h) };
const hair = { vectorEffect: "non-scaling-stroke" } as const;

function Polys({ polys }: { polys: Poly[] }) {
  return polys.map((poly, index) => {
    const width = poly.sw ? { strokeWidth: poly.sw } : undefined;
    if (poly.fill === "none") return <polyline key={index} points={poly.pts} stroke={poly.stroke} style={poly.sw === 0.8 ? undefined : width} />;
    if (poly.facet) return <polygon key={index} points={poly.pts} color={poly.fill} className={s.facet} />;
    return <polygon key={index} points={poly.pts} fill={poly.fill} stroke={poly.stroke} style={width} />;
  });
}

/** Caja en pantalla de un grupo de volúmenes (para recortar su SVG al mínimo). */
function boxOf(volumes: Volume[]) {
  const [l, t, rr, b] = volumes.reduce<[number, number, number, number]>(
    (acc, item) => [Math.min(acc[0], item.screen[0]), Math.min(acc[1], item.screen[1]), Math.max(acc[2], item.screen[2]), Math.max(acc[3], item.screen[3])],
    [Infinity, Infinity, -Infinity, -Infinity],
  );
  const pad = 2;
  return { x: Math.floor(l - pad), y: Math.floor(t - pad), w: Math.ceil(rr - l + pad * 2), h: Math.ceil(b - t + pad * 2) };
}

const faint = "rgb(238 235 228 / 0.09)";

/** Piso en coordenadas del mundo (un solo <g> con la matriz isométrica). */
function Ground({ id, preview }: { id: string; preview: boolean }) {
  return (
    <g transform={groundMatrix}>
      <defs>
        <pattern id={`${id}-hatch`} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0V12" stroke="rgb(238 235 228 / 0.05)" strokeWidth="2" />
        </pattern>
        <pattern id={`${id}-res`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <path d="M0 0V8" stroke="rgb(220 197 154 / 0.14)" strokeWidth="2" />
        </pattern>
        <linearGradient id={`${id}-in`} gradientUnits="userSpaceOnUse" x1="0" y1="640" x2="0" y2="820">
          <stop offset="0" stopColor="rgb(238 235 228)" stopOpacity="0.07" />
          <stop offset="1" stopColor="rgb(238 235 228)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-out`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="-200">
          <stop offset="0" stopColor="rgb(238 235 228)" stopOpacity="0.07" />
          <stop offset="1" stopColor="rgb(238 235 228)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-floor`} gradientUnits="userSpaceOnUse" cx="420" cy="380" r="700">
          <stop offset="0" stopColor="rgb(20 27 29)" />
          <stop offset="1" stopColor="rgb(11 15 16)" />
        </radialGradient>
      </defs>

      {/* Caminos exteriores */}
      <rect x={GATE_IN.x0} y={640} width={GATE_IN.x1 - GATE_IN.x0} height={180} fill={`url(#${id}-in)`} />
      <rect x={GATE_OUT.x0} y={-200} width={GATE_OUT.x1 - GATE_OUT.x0} height={200} fill={`url(#${id}-out)`} />
      <path d={`M${GATE_IN.lane} 680V800M${GATE_OUT.lane} -10V-180`} stroke="rgb(238 235 228 / 0.16)" strokeDasharray="6 9" style={hair} />

      {/* Piso del patio */}
      <rect x="0" y="0" width="1050" height="640" fill={`url(#${id}-floor)`} fillOpacity="0.96" />
      <rect x="0" y="0" width="1050" height="640" fill="none" stroke="rgb(238 235 228 / 0.16)" style={hair} />

      {/* Calles: perimetrales y pasillos de cada zona */}
      <g fill="rgb(238 235 228 / 0.028)">
        <rect x="4" y={NORTH_ROAD - 23} width="1042" height="46" />
        <rect x="4" y={SOUTH_ROAD - 23} width="1042" height="46" />
        {ZONES.map((zone) => (
          <rect key={zone.id} x={colX(zone.col) + 4} y={ROW0} width="42" height={ROWS * ROW_H} />
        ))}
      </g>
      <g stroke="rgb(238 235 228 / 0.13)" strokeDasharray="5 8" style={hair}>
        <path d={`M10 ${NORTH_ROAD}H1040M10 ${SOUTH_ROAD}H1040`} />
        {ZONES.map((zone) => (
          <path key={zone.id} d={`M${colX(zone.col) + 25} ${ROW0 + 4}V${ROW0 + ROWS * ROW_H - 4}`} />
        ))}
      </g>

      {/* Retícula de ubicaciones */}
      <g fill="none" stroke={faint} style={hair}>
        {ZONES.map((zone) =>
          Array.from({ length: ROWS }, (_, index) => <rect key={`${zone.id}${index}`} x={colX(zone.col) + 52} y={rowY(index + 1)} width="94" height={ROW_H} />),
        )}
        {COLS.map((col, index) => (
          <path key={col} d={`M${colX(index)} 0V640`} stroke="rgb(238 235 228 / 0.05)" />
        ))}
      </g>
      <g fill="none" stroke="rgb(238 235 228 / 0.16)" strokeDasharray="2 5" style={hair}>
        {ZONES.map((zone) => (
          <rect key={zone.id} x={colX(zone.col) + 1.5} y={ROW0 - 3} width={COL_W - 3} height={ROWS * ROW_H + 6} />
        ))}
      </g>

      {/* Letras de zona pintadas en el piso (solo en la escena ancha: en la vista previa o en mobile no se leerían) */}
      {!preview && (
        <g className={s.floorLetters} fill="rgb(238 235 228 / 0.1)" fontFamily="var(--font-mono)" fontSize="30" textAnchor="middle">
          {ZONES.map((zone) => (
            <text key={zone.id} x={colX(zone.col) + 25} y={ROW0 + 32}>
              {zone.id}
            </text>
          ))}
        </g>
      )}

      {/* G · maniobras: rayado, cajones, báscula y líneas de alto en los accesos */}
      <rect x="904" y={ROW0} width="142" height={ROWS * ROW_H - 70} fill={`url(#${id}-hatch)`} />
      <g stroke="rgb(238 235 228 / 0.2)" style={hair}>
        {[2, 3, 4, 5].map((row) => (
          <path key={row} d={`M928 ${rowY(row) + 1}H1036`} />
        ))}
      </g>
      <rect x="796" y={SOUTH_ROAD - 19} width="92" height="38" fill="rgb(238 235 228 / 0.035)" stroke="rgb(238 235 228 / 0.3)" style={hair} />
      <path d={`M800 ${SOUTH_ROAD - 15}H884M800 ${SOUTH_ROAD + 15}H884M842 ${SOUTH_ROAD - 15}V${SOUTH_ROAD + 15}`} stroke="rgb(238 235 228 / 0.12)" style={hair} />
      <path d={`M${GATE_IN.x0 + 4} 668H${GATE_IN.x1 - 4}`} stroke="rgb(220 197 154 / 0.55)" strokeDasharray="4 4" style={hair} />
      <path d={`M${GATE_OUT.x0 + 4} 10H${GATE_OUT.x1 - 4}`} stroke="rgb(220 197 154 / 0.4)" strokeDasharray="4 4" style={hair} />

      {/* Ruta asignada a T-01: el tramo de llegada se marca fuerte, la salida tenue */}
      <polyline
        points={[
          [GATE_IN.lane, APPROACH.from],
          [GATE_IN.lane, SOUTH_ROAD],
          [GATE_OUT.lane, SOUTH_ROAD],
          [GATE_OUT.lane, B07.y],
        ].join(" ")}
        fill="none"
        stroke="rgb(111 214 176 / 0.6)"
        strokeWidth="1.4"
        strokeDasharray="4 5"
        style={hair}
      />
      <polyline points={`${GATE_OUT.lane},${B07.y} ${GATE_OUT.lane},-90`} fill="none" stroke="rgb(238 235 228 / 0.3)" strokeDasharray="3 5" style={hair} />
      <circle cx={GATE_IN.lane} cy={APPROACH.from} r="6" fill="var(--color-ink-950)" stroke="rgb(111 214 176 / 0.9)" strokeWidth="1.4" style={hair} />

      {/* B-07 reservada: contorno y rayado dorado hasta que llega el material */}
      <rect x={colX(1) + 52} y={rowY(7)} width="94" height={ROW_H} fill={`url(#${id}-res)`} stroke="rgb(220 197 154 / 0.85)" strokeWidth="1.3" strokeDasharray="6 4" style={hair} />
      <circle cx={B07.x} cy={B07.y} r="56" fill="none" stroke="rgb(220 197 154 / 0.38)" style={hair} />
      <circle cx={B07.x} cy={B07.y} r="66" fill="none" stroke="rgb(220 197 154 / 0.2)" strokeDasharray="3 6" style={hair} />

      {/* D-06: destino asignado a T-02 */}
      {!preview && <ellipse cx={D06.x} cy={D06.y} rx="44" ry="30" fill="rgb(143 184 216 / 0.06)" stroke="rgb(143 184 216 / 0.6)" strokeDasharray="4 4" style={hair} />}
    </g>
  );
}

function TruckSprite({ strip, name, anim }: { strip: Strip; name: string; anim: (name: string, timing?: string) => string }) {
  const n = strip.cells.length;
  return (
    <div className={s.sprite} style={{ left: u(-strip.ax), top: u(-strip.ay), width: u(strip.w), height: u(strip.h) }}>
      <svg viewBox={`0 0 ${strip.w} ${strip.h * n}`} className={s.strip} style={{ height: `${n * 100}%`, animation: anim(name, "step-end") }}>
        {strip.polys.map((polys, index) => (
          <g key={index} transform={`translate(${strip.ax} ${strip.ay + index * strip.h})`}>
            <Polys polys={polys} />
          </g>
        ))}
      </svg>
    </div>
  );
}

/** Pluma: plano vertical de la cerca (matriz) y brazo que gira en ese plano. */
function Barrier({ pivot, dir, length, animation }: { pivot: Pt; dir: Pt; length: number; animation: string }) {
  return (
    <div className={s.barrier} style={{ ...place(iso(pivot[0], pivot[1], 0)), transform: wallMatrix(dir[0], dir[1]) }}>
      <span className={s.arm} style={{ top: u(-22), width: u(length), height: u(3.6), marginTop: u(-1.8), animation }} />
    </div>
  );
}

export function Stage({ preview = false, cycle }: { preview?: boolean; cycle: number }) {
  const prefix = preview ? "aplp" : "apls";
  const anim = (name: string, timing = "linear") => `${prefix}-${name} ${cycle}ms ${timing} infinite`;
  const volumes = preview ? VOLUMES_LITE : VOLUMES;
  const fence = preview ? FENCE_LITE : FENCE;
  const id = preview ? "aplomo-p" : "aplomo-s";
  const front = boxOf(volumes.front);
  const plane: CSSProperties = {
    width: u(1050),
    height: u(640),
    transform: `translate(${u(GROUND.e)}, ${u(GROUND.f)}) matrix(${[GROUND.a, GROUND.b, GROUND.c, GROUND.d].map((n) => n.toFixed(5)).join(", ")}, 0, 0)`,
  };
  const [bx, by] = iso(B07.x, B07.y, 0);
  const fresh = mound(B07.x - 2, B07.y, 37, 22, 31, PAL.bulkGold, 7 * 1.7, preview ? 10 : 14);
  const hoverCss = preview
    ? ""
    : ZONES.map(
        (zone) =>
          `.${s.stage}:has([data-zone="${zone.id}"]:hover) .${s.zoneHl}{opacity:1;transform:translateX(calc(${colX(zone.col)} * var(--u)))}.${s.stage}:has([data-zone="${zone.id}"]:hover) [data-zone-tag="${zone.id}"]{opacity:1;translate:-50% -100%}`,
      ).join("");

  return (
    <div className={s.stage}>
      <style dangerouslySetInnerHTML={{ __html: stageCss(prefix, s.stage, cycle, preview ? s.preview : undefined) + sceneKeyframes(prefix) + hoverCss }} />
      <div className={s.origin}>
        {/* Piso, cerca completa y volúmenes que nunca tapan a un camión */}
        <svg viewBox={VIEWBOX} className={s.layer} style={LAYER}>
          <Ground id={id} preview={preview} />
          <Polys polys={fence.back} />
          <Polys polys={fence.front} />
          {volumes.back.map((item, index) => (
            <g key={index}>
              <Polys polys={item.polys} />
            </g>
          ))}
        </svg>

        {/* Zonas sensibles al puntero: transparentes y debajo de todo lo animado (no fuerzan capas) */}
        {!preview && (
          <svg viewBox={VIEWBOX} className={s.hit} style={LAYER}>
            {[...ZONES].reverse().map((zone) => (
              <polygon key={zone.id} data-zone={zone.id} points={zoneHull(zone)} />
            ))}
          </svg>
        )}

        {/* Plano del piso en HTML: resaltado de zona, traza iluminada por tramos y anillo de B-07 */}
        <div className={s.plane} style={plane}>
          {/* Un solo resaltado (capa propia) que se desliza a la zona bajo el puntero */}
          {!preview && <span className={s.zoneHl} style={{ left: u(1.5), top: u(ROW0 - 3), width: u(COL_W - 3), height: u(ROWS * ROW_H + 6) }} />}
          <span
            className={s.trail}
            style={{ left: u(GATE_IN.lane - 2), top: u(SOUTH_ROAD - 2), width: u(4), height: u(APPROACH.from - SOUTH_ROAD + 2), transformOrigin: "50% 100%", animation: anim("approach") }}
          />
          <span
            className={s.trail}
            style={{ left: u(GATE_OUT.lane - 2), top: u(SOUTH_ROAD - 2), width: u(GATE_IN.lane - GATE_OUT.lane + 2), height: u(4), transformOrigin: "100% 50%", animation: anim("road") }}
          />
          <span
            className={s.trail}
            style={{
              left: u(GATE_OUT.lane - 2),
              top: u(0),
              width: u(4),
              height: u(SOUTH_ROAD + 2),
              transformOrigin: "50% 100%",
              // Vista estática: la traza llega hasta B-07, donde quedó T-01.
              transform: `scaleY(${r(AISLE_AT_B07)})`,
              animation: anim("aisle"),
            }}
          />
          <span className={s.glow} style={{ left: u(B07.x - 90), top: u(B07.y - 90), width: u(180), height: u(180) }} />
          <span className={`${s.ring} motion-only`} style={{ left: u(B07.x - 62), top: u(B07.y - 62), width: u(124), height: u(124), animation: anim("ping") }} />
        </div>

        <Barrier pivot={[GATE_IN.x1, 640]} dir={[-1, 0]} length={GATE_IN.x1 - GATE_IN.x0 - 2} animation={anim("gate-in")} />
        <Barrier pivot={[GATE_OUT.x0, 0]} dir={[1, 0]} length={GATE_OUT.x1 - GATE_OUT.x0 - 2} animation={anim("gate-out")} />

        {/* Camiones */}
        <div className={`${s.mover} motion-only`} style={{ animation: anim("t02") }}>
          <TruckSprite strip={STRIPS.T02} name="s02" anim={anim} />
        </div>
        <div className={`${s.mover} motion-only`} style={{ animation: anim("t01") }}>
          <TruckSprite strip={STRIPS.T01} name="s01" anim={anim} />
        </div>

        {/* Vista estática: T-01 recién descargado en B-07 */}
        <div className={`${s.mover} ${s.parkedStatic}`} style={{ opacity: 1, transform: `translate(${r(iso(GATE_OUT.lane, B07.y)[0])}%, ${r(iso(GATE_OUT.lane, B07.y)[1])}%)` }}>
          <div className={s.sprite} style={{ left: u(-STRIPS.T01.ax), top: u(-STRIPS.T01.ay), width: u(STRIPS.T01.w), height: u(STRIPS.T01.h) }}>
            <svg viewBox={`0 0 ${STRIPS.T01.w} ${STRIPS.T01.h}`} className={s.strip}>
              <g transform={`translate(${STRIPS.T01.ax} ${STRIPS.T01.ay})`}>
                <Polys polys={STRIPS.T01.polys[STRIPS.T01.cells.findIndex((cell) => cell.heading === "N" && !cell.loaded)]} />
              </g>
            </svg>
          </div>
        </div>

        {/* Volúmenes del frente: tapan a los camiones que pasan detrás (SVG recortado a su caja) */}
        <svg viewBox={`${front.x} ${front.y} ${front.w} ${front.h}`} className={s.layer} style={{ left: u(front.x), top: u(front.y), width: u(front.w), height: u(front.h) }}>
          {volumes.front.map((item, index) => (
            <g key={index}>
              <Polys polys={item.polys} />
            </g>
          ))}
        </svg>

        {/* Material nuevo en B-07: aparece y crece durante la descarga */}
        <div className={s.fill} style={{ left: u(bx - 60), top: u(by - 56), width: u(120), height: u(80), animation: anim("fill") }}>
          <svg viewBox={`${r(bx - 60)} ${r(by - 56)} 120 80`}>
            <Polys polys={fresh} />
          </svg>
        </div>

        {/* Haz vertical de la ubicación destacada */}
        <div className={s.beam} style={place([bx, by])}>
          <span className={s.beamGlow} style={{ width: u(34), height: u(BEAM_H) }} />
          <span className={s.beamCore} style={{ height: u(BEAM_H) }} />
          <span className={`${s.beamRise} motion-only`} style={{ height: u(BEAM_H - 8), animation: anim("rise") }}>
            <span />
          </span>
          <span className={s.pin} style={{ bottom: u(BEAM_H - 5) }} />
        </div>

        {/* Material cayendo del camión al montículo */}
        {!preview && (
          <div className={`${s.mover} motion-only`} style={{ animation: anim("particle") }}>
            <span className={s.particle} />
          </div>
        )}

        <Labels preview={preview} anim={anim} beamTop={[bx, by - BEAM_H]} />
      </div>
      {!preview && <Hud />}
    </div>
  );
}

const SIGNAL = "var(--color-signal)";
const GOLD = "var(--color-gold-300)";
const MIST = "var(--color-mist)";

function Labels({ preview, anim, beamTop }: { preview: boolean; anim: (name: string) => string; beamTop: Pt }) {
  const pinAt: Pt = [beamTop[0], beamTop[1] - 10];
  return (
    <>
      {/* Etiqueta de B-07 en la cabeza del haz (el estado se apila encima, en flujo normal) */}
      <div className={s.chipAnchor} style={place(pinAt)}>
        <div className={s.pinStack}>
          {!preview && (
            <Step at={[MOMENTS.unloadEnd, MOMENTS.reset]} fx="up" className={`${s.chip} ${s.chipGold} ${s.status}`}>
              <span className={s.dot} style={{ color: GOLD }} />
              <em>Ubicado</em>
            </Step>
          )}
          <div className={s.pinTag}>
            <strong>B-07</strong>
            <span>Granel</span>
          </div>
        </div>
      </div>

      {!preview && (
        <>
          {/* Columnas (zonas) a lo largo del frente y filas a lo largo del costado oeste */}
          {COLS.map((col, index) => {
            const zone = ZONES.find((item) => item.col === index);
            const [x, y] = index === 6 ? iso(1034, 668) : iso(colX(index) + 84, 668);
            return (
              <span key={col} className={`${s.tag} ${s.colTag}`} style={{ left: u(x), top: u(y) }}>
                <b className={s.long}>{zone ? `Zona ${col}` : col}</b>
                <b className={s.short}>{col}</b>
              </span>
            );
          })}
          {Array.from({ length: ROWS }, (_, index) => {
            const [x, y] = iso(-30, rowMid(index + 1));
            return (
              <span key={index} className={`${s.tag} ${s.rowTag} ${index % 2 ? s.hideSm : ""}`} style={{ left: u(x), top: u(y) }}>
                {String(index + 1).padStart(2, "0")}
              </span>
            );
          })}
          <span className={`${s.tag} ${s.gateTag} ${s.hideSm}`} style={place(iso(GATE_OUT.lane - 96, -46))}>
            <i />
            Salida
          </span>
          <span className={`${s.tag} ${s.gateTag} ${s.hideSm}`} style={place(iso(GATE_IN.x0 - 34, 756))}>
            <i />
            Acceso
          </span>

          {/* Chips de cada camión: su recorrido y colocación vienen de chips.ts (keyframes por ancho) */}
          <div data-chip="1" className={`${s.mover} motion-only`}>
            <div className={s.chipAnchor}>
              <Step at={[0.004, MOMENTS.t01Arrive]} fx="up" className={s.chip}>
                <span className={s.dot} style={{ color: SIGNAL }} />
                T-01 · <em>En ruta</em>
              </Step>
              <Step at={[MOMENTS.t01Arrive, MOMENTS.t01Leave - 0.004]} fx="up" className={`${s.chip} ${s.chipGold}`}>
                <span className={s.dot} style={{ color: GOLD }} />
                T-01 · <em>Descarga</em>
                <span className={s.bar}>
                  <span style={{ animation: anim("progress") }} />
                </span>
              </Step>
              <Step at={[MOMENTS.t01Leave, T01.vanish - 0.014]} fx="up" className={s.chip}>
                <span className={s.dot} style={{ color: MIST }} />
                T-01 · <em>Salida</em>
              </Step>
            </div>
          </div>
          <div data-chip="2" className={`${s.mover} motion-only`}>
            <div className={s.chipAnchor}>
              <Step at={[T02.appear + 0.004, MOMENTS.t02Arrive]} fx="up" className={`${s.chip} ${s.chipCool}`}>
                <span className={s.dot} style={{ color: "var(--color-cool)" }} />
                T-02 · <em>En ruta</em>
              </Step>
              <Step at={[MOMENTS.t02Arrive, MOMENTS.t02Leave - 0.004]} fx="up" className={`${s.chip} ${s.chipCool}`}>
                <span className={s.dot} style={{ color: "var(--color-cool)" }} />
                T-02 · <em>Carga</em>
                <span className={s.bar}>
                  <span style={{ animation: anim("loadbar"), background: "var(--color-cool)" }} />
                </span>
              </Step>
              <Step at={[MOMENTS.t02Leave, T02.vanish - 0.014]} fx="up" className={`${s.chip} ${s.chipCool}`}>
                <span className={s.dot} style={{ color: MIST }} />
                T-02 · <em>Salida</em>
              </Step>
            </div>
          </div>

          {/* Etiqueta de cada zona al pasar el puntero */}
          {ZONES.map((zone) => {
            const [x, y] = iso(colX(zone.col) + 99, ROW0 + 10, 64);
            return (
              <span key={zone.id} data-zone-tag={zone.id} className={`${s.tag} ${s.zoneTag}`} style={{ left: u(x), top: u(y) }}>
                Zona {zone.id} · {zone.kind}
                <small>{zone.note}</small>
              </span>
            );
          })}
        </>
      )}
    </>
  );
}

function Hud() {
  const north = iso(0, -1, 0);
  const origin = iso(0, 0, 0);
  const angle = (Math.atan2(north[1] - origin[1], north[0] - origin[0]) * 180) / Math.PI + 90;
  return (
    <>
      <div className={s.hud}>
        <div className={s.compass}>
          <span>Patio 01 · vista isométrica</span>
          <svg viewBox="-15 -15 30 30" aria-hidden="true">
            <circle r="13" fill="none" stroke="rgb(238 235 228 / 0.25)" />
            <g transform={`rotate(${r(angle)})`}>
              <path d="M0 -10L3.5 2H-3.5Z" fill="var(--color-signal)" />
              <path d="M0 10L3.5 2H-3.5Z" fill="rgb(238 235 228 / 0.3)" />
            </g>
          </svg>
        </div>
      </div>
      <ul className={`${s.hud} ${s.legend}`}>
        <li>
          <i>
            <svg viewBox="0 0 12 10">
              <path d="M1 3L6 1L11 3V8L6 10L1 8Z" fill="rgb(86 97 101)" />
            </svg>
          </i>
          Bloques · perfiles
        </li>
        <li>
          <i>
            <svg viewBox="0 0 12 10">
              <path d="M0 9.5Q6 -2 12 9.5Z" fill="rgb(104 96 82)" />
            </svg>
          </i>
          Granel
        </li>
        <li>
          <i style={{ height: 2, background: "var(--color-signal)" }} />
          Ruta trazada
        </li>
        <li>
          <i>
            <svg viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="4.5" fill="none" stroke="var(--color-gold-300)" />
              <circle cx="6" cy="6" r="1.8" fill="var(--color-gold-300)" />
            </svg>
          </i>
          Ubicación activa
        </li>
      </ul>
    </>
  );
}

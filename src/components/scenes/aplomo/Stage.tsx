import type { CSSProperties } from "react";
import { Step } from "@/components/motion/Step";
import s from "../AplomoScene.module.css";
import { GROUND, groundMatrix, iso, mound, PAL, wallMatrix, type Poly, type Pt } from "./iso";
import {
  B07,
  COL_W,
  D06,
  COLS,
  colX,
  CYCLE,
  FENCE,
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
  VOLUMES,
  zoneHull,
  ZONES,
} from "./yard";

/*
 * Escenario isométrico del patio. Capas (de abajo hacia arriba):
 * piso + volúmenes del fondo (SVG) · ruta planeada (Step) · plano HTML con la traza iluminada ·
 * plumas · camiones · volúmenes del frente (SVG) · haz de B-07 · partículas · etiquetas y chips · zonas (hover).
 */

const r = (n: number) => Math.round(n * 100) / 100;
const u = (n: number) => `calc(${r(n)} * var(--u))`;
const place = ([x, y]: Pt): CSSProperties => ({ left: u(x), top: u(y) });
const VB = { x: -700, y: -440, w: 1400, h: 880 };
const VIEWBOX = `${VB.x} ${VB.y} ${VB.w} ${VB.h}`;
const LAYER: CSSProperties = { left: u(VB.x), top: u(VB.y), width: u(VB.w), height: u(VB.h) };
const anim = (name: string, timing = "linear") => `${name} ${CYCLE}ms ${timing} infinite`;

function Polys({ polys }: { polys: Poly[] }) {
  return polys.map((poly, index) =>
    poly.fill === "none" ? (
      <polyline key={index} points={poly.pts} fill="none" stroke={poly.stroke} strokeWidth={poly.sw ?? 0.8} />
    ) : (
      <polygon key={index} points={poly.pts} fill={poly.fill} stroke={poly.stroke} strokeWidth={poly.sw ?? 0.7} />
    ),
  );
}

const faint = "rgb(238 235 228 / 0.09)";

/** Piso en coordenadas del mundo (un solo <g> con la matriz isométrica). */
function Ground({ id }: { id: string }) {
  const hair = { vectorEffect: "non-scaling-stroke" } as const;
  return (
    <g transform={groundMatrix}>
      <defs>
        <pattern id={`${id}-hatch`} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0V12" stroke="rgb(238 235 228 / 0.05)" strokeWidth="2" />
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
      <path d={`M${GATE_IN.lane} 650V800M${GATE_OUT.lane} -10V-180`} stroke="rgb(238 235 228 / 0.16)" strokeDasharray="6 9" style={hair} />

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

      {/* Letras de zona pintadas en el piso */}
      <g fill="rgb(238 235 228 / 0.1)" fontFamily="var(--font-mono)" fontSize="30" textAnchor="middle">
        {ZONES.map((zone) => (
          <text key={zone.id} x={colX(zone.col) + 25} y={ROW0 + 32}>
            {zone.id}
          </text>
        ))}
      </g>

      {/* G · maniobras: rayado, cajones de estacionamiento, báscula y línea de alto en el acceso */}
      <rect x="904" y={ROW0} width="142" height={ROWS * ROW_H - 70} fill={`url(#${id}-hatch)`} />
      <g stroke="rgb(238 235 228 / 0.2)" style={hair}>
        {[2, 3, 4, 5].map((row) => (
          <path key={row} d={`M928 ${rowY(row) + 1}H1036`} />
        ))}
      </g>
      <rect x="796" y={SOUTH_ROAD - 19} width="92" height="38" fill="rgb(238 235 228 / 0.035)" stroke="rgb(238 235 228 / 0.3)" style={hair} />
      <path d={`M800 ${SOUTH_ROAD - 15}H884M800 ${SOUTH_ROAD + 15}H884`} stroke="rgb(238 235 228 / 0.12)" style={hair} />
      <text x="842" y={SOUTH_ROAD + 4} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="1.5" fill="rgb(238 235 228 / 0.32)">
        BÁSCULA
      </text>
      <path d={`M${GATE_IN.x0 + 4} 652H${GATE_IN.x1 - 4}`} stroke="rgb(220 197 154 / 0.5)" strokeDasharray="4 4" style={hair} />
      <path d={`M${GATE_OUT.x0 + 4} 10H${GATE_OUT.x1 - 4}`} stroke="rgb(220 197 154 / 0.4)" strokeDasharray="4 4" style={hair} />

      {/* Ubicación destacada */}
      <rect x={colX(1) + 52} y={rowY(7)} width="94" height={ROW_H} fill="rgb(220 197 154 / 0.13)" stroke="rgb(220 197 154 / 0.85)" strokeWidth="1.3" style={hair} />
      <circle cx={B07.x} cy={B07.y} r="56" fill="none" stroke="rgb(220 197 154 / 0.38)" style={hair} />
      <circle cx={B07.x} cy={B07.y} r="66" fill="none" stroke="rgb(220 197 154 / 0.2)" strokeDasharray="3 6" style={hair} />
    </g>
  );
}

/** Ruta planeada de T-01 (aparece cuando el sistema asigna B-07). */
function PlannedRoute() {
  const inbound = [
    [GATE_IN.lane, 668],
    [GATE_IN.lane, SOUTH_ROAD],
    [GATE_OUT.lane, SOUTH_ROAD],
    [GATE_OUT.lane, B07.y],
  ];
  return (
    <g transform={groundMatrix} fill="none" style={{ vectorEffect: "non-scaling-stroke" }}>
      <polyline points={inbound.join(" ")} stroke="rgb(111 214 176 / 0.55)" strokeDasharray="3 5" style={{ vectorEffect: "non-scaling-stroke" }} />
      <polyline points={`${GATE_OUT.lane},${B07.y} ${GATE_OUT.lane},-90`} stroke="rgb(238 235 228 / 0.3)" strokeDasharray="3 5" style={{ vectorEffect: "non-scaling-stroke" }} />
      <circle cx={GATE_OUT.lane} cy={B07.y} r="7" stroke="rgb(111 214 176 / 0.8)" style={{ vectorEffect: "non-scaling-stroke" }} />
    </g>
  );
}

function TruckSprite({ strip, name, prefix }: { strip: Strip; name: string; prefix: string }) {
  const n = strip.cells.length;
  return (
    <div className={s.sprite} style={{ left: u(-strip.ax), top: u(-strip.ay), width: u(strip.w), height: u(strip.h) }}>
      <svg viewBox={`0 0 ${strip.w} ${strip.h * n}`} className={s.strip} style={{ height: `${n * 100}%`, animation: anim(`${prefix}-${name}`, "step-end") }}>
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
function Barrier({ pivot, dir, length, name }: { pivot: Pt; dir: Pt; length: number; name: string }) {
  return (
    <div className={s.barrier} style={{ ...place(iso(pivot[0], pivot[1], 0)), transform: wallMatrix(dir[0], dir[1]) }}>
      <span className={s.arm} style={{ top: u(-22), width: u(length), height: u(3.6), marginTop: u(-1.8), animation: anim(name) }} />
    </div>
  );
}

export function Stage({ preview = false }: { preview?: boolean }) {
  const prefix = preview ? "aplp" : "apls";
  const id = preview ? "aplomo-p" : "aplomo-s";
  const plane: CSSProperties = {
    width: u(1050),
    height: u(640),
    transform: `translate(${u(GROUND.e)}, ${u(GROUND.f)}) matrix(${[GROUND.a, GROUND.b, GROUND.c, GROUND.d].map((n) => n.toFixed(5)).join(", ")}, 0, 0)`,
  };
  const [bx, by] = iso(B07.x, B07.y, 0);
  const beamH = 205 * 0.8387;
  const fresh = mound(B07.x - 2, B07.y, 37, 22, 31, PAL.bulkGold, 7 * 1.7);
  const hoverCss = preview
    ? ""
    : ZONES.map(
        (zone) =>
          `.${s.stage}:has([data-zone="${zone.id}"]:hover) [data-zone-hl="${zone.id}"],.${s.stage}:has([data-zone="${zone.id}"]:hover) [data-zone-tag="${zone.id}"]{opacity:1;transform:none}`,
      ).join("");

  return (
    <div className={s.stage}>
      <style dangerouslySetInnerHTML={{ __html: sceneKeyframes(prefix) + hoverCss }} />
      <div className={s.origin}>
        {/* Piso, cerca del fondo y volúmenes que nunca tapan a un camión */}
        <svg viewBox={VIEWBOX} className={s.layer} style={LAYER} aria-hidden="true">
          <Ground id={id} />
          <Polys polys={FENCE.back} />
          {VOLUMES.back.map((item, index) => (
            <g key={index}>
              <Polys polys={item.polys} />
            </g>
          ))}
        </svg>

        {/* Zonas resaltadas al pasar el puntero */}
        {!preview && (
          <svg viewBox={VIEWBOX} className={s.layer} style={LAYER}>
            <g transform={groundMatrix}>
              {ZONES.map((zone) => (
                <rect
                  key={zone.id}
                  data-zone-hl={zone.id}
                  className={s.zoneHl}
                  x={colX(zone.col) + 1.5}
                  y={ROW0 - 3}
                  width={COL_W - 3}
                  height={ROWS * ROW_H + 6}
                  fill="rgb(111 214 176 / 0.07)"
                  stroke="rgb(111 214 176 / 0.8)"
                  style={{ vectorEffect: "non-scaling-stroke" }}
                />
              ))}
            </g>
          </svg>
        )}

        {/* Ruta asignada a T-01 */}
        {preview ? (
          <svg viewBox={VIEWBOX} className={s.layer} style={LAYER}>
            <PlannedRoute />
          </svg>
        ) : (
          <Step at={[MOMENTS.t01Road, MOMENTS.reset]} fx="fade" className={s.layer} style={LAYER}>
            <svg viewBox={VIEWBOX} className="block size-full overflow-visible">
              <PlannedRoute />
            </svg>
          </Step>
        )}

        {/* Plano del piso en HTML: traza iluminada por tramos y anillo de B-07 */}
        <div className={s.plane} style={plane}>
          <span
            className={s.trail}
            style={{ left: u(GATE_OUT.lane - 2), top: u(SOUTH_ROAD - 2), width: u(GATE_IN.lane - GATE_OUT.lane + 2), height: u(4), transformOrigin: "100% 50%", animation: anim(`${prefix}-road`) }}
          />
          <span
            className={s.trail}
            style={{ left: u(GATE_OUT.lane - 2), top: u(0), width: u(4), height: u(SOUTH_ROAD + 2), transformOrigin: "50% 100%", animation: anim(`${prefix}-aisle`) }}
          />
          <span className={s.glow} style={{ left: u(B07.x - 90), top: u(B07.y - 90), width: u(180), height: u(180) }} />
          <span className={`${s.ring} motion-only`} style={{ left: u(B07.x - 62), top: u(B07.y - 62), width: u(124), height: u(124) }} />
          <span className={`${s.sweep} motion-only`} style={{ left: u(-80), top: 0, width: u(80), height: u(640), "--sweep": u(1210) } as CSSProperties} />
          {!preview && (
            <Step as="span" at={[MOMENTS.t02Road, MOMENTS.t02Leave]} fx="pop" className={s.target} style={{ left: u(D06.x - 40), top: u(D06.y - 26), width: u(80), height: u(52) }} />
          )}
        </div>

        <Barrier pivot={[GATE_IN.x1, 640]} dir={[-1, 0]} length={GATE_IN.x1 - GATE_IN.x0 - 2} name={`${prefix}-gate-in`} />
        <Barrier pivot={[GATE_OUT.x0, 0]} dir={[1, 0]} length={GATE_OUT.x1 - GATE_OUT.x0 - 2} name={`${prefix}-gate-out`} />

        {/* Camiones */}
        <div className={`${s.mover} motion-only`} style={{ animation: anim(`${prefix}-t02`) }}>
          <TruckSprite strip={STRIPS.T02} name="s02" prefix={prefix} />
        </div>
        <div className={`${s.mover} motion-only`} style={{ animation: anim(`${prefix}-t01`) }}>
          <TruckSprite strip={STRIPS.T01} name="s01" prefix={prefix} />
        </div>

        {/* Vista estática: T-01 descargando en B-07 */}
        <div className={`${s.mover} ${s.parkedStatic}`} style={{ opacity: 1, transform: `translate(${r(iso(GATE_OUT.lane, B07.y)[0])}%, ${r(iso(GATE_OUT.lane, B07.y)[1])}%)` }}>
          <div className={s.sprite} style={{ left: u(-STRIPS.T01.ax), top: u(-STRIPS.T01.ay), width: u(STRIPS.T01.w), height: u(STRIPS.T01.h) }}>
            <svg viewBox={`0 0 ${STRIPS.T01.w} ${STRIPS.T01.h}`} className={s.strip}>
              <g transform={`translate(${STRIPS.T01.ax} ${STRIPS.T01.ay})`}>
                <Polys polys={STRIPS.T01.polys[STRIPS.T01.cells.findIndex((cell) => cell.heading === "N" && !cell.loaded)]} />
              </g>
            </svg>
          </div>
        </div>

        {/* Volúmenes y cerca del frente: tapan a los camiones que pasan detrás */}
        <svg viewBox={VIEWBOX} className={s.layer} style={LAYER}>
          {VOLUMES.front.map((item, index) => (
            <g key={index}>
              <Polys polys={item.polys} />
            </g>
          ))}
          <Polys polys={FENCE.front} />
        </svg>

        {/* Material nuevo en B-07: crece durante la descarga */}
        <div className={s.fill} style={{ left: u(bx - 60), top: u(by - 56), width: u(120), height: u(80), animation: anim(`${prefix}-fill`) }}>
          <svg viewBox={`${r(bx - 60)} ${r(by - 56)} 120 80`}>
            <Polys polys={fresh} />
          </svg>
        </div>

        {/* Haz vertical de la ubicación destacada */}
        <div className={s.beam} style={place([bx, by])}>
          <span className={s.beamGlow} style={{ width: u(34), height: u(beamH) }} />
          <span className={s.beamCore} style={{ height: u(beamH) }} />
          <span className={`${s.beamPulse} motion-only`} style={{ "--rise": u(-beamH + 8) } as CSSProperties} />
          <span className={s.pin} style={{ bottom: u(beamH - 5) }} />
        </div>

        {/* Material cayendo del camión al montículo */}
        {!preview &&
          ["p1", "p2"].map((name) => (
            <div key={name} className={`${s.mover} motion-only`} style={{ animation: anim(`${prefix}-${name}`) }}>
              <span className={s.particle} />
            </div>
          ))}

        <Labels preview={preview} prefix={prefix} beamTop={[bx, by - beamH]} />
      </div>
      {!preview && <Hud />}
    </div>
  );
}

function Labels({ preview, prefix, beamTop }: { preview: boolean; prefix: string; beamTop: Pt }) {
  const pinAt: Pt = [beamTop[0], beamTop[1] - 10];
  return (
    <>
      {/* Etiqueta de B-07 en la cabeza del haz */}
      <div className={s.chipAnchor} style={place(pinAt)}>
        <div className={s.pinTag}>
          <strong>B-07</strong>
          <span>Granel</span>
        </div>
        {!preview && (
          <Step at={[MOMENTS.unloadEnd, MOMENTS.reset]} fx="up" className={s.status} style={{ bottom: u(52) }}>
            <span className={`${s.chip} ${s.chipGold}`}>
              <span className={s.dot} style={{ color: "var(--color-gold-300)" }} />
              <em>Ubicado</em>
            </span>
          </Step>
        )}
      </div>

      {!preview && (
        <>
          {/* Columnas (zonas) a lo largo del frente y filas a lo largo del costado oeste */}
          {COLS.map((col, index) => {
            const zone = ZONES.find((item) => item.col === index);
            const [x, y] = index === 6 ? iso(1034, 668) : iso(colX(index) + 84, 668);
            const long = zone ? `Zona ${col}` : col;
            return (
              <span key={col} className={`${s.tag} ${s.colTag}`} style={{ left: u(x), top: u(y) }}>
                <b className={s.long}>{long}</b>
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

          {/* Chips que viajan con cada camión (misma animación que su camión) */}
          <div className={`${s.mover} motion-only`} style={{ animation: anim(`${prefix}-t01`) }}>
            <div className={s.chipAnchor} style={{ top: u(-30), left: u(-8) }}>
              <Step at={[0.004, MOMENTS.t01Arrive]} fx="up" className={s.chip}>
                <span className={s.dot} style={{ color: "var(--color-signal)" }} />
                T-01 · <em>En ruta</em>
              </Step>
              <Step at={[MOMENTS.t01Arrive, MOMENTS.t01Leave - 0.004]} fx="up" className={`${s.chip} ${s.chipGold}`}>
                T-01 · <em>Descarga</em>
                <span className={s.bar}>
                  <span style={{ animation: anim(`${prefix}-progress`) }} />
                </span>
              </Step>
              <Step at={[MOMENTS.t01Leave, T01Vanish]} fx="up" className={s.chip}>
                <span className={s.dot} style={{ color: "var(--color-mist)" }} />
                T-01 · <em>Salida</em>
              </Step>
            </div>
          </div>
          <div className={`${s.mover} motion-only`} style={{ animation: anim(`${prefix}-t02`) }}>
            <div className={s.chipAnchor} style={{ top: u(-30), left: u(-8) }}>
              <span className={s.chip} style={{ borderColor: "rgb(143 184 216 / 0.5)" }}>
                <span className={s.dot} style={{ color: "var(--color-cool)" }} />
                T-02
              </span>
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
          <svg viewBox={VIEWBOX} className={s.hit} style={LAYER}>
            {[...ZONES].reverse().map((zone) => (
              <polygon key={zone.id} data-zone={zone.id} points={zoneHull(zone)} />
            ))}
          </svg>
        </>
      )}
    </>
  );
}

const T01Vanish = 0.6 - 0.014;

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

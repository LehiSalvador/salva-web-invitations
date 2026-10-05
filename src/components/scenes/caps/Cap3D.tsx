import type { CSSProperties } from "react";
import styles from "../CapsScene.module.css";

/*
 * Gorra en 3D real con CSS (preserve-3d): la corona es un domo de 8 gajos en 3 anillos, más visera,
 * botón y tornamesa. Todo gira con una sola animación de transform (rotateY) sobre el rig.
 * Las medidas van en múltiplos de --R (radio de la corona), así que escala con su contenedor.
 */

const N = 8;
/** Perfil del domo: [radio, altura] en unidades de R, de la base al botón. */
const PROFILE: [number, number][] = [
  [1, 0],
  [0.955, 0.3],
  [0.8, 0.6],
  [0.54, 0.84],
  [0.19, 0.98],
];
const SIN = Math.sin(Math.PI / N);
const COS = Math.cos(Math.PI / N);
const deg = (radians: number) => (radians * 180) / Math.PI;
const r = (value: number) => `calc(var(--R) * ${+value.toFixed(4)})`;

const panels = PROFILE.slice(0, -1).flatMap(([r0, y0], tier) => {
  const [r1, y1] = PROFILE[tier + 1];
  const w0 = 2 * r0 * SIN;
  const w1 = 2 * r1 * SIN;
  const a0 = r0 * COS;
  const a1 = r1 * COS;
  const length = Math.hypot(a0 - a1, y1 - y0);
  const tilt = deg(Math.atan2(a0 - a1, y1 - y0));
  const inset = ((w0 - w1) / 2 / w0) * 100;
  return Array.from({ length: N }, (_, index) => ({
    key: `${tier}-${index}`,
    tier,
    index,
    aspect: w0 / length,
    points: `${inset.toFixed(2)},0 ${(100 - inset).toFixed(2)},0 100,100 0,100`,
    style: {
      width: r(w0),
      height: r(length),
      marginLeft: r(-w0 / 2),
      transform: `rotateY(${(index * 360) / N}deg) translate3d(0, ${r(-y0)}, ${r(a0)}) rotateX(${tilt.toFixed(2)}deg)`,
    } as CSSProperties,
  }));
});

/* Visera: entre el borde de la corona (círculo 0.96) y una elipse que sobresale 0.72 R al frente. */
const BRIM_W = 0.86;
const INNER = 0.96;
const BRIM_C = Math.sqrt(INNER * INNER - BRIM_W * BRIM_W);
const BRIM_D = INNER + 0.86 - BRIM_C;
const brimPath = `M${-BRIM_W * 100} ${BRIM_C * 100}A${BRIM_W * 100} ${BRIM_D * 100} 0 0 0 ${BRIM_W * 100} ${BRIM_C * 100}A${INNER * 100} ${INNER * 100} 0 0 1 ${-BRIM_W * 100} ${BRIM_C * 100}Z`;
/* Pespuntes de la visera: elipses interiores recortadas fuera de la corona. */
const stitch = (scale: number) => {
  const points: string[] = [];
  for (let step = 0; step <= 40; step++) {
    const t = Math.PI * (step / 40);
    const x = -Math.cos(t) * BRIM_W * scale;
    const y = BRIM_C + Math.sin(t) * BRIM_D * scale;
    if (Math.hypot(x, y) > INNER + 0.05) points.push(`${(x * 100).toFixed(1)} ${(y * 100).toFixed(1)}`);
  }
  return `M${points.join("L")}`;
};

const ticks = Array.from({ length: 36 }, (_, index) => {
  const angle = (index * 10 * Math.PI) / 180;
  const inner = index % 9 === 0 ? 80 : 88;
  return `M${(Math.cos(angle) * inner).toFixed(1)} ${(Math.sin(angle) * inner).toFixed(1)}L${(Math.cos(angle) * 96).toFixed(1)} ${(Math.sin(angle) * 96).toFixed(1)}`;
}).join("");

const tierClass = [styles.tier0, styles.tier1, styles.tier2, styles.tier3];

export function Cap3D({ color, className = "" }: { color: string; className?: string }) {
  return (
    <div className={`${styles.turntable} ${className}`} style={{ "--cap": color } as CSSProperties}>
      <div className={styles.floor} />
      <div className={styles.stage}>
        <div className={styles.rig}>
          {/* tornamesa: gira con la gorra */}
          <div className={styles.disc} style={{ width: r(3), height: r(3), margin: `${r(-1.5)} 0 0 ${r(-1.5)}`, transform: `translate3d(0, ${r(0.42)}, 0) rotateX(90deg)` }}>
            <svg viewBox="-100 -100 200 200">
              <circle r="97" className={styles.discRim} />
              <circle r="72" className={styles.discRing} />
              <path d={ticks} className={styles.discTicks} />
              <path d="M0 76L-5 86H5Z" className={styles.discMark} />
            </svg>
          </div>
          {panels.map((panel) => (
            <div key={panel.key} className={`${styles.panel} ${tierClass[panel.tier]} ${panel.index % 2 ? styles.alt : ""}`} style={panel.style}>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                <polygon points={panel.points} className={styles.panelFace} />
                {panel.tier === 0 && <path d="M2 84H98" className={styles.panelStitch} />}
                {panel.tier === 0 && panel.index === 0 && <path d="M50 22L56 46L50 70L44 46Z" className={styles.panelEmblem} />}
                {panel.tier === 2 && panel.index % 2 === 1 && <ellipse cx="50" cy="46" rx="3" ry={(3 * panel.aspect).toFixed(2)} className={styles.panelEyelet} />}
              </svg>
            </div>
          ))}
          <div className={styles.capButton} style={{ width: r(0.4), height: r(0.4), margin: `${r(-0.2)} 0 0 ${r(-0.2)}`, transform: `translate3d(0, ${r(-0.98)}, 0) rotateX(90deg)` }} />
          <div
            className={styles.brim}
            style={{
              width: r(BRIM_W * 2),
              height: r(BRIM_C + BRIM_D),
              marginLeft: r(-BRIM_W),
              transform: `translate3d(0, 0, ${r(INNER)}) rotateX(78deg) translate3d(0, ${r(-INNER)}, 0)`,
            }}
          >
            <svg viewBox={`${-BRIM_W * 100} 0 ${BRIM_W * 200} ${(BRIM_C + BRIM_D) * 100}`}>
              <path d={brimPath} className={styles.brimFace} />
              <path d={`${stitch(0.9)}${stitch(0.8)}`} className={styles.brimStitch} />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

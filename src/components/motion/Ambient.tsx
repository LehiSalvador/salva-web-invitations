import type { CSSProperties } from "react";

/** Generador determinista: el mismo campo de partículas en servidor y cliente. */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const COLORS = ["rgb(111 214 176)", "rgb(111 214 176)", "rgb(143 200 216)", "rgb(226 236 232)"];
const random = seeded(20260105);
const round = (value: number, digits = 1) => Number(value.toFixed(digits));

/*
 * Partículas: elementos diminutos (cada uno es una capa mínima para el compositor) con keyframes de valores
 * literales, sin variables CSS, para que las animaciones no encarezcan los recálculos de estilo.
 */
const particles = Array.from({ length: 22 }, (_, index) => {
  const size = round(1.2 + random() * 1.6, 2);
  const opacity = round(0.25 + random() * 0.45, 2);
  return {
    name: `amb-p${index}`,
    style: {
      left: `${round(random() * 100, 2)}%`,
      top: `${round(random() * 100, 2)}%`,
      width: size,
      height: size,
      background: COLORS[Math.floor(random() * COLORS.length)],
      opacity,
      animation: `amb-p${index} ${Math.round(40 + random() * 50)}s ease-in-out -${Math.round(random() * 60)}s infinite`,
    } as CSSProperties,
    dx: round((random() - 0.5) * 300),
    dy: round((random() - 0.5) * 260),
    opacity,
  };
});

const keyframes = particles
  .map(
    ({ name, dx, dy, opacity }) =>
      `@keyframes ${name}{0%,100%{transform:translate3d(0,0,0);opacity:${opacity}}50%{transform:translate3d(${dx}px,${dy}px,0);opacity:${round(opacity * 0.3, 2)}}}`,
  )
  .join("");

const streaks = [
  { "--y": "18%", "--r": "8deg", "--fall": "14vh", "--t": "23s", "--delay": "-4s" },
  { "--y": "56%", "--r": "-6deg", "--fall": "-10vh", "--t": "31s", "--delay": "-17s" },
  { "--y": "78%", "--r": "4deg", "--fall": "8vh", "--t": "37s", "--delay": "-29s" },
] as unknown as CSSProperties[];

/**
 * Capa ambiental fija detrás de todo el sitio: luz de fondo, retícula, partículas, estelas y la lente que
 * sigue al puntero (InteractionEngine la mueve). Solo se anima con transform/opacity y con pocas capas grandes.
 */
export function Ambient() {
  return (
    <div id="ambient" className="ambient" aria-hidden="true">
      <style>{keyframes}</style>
      <div className="ambient__aurora ambient__aurora--a" />
      <div className="ambient__aurora ambient__aurora--b" />
      <div className="ambient__grid" />
      <div className="ambient__lens">
        <div className="ambient__lens-grid" />
      </div>
      {particles.map(({ name, style }) => (
        <span key={name} className="ambient__particle" style={style} />
      ))}
      {streaks.map((style, index) => (
        <span key={index} className="ambient__streak" style={style} />
      ))}
    </div>
  );
}

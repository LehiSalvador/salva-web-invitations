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
const particles = Array.from({ length: 44 }, () => {
  const size = 1 + random() * 1.7;
  return {
    left: `${(random() * 100).toFixed(2)}%`,
    top: `${(random() * 100).toFixed(2)}%`,
    "--s": `${size.toFixed(2)}px`,
    "--c": COLORS[Math.floor(random() * COLORS.length)],
    "--o": (0.18 + random() * 0.45).toFixed(2),
    "--dx": `${((random() - 0.5) * 22).toFixed(1)}vw`,
    "--dy": `${((random() - 0.5) * 26).toFixed(1)}vh`,
    "--t": `${Math.round(38 + random() * 52)}s`,
    "--delay": `-${Math.round(random() * 60)}s`,
  } as CSSProperties;
});

const streaks = [
  { "--y": "18%", "--r": "8deg", "--fall": "14vh", "--t": "23s", "--delay": "-4s" },
  { "--y": "56%", "--r": "-6deg", "--fall": "-10vh", "--t": "31s", "--delay": "-17s" },
  { "--y": "78%", "--r": "4deg", "--fall": "8vh", "--t": "37s", "--delay": "-29s" },
] as unknown as CSSProperties[];

/**
 * Capa ambiental fija detrás de todo el sitio. Es estática en el servidor;
 * InteractionEngine solo mueve la lente del puntero.
 */
export function Ambient() {
  return (
    <div id="ambient" className="ambient" aria-hidden="true">
      <div className="ambient__aurora ambient__aurora--a" />
      <div className="ambient__aurora ambient__aurora--b" />
      <div className="ambient__grid" />
      <div className="ambient__lens">
        <div className="ambient__lens-grid" />
      </div>
      {particles.map((style, index) => (
        <span key={index} className="ambient__particle" style={style} />
      ))}
      {streaks.map((style, index) => (
        <span key={index} className="ambient__streak" style={style} />
      ))}
    </div>
  );
}

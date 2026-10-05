import type { CSSProperties } from "react";

const streaks = [
  { "--y": "18%", "--r": "8deg", "--fall": "14vh", "--t": "23s", "--delay": "-4s" },
  { "--y": "56%", "--r": "-6deg", "--fall": "-10vh", "--t": "31s", "--delay": "-17s" },
  { "--y": "78%", "--r": "4deg", "--fall": "8vh", "--t": "37s", "--delay": "-29s" },
] as unknown as CSSProperties[];

/**
 * Capa ambiental fija detrás de todo el sitio: auroras, retícula, polvo en tres capas, estelas y la lente
 * que sigue al puntero (InteractionEngine la mueve). Todo se anima con transform/opacity y pocas animaciones.
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
      <div className="ambient__dust ambient__dust--a" />
      <div className="ambient__dust ambient__dust--b" />
      <div className="ambient__dust ambient__dust--c" />
      {streaks.map((style, index) => (
        <span key={index} className="ambient__streak" style={style} />
      ))}
    </div>
  );
}

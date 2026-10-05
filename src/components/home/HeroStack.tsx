import type { CSSProperties } from "react";
import { cubic, Packet, PacketLayer, type Point } from "@/components/motion/Packet";
import { Step } from "@/components/motion/Step";

/*
 * Visual del hero: un sistema real visto en capas (interfaz, lógica con automatización + IA, datos),
 * apiladas en 3D con CSS. Haces verticales conectan las capas y los datos suben por ellos.
 * Todo el movimiento es transform/opacity; el conjunto reacciona al puntero (data-parallax).
 */

const S = 360;
const CYCLE = 9000;

const nodes: Record<string, Point> = {
  entrada: [62, 92],
  reglas: [178, 62],
  ia: [292, 118],
  eventos: [104, 262],
  acciones: [262, 282],
};

const edges: [string, string][] = [
  ["entrada", "reglas"],
  ["reglas", "ia"],
  ["entrada", "eventos"],
  ["ia", "acciones"],
  ["eventos", "acciones"],
];

const curve = (a: Point, b: Point): Point[] => {
  const mx = (a[0] + b[0]) / 2;
  return cubic(a, [mx, a[1]], [mx, b[1]], b, 10);
};

const beams = [
  { at: nodes.entrada, delay: 0 },
  { at: nodes.ia, delay: 1.4 },
  { at: nodes.acciones, delay: 2.6 },
];

function Plane({ z, tone, label, children }: { z: number; tone: "ui" | "logic" | "data"; label: string; children: React.ReactNode }) {
  return (
    <div className={`stack__plane stack__plane--${tone}`} style={{ "--z": `${z}px` } as CSSProperties}>
      <span className="stack__label">{label}</span>
      {children}
    </div>
  );
}

function InterfacePlane() {
  return (
    <Plane z={140} tone="ui" label="Interfaz">
      <svg viewBox={`0 0 ${S} ${S}`} className="absolute inset-0 size-full" fill="none">
        <rect x="16" y="34" width="328" height="310" rx="6" className="stack__stroke" />
        <path d="M16 62H344" className="stack__stroke" />
        <path d="M84 62V344" className="stack__stroke-faint" />
        {[0, 1, 2, 3].map((row) => (
          <rect key={row} x="28" y={80 + row * 24} width={row === 1 ? 44 : 36} height="7" rx="2" className={row === 1 ? "stack__fill-signal" : "stack__fill"} />
        ))}
        <rect x="98" y="76" width="112" height="70" rx="4" className="stack__stroke" />
        <rect x="220" y="76" width="112" height="70" rx="4" className="stack__stroke" />
        <rect x="110" y="122" width="58" height="8" rx="2" className="stack__fill" />
        <rect x="232" y="122" width="40" height="8" rx="2" className="stack__fill" />
        <path d="M100 300L140 268L178 282L220 232L262 248L326 196" className="stack__line-gold" />
        <path d="M100 330H332" className="stack__stroke-faint" />
      </svg>
      <Step at={[0.08, 0.5]} fx="fade" min={0} className="stack__focus" style={{ left: 98, top: 76, width: 112, height: 70 }} />
      <Step at={[0.52, 0.94]} fx="fade" min={0} className="stack__focus" style={{ left: 220, top: 76, width: 112, height: 70 }} />
    </Plane>
  );
}

function LogicPlane() {
  return (
    <Plane z={0} tone="logic" label="Automatización + IA">
      <svg viewBox={`0 0 ${S} ${S}`} className="absolute inset-0 size-full" fill="none">
        {edges.map(([a, b]) => {
          const points = curve(nodes[a], nodes[b]);
          return <path key={a + b} d={`M${points.map((p) => p.join(" ")).join("L")}`} className="stack__stroke" />;
        })}
        {Object.entries(nodes).map(([name, [x, y]]) => (
          <g key={name}>
            <circle cx={x} cy={y} r={name === "ia" ? 15 : 9} className={name === "ia" ? "stack__node-ia" : "stack__node"} />
            <text x={x} y={y + (name === "ia" ? 34 : 26)} textAnchor="middle" className="stack__text">
              {name.toUpperCase()}
            </text>
          </g>
        ))}
      </svg>
      <span className="stack__ia-ring spin" style={{ left: nodes.ia[0], top: nodes.ia[1] }} />
      <PacketLayer>
        {edges.map(([a, b], index) => (
          <Packet
            key={a + b}
            size={[S, S]}
            tone={b === "acciones" ? "gold" : "signal"}
            route={curve(nodes[a], nodes[b])}
            at={[(index * 0.17) % 0.8, ((index * 0.17) % 0.8) + 0.2]}
          />
        ))}
      </PacketLayer>
    </Plane>
  );
}

function DataPlane() {
  const cells = Array.from({ length: 36 }, (_, index) => index);
  const lit = [7, 14, 21, 28, 9, 26, 33];
  return (
    <Plane z={-140} tone="data" label="Datos">
      <div className="stack__cells">
        {cells.map((cell) => {
          const order = lit.indexOf(cell);
          return order >= 0 ? (
            <Step key={cell} at={[order * 0.12, order * 0.12 + 0.3]} fx="fade" min={0.18} className="stack__cell stack__cell--lit" />
          ) : (
            <span key={cell} className="stack__cell" />
          );
        })}
      </div>
    </Plane>
  );
}

const legend = [
  { n: "03", name: "Interfaz", state: "render", top: "24%" },
  { n: "02", name: "Lógica + IA", state: "flujo activo", top: "47%" },
  { n: "01", name: "Datos", state: "registro", top: "70%" },
];

export function HeroStack() {
  return (
    <div className="stack" aria-hidden="true">
      <ul className="stack__legend">
        {legend.map((item) => (
          <li key={item.n} style={{ top: item.top }}>
            <span className="text-signal">{item.n}</span> {item.name}
            <span className="stack__legend-state">
              <span className="live-dot" /> {item.state}
            </span>
          </li>
        ))}
      </ul>
      <div className="stack__parallax parallax">
        <div data-live data-cycle={CYCLE} className="stack__rig">
          <div className="stack__shadow" />
          <DataPlane />
          <LogicPlane />
          <InterfacePlane />
          {beams.map(({ at: [x, y], delay }) => (
            <span key={`${x}-${y}`} className="stack__beam" style={{ "--x": `${x}px`, "--y": `${y}px`, "--delay": `${delay}s` } as CSSProperties}>
              <span className="stack__beam-pulse" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

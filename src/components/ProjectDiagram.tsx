import type { CSSProperties, ReactNode } from "react";
import type { Project } from "@/data/projects";

/*
 * Diagramas conceptuales de cada proyecto, derivados de su función real.
 * Los trazos con .draw se dibujan al entrar en pantalla; las etiquetas con .appear aparecen después.
 */

const i = (index: number) => ({ "--i": index }) as CSSProperties;

function Line({ d, index = 0, accent = false, faint = false }: { d: string; index?: number; accent?: boolean; faint?: boolean }) {
  return (
    <path
      d={d}
      pathLength={1}
      className={`draw dg-line ${accent ? "dg-accent" : ""} ${faint ? "dg-faint" : ""}`}
      style={i(index)}
    />
  );
}

function Label({ x, y, children, strong = false, index = 0, anchor = "start" }: { x: number; y: number; children: ReactNode; strong?: boolean; index?: number; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className={`appear dg-label ${strong ? "dg-label-strong" : ""}`} style={i(index)}>
      {children}
    </text>
  );
}

const box = (x: number, y: number, w: number, h: number) => `M${x} ${y}H${x + w}V${y + h}H${x}Z`;
const arrow = (x1: number, y1: number, x2: number, y2: number) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const a1 = angle + Math.PI * 0.85;
  const a2 = angle - Math.PI * 0.85;
  return `M${x1} ${y1}L${x2} ${y2}M${x2 + 7 * Math.cos(a1)} ${y2 + 7 * Math.sin(a1)}L${x2} ${y2}L${x2 + 7 * Math.cos(a2)} ${y2 + 7 * Math.sin(a2)}`;
};

function Aplomo() {
  const zones = [
    { x: 60, y: 66, w: 210, h: 118, name: "ZONA A" },
    { x: 290, y: 66, w: 290, h: 118, name: "ZONA B" },
    { x: 60, y: 204, w: 210, h: 118, name: "ZONA C" },
    { x: 290, y: 204, w: 170, h: 118, name: "ZONA D" },
  ];
  return (
    <>
      {["A", "B", "C", "D", "E", "F", "G"].map((col, index) => (
        <g key={col}>
          <path d={`M${80 + index * 80} 38V46`} className="dg-line dg-faint" />
          <Label x={80 + index * 80} y={30} anchor="middle" index={index}>
            {col}
          </Label>
        </g>
      ))}
      <Line d={box(40, 46, 560, 296)} />
      {zones.map((zone, zi) => (
        <g key={zone.name}>
          <Line d={box(zone.x, zone.y, zone.w, zone.h)} index={zi + 1} faint />
          {Array.from({ length: 3 }, (_, row) =>
            Array.from({ length: Math.floor((zone.w - 24) / 30) }, (_, col) => (
              <rect key={`${row}-${col}`} x={zone.x + 14 + col * 30} y={zone.y + 34 + row * 26} width="22" height="14" className="dg-fill" />
            )),
          )}
          <Label x={zone.x + 12} y={zone.y + 22} index={zi}>
            {zone.name}
          </Label>
        </g>
      ))}
      <path d="M480 342h100" className="dg-gap" />
      <Line d="M530 380V194H280V125H392" index={6} accent />
      <circle cx="392" cy="125" r="13" className="appear dg-ring" style={i(8)} />
      <circle cx="392" cy="125" r="5.5" className="appear dg-dot" style={i(8)} />
      <Label x={412} y={121} strong index={9}>
        B-07
      </Label>
      <Label x={412} y={139} index={9}>
        UBICADO
      </Label>
      <Label x={538} y={372} index={7}>
        ACCESO
      </Label>
    </>
  );
}

function Atenor() {
  const sources = [70, 170, 270];
  const targets = [
    { y: 92, label: "ATENCIÓN" },
    { y: 192, label: "CLIENTES" },
    { y: 292, label: "OPERACIÓN" },
  ];
  return (
    <>
      {sources.map((y, index) => (
        <g key={y}>
          <Line d={`M14 ${y}H150V${y + 44}H44L28 ${y + 58}V${y + 44}H14Z`} index={index} />
          <Label x={26} y={y + 27} index={index}>
            {`NEGOCIO 0${index + 1}`}
          </Label>
          <Line d={`M150 ${y + 22}C180 ${y + 22} 170 200 205 200`} index={index + 2} faint />
        </g>
      ))}
      <Line d={box(205, 172, 110, 56)} index={4} />
      <Label x={260} y={205} anchor="middle" strong index={5}>
        WHATSAPP
      </Label>
      <Line d={arrow(315, 200, 360, 200)} index={5} />
      <Line d={box(362, 150, 120, 100)} index={6} accent />
      <Label x={422} y={194} anchor="middle" strong index={7}>
        AUTOMAT.
      </Label>
      <Label x={422} y={214} anchor="middle" strong index={7}>
        + IA
      </Label>
      {targets.map((target, index) => (
        <g key={target.label}>
          <Line d={`M482 200C505 200 500 ${target.y + 20} ${520} ${target.y + 20}`} index={8 + index} faint />
          <Line d={box(520, target.y, 112, 40)} index={8 + index} />
          <Label x={576} y={target.y + 25} anchor="middle" index={9 + index}>
            {target.label}
          </Label>
        </g>
      ))}
      <Label x={24} y={386} index={10}>
        ENTRADA
      </Label>
      <Label x={422} y={386} anchor="middle" index={10}>
        PROCESAMIENTO
      </Label>
      <Label x={632} y={386} anchor="end" index={10}>
        ACCIÓN
      </Label>
    </>
  );
}

function Careertrackly() {
  const nodes = [110, 220, 330];
  return (
    <>
      <Line d="M30 290H420" index={0} />
      <Line d={arrow(400, 290, 422, 290)} index={0} />
      <Label x={30} y={322} index={1}>
        TRAYECTORIA
      </Label>
      {nodes.map((x, index) => (
        <g key={x}>
          <Line d={box(x - 44, 150, 88, 64)} index={index + 1} />
          <Label x={x} y={176} anchor="middle" strong index={index + 2}>
            PROYECTO
          </Label>
          <Label x={x} y={202} anchor="middle" index={index + 2}>
            {`0${index + 1}`}
          </Label>
          <Line d={`M${x} 214V283`} index={index + 2} faint />
          <circle cx={x} cy="290" r="6" className="appear dg-dot-light" style={i(index + 2)} />
          <path d={`M${x - 8} 340h12l4 4v18h-16z`} className="appear dg-line" style={i(index + 3)} />
        </g>
      ))}
      <Label x={130} y={384} index={5}>
        EVIDENCIA
      </Label>
      <Line d="M422 290C470 290 470 250 470 236" index={5} accent />
      <Line d={box(452, 42, 160, 196)} index={6} />
      <circle cx="490" cy="82" r="18" className="appear dg-line" style={i(7)} />
      <path d="M520 74H590M520 88H572M470 122H594M470 136H580M470 150H588" className="appear dg-line dg-faint" style={i(7)} />
      {[0, 1, 2].map((index) => (
        <path key={index} d={box(470 + index * 42, 170, 34, 30)} className="appear dg-line" style={i(8)} />
      ))}
      <Label x={532} y={226} anchor="middle" strong index={8}>
        PORTFOLIO
      </Label>
      <path d={box(530, 252, 92, 24)} className="appear dg-stamp" style={i(9)} />
      <Label x={576} y={268} anchor="middle" index={9}>
        PUBLICADO
      </Label>
    </>
  );
}

function SalvaOps() {
  return (
    <>
      <path d={box(20, 40, 400, 200)} className="appear dg-line dg-dashed" style={i(0)} />
      <Label x={34} y={64} index={0}>
        PROYECTO A
      </Label>
      <Line d={box(44, 112, 104, 56)} index={1} />
      <Label x={96} y={145} anchor="middle" strong index={2}>
        AGENTE
      </Label>
      <Line d={arrow(148, 140, 200, 140)} index={2} />
      <Line d={box(202, 98, 124, 84)} index={3} accent />
      <Label x={264} y={136} anchor="middle" strong index={4}>
        BROKER
      </Label>
      <Label x={264} y={156} anchor="middle" index={4}>
        ORQUESTA
      </Label>
      <Line d={arrow(326, 124, 456, 92)} index={4} />
      <Line d={arrow(326, 156, 456, 176)} index={4} />
      <Line d={box(458, 66, 160, 52)} index={5} />
      <Label x={538} y={97} anchor="middle" index={6}>
        PROVEEDOR IA 1
      </Label>
      <Line d={box(458, 150, 160, 52)} index={5} />
      <Label x={538} y={181} anchor="middle" index={6}>
        PROVEEDOR IA 2
      </Label>
      <path d={box(20, 262, 230, 110)} className="appear dg-line dg-dashed" style={i(6)} />
      <Label x={34} y={286} index={6}>
        PROYECTO B
      </Label>
      <path d={box(44, 302, 104, 48)} className="appear dg-line dg-faint" style={i(7)} />
      <Label x={96} y={331} anchor="middle" index={7}>
        AGENTE
      </Label>
      <Line d="M264 182V300H300" index={7} accent />
      <Line d={box(300, 262, 318, 110)} index={8} />
      <Label x={316} y={288} strong index={9}>
        EVIDENCIA
      </Label>
      {["OPERACIÓN 01", "OPERACIÓN 02", "OPERACIÓN 03"].map((op, index) => (
        <g key={op}>
          <path d={`M318 ${308 + index * 22}l4 4 8-8`} className="appear dg-line dg-accent" style={i(10 + index)} />
          <Label x={340} y={313 + index * 22} index={10 + index}>
            {op}
          </Label>
        </g>
      ))}
    </>
  );
}

function Caps() {
  const cap = (x: number, y: number, s: number) =>
    `M${x - 16 * s} ${y}C${x - 16 * s} ${y - 20 * s} ${x + 16 * s} ${y - 20 * s} ${x + 16 * s} ${y}Z M${x + 16 * s} ${y}H${x + 28 * s}`;
  return (
    <>
      {Array.from({ length: 6 }, (_, index) => {
        const x = 40 + (index % 2) * 76;
        const y = 70 + Math.floor(index / 2) * 82;
        return (
          <g key={index}>
            <Line d={box(x, y, 64, 70)} index={index * 0.3} faint />
            <path d={cap(x + 30, y + 44, 0.9)} className="appear dg-line" style={i(index * 0.3)} />
          </g>
        );
      })}
      <Label x={40} y={340} index={2}>
        CATÁLOGO
      </Label>
      <Line d={arrow(192, 190, 238, 190)} index={2} />
      <Line d={box(242, 70, 164, 246)} index={3} />
      <path d={cap(318, 168, 2.2)} className="appear dg-line" style={i(4)} />
      <path d="M262 214H386M262 230H350" className="appear dg-line dg-faint" style={i(4)} />
      <path d={box(262, 262, 124, 30)} className="appear dg-line dg-accent" style={i(5)} />
      <Label x={242} y={340} index={4}>
        PRODUCTO
      </Label>
      <Line d={arrow(406, 190, 452, 190)} index={5} accent />
      <Label x={429} y={176} anchor="middle" index={6}>
        AUTO
      </Label>
      <Line d="M456 100H616V280L602 272L588 280L574 272L560 280L546 272L532 280L518 272L504 280L490 272L476 280L456 272Z" index={6} />
      <path d="M476 130H596M476 150H560M476 170H586M476 190H540" className="appear dg-line dg-faint" style={i(7)} />
      <circle cx="586" cy="236" r="14" className="appear dg-line dg-accent" style={i(8)} />
      <path d="M579 236l5 5 9-10" className="appear dg-line dg-accent" style={i(8)} />
      <Label x={456} y={340} index={7}>
        PEDIDO
      </Label>
      <Line d="M40 364H406" index={8} faint />
      <Label x={40} y={388} index={9}>
        EXPERIENCIA WEB
      </Label>
    </>
  );
}

function Archivo() {
  const layers = [
    { x: 40, y: 100, label: "DOCUMENTO" },
    { x: 66, y: 74, label: "HISTORIA" },
    { x: 92, y: 48, label: "COLECCIÓN" },
  ];
  const nodes = [
    { x: 420, y: 90, label: "CONTENIDO" },
    { x: 510, y: 170, label: "HISTORIAS" },
    { x: 430, y: 270, label: "CONOCIMIENTO" },
  ];
  return (
    <>
      {layers.map((layer, index) => (
        <g key={layer.label}>
          <path d={box(layer.x, layer.y, 200, 230)} className="appear dg-paper" style={i(index)} />
          <Line d={box(layer.x, layer.y, 200, 230)} index={index} />
          <Label x={layer.x + 12} y={index === 2 ? layer.y + 20 : layer.y + 222} index={index + 1}>
            {layer.label}
          </Label>
        </g>
      ))}
      <path d="M104 100H272M104 116H250M104 132H262M104 148H230" className="appear dg-line dg-faint" style={i(3)} />
      {nodes.map((node, index) => (
        <g key={node.label}>
          <Line d={`M292 ${150 + index * 40}C350 ${150 + index * 40} ${node.x - 60} ${node.y} ${node.x - 8} ${node.y}`} index={4 + index} accent={index === 1} />
          <circle cx={node.x} cy={node.y} r="7" className="appear dg-dot-light" style={i(5 + index)} />
          <Label x={node.x + 16} y={node.y + 5} strong index={6 + index}>
            {node.label}
          </Label>
        </g>
      ))}
      <Line d={`M${nodes[0].x} ${nodes[0].y + 8}L${nodes[2].x} ${nodes[2].y - 8}M${nodes[0].x + 7} ${nodes[0].y + 4}L${nodes[1].x - 6} ${nodes[1].y - 4}`} index={8} faint />
      <Line d={box(40, 344, 584, 34)} index={9} faint />
      <Label x={56} y={366} index={10}>
        ORGANIZAR · PRESENTAR · PRESERVAR
      </Label>
    </>
  );
}

const diagrams: Record<Project["id"], () => React.JSX.Element> = {
  aplomo: Aplomo,
  atenor: Atenor,
  careertrackly: Careertrackly,
  salvaops: SalvaOps,
  "salva-exclusive-caps": Caps,
  archivo: Archivo,
};

export function ProjectDiagram({ id, title }: { id: Project["id"]; title: string }) {
  const Diagram = diagrams[id];
  return (
    <svg viewBox="0 0 640 400" className="dg block h-auto w-full" role="img" aria-label={title} fill="none">
      <Diagram />
    </svg>
  );
}

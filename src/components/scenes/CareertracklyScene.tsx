import type { CSSProperties } from "react";
import { cubic, Packet, PacketLayer, type Point } from "@/components/motion/Packet";
import { Reveal } from "@/components/motion/Reveal";
import { Step } from "@/components/motion/Step";
import { EVIDENCE, EvidenceIcon, type Evidence } from "@/components/scenes/careertrackly/EvidenceIcon";
import { Portfolio3D } from "@/components/scenes/careertrackly/Portfolio3D";
import s from "@/components/scenes/CareertracklyScene.module.css";

/*
 * Careertrackly · constructor de portfolio.
 * Un lienzo con dos sistemas de coordenadas: ancho (1000×520, tablet y desktop) y alto (400×880, mobile).
 * Cada pieza lleva sus dos posiciones como variables CSS y una container query elige cuál usar;
 * las medidas van en --u (una unidad del lienzo), así todo escala como un SVG pero sigue siendo HTML
 * y puede vivir en 3D. Los paquetes tienen una capa por sistema de coordenadas.
 *
 * Ciclo: etapas de la trayectoria → proyectos que se enganchan → evidencia que vuela a cada proyecto →
 * la trayectoria y los proyectos alimentan el portfolio 3D → se ensambla, se publica y baja a Descubrir.
 */

const CYCLE = 16000;
const END = 0.94;
const WIDE: [number, number] = [1000, 520];
const TALL: [number, number] = [400, 880];

/** Fracciones del ciclo. */
const T = {
  stages: [0.03, 0.08, 0.13],
  projects: [0.19, 0.24, 0.29],
  /** Salida de cada evidencia; llega FLIGHT después. */
  evidence: [0.34, 0.39, 0.44],
  plate: 0.5,
  header: 0.53,
  trajectoryFlow: [0.51, 0.575] as [number, number],
  sections: 0.565,
  projectsFlow: [0.55, 0.615] as [number, number],
  thumbs: 0.605,
  stamp: 0.67,
  floor: 0.71,
  /** El portfolio termina de bajar a su celda de Descubrir. */
  landed: 0.79,
};
const FLIGHT = 0.05;

type Box = readonly [x: number, y: number, w?: number, h?: number];

/** Posición en los dos sistemas de coordenadas (ancho y alto) como variables CSS. */
function place(wide: Box, tall: Box, extra: Record<string, number> = {}): CSSProperties {
  const style: Record<string, number> = { ...extra };
  const keys = [
    ["--x", "--y", "--w", "--h"],
    ["--mx", "--my", "--mw", "--mh"],
  ];
  [wide, tall].forEach((box, layout) =>
    box.forEach((value, index) => {
      if (value !== undefined) style[keys[layout][index]] = value;
    }),
  );
  return style as CSSProperties;
}

/* ───────── Geometría ───────── */

const W = {
  cardX: [150, 318, 486],
  cardY: 152,
  cardW: 154,
  cardH: 138,
  trackY: 372,
  trackX: [150, 640] as const,
  tileY: 38,
  tileH: 66,
};

const M = {
  nodeY: [176, 306, 436],
  trackX: 30,
  trackY: [150, 560] as const,
  cardX: 46,
  cardW: 334,
  cardH: 88,
  tileX: [20, 143, 266],
  tileY: 40,
  tileW: 114,
  tileH: 60,
};

const nodeX = W.cardX.map((x) => x + W.cardW / 2);
const tallCardY = M.nodeY.map((y) => y + 18);

/** Centro de la ranura de evidencia dentro de una tarjeta (esquina superior derecha). */
const SLOT = { pad: 10, size: 20, gap: 4 };
function slotCenter(x: number, y: number, w: number, kind: Evidence): Point {
  const index = EVIDENCE.indexOf(kind);
  return [x + w - SLOT.pad - (2 - index) * (SLOT.size + SLOT.gap) - SLOT.size / 2, y + SLOT.pad + SLOT.size / 2];
}

/** Puntos de llegada en el portfolio 3D (proyección medida de las capas). */
const DOCK = {
  wide: { sections: [824, 240] as Point, thumbs: [858, 217] as Point },
  tall: { sections: [195, 688] as Point, thumbs: [225, 668] as Point },
};

/* ───────── Contenido ───────── */

const stages = [
  { n: "Etapa 01", name: "Formación" },
  { n: "Etapa 02", name: "Proyecto" },
  { n: "Etapa 03", name: "Rol actual" },
];

const projects: { id: string; title: string; evidence: Evidence }[] = [
  { id: "P-01", title: "Proyecto final", evidence: "img" },
  { id: "P-02", title: "Proyecto propio", evidence: "repo" },
  { id: "P-03", title: "Proyecto actual", evidence: "doc" },
];

const files: Record<Evidence, { name: string; id: string }> = {
  doc: { name: "Documento", id: "EV-01" },
  img: { name: "Imagen", id: "EV-02" },
  repo: { name: "Repositorio", id: "EV-03" },
};

const log: { at: number; tone: "signal" | "bone" | "cool" | "gold"; event: string; detail: string }[] = [
  { at: 0.03, tone: "signal", event: "Etapa añadida", detail: "Etapa 01 · Formación" },
  { at: 0.08, tone: "signal", event: "Etapa añadida", detail: "Etapa 02 · Proyecto" },
  { at: 0.13, tone: "signal", event: "Etapa añadida", detail: "Etapa 03 · Rol actual" },
  { at: 0.19, tone: "bone", event: "Proyecto vinculado", detail: "P-01 → Etapa 01" },
  { at: 0.24, tone: "bone", event: "Proyecto vinculado", detail: "P-02 → Etapa 02" },
  { at: 0.29, tone: "bone", event: "Proyecto vinculado", detail: "P-03 → Etapa 03" },
  { at: 0.39, tone: "cool", event: "Evidencia adjunta", detail: "Imagen → P-01" },
  { at: 0.44, tone: "cool", event: "Evidencia adjunta", detail: "Repositorio → P-02" },
  { at: 0.49, tone: "cool", event: "Evidencia adjunta", detail: "Documento → P-03" },
  { at: 0.63, tone: "gold", event: "Portfolio ensamblado", detail: "Etapas, proyectos y evidencia" },
  { at: 0.67, tone: "gold", event: "Portfolio publicado", detail: "Visibilidad pública" },
  { at: 0.8, tone: "signal", event: "Visible en Descubrir", detail: "Junto a otros perfiles publicados" },
];

const clock = (at: number) => {
  const seconds = at * (CYCLE / 1000);
  return `00:${seconds.toFixed(1).padStart(4, "0")}`;
};

/* ───────── Rutas de los paquetes ───────── */

const tileIcon = {
  wide: (kind: Evidence): Point => [W.cardX[EVIDENCE.indexOf(kind)] + 23, W.tileY + W.tileH / 2],
  tall: (kind: Evidence): Point => [M.tileX[EVIDENCE.indexOf(kind)] + M.tileW / 2, M.tileY + 20],
};

function evidenceRoute(layout: "wide" | "tall", index: number): Point[] {
  const kind = projects[index].evidence;
  const from = tileIcon[layout](kind);
  if (layout === "wide") {
    const to = slotCenter(W.cardX[index], W.cardY, W.cardW, kind);
    return cubic(from, [from[0], from[1] + 58], [to[0], to[1] - 52], to, 14);
  }
  // Mobile: pasillos libres (entre etiquetas y por el margen derecho) para no cruzar texto.
  const to = slotCenter(M.cardX, tallCardY[index], M.cardW, kind);
  if (index === 0) return [...cubic(from, [194, 92], [190, 112], [190, 140], 6), ...cubic([190, 140], [196, 188], [to[0], 168], to, 10).slice(1)];
  if (index === 1) return cubic(from, [394, from[1] + 40], [394, to[1] - 60], to, 14);
  return [
    ...cubic(from, [from[0], 98], [100, 106], [140, 106], 6),
    [360, 106],
    ...cubic([360, 106], [392, 106], [392, 130], [392, 160], 6).slice(1),
    [392, 420],
    ...cubic([392, 420], [392, 462], [346, to[1]], to, 8).slice(1),
  ];
}

const flows = {
  wide: {
    trajectory: [[W.trackX[0], W.trackY] as Point, ...cubic([W.trackX[1], W.trackY], [710, W.trackY], [760, 262], DOCK.wide.sections, 12)],
    projects: cubic([W.trackX[1], W.cardY + W.cardH / 2], [716, W.cardY + W.cardH / 2], [800, 160], DOCK.wide.thumbs, 12),
  },
  tall: {
    trajectory: [[M.trackX, M.trackY[0]] as Point, ...cubic([M.trackX, M.trackY[1]], [M.trackX, 640], [110, 696], DOCK.tall.sections, 12)],
    projects: cubic([M.cardX + M.cardW / 2, tallCardY[2] + M.cardH], [M.cardX + M.cardW / 2, 610], [270, 620], DOCK.tall.thumbs, 10),
  },
};

function Packets({ layout }: { layout: "wide" | "tall" }) {
  const size = layout === "wide" ? WIDE : TALL;
  return (
    <PacketLayer className={layout === "wide" ? s.wideOnly : s.tallOnly}>
      {projects.map((project, index) => {
        const start = T.evidence[index];
        return (
          <Packet
            key={project.id}
            size={size}
            route={evidenceRoute(layout, index)}
            at={[start, END]}
            hold={1 - FLIGHT / (END - start)}
            className={`${s.ev} ${s[`ev-${project.evidence}`]}`}
          />
        );
      })}
      <Packet size={size} route={flows[layout].trajectory} at={T.trajectoryFlow} hold={0.12} tone="signal" />
      <Packet size={size} route={flows[layout].projects} at={T.projectsFlow} hold={0.12} tone="gold" />
    </PacketLayer>
  );
}

/* ───────── Piezas del lienzo ───────── */

function Tracks() {
  const ticks = Array.from({ length: 21 }, (_, index) => W.trackX[0] + index * 24.5);
  return (
    <>
      <svg viewBox={`0 0 ${WIDE[0]} ${WIDE[1]}`} className={`${s.svg} ${s.wideOnly}`} fill="none" aria-hidden="true">
        <path d="M650 22V498" className={s.divider} />
        <path d="M20 128H636M20 456H636" className={s.rule} />
        {ticks.map((x) => (
          <path key={x} d={`M${x} ${W.trackY - 3}v6`} className={s.tick} />
        ))}
        <path d={`M${W.trackX[0]} ${W.trackY}H${W.trackX[1]}`} pathLength={1} className={`draw ${s.track}`} />
        <path d={`M${W.trackX[1]} ${W.trackY}C700 ${W.trackY} 732 344 762 322`} className={s.export} />
        <path d={`M${W.trackX[1] - 8} ${W.trackY - 5}l8 5-8 5`} className={s.track} />
      </svg>
      <svg viewBox={`0 0 ${TALL[0]} ${TALL[1]}`} className={`${s.svg} ${s.tallOnly}`} fill="none" aria-hidden="true">
        <path d="M20 108H380M20 576H380" className={s.rule} />
        <path d={`M${M.trackX} ${M.trackY[0]}V${M.trackY[1]}`} pathLength={1} className={`draw ${s.track}`} />
        <path d={`M${M.trackX} ${M.trackY[1]}C${M.trackX} 640 80 682 130 696`} className={s.export} />
      </svg>
    </>
  );
}

function Lane({ n, name, wide, tall }: { n: string; name: string; wide: Box; tall: Box }) {
  return (
    <div className={`${s.at} ${s.lane}`} style={place(wide, tall)}>
      <span className={s.laneN}>{n}</span>
      <span>{name}</span>
    </div>
  );
}

function Tray() {
  return EVIDENCE.map((kind, index) => (
    <div key={kind} className={`${s.at} ${s.tile}`} style={place([W.cardX[index], W.tileY, W.cardW, W.tileH], [M.tileX[index], M.tileY, M.tileW, M.tileH])}>
      <EvidenceIcon kind={kind} className={s.tileIcon} />
      <span className={s.tileText}>
        <span className={s.tileName}>{files[kind].name}</span>
        <span className={s.tileMeta}>{files[kind].id}</span>
      </span>
    </div>
  ));
}

function Milestones() {
  return stages.map((stage, index) => {
    const wideGap = nodeX[index] - (index === 0 ? W.trackX[0] : nodeX[index - 1]);
    const tallGap = M.nodeY[index] - (index === 0 ? M.trackY[0] : M.nodeY[index - 1]);
    return (
      <Step
        key={stage.n}
        at={[T.stages[index], END]}
        fx="left"
        className={`${s.at} ${s.milestone}`}
        style={place([nodeX[index], W.trackY], [M.trackX, M.nodeY[index]], { "--sw": wideGap, "--sh": tallGap })}
      >
        <i className={s.segment} />
        <i className={s.node} />
        <span className={s.nodeLabel}>
          <span className={s.nodeN}>{stage.n}</span>
          <span className={s.nodeName}>{stage.name}</span>
        </span>
      </Step>
    );
  });
}

function Cards() {
  return projects.map((project, index) => (
    <Step
      key={project.id}
      at={[T.projects[index], END]}
      fx="down"
      className={`${s.at} ${s.card}`}
      style={place([W.cardX[index], W.cardY, W.cardW, W.cardH], [M.cardX, tallCardY[index], M.cardW, M.cardH], {
        "--cl": W.trackY - (W.cardY + W.cardH),
      })}
    >
      <span className={s.cardId}>{project.id}</span>
      <span className={s.slots}>
        {EVIDENCE.map((kind) => (
          <span key={kind} className={`${s.slot} ${kind === project.evidence ? s.slotTarget : ""}`}>
            <EvidenceIcon kind={kind} className={s.slotIcon} />
            {kind === project.evidence && (
              <span className={`${s.slotFilled} ${s.staticOnly}`}>
                <EvidenceIcon kind={kind} className={s.slotIcon} />
              </span>
            )}
          </span>
        ))}
      </span>
      <span className={s.cardTitle}>{project.title}</span>
      <span className={s.cardBars}>
        <i />
        <i />
      </span>
      <span className={s.cardFoot}>→ {stages[index].n}</span>
      <i className={s.connector} />
      <i className={s.snap} />
    </Step>
  ));
}

function Stage() {
  return (
    <>
      <Lane n="04" name="Portfolio" wide={[672, 26]} tall={[20, 592]} />
      <div className={`${s.at} ${s.status}`} style={place([980, 24], [380, 588])}>
        <span className={s.chip}>
          <i className={s.chipDot} />
          Borrador
        </span>
        <Step at={[T.stamp, END]} fx="fade" className={`${s.chip} ${s.chipOn}`}>
          <i className={s.chipDot} />
          Publicado
        </Step>
      </div>
      <Portfolio3D
        times={{ plate: T.plate, header: T.header, sections: T.sections, thumbs: T.thumbs, stamp: T.stamp, floor: T.floor, landed: T.landed }}
        end={END}
        style={place([830, 322], [200, 762])}
      />
      <div className={`${s.at} ${s.floorLabel}`} style={place([980, 478], [380, 862])}>
        Descubrir · perfiles publicados
      </div>
    </>
  );
}

/** Resumen del flujo bajo el constructor (solo en el diseño ancho). */
function Flow() {
  const steps: [string, string][] = [
    ["Trayectoria", "signal"],
    ["Proyectos", "bone"],
    ["Evidencia", "cool"],
    ["Portfolio", "gold"],
    ["Descubrir", "signal"],
  ];
  return (
    <div className={`${s.at} ${s.flow}`} style={place([150, 474], [0, 0])}>
      <span className={s.flowLabel}>Flujo</span>
      {steps.map(([name, tone], index) => (
        <span key={name} className={s.flowStep} data-tone={tone}>
          {index > 0 && <span className={s.flowArrow}>→</span>}
          <i />
          {name}
        </span>
      ))}
    </div>
  );
}

function Log() {
  return (
    <aside className={s.log}>
      <div className={s.logHead}>
        <span>Registro de eventos</span>
        <span className={s.logLive}>
          <i />
          en vivo
        </span>
      </div>
      <ol className={s.logList}>
        {log.map((entry) => (
          <Step as="li" key={entry.at} at={[entry.at, END]} fx="up" className={s.logItem} data-tone={entry.tone}>
            <span className={s.logEvent}>{entry.event}</span>
            <span className={s.logTime}>{clock(entry.at)}</span>
            <span className={s.logDetail}>{entry.detail}</span>
          </Step>
        ))}
      </ol>
    </aside>
  );
}

/** Simulación principal del case study (ocupa el ancho del visor). */
export function CareertracklyScene() {
  return (
    <div data-live data-cycle={CYCLE} aria-hidden="true" className={s.scene}>
      <div className={s.layout}>
        <Reveal variant="group" className={s.canvas}>
          <div className={s.grid} />
          <Tracks />
          <Lane n="03" name="Evidencia" wide={[20, 56]} tall={[20, 16]} />
          <Lane n="02" name="Proyectos" wide={[20, 207]} tall={[214, 120]} />
          <Lane n="01" name="Trayectoria" wide={[20, 357]} tall={[20, 120]} />
          <Flow />
          <Tray />
          <Milestones />
          <Cards />
          <Stage />
          <Packets layout="wide" />
          <Packets layout="tall" />
        </Reveal>
        <Log />
      </div>
    </div>
  );
}

/* ───────── Vista previa ───────── */

const PREVIEW_CYCLE = 10000;
const P = {
  cards: [0.04, 0.12, 0.2],
  plate: 0.27,
  header: 0.3,
  trajectoryFlow: [0.28, 0.38] as [number, number],
  sections: 0.375,
  projectsFlow: [0.34, 0.44] as [number, number],
  thumbs: 0.435,
  stamp: 0.58,
  discover: 0.66,
};
const PV = { cardX: [36, 148, 260], cardY: 92, cardW: 100, cardH: 110, trackY: 284, trackX: [36, 384] as const };
const PV_DOCK = { sections: [519, 162] as Point, thumbs: [547, 145] as Point };

/** Vista previa compacta: la trayectoria alimenta un portfolio que se publica. */
export function CareertracklyPreview() {
  const at = (x: number, y: number, w?: number, h?: number) => ({ "--x": x, "--y": y, "--w": w, "--h": h }) as CSSProperties;
  return (
    <div data-live data-cycle={PREVIEW_CYCLE} aria-hidden="true" className={s.preview}>
      <div className={s.previewCanvas}>
        <div className={s.grid} />
        <svg viewBox="0 0 640 400" className={s.svg} fill="none" aria-hidden="true">
          <path d={`M${PV.trackX[0]} ${PV.trackY}H${PV.trackX[1]}`} className={s.track} />
          <path d={`M${PV.trackX[1]} ${PV.trackY}C430 ${PV.trackY} 450 250 474 236`} className={s.export} />
          <path d="M408 40V360" className={s.divider} />
        </svg>
        <div className={`${s.pAt} ${s.lane} ${s.pLane}`} style={at(36, 36)}>
          <span className={s.laneN}>01</span>
          <span>Trayectoria</span>
        </div>
        <div className={`${s.pAt} ${s.lane} ${s.pLane}`} style={at(432, 36)}>
          <span className={s.laneN}>04</span>
          <span>Portfolio</span>
        </div>
        {PV.cardX.map((x, index) => (
          <Step
            key={x}
            at={[P.cards[index], 0.94]}
            fx="down"
            className={`${s.pAt} ${s.pCard}`}
            style={{ ...at(x, PV.cardY, PV.cardW, PV.cardH), "--cl": PV.trackY - PV.cardY - PV.cardH } as CSSProperties}
          >
            <span className={s.cardId}>{projects[index].id}</span>
            <span className={s.cardBars}>
              <i />
              <i />
            </span>
            <EvidenceIcon kind={projects[index].evidence} className={s.pCardIcon} />
            <i className={s.connector} />
            <i className={s.pNode} />
            <span className={s.pNodeLabel}>{stages[index].n}</span>
          </Step>
        ))}
        <Portfolio3D times={{ plate: P.plate, header: P.header, sections: P.sections, thumbs: P.thumbs }} end={0.94} preview style={at(524, 206)} />
        <Step at={[P.stamp, 0.94]} fx="pop" className={`${s.pAt} ${s.pStamp}`} style={at(566, 86)}>
          Publicado
        </Step>
        <Step at={[P.discover, 0.94]} fx="up" className={`${s.pAt} ${s.pDiscover}`} style={at(432, 312)}>
          <span className={s.pDiscoverLabel}>Descubrir</span>
          <span className={s.pDiscoverRow}>
            {[0, 1, 2, 3].map((index) => (
              <i key={index} className={index === 1 ? s.pDiscoverOwn : ""} />
            ))}
          </span>
        </Step>
        <PacketLayer>
          <Packet route={[[PV.trackX[0], PV.trackY], ...cubic([PV.trackX[1], PV.trackY], [440, PV.trackY], [470, 220], PV_DOCK.sections, 10)]} at={P.trajectoryFlow} hold={0.15} tone="signal" />
          <Packet
            route={cubic([PV.cardX[2] + PV.cardW, PV.cardY + 30], [420, PV.cardY + 30], [470, 150], PV_DOCK.thumbs, 10)}
            at={P.projectsFlow}
            hold={0.15}
            tone="gold"
          />
        </PacketLayer>
      </div>
    </div>
  );
}

import type { CSSProperties, ReactNode } from "react";
import { Packet, PacketLayer, type Point } from "@/components/motion/Packet";
import { Step } from "@/components/motion/Step";
import { OUT, T } from "@/components/scenes/archivo/timeline";
import styles from "@/components/scenes/ArchivoScene.module.css";

/*
 * Grafo de conocimiento: el índice alimenta Contenido, Historias y Conocimiento, cada uno con subnodos.
 * La base es estática y tenue; cada grupo se ilumina con un Step (solo opacidad) cuando la pila
 * termina el paso correspondiente. Los rótulos van en HTML para mantener su tamaño en cualquier ancho.
 */

const W = 480;
const H = 460;

type Key = "contenido" | "historias" | "conocimiento";

const INDEX: Point = [16, 230];

const MAIN: Record<Key, { p: Point; label: string; side: "mainBelow" | "right" }> = {
  contenido: { p: [132, 170], label: "Contenido", side: "mainBelow" },
  historias: { p: [356, 150], label: "Historias", side: "mainBelow" },
  conocimiento: { p: [246, 320], label: "Conocimiento", side: "right" },
};

type Sub = { p: Point; label: string; side: "above" | "below"; lit?: boolean; value?: string; badge?: string };

const SUBS: Record<Key, Sub[]> = {
  contenido: [
    { p: [52, 88], label: "Fotografía", side: "above" },
    { p: [140, 62], label: "Carta", side: "above", lit: true, badge: "D-0418" },
    { p: [222, 94], label: "Audio", side: "above" },
  ],
  historias: [
    { p: [318, 62], label: "Relato", side: "above", lit: true, badge: "H-112" },
    { p: [420, 86], label: "Entrevista", side: "above" },
  ],
  conocimiento: [
    { p: [150, 388], label: "Época", side: "below", lit: true, value: "1962" },
    { p: [250, 400], label: "Lugar", side: "below", lit: true, value: "Oaxaca" },
    { p: [350, 388], label: "Tema", side: "below", lit: true, value: "Oficios" },
  ],
};

type Edge = { from: Point; c1: Point; c2: Point; to: Point };

const EDGES = {
  indexContenido: { from: INDEX, c1: [72, 230], c2: [78, 170], to: MAIN.contenido.p },
  indexConocimiento: { from: INDEX, c1: [112, 230], c2: [150, 320], to: MAIN.conocimiento.p },
  contenidoHistorias: { from: MAIN.contenido.p, c1: [230, 170], c2: [280, 118], to: MAIN.historias.p },
  // Sale casi en horizontal hacia la izquierda para no cruzar el rótulo de Historias.
  historiasConocimiento: { from: MAIN.historias.p, c1: [270, 168], c2: [246, 236], to: MAIN.conocimiento.p },
  contenidoConocimiento: { from: MAIN.contenido.p, c1: [132, 252], c2: [196, 262], to: MAIN.conocimiento.p },
} satisfies Record<string, Edge>;

const d = ({ from, c1, c2, to }: Edge) => `M${from}C${c1} ${c2} ${to}`;

const sample = ({ from, c1, c2, to }: Edge, steps = 12): Point[] =>
  Array.from({ length: steps + 1 }, (_, step) => {
    const t = step / steps;
    const u = 1 - t;
    return [0, 1].map((axis) => u * u * u * from[axis] + 3 * u * u * t * c1[axis] + 3 * u * t * t * c2[axis] + t * t * t * to[axis]) as Point;
  });

const pos = ([x, y]: Point): CSSProperties => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` });

/** Rótulo HTML anclado a un nodo; el desplazamiento va en px para no depender de la escala del grafo. */
function Tag({ at, side, className, children }: { at: Point; side: "above" | "below" | "mainBelow" | "right" | "index"; className: string; children: ReactNode }) {
  return (
    <span className={`${styles.gLabel} ${styles[`gLabel_${side}`]} ${className}`} style={pos(at)}>
      {children}
    </span>
  );
}

function MainNode({ p, lit = false }: { p: Point; lit?: boolean }) {
  const [x, y] = p;
  return lit ? (
    <g>
      <circle cx={x} cy={y} r="19" className={styles.gHalo} />
      <circle cx={x} cy={y} r="11.5" className={styles.gNodeLit} />
      <circle cx={x} cy={y} r="3.5" className="dg-dot-signal" />
    </g>
  ) : (
    <g>
      <circle cx={x} cy={y} r="11.5" className={styles.gNode} />
      <circle cx={x} cy={y} r="3" className={styles.gCore} />
    </g>
  );
}

/** Grupo iluminado: aristas, nodos y rótulos que se encienden juntos. */
function Lit({ at, edges, node, subs, gold = false, compact }: { at: number; edges: Edge[]; node: Key; subs: Sub[]; gold?: boolean; compact: boolean }) {
  const main = MAIN[node];
  return (
    <Step at={[at, OUT]} fx="fade" className={styles.gLayer}>
      <svg viewBox={`0 0 ${W} ${H}`} className="dg absolute inset-0 size-full" fill="none">
        {edges.map((edge, index) => (
          <path key={index} d={d(edge)} className={`dg-line ${gold && index === 0 ? styles.gEdgeGold : styles.gEdgeLit}`} />
        ))}
        {subs.map((sub) => (
          <g key={sub.label}>
            <path d={`M${main.p}L${sub.p}`} className={`dg-line ${styles.gEdgeLit}`} />
            <circle cx={sub.p[0]} cy={sub.p[1]} r="4.5" className={styles.gSubLit} />
          </g>
        ))}
        <MainNode p={main.p} lit />
      </svg>
      <Tag at={main.p} side={main.side} className={styles.gMainLit}>
        {main.label}
      </Tag>
      {!compact &&
        subs.map((sub) => (
          <span key={sub.label}>
            <Tag at={sub.p} side={sub.side} className={styles.gSubLabelLit}>
              {sub.label}
            </Tag>
            {sub.badge && (
              <span className={`${styles.gValue} ${styles.gBadge}`} style={pos(sub.p)}>
                {sub.badge}
              </span>
            )}
            {sub.value && (
              <span className={`${styles.gValue} ${styles.gValueBelow}`} style={pos(sub.p)}>
                {sub.value}
              </span>
            )}
          </span>
        ))}
    </Step>
  );
}

export function KnowledgeGraph({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  const lit = (key: Key) => SUBS[key].filter((sub) => sub.lit);
  return (
    <div className={`${styles.graphBox} ${className}`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="dg absolute inset-0 size-full" fill="none">
        <path d={`M0 ${INDEX[1]}H${INDEX[0]}`} className="dg-line dg-faint" />
        {Object.values(EDGES).map((edge, index) => (
          <path key={index} d={d(edge)} className={`dg-line ${index === 4 ? "dg-dashed" : "dg-faint"}`} />
        ))}
        {(Object.keys(SUBS) as Key[]).map((key) =>
          SUBS[key].map((sub) => (
            <g key={sub.label}>
              <path d={`M${MAIN[key].p}L${sub.p}`} className="dg-line dg-faint" />
              <circle cx={sub.p[0]} cy={sub.p[1]} r="4" className={styles.gSub} />
            </g>
          )),
        )}
        {(Object.keys(MAIN) as Key[]).map((key) => (
          <MainNode key={key} p={MAIN[key].p} />
        ))}
        <rect x={INDEX[0] - 6} y={INDEX[1] - 6} width="12" height="12" transform={`rotate(45 ${INDEX[0]} ${INDEX[1]})`} className={styles.gIndex} />
      </svg>

      <Tag at={INDEX} side="index" className={styles.gIndexLabel}>
        Índice
      </Tag>
      {(Object.keys(MAIN) as Key[]).map((key) => (
        <Tag key={key} at={MAIN[key].p} side={MAIN[key].side} className={styles.gMain}>
          {MAIN[key].label}
        </Tag>
      ))}
      {!compact &&
        (Object.keys(SUBS) as Key[]).flatMap((key) =>
          SUBS[key].map((sub) => (
            <Tag key={sub.label} at={sub.p} side={sub.side} className={styles.gSubLabel}>
              {sub.label}
            </Tag>
          )),
        )}

      <Lit at={T.contenido} node="contenido" edges={[EDGES.indexContenido]} subs={lit("contenido")} compact={compact} />
      <Lit at={T.historias} node="historias" edges={[EDGES.contenidoHistorias]} subs={lit("historias")} gold compact={compact} />
      <Lit
        at={T.conocimiento}
        node="conocimiento"
        edges={[EDGES.historiasConocimiento, EDGES.indexConocimiento]}
        subs={lit("conocimiento")}
        compact={compact}
      />

      {!compact && (
        <Step at={[T.snapshot, OUT]} fx="scale" className={styles.snapshot}>
          <span className={styles.snapshotLabel}>Instantánea v3 · preservada</span>
        </Step>
      )}

      <PacketLayer>
        <Packet kind="doc" tone="signal" size={[W, H]} route={sample(EDGES.indexContenido)} at={T.packetIndex} hold={0.08} />
        <Packet tone="gold" size={[W, H]} route={sample(EDGES.contenidoHistorias)} at={T.packetStory} hold={0.08} />
        {!compact && <Packet size={[W, H]} route={sample(EDGES.historiasConocimiento)} at={T.packetKnowledge} hold={0.08} />}
      </PacketLayer>
    </div>
  );
}

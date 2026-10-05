import type { CSSProperties, ReactNode } from "react";
import { Step } from "@/components/motion/Step";
import { OUT, T } from "@/components/scenes/archivo/timeline";
import styles from "@/components/scenes/ArchivoScene.module.css";

/*
 * Pila "explotada" del archivo en CSS 3D: Documento (arriba), Historia y Colección (base).
 * Las capas se separan y se vuelven a ensamblar con keyframes propios (solo transform); un documento
 * recibe sus etiquetas de índice y desciende por la pila. Etiquetas y rótulos son "billboards":
 * deshacen la rotación de la pila para quedar de frente y legibles.
 * Todo se dimensiona en cqw del contenedor, así la figura escala igual en cualquier ancho.
 */

type Thumb = "text" | "photo" | "audio" | "slot";

const DOCS: Thumb[] = ["photo", "text", "audio", "text", "photo", "text", "slot", "audio", "photo"];

const TAGS = [
  { key: "Fecha", value: "1962" },
  { key: "Lugar", value: "Oaxaca" },
  { key: "Tema", value: "Oficios" },
];

/** Carpetas de la colección: [left, top, width, height]. C-07 ocupa el frente, bajo el documento. */
const FOLDERS = [
  ["7%", "7%", "55%", "40%"],
  ["67%", "7%", "26%", "24.5%"],
  ["67%", "37.5%", "26%", "24.5%"],
  ["67%", "68.5%", "26%", "24.5%"],
];

const thumbClass: Record<Exclude<Thumb, "slot">, string> = {
  text: styles.thumbText,
  photo: styles.thumbPhoto,
  audio: styles.thumbAudio,
};

/**
 * Elemento que queda de frente a la cámara, anclado a un punto de su capa. Gira sobre su ancla
 * (transform-origin) y su caja contiene todo lo que dibuja: Chrome recorta lo que sobresale de una
 * caja con transformación 3D dentro de un contexto preserve-3d.
 */
function Billboard({ x, y, anchor, children }: { x: string; y: string; anchor: "left" | "up"; children: ReactNode }) {
  return (
    <div className={`${styles.billboard} ${anchor === "left" ? styles.billboardLeft : styles.billboardUp}`} style={{ left: x, top: y }}>
      {children}
    </div>
  );
}

function LayerLabel({ n, name }: { n: string; name: string }) {
  return (
    <Billboard x="0%" y="0%" anchor="left">
      <span className={styles.layerName}>
        <b>{n}</b> {name}
      </span>
    </Billboard>
  );
}

function DocumentLayer({ compact }: { compact: boolean }) {
  return (
    <div className={`${styles.plane} ${styles.planeDoc}`}>
      <div className={styles.docGrid}>
        {DOCS.map((kind, index) =>
          kind === "slot" ? (
            <span key={index} className={styles.slot}>
              <Step at={[T.doc, OUT]} fx="pop" className={styles.docNew}>
                <span className={styles.planeText}>D-0418</span>
              </Step>
            </span>
          ) : (
            <span key={index} className={`${styles.thumb} ${thumbClass[kind]}`} />
          ),
        )}
      </div>
      {!compact && (
        <span className={`${styles.scan} motion-only`}>
          <i className={styles.scanBeam} />
        </span>
      )}
      {!compact && <LayerLabel n="01" name="Documento" />}
      {!compact && (
        <Billboard x="19.6%" y="80.3%" anchor="up">
          <div className={styles.tags}>
            <span className={styles.tagStem} />
            {TAGS.map((tag, index) => (
              <Step key={tag.key} at={[T.tags[index], OUT]} fx="down" className={styles.tag}>
                <span className={styles.tagPin} />
                <span className={styles.tagKey}>{tag.key}</span>
                {tag.value}
              </Step>
            ))}
          </div>
        </Billboard>
      )}
    </div>
  );
}

function StoryLayer({ compact }: { compact: boolean }) {
  return (
    <div className={`${styles.plane} ${styles.planeStory}`}>
      <span className={`${styles.planeText} ${styles.storyTitle}`}>H-112 · Relato</span>
      <span className={styles.thread} />
      {[0, 1, 2].map((index) => (
        <span key={index} className={styles.storyCard} style={{ "--i": index } as CSSProperties} />
      ))}
      {!compact && (
        <Step at={[T.story, OUT]} fx="fade" className={styles.storyLit}>
          <span className={styles.threadLit} />
          <span className={styles.storyCardLit} />
        </Step>
      )}
      <span className={styles.storyNotes} />
      {!compact && <LayerLabel n="02" name="Historia" />}
    </div>
  );
}

function CollectionLayer({ compact }: { compact: boolean }) {
  return (
    <div className={`${styles.plane} ${styles.planeCol}`}>
      {FOLDERS.map(([x, y, w, h]) => (
        <span key={x + y} className={styles.folder} style={{ "--x": x, "--y": y, "--w": w, "--h": h } as CSSProperties} />
      ))}
      <span className={styles.folderMain}>
        <span className={styles.planeText}>C-07 · Fondo familiar</span>
      </span>
      <Step at={[T.coleccion, OUT]} fx="fade" className={styles.folderLit} />
      {!compact && <LayerLabel n="03" name="Colección" />}
    </div>
  );
}

export function ArchiveStack({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return (
    <div className={`${styles.stackBox} ${compact ? styles.stackCompact : ""} ${className}`}>
      <div className={styles.stage}>
        <div className={`${styles.tilt} ${compact ? "" : "parallax"}`}>
          <div className={styles.rig}>
            <div className={styles.ground} />
            <CollectionLayer compact={compact} />
            <StoryLayer compact={compact} />
            <DocumentLayer compact={compact} />
            {!compact && <span className={styles.beam} />}
            <span className={`${styles.drop} motion-only`} />
          </div>
        </div>
      </div>

      {!compact && <span className={styles.connector} />}

      <div className={styles.stampWrap}>
        <Step at={[T.stamp, OUT]} fx="pop" className={styles.stamp}>
          <span className={styles.stampTitle}>Preservado</span>
          <span className={styles.stampMeta}>copia v3 · íntegra</span>
        </Step>
      </div>
    </div>
  );
}

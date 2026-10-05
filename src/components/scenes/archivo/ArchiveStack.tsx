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

const DOCS: Thumb[] = ["photo", "text", "audio", "text", "slot", "photo", "audio", "text", "photo"];

const TAGS = [
  { key: "Fecha", value: "1962" },
  { key: "Lugar", value: "Oaxaca" },
  { key: "Tema", value: "Oficios" },
];

const FOLDERS = [
  ["7%", "7%"],
  ["54%", "7%"],
  ["7%", "73%"],
  ["54%", "73%"],
];

const thumbClass: Record<Exclude<Thumb, "slot">, string> = {
  text: styles.thumbText,
  photo: styles.thumbPhoto,
  audio: styles.thumbAudio,
};

/** Elemento que queda de frente a la cámara, anclado a un punto de su capa. */
function Billboard({ x, y, children }: { x: string; y: string; children: ReactNode }) {
  return (
    <div className={styles.billboard} style={{ left: x, top: y }}>
      {children}
    </div>
  );
}

function LayerLabel({ n, name, state }: { n: string; name: string; state: string }) {
  return (
    <Billboard x="0%" y="0%">
      <span className={styles.layerLabel}>
        <span className={styles.layerName}>
          <b>{n}</b> {name}
        </span>
        <span className={styles.layerState}>{state}</span>
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
      {!compact && <LayerLabel n="01" name="Documento" state="pieza" />}
      {!compact && (
        <Billboard x="50%" y="50%">
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
      {!compact && <Step at={[T.thread, OUT]} fx="grow-x" className={styles.threadLit} />}
      {[0, 1, 2].map((index) => (
        <span key={index} className={styles.storyCard} style={{ "--i": index } as CSSProperties} />
      ))}
      {!compact && <Step at={[T.storySlot, OUT]} fx="fade" className={styles.storyCardLit} />}
      <span className={styles.storyNotes} />
      {!compact && <LayerLabel n="02" name="Historia" state="relato" />}
    </div>
  );
}

function CollectionLayer({ compact }: { compact: boolean }) {
  return (
    <div className={`${styles.plane} ${styles.planeCol}`}>
      {FOLDERS.map(([x, y]) => (
        <span key={x + y} className={styles.folder} style={{ "--x": x, "--y": y } as CSSProperties} />
      ))}
      <span className={styles.folderMain}>
        <span className={styles.planeText}>C-07 · Fondo familiar</span>
      </span>
      <Step at={[T.coleccion, OUT]} fx="fade" className={styles.folderLit} />
      {!compact && <LayerLabel n="03" name="Colección" state="publicación" />}
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

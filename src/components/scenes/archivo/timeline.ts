/*
 * Línea de tiempo compartida de la escena Archivo (fracciones del ciclo).
 * Los keyframes propios de ArchivoScene.module.css (capas que se separan, haz y documento que desciende)
 * usan los mismos porcentajes: si cambias un valor aquí, revisa también el CSS.
 *
 *   0.04–0.15  la pila se separa
 *   0.02–0.29  01 Organizar: llega el documento y se le adhieren fecha, lugar y tema
 *   0.29–0.50  02 Relacionar: el documento baja a la historia y el grafo enlaza Historias
 *   0.50–0.68  03 Presentar: baja a la colección, que se publica; el grafo ilumina Conocimiento
 *   0.63–0.74  la pila se vuelve a ensamblar
 *   0.68–0.96  04 Preservar: sello, copia preservada e instantánea del grafo
 */
export const CYCLE = 15000;

/** Ciclo más corto para la vista previa (misma coreografía, menos piezas). */
export const PREVIEW_CYCLE = 11000;

export const OUT = 0.94;

export const T = {
  doc: 0.07,
  tags: [0.115, 0.15, 0.185] as const,
  timelineDoc: 0.13,
  packetIndex: [0.19, 0.27] as [number, number],
  contenido: 0.265,
  indexed: 0.225,
  thread: 0.345,
  storySlot: 0.355,
  packetStory: [0.355, 0.43] as [number, number],
  related: 0.39,
  historias: 0.42,
  timelineStory: 0.4,
  coleccion: 0.555,
  packetKnowledge: [0.52, 0.6] as [number, number],
  published: 0.575,
  conocimiento: 0.585,
  timelineCollection: 0.57,
  stamp: 0.75,
  snapshot: 0.765,
  preserved: 0.775,
  timelineCopy: 0.78,
} as const;

export const PHASES = [
  { n: "01", name: "Organizar", at: [0.02, 0.29] as [number, number] },
  { n: "02", name: "Relacionar", at: [0.29, 0.5] as [number, number] },
  { n: "03", name: "Presentar", at: [0.5, 0.68] as [number, number] },
  { n: "04", name: "Preservar", at: [0.68, 0.96] as [number, number] },
];

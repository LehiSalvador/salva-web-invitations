/*
 * Línea de tiempo compartida de la escena Archivo (fracciones del ciclo).
 * Los keyframes propios de ArchivoScene.module.css (capas que se separan, haz, copia que desciende y
 * escaneo) usan los mismos porcentajes: si cambias un valor aquí, revisa también el CSS.
 *
 *   0.00–0.10  la pila se separa
 *   0.00–0.27  01 Organizar: llega el documento, se escanea y se le adhieren fecha, lugar y tema
 *   0.27–0.47  02 Relacionar: la copia baja a la historia y el grafo enlaza Historias
 *   0.47–0.66  03 Presentar: baja a la colección, que se publica; el grafo ilumina Conocimiento
 *   0.62–0.71  la pila se vuelve a ensamblar
 *   0.66–0.98  04 Preservar: sello, copia preservada, instantánea del grafo y verificación
 */
export const CYCLE = 14000;

/** Ciclo más corto para la vista previa (misma coreografía, menos piezas). */
export const PREVIEW_CYCLE = 11000;

export const OUT = 0.97;

export const T = {
  doc: 0.05,
  tags: [0.1, 0.135, 0.17] as const,
  index: 0.1,
  timelineDoc: 0.115,
  packetIndex: [0.17, 0.25] as [number, number],
  indexed: 0.2,
  contenido: 0.245,
  story: 0.325,
  packetStory: [0.33, 0.41] as [number, number],
  related: 0.36,
  timelineStory: 0.37,
  historias: 0.4,
  coleccion: 0.525,
  packetKnowledge: [0.5, 0.58] as [number, number],
  published: 0.545,
  timelineCollection: 0.55,
  conocimiento: 0.565,
  stamp: 0.69,
  snapshot: 0.71,
  preserved: 0.72,
  timelineCopy: 0.735,
} as const;

export const PHASES = [
  { n: "01", name: "Organizar", at: [0.005, 0.27] as [number, number] },
  { n: "02", name: "Relacionar", at: [0.27, 0.47] as [number, number] },
  { n: "03", name: "Presentar", at: [0.47, 0.66] as [number, number] },
  { n: "04", name: "Preservar", at: [0.66, 0.985] as [number, number] },
];

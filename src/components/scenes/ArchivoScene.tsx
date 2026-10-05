import type { CSSProperties } from "react";
import { Step } from "@/components/motion/Step";
import { ArchiveStack } from "@/components/scenes/archivo/ArchiveStack";
import { KnowledgeGraph } from "@/components/scenes/archivo/KnowledgeGraph";
import { CYCLE, OUT, PHASES, PREVIEW_CYCLE, T } from "@/components/scenes/archivo/timeline";
import styles from "@/components/scenes/ArchivoScene.module.css";

/*
 * Archivo System: un documento entra al archivo, recibe sus etiquetas de índice, baja por la pila
 * (Documento → Historia → Colección), alimenta el grafo de conocimiento y queda preservado.
 * Escena de servidor: todo el movimiento lo arma MotionObserver (Step/Packet) o son keyframes CSS.
 */

const cycleVar = (ms: number) => ({ "--cycle": `${ms}ms` }) as CSSProperties;

function Phases() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-line px-4 py-3 sm:px-6">
      <span className="label text-fog">
        Fondo <span className="text-mist">C-07</span> · ciclo de archivo
      </span>
      <ol className="grid w-full grid-cols-2 gap-1.5 sm:flex sm:w-auto sm:items-center sm:gap-0">
        {PHASES.map((phase, index) => (
          <li key={phase.n} className="flex items-center">
            {index > 0 && <span className="hidden h-px w-5 bg-line-strong sm:block" />}
            <span className="relative block w-full sm:w-auto">
              <span className="flex items-center gap-2 border border-line px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-fog motion-reduce:border-signal/30 motion-reduce:text-mist">
                <span className="motion-reduce:text-signal">{phase.n}</span>
                {phase.name}
              </span>
              <Step
                at={phase.at}
                fx="fade"
                rm="hide"
                className="absolute inset-0 flex items-center gap-2 border border-signal/55 bg-ink-900 px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-bone"
              >
                <span className="text-signal">{phase.n}</span>
                {phase.name}
              </Step>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

const LOG = [
  { at: T.indexed, time: "10:42:03", title: "Documento indexado", detail: "D-0418 · fecha, lugar, tema", tone: "bg-signal" },
  { at: T.related, time: "10:42:06", title: "Historia relacionada", detail: "H-112 · relato «Oficios»", tone: "bg-signal" },
  { at: T.published, time: "10:42:09", title: "Colección publicada", detail: "C-07 · visible en el sitio", tone: "bg-gold-300" },
  { at: T.preserved, time: "10:42:12", title: "Copia preservada", detail: "v3 · verificación íntegra", tone: "bg-gold-300" },
];

const RECORD = [
  ["Tipo", "Carta"],
  ["Fecha", "1962"],
  ["Lugar", "Oaxaca"],
  ["Tema", "Oficios"],
];

function SystemLog({ className = "" }: { className?: string }) {
  return (
    <div className={`border border-line bg-ink-900 ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <span className="label text-mist">Registro</span>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-fog">
          <span className="size-1.5 rounded-full bg-signal" />
          en línea
        </span>
      </div>
      <ol>
        {LOG.map((entry) => (
          <li key={entry.title} className="relative min-h-[3.6rem] border-b border-line px-4 py-2.5">
            <span className="absolute top-2.5 left-4 flex gap-x-2 font-mono text-[10px] text-fog/55">
              <span className="w-[3.7rem] lg:hidden xl:block">--:--:--</span>
              <span className="pl-3.5">— en espera</span>
            </span>
            <Step
              at={[entry.at, OUT]}
              fx="left"
              className="relative grid grid-cols-[3.7rem_minmax(0,1fr)] items-start gap-x-2 bg-ink-900 lg:grid-cols-1 xl:grid-cols-[3.7rem_minmax(0,1fr)]"
            >
              <span className="pt-px font-mono text-[10px] text-fog lg:hidden xl:block">{entry.time}</span>
              <span className="min-w-0">
                <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-bone">
                  <span className={`size-1.5 shrink-0 ${entry.tone}`} />
                  <span className="truncate">{entry.title}</span>
                </span>
                <span className="mt-1.5 block truncate pl-3.5 font-mono text-[10.5px] text-mist">{entry.detail}</span>
              </span>
            </Step>
          </li>
        ))}
      </ol>
      <div className="px-4 py-3">
        <p className="label flex items-center justify-between gap-3 text-fog">
          Ficha <span className="text-signal">D-0418</span>
        </p>
        <dl className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-[10.5px]">
          {RECORD.map(([key, value], index) => (
            <div key={key} className="flex items-baseline justify-between gap-2 border-b border-dashed border-line pb-1">
              <dt className="uppercase tracking-[0.1em] text-fog">{key}</dt>
              {index === 0 ? (
                <dd className="text-bone">{value}</dd>
              ) : (
                <dd className="relative text-fog/60">
                  —
                  <Step at={[T.tags[index - 1], OUT]} fx="fade" className="absolute right-0 bottom-0 bg-ink-900 pl-1 text-bone">
                    {value}
                  </Step>
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

const year = (value: number) => `${(((value - 1900) / 125) * 100).toFixed(2)}%`;

const ERAS = [1900, 1925, 1950, 1975, 2000, 2025];
/** Otras piezas del fondo (ninguna a menos de 4 años de una era, para no confundirse con sus marcas). */
const MARKS = [1908, 1917, 1931, 1938, 1944, 1957, 1966, 1981, 1987, 1993, 2006, 2013, 2019];

function Timeline() {
  return (
    <div className="border-t border-line px-4 pt-3 pb-3 sm:flex sm:items-center sm:gap-6 sm:px-6 sm:pt-4">
      <div className="mb-1 flex items-baseline justify-between sm:mb-0 sm:block sm:w-32 sm:shrink-0">
        <p className="label text-fog">Línea de tiempo</p>
        <p className="font-mono text-[10.5px] text-mist sm:mt-2">1900 – hoy</p>
      </div>
      <div className={`${styles.track} min-w-0 flex-1`}>
        <span className={styles.axis} />
        {MARKS.map((value) => (
          <span key={value} className={styles.mark} style={{ left: year(value) }} />
        ))}
        {ERAS.map((value, index) => (
          <span key={value}>
            <span className={styles.era} style={{ left: year(value) }} />
            <span
              className={styles.eraLabel}
              style={{ left: year(value), transform: index === 0 ? "none" : index === ERAS.length - 1 ? "translateX(-100%)" : undefined }}
            >
              {index === ERAS.length - 1 ? "Hoy" : value}
            </span>
          </span>
        ))}

        <Step at={[T.timelineDoc, OUT]} fx="pop" className={styles.event} style={{ left: year(1962) }}>
          <span className={styles.eventDot} />
          <span className={styles.eventLabel}>D-0418 · 1962</span>
        </Step>

        <Step at={[T.timelineStory, OUT]} fx="left" className={`${styles.span} ${styles.spanStory}`} style={{ left: year(1955), width: `calc(${year(1971)} - ${year(1955)})` }}>
          <span className={`${styles.spanLabel} text-signal`}>H-112</span>
        </Step>

        <Step at={[T.timelineCollection, OUT]} fx="left" className={`${styles.span} ${styles.spanCollection}`} style={{ left: year(1938), width: `calc(${year(1994)} - ${year(1938)})` }}>
          <span className={`${styles.spanLabel} text-gold-300`}>C-07 publicada</span>
        </Step>

        <Step at={[T.timelineCopy, OUT]} fx="pop" className={styles.event} style={{ left: "100%" }}>
          <span className={styles.eventDot} />
          <span className={`${styles.eventLabel} ${styles.eventLabelEnd}`}>Copia v3 · hoy</span>
        </Step>
      </div>
    </div>
  );
}

/** Simulación principal del case study (ocupa el ancho del visor). */
export function ArchivoScene() {
  return (
    <div aria-hidden="true" data-live data-cycle={CYCLE} style={cycleVar(CYCLE)} className="select-none">
      <Phases />
      <div className="grid items-center gap-x-6 gap-y-4 px-4 pt-3 pb-5 sm:px-6 md:grid-cols-2 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_15rem] xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_17.5rem] xl:gap-x-8 xl:pt-5">
        <ArchiveStack className="-mx-4 sm:-mx-6 md:col-span-2 md:mx-auto md:w-full md:max-w-[36rem] lg:col-span-1 lg:max-w-none" />
        <KnowledgeGraph className="mx-auto max-w-[30rem]" />
        <SystemLog />
      </div>
      <Timeline />
    </div>
  );
}

/** Vista previa compacta (showcase e índice): pila que se separa y grafo pequeño que se ilumina. */
export function ArchivoPreview() {
  return (
    <div aria-hidden="true" data-live data-cycle={PREVIEW_CYCLE} style={cycleVar(PREVIEW_CYCLE)} className={`absolute inset-0 ${styles.preview}`}>
      <div className="absolute inset-0 grid grid-cols-[1.15fr_1fr] items-center gap-[3%] px-[4%] py-[5%]">
        <ArchiveStack compact />
        <KnowledgeGraph compact />
      </div>
      <p className={`${styles.previewLegend} absolute top-[6%] left-[4%] font-mono text-[10px] uppercase text-fog`}>
        Documento <span className="text-signal">→</span> Historia <span className="text-signal">→</span> Colección
      </p>
    </div>
  );
}

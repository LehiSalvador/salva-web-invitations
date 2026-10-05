import { Step } from "@/components/motion/Step";
import s from "../AplomoScene.module.css";
import { MOMENTS } from "./yard";

/*
 * Panel de sistema: log de eventos y material seleccionado. Cada línea aparece en el mismo
 * instante del ciclo en que ocurre en el patio (las ventanas salen de las rutas reales).
 */

const pad = (value: number) => String(value).padStart(2, "0");
/** Reloj ilustrativo de la simulación: un ciclo ≈ 24 minutos de operación. */
const clock = (t: number) => {
  const minutes = 7 * 60 + 40 + Math.round(t * 24);
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
};

const SIGNAL = "var(--color-signal)";
const GOLD = "var(--color-gold-300)";
const COOL = "var(--color-cool)";

const events = [
  { t: MOMENTS.t01Gate, text: "T-01 ingresó por acceso", note: "op-214 · pluma A1", tone: SIGNAL },
  { t: MOMENTS.t01Road, text: "T-01 → Zona B · B-07", note: "op-215 · ruta asignada", tone: SIGNAL },
  { t: MOMENTS.unloadStart + 0.008, text: "Descarga registrada", note: "op-216 · T-01 en B-07", tone: GOLD },
  { t: MOMENTS.unloadEnd + 0.004, text: "Material ubicado · B-07", note: "op-217 · granel · zona B", tone: GOLD },
  { t: MOMENTS.t02Gate, text: "T-02 ingresó por acceso", note: "op-218 · ruta → D-06", tone: COOL },
  { t: MOMENTS.t01Exit, text: "T-01 salió del patio", note: "op-219 · salida N1", tone: SIGNAL },
];

export function Panel() {
  return (
    <aside className={s.panel}>
      <section className={s.block}>
        <header className="label flex items-center justify-between gap-3 text-fog">
          <span className="flex items-center gap-2 text-mist">
            <span className="live-dot" />
            Eventos del patio
          </span>
          <span>Patio 01</span>
        </header>
        <ol className={s.log}>
          {events.map((event) => (
            <li key={event.text} className={s.logSlot}>
              <Step at={[event.t, MOMENTS.reset]} fx="left" className={s.logRow}>
                <time>{clock(event.t)}</time>
                <span className={s.logDot} style={{ color: event.tone }} />
                <span className="text-bone">
                  {event.text}
                  <small>{event.note}</small>
                </span>
              </Step>
            </li>
          ))}
        </ol>
      </section>

      <section className={s.block}>
        <header className="label flex items-center justify-between gap-3 text-fog">
          <span className="text-mist">Material seleccionado</span>
          <span className="text-gold-300">M-031</span>
        </header>
        <dl className={s.fields}>
          <dt>Tipo</dt>
          <dd>Granel</dd>
          <dt>Ubicación</dt>
          <dd>
            <span className="font-mono text-gold-300">B-07</span> <span className="text-mist">· Zona B · fila 07</span>
          </dd>
          <dt>Estado</dt>
          <dd className={s.slots}>
            <Step at={[0, MOMENTS.t01Arrive]} fx="fade" rm="hide" className={s.state} style={{ color: SIGNAL }}>
              <span className={s.dot} />
              En tránsito
            </Step>
            <Step at={[MOMENTS.t01Arrive, MOMENTS.unloadEnd]} fx="fade" rm="hide" className={s.state} style={{ color: GOLD }}>
              <span className={s.dot} />
              Descargando
            </Step>
            <Step at={[MOMENTS.unloadEnd, MOMENTS.reset]} fx="fade" className={s.state} style={{ color: GOLD, background: "rgb(220 197 154 / 0.1)" }}>
              <span className={s.dot} />
              Ubicado
            </Step>
          </dd>
          <dt>Traza</dt>
          <dd />
        </dl>
        <div className={s.trace}>
          <TraceNode label="Acceso" at={MOMENTS.t01Gate} />
          <span className={s.traceLine}>
            <Step as="span" at={[MOMENTS.t01Gate, MOMENTS.reset]} fx="grow-x" className="origin-left" />
          </span>
          <TraceNode label="Zona B" at={MOMENTS.t01ZoneB} />
          <span className={s.traceLine}>
            <Step as="span" at={[MOMENTS.t01ZoneB, MOMENTS.reset]} fx="grow-x" className="origin-left" />
          </span>
          <TraceNode label="B-07" at={MOMENTS.t01Arrive} gold />
        </div>
      </section>
    </aside>
  );
}

function TraceNode({ label, at, gold = false }: { label: string; at: number; gold?: boolean }) {
  return (
    <span className={s.traceNode}>
      <span>
        <Step as="span" at={[at, MOMENTS.reset]} fx="pop" className={`${s.traceLit} ${gold ? s.traceLitGold : ""}`} />
      </span>
      <span className={gold ? "text-gold-300" : undefined}>{label}</span>
    </span>
  );
}

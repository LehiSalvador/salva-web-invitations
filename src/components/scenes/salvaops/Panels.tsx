import { Step } from "@/components/motion/Step";
import s from "../SalvaOpsScene.module.css";
import { agents, ledgerAt, ops } from "./model";

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

/** Etiqueta mono en mayúsculas; color terciario salvo que se indique otro. */
const cap = (extra = "") => cx(s.cap, /(^|\s)text-/.test(extra) ? extra : `text-fog ${extra}`);

const provider = { ia1: "Proveedor IA 1", ia2: "Proveedor IA 2" } as const;

/** Registros previos al ciclo (estáticos, atenuados). */
const history = [
  { id: "op-010", project: "B", provider: "Proveedor IA 2", detail: "docs · sha 02be" },
  { id: "op-011", project: "A", provider: "Proveedor IA 1", detail: "pruebas · sha 9a61" },
];

/** Libro de evidencia: solo agrega. Cada operación (permitida o bloqueada) deja un registro encadenado. */
export function Ledger() {
  return (
    <div className={cx(s.pane, s.areaLedger, "flex flex-col")}>
      <div className={s.paneHead}>
        <span className={cap("text-bone")}>Libro de evidencia</span>
        <span className={s.tag}>solo agregar</span>
      </div>
      <div className={cx(s.row, "border-b border-line !py-2")}>
        <span />
        <span className={cap()}>id</span>
        <span className={cap()}>proyecto · proveedor</span>
        <span className={cap()}>estado</span>
      </div>
      <ol className={s.ledgerList}>
        {history.map((entry) => (
          <li key={entry.id} className={cx(s.row, "opacity-55")}>
            <span className={s.chain} />
            <span className="text-gold-400">{entry.id}</span>
            <span className="truncate text-mist">
              Proyecto {entry.project} · {entry.provider}
            </span>
            <span className="text-signal">✓</span>
            <span className={cx(s.rowDetail, "hidden xl:block")}>{entry.detail}</span>
          </li>
        ))}
        {ops.map((op) => {
          const agent = agents[op.agent];
          const blocked = op.to === "bloqueada";
          return (
            <Step key={op.id} as="li" at={[Number(ledgerAt(op).toFixed(3)), 0.94]} fx="up" className={s.row}>
              <span className={cx(s.chain, blocked ? s.chainNo : s.chainNew)} />
              <span className="text-gold-300">{op.id}</span>
              <span className="truncate text-bone">
                Proyecto {agent.project.toUpperCase()} · <span className={blocked ? "text-rose" : "text-mist"}>{blocked ? "política" : provider[op.to as "ia1" | "ia2"]}</span>
              </span>
              <span className={blocked ? "text-rose" : "text-signal"}>{blocked ? "✕ bloqueada" : "✓"}</span>
              <span className={cx(s.rowDetail, "hidden xl:block")}>
                {op.task} · {blocked ? "alcance denegado" : "evidencia"} · sha {op.hash}
              </span>
            </Step>
          );
        })}
      </ol>
      <div className={cap("mt-auto hidden items-center justify-between border-t border-line px-3 py-2.5 xl:flex")}>
        <span>cadena íntegra</span>
        <span className="text-signal">✓ verificada</span>
      </div>
    </div>
  );
}

type Line = { at: number; tone?: "cmd" | "ok" | "no" | "out"; text: React.ReactNode };

const lines: Line[] = [
  {
    at: 0.3,
    tone: "cmd",
    text: (
      <>
        <span className="text-cool">~/proyectos/a</span> <span className="text-signal">$</span> salvaops run --project a --agent pruebas
      </>
    ),
  },
  { at: 0.36, tone: "out", text: "↳ broker → proveedor ia 1" },
  { at: 0.42, tone: "out", text: "↳ política: permitido · permisos ✓ alcance ✓" },
  { at: 0.495, tone: "ok", text: "✓ evidencia registrada · op-014" },
  {
    at: 0.52,
    tone: "cmd",
    text: (
      <>
        <span className="text-cool">~/proyectos/b</span> <span className="text-signal">$</span> salvaops run --project b --agent migracion
      </>
    ),
  },
  { at: 0.635, tone: "no", text: "✕ política: bloqueada · alcance fuera de proyecto b" },
  { at: 0.68, tone: "ok", text: "✓ evidencia registrada · op-015" },
];

const toneClass = { cmd: "text-bone", out: "text-mist", ok: "text-signal", no: "text-rose" } as const;

/** Terminal: comandos ilustrativos y su salida, sincronizados con el escenario. */
export function Terminal() {
  return (
    <div className={cx(s.pane, s.term, s.areaTerm)}>
      <div className={s.paneHead}>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-ink-700" />
          <span className="size-2 rounded-full bg-ink-700" />
          <span className="size-2 rounded-full bg-ink-700" />
          <span className={cap("ml-2.5 text-mist")}>terminal</span>
        </span>
        <span className={cap()}>salvaops cli</span>
      </div>
      <div className={s.termBody}>
        {lines.map((line, index) => (
          <Step key={index} as="span" at={[line.at, 0.94]} fx="left" className={cx(s.termLine, toneClass[line.tone ?? "out"], line.tone !== "cmd" && s.termOut)}>
            {line.text}
          </Step>
        ))}
        <span className={s.termLine}>
          <span className="text-signal">$</span> <span className={cx(s.cursor, "motion-only")} />
        </span>
      </div>
    </div>
  );
}

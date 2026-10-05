import { Step } from "@/components/motion/Step";
import s from "../SalvaOpsScene.module.css";
import { agents, ledgerAt, ops } from "./model";

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

/** Etiqueta mono en mayúsculas; color terciario salvo que se indique otro. */
const cap = (extra = "") => cx(s.cap, /(^|\s)text-/.test(extra) ? extra : `text-fog ${extra}`);

/** Registros previos al ciclo (estáticos, atenuados). */
const history = [
  { id: "op-011", project: "A", to: "IA 2", detail: "refactor · evidencia · sha 5f3c" },
  { id: "op-012", project: "B", to: "IA 2", detail: "docs · evidencia · sha 02be" },
  { id: "op-013", project: "A", to: "IA 1", detail: "pruebas · evidencia · sha 9a61" },
];

/** Libro de evidencia: solo agrega. Cada operación (permitida o bloqueada) deja un registro encadenado. */
export function Ledger() {
  return (
    <div className={cx(s.pane, s.areaLedger, "flex flex-col")}>
      <div className={s.paneHead}>
        <span className={cap("text-bone")}>Libro de evidencia</span>
        <span className={s.tag}>solo agregar</span>
      </div>
      <ol className={s.ledgerList}>
        {history.map((entry) => (
          <li key={entry.id} className={cx(s.row, s.rowOld)}>
            <span className={s.chain} />
            <span className="text-gold-400">{entry.id}</span>
            <span className="truncate text-mist">
              Proyecto {entry.project} → {entry.to}
            </span>
            <span className="text-signal">✓</span>
            <span className={s.rowDetail}>{entry.detail}</span>
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
                Proyecto {agent.project.toUpperCase()}{" "}
                {blocked ? <span className="text-rose">→ —</span> : <span className={op.to === "ia1" ? "text-signal" : "text-cool"}>→ IA {op.to === "ia1" ? "1" : "2"}</span>}
              </span>
              <span className={blocked ? "text-rose" : "text-signal"}>{blocked ? "✕ bloqueada" : "✓ ok"}</span>
              <span className={s.rowDetail}>
                {op.task} · {blocked ? <span className="text-rose/80">alcance ✕</span> : "evidencia"} · sha {op.hash}
              </span>
            </Step>
          );
        })}
      </ol>
      <div className={cap("mt-auto flex items-center justify-between gap-3 border-t border-line px-3 py-2.5")}>
        <span>ids ilustrativos</span>
        <span className="text-signal">✓ cadena verificada</span>
      </div>
    </div>
  );
}

/** Bandera de la CLI: no se parte al final del renglón. */
const Flag = ({ children }: { children: string }) => <span className="whitespace-nowrap">{children}</span>;

type Line = { at: number; tone?: "cmd" | "ok" | "no" | "out"; text: React.ReactNode };

const lines: Line[] = [
  {
    at: 0.012,
    tone: "cmd",
    text: (
      <>
        <span className="text-cool">~/proyectos/a</span> <span className="text-signal">$</span> salvaops run <Flag>--project a</Flag> <Flag>--agent pruebas</Flag>
      </>
    ),
  },
  { at: 0.075, tone: "out", text: "↳ broker → proveedor ia 1" },
  { at: 0.132, tone: "out", text: "↳ política: permitido · permisos ✓ alcance ✓" },
  { at: 0.208, tone: "ok", text: "✓ evidencia registrada · op-014" },
  {
    at: 0.228,
    tone: "cmd",
    text: (
      <>
        <span className="text-cool">~/proyectos/b</span> <span className="text-signal">$</span> salvaops run <Flag>--project b</Flag> <Flag>--agent migracion</Flag>
      </>
    ),
  },
  { at: 0.348, tone: "no", text: "✕ política: bloqueada · alcance fuera de proyecto b" },
  { at: 0.39, tone: "ok", text: "✓ evidencia registrada · op-015" },
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
        <span className={cap("flex items-center gap-2.5 text-mist")}>
          <span className="live-dot" />
          broker activo
        </span>
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

import type { CSSProperties } from "react";
import { Step } from "@/components/motion/Step";
import s from "../SalvaOpsScene.module.css";
import { agents, CYCLE, dispatch, history, keyframes, ledgerAt, ops, stair } from "./model";

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

/** Etiqueta mono en mayúsculas; color terciario salvo que se indique otro. */
const cap = (extra = "") => cx(s.cap, /(^|\s)text-/.test(extra) ? extra : `text-fog ${extra}`);

const byId = (id: string) => ops.findIndex((item) => item.id === id);

/**
 * Libro de evidencia: solo agrega. Cada operación (permitida o bloqueada) deja un registro encadenado.
 * Al cerrar el ciclo el bloque se sella: los registros no se borran, quedan atenuados hasta volver a confirmarse.
 */
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
        {ops.map((item) => {
          const agent = agents[item.agent];
          const blocked = item.to === "bloqueada";
          return (
            <Step key={item.id} as="li" at={[ledgerAt(item), 0.985]} fx="fade" min={0.5} className={s.row}>
              <span className={cx(s.chain, blocked ? s.chainNo : s.chainNew)} />
              <span className="text-gold-300">{item.id}</span>
              <span className="truncate text-bone">
                Proyecto {agent.project.toUpperCase()}{" "}
                {blocked ? <span className="text-rose">→ —</span> : <span className={item.to === "ia1" ? "text-signal" : "text-cool"}>→ IA {item.to === "ia1" ? "1" : "2"}</span>}
              </span>
              <span className={blocked ? "text-rose" : "text-signal"}>{blocked ? "✕ bloqueada" : "✓ ok"}</span>
              <span className={s.rowDetail}>
                {item.task} · {blocked ? <span className="text-rose/80">alcance ✕</span> : "evidencia"} · sha {item.hash}
              </span>
            </Step>
          );
        })}
      </ol>
      <div className={cap("mt-auto flex items-center justify-between gap-3 border-t border-line px-3 py-2.5")}>
        <span>bloque sellado · sha 9e4d…</span>
        <span className="text-signal">✓ verificado</span>
      </div>
    </div>
  );
}

/* ───────────── Terminal ───────────── */

type Line = { at: number; tone: "cmd" | "out" | "ok" | "no" | "bg"; text: React.ReactNode };

const Wide = ({ children }: { children: React.ReactNode }) => <span className={s.termWide}>{children}</span>;

const command = (project: "a" | "b", agent: string) => (
  <>
    <Wide>
      <span className="text-cool">~/proyectos/{project}</span>{" "}
    </Wide>
    <span className="text-signal">$</span> salvaops run --project {project} --agent {agent}
  </>
);

/** Línea compacta de una operación que un agente lanzó en segundo plano. */
const background = (id: string) => {
  const item = ops[byId(id)];
  return (
    <>
      <span className="text-fog">· {item.id}</span> · {agents[item.agent].name} → proveedor ia {item.to === "ia1" ? "1" : "2"} <span className="text-signal">✓</span>
    </>
  );
};

const g = (id: string) => ops[byId(id)].gate;

const lines: Line[] = ([
  { at: 0.008, tone: "cmd", text: command("a", "agt-a2") },
  { at: g("op-014") - 0.045, tone: "out", text: "↳ broker → proveedor ia 1" },
  {
    at: g("op-014") + 0.004,
    tone: "out",
    text: (
      <>
        ↳ política: permitido<Wide> · permisos ✓ alcance ✓</Wide>
      </>
    ),
  },
  { at: ledgerAt(ops[byId("op-014")]), tone: "ok", text: "✓ evidencia registrada · op-014" },
  { at: dispatch(byId("op-016")) - 0.03, tone: "cmd", text: command("b", "agt-b2") },
  { at: ledgerAt(ops[byId("op-015")]), tone: "bg", text: background("op-015") },
  {
    at: g("op-016") + 0.004,
    tone: "no",
    text: (
      <>
        ✕ política: bloqueada · alcance<Wide> fuera de proyecto b</Wide>
      </>
    ),
  },
  { at: ledgerAt(ops[byId("op-016")]), tone: "ok", text: "✓ evidencia registrada · op-016" },
  ...["op-017", "op-018", "op-019"].map((id): Line => ({ at: ledgerAt(ops[byId(id)]), tone: "bg", text: background(id) })),
] satisfies Line[]).sort((a, b) => a.at - b.at);

/** Renglones visibles (incluido el del cursor) y alto de renglón en em. */
const ROWS = 8;
const LH = 1.62;
const em = (rows: number) => `translateY(${(rows * LH).toFixed(3)}em)`;

/*
 * Un solo keyframe revela las líneas (una cubierta con el cursor baja renglón a renglón) y otro desplaza
 * la vista cuando ya no caben: el cursor siempre queda justo debajo de la última línea impresa.
 * Al final del ciclo la terminal se limpia. La vista estática muestra las últimas líneas.
 */
const N = lines.length;
const reveal = (count: number) => em(count);
const scroll = (count: number) => em(-Math.max(0, count + 1 - ROWS));
const CLEAR = 0.982;

const timeline = (value: (count: number) => string): [number, string][] => [
  ...stair(
    lines.map((line, index) => ({ at: line.at, value: value(index + 1) })),
    value(0),
  ).filter(([offset]) => offset < 1),
  [CLEAR, value(N)],
  [CLEAR + 0.006, value(0)],
  [1, value(0)],
];

export const terminalCss = keyframes("sops-term-cover", "transform", timeline(reveal)) + keyframes("sops-term-scroll", "transform", timeline(scroll));

const toneClass = { cmd: "text-bone", out: "text-mist", ok: "text-signal", no: "text-rose", bg: "text-mist" } as const;

const run = (name: string, still: string): CSSProperties => ({ animation: `${name} ${CYCLE}ms linear infinite`, transform: still });

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
        <span className={cap("flex items-center gap-2 text-mist")}>
          <span className="size-1.5 rounded-full bg-signal" />
          broker activo
        </span>
      </div>
      <div className={s.termBody}>
        <div className={s.termView} style={{ height: `${ROWS * LH}em` }}>
          <div className={cx(s.termScroll, s.timeline)} style={run("sops-term-scroll", scroll(N))}>
            {lines.map((line, index) => (
              <p key={index} className={cx(s.termLine, toneClass[line.tone], line.tone !== "cmd" && s.termOut)}>
                {line.text}
              </p>
            ))}
            <div className={cx(s.termCover, s.timeline)} style={{ ...run("sops-term-cover", reveal(N)), height: `${(N + 1) * LH}em` }}>
              <p className={s.termLine}>
                <span className="text-signal">$</span> <span className={cx(s.cursor, "motion-only")} />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

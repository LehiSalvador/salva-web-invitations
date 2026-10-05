import type { CSSProperties } from "react";
import { Packet, PacketLayer } from "@/components/motion/Packet";
import { Step } from "@/components/motion/Step";
import styles from "./CapabilityVisuals.module.css";
import { Check, END, MICRO, PANEL, Scene, TRUNC } from "./kit";

/*
 * Desarrollo de software: el módulo en el árbol, su código escrito carácter por carácter (una máscara avanza
 * con el cursor), una pasada de ejecución que recorre el código mientras las pruebas se ponen en verde
 * y la entrega lista para revisión.
 */

const CYCLE = 11000;

type Token = [kind: "k" | "f" | "v" | "s" | "p", text: string];

const TONE: Record<Token[0], string> = {
  k: "text-cool",
  f: "text-bone",
  v: "text-gold-300/90",
  s: "text-signal",
  p: "text-mist",
};

const code: Token[][] = [
  [["k", "async function "], ["f", "cerrar"], ["p", "(pedido) {"]],
  [["p", "  "], ["k", "if "], ["p", "(!pedido."], ["v", "pagado"], ["p", ")"]],
  [["p", "    "], ["k", "return "], ["f", "pendiente"], ["p", "(pedido);"]],
  [["p", "  "], ["k", "await "], ["p", "stock."], ["f", "descontar"], ["p", "(pedido);"]],
  [["p", "  "], ["k", "await "], ["f", "avisar"], ["p", "(pedido, "], ["s", '"listo"'], ["p", ");"]],
  [["p", "  "], ["k", "return "], ["f", "registrar"], ["p", "(pedido);"]],
  [["p", "}"]],
];

const tests = [
  { name: "cierra pedido pagado", short: "pagado", at: 0.5 },
  { name: "deja pendiente sin pago", short: "sin pago", at: 0.55 },
  { name: "descuenta inventario", short: "stock", at: 0.6 },
  { name: "avisa al cliente", short: "aviso", at: 0.65 },
];

const ROW = "flex h-[19px] items-center gap-1.5 font-mono text-[10.5px] leading-[1.35]";

function TreeRow({ depth, name, folder, className = "" }: { depth: number; name: string; folder?: boolean; className?: string }) {
  return (
    <span className={`${ROW} ${folder ? "text-mist" : "text-fog"} ${className}`} style={{ paddingLeft: depth * 11 }}>
      {folder ? (
        <svg viewBox="0 0 10 10" className="size-[9px] shrink-0 text-cool/80" fill="none" aria-hidden="true">
          <path d="M1 2.5h3l1 1h4v5H1Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
        </svg>
      ) : (
        <span className="size-[5px] shrink-0 rounded-[1px] bg-fog/60" />
      )}
      {name}
    </span>
  );
}

function Tree() {
  return (
    <div className={`${PANEL} hidden w-[150px] shrink-0 flex-col overflow-hidden @2xl:flex`}>
      <span className={`${MICRO} flex h-[26px] shrink-0 items-center border-b border-line px-2.5 text-fog`}>módulos</span>
      <div className="relative flex flex-col px-1.5 py-1.5">
        <TreeRow depth={0} name="src" folder />
        <TreeRow depth={1} name="pedidos" folder />
        <div className="relative">
          <Step at={[0.04, END]} fx="grow-x" className="absolute inset-0 origin-left rounded-[2px] border-l-2 border-signal bg-signal/10" />
          <TreeRow depth={2} name="cerrar.ts" className="relative text-bone" />
          <Step at={[0.24, END]} fx="pop" className="absolute top-1/2 right-1.5 -translate-y-1/2 font-mono text-[10px] leading-none text-gold-300">
            M
          </Step>
        </div>
        <TreeRow depth={2} name="crear.ts" />
        <Step at={[0.46, END]} fx="left" className="relative">
          <TreeRow depth={2} name="cerrar.test.ts" className="text-bone" />
          <span className="absolute top-1/2 right-1.5 -translate-y-1/2 font-mono text-[10px] leading-none text-signal">+</span>
        </Step>
        <TreeRow depth={1} name="inventario" folder />
        <TreeRow depth={1} name="avisos" folder />
        <TreeRow depth={1} name="reportes" folder />
      </div>
    </div>
  );
}

function Line({ tokens, index }: { tokens: Token[]; index: number }) {
  const last = index === code.length - 1;
  const length = tokens.reduce((sum, [, text]) => sum + text.length, 0) + (last ? 1 : 0);
  return (
    <div className="relative flex h-[13px] items-center @lg:h-[18px]">
      <span className="w-[22px] shrink-0 pr-2 text-right text-fog/70 @lg:w-[30px] @lg:pr-3">{index + 1}</span>
      {/* Ancho exacto en caracteres: la máscara avanza un carácter por paso. */}
      <span className="relative inline-block h-full overflow-hidden leading-[13px] @lg:leading-[18px]" style={{ width: `${length}ch` }}>
        {tokens.map(([kind, text], token) => (
          <span key={token} className={TONE[kind]}>
            {text}
          </span>
        ))}
        {last && <span className="pulse ml-px inline-block h-[1.1em] w-[1.5px] translate-y-[0.2em] bg-signal" style={{ "--dur": "1.1s" } as CSSProperties} />}
        <span className={`${styles.mask} ${styles[`type${index}`]}`} style={{ animationTimingFunction: `steps(${length}, end)` }} />
      </span>
    </div>
  );
}

function Editor() {
  return (
    <div className={`${PANEL} flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden`}>
      <div className="flex h-[20px] shrink-0 items-stretch border-b border-line font-mono text-[10px] leading-none @lg:h-[26px] @lg:text-[10.5px]">
        <span className="flex items-center gap-1.5 border-r border-line bg-ink-850 px-2 text-bone shadow-[inset_0_1px_0_var(--color-signal)] @lg:px-3">cerrar.ts</span>
        <Step at={[0.46, END]} fx="up" className="flex items-center border-r border-line px-2 text-fog @lg:px-3">
          cerrar.test.ts
        </Step>
        <span className={`${MICRO} ml-auto flex items-center px-2 text-fog`}>ts</span>
      </div>

      <div className="relative py-1 font-mono text-[10px] whitespace-pre @lg:py-2 @lg:text-[11.5px]">
        {/* Pasada de ejecución mientras corren las pruebas: mide el ancho del editor. */}
        <div className="absolute inset-x-0 top-1 h-[91px] [--band-h:13px] @lg:top-2 @lg:h-[126px] @lg:[--band-h:18px]">
          <PacketLayer>
            <Packet className={styles.band} size={[100, 7]} route={[[0, 0.5], [0, 6.5]]} at={[0.47, 0.67]} />
          </PacketLayer>
        </div>
        {code.map((tokens, index) => (
          <Line key={index} tokens={tokens} index={index} />
        ))}
      </div>

      <div className="mt-auto hidden flex-col gap-[6px] border-t border-line px-3 py-2 font-mono text-[10.5px] leading-[1.35] @lg:flex">
        <span className="text-fog">$ pruebas --watch</span>
        <span className="relative h-[14px]">
          <Step at={[0.46, 0.68]} fx="fade" rm="hide" className="absolute inset-0 text-mist">
            ▸ cerrar.test.ts <span className="text-fog">ejecutando…</span>
          </Step>
          <Step at={[0.68, END]} fx="up" className="absolute inset-0 flex items-center gap-1.5 text-signal">
            <Check /> <span className="text-bone">cerrar.test.ts</span> <span className="text-fog">en verde</span>
          </Step>
        </span>
        <Step at={[0.71, END]} fx="up" className="flex items-center gap-1.5 text-signal">
          <Check /> <span className="text-mist">tipos</span> <Check /> <span className="text-mist">estilo</span>
        </Step>
      </div>
    </div>
  );
}

function Tests() {
  return (
    <div className="flex shrink-0 flex-col @lg:w-[190px] @lg:rounded-[3px] @lg:border @lg:border-line-strong @lg:bg-ink-900/90">
      <div className="hidden h-[26px] shrink-0 items-center justify-between border-b border-line px-2.5 @lg:flex">
        <span className={`${MICRO} text-fog`}>pruebas</span>
        <span className="relative h-[12px] w-[80px]">
          <Step at={[0.46, 0.68]} fx="fade" rm="hide" className={`${MICRO} absolute inset-0 flex items-center justify-end gap-1.5 text-mist`}>
            <span className="spin size-[9px] rounded-full border border-signal border-t-transparent" style={{ "--dur": "0.9s" } as CSSProperties} />
            en curso
          </Step>
          <Step at={[0.68, END]} fx="fade" className={`${MICRO} absolute inset-0 flex items-center justify-end gap-2.5 text-signal`}>
            <span className="live-dot" /> en verde
          </Step>
        </span>
      </div>

      <ul className="flex flex-wrap gap-1.5 @lg:flex-col @lg:flex-nowrap @lg:gap-0 @lg:px-2.5 @lg:py-1">
        {tests.map((test) => (
          <li
            key={test.name}
            className="flex h-[20px] min-w-0 items-center gap-1.5 rounded-[2px] border border-line bg-ink-900/90 px-1.5 font-mono text-[10px] text-mist @lg:h-[25px] @lg:rounded-none @lg:border-0 @lg:border-b @lg:bg-transparent @lg:px-0 @lg:text-[10.5px] @lg:last:border-b-0"
          >
            <span className="relative grid size-[11px] shrink-0 place-items-center">
              <span className="size-[8px] rounded-full border border-fog/60" />
              <Step at={[test.at, END]} fx="pop" className="absolute inset-0 grid place-items-center rounded-full bg-signal text-ink-950">
                <Check className="size-[8px]" />
              </Step>
            </span>
            <span className="leading-[1.35] @lg:hidden">{test.short}</span>
            <span className={`${TRUNC} hidden @lg:block`}>{test.name}</span>
          </li>
        ))}
      </ul>

      <Step at={[0.73, END]} fx="up" className="mx-2.5 mt-auto mb-2.5 hidden flex-col gap-1.5 rounded-[2px] border border-gold-400/50 bg-gold-400/[0.07] px-2 py-2 @lg:flex">
        <span className={`${MICRO} flex items-center gap-1.5 text-gold-300`}>
          <span className="size-[6px] rounded-full bg-gold-300" /> listo para revisión
        </span>
        <span className="font-mono text-[10px] leading-[1.35] text-fog">rama pedidos/cerrar</span>
      </Step>
    </div>
  );
}

export function SoftwareVisual() {
  return (
    <Scene
      cycle={CYCLE}
      phases={[
        { label: "módulos", at: [0, 0.19] },
        { label: "código", at: [0.19, 0.45] },
        { label: "pruebas", at: [0.45, 0.7] },
        { label: "entrega", at: [0.7, END] },
      ]}
    >
      <div className="flex h-full gap-3">
        <Tree />
        <div className="flex min-w-0 flex-1 flex-col gap-2 @lg:flex-row @lg:gap-3">
          <Editor />
          <Tests />
        </div>
      </div>
    </Scene>
  );
}

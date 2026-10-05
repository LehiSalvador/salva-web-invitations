import type { CSSProperties } from "react";
import { Packet, PacketLayer } from "@/components/motion/Packet";
import { Step } from "@/components/motion/Step";
import s from "../SalvaOpsScene.module.css";
import {
  agents,
  CYCLE,
  D,
  dispatch,
  geo,
  inspectWindow,
  keyframes,
  layout,
  M,
  ops,
  packetsD,
  packetsM,
  place,
  stair,
  STILL,
  verdictWindow,
  wiresD,
  wiresM,
  type AgentId,
  type Box,
  type Op,
  type ProviderId,
} from "./model";

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

/** Etiqueta mono en mayúsculas; color terciario salvo que se indique otro. */
const cap = (extra = "") => cx(s.cap, /(^|\s)text-/.test(extra) ? extra : `text-fog ${extra}`);

const providerName: Record<ProviderId, string> = { ia1: "Proveedor IA 1", ia2: "Proveedor IA 2" };

/** Elemento posicionado en el escenario (coordenadas de ambas composiciones). */
function At({ d, m, className, children, style }: { d: Box; m: Box; className?: string; children?: React.ReactNode; style?: CSSProperties }) {
  return (
    <div className={cx(s.at, className)} style={{ ...place(d, m), ...style }}>
      {children}
    </div>
  );
}

/* ───────────── Líneas de tiempo CSS: cola del broker y brazo de la compuerta ───────────── */

/** Estados de la cola: las dos siguientes operaciones aún sin despachar. */
const queueStates = ops.map((_, index) => ops.slice(index, index + 2).map((item) => item.id));
queueStates.push([]);
/** Estado de la vista estática: con la operación bloqueada en el broker. */
const QUEUE_STILL = ops.findIndex((item) => item.id === STILL) + 1;
const QUEUE_ROW = 1.45; // em

const queueCss = keyframes(
  "sops-queue",
  "transform",
  stair(
    ops.map((_, index) => ({ at: dispatch(index), value: `translateY(${(-(index + 1) * QUEUE_ROW).toFixed(2)}em)` })),
    "translateY(0em)",
  ),
);

/** Brazo de la compuerta: se levanta (y se enciende) para cada operación permitida; con la bloqueada se queda abajo. */
const allowed = ops.filter((item) => item.to !== "bloqueada");
const armFrames = (open: string, closed: string): [number, string][] => [
  [0, closed],
  ...allowed.flatMap(({ gate }) => [
    [gate - 0.006, closed] as [number, string],
    [gate + 0.006, open] as [number, string],
    [gate + 0.03, open] as [number, string],
    [gate + 0.042, closed] as [number, string],
  ]),
  [1, closed],
];
const armCss = keyframes("sops-arm", "transform", armFrames("rotate(-92deg)", "rotate(0deg)")) + keyframes("sops-arm-on", "opacity", armFrames("1", "0"));

export const stageCss = queueCss + armCss;

const run = (name: string): CSSProperties => ({ animation: `${name} ${CYCLE}ms linear infinite` });

/* ───────────── Iconos ───────────── */

function Lock() {
  return (
    <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
      <rect x="2" y="5.2" width="8" height="5.6" rx="1" />
      <path d="M4 5.2V3.8a2 2 0 0 1 4 0v1.4" />
    </svg>
  );
}

function AgentGlyph() {
  return (
    <span className={s.glyph}>
      <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
        <path d="M6 1.2 10.2 3.6v4.8L6 10.8 1.8 8.4V3.6Z" />
        <circle cx="6" cy="6" r="1.3" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

function Shield() {
  return (
    <svg viewBox="0 0 12 12" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
      <path d="M6 1.2 10 2.8v3c0 2.4-1.7 4.1-4 5-2.3-.9-4-2.6-4-5v-3Z" />
    </svg>
  );
}

function Laptop() {
  return (
    <svg viewBox="0 0 14 12" width="13" height="11" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
      <rect x="2.5" y="2" width="9" height="6.2" rx="0.8" />
      <path d="M1 10.2h12" />
    </svg>
  );
}

/** SVG del escenario en la composición horizontal (desde md) o vertical (mobile). */
function Svg({ layout: which, children }: { layout: "d" | "m"; children: React.ReactNode }) {
  const size = which === "d" ? D : M;
  return (
    <svg viewBox={`0 0 ${size.w} ${size.h}`} preserveAspectRatio="none" className={cx(s.svg, which === "d" ? "hidden md:block" : "md:hidden")} aria-hidden="true">
      {children}
    </svg>
  );
}

/* ───────────── Trazos (bajo los nodos) ───────────── */

function WiresUnder() {
  return (
    <>
      <Svg layout="d">
        <rect x={layout.boundary.d[0]} y={layout.boundary.d[1]} width={layout.boundary.d[2]} height={layout.boundary.d[3]} rx="12" className={s.boundary} />
        {wiresD.agents.map((d) => (
          <path key={d} d={d} className={s.wire} />
        ))}
        <path d={wiresD.lanes.ia1} className={s.wire} />
        <path d={wiresD.lanes.ia2} className={s.wire} />
      </Svg>
      <Svg layout="m">
        <rect x={layout.boundary.m[0]} y={layout.boundary.m[1]} width={layout.boundary.m[2]} height={layout.boundary.m[3]} rx="12" className={s.boundary} />
        {wiresM.agents.map((d) => (
          <path key={d} d={d} className={s.wire} />
        ))}
        <path d={wiresM.lanes.ia1} className={s.wire} />
        <path d={wiresM.lanes.ia2} className={s.wire} />
      </Svg>
    </>
  );
}

/* ───────────── Trazos (sobre los nodos): canal del broker y postes de la compuerta ───────────── */

function WiresOver() {
  const d = geo.d;
  const m = geo.m;
  return (
    <>
      <Svg layout="d">
        <rect x={d.brokerIn} y={d.channelY - 12} width={d.gateOut - d.brokerIn} height="24" className={s.track} />
        <path d={`M${d.brokerIn + 6} ${d.channelY}H${d.gateOut - 6}`} className={s.ticks} />
        <path d={`M${d.armX} ${d.channelY - 40}V${d.channelY - 17}M${d.armX} ${d.channelY + 17}V${d.channelY + 40}`} className={s.post} />
        {(Object.keys(wiresD.ports) as AgentId[]).map((agent) => (
          <circle key={agent} cx={wiresD.ports[agent][0]} cy={wiresD.ports[agent][1]} r="3.2" className={s.port} />
        ))}
        <circle cx={d.brokerIn} cy={d.channelY} r="3.2" className={s.port} />
        <circle cx={d.gateOut} cy={d.channelY} r="3.2" className={s.port} />
        <circle cx="800" cy={d.laneY.ia1} r="3.2" className={s.port} />
        <circle cx="800" cy={d.laneY.ia2} r="3.2" className={s.port} />
      </Svg>
      <Svg layout="m">
        <rect x={m.channelX - 12} y={m.brokerIn} width="24" height={m.gateOut - m.brokerIn} className={s.track} />
        <path d={`M${m.channelX} ${m.brokerIn + 6}V${m.gateOut - 6}`} className={s.ticks} />
        <path d={`M${m.channelX - 36} ${m.armY}H${m.channelX - 17}M${m.channelX + 17} ${m.armY}H${m.channelX + 36}`} className={s.post} />
        {(Object.keys(wiresM.ports) as AgentId[]).map((agent) => (
          <circle key={agent} cx={wiresM.ports[agent][0]} cy={wiresM.ports[agent][1]} r="3" className={s.port} />
        ))}
        <circle cx={m.channelX} cy={m.brokerIn} r="3" className={s.port} />
        <circle cx={m.laneX.ia1} cy={m.providerY} r="3" className={s.port} />
        <circle cx={m.laneX.ia2} cy={m.providerY} r="3" className={s.port} />
      </Svg>
    </>
  );
}

/** Brazo de la compuerta: pivota sobre el poste; gira para abrir el canal. */
function Arm() {
  const d = geo.d;
  const m = geo.m;
  return (
    // En la composición horizontal el brazo cuelga del poste superior (rotado 90°): su largo, 34 unidades, mide igual en x que en y.
    <At d={[d.armX, d.channelY - 17, 34, 0]} m={[m.channelX - 17, m.armY, 34, 0]} className={s.armWrap}>
      <span className={s.arm} style={run("sops-arm")}>
        <span className={s.armOn} style={run("sops-arm-on")} />
      </span>
    </At>
  );
}

/* ───────────── Nodos base (estáticos) ───────────── */

function Project({ id }: { id: "a" | "b" }) {
  const box = layout.projects[id];
  return (
    <At d={box.d} m={box.m} className={s.sandbox}>
      <div className={s.nodeHead}>
        <span className={cx(s.fsM, "font-medium text-bone")}>Proyecto {id.toUpperCase()}</span>
        <span className={cap("flex items-center gap-1.5")}>
          <Lock />
          <span className={s.wide}>aislado</span>
        </span>
      </div>
      <p className={cx(s.mono, s.fsS, "px-2.5 pt-1 text-mist")}>~/proyectos/{id}</p>
      <p className={cap(cx("absolute bottom-2.5 left-3", s.wide))}>contexto y reglas propios</p>
    </At>
  );
}

function Agent({ id }: { id: AgentId }) {
  const agent = agents[id];
  return (
    <At d={agent.d} m={agent.m} className={s.badge}>
      <span className={s.wideContents}>
        <AgentGlyph />
      </span>
      <span className="min-w-0 leading-tight md:flex md:flex-1 md:items-baseline md:justify-between md:gap-2">
        <span className={cx(s.mono, s.fsS, "block text-signal")}>{agent.name}</span>
        <span className={cx(s.mono, s.fsS, "block text-mist")}>{agent.role}</span>
      </span>
    </At>
  );
}

/** Contenido del inspector: la base solo lleva las etiquetas (idénticas a las del paso, sin texto fantasma). */
function InspectTop({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <p className={cap("flex items-center gap-2")}>
        operación
        {children && <span className={cx(s.wide, "text-signal")}>· en proceso</span>}
      </p>
      {children}
    </>
  );
}

function Broker() {
  const box = layout.broker;
  return (
    <>
      <At d={box.d} m={box.m} className={s.node}>
        <div className={cx(s.nodeHead, s.nodeHeadBare)}>
          <span className={cap("flex items-center gap-2 text-bone")}>
            <span className="size-1.5 rounded-full bg-signal" />
            Broker
          </span>
          <span className={cx(s.tag, s.wideFlex)}>orquestador</span>
        </div>
      </At>
      <At d={layout.inspectTop.d} m={layout.inspectTop.m}>
        <InspectTop />
      </At>
      <At d={layout.inspectLow.d} m={layout.inspectLow.m}>
        <p className={cap()}>ruta</p>
        <p className={cx(s.mono, s.fsS, "mt-1 text-fog")}>&nbsp;</p>
        <p className={cap("mt-2.5")}>alcance</p>
      </At>
      <At d={layout.queue.d} m={layout.queue.m} className={s.queue}>
        <p className={cap(s.queueLabel)}>cola</p>
        <div className={cx(s.mono, s.fsS, s.queueView)}>
          <div className={cx(s.queueStack, s.timeline)} style={{ ...run("sops-queue"), transform: `translateY(${(-QUEUE_STILL * QUEUE_ROW).toFixed(2)}em)` }}>
            {queueStates.map((ids, index) => (
              <p key={index} className={s.queueRow}>
                {ids.length ? (
                  ids.map((id, position) => (
                    <span key={id} className={position ? "text-fog" : "text-mist"}>
                      {position ? " · " : ""}
                      <span className={s.opPrefix}>op-</span>
                      {id.slice(3)}
                    </span>
                  ))
                ) : (
                  <span className="text-fog">vacía</span>
                )}
              </p>
            ))}
          </div>
        </div>
      </At>
    </>
  );
}

function LampRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <p className={cap()}>{label}</p>
      <div className="mt-1.5 flex items-center gap-1.5">{children}</div>
    </>
  );
}

function Gate() {
  return (
    <>
      <At d={layout.gate.d} m={layout.gate.m} className={s.node}>
        <div className={cx(s.nodeHead, s.nodeHeadBare)}>
          <span className={cap("flex items-center gap-1.5 text-bone")}>
            <Shield />
            Política
          </span>
          <span className={cap("md:hidden")}>compuerta</span>
        </div>
      </At>
      {(["permisos", "alcance"] as const).map((key) => (
        <At key={key} d={layout.lamps[key].d} m={layout.lamps[key].m}>
          <LampRow label={key}>
            <span className={s.lamp} />
          </LampRow>
        </At>
      ))}
    </>
  );
}

function Provider({ id }: { id: ProviderId }) {
  const box = layout.providers[id];
  return (
    <At d={box.d} m={box.m} className={s.node}>
      <div className={s.provider}>
        <p className={cap("flex items-center gap-2")}>
          <span className="size-1.5 rounded-full bg-fog" />
          carril {id === "ia1" ? "01" : "02"}
          <span className={s.wide}>· remoto</span>
        </p>
        <p className={cx(s.fsM, "mt-1 font-medium text-bone")}>{providerName[id]}</p>
      </div>
    </At>
  );
}

/* ───────────── Pasos sincronizados ───────────── */

function Inspector({ op, index }: { op: Op; index: number }) {
  const agent = agents[op.agent];
  const blocked = op.to === "bloqueada";
  const target: ProviderId = op.to === "bloqueada" ? "ia2" : op.to;
  const [x, y, w, h] = agent.d;
  const [mx, my, mw, mh] = agent.m;
  return (
    <Step at={inspectWindow(op, index)} fx="fade" rm={op.id === STILL ? undefined : "hide"} className={s.layer}>
      <At d={[x - 4, y - 4, w + 8, h + 8]} m={[mx - 1, my - 1, mw + 2, mh + 2]} className={s.focus} />
      <At d={layout.inspectTop.d} m={layout.inspectTop.m} className={s.cover}>
        <InspectTop>
          <p className={cx(s.mono, s.fsL, "mt-1.5 font-medium text-gold-300")}>{op.id}</p>
          <p className={cx(s.mono, s.fsS, "mt-1.5 text-mist")}>
            <span className="max-md:hidden">proyecto {agent.project} · </span>
            {agent.name}
          </p>
          <p className={cx(s.mono, s.fsS, "text-fog")}>tarea · {op.task}</p>
        </InspectTop>
      </At>
      <At d={layout.inspectLow.d} m={layout.inspectLow.m} className={s.cover}>
        <p className={cap()}>ruta</p>
        <p className={cx(s.mono, s.fsS, "mt-1", target === "ia1" ? "text-signal" : "text-cool")}>→ {providerName[target]}</p>
        <p className={cap("mt-2.5")}>alcance</p>
        <p className={cx(s.mono, s.fsS, "mt-1", blocked ? "text-rose" : "text-bone")}>
          {op.scope}
          {blocked && <span className={s.narrow}> ✕</span>}
        </p>
        {blocked ? (
          <p className={cx(s.mono, s.fsS, s.wideBlock, "text-rose/80")}>≠ proyecto {agent.project}</p>
        ) : (
          <p className={cx(s.mono, s.fsS, s.wideBlock, "text-fog")}>dentro del proyecto</p>
        )}
      </At>
    </Step>
  );
}

/** Veredicto: lámparas, carril abierto y proveedor que recibe; o barrera, tarjeta retenida y sello. */
function Verdict({ op }: { op: Op }) {
  const lane = op.to === "bloqueada" ? null : op.to;
  const cool = lane === "ia2";
  return (
    <Step at={verdictWindow(op)} fx="fade" rm={op.id === STILL ? undefined : "hide"} className={s.layer}>
      {lane && (
        <>
          <Svg layout="d">
            <path d={wiresD.open[lane]} className={cool ? s.laneCool : s.laneSignal} />
          </Svg>
          <Svg layout="m">
            <path d={wiresM.open[lane]} className={cool ? s.laneCool : s.laneSignal} />
          </Svg>
          <At d={layout.providers[lane].d} m={layout.providers[lane].m} className={cx(s.receive, cool && s.receiveCool)}>
            <div className={cx(s.provider, s.receiveBody, s.mono, s.fsS)}>
              <p className={cx("flex items-center gap-2", cool ? "text-cool" : "text-signal")}>
                <span className={cx("size-1.5 shrink-0 rounded-full", cool ? "bg-cool" : "bg-signal")} />
                <span className="truncate">
                  <span className={s.narrow}>← </span>
                  {op.id}
                  <span className={cx(s.wide, "text-mist")}> · en proceso</span>
                </span>
              </p>
              <p className={cx(s.wideBlock, "truncate text-fog")}>contexto · proyecto {agents[op.agent].project}</p>
            </div>
          </At>
        </>
      )}
      {(["permisos", "alcance"] as const).map((key) => {
        const denied = !lane && key === "alcance";
        return (
          <At key={key} d={layout.lamps[key].d} m={layout.lamps[key].m} className={s.cover}>
            <LampRow label={key}>
              <span className={cx(s.lamp, denied ? s.lampNo : s.lampOk)}>{denied ? "✕" : "✓"}</span>
              <span className={cx(s.mono, s.fsS, denied ? "text-rose" : "text-signal")}>{denied ? "denegado" : "permitido"}</span>
            </LampRow>
          </At>
        );
      })}
      {!lane && (
        <>
          <Svg layout="d">
            <path d={`M${geo.d.armX} ${geo.d.channelY - 16}V${geo.d.channelY + 16}`} className={s.barrier} />
            <rect x={geo.d.hold - 34} y={geo.d.channelY - 15} width="68" height="30" rx="6" className={s.ring} />
          </Svg>
          <Svg layout="m">
            <path d={`M${geo.m.channelX - 16} ${geo.m.armY}H${geo.m.channelX + 16}`} className={s.barrier} />
            <rect x={geo.m.channelX - 34} y={geo.m.hold - 13} width="68" height="26" rx="6" className={s.ring} />
          </Svg>
          <At d={[geo.d.hold, geo.d.channelY, 0, 0]} m={[geo.m.channelX, geo.m.hold, 0, 0]}>
            <span className={s.stillCard}>{op.id}</span>
          </At>
          <At d={layout.stamp.d} m={layout.stamp.m} className={s.stamp}>
            <span>✕ Bloqueada</span>
            <span className={s.wide}>por política</span>
          </At>
        </>
      )}
    </Step>
  );
}

/* ───────────── Tarjetas ───────────── */

function Cards({ packets, size }: { packets: typeof packetsD; size: [number, number] }) {
  return packets.map(({ op, points, at, hold }) => (
    <span key={op.id} className={s.card} style={{ "--op": `"${op.id}"` } as CSSProperties}>
      <Packet
        route={points}
        size={size}
        at={at}
        hold={hold}
        tone="signal"
        className={cx(s.op, op.to === "ia2" && s.cool, op.to === "bloqueada" && s.neutral)}
      />
    </span>
  ));
}

/* ───────────── Escenario ───────────── */

export function Stage() {
  return (
    <div className={s.stage}>
      <WiresUnder />

      <At d={layout.boundaryChip.d} m={layout.boundaryChip.m} className={cx(s.boundaryChip, s.fit, cap("text-signal"))}>
        <Laptop />
        local-first · en tu equipo
      </At>

      <Project id="a" />
      <Project id="b" />
      {(Object.keys(agents) as AgentId[]).map((id) => (
        <Agent key={id} id={id} />
      ))}
      <Broker />
      <Gate />
      <Provider id="ia1" />
      <Provider id="ia2" />
      <At d={layout.remote.d} m={layout.remote.m} className="hidden flex-col justify-center gap-1 md:flex">
        <p className={cap()}>fuera del equipo</p>
        <p className={cx(s.fsS, "text-fog")}>
          Cada proveedor solo recibe lo que la política permite<span className={s.wide}>, con el contexto de un proyecto</span>.
        </p>
      </At>

      <WiresOver />
      <Arm />

      {ops.map((op, index) => (
        <Inspector key={op.id} op={op} index={index} />
      ))}
      {ops.map((op) => (
        <Verdict key={op.id} op={op} />
      ))}

      <PacketLayer className="hidden md:block">
        <Cards packets={packetsD} size={[D.w, D.h]} />
      </PacketLayer>
      <PacketLayer className="md:hidden">
        <Cards packets={packetsM} size={[M.w, M.h]} />
      </PacketLayer>
    </div>
  );
}

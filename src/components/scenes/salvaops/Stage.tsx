import type { CSSProperties } from "react";
import { Packet, PacketLayer } from "@/components/motion/Packet";
import { Step } from "@/components/motion/Step";
import s from "../SalvaOpsScene.module.css";
import {
  agents,
  D,
  geo,
  inspectWindow,
  layout,
  M,
  ops,
  packetsD,
  packetsM,
  place,
  receiveWindow,
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

/* ───────────── Trazos (bajo los nodos) ───────────── */

function WiresUnder() {
  return (
    <>
      <svg viewBox={`0 0 ${D.w} ${D.h}`} preserveAspectRatio="none" className={cx(s.svg, "hidden md:block")} aria-hidden="true">
        <rect x={layout.boundary.d[0]} y={layout.boundary.d[1]} width={layout.boundary.d[2]} height={layout.boundary.d[3]} rx="12" className={s.boundary} />
        {wiresD.agents.map((d) => (
          <path key={d} d={d} className={s.wire} />
        ))}
        <path d={wiresD.lanes.ia1} className={s.wire} />
        <path d={wiresD.lanes.ia2} className={s.wire} />
        {/* Guías verticales del lienzo. */}
        <path d={`M766 30V400`} className={s.wireFaint} strokeDasharray="2 6" />
      </svg>
      <svg viewBox={`0 0 ${M.w} ${M.h}`} preserveAspectRatio="none" className={cx(s.svg, "md:hidden")} aria-hidden="true">
        <rect x={layout.boundary.m[0]} y={layout.boundary.m[1]} width={layout.boundary.m[2]} height={layout.boundary.m[3]} rx="12" className={s.boundary} />
        {wiresM.agents.map((d) => (
          <path key={d} d={d} className={s.wire} />
        ))}
        <path d={wiresM.lanes.ia1} className={s.wire} />
        <path d={wiresM.lanes.ia2} className={s.wire} />
      </svg>
    </>
  );
}

/* ───────────── Trazos (sobre los nodos): canal del broker y compuerta ───────────── */

function WiresOver() {
  const d = geo.d;
  const m = geo.m;
  return (
    <>
      <svg viewBox={`0 0 ${D.w} ${D.h}`} preserveAspectRatio="none" className={cx(s.svg, "hidden md:block")} aria-hidden="true">
        <rect x={d.brokerIn} y={d.channelY - 12} width={d.gateOut - d.brokerIn} height="24" className={s.track} />
        <path d={`M${d.brokerIn + 6} ${d.channelY}H${d.gateOut - 6}`} className={s.ticks} />
        {/* Compuerta: dos postes a los lados del canal. */}
        <path d={`M616 ${d.channelY - 40}V${d.channelY - 16}M616 ${d.channelY + 16}V${d.channelY + 40}`} className={s.post} />
        <path d={`M616 ${d.channelY - 11}V${d.channelY + 11}`} className={s.beam} />
        {(Object.keys(wiresD.ports) as AgentId[]).map((agent) => (
          <circle key={agent} cx={wiresD.ports[agent][0]} cy={wiresD.ports[agent][1]} r="3.2" className={s.port} />
        ))}
        <circle cx={d.brokerIn} cy={d.channelY} r="3.2" className={s.port} />
        <circle cx={d.gateOut} cy={d.channelY} r="3.2" className={s.port} />
        <circle cx="800" cy={d.laneY.ia1} r="3.2" className={s.port} />
        <circle cx="800" cy={d.laneY.ia2} r="3.2" className={s.port} />
      </svg>
      <svg viewBox={`0 0 ${M.w} ${M.h}`} preserveAspectRatio="none" className={cx(s.svg, "md:hidden")} aria-hidden="true">
        <rect x={m.channelX - 12} y={m.brokerIn} width="24" height={m.gateOut - m.brokerIn} className={s.track} />
        <path d={`M${m.channelX} ${m.brokerIn + 6}V${m.gateOut - 6}`} className={s.ticks} />
        <path d={`M${m.channelX - 34} ${m.postY}H${m.channelX - 16}M${m.channelX + 16} ${m.postY}H${m.channelX + 34}`} className={s.post} />
        <path d={`M${m.channelX - 11} ${m.postY}H${m.channelX + 11}`} className={s.beam} />
        {(Object.keys(wiresM.ports) as AgentId[]).map((agent) => (
          <circle key={agent} cx={wiresM.ports[agent][0]} cy={wiresM.ports[agent][1]} r="3" className={s.port} />
        ))}
        <circle cx={m.channelX} cy={m.brokerIn} r="3" className={s.port} />
        <circle cx={m.laneX.ia1} cy={m.providerY} r="3" className={s.port} />
        <circle cx={m.laneX.ia2} cy={m.providerY} r="3" className={s.port} />
      </svg>
    </>
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
        <p className={cap()}>operación</p>
        <p className={cx(s.mono, s.fsS, "mt-1.5 text-fog")}>— en espera</p>
      </At>
      <At d={layout.inspectLow.d} m={layout.inspectLow.m}>
        <p className={cap()}>ruta</p>
        <p className={cx(s.mono, s.fsS, "mt-1 text-fog")}>—</p>
        <p className={cap("mt-3")}>alcance</p>
        <p className={cx(s.mono, s.fsS, "mt-1 text-fog")}>—</p>
      </At>
      <At d={layout.brokerFoot.d} m={layout.brokerFoot.m} className={cx(s.brokerFoot, s.wideBlock)}>
        <p className={cap()}>proveedores</p>
        <p className={cx(s.mono, s.fsS, "mt-1.5 flex items-center gap-3 text-mist")}>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-signal" />
            IA 1
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-cool" />
            IA 2
          </span>
          <span className="text-fog">disponibles</span>
        </p>
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
            <span className={cx(s.mono, s.fsS, "text-fog")}>espera</span>
          </LampRow>
        </At>
      ))}
    </>
  );
}

/** Caja del estado de un proveedor: la comparten el estado base y el paso que recibe la operación. */
const statusBox = (id: ProviderId) => {
  const [x, y, w, h] = layout.providers[id].d;
  const [mx, my, mw, mh] = layout.providers[id].m;
  return { d: [x + 24, y + h - 46, w - 34, 36] as Box, m: [mx + 10, my + mh - 38, mw - 18, 30] as Box };
};

function Provider({ id }: { id: ProviderId }) {
  const box = layout.providers[id];
  const status = statusBox(id);
  return (
    <>
      <At d={box.d} m={box.m} className={s.node}>
        <div className={s.provider}>
          <p className={cap("hidden md:block")}>
            carril {id === "ia1" ? "01" : "02"} <span className={s.wide}>· remoto</span>
          </p>
          <p className={cx(s.fsM, "font-medium text-bone md:mt-1")}>{providerName[id]}</p>
        </div>
      </At>
      <At d={status.d} m={status.m} className={cx(s.mono, s.fsS, s.status)}>
        <p className="flex items-center gap-2 text-mist">
          <span className="size-1.5 rounded-full bg-fog" />
          listo
        </p>
        <p className="text-fog">contexto · —</p>
      </At>
    </>
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
    <Step at={inspectWindow(op, index)} fx="fade" rm={op.id === "op-015" ? undefined : "hide"} className={s.layer}>
      <At d={[x - 4, y - 4, w + 8, h + 8]} m={[mx - 3, my - 3, mw + 6, mh + 6]} className={s.focus} />
      <At d={layout.inspectTop.d} m={layout.inspectTop.m} className={s.cover}>
        <p className={cap("flex items-center gap-2")}>
          operación <span className="hidden text-signal md:inline">· en proceso</span>
        </p>
        <p className={cx(s.mono, s.fsL, "mt-1.5 font-medium text-gold-300")}>{op.id}</p>
        <p className={cx(s.mono, s.fsS, "mt-1.5 text-mist")}>
          proyecto {agent.project} · {agent.name}
        </p>
        <p className={cx(s.mono, s.fsS, "text-fog")}>tarea · {op.task}</p>
      </At>
      <At d={layout.inspectLow.d} m={layout.inspectLow.m} className={s.cover}>
        <p className={cap()}>ruta</p>
        <p className={cx(s.mono, s.fsS, "mt-1", target === "ia1" ? "text-signal" : "text-cool")}>→ {providerName[target]}</p>
        <p className={cap("mt-3")}>alcance</p>
        <p className={cx(s.mono, s.fsS, "mt-1", blocked ? "text-rose" : "text-bone")}>{op.scope}</p>
        {blocked ? (
          <p className={cx(s.mono, s.fsS, "text-rose/80")}>fuera de proyecto {agent.project}</p>
        ) : (
          <p className={cx(s.mono, s.fsS, "hidden text-fog md:block")}>dentro del proyecto</p>
        )}
      </At>
    </Step>
  );
}

function Verdict({ op }: { op: Op }) {
  const blocked = op.to === "bloqueada";
  const lane = op.to === "bloqueada" ? null : op.to;
  return (
    <Step at={verdictWindow(op)} fx="fade" rm={op.id === "op-015" ? undefined : "hide"} className={s.layer}>
      {lane && (
        <>
          <svg viewBox={`0 0 ${D.w} ${D.h}`} preserveAspectRatio="none" className={cx(s.svg, "hidden md:block")} aria-hidden="true">
            <path d={wiresD.open[lane]} className={lane === "ia1" ? s.laneSignal : s.laneCool} />
          </svg>
          <svg viewBox={`0 0 ${M.w} ${M.h}`} preserveAspectRatio="none" className={cx(s.svg, "md:hidden")} aria-hidden="true">
            <path d={wiresM.open[lane]} className={lane === "ia1" ? s.laneSignal : s.laneCool} />
          </svg>
        </>
      )}
      {(["permisos", "alcance"] as const).map((key) => {
        const denied = blocked && key === "alcance";
        return (
          <At key={key} d={layout.lamps[key].d} m={layout.lamps[key].m} className={s.cover}>
            <LampRow label={key}>
              <span className={cx(s.lamp, denied ? s.lampNo : s.lampOk)}>{denied ? "✕" : "✓"}</span>
              <span className={cx(s.mono, s.fsS, denied ? "text-rose" : "text-signal")}>{denied ? "denegado" : "permitido"}</span>
            </LampRow>
          </At>
        );
      })}
      {blocked && (
        <>
          <svg viewBox={`0 0 ${D.w} ${D.h}`} preserveAspectRatio="none" className={cx(s.svg, "hidden md:block")} aria-hidden="true">
            <path d={`M616 ${geo.d.channelY - 15}V${geo.d.channelY + 15}`} className={s.barrier} />
            <rect x={geo.d.hold - 34} y={geo.d.channelY - 15} width="68" height="30" rx="6" className={s.ring} />
          </svg>
          <svg viewBox={`0 0 ${M.w} ${M.h}`} preserveAspectRatio="none" className={cx(s.svg, "md:hidden")} aria-hidden="true">
            <path d={`M${geo.m.channelX - 15} ${geo.m.postY}H${geo.m.channelX + 15}`} className={s.barrier} />
            <rect x={geo.m.channelX - 34} y={geo.m.hold - 13} width="68" height="26" rx="6" className={s.ring} />
          </svg>
          <At d={[geo.d.hold - 30, geo.d.channelY - 10, 60, 20]} m={[geo.m.channelX - 30, geo.m.hold - 10, 60, 20]} className={s.stillCard}>
            {op.id}
          </At>
          <At d={layout.stamp.d} m={layout.stamp.m} className={s.stamp}>
            <span>✕ Bloqueada</span>
            <span>por política</span>
          </At>
        </>
      )}
    </Step>
  );
}

/** Última operación que recibe cada proveedor: es la que queda en la vista estática. */
const latest = new Set((["ia1", "ia2"] as const).map((id) => ops.filter((op) => op.to === id).at(-1)?.id));

function Receive({ op }: { op: Op }) {
  if (op.to === "bloqueada") return null;
  const box = layout.providers[op.to];
  const cool = op.to === "ia2";
  const status = statusBox(op.to);
  return (
    <Step at={receiveWindow(op)} fx="fade" rm={latest.has(op.id) ? undefined : "hide"} className={s.layer}>
      <At d={box.d} m={box.m} className={cx(s.receive, cool && s.receiveCool)} />
      <At d={status.d} m={status.m} className={cx(s.cover, s.mono, s.fsS, s.status)}>
        <p className={cx("flex items-center gap-2", cool ? "text-cool" : "text-signal")}>
          <span className={cx("size-1.5 shrink-0 rounded-full", cool ? "bg-cool" : "bg-signal")} />
          <span className="truncate">
            {op.id} <span className="text-mist">· en proceso</span>
          </span>
        </p>
        <p className="truncate text-mist">contexto · proyecto {agents[op.agent].project}</p>
      </At>
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

      <At d={layout.boundaryChip.d} m={layout.boundaryChip.m} className={cx(s.boundaryChip, cap("text-signal"))}>
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
      <At d={[812, 190, 180, 64]} m={[0, 0, 0, 0]} className="hidden flex-col justify-center gap-1 md:flex">
        <p className={cap()}>fuera del equipo</p>
        <p className={cx(s.fsS, "text-fog")}>Solo recibe lo que la política permite, con el contexto de un proyecto.</p>
      </At>

      <WiresOver />

      {ops.map((op, index) => (
        <Inspector key={op.id} op={op} index={index} />
      ))}
      {ops.map((op) => (
        <Verdict key={op.id} op={op} />
      ))}
      {ops.map((op) => (
        <Receive key={op.id} op={op} />
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

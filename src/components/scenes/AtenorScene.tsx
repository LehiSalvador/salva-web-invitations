import type { CSSProperties } from "react";
import { Packet, PacketLayer } from "@/components/motion/Packet";
import { Step } from "@/components/motion/Step";
import {
  BAND,
  BAND_SIZE,
  BUS_L,
  BUS_R,
  COLS,
  CYCLE,
  END,
  FINAL,
  INTENTS,
  LANES,
  LOG_FINAL,
  LOG_LINES,
  MESSAGES,
  NODES,
  PORTS,
  SCENE_CSS,
  STAGE_H,
  STAGE_SIZE,
  WIRES,
  Y0,
  Y1,
  arrivalClock,
  win,
  type Message,
} from "@/components/scenes/atenor/timeline";
import s from "@/components/scenes/AtenorScene.module.css";

export { AtenorPreview } from "@/components/scenes/atenor/Preview";

/*
 * Atenor System: bandeja inteligente multinegocio.
 * Tres negocios escriben por WhatsApp; cada mensaje viaja al núcleo (Recepción → Comprensión con IA → Regla → Ruta),
 * se clasifica por intención, cae como tarjeta en su área (Atención, Clientes u Operación) y la respuesta vuelve
 * al chat de origen. Un registro del sistema acompaña cada evento. Los tiempos salen de timeline.ts.
 *
 * Animaciones (escritorio): 12 de paquetes, 9 Step, 4 nodos, 1 tarjeta en proceso, 3 chats, 3 estados,
 * 3 indicadores de "escribiendo", 1 registro y 1 anillo = 37.
 */

const vars = (values: Record<string, string | number>) => values as CSSProperties;
const at = (x: number, y: number) => vars({ "--x": `${x / 10}%`, "--y": `${y}px` });
/** Siguiente mensaje en llegar al núcleo (para relevar la intención encendida). */
const nextArrival = (index: number) => (index < MESSAGES.length - 1 ? MESSAGES[index + 1].times.portIn - 0.3 : END);

const STAGES = [
  { index: "01", name: "Recepción" },
  { index: "02 · IA", name: "Comprensión" },
  { index: "03", name: "Regla" },
  { index: "04", name: "Ruta" },
];

function ColumnHead({ n, title, note }: { n: string; title: string; note: string }) {
  return (
    <div className={s.colHead}>
      <span className={s.colIndex}>{n}</span>
      <span className={s.colTitle}>{title}</span>
      <span className={s.colNote}>{note}</span>
    </div>
  );
}

function Ticks() {
  return (
    <svg viewBox="0 0 16 10" className={s.ticks} aria-hidden="true">
      <path d="M1 5.5l2.6 2.6L9 2.4M6.4 8.1L12 2.4" />
    </svg>
  );
}

function Thread({ message }: { message: Message }) {
  const { times, index } = message;
  return (
    <div className={s.thread}>
      <Step at={win(times.bubble + 0.2, times.replyArrive + 0.1)} fx="fade" rm="hide" className={s.threadLive} />
      <div className={s.threadHead}>
        <span className={s.avatar}>{message.initial}</span>
        <span className={s.threadName}>
          <span className={s.nameLong}>Negocio {message.n} · </span>
          <span className={s.nameShort}>N{message.n} · </span>
          <span className={s.nameBiz}>{message.biz}</span>
        </span>
        <span className={s.status}>
          <span data-atn={`status-${index}`} className={s.statusList} style={vars({ "--final": `${FINAL.status}px` })}>
            <span>
              <i className={s.onlineDot} />
              en línea
            </span>
            <span className={s.statusTyping}>
              escribiendo
              <span className={s.dots}>
                <i />
                <i />
                <i />
                <b data-atn={`dots-${index}`} />
              </span>
            </span>
            <span className={s.statusBusy}>
              <i className={s.busyDot} />
              procesando
            </span>
            <span className={s.statusDone}>
              <Ticks />
              respondido
            </span>
          </span>
        </span>
      </div>
      <div className={s.chat}>
        <div data-atn={`chat-${index}`} className={s.chatList} style={vars({ "--final": `${FINAL.chat}px` })}>
          <span className={`${s.bubbleIn} ${s.old}`}>{message.history.in}</span>
          <span className={`${s.bubbleOut} ${s.old}`}>
            <span className={s.bubbleText}>{message.history.out}</span>
            <span className={`${s.sent} ${s.sentOld}`}>
              {message.history.when}
              <Ticks />
            </span>
          </span>
          <span className={s.bubbleIn}>{message.text}</span>
          <span className={s.bubbleOut}>
            <span className={s.bubbleText}>{message.reply}</span>
            <span className={s.sent}>
              <Ticks />
              Respuesta enviada
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

function Lane({ index }: { index: number }) {
  const lane = LANES[index];
  const message = MESSAGES.find((candidate) => candidate.lane === index);
  return (
    <div className={s.lane}>
      <div className={s.laneHead}>
        <span className={s.laneName}>{lane.name}</span>
        <span className={s.laneSub}>{lane.sub}</span>
      </div>
      <div className={s.laneBody}>
        <div className={s.laneSlot}>
          {message && (
            <Step at={win(message.times.dock - 0.05, END)} fx="left" className={s.laneCard}>
              <span className={s.laneCardTop}>
                <span className={s.laneCardTitle}>{message.card.title}</span>
                <span className={s.badge}>nuevo</span>
              </span>
              <span className={s.laneCardMeta}>
                {message.card.ref} · {message.biz} · {message.card.detail}
              </span>
            </Step>
          )}
        </div>
        <div className={s.laneOld}>
          <span className={s.laneOldText}>
            {lane.old.ref} · {lane.old.text}
          </span>
          <span className={s.laneOldState}>{lane.old.state}</span>
        </div>
      </div>
    </div>
  );
}

function Core() {
  const y0 = BAND.y0 * 10;
  const y1 = BAND.y1 * 10;
  return (
    <div className={s.core}>
      <div className={s.coreHead}>
        <span className={s.coreTitle}>
          <span className={s.coreGlyph} />
          Núcleo
        </span>
        <span className={s.coreHeadNote}>4 etapas</span>
      </div>

      {/* Tarjeta en proceso: una tira que avanza al llegar cada mensaje (la anterior sale por arriba). */}
      <div className={s.cardSlot}>
        <div data-atn="card" className={s.cardStrip} style={vars({ "--final": FINAL.card })}>
          <div className={s.cardIdle}>esperando mensajes</div>
          {MESSAGES.map((message) => (
            <div key={message.op} className={s.card}>
              <span className={s.cardTop}>
                <span>
                  <span className="text-bone">{message.op}</span> · N{message.n} {message.biz}
                </span>
                <span className={s.cardTime}>{arrivalClock(message)}</span>
              </span>
              <span className={s.cardText}>“{message.text}”</span>
              <span className={s.cardMeta}>contexto del cliente cargado</span>
            </div>
          ))}
        </div>
      </div>

      <div className={s.band}>
        <svg viewBox={`0 0 1000 ${BAND.height * 10}`} preserveAspectRatio="none" className={s.bandLines} aria-hidden="true">
          <path d={`M0 ${y0}H1000`} className={s.mainLine} />
          <path d={`M${NODES[3] * 10} ${y0}V${y1}H0`} className={s.returnLine} />
        </svg>
        <span className={s.iaGlow} style={vars({ "--x": `${NODES[1]}%` })} />
        <span className={`${s.iaRing} spin`} style={vars({ "--x": `${NODES[1]}%`, "--dur": "9s" })} />
        {STAGES.map((stage, index) => (
          <div key={stage.name} className={`${s.node} ${index === 1 ? s.nodeIa : ""}`} style={vars({ "--x": `${NODES[index]}%` })}>
            <span className={s.nodeLabel}>
              <span className={s.nodeIndex}>{stage.index}</span>
              <span className={s.nodeName}>{stage.name}</span>
            </span>
            <span className={s.nodeDot}>{index === 1 && "IA"}</span>
            <span data-atn={`node-${index}`} className={s.nodeLit}>
              <span className={s.nodeLabel}>
                <span className={s.nodeIndex}>{stage.index}</span>
                <span className={s.nodeName}>{stage.name}</span>
              </span>
              <span className={s.nodeDot}>{index === 1 && "IA"}</span>
            </span>
          </div>
        ))}
        <span className={s.returnLabel}>← respuesta al chat</span>
        <div className={s.bandPackets}>
          <PacketLayer>
            {MESSAGES.map((message) => (
              <Packet key={message.op} size={BAND_SIZE} kind="msg" tone="signal" className={s.pkMain} route={message.packets.band.route} at={message.packets.band.at} />
            ))}
            {MESSAGES.map((message) => (
              <Packet key={`${message.op}-r`} size={BAND_SIZE} kind="msg" tone="gold" route={message.packets.bandReply.route} at={message.packets.bandReply.at} />
            ))}
          </PacketLayer>
        </div>
      </div>

      <div className={s.intents}>
        <span className={s.blockLabel}>Intención detectada</span>
        <div className={s.chips}>
          {INTENTS.map((intent) => (
            <span key={intent} className={s.chip}>
              {intent}
            </span>
          ))}
        </div>
        <span className={`${s.blockLabel} ${s.dataLabel}`}>Datos extraídos</span>
        <span className={s.dataLine} />
        {MESSAGES.map((message) => (
          <Step
            key={message.op}
            at={win(message.times.orbitOut - 0.35, nextArrival(message.index))}
            fx="fade"
            rm={message.index < MESSAGES.length - 1 ? "hide" : undefined}
            className={s.intentsLit}
          >
            <span className={s.chips}>
              {INTENTS.map((intent) =>
                intent === message.intent ? (
                  <span key={intent} className={`${s.chip} ${s.chipOn}`}>
                    {intent}
                  </span>
                ) : (
                  <span key={intent} />
                ),
              )}
            </span>
            <span className={`${s.blockLabel} ${s.dataLabel} invisible`}>Datos extraídos</span>
            <span className={`${s.dataLine} ${s.dataOn}`}>{message.data}</span>
          </Step>
        ))}
      </div>
    </div>
  );
}

/** Conexiones del escenario de escritorio: canal WhatsApp (izquierda) y acciones hacia las áreas (derecha). */
function Wires() {
  return (
    <>
      <svg viewBox={`0 0 1000 ${STAGE_H}`} preserveAspectRatio="none" className={s.wires} aria-hidden="true">
        {WIRES.inbound.map((d, index) => (
          <path key={`i${index}`} d={d} className={s.wire} />
        ))}
        <path d={WIRES.reply} className={`${s.wire} ${s.wireReply}`} />
        {WIRES.outbound.map((d, index) => (
          <path key={`o${index}`} d={d} className={s.wire} />
        ))}
      </svg>
      <div className={s.desktopOnly}>
        {PORTS.map((y) => (
          <span key={`tp${y}`} className={s.port} style={at(COLS.inbox[1], y)} />
        ))}
        {PORTS.map((y) => (
          <span key={`lp${y}`} className={`${s.port} ${s.portGold}`} style={at(COLS.lanes[0], y)} />
        ))}
        <span className={`${s.port} ${s.portSignal}`} style={at(COLS.core[0], Y0)} />
        <span className={`${s.port} ${s.portGold}`} style={at(COLS.core[0], Y1)} />
        <span className={`${s.port} ${s.portSignal}`} style={at(COLS.core[1], Y0)} />
        <span className={s.joint} style={at(BUS_L, Y0)} />
        <span className={s.joint} style={at(BUS_L, Y1)} />
        <span className={s.joint} style={at(BUS_R, Y0)} />
        <span className={`${s.busLabel} ${s.busLabelLeft}`} style={at(BUS_L, (PORTS[0] + Y0) / 2)}>
          canal whatsapp
        </span>
        <span className={`${s.busLabel} ${s.busLabelRight}`} style={at(BUS_R, (PORTS[0] + Y0) / 2)}>
          acciones
        </span>
      </div>
      <div className={s.stagePackets}>
        <PacketLayer>
          {MESSAGES.map((message) => (
            <Packet
              key={message.op}
              size={STAGE_SIZE}
              kind="msg"
              tone="signal"
              className={s.pkMain}
              route={message.packets.main.route}
              at={message.packets.main.at}
              hold={message.packets.main.hold}
            />
          ))}
          {MESSAGES.map((message) => (
            <Packet
              key={`${message.op}-r`}
              size={STAGE_SIZE}
              kind="msg"
              tone="gold"
              route={message.packets.reply.route}
              at={message.packets.reply.at}
              hold={message.packets.reply.hold}
            />
          ))}
        </PacketLayer>
      </div>
    </>
  );
}

function MobileLink({ label }: { label: string }) {
  return (
    <div className={s.mlink}>
      <span className={s.mlinkLine} />
      <span className={s.mlinkLabel}>{label}</span>
    </div>
  );
}

const TONES = { mist: s.tMist, signal: s.tSignal, cool: s.tCool, gold: s.tGold };

function SystemLog() {
  return (
    <div className={s.log}>
      <div className={s.panelHead}>
        <span>Registro del sistema</span>
        <span className={s.panelHeadNote}>en vivo</span>
      </div>
      <div className={s.logView}>
        <span className={s.logCursor} />
        <ol data-atn="log" className={s.logList} style={vars({ "--final": `${LOG_FINAL}px` })}>
          {LOG_LINES.map((line, index) => (
            <li key={index} className={s.logLine}>
              <span className={s.logTime}>{line.time}</span>
              <span className={TONES[line.tone]}>{line.tag}</span>
              <span className={s.logText}>{line.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function SystemStatus() {
  const rows = [
    ["Negocios", "Cafetería · Taller · Clínica"],
    ["IA principal", "Proveedor IA 1"],
    ["IA de respaldo", "Proveedor IA 2"],
    ["Reglas", "por negocio"],
    ["Historial", "por cliente"],
  ];
  return (
    <div className={s.system}>
      <div className={s.panelHead}>
        <span>Sistema</span>
        <span className={s.panelHeadNote}>simulación</span>
      </div>
      <dl className={s.systemList}>
        {rows.map(([key, value]) => (
          <div key={key} className={s.systemRow}>
            <dt>{key}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className={s.legend}>
        <span>
          <i className={s.legendMsg} /> mensaje
        </span>
        <span>
          <i className={s.legendReply} /> respuesta
        </span>
        <span>
          <i className={s.legendCard} /> acción
        </span>
      </div>
    </div>
  );
}

/** Simulación principal del case study. */
export function AtenorScene() {
  return (
    <div aria-hidden="true" data-live data-cycle={CYCLE} className={s.scene}>
      <style>{SCENE_CSS}</style>
      <div className={s.stage}>
        <Wires />
        <div className={`${s.col} ${s.colInbox}`}>
          <ColumnHead n="01" title="Bandeja WhatsApp" note="3 negocios" />
          <div className={s.rows}>
            {MESSAGES.map((message) => (
              <Thread key={message.op} message={message} />
            ))}
          </div>
        </div>
        <MobileLink label="canal whatsapp ↓↑" />
        <div className={`${s.col} ${s.colCore}`}>
          <ColumnHead n="02" title="Automatización + IA" note="pipeline" />
          <Core />
        </div>
        <MobileLink label="acciones ↓" />
        <div className={`${s.col} ${s.colLanes}`}>
          <ColumnHead n="03" title="Áreas del negocio" note="destino" />
          <div className={s.rows}>
            {LANES.map((lane, index) => (
              <Lane key={lane.name} index={index} />
            ))}
          </div>
        </div>
      </div>
      <div className={s.bottom}>
        <SystemLog />
        <SystemStatus />
      </div>
    </div>
  );
}

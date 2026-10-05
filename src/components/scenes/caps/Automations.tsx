import type { CSSProperties } from "react";
import { Packet, PacketLayer } from "@/components/motion/Packet";
import { Step } from "@/components/motion/Step";
import styles from "../CapsScene.module.css";
import { lastLine } from "./Store";
import { A, LOG, LOG_LINE, LOG_ROWS, RUN, T } from "./timeline";

const ROW = 50;
const PIPE = ROW * 4;

const automations = [
  { title: "Pedido registrado", detail: "Base de pedidos", icon: "M3 4.5c0-1.1 2.2-2 5-2s5 .9 5 2v7c0 1.1-2.2 2-5 2s-5-.9-5-2zM3 4.5c0 1.1 2.2 2 5 2s5-.9 5-2M3 8c0 1.1 2.2 2 5 2s5-.9 5-2" },
  { title: "Confirmación enviada", detail: "Correo al cliente", icon: "M2.5 4h11v8h-11zM2.5 4.4L8 8.6l5.5-4.2" },
  { title: "Inventario actualizado", detail: "Gorra 05 · talla M", icon: "M2.5 6.5L8 3.5l5.5 3v6L8 15.5l-5.5-3zM2.5 6.5L8 9.5l5.5-3M8 9.5v6" },
  { title: "Envío preparado", detail: "Guía y empaque", icon: "M1.5 4.5h8v7h-8zM9.5 7h3l2 2.2v2.3h-5M4.5 12.8a1.2 1.2 0 1 0 0-.1M12 12.8a1.2 1.2 0 1 0 0-.1" },
];

const TAGS: Record<(typeof LOG)[number]["tag"], string> = {
  ui: "text-fog",
  cart: "text-gold-300",
  api: "text-cool",
  auto: "text-signal",
  ok: "text-gold-300",
};

function Glyph({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 16 16" className={styles.icon} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function Status({ index }: { index: number }) {
  return (
    <span className={styles.status}>
      <span className={`${styles.ticker} ${A.row(index)}`} style={lastLine(3)}>
        <span className="text-fog">en espera</span>
        <span className="text-cool">
          <i className={styles.runDot} /> ejecutando
        </span>
        <span className="text-signal">listo ✓</span>
      </span>
    </span>
  );
}

/** Panel del sistema: el pedido dispara cuatro automatizaciones y un registro de eventos. */
export function Automations() {
  return (
    <div className={styles.auto}>
      {/* Conector tienda → automatizaciones (horizontal en escritorio, vertical apilado). */}
      <span className={styles.connector}>
        <span className={styles.connectorLine} />
        <span className={`${styles.emit} ${A.emit}`} />
      </span>

      <div className={styles.autoHead}>
        <span className="label text-bone">Automatizaciones</span>
        <span className="label flex items-center gap-2 text-fog">
          <span className="live-dot" /> activas
        </span>
      </div>

      <div className={styles.trigger}>
        <Step at={[T.trigger, T.out]} fx="fade" className={styles.triggerGlow} />
        <span className={styles.triggerIcon}>
          <Glyph d="M9 1.5L3.5 9h4L6.5 14.5L12.5 7h-4z" />
        </span>
        <span className="min-w-0">
          <span className={`${styles.tl} block text-fog`}>Disparador</span>
          <span className="block truncate font-mono text-[12px] text-bone">pedido.confirmado</span>
        </span>
        <span className={styles.status}>
          <span className={`${styles.ticker} ${A.trigger}`} style={lastLine(2)}>
            <span className="text-fog">
              <i className={`${styles.waitDot} pulse`} /> esperando
            </span>
            <span className="text-signal">recibido</span>
          </span>
        </span>
      </div>

      <div className={styles.pipe} style={{ height: PIPE }}>
        <span className={styles.rail} style={{ top: ROW / 2, height: PIPE - ROW }} />
        <span className={`${styles.railFill} ${A.pipe}`} style={{ top: ROW / 2, height: PIPE - ROW }} />
        <div className="absolute top-0 left-0 h-full w-[30px]">
          <PacketLayer>
            <Packet
              size={[30, PIPE]}
              route={[
                [15, ROW / 2],
                [15, PIPE - ROW / 2],
              ]}
              at={[T.rows[0], T.rows[3] + RUN]}
              hold={RUN / (T.rows[3] + RUN - T.rows[0])}
            />
          </PacketLayer>
        </div>
        {automations.map((item, index) => (
          <div key={item.title} className={styles.row} style={{ height: ROW, "--i": index } as CSSProperties}>
            <span className={styles.node} />
            <span className={styles.rowIcon}>
              <Glyph d={item.icon} />
            </span>
            <span className="min-w-0">
              <span className={styles.rowTitle}>{item.title}</span>
              <span className={styles.rowDetail}>{item.detail}</span>
            </span>
            <Status index={index} />
          </div>
        ))}
      </div>

      <Step at={[T.done, T.out]} fx="up" className={styles.done}>
        <span className="text-signal">✓</span> Flujo completado <span className="text-fog">· sin pasos manuales</span>
      </Step>

      <div className={styles.log}>
        <div className={`${styles.tl} flex items-center justify-between text-fog`}>
          <span>Registro de eventos</span>
          <span className="text-mist">en vivo</span>
        </div>
        <div className={styles.logWindow} style={{ height: LOG_ROWS * LOG_LINE }}>
          <div className={`${styles.logColumn} ${A.log}`}>
            {LOG.map((event) => (
              <span key={event.text} className={styles.logLine} style={{ height: LOG_LINE }}>
                <span className={`${styles.logTag} ${TAGS[event.tag]}`}>{event.tag}</span>
                <span className="truncate text-mist">{event.text}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

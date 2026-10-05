import type { CSSProperties } from "react";
import { Step } from "@/components/motion/Step";
import styles from "./CapsScene.module.css";
import { Automations } from "./caps/Automations";
import { Cap3D } from "./caps/Cap3D";
import { CapArt } from "./caps/CapArt";
import { lastLine, StoreWindow } from "./caps/Store";
import { A, CYCLE, products, sceneCss, TARGET } from "./caps/timeline";

/*
 * Salva Exclusive Caps: simulación del recorrido de compra en la tienda en línea de un negocio cliente.
 * Catálogo → producto (gorra en 3D sobre tornamesa) → carrito → pedido confirmado con comprobante impreso;
 * el pedido dispara las automatizaciones del panel derecho. Todo va en una sola línea de tiempo (caps/timeline).
 */

const css = sceneCss();
const stages = ["Catálogo", "Producto", "Pedido", "Automatizaciones"];

function Tracker() {
  return (
    <div className={styles.tracker}>
      <div className="relative hidden grid-cols-4 sm:grid">
        <span className={`${styles.mark} ${A.mark}`} style={{ transform: "translate3d(300%, 0, 0)" }} />
        {stages.map((stage, index) => (
          <span key={stage} className={styles.stageLabel}>
            <span className="text-signal">0{index + 1}</span> {stage}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3 sm:hidden">
        <span className="label text-fog">Recorrido</span>
        <span className={styles.stageSlot}>
          <span className={`${styles.ticker} ${A.stage}`} style={lastLine(4)}>
            {stages.map((stage, index) => (
              <span key={stage}>
                <span className="text-signal">0{index + 1}</span> {stage}
              </span>
            ))}
          </span>
        </span>
      </div>
      <span className={styles.track}>
        <span className={`${styles.fill} ${A.fill}`} />
      </span>
    </div>
  );
}

/** Simulación principal del case study (ocupa el ancho del visor). */
export function CapsScene() {
  return (
    <div data-live data-cycle={CYCLE} aria-hidden="true" className={styles.scene}>
      <style href="caps-scene-timeline" precedence="default">
        {css}
      </style>
      <Tracker />
      <div className={styles.layout}>
        <StoreWindow />
        <Automations />
      </div>
    </div>
  );
}

/* ---------- Vista previa (showcase y tarjetas del índice) ---------- */

const PREVIEW_CYCLE = 9000;
const P = { pick: 0.17, view2: 0.3, add: 0.49, toast: 0.58, rows: [0.64, 0.7, 0.76, 0.82], out: 0.95 };
const previewRows = ["Pedido registrado", "Confirmación enviada", "Inventario actualizado", "Envío preparado"];
const target = products[TARGET];

/** Vista previa compacta: catálogo → producto → pedido confirmado, con las automatizaciones al lado. */
export function CapsPreview() {
  return (
    <div data-live data-cycle={PREVIEW_CYCLE} aria-hidden="true" className={styles.preview}>
      <div className={styles.pvStore}>
        <div className={styles.pvChrome}>
          <span className="flex gap-1">
            <i className={styles.chromeDot} />
            <i className={styles.chromeDot} />
            <i className={styles.chromeDot} />
          </span>
          <span className="truncate">exclusive-caps · tienda</span>
        </div>
        <div className={styles.pvView}>
          <Step at={[0, P.view2]} fx="left" rm="hide" className={styles.pvGrid}>
            {products.map((product, index) => (
              <span key={product.id} className={styles.pvCard}>
                <CapArt color={product.color} />
                <span className={styles.pvName}>Gorra {product.id}</span>
                {index === TARGET && (
                  <Step at={[P.pick, P.view2]} fx="scale" rm="hide" className={styles.pvPicked}>
                    <span className={styles.pvTap} />
                  </Step>
                )}
              </span>
            ))}
          </Step>
          <Step at={[P.view2, P.out]} fx="right" className={styles.pvProduct}>
            <span className={styles.pvTurntable}>
              <Cap3D color={target.color} />
            </span>
            <span className={styles.pvInfo}>
              <span className={styles.pvTitle}>
                Gorra {target.id} <span className="text-mist">· {target.name}</span>
              </span>
              <span className={styles.pvSwatches}>
                {products.map((product, index) => (
                  <i key={product.id} className={`${styles.pvSwatch} ${index === TARGET ? styles.swatchOn : ""}`} style={{ "--cap": product.color } as CSSProperties} />
                ))}
              </span>
              <span className={styles.pvSizes}>
                <span>CH</span>
                <span className={styles.pvSizeOn}>M</span>
                <span>G</span>
              </span>
              <span className={styles.pvButton}>
                Agregar al carrito
                <Step at={[P.add, P.out]} fx="fade" className={styles.pvButtonDone}>
                  ✓ Agregado
                </Step>
                <Step at={[P.add - 0.02, P.add + 0.06]} fx="pop" rm="hide" className={styles.pvTapRing} />
              </span>
            </span>
          </Step>
          <Step at={[P.toast, P.out]} fx="up" className={styles.pvToast}>
            <span className={styles.pvToastIcon}>✓</span>
            <span className="min-w-0">
              <span className="block text-bone">Pedido confirmado</span>
              <span className={styles.pvToastSub}>Comprobante C-05 impreso</span>
            </span>
          </Step>
        </div>
      </div>
      <div className={styles.pvPanel}>
        <span className={styles.pvPanelTitle}>Automatizaciones</span>
        <span className={styles.pvTrigger}>
          <Step at={[P.toast, P.out]} fx="fade" className={styles.pvTriggerOn} />
          <span className={styles.pvTriggerLabel}>disparador</span>
          pedido.confirmado
        </span>
        <span className={styles.pvRows}>
          {previewRows.map((row, index) => (
            <span key={row} className={styles.pvRow}>
              <span className={styles.pvNode}>
                <Step at={[P.rows[index], P.out]} fx="pop" className={styles.pvCheck}>
                  ✓
                </Step>
              </span>
              <span className="min-w-0">{row}</span>
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

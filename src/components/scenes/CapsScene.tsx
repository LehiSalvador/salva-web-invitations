import type { CSSProperties } from "react";
import { Step } from "@/components/motion/Step";
import styles from "./CapsScene.module.css";
import { Automations } from "./caps/Automations";
import { Cap3D } from "./caps/Cap3D";
import { CapArt } from "./caps/CapArt";
import { lastLine, StoreWindow } from "./caps/Store";
import { A, CYCLE, P, PA, PREVIEW_CYCLE, previewCss, products, sceneCss, TARGET } from "./caps/timeline";

/*
 * Salva Exclusive Caps: simulación del recorrido de compra en la tienda en línea de un negocio cliente.
 * Catálogo → producto (gorra en 3D sobre tornamesa) → carrito → pedido confirmado con comprobante impreso;
 * el pedido dispara las automatizaciones del panel derecho. Todo va en una sola línea de tiempo (caps/timeline).
 */

const css = sceneCss();
const pvCss = previewCss();
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

const previewRows = [
  ["Pedido registrado", "Registro"],
  ["Confirmación enviada", "Confirmación"],
  ["Inventario actualizado", "Inventario"],
  ["Envío preparado", "Envío"],
];
const target = products[TARGET];

/** Vista previa compacta: catálogo → producto → pedido confirmado, con las automatizaciones al lado. */
export function CapsPreview() {
  return (
    <div data-live data-cycle={PREVIEW_CYCLE} aria-hidden="true" className={styles.preview}>
      <style href="caps-preview-timeline" precedence="default">
        {pvCss}
      </style>
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
          {/* El catálogo es la capa base; el producto entra encima con fondo opaco y al final se retira. */}
          <div className={styles.pvGrid}>
            {products.map((product, index) => (
              <span key={product.id} className={styles.pvCard}>
                <CapArt color={product.color} />
                <span className={styles.pvName}>Gorra {product.id}</span>
                {index === TARGET && (
                  <Step at={[P.pick, P.view2 + 0.03]} fx="scale" rm="hide" className={styles.pvPicked}>
                    <span className={styles.pvTap} />
                  </Step>
                )}
              </span>
            ))}
          </div>
          <Step at={[P.view2, P.out]} fx="fade" className={styles.pvProduct}>
            <span className={styles.pvTurntable}>
              <Cap3D color={target.color} spin={PA.spin} simple />
            </span>
            <span className={styles.pvInfo}>
              <span className={styles.pvTitle}>
                Gorra {target.id} <span className="whitespace-nowrap text-mist">· {target.name}</span>
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
                <span className={styles.pvLong}>Agregar al carrito</span>
                <span className={styles.pvShort}>Agregar</span>
                <span className={`${styles.pvButtonDone} ${PA.added}`}>✓ Agregado</span>
                <Step at={[P.add - 0.03, P.add + 0.05]} fx="pop" rm="hide" className={styles.pvTapRing} />
              </span>
            </span>
          </Step>
          <Step at={[P.toast, P.out]} fx="up" className={styles.pvToast}>
            <span className={styles.pvToastIcon}>✓</span>
            <span className="min-w-0">
              <span className="block text-bone">Pedido confirmado</span>
              <span className={styles.pvToastSub}>Comprobante C-05</span>
            </span>
          </Step>
        </div>
      </div>
      <div className={styles.pvPanel}>
        <span className={styles.pvPanelTitle}>Automatizaciones</span>
        <span className={styles.pvTrigger}>
          <Step at={[P.toast, P.out]} fx="fade" className={styles.pvTriggerOn} />
          <span className={styles.pvTriggerLabel}>disparador</span>
          pedido.
          <wbr />
          confirmado
        </span>
        <span className={styles.pvRows}>
          {previewRows.map(([long, short], index) => (
            <span key={long} className={styles.pvRow}>
              <span className={styles.pvNode} />
              <span className={styles.pvRowName}>
                <span className={styles.pvLong}>{long}</span>
                <span className={styles.pvShort}>{short}</span>
              </span>
              <span className={styles.pvState}>
                <span className={`${styles.ticker} ${PA.row(index)}`} style={lastLine(2)}>
                  <span className="text-fog">espera</span>
                  <span className="text-signal">✓ listo</span>
                </span>
              </span>
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

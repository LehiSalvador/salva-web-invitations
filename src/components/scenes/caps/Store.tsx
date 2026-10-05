import type { CSSProperties } from "react";
import { Step } from "@/components/motion/Step";
import styles from "../CapsScene.module.css";
import { Cap3D } from "./Cap3D";
import { CapArt } from "./CapArt";
import { A, box, D, DECOY, L, products, T, TARGET } from "./timeline";

const target = products[TARGET];
const routes = ["/catalogo", `/gorras/gorra-${target.id}`, "/carrito", "/pedido/confirmado"];
const tallas = ["CH", "M", "G"];

/** Estado final de un ticker (lo que se ve con reduced motion o sin JS). */
export const lastLine = (count: number): CSSProperties => ({ transform: `translate3d(0, ${(-100 * (count - 1)) / count}%, 0)` });

function Icon({ name }: { name: "search" | "user" | "bag" | "lock" | "close" | "check" }) {
  const paths = {
    search: "M10.5 10.5L14 14M11.5 6.75a4.75 4.75 0 1 1-9.5 0a4.75 4.75 0 0 1 9.5 0Z",
    user: "M3 14c.8-2.6 2.7-3.8 5-3.8s4.2 1.2 5 3.8M10.8 5.2a2.8 2.8 0 1 1-5.6 0a2.8 2.8 0 0 1 5.6 0Z",
    bag: "M3 5.5h10l-.8 8.5H3.8L3 5.5ZM5.6 5.5V4.4a2.4 2.4 0 0 1 4.8 0v1.1",
    lock: "M4.5 7.5V5.6a3.5 3.5 0 0 1 7 0v1.9M3.5 7.5h9v6h-9z",
    close: "M4 4l8 8M12 4l-8 8",
    check: "M3.5 8.4l3 3 6-6.6",
  };
  return (
    <svg viewBox="0 0 16 16" className={styles.icon} aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}

function Chrome() {
  return (
    <div className={styles.chrome}>
      <span className="flex shrink-0 gap-1.5">
        <i className={styles.chromeDot} />
        <i className={styles.chromeDot} />
        <i className={styles.chromeDot} />
      </span>
      <span className={styles.address}>
        <Icon name="lock" />
        <span className="shrink-0 text-mist">exclusive-caps</span>
        <span className={styles.addressSlot}>
          <span className={`${styles.ticker} ${A.address}`} style={lastLine(4)}>
            {routes.map((route) => (
              <span key={route}>{route}</span>
            ))}
          </span>
        </span>
      </span>
      <span className="label hidden shrink-0 text-fog md:inline">tienda del cliente · sesión simulada</span>
    </div>
  );
}

function StoreHeader() {
  return (
    <div className={`${styles.box} ${styles.storeHead}`} style={box(L.header)}>
      <span className={styles.wordmark}>Exclusive Caps</span>
      <span className={`${styles.nav} hidden sm:flex`}>
        <span className="text-bone">Gorras</span>
        <span>Novedades</span>
        <span>Ayuda</span>
      </span>
      <span className={styles.headIcons}>
        <span className="hidden sm:inline-flex">
          <Icon name="search" />
        </span>
        <span className="hidden sm:inline-flex">
          <Icon name="user" />
        </span>
        <span className="relative inline-flex">
          <Icon name="bag" />
          <Step at={[T.flyEnd, T.out]} fx="pop" className={styles.badge} />
        </span>
      </span>
    </div>
  );
}

function Catalog() {
  return (
    <Step at={[0, T.view2 + 0.012]} fx="left" rm="hide" className="absolute inset-0">
      <div className={`${styles.box} ${styles.titleRow}`} style={box(L.catalogTitle)}>
        <span className={styles.title}>Gorras</span>
        <span className={`${styles.tl} text-fog`}>Colección</span>
      </div>
      <div className={`${styles.box} ${styles.filters} hidden sm:flex`} style={box(L.filters)}>
        <span className={styles.filterOn}>Todas</span>
        <span className={styles.filter}>Curvas</span>
        <span className={styles.filter}>Planas</span>
      </div>
      {products.map((product, index) => (
        <div key={product.id} className={`${styles.box} ${styles.card}`} style={box(L.card(index))}>
          <span className={styles.cardArt}>
            <CapArt color={product.color} />
          </span>
          <span className={styles.cardMeta}>
            <span className="text-bone">Gorra {product.id}</span>
            <span className="text-fog"> · {product.name}</span>
          </span>
          {product.tag && <span className={styles.cardTag}>{product.tag}</span>}
        </div>
      ))}
      <Step at={[T.decoy - 0.012, T.decoyOut + 0.012]} fx="scale" rm="hide" className={`${styles.box} ${styles.hover}`} style={box(L.card(DECOY))}>
        <span className={styles.hoverChip}>Vista rápida</span>
      </Step>
      <Step at={[T.target - 0.01, T.view2]} fx="scale" rm="hide" className={`${styles.box} ${styles.picked}`} style={box(L.card(TARGET))}>
        <span className={styles.pickedChip}>Ver producto →</span>
      </Step>
    </Step>
  );
}

function Product() {
  return (
    <Step at={[T.view2 - 0.008, T.out]} fx="right" className="absolute inset-0">
      <div className={`${styles.box} ${styles.tl} flex items-center gap-2 text-fog`} style={box(L.crumb)}>
        Gorras <span className="text-line-strong">/</span> <span className="text-mist">Gorra {target.id}</span>
      </div>
      <div className={`${styles.box} ${styles.stageBox}`} style={box(L.turntable)}>
        <Cap3D color={target.color} />
        <span className={styles.viewChip}>
          <i className={styles.viewDot} /> Vista 360°
        </span>
        <span className={`${styles.viewHint} hidden sm:flex`}>
          <span aria-hidden="true">↻</span> Modelo 3D · giro automático
        </span>
      </div>
      <div className={`${styles.box} ${styles.productName}`} style={box(L.name)}>
        Gorra {target.id} <span className="text-mist">· {target.name}</span>
      </div>
      <p className={`${styles.box} ${styles.desc} hidden sm:block`} style={box(L.desc)}>
        Corona estructurada de seis paneles, visera curva y ajuste trasero.
      </p>
      <div className={`${styles.box} ${styles.tl} text-fog`} style={box(L.colorLabel)}>
        Color · <span className="text-mist">{target.name}</span>
      </div>
      {products.map((product, index) => (
        <span
          key={product.id}
          className={`${styles.box} ${styles.swatch} ${index === TARGET ? styles.swatchOn : ""}`}
          style={box(L.colorDot(index), { "--cap": product.color } as CSSProperties)}
        />
      ))}
      <Step at={[T.color - 0.008, T.colorOut + 0.012]} fx="up" rm="hide" className={`${styles.box} ${styles.tip}`} style={box(L.colorTip)}>
        {target.name}
      </Step>
      <div className={`${styles.box} ${styles.tl} text-fog`} style={box(L.tallaLabel)}>
        Talla
      </div>
      {tallas.map((talla, index) => (
        <span key={talla} className={`${styles.box} ${styles.chipSize}`} style={box(L.talla(index))}>
          {talla}
        </span>
      ))}
      <Step at={[T.click2, T.out]} fx="scale" className={`${styles.box} ${styles.chipSize} ${styles.chipSizeOn}`} style={box(L.talla(1))}>
        M
      </Step>
      <div className={`${styles.box} ${styles.button}`} style={box(L.add)}>
        Agregar al carrito
      </div>
      <Step at={[T.click3 + 0.004, T.out]} fx="fade" className={`${styles.box} ${styles.button} ${styles.buttonDone}`} style={box(L.add)}>
        <Icon name="check" /> Agregado al carrito
      </Step>
      <div className={`${styles.box} ${styles.tl} hidden text-fog sm:block`} style={box(L.fine)}>
        Envío a domicilio · Cambios fáciles
      </div>
    </Step>
  );
}

function Receipt() {
  return (
    <div className={styles.paper}>
      <span className={styles.paperBrand}>Exclusive Caps</span>
      <span className={styles.paperTitle}>Comprobante de pedido</span>
      <span className={styles.paperRule} />
      <span className={styles.paperRow}>
        <span>Gorra {target.id} · {target.name}</span>
        <span>M</span>
      </span>
      <span className={`${styles.paperRow} ${styles.paperDelivery}`}>
        <span>Entrega</span>
        <span>A domicilio</span>
      </span>
      <span className={styles.paperRule} />
      <span className={`${styles.paperRow} ${styles.paperOk}`}>
        <span>✓ Confirmado</span>
        <span>C-05</span>
      </span>
      <span className={styles.paperThanks}>Gracias por tu compra</span>
      <span className={styles.barcode} />
    </div>
  );
}

function Drawer() {
  return (
    <div className={`${styles.box} ${styles.drawer} ${A.drawer}`} style={box(L.drawer)}>
      <span className={`${styles.handle} sm:hidden`} />
      <div className={`${styles.box} ${styles.drawerHead}`} style={box(D.head)}>
        <span className={styles.drawerTitle}>Tu carrito</span>
        <Icon name="close" />
      </div>
      <div className={`${styles.box} ${styles.line}`} style={box(D.item)}>
        <span className={styles.lineThumb}>
          <CapArt color={target.color} emblem={false} />
        </span>
        <span className="min-w-0">
          <span className="block text-bone">
            Gorra {target.id} · {target.name}
          </span>
          <span className={`${styles.tl} mt-1 block text-fog`}>Talla M · Color {target.name.toLowerCase()}</span>
        </span>
      </div>
      <div className={`${styles.box} ${styles.delivery}`} style={box(D.delivery)}>
        <span className={`${styles.tl} text-fog`}>Entrega</span>
        <span className="flex items-center gap-2 text-bone">
          <i className={styles.radio} /> A domicilio
        </span>
      </div>
      <div className={`${styles.box} ${styles.button} ${styles.buttonLight}`} style={box(D.confirm)}>
        Confirmar pedido
      </div>
      <Step at={[T.confirmed, T.out + 0.03]} fx="scale" className={`${styles.box} ${styles.button} ${styles.buttonOk}`} style={box(D.confirm)}>
        <Icon name="check" /> Pedido confirmado
      </Step>
      <div className={`${styles.box} ${styles.receiptClip}`} style={box(D.receipt)}>
        <div className={`${styles.receiptFeed} ${A.print}`}>
          <Receipt />
        </div>
      </div>
      <div className={`${styles.box} ${styles.slot}`} style={box(D.slot)} />
    </div>
  );
}

function CursorLayer() {
  return (
    <div className={`${styles.layer} capsx-layer motion-only`}>
      <span className={`${styles.flyX} ${A.flyX}`}>
        <span className={`${styles.flyY} ${A.flyY}`}>
          <i className={styles.flyDot} />
        </span>
      </span>
      <span className={`${styles.cursor} ${A.cursor}`}>
        <span className={`${styles.ripple} ${A.ripple}`} />
        <span className={`${styles.press} ${A.press}`}>
          <svg viewBox="0 0 16 22" className={styles.arrow} aria-hidden="true">
            <path d="M1.2 1.2v15.6l4.1-3.7 2.8 6.6 2.6-1.1-2.7-6.5h5.6z" />
          </svg>
          <span className={styles.touch} />
        </span>
      </span>
    </div>
  );
}

/** Ventana del navegador con la tienda: catálogo → producto → carrito → pedido confirmado. */
export function StoreWindow() {
  return (
    <div className={styles.window}>
      <Chrome />
      <div className={styles.viewport}>
        <StoreHeader />
        <Catalog />
        <Product />
        <Step at={[T.drawer, T.out]} fx="fade" className={`${styles.box} ${styles.scrim}`} style={box(L.scrim)} />
        <Drawer />
        <CursorLayer />
      </div>
    </div>
  );
}

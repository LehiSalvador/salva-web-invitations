import s from "./AplomoScene.module.css";
import { Panel } from "./aplomo/Panel";
import { Stage } from "./aplomo/Stage";
import { CYCLE } from "./aplomo/yard";

/*
 * Aplomo System · patio operativo (simulación).
 * Patio industrial en isometría: zonas con volúmenes, retícula de ubicaciones A–G × 01–08,
 * camiones que entran por la pluma de acceso, descargan en B-07 y salen. La ruta se ilumina
 * mientras el camión avanza y el panel registra cada evento en el mismo instante del ciclo.
 */
export function AplomoScene() {
  return (
    <div aria-hidden="true" data-live data-cycle={CYCLE} className={s.scene}>
      <div className={s.wrap}>
        <Stage />
      </div>
      <Panel />
    </div>
  );
}

/** Vista previa compacta (showcase e índice): llena su contenedor y solo usa animaciones CSS. */
export function AplomoPreview() {
  return (
    <div aria-hidden="true" data-live className={s.preview}>
      <Stage preview />
    </div>
  );
}

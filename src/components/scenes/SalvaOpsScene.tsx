import s from "./SalvaOpsScene.module.css";
import { CYCLE } from "./salvaops/model";
import { Ledger, Terminal, terminalCss } from "./salvaops/Panels";
import { Preview } from "./salvaops/Preview";
import { Stage, stageCss } from "./salvaops/Stage";

/*
 * SalvaOps · consola de orquestación (simulación).
 * Operaciones de agentes aislados por proyecto pasan por el broker y la compuerta de política
 * hacia el carril de un proveedor de IA; cada una queda en el libro de evidencia. Una se bloquea.
 * Todo corre en una sola línea de tiempo (data-cycle) que comparten escenario, libro y terminal;
 * la cola, el brazo de la compuerta y la terminal usan keyframes CSS de la misma duración.
 */
export function SalvaOpsScene() {
  return (
    <div aria-hidden="true" data-live data-cycle={CYCLE} className={s.scene}>
      <style dangerouslySetInnerHTML={{ __html: stageCss + terminalCss }} />
      <div className={s.grid}>
        <div className={`${s.pane} ${s.canvas} ${s.areaStage}`} data-tilt="1.2">
          <Stage />
        </div>
        <Ledger />
        <Terminal />
      </div>
    </div>
  );
}

/** Vista previa compacta para el showcase y el índice: llena su contenedor. */
export function SalvaOpsPreview() {
  return <Preview />;
}

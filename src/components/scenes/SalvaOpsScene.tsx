import s from "./SalvaOpsScene.module.css";
import { CYCLE } from "./salvaops/model";
import { Ledger, Terminal } from "./salvaops/Panels";
import { Preview } from "./salvaops/Preview";
import { Stage } from "./salvaops/Stage";

/*
 * SalvaOps · consola de orquestación (simulación).
 * Operaciones de agentes aislados por proyecto pasan por el broker y la compuerta de política
 * hacia el carril de un proveedor de IA; cada una queda en el libro de evidencia. Una se bloquea.
 * Todo corre en una sola línea de tiempo (data-cycle) que comparten escenario, libro y terminal.
 */
export function SalvaOpsScene() {
  return (
    <div aria-hidden="true" data-live data-cycle={CYCLE} className={s.scene}>
      <div className={s.grid}>
        <div className={`${s.pane} ${s.canvas} ${s.areaStage}`}>
          <Stage />
        </div>
        <Ledger />
        <Terminal />
      </div>
      <div className={`${s.status} ${s.cap} text-fog`}>
        <span className="flex items-center gap-2.5 text-mist">
          <span className="live-dot" />
          broker activo
        </span>
        <span className="hidden sm:inline">2 proyectos aislados · 4 agentes · 2 proveedores</span>
        <span>simulación · ids ilustrativos</span>
      </div>
    </div>
  );
}

/** Vista previa compacta para el showcase y el índice: llena su contenedor. */
export function SalvaOpsPreview() {
  return <Preview />;
}

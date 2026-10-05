import type { CapabilityId } from "@/data/capabilities";
import { AiVisual } from "./AiVisual";
import { AutomationVisual } from "./AutomationVisual";
import { CustomVisual } from "./CustomVisual";
import { PlatformsVisual } from "./PlatformsVisual";
import { SoftwareVisual } from "./SoftwareVisual";
import { WebVisual } from "./WebVisual";

/*
 * Visuales animados de cada capacidad (visor de "Qué hacemos").
 * Cada visual llena su contenedor (position: absolute; inset: 0) y es una escena [data-live] con su propio ciclo:
 * mismo kit (retícula, paneles, tipografía mono y riel de fases con cabezal), seis mecanismos distintos.
 */
export const capabilityVisuals: Record<CapabilityId, () => React.JSX.Element> = {
  web: WebVisual,
  software: SoftwareVisual,
  automatizacion: AutomationVisual,
  plataformas: PlatformsVisual,
  ia: AiVisual,
  medida: CustomVisual,
};

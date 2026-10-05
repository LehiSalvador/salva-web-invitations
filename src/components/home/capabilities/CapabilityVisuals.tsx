import type { CapabilityId } from "@/data/capabilities";
import { WebVisual } from "./WebVisual";

/*
 * Visuales animados de cada capacidad (visor de "Qué hacemos").
 * Cada visual llena su contenedor (position: absolute; inset: 0) y es una escena [data-live] con su propio ciclo.
 */

function Placeholder({ label }: { label: string }) {
  return (
    <div data-live className="absolute inset-0 grid place-items-center">
      <span className="label text-fog">{label}</span>
    </div>
  );
}

export const capabilityVisuals: Record<CapabilityId, () => React.JSX.Element> = {
  web: WebVisual,
  software: () => <Placeholder label="software" />,
  automatizacion: () => <Placeholder label="automatización" />,
  plataformas: () => <Placeholder label="plataformas" />,
  ia: () => <Placeholder label="ia" />,
  medida: () => <Placeholder label="a medida" />,
};

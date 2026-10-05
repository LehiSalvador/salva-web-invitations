import { ProjectDiagram } from "@/components/ProjectDiagram";

/** Simulación principal del case study (ocupa el ancho del visor). */
export function ArchivoScene() {
  return (
    <div className="p-4 sm:p-6">
      <ProjectDiagram id="archivo" title="" />
    </div>
  );
}

/** Vista previa compacta para el showcase de la home: llena su contenedor (16:10). */
export function ArchivoPreview() {
  return (
    <div className="absolute inset-0 grid place-items-center p-4">
      <ProjectDiagram id="archivo" title="" />
    </div>
  );
}

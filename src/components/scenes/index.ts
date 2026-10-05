import type { ComponentType } from "react";
import type { ProjectId } from "@/data/projects";
import { AplomoPreview, AplomoScene } from "@/components/scenes/AplomoScene";
import { AtenorPreview, AtenorScene } from "@/components/scenes/AtenorScene";
import { CareertracklyPreview, CareertracklyScene } from "@/components/scenes/CareertracklyScene";
import { SalvaOpsPreview, SalvaOpsScene } from "@/components/scenes/SalvaOpsScene";
import { CapsPreview, CapsScene } from "@/components/scenes/CapsScene";
import { ArchivoPreview, ArchivoScene } from "@/components/scenes/ArchivoScene";

/** Escena principal (case study) y vista previa (showcase) de cada proyecto. */
export const scenes: Record<ProjectId, { Scene: ComponentType; Preview: ComponentType }> = {
  aplomo: { Scene: AplomoScene, Preview: AplomoPreview },
  atenor: { Scene: AtenorScene, Preview: AtenorPreview },
  careertrackly: { Scene: CareertracklyScene, Preview: CareertracklyPreview },
  salvaops: { Scene: SalvaOpsScene, Preview: SalvaOpsPreview },
  "salva-exclusive-caps": { Scene: CapsScene, Preview: CapsPreview },
  archivo: { Scene: ArchivoScene, Preview: ArchivoPreview },
};

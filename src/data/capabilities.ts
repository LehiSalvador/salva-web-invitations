export type CapabilityId = "web" | "software" | "automatizacion" | "plataformas" | "ia" | "medida";

export type Capability = {
  id: CapabilityId;
  title: string;
  description: string;
  /** Entregables típicos, mostrados como etiquetas. */
  scope: string[];
};

export const capabilities: Capability[] = [
  {
    id: "web",
    title: "Desarrollo web",
    description: "Sitios y experiencias web rápidas, claras y pensadas para que el visitante actúe.",
    scope: ["Sitios", "Landing pages", "Experiencias web"],
  },
  {
    id: "software",
    title: "Desarrollo de software",
    description: "Sistemas y herramientas internas que ordenan información y resuelven tareas específicas.",
    scope: ["Sistemas", "Herramientas internas", "Paneles"],
  },
  {
    id: "automatizacion",
    title: "Automatización de procesos",
    description: "Reducimos tareas manuales y conectamos información, sistemas y operaciones.",
    scope: ["Flujos", "Integraciones", "Notificaciones"],
  },
  {
    id: "plataformas",
    title: "Plataformas y aplicaciones",
    description: "Productos digitales multiusuario orientados a uso real, no solo a demostraciones.",
    scope: ["Plataformas web", "Apps", "Multiusuario"],
  },
  {
    id: "ia",
    title: "Inteligencia artificial aplicada",
    description: "Integramos IA y servicios externos cuando aportan valor real al proceso.",
    scope: ["Asistentes", "Clasificación", "Atención"],
  },
  {
    id: "medida",
    title: "Soluciones a medida",
    description: "Diseñamos la herramienta alrededor de la necesidad, no al revés.",
    scope: ["Diagnóstico", "Diseño", "Implementación"],
  },
];

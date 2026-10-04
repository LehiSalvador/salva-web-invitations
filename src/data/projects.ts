export type ProjectVisualKind =
  | "industrial-map"
  | "conversations"
  | "portfolio"
  | "terminal"
  | "commerce"
  | "archive";

export type Project = {
  id: string;
  name: string;
  category: string;
  description: string;
  visual: ProjectVisualKind;
  /** Ruta en /public para reemplazar la composición generada por una imagen real. */
  image?: { src: string; alt: string };
};

export const projects: Project[] = [
  {
    id: "aplomo",
    name: "Aplomo System",
    category: "Operaciones / Industria",
    description:
      "Plataforma de inteligencia operativa para digitalizar patios industriales, materiales, ubicaciones, flujos y trazabilidad.",
    visual: "industrial-map",
  },
  {
    id: "atenor",
    name: "Atenor System",
    category: "Automatización / IA",
    description:
      "Plataforma multinegocio para centralizar atención, clientes y operaciones mediante WhatsApp, automatización e inteligencia artificial.",
    visual: "conversations",
  },
  {
    id: "careertrackly",
    name: "Careertrackly",
    category: "Professional Tech",
    description:
      "Plataforma para crear, publicar y descubrir portfolios profesionales basados en trayectoria, proyectos y evidencia.",
    visual: "portfolio",
  },
  {
    id: "salva-scripts",
    name: "Salva Scripts",
    category: "Tools / Automation",
    description:
      "Herramientas y automatizaciones creadas para resolver tareas concretas mediante software.",
    visual: "terminal",
  },
  {
    id: "salva-exclusive-caps",
    name: "Salva Exclusive Caps",
    category: "Commerce / Digital Experience",
    description:
      "Desarrollo de experiencia web, herramientas digitales y automatizaciones aplicadas a un negocio de comercio electrónico.",
    visual: "commerce",
  },
  {
    id: "archivo",
    name: "Archivo System",
    category: "Knowledge / Digital Experience",
    description:
      "Plataforma digital orientada a organizar, presentar y preservar contenido, historias y conocimiento.",
    visual: "archive",
  },
];

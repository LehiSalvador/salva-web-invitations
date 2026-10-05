export type ProjectVisualKind =
  | "industrial-map"
  | "conversations"
  | "portfolio"
  | "orchestration"
  | "commerce"
  | "archive";

export type ProjectLogo = {
  /** Archivo en /public/projects. Para cambiar una marca basta con reemplazar el archivo o esta ruta. */
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Altura relativa del logo dentro del área visual de la tarjeta. */
  scale?: number;
};

export type Project = {
  id: string;
  name: string;
  category: string;
  description: string;
  /** Composición abstracta de fondo que representa la categoría. */
  visual: ProjectVisualKind;
  /** Halo de color detrás del logo, tomado de la paleta de cada marca. */
  glow: string;
  logo?: ProjectLogo;
};

export const projects: Project[] = [
  {
    id: "aplomo",
    name: "Aplomo System",
    category: "Operaciones / Industria",
    description:
      "Plataforma de inteligencia operativa para digitalizar patios industriales, materiales, ubicaciones, flujos y trazabilidad.",
    visual: "industrial-map",
    glow: "rgb(1 185 221 / 0.16)",
    logo: { src: "/projects/aplomo-logo.svg", alt: "Isotipo de Aplomo System", width: 272, height: 272, scale: 0.62 },
  },
  {
    id: "atenor",
    name: "Atenor System",
    category: "Automatización / IA",
    description:
      "Plataforma multinegocio para centralizar atención, clientes y operaciones mediante WhatsApp, automatización e inteligencia artificial.",
    visual: "conversations",
    glow: "rgb(200 173 118 / 0.12)",
  },
  {
    id: "careertrackly",
    name: "Careertrackly",
    category: "Professional Tech",
    description:
      "Plataforma para crear, publicar y descubrir portfolios profesionales basados en trayectoria, proyectos y evidencia.",
    visual: "portfolio",
    glow: "rgb(34 181 117 / 0.15)",
    logo: { src: "/projects/careertrackly-logo.svg", alt: "Logotipo de Careertrackly", width: 256, height: 228, scale: 0.68 },
  },
  {
    id: "salvaops",
    name: "SalvaOps",
    category: "Developer Tools / AI Orchestration",
    description:
      "Aplicación local-first para desarrollo asistido por agentes que centraliza proyectos, proveedores de IA, operaciones, evidencia y automatización bajo un modelo de orquestación segura.",
    visual: "orchestration",
    glow: "rgb(99 133 178 / 0.18)",
    logo: { src: "/projects/salvaops-logo.svg", alt: "Logotipo de SalvaOps", width: 128, height: 128, scale: 0.58 },
  },
  {
    id: "salva-exclusive-caps",
    name: "Salva Exclusive Caps",
    category: "Commerce / Digital Experience",
    description:
      "Desarrollo de experiencia web, herramientas digitales y automatizaciones aplicadas a un negocio de comercio electrónico.",
    visual: "commerce",
    glow: "rgb(200 173 118 / 0.12)",
  },
  {
    id: "archivo",
    name: "Archivo System",
    category: "Knowledge / Digital Experience",
    description:
      "Plataforma digital orientada a organizar, presentar y preservar contenido, historias y conocimiento.",
    visual: "archive",
    glow: "rgb(214 160 82 / 0.14)",
    logo: { src: "/projects/archivo-system-logo.webp", alt: "Logotipo de Archivo System", width: 480, height: 756, scale: 0.84 },
  },
];

export type ProjectLogo = {
  /** Archivo en /public/projects. Para cambiar una marca basta con reemplazar el archivo o esta ruta. */
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Project = {
  id: "aplomo" | "atenor" | "careertrackly" | "salvaops" | "salva-exclusive-caps" | "archivo";
  name: string;
  category: string;
  description: string;
  /** Piezas del sistema, tomadas de la descripción del proyecto. */
  parts: string[];
  /** Pie de la figura que acompaña al proyecto. */
  figure: string;
  /** Relación de Salva Systems con el proyecto cuando no es un producto propio. */
  relation?: string;
  logo?: ProjectLogo;
};

export const projects: Project[] = [
  {
    id: "aplomo",
    name: "Aplomo System",
    category: "Operaciones / Industria",
    description:
      "Plataforma de inteligencia operativa para digitalizar patios industriales, materiales, ubicaciones, flujos y trazabilidad.",
    parts: ["Patios", "Materiales", "Ubicaciones", "Flujos", "Trazabilidad"],
    figure: "Patio industrial: zonas, ubicaciones y ruta operativa de un material.",
    logo: { src: "/projects/aplomo-logo.svg", alt: "Isotipo de Aplomo System", width: 272, height: 272 },
  },
  {
    id: "atenor",
    name: "Atenor System",
    category: "Automatización / IA",
    description:
      "Plataforma multinegocio para centralizar atención, clientes y operaciones mediante WhatsApp, automatización e inteligencia artificial.",
    parts: ["Atención", "Clientes", "Operaciones", "WhatsApp", "Automatización", "IA"],
    figure: "Mensajes de varios negocios entran por WhatsApp, se procesan y se convierten en acciones.",
  },
  {
    id: "careertrackly",
    name: "Careertrackly",
    category: "Professional Tech",
    description:
      "Plataforma para crear, publicar y descubrir portfolios profesionales basados en trayectoria, proyectos y evidencia.",
    parts: ["Trayectoria", "Proyectos", "Evidencia", "Portfolio"],
    figure: "Una trayectoria profesional respaldada por proyectos y evidencia, publicada como portfolio.",
    logo: { src: "/projects/careertrackly-logo.svg", alt: "Logotipo de Careertrackly", width: 256, height: 228 },
  },
  {
    id: "salvaops",
    name: "SalvaOps",
    category: "Developer Tools / AI Orchestration",
    description:
      "Aplicación local-first para desarrollo asistido por agentes que centraliza proyectos, proveedores de IA, operaciones, evidencia y automatización bajo un modelo de orquestación segura.",
    parts: ["Proyectos", "Agentes", "Proveedores de IA", "Operaciones", "Evidencia"],
    figure: "Orquestación por proyecto: agente, broker y proveedor, con cada operación registrada como evidencia.",
    logo: { src: "/projects/salvaops-logo.svg", alt: "Logotipo de SalvaOps", width: 128, height: 128 },
  },
  {
    id: "salva-exclusive-caps",
    name: "Salva Exclusive Caps",
    category: "Commerce / Digital Experience",
    description:
      "Desarrollo de experiencia web, herramientas digitales y automatizaciones aplicadas a un negocio de comercio electrónico.",
    parts: ["Experiencia web", "Herramientas digitales", "Automatizaciones"],
    figure: "Del catálogo al producto y al pedido: el recorrido de compra que sostiene la experiencia web.",
    relation: "Implementación tecnológica para un negocio de comercio electrónico",
  },
  {
    id: "archivo",
    name: "Archivo System",
    category: "Knowledge / Digital Experience",
    description:
      "Plataforma digital orientada a organizar, presentar y preservar contenido, historias y conocimiento.",
    parts: ["Organizar", "Presentar", "Preservar"],
    figure: "Capas de contenido, historias y conocimiento relacionadas dentro de un archivo.",
    logo: { src: "/projects/archivo-system-logo.webp", alt: "Logotipo de Archivo System", width: 480, height: 756 },
  },
];

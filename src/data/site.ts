const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const site = {
  name: "Salva Systems",
  tagline: "Soluciones digitales, automatización y tecnología para mejorar operaciones.",
  footerTagline: "Soluciones digitales, automatización y tecnología.",
  title: "Salva Systems | Soluciones digitales, automatización y tecnología",
  description:
    "Diseñamos plataformas, aplicaciones y automatizaciones para transformar necesidades operativas y de negocio en soluciones digitales.",
  locale: "es_MX",
  copyrightYear: 2026,
  /** URL pública del sitio. Sin valor, Next.js usa la URL de producción que asigna Vercel. */
  url: configuredSiteUrl ? new URL(configuredSiteUrl) : undefined,
} as const;

/** Índice de secciones; el número se muestra en la navegación y en cada sección. */
export const sections = [
  { id: "nosotros", label: "Nosotros", number: "01" },
  { id: "que-hacemos", label: "Qué hacemos", number: "02" },
  { id: "proyectos", label: "Proyectos", number: "03" },
  { id: "proceso", label: "Proceso", number: "04" },
  { id: "contacto", label: "Contacto", number: "05" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const footerLinks = [
  { id: "inicio", label: "Inicio" },
  ...sections.filter((section) => ["nosotros", "proyectos", "contacto"].includes(section.id)),
];

export const whatsapp = {
  /** Formato internacional, solo dígitos: código de país + número. */
  number: "528335340498",
  displayNumber: "+52 833 534 0498",
  message:
    "Hola, vi la página de Salva Systems y me gustaría recibir información sobre una solución digital o cotización.",
} as const;

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

export const navLinks = [
  { id: "inicio", label: "Inicio" },
  { id: "nosotros", label: "Nosotros" },
  { id: "que-hacemos", label: "Qué hacemos" },
  { id: "proyectos", label: "Proyectos" },
  { id: "contacto", label: "Contacto" },
] as const;

export const footerLinks = navLinks.filter((link) =>
  ["inicio", "nosotros", "proyectos", "contacto"].includes(link.id),
);

export const whatsapp = {
  /** Formato internacional, solo dígitos: código de país + número. */
  number: "528335340498",
  displayNumber: "+52 833 534 0498",
  message:
    "Hola, vi la página de Salva Systems y me gustaría recibir información sobre una solución digital o cotización.",
} as const;

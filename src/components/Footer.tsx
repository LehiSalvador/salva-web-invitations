import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";
import { projectHref, projects } from "@/data/projects";
import { navHref, navLinks, site, whatsapp } from "@/data/site";
import { whatsAppUrl } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-ink-950/70 text-bone">
      <div className="mx-auto max-w-[90rem] px-5 pt-14 pb-10 sm:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <BrandMark />
            <p className="mt-5 max-w-sm leading-relaxed text-mist">Convertimos problemas reales en soluciones digitales que funcionan.</p>
            <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 text-bone">
              <span className="live-dot" aria-hidden="true" />
              <span className="link-rule">{whatsapp.displayNumber}</span>
              <span className="sr-only">(WhatsApp, se abre en una nueva pestaña)</span>
            </a>
          </div>
          <nav aria-label="Sitio" className="md:col-span-3 md:col-start-6">
            <p className="label text-fog">Sitio</p>
            <ul className="mt-3">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <Link href={navHref(link.id, false)} className="inline-flex min-h-10 items-center text-mist transition-colors hover:text-bone">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Proyectos" className="md:col-span-4">
            <p className="label text-fog">Proyectos</p>
            <ul className="mt-3">
              {projects.map((project) => (
                <li key={project.id}>
                  <Link href={projectHref(project)} className="inline-flex min-h-10 items-center text-mist transition-colors hover:text-bone">
                    {project.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-12 flex flex-wrap items-baseline justify-between gap-4 border-t border-line pt-5">
          <p className="label text-fog">
            © {site.copyrightYear} {site.name}
          </p>
          <p className="label text-fog">{site.footerTagline}</p>
        </div>
      </div>
    </footer>
  );
}

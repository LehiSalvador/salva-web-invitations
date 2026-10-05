import { BrandMark } from "@/components/brand/BrandMark";
import { footerLinks, site, whatsapp } from "@/data/site";
import { whatsAppUrl } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink-950 text-bone">
      <div className="mx-auto max-w-[90rem] px-5 pt-14 pb-10 sm:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <BrandMark />
            <p className="mt-5 max-w-sm leading-relaxed text-mist">
              Convertimos problemas reales en soluciones digitales que funcionan.
            </p>
          </div>
          <nav aria-label="Pie de página" className="md:col-span-4 md:col-start-7">
            <ul className="grid grid-cols-2 gap-x-8">
              {footerLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`} className="inline-flex min-h-11 items-center text-mist transition-colors hover:text-bone">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-2">
            <p className="label text-fog">Contacto</p>
            <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center text-bone">
              <span className="link-rule">{whatsapp.displayNumber}</span>
              <span className="sr-only">(WhatsApp, se abre en una nueva pestaña)</span>
            </a>
          </div>
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

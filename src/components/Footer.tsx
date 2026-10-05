import { BrandMark } from "@/components/brand/BrandMark";
import { footerLinks, site } from "@/data/site";

export function Footer() {
  return (
    <footer className="grain bg-ink-950 text-bone">
      <div className="mx-auto max-w-[90rem] px-5 pb-10 sm:px-8">
        <div className="grid gap-10 border-t border-line pt-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <BrandMark />
            <p className="mt-4 max-w-sm leading-relaxed text-mist">{site.footerTagline}</p>
          </div>
          <nav aria-label="Pie de página" className="md:col-span-4 md:col-start-9">
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
        </div>
        <div className="mt-12 flex flex-wrap items-baseline justify-between gap-4 border-t border-line pt-5">
          <p className="label text-fog">© {site.copyrightYear} {site.name}.</p>
          <p className="max-w-xl font-display text-xl text-mist italic">
            Convertimos problemas reales en soluciones digitales que funcionan.
          </p>
        </div>
      </div>
    </footer>
  );
}

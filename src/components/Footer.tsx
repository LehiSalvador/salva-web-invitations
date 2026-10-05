import { BrandMark } from "@/components/brand/BrandMark";
import { footerLinks, site } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-14 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <BrandMark />
          <p className="mt-5 leading-relaxed text-mist">{site.footerTagline}</p>
        </div>
        <nav aria-label="Pie de página">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-1 sm:flex sm:gap-2">
            {footerLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="inline-flex min-h-11 items-center rounded-md text-mist transition-colors hover:text-bone sm:px-3"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-5 py-6 font-mono text-xs tracking-[0.12em] text-fog sm:px-8">
          © {site.copyrightYear} {site.name}.
        </p>
      </div>
    </footer>
  );
}

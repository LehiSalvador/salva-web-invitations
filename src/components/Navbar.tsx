"use client";

import { useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/brand/BrandMark";
import { sections, whatsapp } from "@/data/site";
import { whatsAppUrl } from "@/lib/whatsapp";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onBreakpoint = () => desktop.matches && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open]);

  const goTo = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    setOpen(false);
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" }));
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`border-b transition-colors duration-500 ${
          scrolled || open ? "border-line bg-ink-950" : "border-transparent bg-transparent"
        }`}
      >
        <nav aria-label="Principal" className="mx-auto flex h-14 max-w-[90rem] items-center gap-6 px-5 sm:px-8 lg:h-16">
          <a href="#inicio" aria-label="Salva Systems, ir al inicio" className="shrink-0">
            <BrandMark animated />
          </a>

          <ol className="ml-auto hidden items-center gap-7 lg:flex">
            {sections.map((section) => {
              const isActive = active === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`group flex items-baseline gap-1.5 py-2 text-[0.82rem] transition-colors ${
                      isActive ? "text-bone" : "text-mist hover:text-bone"
                    }`}
                  >
                    <span className={`font-mono text-[0.68rem] ${isActive ? "text-rose" : "text-fog"}`}>
                      {section.number}
                    </span>
                    <span className={isActive ? "link-rule" : ""}>{section.label}</span>
                  </a>
                </li>
              );
            })}
          </ol>

          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto hidden border-l border-line pl-6 text-[0.82rem] text-bone sm:inline-flex lg:ml-0"
          >
            <span className="link-rule">WhatsApp</span>
            <span aria-hidden="true" className="ml-1 text-gold-400">
              ↗
            </span>
            <span className="sr-only">(se abre en una nueva pestaña)</span>
          </a>

          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 ml-auto inline-flex min-h-11 items-center gap-2 px-2 font-mono text-[0.72rem] tracking-[0.14em] text-bone uppercase sm:ml-0 lg:hidden"
            aria-expanded={open}
            aria-controls="indice-movil"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Cerrar" : "Índice"}
            <span aria-hidden="true" className="relative block h-2.5 w-4">
              <span className={`absolute inset-x-0 top-0 h-px bg-bone transition-transform ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute inset-x-0 bottom-0 h-px bg-bone transition-transform ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
            </span>
          </button>
        </nav>
      </div>

      <div
        id="indice-movil"
        inert={!open}
        className={`fixed inset-x-0 top-14 bottom-0 flex flex-col justify-between overflow-y-auto bg-ink-950 px-5 pt-8 pb-10 transition-[clip-path] duration-500 ease-out-expo sm:px-8 lg:hidden ${
          open ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <ol className="border-t border-line">
          {sections.map((section) => (
            <li key={section.id} className="border-b border-line">
              <a
                href={`#${section.id}`}
                onClick={(event) => goTo(event, section.id)}
                aria-current={active === section.id ? "true" : undefined}
                className="flex min-h-16 items-baseline gap-4 py-3"
              >
                <span className="font-mono text-xs text-fog">{section.number}</span>
                <span className="font-display text-[2.6rem] leading-none text-bone">{section.label}</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex items-end justify-between gap-6">
          <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="text-lg text-bone">
            <span className="link-rule">Escribir por WhatsApp</span> <span aria-hidden="true">↗</span>
            <span className="sr-only">(se abre en una nueva pestaña)</span>
          </a>
          <span className="label text-fog">{whatsapp.displayNumber}</span>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/brand/BrandMark";
import { navLinks, whatsapp } from "@/data/site";
import { whatsAppUrl } from "@/lib/whatsapp";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("inicio");
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
    const targets = navLinks
      .map((link) => document.getElementById(link.id))
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
        <nav aria-label="Principal" className="mx-auto flex h-16 max-w-[90rem] items-center gap-6 px-5 sm:px-8">
          <a href="#inicio" aria-label="Salva Systems, ir al inicio" className="shrink-0">
            <BrandMark animated />
          </a>

          <ul className="ml-auto hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative flex items-center px-3 py-2 text-[0.86rem] transition-colors ${
                      isActive ? "text-bone" : "text-mist hover:text-bone"
                    }`}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3 -bottom-px h-px origin-left bg-gold-400 transition-transform duration-500 ease-out-expo ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto hidden min-h-10 items-center gap-2 border border-gold-400/70 px-4 text-[0.86rem] text-bone transition-colors hover:bg-gold-400 hover:text-ink-950 sm:inline-flex lg:ml-2"
          >
            WhatsApp
            <span aria-hidden="true">↗</span>
            <span className="sr-only">(se abre en una nueva pestaña)</span>
          </a>

          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 ml-auto inline-flex min-h-11 items-center gap-3 px-2 font-mono text-[0.72rem] tracking-[0.14em] text-bone uppercase sm:ml-0 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movil"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Cerrar" : "Menú"}
            <span aria-hidden="true" className="relative block h-2.5 w-4">
              <span className={`absolute inset-x-0 top-0 h-px bg-bone transition-transform ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute inset-x-0 bottom-0 h-px bg-bone transition-transform ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
            </span>
          </button>
        </nav>
      </div>

      <div
        id="menu-movil"
        inert={!open}
        className={`fixed inset-x-0 top-16 bottom-0 flex flex-col justify-between overflow-y-auto bg-ink-950 px-5 pt-6 pb-10 transition-[clip-path] duration-500 ease-out-expo sm:px-8 lg:hidden ${
          open ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <ul className="border-t border-line">
          {navLinks.map((link) => (
            <li key={link.id} className="border-b border-line">
              <a
                href={`#${link.id}`}
                onClick={(event) => goTo(event, link.id)}
                aria-current={active === link.id ? "true" : undefined}
                className="flex min-h-15 items-center gap-4 py-3"
              >
                <span className="font-mono text-xs text-gold-400">{link.number}</span>
                <span className="display text-[1.9rem] leading-none text-bone">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 flex min-h-14 items-center justify-between gap-4 bg-gold-400 px-5 text-ink-950"
        >
          <span className="font-medium">Escribir por WhatsApp</span>
          <span className="font-mono text-sm">{whatsapp.displayNumber}</span>
          <span className="sr-only">(se abre en una nueva pestaña)</span>
        </a>
      </div>
    </header>
  );
}

import type { CSSProperties } from "react";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { whatsAppUrl } from "@/lib/whatsapp";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="grain relative flex min-h-[100svh] flex-col bg-ink-950 pt-20 pb-10 lg:pt-24"
    >
      <div className="mx-auto flex w-full max-w-[90rem] flex-1 flex-col px-5 sm:px-8">
        <div className="lead-note flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-b border-line pb-3" style={delay(150)}>
          <p className="label text-mist">{site.tagline}</p>
          <p className="label hidden text-fog md:block">Sistemas construidos · 01—06</p>
        </div>

        <h1
          id="hero-title"
          className="mt-10 font-display text-[clamp(3rem,12.4vw,6rem)] leading-[0.92] tracking-[-0.02em] text-bone sm:text-[clamp(4.5rem,10vw,8rem)] lg:mt-14 lg:text-[clamp(6rem,8.7vw,10.5rem)]"
        >
          <span className="lead-line">
            <span style={delay(200)}>Convertimos</span>
          </span>{" "}
          <span className="hero-note hero-note--in relative block sm:pl-[14%]" data-note="Entrada — problema">
            <span className="lead-line">
              <span className="italic" style={delay(300)}>
                problemas reales
              </span>
            </span>
          </span>{" "}
          <span className="lead-line">
            <span style={delay(400)}>en soluciones digitales</span>
          </span>{" "}
          <span className="hero-note hero-note--out relative block text-right" data-note="Salida — sistema en operación">
            <span className="lead-line">
              <span style={delay(500)}>que funcionan.</span>
            </span>
          </span>
        </h1>

        <div className="mt-auto grid gap-10 pt-14 lg:grid-cols-12 lg:gap-8 lg:pt-20">
          <div className="lead-note lg:col-span-4" style={delay(800)}>
            <p className="max-w-md text-[1.05rem] leading-relaxed text-pretty text-mist">
              Diseñamos plataformas, automatizaciones y aplicaciones que conectan procesos, tecnología y negocio.
            </p>
            <ul className="mt-7 space-y-3 text-[0.95rem]">
              <li>
                <a href="#proyectos" className="group inline-flex items-baseline gap-3 text-bone">
                  <span aria-hidden="true" className="font-mono text-gold-400 transition-transform group-hover:translate-y-0.5">↓</span>
                  <span className="link-rule">Conoce nuestros proyectos</span>
                </a>
              </li>
              <li>
                <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-baseline gap-3 text-bone">
                  <span aria-hidden="true" className="font-mono text-gold-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
                  <span className="link-rule">Hablemos por WhatsApp</span>
                  <span className="sr-only">(se abre en una nueva pestaña)</span>
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Índice de proyectos" className="lead-note lg:col-span-7 lg:col-start-6" style={delay(950)}>
            <p className="label mb-3 flex justify-between text-fog">
              <span>Archivo de sistemas</span>
              <span className="hidden xl:inline">Plataformas web · Apps · Automatización · IA aplicada</span>
            </p>
            <ol className="border-t border-line">
              {projects.map((project, index) => (
                <li key={project.id} className="border-b border-line">
                  <a
                    href={`#proyecto-${project.id}`}
                    className="group grid min-h-11 grid-cols-[2.25rem_1fr] items-baseline gap-x-3 py-2 sm:grid-cols-[2.5rem_1fr_auto]"
                  >
                    <span className="font-mono text-xs text-fog transition-colors group-hover:text-rose">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.98rem] text-bone transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5">
                      {project.name}
                    </span>
                    <span className="label col-start-2 text-fog sm:col-start-3">{project.category}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}

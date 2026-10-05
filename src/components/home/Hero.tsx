import Link from "next/link";
import type { CSSProperties } from "react";
import { HeroStack } from "@/components/home/HeroStack";
import { projectHref, projects } from "@/data/projects";
import { whatsAppUrl } from "@/lib/whatsapp";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative overflow-hidden pt-24 lg:pt-28">
      <div className="mx-auto grid max-w-[90rem] items-center gap-6 px-5 sm:px-8 lg:min-h-[calc(100svh-11rem)] lg:grid-cols-12 lg:gap-8">
        <div className="relative z-[2] lg:col-span-6">
          <p className="rise label flex items-center gap-3 text-mist" style={delay(80)}>
            <span className="live-dot" aria-hidden="true" />
            <span data-reveal="fade" data-scramble>
              Salva Systems · Software, automatización e IA
            </span>
          </p>

          <h1
            id="hero-title"
            className="display mt-7 text-[clamp(2.35rem,8.6vw,3.6rem)] leading-[1.02] text-balance text-bone sm:text-[clamp(3rem,6.4vw,4.4rem)] lg:text-[clamp(3rem,4.4vw,4.75rem)]"
          >
            <span className="rise-line">
              <span style={delay(160)}>Convertimos problemas reales</span>
            </span>{" "}
            <span className="rise-line">
              <span style={delay(260)}>
                en <span className="text-gradient">soluciones digitales</span>
              </span>
            </span>{" "}
            <span className="rise-line">
              <span style={delay(360)}>que funcionan.</span>
            </span>
          </h1>

          <p className="rise mt-7 max-w-xl text-[1.08rem] leading-relaxed text-pretty text-mist" style={delay(520)}>
            Diseñamos y desarrollamos plataformas web, software a medida, automatizaciones e inteligencia artificial
            aplicada para empresas y negocios.
          </p>

          <div className="rise mt-9 flex flex-wrap gap-3" style={delay(640)}>
            <a href="#proyectos" data-magnetic="10" className="btn btn--primary">
              Ver proyectos
              <span aria-hidden="true" className="btn__icon btn__icon--down">
                ↓
              </span>
            </a>
            <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" data-magnetic="10" className="btn btn--ghost">
              Hablar por WhatsApp
              <span aria-hidden="true" className="btn__icon btn__icon--out text-signal">
                ↗
              </span>
              <span className="sr-only">(se abre en una nueva pestaña)</span>
            </a>
          </div>
        </div>

        <div className="rise-soft relative -mx-5 sm:mx-0 lg:col-span-6" style={delay(120)}>
          <HeroStack />
        </div>
      </div>

      <nav aria-label="Sistemas construidos" className="rise relative z-[2] mx-auto mt-4 max-w-[90rem] px-5 pb-10 sm:px-8 lg:mt-0" style={delay(820)}>
        <div className="flex flex-wrap items-center gap-x-1 gap-y-2 border-t border-line pt-5">
          <span className="label mr-4 text-fog">Sistemas construidos</span>
          {projects.map((project, index) => (
            <Link
              key={project.id}
              href={projectHref(project)}
              transitionTypes={["nav-forward"]}
              className="group inline-flex items-baseline gap-2 px-2 py-1.5 text-[0.9rem] text-mist transition-colors hover:text-bone"
            >
              <span className="font-mono text-[0.68rem] text-fog transition-colors group-hover:text-signal">
                {String(index + 1).padStart(2, "0")}
              </span>
              {project.name}
            </Link>
          ))}
        </div>
      </nav>
    </section>
  );
}

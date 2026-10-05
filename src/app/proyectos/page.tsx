import type { Metadata } from "next";
import { ViewTransition } from "react";
import { ProjectCard } from "@/components/case/ProjectCard";
import { Reveal } from "@/components/motion/Reveal";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Sistemas, plataformas y experiencias digitales desarrollados por Salva Systems, cada uno con su case study.",
  alternates: { canonical: "/proyectos" },
  openGraph: { url: "/proyectos" },
};

export default function ProjectsPage() {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <main id="contenido" className="mx-auto max-w-[90rem] px-5 pt-32 pb-24 sm:px-8 lg:pt-40 lg:pb-32">
        <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="rise label flex items-center gap-3 text-mist">
              <span className="font-mono text-signal">[03]</span>
              <span data-reveal="fade" data-scramble>
                Proyectos
              </span>
            </p>
            <h1 className="display rise mt-5 text-[clamp(2.6rem,7vw,5rem)] leading-[0.98] text-bone" style={{ "--d": "80ms" } as React.CSSProperties}>
              Sistemas en operación.
            </h1>
          </div>
          <p className="rise max-w-xl text-[1.05rem] leading-relaxed text-mist lg:col-span-5" style={{ "--d": "160ms" } as React.CSSProperties}>
            Plataformas, automatizaciones y experiencias digitales que hemos desarrollado. Cada caso explica el problema,
            cómo funciona el sistema y lo muestra en una simulación.
          </p>
        </header>

        <ul className="mt-16 grid gap-5 md:grid-cols-2 lg:mt-20 lg:gap-6">
          {projects.map((project, index) => (
            <Reveal as="li" key={project.id} variant="scale" delay={(index % 2) * 90}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </ul>
      </main>
    </ViewTransition>
  );
}

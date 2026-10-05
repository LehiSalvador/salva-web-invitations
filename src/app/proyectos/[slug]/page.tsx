import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition, type CSSProperties } from "react";
import { CaseContact } from "@/components/case/CaseContact";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectDiagram } from "@/components/ProjectDiagram";
import { scenes } from "@/components/scenes";
import { projectBySlug, projectHref, projects } from "@/data/projects";
import { whatsAppUrl } from "@/lib/whatsapp";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = projectBySlug((await params).slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.description,
    alternates: { canonical: projectHref(project) },
    openGraph: { url: projectHref(project), title: project.name, description: project.description },
  };
}

const pad = (value: number) => String(value).padStart(2, "0");
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = projectBySlug((await params).slug);
  if (!project) notFound();

  const position = projects.indexOf(project);
  const next = projects[(position + 1) % projects.length];
  const previous = projects[(position - 1 + projects.length) % projects.length];
  const { Scene } = scenes[project.id];

  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <main id="contenido">
        <header className="mx-auto max-w-[90rem] px-5 pt-28 sm:px-8 lg:pt-36">
          <nav aria-label="Ruta" className="rise label flex flex-wrap items-center gap-2 text-fog">
            <Link href="/" transitionTypes={["nav-back"]} className="transition-colors hover:text-bone">
              Inicio
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/proyectos" transitionTypes={["nav-back"]} className="transition-colors hover:text-bone">
              Proyectos
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-mist">
              {project.name}
            </span>
          </nav>

          <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="rise label flex flex-wrap items-center gap-3 text-signal" style={delay(60)}>
                Caso {pad(position + 1)} / {pad(projects.length)}
                <span className="h-px w-8 bg-line-strong" />
                <span className="text-mist">{project.category}</span>
              </p>
              <div className="mt-6 flex min-w-0 flex-col items-start gap-5 sm:flex-row sm:items-center">
                {project.logo && (
                  <span className="rise flex size-16 shrink-0 items-center justify-center border border-line bg-ink-900 p-2.5 sm:size-20" style={delay(100)}>
                    <Image
                      src={project.logo.src}
                      alt={project.logo.alt}
                      width={project.logo.width}
                      height={project.logo.height}
                      sizes="80px"
                      priority
                      unoptimized={project.logo.src.endsWith(".svg")}
                      className="h-full w-auto object-contain"
                    />
                  </span>
                )}
                <ViewTransition name={`project-title-${project.id}`} share="morph" default="none">
                  <h1 className="display min-w-0 text-[clamp(2.25rem,8.6vw,6rem)] leading-[0.95] [overflow-wrap:anywhere] text-bone">{project.name}</h1>
                </ViewTransition>
              </div>
            </div>
            <div className="rise lg:col-span-4" style={delay(200)}>
              <p className="text-[1.08rem] leading-relaxed text-pretty text-bone/85">{project.description}</p>
              {project.relation && <p className="label mt-4 border-l border-rose pl-3 leading-relaxed text-rose">{project.relation}</p>}
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#simulacion" className="btn btn--ghost !min-h-11">
                  Ver cómo funciona
                  <span aria-hidden="true" className="btn__icon btn__icon--down text-signal">
                    ↓
                  </span>
                </a>
              </div>
            </div>
          </div>
        </header>

        <section id="simulacion" aria-label={`Simulación de ${project.name}`} className="mx-auto mt-12 max-w-[90rem] px-5 sm:px-8 lg:mt-16">
          <div className="rise-soft frame-marks surface overflow-hidden" style={delay(240)}>
            <div className="label flex items-center justify-between gap-4 border-b border-line px-4 py-3 text-fog">
              <span className="truncate">{project.scene}</span>
              <span className="flex shrink-0 items-center gap-2 text-mist">
                <span className="live-dot" aria-hidden="true" />
                simulación
              </span>
            </div>
            <Scene />
          </div>
          <p className="mt-3 text-sm text-fog">Representación conceptual animada de cómo funciona el sistema.</p>
        </section>

        <section aria-labelledby="problema-title" className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 lg:py-32">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-12 lg:gap-8">
            <Reveal className="lg:col-span-5">
              <p className="label text-signal" data-scramble>
                El problema
              </p>
              <h2 id="problema-title" className="display mt-5 text-[clamp(1.7rem,3.2vw,2.35rem)] leading-[1.08] text-balance text-bone">
                {project.pitch}
              </h2>
              <p className="mt-6 text-[1.05rem] leading-relaxed text-pretty text-mist">{project.context}</p>
            </Reveal>

            <Reveal variant="group" className="lg:col-span-6 lg:col-start-7">
              <p className="label text-signal">Cómo funciona</p>
              <ol className="stagger mt-5 border-t border-line">
                {project.steps.map((step, index) => (
                  <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-x-2 border-b border-line py-5" style={{ "--i": index } as CSSProperties}>
                    <span className="font-mono text-xs text-signal">{pad(index + 1)}</span>
                    <span>
                      <span className="display block text-[1.35rem] leading-tight text-bone">{step.title}</span>
                      <span className="mt-1.5 block leading-relaxed text-mist">{step.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          <Reveal variant="group" className="mt-16 grid grid-cols-[minmax(0,1fr)] gap-6 lg:mt-24 lg:grid-cols-12 lg:items-center">
            <figure className="surface frame-marks p-3 sm:p-5 lg:col-span-7">
              <div className="label mb-3 flex items-center justify-between gap-4 border-b border-line pb-3 text-fog">
                <span>Esquema · {project.slug}</span>
                <span className="text-mist">flujo del sistema</span>
              </div>
              <ProjectDiagram id={project.id} title={project.figure} />
              <figcaption className="mt-3 text-sm leading-snug text-fog">{project.figure}</figcaption>
            </figure>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="label text-signal">Componentes del sistema</p>
              <ul className="stagger mt-5 grid gap-px border border-line bg-line">
                {project.capabilities.map((capability, index) => (
                  <li key={capability.title} data-spotlight className="bg-ink-950/90 p-4" style={{ "--i": index } as CSSProperties}>
                    <span className="display block text-[1.1rem] text-bone">{capability.title}</span>
                    <span className="mt-1 block text-[0.95rem] leading-relaxed text-mist">{capability.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        <nav aria-label="Más proyectos" className="mx-auto max-w-[90rem] px-5 sm:px-8">
          <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
            {[
              { label: "Proyecto anterior", item: previous, arrow: "←", type: "nav-back" },
              { label: "Siguiente proyecto", item: next, arrow: "→", type: "nav-forward" },
            ].map(({ label, item, arrow, type }) => (
              <Link
                key={label}
                href={projectHref(item)}
                transitionTypes={[type]}
                data-spotlight
                className={`group flex flex-col gap-3 bg-ink-950/90 p-6 sm:p-8 ${arrow === "→" ? "sm:items-end sm:text-right" : ""}`}
              >
                <span className="label text-fog">
                  {arrow === "←" && <span aria-hidden="true">← </span>}
                  {label}
                  {arrow === "→" && <span aria-hidden="true"> →</span>}
                </span>
                <span className="display text-[clamp(1.6rem,3.6vw,2.4rem)] leading-none text-bone transition-colors group-hover:text-signal">
                  {item.name}
                </span>
                <span className="label text-mist">{item.category}</span>
              </Link>
            ))}
          </div>
        </nav>

        <CaseContact projectName={project.name} whatsAppUrl={whatsAppUrl} />
      </main>
    </ViewTransition>
  );
}

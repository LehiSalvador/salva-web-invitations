import Image from "next/image";
import { ProjectDiagram } from "@/components/ProjectDiagram";
import { ProjectsCarousel } from "@/components/ProjectsCarousel";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { projects, type Project } from "@/data/projects";

const pad = (value: number) => String(value).padStart(2, "0");

function ProjectDetail({ project, index }: { project: Project; index: number }) {
  const number = pad(index + 1);
  const mirrored = index % 2 === 1;
  return (
    <article
      id={`proyecto-${project.id}`}
      aria-labelledby={`proyecto-${project.id}-titulo`}
      className="border-t border-line py-16 lg:py-24"
    >
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className={`lg:col-span-5 ${mirrored ? "lg:order-2" : ""}`}>
          <div className="flex items-center gap-4">
            {project.logo ? (
              <span className="flex size-14 shrink-0 items-center justify-center border border-line bg-ink-900 p-2">
                <Image
                  src={project.logo.src}
                  alt={project.logo.alt}
                  width={project.logo.width}
                  height={project.logo.height}
                  sizes="56px"
                  unoptimized={project.logo.src.endsWith(".svg")}
                  className="h-full w-auto object-contain"
                />
              </span>
            ) : null}
            <div className="min-w-0">
              <p className="label text-gold-400">
                Sistema {number} / {pad(projects.length)}
              </p>
              <p className="label mt-1.5 text-mist">{project.category}</p>
            </div>
          </div>

          <h3 id={`proyecto-${project.id}-titulo`} className="display mt-7 text-[clamp(2.2rem,5.4vw,3.6rem)] leading-[1] text-bone">
            {project.name}
          </h3>
          <p className="mt-5 text-[1.08rem] leading-relaxed text-pretty text-bone/85">{project.description}</p>
          {project.relation && (
            <p className="label mt-5 border-l border-rose pl-3 leading-relaxed text-rose">{project.relation}</p>
          )}

          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Componentes del sistema">
            {project.parts.map((part) => (
              <li key={part} className="label border border-line px-2.5 py-1.5 text-mist">
                {part}
              </li>
            ))}
          </ul>
        </Reveal>

        <figure className={`lg:col-span-7 ${mirrored ? "lg:order-1" : ""}`}>
          <Reveal variant="group" className="frame-marks border border-line bg-ink-900 p-3 sm:p-5">
            <div className="label mb-3 flex items-center justify-between gap-4 border-b border-line pb-3 text-fog">
              <span>fig. {number} · {project.id}</span>
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-signal" />
                esquema animado
              </span>
            </div>
            <ProjectDiagram id={project.id} title={project.figure} />
          </Reveal>
          <figcaption className="mt-3 text-sm leading-snug text-fog">{project.figure}</figcaption>
        </figure>
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section id="proyectos" aria-labelledby="proyectos-title" className="relative border-t border-line bg-ink-950">
      <div className="mx-auto max-w-[90rem] px-5 pt-24 pb-8 sm:px-8 lg:pt-32">
        <SectionHeading
          section="proyectos"
          title="Proyectos y soluciones"
          intro="Algunos de los sistemas, plataformas y experiencias digitales que hemos desarrollado. Elige uno para ver cómo funciona."
        />

        <Reveal className="mt-14 lg:mt-16">
          <ProjectsCarousel projects={projects} />
        </Reveal>

        <div className="mt-20 lg:mt-28">
          {projects.map((project, index) => (
            <ProjectDetail key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import { ProjectDiagram } from "@/components/ProjectDiagram";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { projects, type Project } from "@/data/projects";

const pad = (value: number) => String(value).padStart(2, "0");

function ProjectPlate({ project, index }: { project: Project; index: number }) {
  const number = pad(index + 1);
  const mirrored = index % 2 === 1;
  return (
    <article
      id={`proyecto-${project.id}`}
      aria-labelledby={`proyecto-${project.id}-titulo`}
      className="border-t border-line py-14 lg:py-24"
    >
      <div className="grid gap-x-8 lg:grid-cols-12">
        <div className="flex items-baseline justify-between gap-4 lg:col-span-12">
          <p className="label text-fog">
            Sistema {number} / {pad(projects.length)}
          </p>
          <p className="label text-right text-mist">{project.category}</p>
        </div>

        <Reveal variant="clip" className={`mt-6 flex items-end gap-5 lg:col-span-12 ${mirrored ? "lg:justify-end lg:text-right" : ""}`}>
          <span aria-hidden="true" className="hidden font-display text-[clamp(4rem,9vw,8.5rem)] leading-[0.8] text-fog/60 italic lg:block">
            {number}
          </span>
          <h3
            id={`proyecto-${project.id}-titulo`}
            className="font-display text-[clamp(2.9rem,8.5vw,7.6rem)] leading-[0.88] tracking-[-0.02em] text-bone"
          >
            {project.name}
          </h3>
        </Reveal>

        <figure className={`mt-10 lg:col-span-7 lg:row-start-3 lg:mt-14 ${mirrored ? "lg:col-start-6" : ""}`}>
          <Reveal variant="group" className="reg-marks bg-ink-900 p-4 text-mist sm:p-6">
            <ProjectDiagram id={project.id} title={project.figure} />
          </Reveal>
          <figcaption className="mt-3 flex gap-3 text-sm leading-snug text-fog">
            <span className="label shrink-0 pt-0.5 text-gold-400">Fig. {number}</span>
            <span>{project.figure}</span>
          </figcaption>
        </figure>

        <div
          className={`mt-10 flex flex-col lg:col-span-4 lg:row-start-3 lg:mt-14 ${
            mirrored ? "lg:col-start-1" : "lg:col-start-9"
          }`}
        >
          {project.logo && (
            <div className="mb-8 flex size-24 items-center justify-center border border-line bg-ink-900 p-3">
              <Image
                src={project.logo.src}
                alt={project.logo.alt}
                width={project.logo.width}
                height={project.logo.height}
                sizes="96px"
                unoptimized={project.logo.src.endsWith(".svg")}
                className="h-full w-auto object-contain"
              />
            </div>
          )}
          <p className="text-[1.12rem] leading-relaxed text-pretty text-bone/90">{project.description}</p>
          {project.relation && (
            <p className="label mt-5 border-l border-rose pl-3 leading-relaxed text-rose">{project.relation}</p>
          )}
          <dl className="mt-auto pt-10">
            <dt className="label text-fog">Componentes del sistema</dt>
            <dd>
              <ul className="mt-3 border-t border-line">
                {project.parts.map((part, partIndex) => (
                  <li key={part} className="flex items-baseline gap-4 border-b border-line py-2 text-[0.95rem] text-mist">
                    <span className="font-mono text-[0.7rem] text-fog">
                      {number}.{partIndex + 1}
                    </span>
                    {part}
                  </li>
                ))}
              </ul>
            </dd>
          </dl>
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section id="proyectos" aria-labelledby="proyectos-title" className="grain relative bg-ink-950 text-bone">
      <div className="mx-auto max-w-[90rem] px-5 pt-24 pb-16 sm:px-8 lg:pt-32">
        <SectionHeading section="proyectos" title="Proyectos y soluciones" aside="Archivo de sistemas construidos" />
        <Reveal className="mt-8 grid lg:grid-cols-12" delay={150}>
          <p className="max-w-xl text-[1.08rem] leading-relaxed text-mist lg:col-span-5 lg:col-start-7">
            Algunos de los sistemas, plataformas y experiencias digitales que hemos desarrollado.
          </p>
        </Reveal>
        <div className="mt-16 lg:mt-24">
          {projects.map((project, index) => (
            <ProjectPlate key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import { scenes } from "@/components/scenes";
import { projectHref, projects, type Project } from "@/data/projects";

const pad = (value: number) => String(value).padStart(2, "0");

/** Tarjeta del índice de proyectos: vista previa viva, nombre y acceso al case study. */
export function ProjectCard({ project }: { project: Project }) {
  const { Preview } = scenes[project.id];
  const position = projects.indexOf(project);
  return (
    <Link
      href={projectHref(project)}
      transitionTypes={["nav-forward"]}
      data-spotlight
      className="group surface flex h-full flex-col transition-colors duration-500 hover:border-signal/40"
    >
      <span className="label flex items-center justify-between gap-4 border-b border-line px-4 py-3 text-fog">
        <span className="truncate">{project.scene}</span>
        <span className="shrink-0 text-signal">
          {pad(position + 1)} / {pad(projects.length)}
        </span>
      </span>
      <span className="relative block aspect-[16/10] overflow-hidden" aria-hidden="true">
        <span className="absolute inset-0 block transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]">
          <Preview />
        </span>
      </span>
      <span className="flex flex-1 flex-col border-t border-line p-5 sm:p-6">
        <span className="flex items-center gap-3">
          {project.logo && (
            <span className="flex size-9 shrink-0 items-center justify-center border border-line bg-ink-900 p-1.5">
              <Image
                src={project.logo.src}
                alt=""
                width={project.logo.width}
                height={project.logo.height}
                sizes="36px"
                unoptimized={project.logo.src.endsWith(".svg")}
                className="h-full w-auto object-contain"
              />
            </span>
          )}
          <span className="label text-mist">{project.category}</span>
        </span>
        <ViewTransition name={`project-title-${project.id}`} share="morph" default="none">
          <span className="display mt-4 block text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1] text-bone">{project.name}</span>
        </ViewTransition>
        <span className="mt-3 block max-w-md leading-relaxed text-mist">{project.pitch}</span>
        <span className="label mt-auto flex items-center gap-2 pt-6 text-bone">
          Explorar el caso
          <span aria-hidden="true" className="text-signal transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
            →
          </span>
        </span>
      </span>
    </Link>
  );
}

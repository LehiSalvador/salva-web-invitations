import Image from "next/image";
import type { Project } from "@/data/projects";
import { ProjectVisual } from "@/components/visuals/ProjectVisual";

type ProjectMediaProps = {
  project: Project;
  position: number;
  total: number;
};

const pad = (value: number) => String(value).padStart(2, "0");

export function ProjectMedia({ project, position, total }: ProjectMediaProps) {
  const { logo } = project;
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-ink-900">
      <div
        className={`absolute inset-0 transition-transform duration-[1200ms] ease-out-expo group-hover/project:scale-[1.04] ${
          logo ? "opacity-[0.16]" : ""
        }`}
      >
        <ProjectVisual kind={project.visual} />
      </div>
      {logo && (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: `radial-gradient(34% 52% at 50% 50%, ${project.glow}, transparent 74%), radial-gradient(46% 70% at 50% 50%, rgb(12 15 19 / 0.85), transparent 80%)`,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              sizes="(min-width: 640px) 180px, 34vw"
              unoptimized={logo.src.endsWith(".svg")}
              draggable={false}
              className="w-auto max-w-[70%] object-contain transition-transform duration-[1200ms] ease-out-expo group-hover/project:scale-[1.05]"
              style={{ height: `${(logo.scale ?? 0.6) * 100}%` }}
            />
          </div>
        </>
      )}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/55 via-transparent to-transparent" />
      <span className="absolute top-3 left-3 rounded-full border border-white/10 bg-ink-950/80 px-3 py-1 font-mono text-[0.68rem] tracking-[0.16em] text-mist uppercase">
        {pad(position)} / {pad(total)}
      </span>
    </div>
  );
}

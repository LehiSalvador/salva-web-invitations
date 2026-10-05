import { ProjectsCarousel } from "@/components/ProjectsCarousel";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

export function Projects() {
  return (
    <section id="proyectos" aria-labelledby="proyectos-title" className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(184_154_98/0.08),transparent)]"
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          id="proyectos-title"
          index="03"
          eyebrow="Proyectos"
          title="Proyectos y soluciones"
          description="Algunos de los sistemas, plataformas y experiencias digitales que hemos desarrollado."
        />
      </div>
      <Reveal delay={100} className="relative mt-14">
        <ProjectsCarousel />
      </Reveal>
    </section>
  );
}

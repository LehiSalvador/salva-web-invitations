import Link from "next/link";
import { ViewTransition } from "react";
import { About } from "@/components/home/About";
import { Capabilities } from "@/components/home/Capabilities";
import { Contact } from "@/components/home/Contact";
import { Hero } from "@/components/home/Hero";
import { Process } from "@/components/home/Process";
import { Showcase } from "@/components/home/Showcase";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { projects } from "@/data/projects";

const pageTransition = {
  enter: { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" },
  exit: { "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" },
  default: "none",
} as const;

export default function Home() {
  return (
    <ViewTransition {...pageTransition}>
      <main id="contenido">
        <Hero />
        <About />
        <Capabilities />
        <section id="proyectos" aria-labelledby="proyectos-title" className="relative">
          <div className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 lg:py-32">
            <SectionHeading
              section="proyectos"
              title="Sistemas que hemos construido."
              intro="Plataformas, automatizaciones y experiencias digitales en operación. Cada una tiene su propio caso con la simulación de cómo funciona."
            />
            <Reveal variant="scale" className="mt-14 lg:mt-20">
              <Showcase projects={projects} />
            </Reveal>
            <Reveal className="mt-10 flex justify-end">
              <Link href="/proyectos" transitionTypes={["nav-forward"]} className="group inline-flex items-center gap-3 text-bone">
                <span className="link-rule">Ver todos los proyectos</span>
                <span aria-hidden="true" className="text-signal transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Reveal>
          </div>
        </section>
        <Process />
        <Contact />
      </main>
    </ViewTransition>
  );
}

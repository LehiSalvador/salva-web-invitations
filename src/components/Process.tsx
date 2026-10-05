import type { CSSProperties } from "react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const stages = [
  { title: "Entendemos", description: "Analizamos el problema y el proceso.", output: "Diagnóstico" },
  { title: "Diseñamos", description: "Definimos la solución y su funcionamiento.", output: "Arquitectura" },
  { title: "Construimos", description: "Desarrollamos la plataforma, aplicación o automatización.", output: "Sistema" },
  { title: "Iteramos", description: "Probamos, corregimos y mejoramos.", output: "Mejora continua" },
];

export function Process() {
  return (
    <section id="proceso" aria-labelledby="proceso-title" className="relative border-t border-line bg-ink-900">
      <div className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 lg:py-32">
        <SectionHeading
          section="proceso"
          title="De una necesidad a un sistema funcionando."
          intro="Un ciclo corto y claro: cada etapa entrega algo concreto a la siguiente y la última vuelve a empezar."
        />

        <Reveal variant="group" className="mt-16 lg:mt-24">
          <div data-live className="pipeline relative">
            <span aria-hidden="true" className="pipeline__rail" />
            <span aria-hidden="true" className="pipeline__runner motion-only">
              <span />
            </span>
            <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-8">
              {stages.map((stage, index) => (
                <li key={stage.title} className="pipeline__stage relative pl-12 lg:pl-0 lg:pt-14" style={{ "--n": index } as CSSProperties}>
                  <span aria-hidden="true" className="pipeline__node">
                    <span className="pipeline__glow" />
                  </span>
                  <p className="font-mono text-xs text-gold-400">
                    {String(index + 1).padStart(2, "0")} <span className="text-fog">/ 04</span>
                  </p>
                  <h3 className="display mt-3 text-[1.9rem] leading-none text-bone sm:text-[2.2rem]">{stage.title}</h3>
                  <p className="mt-4 max-w-xs leading-relaxed text-mist">{stage.description}</p>
                  <p className="label mt-5 inline-flex items-center gap-2 border border-line px-2.5 py-1.5 text-signal">
                    <span aria-hidden="true">→</span> {stage.output}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

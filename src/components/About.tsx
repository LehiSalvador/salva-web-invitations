import type { CSSProperties } from "react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const flow = [
  { label: "Problema", note: "Comprender el problema" },
  { label: "Diseño", note: "Estructurar requerimientos" },
  { label: "Tecnología", note: "Desarrollo y validación" },
  { label: "Implementación", note: "Solución en operación" },
];

export function About() {
  return (
    <section id="nosotros" aria-labelledby="nosotros-title" className="relative border-t border-line bg-ink-950">
      <div className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 lg:py-32">
        <SectionHeading
          section="nosotros"
          title="Tecnología construida alrededor del problema."
          intro={
            <>
              <p>
                Salva Systems desarrolla soluciones digitales orientadas a resolver necesidades reales de empresas y
                negocios. Partimos de comprender el problema, estructurar los requerimientos y diseñar una solución{" "}
                <span className="text-bone">funcional, medible y adaptable</span>.
              </p>
              <p className="mt-4">Participamos desde la idea y el diseño hasta el desarrollo, validación e implementación.</p>
            </>
          }
        />

        <Reveal variant="group" className="mt-16 lg:mt-20">
          <div data-live className="relative">
            <ol className="relative grid gap-px bg-line sm:grid-cols-4">
              {flow.map((step, index) => (
                <li key={step.label} className="relative bg-ink-950 py-6 pr-4 sm:px-5 sm:py-8 sm:first:pl-0">
                  <span className="font-mono text-xs text-gold-400">0{index + 1}</span>
                  <p className="display mt-3 text-[1.55rem] leading-none text-bone sm:mt-10 sm:text-[clamp(1.2rem,2.1vw,1.8rem)]">
                    {step.label}
                  </p>
                  <p className="appear label mt-3 text-fog" style={{ "--i": index } as CSSProperties}>
                    {step.note}
                  </p>
                  {index < flow.length - 1 && <span className="sr-only">, luego </span>}
                </li>
              ))}
            </ol>
            <span aria-hidden="true" className="flow-scan motion-only" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

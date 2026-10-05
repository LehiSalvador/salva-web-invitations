import type { CSSProperties } from "react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const flow = [
  { code: "P", label: "Problema", note: "Comprender el problema" },
  { code: "D", label: "Diseño", note: "Estructurar requerimientos" },
  { code: "T", label: "Tecnología", note: "Desarrollo y validación" },
  { code: "I", label: "Implementación", note: "Solución en operación" },
];

export function About() {
  return (
    <section id="nosotros" aria-labelledby="nosotros-title" className="on-bone grain-dark relative bg-bone text-ink-900">
      <div className="mx-auto max-w-[90rem] px-5 pt-24 pb-20 sm:px-8 lg:pt-32">
        <SectionHeading section="nosotros" title="Tecnología construida alrededor del problema." aside="Método de trabajo" />

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-12">
          <Reveal className="space-y-5 text-[1.08rem] leading-relaxed text-pretty text-graphite lg:col-span-5 lg:col-start-7" delay={150}>
            <p>
              Salva Systems desarrolla soluciones digitales orientadas a resolver necesidades reales de empresas y
              negocios. Nuestro trabajo parte de comprender el problema, estructurar los requerimientos y diseñar una
              solución <span className="text-ink-900">funcional, medible y adaptable</span>.
            </p>
            <p>Participamos desde la idea y el diseño hasta el desarrollo, validación e implementación.</p>
          </Reveal>
        </div>

        <Reveal variant="group" className="mt-20 lg:mt-28">
          <p className="label mb-4 text-graphite">Flujo de trabajo</p>
          <ol className="relative grid border-y border-rule sm:grid-cols-4">
            {flow.map((step, index) => (
              <li
                key={step.code}
                className="relative border-rule px-0 py-5 sm:border-l sm:px-5 sm:py-8 sm:first:border-l-0 sm:first:pl-0 [&:not(:first-child)]:border-t sm:[&:not(:first-child)]:border-t-0"
                style={{ "--i": index } as CSSProperties}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs text-gold-600">
                    {step.code}·0{index + 1}
                  </span>
                  {index < flow.length - 1 && (
                    <svg viewBox="0 0 48 10" className="hidden h-2.5 w-12 text-ink-900 sm:block" aria-hidden="true" fill="none">
                      <path className="draw" pathLength={1} d="M0 5H46M41 1l5 4-5 4" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  )}
                </div>
                <p className="mt-3 font-display text-[2.4rem] leading-none sm:mt-14 sm:text-[clamp(1.6rem,2.9vw,3rem)]">{step.label}</p>
                <p className="appear label mt-3 text-graphite">{step.note}</p>
                {index < flow.length - 1 && <span className="sr-only">, luego </span>}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

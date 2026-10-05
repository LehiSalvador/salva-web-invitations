import type { CSSProperties } from "react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const stages = [
  { number: "01", title: "Entendemos", description: "Analizamos el problema y el proceso." },
  { number: "02", title: "Diseñamos", description: "Definimos la solución y su funcionamiento." },
  { number: "03", title: "Construimos", description: "Desarrollamos la plataforma, aplicación o automatización." },
  { number: "04", title: "Iteramos", description: "Probamos, corregimos y mejoramos." },
];

export function Process() {
  return (
    <section id="proceso" aria-labelledby="proceso-title" className="relative py-24 sm:py-32">
      <div aria-hidden="true" className="hairline-gold pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-5xl opacity-30" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading id="proceso-title" index="04" eyebrow="Proceso" title="De una necesidad a un sistema funcionando." />

        <Reveal as="ol" group className="process-track relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
          <span aria-hidden="true" className="absolute top-[1.375rem] right-0 left-0 hidden h-px bg-line-strong md:block" />
          <span
            aria-hidden="true"
            className="reveal-line-x process-progress-x absolute top-[1.375rem] right-0 left-0 hidden h-px bg-gradient-to-r from-gold-500 to-gold-300 md:block"
          />
          <span aria-hidden="true" className="absolute top-0 bottom-0 left-[1.375rem] w-px bg-line-strong md:hidden" />
          <span
            aria-hidden="true"
            className="reveal-line-y process-progress-y absolute top-0 bottom-0 left-[1.375rem] w-px bg-gradient-to-b from-gold-500 to-gold-300 md:hidden"
          />

          {stages.map((stage, index) => (
            <li
              key={stage.number}
              className="reveal-item relative pl-16 md:pl-0"
              style={{ "--reveal-delay": `${index * 120}ms` } as CSSProperties}
            >
              <span className="absolute top-0 left-0 flex size-11 items-center justify-center rounded-full border border-gold-500/40 bg-ink-950 font-mono text-sm text-gold-300 shadow-[0_0_0_6px_var(--color-ink-950)] md:relative">
                {stage.number}
              </span>
              <h3 className="text-xl font-semibold tracking-tight text-bone md:mt-8">{stage.title}</h3>
              <p className="mt-2 leading-relaxed text-pretty text-mist">{stage.description}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

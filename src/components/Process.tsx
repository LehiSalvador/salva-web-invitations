import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const stages = [
  { title: "Entendemos", description: "Analizamos el problema y el proceso." },
  { title: "Diseñamos", description: "Definimos la solución y su funcionamiento." },
  { title: "Construimos", description: "Desarrollamos la plataforma, aplicación o automatización." },
  { title: "Iteramos", description: "Probamos, corregimos y mejoramos." },
];

export function Process() {
  return (
    <section id="proceso" aria-labelledby="proceso-title" className="on-bone grain-dark relative bg-bone text-ink-900">
      <div className="mx-auto max-w-[90rem] px-5 pt-24 pb-28 sm:px-8 lg:pt-32 lg:pb-36">
        <SectionHeading section="proceso" title="De una necesidad a un sistema funcionando." aside="Secuencia de trabajo" />

        <ol className="mt-14 lg:mt-20">
          {stages.map((stage, index) => (
            <Reveal as="li" key={stage.title} variant="group" className="relative grid gap-x-8 gap-y-4 py-8 lg:grid-cols-12 lg:items-end lg:py-10">
              <span aria-hidden="true" className="rule-grow absolute inset-x-0 top-0 h-px bg-ink-900/70" />
              <span className="font-display text-[4.5rem] leading-[0.8] text-gold-600 italic lg:col-span-2 lg:text-[6.5rem]">
                0{index + 1}
              </span>
              <h3 className="font-display text-[clamp(2.4rem,5vw,4.2rem)] leading-none lg:col-span-4">{stage.title}</h3>
              <p className="max-w-sm text-[1.05rem] leading-relaxed text-graphite lg:col-span-4 lg:col-start-7">
                {stage.description}
              </p>
              <div aria-hidden="true" className="flex gap-1 lg:col-span-2 lg:justify-end">
                {stages.map((_, step) => (
                  <span key={step} className={`h-1.5 w-6 ${step <= index ? "bg-ink-900" : "bg-rule"}`} />
                ))}
              </div>
              <span className="sr-only">
                Etapa {index + 1} de {stages.length}
              </span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

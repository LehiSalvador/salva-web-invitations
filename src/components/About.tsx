import { Reveal } from "@/components/Reveal";
import { FlowSteps } from "@/components/FlowSteps";

export function About() {
  return (
    <section id="nosotros" aria-labelledby="nosotros-title" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <p className="flex items-center gap-3 font-mono text-xs tracking-[0.22em] text-gold-400 uppercase">
              <span className="text-fog">01</span>
              <span aria-hidden="true" className="h-px w-8 bg-gold-500/50" />
              Nosotros
            </p>
            <h2
              id="nosotros-title"
              className="mt-5 text-3xl leading-[1.08] font-semibold tracking-tight text-balance text-bone sm:text-4xl lg:text-5xl"
            >
              Tecnología construida alrededor del problema.
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="space-y-6 text-base leading-relaxed text-pretty text-mist sm:text-lg lg:pt-12">
            <p>
              Salva Systems desarrolla soluciones digitales orientadas a resolver necesidades reales de empresas y
              negocios. Nuestro trabajo parte de comprender el problema, estructurar los requerimientos y diseñar una
              solución <span className="text-bone">funcional, medible y adaptable</span>.
            </p>
            <p>
              Participamos desde la idea y el diseño hasta el desarrollo, validación e implementación.
            </p>
          </Reveal>
        </div>

        <FlowSteps />
      </div>
    </section>
  );
}

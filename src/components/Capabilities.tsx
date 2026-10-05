import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const capabilities = [
  {
    title: "Soluciones a medida",
    description: "Plataformas y herramientas diseñadas alrededor de una necesidad real.",
  },
  {
    title: "Automatización de procesos",
    description: "Reducimos tareas manuales y conectamos información, sistemas y operaciones.",
  },
  {
    title: "Plataformas web y aplicaciones",
    description: "Construimos experiencias digitales orientadas a uso real, no solamente demostraciones.",
  },
  {
    title: "IA e integraciones",
    description: "Integramos inteligencia artificial y servicios externos cuando aportan valor al proceso.",
  },
];

export function Capabilities() {
  return (
    <section id="que-hacemos" aria-labelledby="que-hacemos-title" className="on-bone grain-dark relative bg-bone text-ink-900">
      <div className="mx-auto max-w-[90rem] px-5 pt-8 pb-28 sm:px-8 lg:pb-36">
        <SectionHeading
          section="que-hacemos"
          title="Capacidades para resolver operaciones reales."
          aside="Producto · Software · Automatización · Negocio"
        />

        <ol className="mt-14 border-t border-ink-900 lg:mt-20">
          {capabilities.map((capability, index) => (
            <Reveal as="li" key={capability.title} variant="fade" delay={index * 70} className="group border-b border-rule">
              <div className="grid gap-x-8 gap-y-3 py-7 lg:grid-cols-12 lg:items-baseline lg:py-9">
                <span className="font-mono text-xs text-gold-600 lg:col-span-1">02.{index + 1}</span>
                <h3 className="font-display text-[clamp(2rem,4.4vw,3.7rem)] leading-[1] tracking-[-0.01em] transition-[font-style] lg:col-span-6">
                  <span className="relative">
                    {capability.title}
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-rose transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
                    />
                  </span>
                </h3>
                <p className="max-w-md text-[1.02rem] leading-relaxed text-pretty text-graphite lg:col-span-4 lg:col-start-9">
                  {capability.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

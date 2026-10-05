import type { CSSProperties } from "react";
import { Blocks, BrainCircuit, MonitorSmartphone, Workflow, type LucideIcon } from "lucide-react";
import { InteractiveCard } from "@/components/InteractiveCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

const capabilities: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Soluciones a medida",
    description: "Plataformas y herramientas diseñadas alrededor de una necesidad real.",
    icon: Blocks,
  },
  {
    title: "Automatización de procesos",
    description: "Reducimos tareas manuales y conectamos información, sistemas y operaciones.",
    icon: Workflow,
  },
  {
    title: "Plataformas web y aplicaciones",
    description: "Construimos experiencias digitales orientadas a uso real, no solamente demostraciones.",
    icon: MonitorSmartphone,
  },
  {
    title: "IA e integraciones",
    description: "Integramos inteligencia artificial y servicios externos cuando aportan valor al proceso.",
    icon: BrainCircuit,
  },
];

export function Capabilities() {
  return (
    <section id="que-hacemos" aria-labelledby="que-hacemos-title" className="relative py-24 sm:py-32">
      <div aria-hidden="true" className="hairline-gold pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-5xl opacity-30" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          id="que-hacemos-title"
          index="02"
          eyebrow="Qué hacemos"
          title="Capacidades para resolver operaciones reales."
          description="Cuatro áreas de trabajo que combinan producto, software, automatización y negocio."
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {capabilities.map(({ title, description, icon: Icon }, index) => (
            <li key={title} className="h-full">
              <Reveal delay={index * 80} className="h-full">
                <InteractiveCard
                  className="h-full overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-ink-850 to-ink-900 p-7 hover:border-gold-500/30 sm:p-8"
                >
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                    <div
                      className="pointer-glow group-hover/card:opacity-100"
                      style={{ "--glow-size": "440px", "--glow-color": "rgb(200 173 118 / 0.12)" } as CSSProperties}
                    />
                  </div>
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-start justify-between">
                      <span className="flex size-12 items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/[0.07] text-gold-400 transition-[background-color,border-color] duration-500 group-hover/card:border-gold-400/60 group-hover/card:bg-gold-500/15">
                        <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
                      </span>
                      <span className="font-mono text-xs tracking-[0.2em] text-fog">0{index + 1}</span>
                    </div>
                    <h3 className="mt-10 text-xl font-semibold tracking-tight text-bone">{title}</h3>
                    <p className="mt-3 leading-relaxed text-pretty text-mist">{description}</p>
                    <div aria-hidden="true" className="mt-auto pt-8">
                      <span className="block h-px origin-left scale-x-[0.25] bg-gold-500/60 transition-transform duration-700 ease-out-expo group-hover/card:scale-x-100" />
                    </div>
                  </div>
                </InteractiveCard>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

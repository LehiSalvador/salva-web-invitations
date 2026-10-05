import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

/* Glifos de línea por capacidad: se dibujan al entrar en pantalla. */
const glyph = (d: string) => (
  <svg viewBox="0 0 40 40" className="size-10 shrink-0 text-gold-400" fill="none" aria-hidden="true">
    <path d={d} pathLength={1} className="draw" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

const capabilities: { title: string; description: string; scope: string; icon: ReactNode }[] = [
  {
    title: "Desarrollo web",
    description: "Sitios y experiencias web rápidas, claras y pensadas para que el cliente actúe.",
    scope: "Sitios · Landing pages · Experiencias web",
    icon: glyph("M4 8H36V32H4ZM4 14H36M9 11H11M14 11H16M10 20H22M10 25H30"),
  },
  {
    title: "Desarrollo de software",
    description: "Herramientas internas y sistemas que ordenan información y resuelven tareas específicas.",
    scope: "Sistemas · Herramientas internas · Paneles",
    icon: glyph("M14 12L6 20L14 28M26 12L34 20L26 28M23 9L17 31"),
  },
  {
    title: "Automatización de procesos",
    description: "Reducimos tareas manuales y conectamos información, sistemas y operaciones.",
    scope: "Flujos · Integraciones · Notificaciones",
    icon: glyph("M6 20H14L18 10L24 30L28 20H34M30 16L34 20L30 24"),
  },
  {
    title: "Plataformas y aplicaciones",
    description: "Productos digitales orientados a uso real, no solamente demostraciones.",
    scope: "Plataformas web · Apps · Multiusuario",
    icon: glyph("M6 6H18V18H6ZM22 6H34V18H22ZM6 22H18V34H6ZM22 22H34V34H22Z"),
  },
  {
    title: "Inteligencia artificial aplicada",
    description: "Integramos IA y servicios externos cuando aportan valor real al proceso.",
    scope: "Asistentes · Clasificación · Atención",
    icon: glyph("M20 4V10M20 30V36M4 20H10M30 20H36M10 10H30V30H10ZM16 16H24V24H16Z"),
  },
  {
    title: "Soluciones a medida",
    description: "Diseñamos la herramienta alrededor de la necesidad, no al revés.",
    scope: "Diagnóstico · Diseño · Implementación",
    icon: glyph("M8 32L20 8L32 32ZM14 22H26M20 8V4M8 32H4M32 32H36"),
  },
];

export function Capabilities() {
  return (
    <section id="que-hacemos" aria-labelledby="que-hacemos-title" className="relative border-t border-line bg-ink-900">
      <div className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 lg:py-32">
        <SectionHeading
          section="que-hacemos"
          title="Software, automatización e IA para operaciones reales."
          intro="Combinamos desarrollo, diseño de procesos y tecnología según lo que cada problema necesita."
        />

        <ol className="mt-14 grid border-t border-line md:grid-cols-2 lg:mt-20">
          {capabilities.map((capability, index) => (
            <Reveal
              as="li"
              key={capability.title}
              variant="group"
              className="group relative border-b border-line py-8 md:odd:border-r md:odd:pr-10 md:even:pl-10"
            >
              <div className="flex items-start gap-5">
                {capability.icon}
                <div className="min-w-0">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-fog">0{index + 1}</span>
                    <h3 className="display text-[1.45rem] leading-tight text-bone sm:text-[1.7rem]">{capability.title}</h3>
                  </div>
                  <p className="mt-3 max-w-md leading-relaxed text-pretty text-mist">{capability.description}</p>
                  <p className="label mt-4 text-fog transition-colors group-hover:text-signal">{capability.scope}</p>
                </div>
              </div>
              <span
                aria-hidden="true"
                className="absolute bottom-[-1px] left-0 h-px w-full origin-left scale-x-0 bg-gold-400 transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
              />
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

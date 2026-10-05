import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { projects } from "@/data/projects";

const readouts = [
  { value: String(projects.length).padStart(2, "0"), label: "Sistemas construidos", note: "Industria, IA, comercio, conocimiento y herramientas para desarrolladores." },
  { value: "04", label: "Frentes técnicos", note: "Desarrollo web, software a medida, automatización e IA aplicada." },
];

export function About() {
  return (
    <section id="nosotros" aria-labelledby="nosotros-title" className="relative">
      <div className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 lg:py-32">
        <SectionHeading
          section="nosotros"
          title="Ingeniería de software alrededor del problema."
          intro={
            <>
              <p>
                Salva Systems desarrolla soluciones digitales para necesidades reales de empresas y negocios. Partimos de
                entender el problema y diseñamos una solución <span className="text-bone">funcional, medible y adaptable</span>.
              </p>
              <p className="mt-4">Participamos desde la idea y el diseño hasta el desarrollo, la validación y la implementación.</p>
            </>
          }
        />

        <Reveal variant="group" className="mt-14 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:mt-20">
          {readouts.map((item) => (
            <div key={item.label} data-spotlight className="bg-ink-950/80 p-6 sm:p-8">
              <div className="flex items-end gap-5">
                <span data-count className="display text-[clamp(3.5rem,8vw,5.5rem)] leading-[0.85] text-bone tabular-nums">
                  {item.value}
                </span>
                <span className="label pb-2 text-signal">{item.label}</span>
              </div>
              <p className="mt-5 max-w-sm leading-relaxed text-mist">{item.note}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

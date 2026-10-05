import type { CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

/* Glifo por etapa: se traza al aparecer y tiene un pequeño gesto propio. */
const glyphs = [
  // Entendemos: lupa sobre líneas de un proceso.
  "M6 10H22M6 16H18M6 22H14M27 27L35 35M30 21A8 8 0 1 1 14 21A8 8 0 0 1 30 21Z",
  // Diseñamos: esquema de pantallas conectadas.
  "M4 8H18V20H4ZM24 18H36V32H24ZM18 14H21V25H24",
  // Construimos: bloques que se apilan.
  "M6 30H34M8 30V22H20V30M20 30V14H32V30M12 22V16H18",
  // Iteramos: ciclo de mejora.
  "M31 14A12 12 0 1 0 33 24M31 6V14H23",
];

const stages = [
  { title: "Entendemos", description: "Analizamos el problema, el proceso y a quién afecta.", output: "Diagnóstico" },
  { title: "Diseñamos", description: "Definimos la solución, su arquitectura y cómo se va a usar.", output: "Arquitectura" },
  { title: "Construimos", description: "Desarrollamos la plataforma, la aplicación o la automatización.", output: "Sistema funcionando" },
  { title: "Iteramos", description: "Probamos con uso real, corregimos y mejoramos.", output: "Mejora continua" },
];

export function Process() {
  return (
    <section id="proceso" aria-labelledby="proceso-title" className="relative">
      <div className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 lg:py-32">
        <SectionHeading section="proceso" title="De una necesidad a un sistema funcionando." intro="Un ciclo corto: cada etapa entrega algo concreto a la siguiente." />

        <Reveal variant="group" className="process mt-16 lg:mt-24">
          <span aria-hidden="true" className="process__rail">
            <span className="process__fill" />
          </span>
          <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-8">
            {stages.map((stage, index) => (
              <li key={stage.title} className="process__stage relative pl-14 lg:pl-0 lg:pt-16" style={{ "--n": index } as CSSProperties}>
                <span aria-hidden="true" className="process__node">
                  <span className="process__node-core" />
                </span>
                <svg viewBox="0 0 40 40" className="process__glyph mb-5 size-10" fill="none" aria-hidden="true">
                  <path d={glyphs[index]} pathLength={1} className="draw" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ "--i": index } as CSSProperties} />
                </svg>
                <p className="font-mono text-xs text-fog">
                  <span className="text-signal">{String(index + 1).padStart(2, "0")}</span> / 04
                </p>
                <h3 className="display mt-2 text-[1.9rem] leading-none text-bone sm:text-[2.1rem]">{stage.title}</h3>
                <p className="mt-4 max-w-xs leading-relaxed text-mist">{stage.description}</p>
                <p className="chip mt-5 !text-signal">
                  <span aria-hidden="true">→</span> {stage.output}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

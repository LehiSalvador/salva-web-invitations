"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { SectionHeading } from "@/components/SectionHeading";

const stages = [
  { number: "01", title: "Entendemos", description: "Analizamos el problema y el proceso." },
  { number: "02", title: "Diseñamos", description: "Definimos la solución y su funcionamiento." },
  { number: "03", title: "Construimos", description: "Desarrollamos la plataforma, aplicación o automatización." },
  { number: "04", title: "Iteramos", description: "Probamos, corregimos y mejoramos." },
];

export function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 80%", "end 55%"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const progress = useReducedMotion() ? 1 : smoothProgress;

  return (
    <section id="proceso" aria-labelledby="proceso-title" className="relative py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-5xl hairline-gold opacity-30" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading id="proceso-title" index="04" eyebrow="Proceso" title="De una necesidad a un sistema funcionando." />

        <ol ref={listRef} className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
          <span aria-hidden="true" className="absolute top-[1.375rem] right-0 left-0 hidden h-px bg-line-strong md:block" />
          <motion.span
            aria-hidden="true"
            style={{ scaleX: progress }}
            className="absolute top-[1.375rem] right-0 left-0 hidden h-px origin-left bg-gradient-to-r from-gold-500 to-gold-300 md:block"
          />
          <span aria-hidden="true" className="absolute top-0 bottom-0 left-[1.375rem] w-px bg-line-strong md:hidden" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: progress }}
            className="absolute top-0 bottom-0 left-[1.375rem] w-px origin-top bg-gradient-to-b from-gold-500 to-gold-300 md:hidden"
          />

          {stages.map((stage, index) => (
            <motion.li
              key={stage.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{ duration: 0.8, delay: index * 0.12 }}
              className="relative pl-16 md:pl-0"
            >
              <span className="absolute top-0 left-0 flex size-11 items-center justify-center rounded-full border border-gold-500/40 bg-ink-950 font-mono text-sm text-gold-300 shadow-[0_0_0_6px_var(--color-ink-950)] md:relative">
                {stage.number}
              </span>
              <h3 className="text-xl font-semibold tracking-tight text-bone md:mt-8">{stage.title}</h3>
              <p className="mt-2 leading-relaxed text-pretty text-mist">{stage.description}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

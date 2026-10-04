"use client";

import { motion } from "motion/react";
import { Cpu, PenTool, Rocket, ScanSearch, type LucideIcon } from "lucide-react";

const steps: { label: string; icon: LucideIcon }[] = [
  { label: "Problema", icon: ScanSearch },
  { label: "Diseño", icon: PenTool },
  { label: "Tecnología", icon: Cpu },
  { label: "Implementación", icon: Rocket },
];

export function FlowSteps() {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      className="relative mt-16 rounded-3xl border border-line bg-gradient-to-b from-ink-850/80 to-ink-900/40 p-6 sm:mt-20 sm:p-10"
    >
      <div aria-hidden="true" className="hairline-gold absolute inset-x-10 top-0 h-px opacity-60" />
      <p className="sr-only">Flujo de trabajo:</p>
      <ol className="relative grid gap-8 sm:grid-cols-4 sm:gap-4">
        <motion.span
          aria-hidden="true"
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
          transition={{ duration: 1.6, delay: 0.2 }}
          className="absolute top-7 right-[12.5%] left-[12.5%] hidden h-px origin-left bg-gradient-to-r from-gold-500/70 via-gold-400/50 to-gold-500/70 sm:block"
        />
        <motion.span
          aria-hidden="true"
          variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1 } }}
          transition={{ duration: 1.6, delay: 0.2 }}
          className="absolute top-7 bottom-7 left-7 w-px origin-top bg-gradient-to-b from-gold-500/70 to-gold-500/20 sm:hidden"
        />
        {steps.map(({ label, icon: Icon }, index) => (
          <motion.li
            key={label}
            variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.8, delay: 0.25 + index * 0.28 }}
            className="relative flex items-center gap-5 sm:flex-col sm:gap-4 sm:text-center"
          >
            <span className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl border border-gold-500/35 bg-ink-900 text-gold-400 shadow-[0_0_30px_-8px_rgb(200_173_118/0.45)]">
              <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span>
              <span className="block font-mono text-[0.7rem] tracking-[0.2em] text-fog">0{index + 1}</span>
              <span className="mt-1 block text-lg font-medium text-bone">{label}</span>
            </span>
            {index < steps.length - 1 && <span className="sr-only">, luego </span>}
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}

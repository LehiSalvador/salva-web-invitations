"use client";

import { motion } from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { PointerSurface } from "@/components/PointerSurface";
import { SystemDiagram } from "@/components/SystemDiagram";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { whatsAppUrl } from "@/lib/whatsapp";

const headline: { text: string; accent?: string }[] = [
  { text: "Convertimos problemas" },
  { text: "reales en soluciones" },
  { text: "digitales", accent: "que funcionan." },
];
const capabilities = ["Plataformas web", "Apps", "Automatización", "IA aplicada"];

const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <PointerSurface
      as="section"
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20 md:pt-32"
    >
      <HeroBackdrop />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.35fr_0.65fr] lg:gap-6">
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.12, delayChildren: 0.15 }}
          className="max-w-3xl"
        >
          <motion.p
            variants={rise}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 rounded-full border border-line bg-white/[0.02] py-1.5 pr-4 pl-1.5 text-xs font-medium tracking-[0.24em] text-gold-300 uppercase"
          >
            <span className="relative flex size-6 items-center justify-center rounded-full bg-gold-500/15">
              <span className="size-1.5 rounded-full bg-gold-400" />
              <span className="absolute inset-0 animate-pulse-soft rounded-full border border-gold-500/40" />
            </span>
            Salva Systems
          </motion.p>

          <h1
            id="hero-title"
            className="mt-7 text-[2.55rem] leading-[1.02] font-semibold tracking-[-0.035em] text-bone sm:text-6xl lg:text-[3.4rem] xl:text-[4.25rem]"
          >
            {headline.map((line) => (
              <span key={line.text} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className="block"
                  variants={{ hidden: { y: "105%" }, show: { y: "0%" } }}
                  transition={{ duration: 1.05 }}
                >
                  {line.text}
                  {line.accent && <span className="text-gold-gradient"> {line.accent}</span>}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            variants={rise}
            transition={{ duration: 0.9 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-pretty text-mist sm:text-xl"
          >
            Diseñamos plataformas, automatizaciones y aplicaciones que conectan procesos, tecnología y negocio.
          </motion.p>

          <motion.div
            variants={rise}
            transition={{ duration: 0.9 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <a
              href="#proyectos"
              className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-bone px-7 text-[0.95rem] font-medium text-ink-950 shadow-[0_0_0_1px_rgb(255_255_255/0.1),0_18px_40px_-18px_rgb(200_173_118/0.6)] transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white active:translate-y-0"
            >
              Conoce nuestros proyectos
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </a>
            {whatsAppUrl ? (
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-line-strong bg-white/[0.03] px-7 text-[0.95rem] font-medium text-bone transition-[border-color,background-color] duration-300 hover:border-gold-500/60 hover:bg-gold-500/10"
              >
                <WhatsAppIcon className="size-[18px] text-gold-400" />
                Hablemos por WhatsApp
                <span className="sr-only">(se abre en una nueva pestaña)</span>
              </a>
            ) : (
              <a
                href="#contacto"
                className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-line-strong bg-white/[0.03] px-7 text-[0.95rem] font-medium text-bone transition-[border-color,background-color] duration-300 hover:border-gold-500/60 hover:bg-gold-500/10"
              >
                Hablemos
                <ArrowDown className="size-4 text-gold-400 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
              </a>
            )}
          </motion.div>

          <motion.ul
            variants={rise}
            transition={{ duration: 0.9 }}
            aria-label="Capacidades"
            className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.78rem] tracking-[0.14em] text-fog uppercase"
          >
            {capabilities.map((item, index) => (
              <li key={item} className="flex items-center gap-3">
                {index > 0 && <span aria-hidden="true" className="size-1 rounded-full bg-gold-700" />}
                {item}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.5 }}
          className="relative mx-auto hidden w-full max-w-[520px] lg:block"
        >
          <div className="parallax-soft">
            <SystemDiagram className="h-auto w-full" />
          </div>
        </motion.div>
      </div>

      <a
        href="#nosotros"
        className="group absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[0.7rem] tracking-[0.24em] text-fog uppercase transition-colors hover:text-bone md:flex"
      >
        Explorar
        <span aria-hidden="true" className="relative h-10 w-px overflow-hidden bg-white/10">
          <span className="absolute inset-x-0 top-0 h-4 animate-[scroll-cue_2.4s_ease-in-out_infinite] bg-gold-400" />
        </span>
      </a>
    </PointerSurface>
  );
}

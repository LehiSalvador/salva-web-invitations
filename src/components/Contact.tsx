import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { whatsapp } from "@/data/site";
import { whatsAppUrl } from "@/lib/whatsapp";

export function Contact() {
  return (
    <section id="contacto" aria-labelledby="contacto-title" className="grain relative bg-ink-950 text-bone">
      <div className="mx-auto max-w-[90rem] px-5 pt-24 pb-20 sm:px-8 lg:pt-32 lg:pb-28">
        <SectionHeading
          section="contacto"
          title="¿Tienes una idea o un proceso que podría funcionar mejor?"
          aside="Del problema al sistema"
        />

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-5 lg:col-start-7" delay={120}>
            <p className="text-[1.12rem] leading-relaxed text-pretty text-mist">
              Cuéntanos qué necesitas. Podemos ayudarte a convertirlo en una solución digital.
            </p>
          </Reveal>
        </div>

        <Reveal variant="group" className="mt-16 lg:mt-24">
          <span aria-hidden="true" className="rule-grow block h-px bg-bone/40" />
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-wrap items-end justify-between gap-x-10 gap-y-4 py-8 lg:py-12"
          >
            <span className="font-display text-[clamp(3.2rem,11vw,10rem)] leading-[0.85] tracking-[-0.02em]">
              Hablar por <span className="italic transition-colors duration-500 group-hover:text-gold-300">WhatsApp</span>
            </span>
            <span className="flex items-center gap-4 pb-2">
              <span className="label text-mist">{whatsapp.displayNumber}</span>
              <span
                aria-hidden="true"
                className="flex size-14 items-center justify-center border border-gold-400 text-2xl text-gold-400 transition-[background-color,color] duration-300 group-hover:bg-gold-400 group-hover:text-ink-950 lg:size-16"
              >
                ↗
              </span>
            </span>
            <span className="sr-only">(se abre en una nueva pestaña)</span>
          </a>
          <span aria-hidden="true" className="rule-grow block h-px bg-bone/40" />
        </Reveal>
      </div>
    </section>
  );
}

import { ArrowUpRight } from "lucide-react";
import { BrandSymbol } from "@/components/BrandMark";
import { Reveal } from "@/components/Reveal";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { whatsAppUrl } from "@/lib/whatsapp";

export function Contact() {
  return (
    <section id="contacto" aria-labelledby="contacto-title" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2rem] border border-line bg-ink-900 px-6 py-16 text-center sm:px-12 sm:py-24">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
              <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(60%_70%_at_50%_0%,black,transparent)] opacity-60" />
              <div className="absolute -top-1/2 left-1/2 h-[140%] w-[90%] -translate-x-1/2 animate-pulse-soft rounded-full bg-[radial-gradient(closest-side,rgb(184_154_98/0.18),transparent)]" />
              <div className="hairline-gold absolute inset-x-12 top-0 h-px" />
              <BrandSymbol className="absolute -right-16 -bottom-16 size-80 text-white/[0.03]" />
            </div>

            <p className="font-mono text-xs tracking-[0.22em] text-gold-400 uppercase">05 · Contacto</p>
            <h2
              id="contacto-title"
              className="mx-auto mt-6 max-w-3xl text-3xl leading-[1.08] font-semibold tracking-tight text-balance text-bone sm:text-5xl"
            >
              ¿Tienes una idea o un proceso que podría funcionar mejor?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-mist">
              Cuéntanos qué necesitas. Podemos ayudarte a convertirlo en una solución digital.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4">
              {whatsAppUrl ? (
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-gold-400 px-8 text-base font-semibold text-ink-950 shadow-[0_20px_50px_-20px_rgb(200_173_118/0.8)] transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-gold-300 active:translate-y-0"
                >
                  <WhatsAppIcon className="size-5" />
                  Hablar por WhatsApp
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  <span className="sr-only">(se abre en una nueva pestaña)</span>
                </a>
              ) : (
                <>
                  <span
                    role="link"
                    aria-disabled="true"
                    className="inline-flex min-h-14 cursor-not-allowed items-center justify-center gap-3 rounded-full border border-gold-500/30 bg-gold-500/10 px-8 text-base font-semibold text-gold-300/70"
                  >
                    <WhatsAppIcon className="size-5" />
                    Hablar por WhatsApp
                  </span>
                  <p className="text-sm text-fog">El canal de WhatsApp estará disponible en breve.</p>
                </>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

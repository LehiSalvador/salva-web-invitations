import { Reveal } from "@/components/motion/Reveal";
import { Step } from "@/components/motion/Step";
import { SectionHeading } from "@/components/SectionHeading";
import { whatsapp } from "@/data/site";
import { whatsAppUrl } from "@/lib/whatsapp";

export function Contact() {
  return (
    <section id="contacto" aria-labelledby="contacto-title" className="relative">
      <div className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 lg:py-32">
        <SectionHeading
          section="contacto"
          title="¿Tienes una idea o un proceso que podría funcionar mejor?"
          intro="Cuéntanos qué necesitas. Podemos ayudarte a convertirlo en una solución digital."
        />

        <Reveal variant="scale" className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-12">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-spotlight
            className="contact-cta group relative flex flex-col justify-between gap-12 overflow-hidden bg-gold-400 p-6 text-ink-950 sm:p-10 lg:col-span-7"
          >
            <span className="label flex items-center justify-between gap-4">
              Respuesta directa · WhatsApp
              <span aria-hidden="true" className="contact-cta__arrow flex size-14 items-center justify-center border border-ink-950/70 text-2xl">
                ↗
              </span>
            </span>
            <span>
              <span className="display block text-[clamp(2.4rem,6.4vw,4.6rem)] leading-[0.95]">Hablar por WhatsApp</span>
              <span className="mt-5 block font-mono text-[1.05rem]">{whatsapp.displayNumber}</span>
            </span>
            <span className="sr-only">(se abre en una nueva pestaña)</span>
          </a>

          <div data-live data-cycle="9000" className="surface frame-marks flex flex-col justify-between gap-8 p-6 sm:p-8 lg:col-span-5">
            <p className="label flex items-center justify-between gap-4 text-fog">
              Mensaje que se envía al abrir el chat
              <span className="flex items-center gap-2 text-mist">
                <span className="live-dot" aria-hidden="true" />
                directo
              </span>
            </p>
            <div className="flex flex-col items-end gap-2">
              <Step
                at={[0.06, 0.94]}
                fx="scale"
                className="max-w-[34ch] origin-bottom-right rounded-[14px_14px_4px_14px] bg-signal-600/45 px-4 py-3 text-[0.95rem] leading-relaxed text-bone"
              >
                {whatsapp.message}
              </Step>
              <Step at={[0.22, 0.94]} fx="fade" className="font-mono text-[0.7rem] text-signal" aria-hidden="true">
                enviado ✓✓
              </Step>
            </div>
            <p className="label text-mist">Salva Systems · {whatsapp.displayNumber}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

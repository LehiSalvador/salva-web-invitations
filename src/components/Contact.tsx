import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { whatsapp } from "@/data/site";
import { whatsAppUrl } from "@/lib/whatsapp";

export function Contact() {
  return (
    <section id="contacto" aria-labelledby="contacto-title" className="relative border-t border-line bg-ink-950">
      <div className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 lg:py-32">
        <SectionHeading
          section="contacto"
          title="¿Tienes una idea o un proceso que podría funcionar mejor?"
          intro="Cuéntanos qué necesitas. Podemos ayudarte a convertirlo en una solución digital."
        />

        <Reveal className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-12 lg:items-stretch">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between gap-10 bg-gold-400 p-6 text-ink-950 transition-colors hover:bg-gold-300 sm:p-8 lg:col-span-7"
          >
            <span className="label">Respuesta directa · WhatsApp</span>
            <span className="flex flex-wrap items-end justify-between gap-6">
              <span className="display text-[clamp(2.2rem,6vw,4.2rem)] leading-[0.95]">Hablar por WhatsApp</span>
              <span
                aria-hidden="true"
                className="flex size-14 items-center justify-center border border-ink-950 text-2xl transition-transform duration-500 ease-out-expo group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                ↗
              </span>
            </span>
            <span className="font-mono text-[1.05rem]">{whatsapp.displayNumber}</span>
            <span className="sr-only">(se abre en una nueva pestaña)</span>
          </a>

          <div data-live className="flex flex-col justify-end gap-3 border border-line bg-ink-900 p-6 sm:p-8 lg:col-span-5">
            <p className="label mb-2 text-fog">Mensaje que se envía al abrir el chat</p>
            <p className="max-w-[34ch] self-end rounded-[14px_14px_4px_14px] bg-signal-600/40 px-4 py-3 text-[0.95rem] leading-relaxed text-bone">
              {whatsapp.message}
            </p>
            <p className="label flex items-center gap-2 self-start text-mist">
              <span className="pulse size-1.5 rounded-full bg-gold-300" />
              Salva Systems
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

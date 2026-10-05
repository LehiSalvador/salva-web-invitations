import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { whatsapp } from "@/data/site";

/** Cierre de cada case study: invitación a contactar y regreso al índice. */
export function CaseContact({ projectName, whatsAppUrl }: { projectName: string; whatsAppUrl: string }) {
  return (
    <section aria-labelledby="case-contacto" className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 lg:py-32">
      <Reveal variant="scale" className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="label text-signal">¿Algo parecido para tu negocio?</p>
          <h2 id="case-contacto" className="display mt-5 max-w-[18ch] text-[clamp(2rem,5vw,3.4rem)] leading-[1.02] text-bone">
            Construyamos el sistema que tu operación necesita.
          </h2>
          <p className="mt-5 max-w-lg leading-relaxed text-mist">
            Si {projectName} se parece a lo que buscas, cuéntanos tu caso y vemos cómo resolverlo.
          </p>
        </div>
        <div className="flex flex-col justify-end gap-3 lg:col-span-5">
          <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" data-magnetic="8" className="btn btn--primary justify-between !min-h-14">
            Hablar por WhatsApp
            <span className="font-mono text-sm">{whatsapp.displayNumber}</span>
            <span className="sr-only">(se abre en una nueva pestaña)</span>
          </a>
          <Link href="/proyectos" transitionTypes={["nav-back"]} className="btn btn--ghost justify-between !min-h-14">
            Ver todos los proyectos
            <span aria-hidden="true" className="btn__icon btn__icon--right text-signal">
              →
            </span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

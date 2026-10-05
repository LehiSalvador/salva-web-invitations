"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { capabilityVisuals } from "@/components/home/capabilities/CapabilityVisuals";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { capabilities, type CapabilityId } from "@/data/capabilities";

const AUTO_MS = 6000;
/** Cada capacidad dura un ciclo completo de su visual (data-cycle), dentro de estos límites. */
const MIN_MS = 6000;
const MAX_MS = 12000;

/**
 * "Qué hacemos" como consola: una lista de capacidades (tabs) y un visor que muestra
 * la capacidad activa en movimiento. Avanza sola mientras está en pantalla y se detiene al interactuar.
 */
export function Capabilities() {
  const [active, setActive] = useState<CapabilityId>(capabilities[0].id);
  const [manual, setManual] = useState(false);
  // Con reduced motion no hay avance automático.
  const reduced = useReducedMotion();
  const auto = !manual && !reduced;
  const visorRef = useRef<HTMLDivElement>(null);
  const [capMs, setCapMs] = useState(AUTO_MS);
  const first = useRef(true);

  const select = (id: CapabilityId, byUser: boolean) => {
    if (byUser) setManual(true);
    setActive(id);
    // En mobile el visor queda arriba de la lista: si no está a la vista, se lleva a pantalla.
    const visor = visorRef.current?.closest<HTMLElement>("#cap-visor");
    if (byUser && visor && window.matchMedia("(max-width: 1023px)").matches) {
      const rect = visor.getBoundingClientRect();
      if (rect.top < 64 || rect.bottom > window.innerHeight) {
        const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: window.scrollY + rect.top - 80, behavior: smooth ? "smooth" : "auto" });
      }
    }
  };

  // La barra de progreso dura un ciclo completo del visual activo (que reinicia al mostrarse: data-restart).
  useEffect(() => {
    const cycle = Number(visorRef.current?.querySelector<HTMLElement>(`[data-visual="${active}"] [data-cycle]`)?.dataset.cycle);
    setCapMs(Number.isFinite(cycle) && cycle > 0 ? Math.min(MAX_MS, Math.max(MIN_MS, cycle + 300)) : AUTO_MS);
  }, [active]);

  // Entrada del visual activo: barrido con recorte y leve profundidad.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    visorRef.current?.querySelector<HTMLElement>(`[data-visual="${active}"]`)?.animate(
      [
        { clipPath: "inset(0 0 0 100%)", transform: "scale(1.03)", opacity: 0.4 },
        { clipPath: "inset(0 0 0 0)", transform: "scale(1)", opacity: 1 },
      ],
      { duration: 700, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );
  }, [active]);

  // El avance automático lo marca la barra de progreso: al terminar su animación pasa a la siguiente.
  // La consola completa es un bloque [data-live]: la barra se pausa si la consola sale de pantalla
  // o con el puntero sobre la lista.
  const advance = () => {
    setActive((currentId) => {
      const index = capabilities.findIndex((item) => item.id === currentId);
      return capabilities[(index + 1) % capabilities.length].id;
    });
  };

  const onKey = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = capabilities[(index + delta + capabilities.length) % capabilities.length];
    select(next.id, true);
    document.getElementById(`cap-tab-${next.id}`)?.focus();
  };

  const current = capabilities.find((item) => item.id === active)!;

  return (
    <section id="que-hacemos" aria-labelledby="que-hacemos-title" className="relative">
      <div className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 lg:py-32">
        <SectionHeading
          section="que-hacemos"
          title="Software, automatización e IA para operaciones reales."
          intro="Combinamos desarrollo, diseño de procesos y tecnología según lo que cada problema necesita."
        />

        <Reveal data-live variant="scale" className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-6 lg:mt-20 lg:grid-cols-12 lg:gap-8">
          <div role="tablist" aria-label="Capacidades" aria-orientation="vertical" className="cap-list order-2 lg:order-1 lg:col-span-5">
            {capabilities.map((capability, index) => {
              const selected = capability.id === active;
              return (
                <button
                  key={capability.id}
                  id={`cap-tab-${capability.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="cap-visor"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(capability.id, true)}
                  onKeyDown={(event) => onKey(event, index)}
                  data-spotlight
                  className={`group relative block w-full border-b border-line px-1 py-4 text-left transition-colors first:border-t sm:px-4 ${
                    selected ? "bg-ink-900/70" : "hover:bg-ink-900/40"
                  }`}
                >
                  <span className="flex items-baseline gap-4">
                    <span className={`font-mono text-xs transition-colors ${selected ? "text-signal" : "text-fog"}`}>0{index + 1}</span>
                    <span className={`display text-[1.25rem] leading-tight transition-colors sm:text-[1.45rem] ${selected ? "text-bone" : "text-mist group-hover:text-bone"}`}>
                      {capability.title}
                    </span>
                  </span>
                  <span
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo ${
                      selected ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <span className="overflow-hidden">
                      <span className="block pt-2 pl-9 leading-relaxed text-mist">{capability.description}</span>
                    </span>
                  </span>
                  <span aria-hidden="true" className="absolute inset-x-0 bottom-[-1px] h-px overflow-hidden">
                    {selected && (
                      <span
                        key={`${active}-${auto}-${capMs}`}
                        className={`block h-full origin-left bg-signal ${auto ? "cap-progress" : ""}`}
                        style={{ animationDuration: `${capMs}ms` }}
                        onAnimationEnd={auto ? advance : undefined}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="order-1 lg:order-2 lg:col-span-7">
            <div
              id="cap-visor"
              role="tabpanel"
              aria-labelledby={`cap-tab-${active}`}
              className="frame-marks surface flex h-full min-h-[22rem] flex-col sm:min-h-[26rem]"
            >
              <div className="label flex items-center justify-between gap-4 border-b border-line px-4 py-3 whitespace-nowrap text-fog">
                <span className="min-w-0 truncate">
                  capacidad / <span className="text-mist">{current.tag}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2 text-mist">
                  <span className="live-dot" aria-hidden="true" />
                  en ejecución
                </span>
              </div>
              <div ref={visorRef} className="relative flex-1 overflow-hidden">
                {capabilities.map((capability) => {
                  const Visual = capabilityVisuals[capability.id];
                  return (
                    <div
                      key={capability.id}
                      data-visual={capability.id}
                      data-restart
                      hidden={capability.id !== active}
                      className="absolute inset-0"
                      aria-hidden="true"
                    >
                      <Visual />
                    </div>
                  );
                })}
              </div>
              <ul className="cap-scope flex gap-2 overflow-x-auto border-t border-line px-4 py-3" aria-label="Entregables">
                {current.scope.map((item) => (
                  <li key={item} className="chip shrink-0">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

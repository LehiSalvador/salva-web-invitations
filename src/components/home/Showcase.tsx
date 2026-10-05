"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, ViewTransition } from "react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { scenes } from "@/components/scenes";
import { projectHref, type Project } from "@/data/projects";

const AUTO_MS = 8000;
const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Showcase de proyectos: carrusel de diapositivas con vista previa animada de cada sistema.
 * Avanza solo (la barra de progreso marca el ritmo y se pausa fuera de pantalla o con el puntero),
 * admite flechas, teclado y swipe, y cada diapositiva abre el case study del proyecto.
 */
export function Showcase({ projects }: { projects: Project[] }) {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [manual, setManual] = useState(false);
  // Con reduced motion no hay avance automático.
  const reduced = useReducedMotion();
  const auto = !manual && !reduced;
  const stageRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const first = useRef(true);

  const go = (next: number, byUser = false) => {
    const target = (next + projects.length) % projects.length;
    if (target === index) return;
    if (byUser) setManual(true);
    setDirection(next > index || (index === projects.length - 1 && target === 0) ? 1 : -1);
    // Con reduced motion el cambio es inmediato: no hay diapositiva saliente.
    setLeaving(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? null : index);
    setIndex(target);
  };

  // Transición: la diapositiva nueva entra con un barrido en profundidad; la anterior se retira debajo.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
    const incoming = stageRef.current?.querySelector<HTMLElement>(`[data-slide="${index}"]`);
    const outgoing = stageRef.current?.querySelector<HTMLElement>(`[data-slide="${leaving}"]`);
    const from = direction === 1 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
    incoming?.animate(
      [
        { clipPath: from, transform: `perspective(1400px) rotateY(${direction * -10}deg) scale(1.04)` },
        { clipPath: "inset(0 0 0 0)", transform: "perspective(1400px) rotateY(0deg) scale(1)" },
      ],
      { duration: 750, easing: ease },
    );
    const retreat = outgoing?.animate(
      [
        { opacity: 1, transform: "scale(1)" },
        { opacity: 0.2, transform: "scale(0.94)" },
      ],
      {
        duration: 750,
        easing: ease,
        fill: "forwards",
      },
    );
    const done = window.setTimeout(() => {
      setLeaving(null);
      retreat?.cancel();
    }, 760);
    infoRef.current?.querySelectorAll<HTMLElement>(`[data-info="${index}"] [data-line]`).forEach((line, order) => {
      line.animate(
        [
          { opacity: 0, transform: `translate3d(${direction * 24}px, 0, 0)` },
          { opacity: 1, transform: "none" },
        ],
        { duration: 700, delay: 60 + order * 55, easing: ease, fill: "backwards" },
      );
    });
    return () => {
      window.clearTimeout(done);
      retreat?.cancel();
    };
    // Solo debe correr al cambiar de diapositiva.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.pointerType === "mouse") return;
    swipe.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: React.PointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(event.clientY - start.y)) go(index + (dx < 0 ? 1 : -1), true);
  };

  const onTabKey = (event: React.KeyboardEvent, position: number) => {
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (position + delta + projects.length) % projects.length;
    go(next, true);
    document.getElementById(`showcase-tab-${projects[next].id}`)?.focus();
  };

  return (
    <div className="showcase" role="region" aria-roledescription="carrusel" aria-label="Proyectos destacados">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div ref={infoRef} className="relative order-2 min-h-[19rem] lg:order-1 lg:col-span-5">
          {projects.map((project, position) => (
            <article
              key={project.id}
              data-info={position}
              hidden={position !== index}
              id={`showcase-panel-${project.id}`}
              role="tabpanel"
              aria-labelledby={`showcase-tab-${project.id}`}
              aria-roledescription="diapositiva"
            >
              <p data-line className="label flex items-center gap-3 text-signal">
                {pad(position + 1)} / {pad(projects.length)}
                <span className="h-px w-8 bg-line-strong" />
                <span className="text-mist">{project.category}</span>
              </p>
              <div data-line className="mt-6 flex items-center gap-4">
                {project.logo && (
                  <span className="flex size-12 shrink-0 items-center justify-center border border-line bg-ink-900 p-2">
                    <Image
                      src={project.logo.src}
                      alt=""
                      width={project.logo.width}
                      height={project.logo.height}
                      sizes="48px"
                      unoptimized={project.logo.src.endsWith(".svg")}
                      className="h-full w-auto object-contain"
                    />
                  </span>
                )}
                {position === index ? (
                  <ViewTransition name={`project-title-${project.id}`} share="morph" default="none">
                    <h3 className="display text-[clamp(2.1rem,4.6vw,3.4rem)] leading-[1] text-bone">{project.name}</h3>
                  </ViewTransition>
                ) : (
                  <h3 className="display text-[clamp(2.1rem,4.6vw,3.4rem)] leading-[1] text-bone">{project.name}</h3>
                )}
              </div>
              <p data-line className="mt-5 max-w-md text-[1.08rem] leading-relaxed text-pretty text-bone/85">
                {project.pitch}
              </p>
              <ul data-line className="mt-6 flex flex-wrap gap-2" aria-label="Componentes del sistema">
                {project.parts.slice(0, 4).map((part) => (
                  <li key={part} className="chip">
                    {part}
                  </li>
                ))}
              </ul>
              <div data-line className="mt-8">
                <Link href={projectHref(project)} transitionTypes={["nav-forward"]} data-magnetic="8" className="btn btn--primary">
                  Explorar el caso
                  <span aria-hidden="true" className="btn__icon btn__icon--right">
                    →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="order-1 lg:order-2 lg:col-span-7">
          <div data-tilt="3" className="frame-marks">
            <div ref={stageRef} data-spotlight className="surface" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
              <div className="label flex items-center justify-between gap-4 border-b border-line px-4 py-3 text-fog">
                <span className="truncate">{projects[index].scene}</span>
                <span className="flex shrink-0 items-center gap-2 text-mist">
                  <span className="live-dot" aria-hidden="true" />
                  simulación
                </span>
              </div>
              <div className="relative aspect-[16/11] overflow-hidden sm:aspect-[16/10]">
                {projects.map((project, position) => {
                  const { Preview } = scenes[project.id];
                  const shown = position === index || position === leaving;
                  return (
                    <Link
                      key={project.id}
                      href={projectHref(project)}
                      transitionTypes={["nav-forward"]}
                      data-slide={position}
                      hidden={!shown}
                      tabIndex={position === index ? 0 : -1}
                      aria-label={`Explorar ${project.name}`}
                      className={`absolute inset-0 block ${position === index ? "z-[2]" : "z-[1]"}`}
                    >
                      <Preview />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div data-live className="showcase__rail mt-8 flex items-stretch gap-3 lg:mt-12">
        <div role="tablist" aria-label="Elegir proyecto" className="grid flex-1 grid-cols-6 gap-1.5 sm:gap-3">
          {projects.map((project, position) => {
            const selected = position === index;
            return (
              <button
                key={project.id}
                id={`showcase-tab-${project.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`showcase-panel-${project.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => go(position, true)}
                onKeyDown={(event) => onTabKey(event, position)}
                className="group min-w-0 pt-3 text-left"
              >
                <span aria-hidden="true" className="relative block h-0.5 overflow-hidden bg-line-strong">
                  {selected && (
                    <span
                      key={`${index}-${auto}`}
                      className={`absolute inset-0 origin-left bg-signal ${auto ? "showcase__progress" : ""}`}
                      style={{ animationDuration: `${AUTO_MS}ms` }}
                      onAnimationEnd={auto ? () => go(index + 1) : undefined}
                    />
                  )}
                </span>
                <span className={`mt-3 hidden font-mono text-[0.68rem] sm:block ${selected ? "text-signal" : "text-fog"}`}>
                  {pad(position + 1)}
                </span>
                <span
                  className={`mt-1 hidden truncate text-[0.88rem] transition-colors sm:block ${selected ? "text-bone" : "text-mist group-hover:text-bone"}`}
                >
                  {project.name}
                </span>
                <span className="sr-only sm:hidden">{project.name}</span>
              </button>
            );
          })}
        </div>
        <div className="flex shrink-0 items-end gap-2">
          <button
            type="button"
            onClick={() => go(index - 1, true)}
            aria-label="Proyecto anterior"
            className="flex size-11 items-center justify-center border border-line-strong text-bone transition-colors hover:border-signal hover:text-signal"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            onClick={() => go(index + 1, true)}
            aria-label="Proyecto siguiente"
            className="flex size-11 items-center justify-center border border-line-strong text-bone transition-colors hover:border-signal hover:text-signal"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

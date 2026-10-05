"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";

const pad = (value: number) => String(value).padStart(2, "0");
const AUTO_MS = 4500;

const monogram = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

/**
 * Índice navegable de proyectos: pista con scroll-snap (táctil y trackpad nativos),
 * botones anterior/siguiente y avance automático suave que se detiene al interactuar.
 */
export function ProjectsCarousel({ projects }: { projects: Project[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });
  const interacted = useRef(false);
  const hovering = useRef(false);
  const visible = useRef(false);

  const step = useCallback(() => {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!track || !first) return 0;
    return first.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
  }, []);

  const scrollByCards = useCallback(
    (direction: 1 | -1, loop = false) => {
      const track = trackRef.current;
      if (!track) return;
      const max = track.scrollWidth - track.clientWidth;
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const behavior: ScrollBehavior = smooth ? "smooth" : "auto";
      if (loop && direction === 1 && track.scrollLeft >= max - 4) {
        track.scrollTo({ left: 0, behavior });
        return;
      }
      track.scrollBy({ left: direction * step(), behavior });
    },
    [step],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const size = step() || 1;
      const max = track.scrollWidth - track.clientWidth;
      setCurrent(Math.min(projects.length - 1, Math.round(track.scrollLeft / size)));
      setEdges({ start: track.scrollLeft <= 4, end: track.scrollLeft >= max - 4 });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [projects.length, step]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const stop = () => {
      interacted.current = true;
    };
    const enter = () => {
      hovering.current = true;
    };
    const leave = () => {
      hovering.current = false;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
    }, { threshold: 0.6 });
    observer.observe(root);

    root.addEventListener("pointerdown", stop);
    root.addEventListener("wheel", stop, { passive: true });
    root.addEventListener("keydown", stop);
    root.addEventListener("pointerenter", enter);
    root.addEventListener("pointerleave", leave);

    const timer = window.setInterval(() => {
      if (interacted.current || hovering.current || !visible.current || document.hidden) return;
      if (root.contains(document.activeElement)) return;
      scrollByCards(1, true);
    }, AUTO_MS);

    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      root.removeEventListener("pointerdown", stop);
      root.removeEventListener("wheel", stop);
      root.removeEventListener("keydown", stop);
      root.removeEventListener("pointerenter", enter);
      root.removeEventListener("pointerleave", leave);
    };
  }, [scrollByCards]);

  return (
    <div ref={rootRef} role="region" aria-roledescription="carrusel" aria-label="Proyectos destacados">
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="label text-mist" aria-live="polite">
          <span className="text-bone">{pad(current + 1)}</span> / {pad(projects.length)} · {projects[current]?.name}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              interacted.current = true;
              scrollByCards(-1);
            }}
            disabled={edges.start}
            aria-label="Proyecto anterior"
            className="flex size-11 items-center justify-center border border-line-strong text-bone transition-colors hover:border-gold-400 hover:text-gold-300 disabled:opacity-30 disabled:hover:border-line-strong disabled:hover:text-bone"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            onClick={() => {
              interacted.current = true;
              scrollByCards(1, true);
            }}
            aria-label="Proyecto siguiente"
            className="flex size-11 items-center justify-center border border-line-strong text-bone transition-colors hover:border-gold-400 hover:text-gold-300"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        className="carousel-track flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2"
      >
        {projects.map((project, index) => (
          <li key={project.id} className="w-[80%] shrink-0 snap-start sm:w-[46%] lg:w-[calc((100%-3rem)/3.4)]">
            <a
              href={`#proyecto-${project.id}`}
              className="group carousel-card frame-marks flex h-full flex-col border border-line bg-ink-900 p-5 transition-colors duration-300 hover:border-gold-400/60 sm:p-6"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-xs text-gold-400">{pad(index + 1)}</span>
                <span className="label truncate text-right text-fog">{project.category}</span>
              </div>

              <div className="relative mt-6 flex h-28 items-center justify-center overflow-hidden border border-line bg-ink-950">
                <span aria-hidden="true" className="carousel-card__scan" />
                {project.logo ? (
                  <Image
                    src={project.logo.src}
                    alt=""
                    width={project.logo.width}
                    height={project.logo.height}
                    sizes="96px"
                    unoptimized={project.logo.src.endsWith(".svg")}
                    className="relative h-16 w-auto object-contain transition-transform duration-500 ease-out-expo group-hover:scale-105"
                  />
                ) : (
                  <span className="display relative text-[2.6rem] leading-none text-bone/80 transition-colors group-hover:text-gold-300">
                    {monogram(project.name)}
                  </span>
                )}
              </div>

              <h3 className="display mt-6 text-[1.5rem] leading-tight text-bone">{project.name}</h3>
              <p className="mt-2 line-clamp-2 text-[0.93rem] leading-relaxed text-mist">{project.description}</p>

              <span className="label mt-auto flex items-center gap-2 pt-6 text-bone">
                Explorar sistema
                <span aria-hidden="true" className="text-gold-400 transition-transform duration-300 group-hover:translate-y-0.5">
                  ↓
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div aria-hidden="true" className="mt-5 flex gap-1.5">
        {projects.map((project, index) => (
          <span
            key={project.id}
            className={`h-0.5 flex-1 transition-colors duration-500 ${index === current ? "bg-gold-400" : "bg-line-strong"}`}
          />
        ))}
      </div>
    </div>
  );
}

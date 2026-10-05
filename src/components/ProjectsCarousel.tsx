"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { projects } from "@/data/projects";
import { ProjectMedia } from "@/components/ProjectMedia";

const COPIES = 2;
const SPEED_PX_PER_SECOND = 34;
const DRAG_THRESHOLD_PX = 4;
/** Mantiene currentTime lejos de 0 para poder retroceder sin salir del rango de la animación. */
const TIME_HEADROOM_ITERATIONS = 1000;
const easeOutQuart = (t: number) => 1 - (1 - t) ** 4;
const loopDurationFor = (width: number) => (width / SPEED_PX_PER_SECOND) * 1000;
const normalizeTimeFor = (time: number, width: number) => {
  const duration = loopDurationFor(width);
  return (((time % duration) + duration) % duration) + duration * TIME_HEADROOM_ITERATIONS;
};

/**
 * Carrusel en loop: el desplazamiento automático es una animación WAAPI (corre en el compositor);
 * arrastre y controles solo ajustan su currentTime.
 */
export function ProjectsCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstCopyRef = useRef<HTMLUListElement>(null);
  const animation = useRef<Animation | null>(null);
  const loopWidth = useRef(0);
  const tweenFrame = useRef(0);
  const blockers = useRef({ hover: false, focus: false, drag: false, tween: false, offscreen: true, reduced: false, user: false });
  const drag = useRef({ active: false, moved: false, startX: 0, startTime: 0, lastX: 0, lastStamp: 0, velocity: 0 });
  const [userPaused, setUserPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dragging, setDragging] = useState(false);

  const currentTime = () => Number(animation.current?.currentTime ?? 0);
  const normalizeTime = (time: number) => normalizeTimeFor(time, loopWidth.current);

  const sync = useCallback(() => {
    const anim = animation.current;
    if (!anim) return;
    const shouldRun = !Object.values(blockers.current).some(Boolean);
    if (shouldRun && anim.playState !== "running") anim.play();
    if (!shouldRun && anim.playState === "running") anim.pause();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const list = firstCopyRef.current;
    if (!track || !list) return;
    const build = () => {
      const width = list.offsetWidth;
      const previousWidth = loopWidth.current;
      if (!width || width === previousWidth) return;
      const previous = animation.current;
      const previousTime = Number(previous?.currentTime ?? 0);
      const progress = previous && previousWidth ? (previousTime % loopDurationFor(previousWidth)) / loopDurationFor(previousWidth) : 0;
      previous?.cancel();
      loopWidth.current = width;
      const anim = track.animate(
        [{ transform: "translate3d(0, 0, 0)" }, { transform: `translate3d(${-width}px, 0, 0)` }],
        { duration: loopDurationFor(width), iterations: Infinity, easing: "linear" },
      );
      anim.pause();
      anim.currentTime = normalizeTimeFor(progress * loopDurationFor(width), width);
      animation.current = anim;
      sync();
    };
    build();
    const observer = new ResizeObserver(build);
    observer.observe(list);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(tweenFrame.current);
      animation.current?.cancel();
      animation.current = null;
      loopWidth.current = 0;
    };
  }, [sync]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      blockers.current.reduced = query.matches;
      setReducedMotion(query.matches);
      sync();
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [sync]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        blockers.current.offscreen = !entry.isIntersecting;
        sync();
      },
      { rootMargin: "120px 0px" },
    );
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [sync]);

  const shiftBy = (pixels: number, duration: number) => {
    const anim = animation.current;
    if (!anim || !loopWidth.current) return;
    cancelAnimationFrame(tweenFrame.current);
    const from = currentTime();
    const to = from - (pixels / SPEED_PX_PER_SECOND) * 1000;
    const finish = () => {
      anim.currentTime = normalizeTime(currentTime());
      blockers.current.tween = false;
      sync();
    };
    blockers.current.tween = true;
    sync();
    if (blockers.current.reduced || duration === 0) {
      anim.currentTime = to;
      finish();
      return;
    }
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      anim.currentTime = from + (to - from) * easeOutQuart(progress);
      if (progress < 1) tweenFrame.current = requestAnimationFrame(step);
      else finish();
    };
    tweenFrame.current = requestAnimationFrame(step);
  };

  const step = (direction: 1 | -1) => {
    const width = loopWidth.current;
    if (!width) return;
    const cardStep = width / projects.length;
    const offset = -(((currentTime() * SPEED_PX_PER_SECOND) / 1000) % width);
    const target = Math.round(offset / cardStep) * cardStep - direction * cardStep;
    shiftBy(target - offset, 700);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.pointerType === "mouse" && event.button !== 0) || !animation.current) return;
    cancelAnimationFrame(tweenFrame.current);
    blockers.current.tween = false;
    sync();
    drag.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startTime: normalizeTime(currentTime()),
      lastX: event.clientX,
      lastStamp: event.timeStamp,
      velocity: 0,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    const anim = animation.current;
    if (!state.active || !anim) return;
    const dx = event.clientX - state.startX;
    if (!state.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
      state.moved = true;
      blockers.current.drag = true;
      sync();
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const elapsed = Math.max(event.timeStamp - state.lastStamp, 1);
    state.velocity = ((event.clientX - state.lastX) / elapsed) * 1000;
    state.lastX = event.clientX;
    state.lastStamp = event.timeStamp;
    anim.currentTime = state.startTime - (dx / SPEED_PX_PER_SECOND) * 1000;
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state.active) return;
    state.active = false;
    if (!state.moved) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    blockers.current.drag = false;
    setDragging(false);
    const limit = loopWidth.current / 3;
    const fling = Math.max(Math.min(state.velocity * 0.22, limit), -limit);
    shiftBy(Math.abs(fling) > 4 ? fling : 0, Math.abs(fling) > 4 ? 900 : 0);
  };

  const toggleAutoplay = () => {
    const next = !userPaused;
    blockers.current.user = next;
    setUserPaused(next);
    sync();
  };

  const autoplayOff = reducedMotion || userPaused;

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Proyectos y soluciones"
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        blockers.current.hover = true;
        sync();
      }}
      onPointerLeave={() => {
        blockers.current.hover = false;
        sync();
      }}
      onFocus={() => {
        blockers.current.focus = true;
        sync();
      }}
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
        blockers.current.focus = false;
        sync();
      }}
    >
      <div
        ref={viewportRef}
        className={`relative overflow-hidden select-none [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)] ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDragStart={(event) => event.preventDefault()}
      >
        <div ref={trackRef} className="flex w-max py-2 will-change-transform">
          {Array.from({ length: COPIES }, (_, copy) => (
            <ul
              key={copy}
              ref={copy === 0 ? firstCopyRef : undefined}
              aria-hidden={copy === 0 ? undefined : true}
              inert={copy !== 0}
              className="flex shrink-0 gap-5 pr-5"
            >
              {projects.map((project, index) => (
                <li key={project.id} className="w-[82vw] max-w-[440px] shrink-0 sm:w-[420px] lg:w-[440px]">
                  <article
                    aria-label={copy === 0 ? `${project.name}, ${index + 1} de ${projects.length}` : undefined}
                    className="group/project h-full rounded-3xl border border-line bg-gradient-to-b from-ink-850 to-ink-900 p-3 transition-[border-color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-gold-500/35"
                  >
                    <ProjectMedia project={project} position={index + 1} total={projects.length} />
                    <div className="px-3 pt-5 pb-4">
                      <p className="font-mono text-[0.72rem] tracking-[0.16em] text-gold-400 uppercase">{project.category}</p>
                      <h3 className="mt-2 text-xl font-semibold tracking-tight text-bone sm:text-2xl">{project.name}</h3>
                      <p className="mt-3 leading-relaxed text-pretty text-mist">{project.description}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <p className="hidden font-mono text-xs tracking-[0.16em] text-fog uppercase sm:block">
          Arrastra o usa los controles
        </p>
        <div className="flex items-center gap-2 sm:ml-auto">
          <button
            type="button"
            onClick={toggleAutoplay}
            disabled={reducedMotion}
            aria-pressed={autoplayOff}
            aria-label={autoplayOff ? "Reanudar desplazamiento automático" : "Pausar desplazamiento automático"}
            className="inline-flex size-12 items-center justify-center rounded-full border border-line text-mist transition-colors hover:border-gold-500/50 hover:text-bone disabled:cursor-not-allowed disabled:opacity-40"
          >
            {autoplayOff ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Proyecto anterior"
            className="inline-flex size-12 items-center justify-center rounded-full border border-line text-bone transition-colors hover:border-gold-500/50 hover:bg-gold-500/10"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Proyecto siguiente"
            className="inline-flex size-12 items-center justify-center rounded-full border border-line text-bone transition-colors hover:border-gold-500/50 hover:bg-gold-500/10"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

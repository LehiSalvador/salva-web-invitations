"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { projects } from "@/data/projects";
import { ProjectVisual } from "@/components/visuals/ProjectVisual";

const COPIES = 3;
const SPEED_PX_PER_SECOND = 34;
const DRAG_THRESHOLD_PX = 4;

export function ProjectsCarousel() {
  const reducedMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const firstCopyRef = useRef<HTMLUListElement>(null);
  const inView = useInView(viewportRef, { margin: "200px 0px" });
  const x = useMotionValue(0);
  const setWidth = useRef(0);
  const tween = useRef<AnimationPlaybackControls | null>(null);
  const drag = useRef({ active: false, moved: false, startX: 0, startOffset: 0, lastX: 0, lastTime: 0, velocity: 0 });

  const [userPaused, setUserPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [dragging, setDragging] = useState(false);

  const autoplayOff = reducedMotion === true || userPaused;
  const isMoving = !autoplayOff && !hovering && !focusWithin && !dragging && inView;

  const normalize = useCallback(() => {
    const width = setWidth.current;
    if (!width) return;
    let value = x.get();
    while (value > -width) value -= width;
    while (value <= -2 * width) value += width;
    x.set(value);
  }, [x]);

  useEffect(() => {
    const list = firstCopyRef.current;
    if (!list) return;
    const measure = () => {
      const previous = setWidth.current;
      setWidth.current = list.offsetWidth;
      if (!previous) x.set(-setWidth.current);
      else x.set((x.get() / previous) * setWidth.current);
      normalize();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [normalize, x]);

  useAnimationFrame((_, delta) => {
    if (!isMoving || tween.current || !setWidth.current) return;
    x.set(x.get() - (SPEED_PX_PER_SECOND * Math.min(delta, 64)) / 1000);
    normalize();
  });

  const glide = useCallback(
    (distance: number, duration = 0.75) => {
      tween.current?.stop();
      normalize();
      const controls = animate(x, x.get() + distance, {
        duration: reducedMotion ? 0 : duration,
        ease: [0.16, 1, 0.3, 1],
        onComplete: () => {
          tween.current = null;
          normalize();
        },
      });
      tween.current = controls;
    },
    [normalize, reducedMotion, x],
  );

  const step = (direction: 1 | -1) => {
    const cardStep = setWidth.current / projects.length;
    if (!cardStep) return;
    const current = x.get();
    const target = Math.round((current - direction * cardStep) / cardStep) * cardStep;
    glide(target - current);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    tween.current?.stop();
    tween.current = null;
    normalize();
    drag.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startOffset: x.get(),
      lastX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state.active) return;
    const dx = event.clientX - state.startX;
    if (!state.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
      state.moved = true;
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const elapsed = Math.max(event.timeStamp - state.lastTime, 1);
    state.velocity = ((event.clientX - state.lastX) / elapsed) * 1000;
    state.lastX = event.clientX;
    state.lastTime = event.timeStamp;
    x.set(state.startOffset + dx);
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state.active) return;
    state.active = false;
    if (!state.moved) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
    const width = setWidth.current;
    const fling = Math.max(Math.min(state.velocity * 0.22, width / 3), -width / 3);
    if (Math.abs(fling) > 4) glide(fling, 0.9);
    else normalize();
  };

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Proyectos y soluciones"
      onPointerEnter={(event) => event.pointerType === "mouse" && setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onFocus={() => setFocusWithin(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusWithin(false);
      }}
    >
      <div
        ref={viewportRef}
        className={`relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)] select-none ${
          dragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDragStart={(event) => event.preventDefault()}
      >
        <motion.div className="flex w-max py-2 will-change-transform" style={{ x }}>
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
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line">
                      <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out-expo group-hover/project:scale-[1.04]">
                        <ProjectVisual project={project} />
                      </div>
                      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 rounded-full border border-white/10 bg-ink-950/70 px-3 py-1 font-mono text-[0.68rem] tracking-[0.16em] text-mist uppercase backdrop-blur-sm">
                        {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                      </span>
                    </div>
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
        </motion.div>
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <p className="hidden font-mono text-xs tracking-[0.16em] text-fog uppercase sm:block">
          Arrastra o usa los controles
        </p>
        <div className="flex items-center gap-2 sm:ml-auto">
          <button
            type="button"
            onClick={() => setUserPaused((value) => !value)}
            disabled={reducedMotion === true}
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

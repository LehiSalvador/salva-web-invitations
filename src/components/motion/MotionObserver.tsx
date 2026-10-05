"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

type Point = [number, number];

const num = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return value !== undefined && Number.isFinite(parsed) ? parsed : fallback;
};

/** Ventana de una línea de tiempo: en qué fracción del ciclo aparece y desaparece un elemento. */
function timelineOf(element: HTMLElement) {
  const host = element.closest<HTMLElement>("[data-cycle]");
  if (!host || element.dataset.in === undefined) return null;
  const cycle = num(host.dataset.cycle, 8000);
  const start = Math.min(Math.max(num(element.dataset.in, 0), 0), 0.98);
  const end = Math.min(Math.max(num(element.dataset.out, 0.94), start + 0.02), 1);
  return { cycle, start, end, edge: Math.min(0.05, 420 / cycle, (end - start) / 3) };
}

/**
 * Paquete que recorre una ruta (coordenadas del viewBox). Las posiciones van en píxeles para que
 * el navegador las anime en el compositor; si la figura cambia de tamaño se vuelven a armar.
 * Con data-in/data-out el recorrido ocurre dentro de esa ventana del ciclo de la escena.
 */
function animatePacket(packet: HTMLElement): Animation[] {
  const route: Point[] = (packet.dataset.route ?? "")
    .split(";")
    .map((pair) => pair.split(",").map(Number) as Point)
    .filter((pair) => pair.length === 2 && pair.every(Number.isFinite));
  const layer = packet.parentElement;
  if (route.length < 2 || !layer || !layer.clientWidth) return [];

  const sx = layer.clientWidth / num(packet.dataset.w, 640);
  const sy = layer.clientHeight / num(packet.dataset.h, 400);
  const hold = num(packet.dataset.hold, 0);
  const window = timelineOf(packet);
  const start = window?.start ?? 0;
  const end = window?.end ?? 1;
  const travelEnd = start + (end - start) * (1 - hold);

  const lengths = route.slice(1).map(([x, y], index) => Math.hypot(x - route[index][0], y - route[index][1]));
  const total = lengths.reduce((sum, length) => sum + length, 0) || 1;
  let walked = 0;
  const offsets = [start];
  for (const length of lengths) {
    walked += length;
    offsets.push(start + (walked / total) * (travelEnd - start));
  }

  const at = ([x, y]: Point) => `translate3d(${(x * sx).toFixed(1)}px, ${(y * sy).toFixed(1)}px, 0)`;
  const timing: KeyframeAnimationOptions = window
    ? { duration: window.cycle, iterations: Infinity, easing: "linear" }
    : { duration: num(packet.dataset.dur, 5000), delay: num(packet.dataset.delay, 0), iterations: Infinity, easing: "linear" };

  const motion: Keyframe[] = route.map((point, index) => ({ transform: at(point), offset: offsets[index] }));
  if (start > 0) motion.unshift({ transform: at(route[0]), offset: 0 });
  if (offsets[offsets.length - 1] < 1) motion.push({ transform: at(route[route.length - 1]), offset: 1 });

  const fade = window ? window.edge / 2 : 0.05;
  const visibility: Keyframe[] = [
    { opacity: 0, offset: 0 },
    ...(start > 0 ? [{ opacity: 0, offset: start }] : []),
    { opacity: 1, offset: Math.min(start + fade, end) },
    { opacity: 1, offset: Math.max(end - fade, start + fade) },
    { opacity: 0, offset: end },
    ...(end < 1 ? [{ opacity: 0, offset: 1 }] : []),
  ];

  const animations = [packet.animate(motion, timing), packet.animate(visibility, timing)];

  // Vehículos: giran según el tramo que recorren.
  const body = packet.querySelector<HTMLElement>("[data-heading]");
  if (body) {
    const turns: Keyframe[] = [];
    lengths.forEach((_, index) => {
      const [x1, y1] = route[index];
      const [x2, y2] = route[index + 1];
      const angle = `${Math.round((Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI)}deg`;
      const from = index === 0 ? offsets[0] : Math.min(offsets[index] + 0.012, offsets[index + 1]);
      turns.push({ rotate: angle, offset: from }, { rotate: angle, offset: offsets[index + 1] });
    });
    if (turns[0].offset !== 0) turns.unshift({ rotate: turns[0].rotate, offset: 0 });
    if (turns[turns.length - 1].offset !== 1) turns.push({ rotate: turns[turns.length - 1].rotate, offset: 1 });
    animations.push(body.animate(turns, timing));
  }
  return animations;
}

const ENTER: Record<string, string> = {
  up: "translate3d(0, 12px, 0)",
  down: "translate3d(0, -12px, 0)",
  left: "translate3d(-18px, 0, 0)",
  right: "translate3d(18px, 0, 0)",
  scale: "scale(0.92)",
  pop: "scale(0.55)",
  "grow-x": "scaleX(0)",
  "grow-y": "scaleY(0)",
  fade: "none",
};

/**
 * Paso de una línea de tiempo declarativa: el elemento aparece en data-in y se va en data-out
 * (fracciones del ciclo data-cycle del contenedor). data-fx elige la entrada; data-min deja
 * una opacidad mínima en lugar de ocultarlo (útil para resaltar).
 */
function animateStep(step: HTMLElement): Animation[] {
  const window = timelineOf(step);
  if (!window) return [];
  const { cycle, start, end, edge } = window;
  // La curva va en cada tramo (no en el timing): así las ventanas del ciclo se respetan en tiempo lineal.
  const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
  const hidden = { opacity: num(step.dataset.min, 0), transform: ENTER[step.dataset.fx ?? "up"] ?? ENTER.up, easing: ease };
  const shown = { opacity: 1, transform: "none", easing: ease };
  const frames: Keyframe[] = [
    { ...hidden, offset: 0 },
    ...(start > 0 ? [{ ...hidden, offset: start }] : []),
    { ...shown, offset: start + edge },
    { ...shown, offset: Math.max(end - edge, start + edge) },
    { ...hidden, offset: end },
    ...(end < 1 ? [{ ...hidden, offset: 1 }] : []),
  ];
  return [step.animate(frames, { duration: cycle, iterations: Infinity, easing: "linear" })];
}

/** Texto que se "decodifica" al aparecer (solo etiquetas monoespaciadas cortas). */
function scramble(element: HTMLElement) {
  const final = element.textContent ?? "";
  if (!final.trim() || final.length > 80) return;
  const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_-·";
  const duration = 650;
  const start = performance.now();
  const tick = (now: number) => {
    const progress = Math.min(1, (now - start) / duration);
    const resolved = Math.floor(progress * final.length);
    let out = "";
    for (let index = 0; index < final.length; index++) {
      const char = final[index];
      out += index < resolved || char === " " ? char : glyphs[(index * 7 + Math.floor(now / 40)) % glyphs.length];
    }
    element.textContent = out;
    if (progress < 1) requestAnimationFrame(tick);
    else element.textContent = final;
  };
  requestAnimationFrame(tick);
}

/** Número que cuenta hasta su valor al aparecer. */
function countUp(element: HTMLElement) {
  const final = element.textContent ?? "";
  const target = Number(final);
  if (!Number.isFinite(target)) return;
  const pad = final.length;
  const start = performance.now();
  const tick = (now: number) => {
    const progress = Math.min(1, (now - start) / 900);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.round(target * eased)).padStart(pad, "0");
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/**
 * Observador único del sitio (se vuelve a montar en cada ruta):
 * - [data-reveal]: entradas al hacer scroll; [data-scramble] y [data-count] dentro se animan al revelarse.
 * - [data-live]: escenas con movimiento continuo. Solo corren en pantalla (data-inview); sus pasos
 *   [data-step] y paquetes [data-route] se arman con Web Animations y se pausan fuera de pantalla.
 *   Dentro de un ancestro [data-restart], al volver a pantalla la escena reinicia su ciclo.
 */
export function MotionObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pending = document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])");
    const live = document.querySelectorAll<HTMLElement>("[data-live]");

    const reveal = (element: Element) => {
      element.setAttribute("data-revealed", "");
      if (reduced) return;
      const own = (selector: string) =>
        [element, ...element.querySelectorAll(selector)].filter((node): node is HTMLElement => node instanceof HTMLElement && node.matches(selector));
      own("[data-scramble]").forEach(scramble);
      own("[data-count]").forEach(countUp);
    };

    if (!("IntersectionObserver" in window)) {
      pending.forEach(reveal);
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          revealObserver.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    pending.forEach((element) => revealObserver.observe(element));

    const running = new Map<Element, Animation[]>();
    const widths = new Map<Element, number>();

    // Solo los elementos de este bloque, no los de bloques [data-live] anidados.
    const build = (element: HTMLElement) => {
      const owned = (selector: string) =>
        [...element.querySelectorAll<HTMLElement>(selector)].filter((node) => node.parentElement?.closest("[data-live]") === element);
      return [...owned("[data-route]").flatMap(animatePacket), ...owned("[data-step]").flatMap(animateStep)];
    };

    /*
     * Las escenas pueden mezclar keyframes CSS propios con Web Animations. Si un bloque se oculta con
     * display: none (carrusel, pestañas), el navegador reinicia sus animaciones CSS; al volver a pantalla
     * se alinean con el tiempo de la línea de tiempo del bloque para que la coreografía siga sincronizada.
     */
    const syncCss = (element: HTMLElement, time: CSSNumberish | null) => {
      if (time === null) return;
      for (const animation of element.getAnimations({ subtree: true })) {
        if (!(animation instanceof CSSAnimation)) continue;
        const target = (animation.effect as KeyframeEffect | null)?.target;
        if (!(target instanceof Element)) continue;
        const owner = target === element ? element : target.parentElement?.closest("[data-live]");
        if (owner === element) animation.currentTime = time;
      }
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        const previous = running.get(element);
        const width = Math.round(entry.contentRect.width);
        // Ancho 0 (oculto o en transición): se conservan las animaciones actuales.
        if (!previous || !width || widths.get(element) === width) continue;
        widths.set(element, width);
        const paused = !element.hasAttribute("data-inview");
        // Todas las animaciones de un bloque nacen juntas y se pausan juntas: comparten el mismo tiempo.
        const time = previous.find((animation) => animation.currentTime !== null)?.currentTime ?? 0;
        previous.forEach((animation) => animation.cancel());
        const next = build(element);
        next.forEach((animation) => {
          animation.currentTime = time;
          if (paused) animation.pause();
        });
        running.set(element, next);
      }
    });

    const liveObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          element.setAttribute("data-inview", "");
          if (reduced) continue;
          const animations = running.get(element);
          if (animations) {
            // Dentro de [data-restart] (diapositivas del showcase) la escena vuelve a empezar desde cero.
            if (element.closest("[data-restart]")) animations.forEach((animation) => (animation.currentTime = 0));
            animations.forEach((animation) => animation.play());
            syncCss(element, animations[0]?.currentTime ?? null);
          } else {
            const built = build(element);
            running.set(element, built);
            widths.set(element, Math.round(element.getBoundingClientRect().width));
            resizeObserver.observe(element);
            if (built.length) syncCss(element, 0);
          }
        } else {
          element.removeAttribute("data-inview");
          running.get(element)?.forEach((animation) => animation.pause());
        }
      }
    });
    live.forEach((element) => liveObserver.observe(element));

    return () => {
      revealObserver.disconnect();
      liveObserver.disconnect();
      resizeObserver.disconnect();
      running.forEach((animations) => animations.forEach((animation) => animation.cancel()));
    };
  }, [pathname]);

  return null;
}

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
 * el navegador las anime en el compositor; si la figura cambia de tamaño se actualizan sus keyframes.
 * Con data-in/data-out el recorrido ocurre dentro de esa ventana del ciclo de la escena.
 */
type PacketPlan = { motion: Keyframe[]; visibility: Keyframe[]; turns: Keyframe[] | null; timing: KeyframeAnimationOptions };

function planPacket(packet: HTMLElement): PacketPlan | null {
  const route: Point[] = (packet.dataset.route ?? "")
    .split(";")
    .map((pair) => pair.split(",").map(Number) as Point)
    .filter((pair) => pair.length === 2 && pair.every(Number.isFinite));
  const layer = packet.parentElement;
  if (route.length < 2 || !layer || !layer.clientWidth) return null;

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

  // Vehículos: giran según el tramo que recorren.
  let turns: Keyframe[] | null = null;
  if (packet.querySelector("[data-heading]")) {
    const list: Keyframe[] = [];
    turns = list;
    lengths.forEach((_, index) => {
      const [x1, y1] = route[index];
      const [x2, y2] = route[index + 1];
      const angle = `${Math.round((Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI)}deg`;
      const from = index === 0 ? offsets[0] : Math.min(offsets[index] + 0.012, offsets[index + 1]);
      list.push({ rotate: angle, offset: from }, { rotate: angle, offset: offsets[index + 1] });
    });
    if (list[0].offset !== 0) list.unshift({ rotate: list[0].rotate, offset: 0 });
    if (list[list.length - 1].offset !== 1) list.push({ rotate: list[list.length - 1].rotate, offset: 1 });
  }
  return { motion, visibility, turns, timing };
}

/** Crea las animaciones de un paquete. La primera es siempre el recorrido (la única que depende del tamaño). */
function animatePacket(packet: HTMLElement, plan: PacketPlan): Animation[] {
  const animations = [packet.animate(plan.motion, plan.timing), packet.animate(plan.visibility, plan.timing)];
  const body = packet.querySelector<HTMLElement>("[data-heading]");
  if (body && plan.turns) animations.push(body.animate(plan.turns, plan.timing));
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

    type Block = { animations: Animation[]; packets: Map<HTMLElement, Animation[]> };
    const blocks = new Map<Element, Block>();
    const widths = new Map<Element, number>();

    // Solo los elementos de este bloque, no los de bloques [data-live] anidados.
    const owned = (element: HTMLElement, selector: string) =>
      [...element.querySelectorAll<HTMLElement>(selector)].filter((node) => node.parentElement?.closest("[data-live]") === element);

    const build = (element: HTMLElement): Block => {
      const packets = new Map<HTMLElement, Animation[]>();
      for (const packet of owned(element, "[data-route]")) {
        const plan = planPacket(packet);
        if (plan) packets.set(packet, animatePacket(packet, plan));
      }
      const animations = [...[...packets.values()].flat(), ...owned(element, "[data-step]").flatMap(animateStep)];
      return { animations, packets };
    };

    // Un elemento oculto por el diseño responsive (display: none) no se pinta: su animación no puede ir al
    // compositor y, si siguiera corriendo, forzaría un recálculo de estilos en cada frame. Se pausa.
    const rendered = (animation: Animation) => {
      const target = (animation.effect as KeyframeEffect | null)?.target;
      return target instanceof Element && target.getClientRects().length > 0;
    };

    /** Reloj del bloque: el tiempo de una animación visible (todas nacen y se pausan juntas). */
    const clock = (block: Block) =>
      (block.animations.find((animation) => animation.currentTime !== null && rendered(animation)) ?? block.animations.find((animation) => animation.currentTime !== null))
        ?.currentTime ?? null;

    /** Corre solo lo que se pinta; lo que vuelve a mostrarse se alinea con el reloj del bloque. */
    const run = (block: Block, time: CSSNumberish | null) => {
      for (const animation of block.animations) {
        if (time !== null) animation.currentTime = time;
        if (rendered(animation)) animation.play();
        else animation.pause();
      }
    };

    /*
     * Las escenas pueden mezclar keyframes CSS propios con Web Animations. Si una parte se oculta con
     * display: none (carrusel, pestañas, breakpoints), el navegador reinicia sus animaciones CSS; se alinean
     * con el reloj del bloque al volver a pantalla y después de cada cambio de tamaño.
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

    /*
     * Al cambiar de tamaño no se recrea nada: los Step no dependen del tamaño y los paquetes solo
     * actualizan los keyframes de su recorrido (setKeyframes), así el reloj del bloque no se mueve.
     */
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        const block = blocks.get(element);
        const width = Math.round(entry.contentRect.width);
        if (!block || !width || widths.get(element) === width) continue;
        widths.set(element, width);
        const time = clock(block);
        const paused = !element.hasAttribute("data-inview");
        // Un cambio de breakpoint puede mostrar u ocultar partes de la escena.
        if (!paused) run(block, time);
        for (const packet of owned(element, "[data-route]")) {
          const plan = planPacket(packet);
          if (!plan) continue;
          const existing = block.packets.get(packet);
          if (existing?.length) {
            (existing[0].effect as KeyframeEffect).setKeyframes(plan.motion);
            continue;
          }
          // Paquete que no tenía tamaño al armarse: se crea ahora, alineado con el reloj del bloque.
          const created = animatePacket(packet, plan);
          created.forEach((animation) => {
            if (time !== null) animation.currentTime = time;
            if (paused) animation.pause();
          });
          block.packets.set(packet, created);
          block.animations.push(...created);
        }
        syncCss(element, time);
      }
    });

    const liveObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          element.setAttribute("data-inview", "");
          if (reduced) continue;
          const block = blocks.get(element);
          if (block) {
            // Dentro de [data-restart] (diapositivas del showcase) la escena vuelve a empezar desde cero.
            const time = element.closest("[data-restart]") ? 0 : clock(block);
            run(block, time);
            syncCss(element, time);
          } else {
            const built = build(element);
            blocks.set(element, built);
            widths.set(element, Math.round(element.getBoundingClientRect().width));
            resizeObserver.observe(element);
            if (built.animations.length) {
              run(built, 0);
              syncCss(element, 0);
            }
          }
        } else {
          element.removeAttribute("data-inview");
          blocks.get(element)?.animations.forEach((animation) => animation.pause());
        }
      }
    });
    live.forEach((element) => liveObserver.observe(element));

    return () => {
      revealObserver.disconnect();
      liveObserver.disconnect();
      resizeObserver.disconnect();
      blocks.forEach((block) => block.animations.forEach((animation) => animation.cancel()));
    };
  }, [pathname]);

  return null;
}

"use client";

import { useEffect } from "react";

type Point = [number, number];

/**
 * Arma las animaciones de un paquete a partir de su ruta (coordenadas del viewBox).
 * Las posiciones van en píxeles para que el navegador las anime en el compositor;
 * si la figura cambia de tamaño, MotionObserver las vuelve a armar.
 */
function animatePacket(packet: HTMLElement): Animation[] {
  const route: Point[] = (packet.dataset.route ?? "")
    .split(";")
    .map((pair) => pair.split(",").map(Number) as Point)
    .filter((pair) => pair.length === 2 && pair.every(Number.isFinite));
  if (route.length < 2) return [];

  const width = Number(packet.dataset.w ?? 640);
  const height = Number(packet.dataset.h ?? 400);
  const duration = Number(packet.dataset.dur ?? 5000);
  const delay = Number(packet.dataset.delay ?? 0);
  const hold = Number(packet.dataset.hold ?? 0);

  const lengths = route.slice(1).map(([x, y], index) => Math.hypot(x - route[index][0], y - route[index][1]));
  const total = lengths.reduce((sum, length) => sum + length, 0) || 1;
  const travel = 1 - hold;

  let walked = 0;
  const offsets = [0];
  for (const length of lengths) {
    walked += length;
    offsets.push((walked / total) * travel);
  }

  const layer = packet.parentElement;
  if (!layer || !layer.clientWidth) return [];
  const sx = layer.clientWidth / width;
  const sy = layer.clientHeight / height;
  const at = ([x, y]: Point) => `translate3d(${(x * sx).toFixed(1)}px, ${(y * sy).toFixed(1)}px, 0)`;
  const timing: KeyframeAnimationOptions = { duration, delay, iterations: Infinity, easing: "linear" };

  const motion = route.map((point, index) => ({ transform: at(point), offset: offsets[index] }));
  if (hold > 0) motion.push({ transform: at(route[route.length - 1]), offset: 1 });

  const animations = [
    packet.animate(motion, timing),
    packet.animate(
      [
        { opacity: 0, offset: 0 },
        { opacity: 1, offset: 0.05 },
        { opacity: 1, offset: 0.92 },
        { opacity: 0, offset: 1 },
      ],
      timing,
    ),
  ];

  // Vehículos: giran según el tramo que recorren.
  const body = packet.querySelector<HTMLElement>("[data-heading]");
  if (body) {
    const turns: Keyframe[] = [];
    lengths.forEach((_, index) => {
      const [x1, y1] = route[index];
      const [x2, y2] = route[index + 1];
      const angle = `${Math.round((Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI)}deg`;
      const start = index === 0 ? 0 : Math.min(offsets[index] + 0.015, offsets[index + 1]);
      turns.push({ rotate: angle, offset: start }, { rotate: angle, offset: offsets[index + 1] });
    });
    turns.push({ rotate: turns[turns.length - 1].rotate, offset: 1 });
    animations.push(body.animate(turns, timing));
  }

  return animations;
}

/**
 * Un solo observador para todo el sitio:
 * - [data-reveal]: entradas al hacer scroll (añade data-revealed).
 * - [data-live]: bloques con movimiento continuo. Solo corren en pantalla (data-inview);
 *   sus paquetes [data-route] se animan con Web Animations (transform/opacity).
 */
export function MotionObserver() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pending = document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])");
    const live = document.querySelectorAll<HTMLElement>("[data-live]");

    if (!("IntersectionObserver" in window)) {
      pending.forEach((element) => element.setAttribute("data-revealed", ""));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          revealObserver.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    pending.forEach((element) => revealObserver.observe(element));

    const running = new Map<Element, Animation[]>();
    const widths = new Map<Element, number>();

    // Solo los paquetes de este bloque, no los de bloques [data-live] anidados.
    const build = (element: HTMLElement) =>
      [...element.querySelectorAll<HTMLElement>("[data-route]")]
        .filter((packet) => packet.parentElement?.closest("[data-live]") === element)
        .flatMap(animatePacket);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        const previous = running.get(element);
        const width = Math.round(entry.contentRect.width);
        if (!previous || widths.get(element) === width) continue;
        widths.set(element, width);
        const time = previous[0]?.currentTime ?? 0;
        const paused = !element.hasAttribute("data-inview");
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
          if (animations) animations.forEach((animation) => animation.play());
          else {
            running.set(element, build(element));
            widths.set(element, Math.round(element.getBoundingClientRect().width));
            resizeObserver.observe(element);
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
  }, []);

  return null;
}

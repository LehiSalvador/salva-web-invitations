"use client";

import { useEffect } from "react";

/**
 * Motor de interacción del sitio: un solo listener delegado de puntero.
 * - Lente ambiental: sigue al puntero con interpolación (solo corre mientras se mueve).
 * - .parallax: escenas 3D que giran levemente según la posición del puntero en la ventana.
 * - [data-spotlight]: actualiza --sx/--sy para la luz y el borde bajo el puntero.
 * - [data-magnetic]: el elemento se desplaza levemente hacia el puntero.
 * - [data-tilt]: inclinación 3D según la posición del puntero.
 */
export function InteractionEngine() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches) return;

    const ambient = document.getElementById("ambient");
    const lens = ambient?.querySelector<HTMLElement>(".ambient__lens");
    const lensGrid = ambient?.querySelector<HTMLElement>(".ambient__lens-grid");
    const radius = 260;
    const parallax = document.getElementsByClassName("parallax") as HTMLCollectionOf<HTMLElement>;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 3 };
    const current = { ...target };
    let lensFrame = 0;

    const stepLens = () => {
      current.x += (target.x - current.x) * 0.14;
      current.y += (target.y - current.y) * 0.14;
      const x = current.x - radius;
      const y = current.y - radius;
      if (lens && lensGrid) {
        lens.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        lensGrid.style.transform = `translate3d(${(-x).toFixed(1)}px, ${(-y).toFixed(1)}px, 0)`;
      }
      const nx = current.x / window.innerWidth - 0.5;
      const ny = current.y / window.innerHeight - 0.5;
      for (const element of parallax) {
        element.style.transform = `rotateX(${(-ny * 7).toFixed(2)}deg) rotateY(${(nx * 9).toFixed(2)}deg)`;
      }
      lensFrame = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.4 ? requestAnimationFrame(stepLens) : 0;
    };

    // Una superficie con luz y, por separado, el elemento que se mueve (magnético o inclinable).
    let spot: HTMLElement | null = null;
    let mover: HTMLElement | null = null;
    let pending: PointerEvent | null = null;
    let frame = 0;

    const releaseSpot = (element: HTMLElement) => element.removeAttribute("data-hot");
    const releaseMover = (element: HTMLElement) => {
      element.removeAttribute("data-hot");
      element.style.transform = "";
    };

    const apply = () => {
      frame = 0;
      const event = pending;
      if (!event) return;
      const target = event.target as Element | null;
      const nextSpot = target?.closest?.<HTMLElement>("[data-spotlight]") ?? null;
      const nextMover = target?.closest?.<HTMLElement>("[data-magnetic],[data-tilt]") ?? null;
      if (spot && spot !== nextSpot) releaseSpot(spot);
      if (mover && mover !== nextMover) releaseMover(mover);
      spot = nextSpot;
      mover = nextMover;

      if (spot) {
        const rect = spot.getBoundingClientRect();
        spot.setAttribute("data-hot", "");
        spot.style.setProperty("--sx", `${(event.clientX - rect.left).toFixed(0)}px`);
        spot.style.setProperty("--sy", `${(event.clientY - rect.top).toFixed(0)}px`);
      }
      if (!mover || reduced.matches) return;
      const rect = mover.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      mover.setAttribute("data-hot", "");
      if (mover.hasAttribute("data-magnetic")) {
        const strength = Number(mover.dataset.magnetic || 10);
        mover.style.transform = `translate3d(${(nx * strength).toFixed(2)}px, ${(ny * strength).toFixed(2)}px, 0)`;
      } else {
        const strength = Number(mover.dataset.tilt || 6);
        mover.style.transform = `perspective(1100px) rotateX(${(-ny * strength).toFixed(2)}deg) rotateY(${(nx * strength).toFixed(2)}deg)`;
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      ambient?.setAttribute("data-pointer", "");
      target.x = event.clientX;
      target.y = event.clientY;
      if (!lensFrame && !reduced.matches) lensFrame = requestAnimationFrame(stepLens);
      pending = event;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onLeave = () => {
      ambient?.removeAttribute("data-pointer");
      if (spot) releaseSpot(spot);
      if (mover) releaseMover(mover);
      spot = null;
      mover = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(lensFrame);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return null;
}

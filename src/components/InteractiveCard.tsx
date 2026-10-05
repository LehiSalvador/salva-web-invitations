"use client";

import { useRef } from "react";

type InteractiveCardProps = React.HTMLAttributes<HTMLDivElement> & {
  tilt?: boolean;
};

const MAX_TILT_DEG = 4;

/** Inclinación y halo que siguen al puntero; solo actualiza transforms (sin repintar) y respeta reduced motion. */
export function InteractiveCard({ tilt = true, className = "", style, children, ...rest }: InteractiveCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRef<DOMRect | null>(null);
  const frame = useRef(0);
  const allowTilt = useRef(false);

  const onPointerEnter = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !ref.current) return;
    rect.current = ref.current.getBoundingClientRect();
    allowTilt.current = tilt && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    const box = rect.current;
    if (!el || !box || event.pointerType !== "mouse") return;
    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const x = clientX - box.left;
      const y = clientY - box.top;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      if (allowTilt.current) {
        el.style.setProperty("--rx", `${(0.5 - y / box.height) * MAX_TILT_DEG}deg`);
        el.style.setProperty("--ry", `${(x / box.width - 0.5) * MAX_TILT_DEG}deg`);
      }
    });
  };

  const onPointerLeave = () => {
    cancelAnimationFrame(frame.current);
    rect.current = null;
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={ref}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{
        transform: "perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
        ...style,
      }}
      className={`group/card relative transition-transform duration-500 ease-out-expo ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

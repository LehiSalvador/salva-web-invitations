"use client";

import { useRef } from "react";

type InteractiveCardProps = React.HTMLAttributes<HTMLDivElement> & {
  tilt?: boolean;
};

const MAX_TILT_DEG = 4;

export function InteractiveCard({ tilt = true, className = "", style, children, ...rest }: InteractiveCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || event.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    el.style.setProperty("--cx", `${x * 100}%`);
    el.style.setProperty("--cy", `${y * 100}%`);
    if (tilt && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--rx", `${(0.5 - y) * MAX_TILT_DEG}deg`);
      el.style.setProperty("--ry", `${(x - 0.5) * MAX_TILT_DEG}deg`);
    }
  };

  const onPointerLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{
        transform: "perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
        ...style,
      }}
      className={`group/card relative transition-transform duration-500 ease-out-expo will-change-transform ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

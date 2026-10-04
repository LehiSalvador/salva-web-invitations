"use client";

import { useRef } from "react";

type PointerSurfaceProps = React.HTMLAttributes<HTMLElement> & {
  as?: "section" | "div";
};

export function PointerSurface({ as: Tag = "div", children, ...rest }: PointerSurfaceProps) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef(0);

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${clientX - rect.left}px`);
      el.style.setProperty("--my", `${clientY - rect.top}px`);
      el.style.setProperty("--px", `${((clientX - rect.left) / rect.width - 0.5).toFixed(3)}`);
      el.style.setProperty("--py", `${((clientY - rect.top) / rect.height - 0.5).toFixed(3)}`);
      el.dataset.pointer = "active";
    });
  };

  const onPointerLeave = () => {
    cancelAnimationFrame(frame.current);
    const el = ref.current;
    if (!el) return;
    el.dataset.pointer = "idle";
    el.style.setProperty("--px", "0");
    el.style.setProperty("--py", "0");
  };

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      {...rest}
    >
      {children}
    </Tag>
  );
}

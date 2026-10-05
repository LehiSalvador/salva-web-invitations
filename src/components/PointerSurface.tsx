"use client";

import { useEffect, useRef } from "react";

type PointerSurfaceProps = React.HTMLAttributes<HTMLElement> & {
  as?: "section" | "div";
};

/** Expone la posición del puntero como variables CSS (--mx, --my, --px, --py) sin re-renderizar. */
export function PointerSurface({ as: Tag = "div", children, ...rest }: PointerSurfaceProps) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef(0);
  const rect = useRef<DOMRect | null>(null);

  useEffect(() => {
    const invalidate = () => {
      rect.current = null;
    };
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate);
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
    };
  }, []);

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || event.pointerType !== "mouse") return;
    const { clientX, clientY } = event;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const box = (rect.current ??= el.getBoundingClientRect());
      const x = clientX - box.left;
      const y = clientY - box.top;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      el.style.setProperty("--px", (x / box.width - 0.5).toFixed(3));
      el.style.setProperty("--py", (y / box.height - 0.5).toFixed(3));
      if (el.dataset.pointer !== "active") el.dataset.pointer = "active";
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

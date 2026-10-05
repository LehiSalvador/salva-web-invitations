"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Cada página nueva empieza arriba. Con las transiciones de vista, el scroll automático del router puede
 * quedar a media página (sobre todo al llegar desde una sección baja de la home), así que se fija aquí.
 * Respeta los enlaces con ancla (/#nosotros) y el botón atrás/adelante, que restauran su propia posición.
 */
export function ScrollReset() {
  const pathname = usePathname();
  const first = useRef(true);
  const popped = useRef(false);

  useEffect(() => {
    const onPop = () => {
      popped.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (popped.current) {
      popped.current = false;
      return;
    }
    if (window.location.hash) return;
    const top = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    top();
    // El router puede volver a desplazar la página en el siguiente frame: se reafirma una vez.
    const frame = requestAnimationFrame(top);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}

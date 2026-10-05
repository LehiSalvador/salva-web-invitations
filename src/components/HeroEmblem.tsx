import type { CSSProperties } from "react";
import { SALVA_LOGO_NODES, SALVA_LOGO_VIEWBOX, SalvaLogo } from "@/components/brand/SalvaLogo";

const { x: VB_X, y: VB_Y, width: VB_WIDTH, height: VB_HEIGHT } = SALVA_LOGO_VIEWBOX;
/** Ancho del logo dentro del emblema, en porcentaje; la altura respeta la proporción original. */
const LOGO_WIDTH = 56;
const LOGO_HEIGHT = (LOGO_WIDTH * VB_HEIGHT) / VB_WIDTH;

function nodePosition(cx: number, cy: number): CSSProperties {
  return {
    left: `${(100 - LOGO_WIDTH) / 2 + ((cx - VB_X) / VB_WIDTH) * LOGO_WIDTH}%`,
    top: `${(100 - LOGO_HEIGHT) / 2 + ((cy - VB_Y) / VB_HEIGHT) * LOGO_HEIGHT}%`,
  };
}

export function HeroEmblem() {
  return (
    <div aria-hidden="true" className="hero-emblem-intro relative aspect-square w-full">
      <div className="parallax-soft absolute inset-0">
        <div className="absolute inset-0 rounded-full border border-white/[0.05]" />
        <div className="absolute inset-[11%] rounded-full border border-dashed border-gold-500/20" />
        <div className="absolute inset-[21%] rounded-full border border-white/[0.06]" />
        <div className="absolute inset-[14%] animate-breathe rounded-full bg-[radial-gradient(closest-side,rgb(200_173_118/0.16),rgb(195_119_128/0.05)_62%,transparent)] will-change-transform" />
        {SALVA_LOGO_NODES.map(({ cx, cy }, index) => (
          <span
            key={`${cx}-${cy}`}
            className="absolute size-[15%] -translate-x-1/2 -translate-y-1/2"
            style={nodePosition(cx, cy)}
          >
            <span
              className="block size-full animate-pulse-soft rounded-full bg-[radial-gradient(closest-side,rgb(195_119_128/0.3),transparent)] will-change-[opacity]"
              style={{ animationDelay: `${index * -1.1}s` }}
            />
          </span>
        ))}
        <SalvaLogo
          intro="hero"
          className="absolute top-1/2 left-1/2 h-auto -translate-x-1/2 -translate-y-1/2"
          style={{ width: `${LOGO_WIDTH}%` }}
        />
      </div>
    </div>
  );
}

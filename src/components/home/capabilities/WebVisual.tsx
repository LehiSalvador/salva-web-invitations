import { cubic, Packet, PacketLayer } from "@/components/motion/Packet";
import { Step } from "@/components/motion/Step";
import styles from "./CapabilityVisuals.module.css";
import { Check, MICRO, PANEL, pos, Scene } from "./kit";

/*
 * Desarrollo web: un navegador ensambla el sitio (retícula → secciones → contenido), un visitante
 * hace clic en el CTA y la misma página se reacomoda en la vista móvil.
 */

const CTA = { x: 20, y: 53 };

const BAR = "absolute rounded-[1.5px] origin-left";

function Browser() {
  return (
    <div className={`${PANEL} relative flex min-w-0 flex-1 flex-col overflow-hidden`}>
      <div className="flex h-[22px] shrink-0 items-center gap-2 border-b border-line px-2 @lg:h-[26px] @lg:px-2.5">
        <span className="flex gap-[3px]">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="size-[5px] rounded-full bg-fog/45" />
          ))}
        </span>
        <span className="flex h-[14px] min-w-0 flex-1 items-center gap-1.5 rounded-[2px] bg-ink-800 px-1.5 font-mono text-[10px] leading-none text-mist @lg:h-[16px] @lg:max-w-[200px]">
          <svg viewBox="0 0 10 10" className="size-[8px] shrink-0 text-signal" fill="none" aria-hidden="true">
            <rect x="1.5" y="4.5" width="7" height="5" rx="1" fill="currentColor" />
            <path d="M3 4.5V3a2 2 0 0 1 4 0v1.5" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          /inicio
        </span>
        <span className={`${MICRO} hidden text-fog @2xl:block`}>escritorio</span>
      </div>

      <div className="relative flex-1">
        {/* 01 Estructura: retícula, navegación y huecos de cada sección. */}
        <Step at={[0.02, 0.3]} fx="fade" rm="hide" className={`${styles.columns} absolute inset-y-[4%] left-[4%] right-[4%]`} />
        <Step at={[0.05, 0.94]} fx="grow-x" className="absolute top-[4%] right-[4%] left-[4%] flex h-[11%] origin-left items-center justify-between border-b border-line">
          <span className="flex items-center gap-1.5">
            <span className="size-[7px] rotate-45 border border-signal" />
            <span className="h-[4px] w-[34px] rounded-[1px] bg-bone/70" />
          </span>
          <span className="flex items-center gap-[7%]">
            <span className="hidden h-[3px] w-[16px] rounded-[1px] bg-mist/50 @lg:block" />
            <span className="h-[3px] w-[16px] rounded-[1px] bg-mist/50" />
            <span className="h-[3px] w-[16px] rounded-[1px] bg-mist/50" />
            <span className="h-[9px] w-[26px] rounded-[2px] border border-gold-400/70" />
          </span>
        </Step>
        <Step at={[0.08, 0.94]} fx="fade" className="absolute rounded-[2px] border border-dashed border-line-strong" style={{ ...pos(4, 21), width: "46%", height: "42%" }} />
        <Step at={[0.11, 0.94]} fx="fade" className="absolute rounded-[2px] border border-dashed border-line-strong" style={{ ...pos(54, 21), width: "42%", height: "42%" }} />
        <Step at={[0.14, 0.94]} fx="fade" className="absolute rounded-[2px] border border-dashed border-line-strong" style={{ ...pos(4, 68), width: "92%", height: "27%" }} />

        {/* 02 Contenido. */}
        <Step at={[0.2, 0.94]} fx="grow-x" className={`${BAR} h-[7px] bg-bone/85 @lg:h-[9px]`} style={{ ...pos(7, 27), width: "36%" }} />
        <Step at={[0.23, 0.94]} fx="grow-x" className={`${BAR} h-[7px] bg-bone/85 @lg:h-[9px]`} style={{ ...pos(7, 34.5), width: "25%" }} />
        <Step at={[0.26, 0.94]} fx="grow-x" className={`${BAR} h-[3px] bg-mist/45`} style={{ ...pos(7, 43), width: "34%" }} />
        <Step at={[0.22, 0.94]} fx="scale" className="absolute overflow-hidden rounded-[2px] border border-line bg-linear-to-br from-signal/20 via-cool/10 to-gold-400/15" style={{ ...pos(55.5, 24), width: "39%", height: "36%" }}>
          <svg viewBox="0 0 100 60" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 size-full" aria-hidden="true">
            <circle cx="72" cy="20" r="7" className="fill-gold-300/70" />
            <path d="M0 60 30 28l16 15 14-11 40 28Z" className="fill-signal/25 stroke-signal/60" strokeWidth="0.8" />
          </svg>
        </Step>
        <Step
          at={[0.29, 0.94]}
          fx="pop"
          className="absolute flex h-[16px] w-[26%] -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1 rounded-[2px] bg-signal font-mono text-[10px] leading-none font-medium text-ink-950 @lg:h-[22px] @lg:text-[11px]"
          style={pos(CTA.x, CTA.y)}
        >
          Cotizar<span className="hidden @2xl:inline"> proyecto →</span>
        </Step>
        <div className="absolute grid grid-cols-3 gap-[3%] p-[1.2%]" style={{ ...pos(4, 68), width: "92%", height: "27%" }}>
          {[0.32, 0.35, 0.38].map((at, index) => (
            <Step key={at} at={[at, 0.94]} fx="up" className="flex flex-col justify-center gap-[5px] rounded-[2px] border border-line bg-ink-850 px-[7%]">
              <span className={`size-[7px] rounded-[1.5px] ${index === 1 ? "bg-gold-300/80" : "bg-signal/70"}`} />
              <span className="h-[3px] w-[78%] rounded-[1px] bg-bone/60" />
              <span className="hidden h-[3px] w-[52%] rounded-[1px] bg-mist/35 @lg:block" />
            </Step>
          ))}
        </div>

        {/* 03 Interacción: el visitante hace clic en el CTA. */}
        <PacketLayer>
          <Packet
            className={styles.cursor}
            size={[100, 100]}
            tone="bone"
            route={cubic([70, 96], [58, 80], [34, 74], [CTA.x + 1.5, CTA.y + 1.5], 14)}
            at={[0.4, 0.61]}
            hold={0.42}
          />
        </PacketLayer>
        <Step
          at={[0.515, 0.6]}
          fx="pop"
          rm="hide"
          className="absolute size-[30px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal @lg:size-[40px]"
          style={pos(CTA.x, CTA.y)}
        />
        <Step
          at={[0.515, 0.57]}
          fx="fade"
          rm="hide"
          className="absolute flex h-[16px] w-[26%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2px] bg-bone text-ink-950 @lg:h-[22px]"
          style={pos(CTA.x, CTA.y)}
        >
          <Check />
        </Step>
        <Step at={[0.54, 0.94]} fx="left" className={`${PANEL} absolute top-[25%] right-[3%] flex items-center gap-1.5 px-1.5 py-1 text-signal shadow-[0_6px_18px_-8px_rgb(0_0_0/0.8)] @lg:px-2 @lg:py-1.5`}>
          <Check />
          <span className={`${MICRO} text-bone`}>
            <span className="@lg:hidden">enviada</span>
            <span className="hidden @lg:inline">solicitud enviada</span>
          </span>
        </Step>
      </div>
    </div>
  );
}

function Phone() {
  return (
    <div className="relative aspect-[1/2] h-full shrink-0">
      <div className="absolute inset-0 rounded-[12px] border border-dashed border-line-strong" />
      <span className={`${MICRO} absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-fog`}>móvil</span>

      {/* 04 Responsive: la misma página, reacomodada en una columna. */}
      <Step at={[0.62, 0.94]} fx="scale" className="absolute inset-0 flex flex-col gap-[4%] overflow-hidden rounded-[12px] border border-line-strong bg-ink-900 px-[9%] pt-[5%] pb-[7%]">
        <span className="mx-auto h-[3px] w-[32%] shrink-0 rounded-full bg-line-strong" />
        <Step at={[0.65, 0.94]} fx="up" className="flex flex-col gap-[6px]">
          <span className="flex items-center justify-between border-b border-line pb-[5px]">
            <span className="size-[6px] rotate-45 border border-signal" />
            <span className="flex flex-col gap-[2px]">
              <span className="h-px w-[9px] bg-mist" />
              <span className="h-px w-[9px] bg-mist" />
              <span className="h-px w-[9px] bg-mist" />
            </span>
          </span>
          <span className="h-[5px] w-[88%] rounded-[1px] bg-bone/85 @lg:h-[7px]" />
          <span className="h-[5px] w-[60%] rounded-[1px] bg-bone/85 @lg:h-[7px]" />
          <span className="h-[30px] rounded-[2px] border border-line bg-linear-to-br from-signal/20 via-cool/10 to-gold-400/15 @lg:h-[46px]" />
        </Step>
        <Step at={[0.69, 0.94]} fx="pop" className="flex h-[13px] shrink-0 items-center justify-center rounded-[2px] bg-signal font-mono text-[10px] leading-none text-ink-950 @lg:h-[18px]">
          Cotizar
        </Step>
        <Step at={[0.73, 0.94]} fx="up" className="flex flex-1 flex-col gap-[5px]">
          {[0, 1].map((card) => (
            <span key={card} className="flex flex-1 items-center gap-[5px] rounded-[2px] border border-line bg-ink-850 px-[8%]">
              <span className={`size-[6px] shrink-0 rounded-[1px] ${card ? "bg-gold-300/80" : "bg-signal/70"}`} />
              <span className="h-[3px] flex-1 rounded-[1px] bg-bone/55" />
            </span>
          ))}
        </Step>
      </Step>
      <Step at={[0.78, 0.94]} fx="up" className={`${MICRO} absolute -top-px left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 border border-signal/50 bg-ink-900 px-1.5 py-1 whitespace-nowrap text-signal @lg:flex`}>
        <Check /> adaptado
      </Step>
    </div>
  );
}

export function WebVisual() {
  return (
    <Scene
      cycle={11000}
      phases={[
        { label: "estructura", at: [0, 0.19] },
        { label: "contenido", at: [0.19, 0.4] },
        { label: "interacción", at: [0.4, 0.61] },
        { label: "responsive", at: [0.61, 0.94] },
      ]}
    >
      <div className="flex h-full gap-2.5 @lg:gap-5">
        <Browser />
        <Phone />
      </div>
    </Scene>
  );
}

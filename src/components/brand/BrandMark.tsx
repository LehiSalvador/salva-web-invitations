import { SalvaLogo } from "@/components/brand/SalvaLogo";

type BrandMarkProps = {
  className?: string;
  animated?: boolean;
};

export function BrandMark({ className = "", animated = false }: BrandMarkProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <SalvaLogo intro={animated ? "compact" : "none"} className="size-9 shrink-0" />
      <span
        className={`text-[0.8rem] font-semibold tracking-[0.28em] whitespace-nowrap text-bone uppercase ${
          animated ? "brand-wordmark-intro" : ""
        }`}
      >
        Salva <span className="text-gold-400">Systems</span>
      </span>
    </span>
  );
}

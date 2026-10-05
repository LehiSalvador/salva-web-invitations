import { SalvaLogo } from "@/components/brand/SalvaLogo";

type BrandMarkProps = {
  className?: string;
  animated?: boolean;
  tone?: "light" | "dark";
};

export function BrandMark({ className = "", animated = false, tone = "light" }: BrandMarkProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <SalvaLogo tone={tone} intro={animated ? "compact" : "none"} className="size-8 shrink-0" />
      <span className="font-display text-[1.45rem] leading-none tracking-[-0.01em] whitespace-nowrap">
        Salva Systems
      </span>
    </span>
  );
}

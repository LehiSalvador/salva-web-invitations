import { Reveal } from "@/components/Reveal";
import { sections, type SectionId } from "@/data/site";

type SectionHeadingProps = {
  section: SectionId;
  title: React.ReactNode;
  /** Texto breve a la derecha de la regla superior. */
  aside?: string;
  className?: string;
};

/** Cabecera editorial: regla con número de sección y titular en serif. */
export function SectionHeading({ section, title, aside, className = "" }: SectionHeadingProps) {
  const { number, label } = sections.find((item) => item.id === section)!;
  return (
    <header className={className}>
      <Reveal variant="rule" className="h-px bg-current opacity-25" />
      <div className="label mt-3 flex items-baseline justify-between gap-6 opacity-70">
        <span>
          {number} — {label}
        </span>
        {aside && <span className="hidden text-right sm:block">{aside}</span>}
      </div>
      <Reveal variant="clip" delay={120}>
        <h2
          id={`${section}-title`}
          className="mt-8 max-w-[16ch] font-display text-[clamp(2.6rem,7vw,5.6rem)] leading-[0.95] tracking-[-0.015em] text-balance"
        >
          {title}
        </h2>
      </Reveal>
    </header>
  );
}

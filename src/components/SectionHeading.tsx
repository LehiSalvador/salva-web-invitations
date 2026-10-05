import { Reveal } from "@/components/Reveal";
import { sections, type SectionId } from "@/data/site";

type SectionHeadingProps = {
  section: SectionId;
  title: React.ReactNode;
  /** Texto de apoyo bajo el titular. */
  intro?: React.ReactNode;
  className?: string;
};

/** Cabecera de sección: índice técnico, titular y texto de apoyo. */
export function SectionHeading({ section, title, intro, className = "" }: SectionHeadingProps) {
  const { number, label } = sections.find((item) => item.id === section)!;
  return (
    <Reveal as="header" className={`grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8 ${className}`}>
      <div className="lg:col-span-7">
        <p className="label flex items-center gap-3 text-mist">
          <span className="font-mono text-gold-400">[{number}]</span>
          {label}
          <span aria-hidden="true" className="h-px w-10 bg-line-strong" />
        </p>
        <h2 id={`${section}-title`} className="display mt-5 max-w-[20ch] text-[clamp(2rem,5.2vw,3.5rem)] leading-[1.04] text-balance text-bone">
          {title}
        </h2>
      </div>
      {intro && (
        <div className="max-w-xl text-[1.05rem] leading-relaxed text-pretty text-mist lg:col-span-5">{intro}</div>
      )}
    </Reveal>
  );
}

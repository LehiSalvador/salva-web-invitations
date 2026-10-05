import { Reveal } from "@/components/motion/Reveal";
import { sections, type SectionId } from "@/data/site";

type SectionHeadingProps = {
  section: SectionId;
  title: React.ReactNode;
  /** Texto de apoyo junto al titular. */
  intro?: React.ReactNode;
  className?: string;
};

/** Cabecera de sección: índice técnico que se decodifica, titular con máscara y texto de apoyo. */
export function SectionHeading({ section, title, intro, className = "" }: SectionHeadingProps) {
  const { number, label } = sections.find((item) => item.id === section)!;
  return (
    <header className={`grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-12 lg:items-end lg:gap-8 ${className}`}>
      <div className="lg:col-span-7">
        <Reveal as="p" className="label flex items-center gap-3 text-mist">
          <span className="font-mono text-signal">[{number}]</span>
          <span data-scramble>{label}</span>
          <span aria-hidden="true" className="h-px w-10 bg-line-strong" />
        </Reveal>
        <Reveal variant="mask" delay={80}>
          <h2 id={`${section}-title`} className="display mt-5 max-w-[20ch] text-[clamp(2rem,5.2vw,3.5rem)] leading-[1.04] text-balance text-bone">
            {title}
          </h2>
        </Reveal>
      </div>
      {intro && (
        <Reveal delay={180} className="max-w-xl text-[1.05rem] leading-relaxed text-pretty text-mist lg:col-span-5">
          {intro}
        </Reveal>
      )}
    </header>
  );
}

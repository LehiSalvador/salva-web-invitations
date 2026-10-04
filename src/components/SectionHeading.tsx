import { Reveal } from "@/components/Reveal";

type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  id?: string;
  align?: "left" | "center";
};

export function SectionHeading({ index, eyebrow, title, description, id, align = "left" }: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <Reveal className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p
        className={`flex items-center gap-3 font-mono text-xs tracking-[0.22em] text-gold-400 uppercase ${
          centered ? "justify-center" : ""
        }`}
      >
        <span className="text-fog">{index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-gold-500/50" />
        {eyebrow}
      </p>
      <h2 id={id} className="mt-5 text-3xl leading-[1.08] font-semibold tracking-tight text-balance text-bone sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-pretty text-mist sm:text-lg">{description}</p>
      )}
    </Reveal>
  );
}

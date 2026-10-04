type BrandMarkProps = {
  className?: string;
  withWordmark?: boolean;
};

export function BrandSymbol({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="7.25" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.5" />
      <path
        d="M23 9H10.5V16H21.5V23H9"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <circle cx="23" cy="9" r="1.9" fill="currentColor" />
      <circle cx="9" cy="23" r="1.9" fill="currentColor" />
    </svg>
  );
}

export function BrandMark({ className = "", withWordmark = true }: BrandMarkProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <BrandSymbol className="size-8 shrink-0 text-gold-400" />
      {withWordmark && (
        <span className="whitespace-nowrap text-[0.8rem] font-semibold tracking-[0.28em] text-bone uppercase">
          Salva <span className="text-gold-400">Systems</span>
        </span>
      )}
    </span>
  );
}

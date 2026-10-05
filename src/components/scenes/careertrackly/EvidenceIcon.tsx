export type Evidence = "doc" | "img" | "repo";

/** Orden fijo de los tipos de evidencia: bandeja, ranuras de cada tarjeta y miniaturas del portfolio. */
export const EVIDENCE: Evidence[] = ["doc", "img", "repo"];

/** Glifo de evidencia (documento, imagen o repositorio de código). Hereda el color del texto. */
export function EvidenceIcon({ kind, className = "" }: { kind: Evidence; className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {kind === "doc" && (
        <>
          <path d="M5 2.5h6.5L15 6v11.5H5z" />
          <path d="M11.5 2.5V6H15M7.5 10.5h5M7.5 13.5h3.5" />
        </>
      )}
      {kind === "img" && (
        <>
          <rect x="2.5" y="4" width="15" height="12" rx="1.5" />
          <path d="M4.5 14l3.8-4 2.7 2.6 1.8-1.7 2.7 3.1" />
          <circle cx="13" cy="7.6" r="1.2" />
        </>
      )}
      {kind === "repo" && <path d="M7 6l-4 4 4 4M13 6l4 4-4 4M11.2 4.5l-2.4 11" />}
    </svg>
  );
}

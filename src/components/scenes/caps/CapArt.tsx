import type { CSSProperties } from "react";
import styles from "../CapsScene.module.css";

/**
 * Gorra ilustrada en vista tres cuartos (mirando a la izquierda). El color llega por --cap y las sombras
 * se derivan con color-mix, así que el mismo dibujo sirve para todo el catálogo.
 */
export function CapArt({ color, className = "", emblem = true }: { color: string; className?: string; emblem?: boolean }) {
  return (
    <svg viewBox="0 0 120 80" className={`${styles.art} ${className}`} style={{ "--cap": color } as CSSProperties} aria-hidden="true">
      {/* sombra en el piso */}
      <ellipse cx="58" cy="73" rx="46" ry="4.2" className={styles.artFloor} />
      {/* visera: cara inferior y superior */}
      <path d="M48 62.5C34 61 15 62.5 5.5 68.2C13 74.4 37 74.6 60 66.4Z" className={styles.artUnder} />
      <path d="M44 56.4C30 55.6 13.5 58.6 5.5 66.6C15 71.6 39 70.4 60 63.8C55 60.6 50 58 44 56.4Z" className={styles.artBrim} />
      <path d="M12 65.2C22 61.6 36 60.4 50 61" className={styles.artStitch} />
      {/* corona */}
      <path d="M36.5 61.5C33 41 45 16.5 67 16C90.5 15.6 105.5 33 105 58.5C90 64.5 57 66.5 36.5 61.5Z" className={styles.artCrown} />
      <path d="M67 16C90.5 15.6 105.5 33 105 58.5C99 60.6 93 61.8 86.5 62.6C88 44 81 25 67 16Z" className={styles.artShade} />
      <path d="M45 30C50 22 57 18.2 64 17.4" className={styles.artGloss} />
      {/* costuras */}
      <path d="M67 16C56 25 50 40 51.5 63.6M67 16C80 28 86.5 44 86.5 62.6" className={styles.artSeam} />
      <path d="M38.5 57.6C58 61.6 86 61 103.6 55" className={styles.artStitch} />
      {/* botón y ojillo */}
      <ellipse cx="67" cy="16.2" rx="4.6" ry="1.9" className={styles.artButton} />
      <circle cx="94" cy="32" r="1.25" className={styles.artEyelet} />
      {emblem && <path d="M60.5 35.5L65 31L69.5 35.5L65 40Z" className={styles.artEmblem} />}
    </svg>
  );
}

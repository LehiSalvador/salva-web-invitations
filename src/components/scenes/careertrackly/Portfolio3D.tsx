import type { CSSProperties } from "react";
import { Step } from "@/components/motion/Step";
import { EVIDENCE, EvidenceIcon } from "@/components/scenes/careertrackly/EvidenceIcon";
import s from "@/components/scenes/CareertracklyScene.module.css";

/*
 * Portfolio en 3D (CSS: perspective + preserve-3d). La tarjeta se arma por capas separadas en Z
 * (placa, trayectoria, cabecera, proyectos y sello); el grupo se comprime al ensamblarse y, en la
 * escena principal, baja a su lugar en la cuadrícula "Descubrir". Cada capa aparece con un Step;
 * su altura va en la propiedad `translate`, así el transform del Step no la pisa.
 */

export type PortfolioTimes = {
  /** Sin valor, la placa es fija (marco vacío esperando datos). */
  plate?: number;
  header: number;
  sections: number;
  thumbs: number;
  /** Sello dentro del plano de la tarjeta (solo escena principal). */
  stamp?: number;
  /** Perfiles de la cuadrícula Descubrir (solo escena principal). */
  floor?: number;
};

const z = (value: number) => ({ "--z": value }) as CSSProperties;

function Plate() {
  return (
    <>
      <span className={s.plateGuide} style={{ "--gy": 12, "--gh": 40 } as CSSProperties} />
      <span className={s.plateGuide} style={{ "--gy": 62, "--gh": 42 } as CSSProperties} />
      <span className={s.plateGuide} style={{ "--gy": 114, "--gh": 36 } as CSSProperties} />
      <span className={s.plateLabel}>Portfolio</span>
    </>
  );
}

export function Portfolio3D({ times, end, preview = false, style }: { times: PortfolioTimes; end: number; preview?: boolean; style?: CSSProperties }) {
  return (
    <div className={`${s.at} ${s.stage3d}`} style={style}>
      <div className={`${s.rig} ${preview ? s.rigPreview : ""}`}>
        {times.floor !== undefined && (
          <>
            <div className={s.floor}>
              {Array.from({ length: 9 }, (_, index) => (
                <span key={index} className={index === 4 ? s.floorSlot : s.floorTile} />
              ))}
            </div>
            <Step at={[times.floor, end]} fx="fade" className={s.floor}>
              {Array.from({ length: 9 }, (_, index) =>
                index === 4 ? (
                  <span key={index} />
                ) : (
                  <span key={index} className={s.profile}>
                    <i className={s.profileAvatar} />
                    <i className={s.profileBar} />
                    <i className={s.profileBar} />
                    <i className={s.profileMark} />
                  </span>
                ),
              )}
            </Step>
          </>
        )}
        <div className={s.shadow3d} />

        <div className={`${s.cardGroup} ${preview ? s.cardGroupPreview : s.cardGroupScene}`}>
          {times.plate === undefined ? (
            <div className={`${s.layer} ${s.plate} ${s.plateIdle}`} style={z(0)}>
              <Plate />
            </div>
          ) : (
            <Step at={[times.plate, end]} fx="scale" className={`${s.layer} ${s.plate}`} style={z(0)}>
              <Plate />
            </Step>
          )}

          <Step at={[times.sections, end]} fx="scale" className={`${s.layer} ${s.lSections}`} style={z(24)}>
            <i className={s.miniTrack} />
            {[0, 1, 2].map((index) => (
              <i key={index} className={s.miniStage} style={{ "--i": index } as CSSProperties} />
            ))}
          </Step>

          <Step at={[times.header, end]} fx="scale" className={`${s.layer} ${s.lHeader}`} style={z(46)}>
            <span className={s.avatar}>
              <svg viewBox="0 0 28 28" aria-hidden="true">
                <circle cx="14" cy="11" r="4.6" />
                <path d="M5.5 24c1.6-4.6 4.8-6.8 8.5-6.8s6.9 2.2 8.5 6.8" />
              </svg>
            </span>
            <span className={s.nameBars}>
              <i />
              <i />
            </span>
          </Step>

          <Step at={[times.thumbs, end]} fx="scale" className={`${s.layer} ${s.lThumbs}`} style={z(70)}>
            {EVIDENCE.map((kind) => (
              <span key={kind} className={s.thumb}>
                <EvidenceIcon kind={kind} className={s.thumbIcon} />
              </span>
            ))}
          </Step>

          {times.stamp !== undefined && (
            <Step at={[times.stamp, end]} fx="pop" className={`${s.layer} ${s.lStamp}`} style={z(96)}>
              Publicado
            </Step>
          )}
        </div>
      </div>
    </div>
  );
}

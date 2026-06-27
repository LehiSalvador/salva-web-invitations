"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type VideoSources = {
  q1080: string;
  q720: string;
  q540: string;
};

type StageProps = {
  sources: VideoSources;
  posterSrc: string;
  bannerSrc: string;
  mapsUrl: string;
  ctaText: string;
  guestName: string;
  shortName: string;
};

// Conexion del navegador (API no estandar; degradacion segura si no existe).
type NetworkInfo = { saveData?: boolean; effectiveType?: string };

// Elige la calidad mas ligera razonable para ahorrar egress:
// - saveData o conexion 2g/3g -> 540p (ultra ligera)
// - desktop ancho (>=1024) con buena conexion -> 1080p (alta calidad)
// - resto (movil/tablet) -> 720p (default)
function pickQuality(s: VideoSources): string {
  if (typeof window === "undefined") return s.q720;
  const nav = navigator as Navigator & { connection?: NetworkInfo };
  const net = nav.connection;
  const et = net?.effectiveType;
  if (net?.saveData || et === "slow-2g" || et === "2g" || et === "3g") return s.q540;
  if (window.innerWidth >= 1024 && (et === "4g" || et === undefined)) return s.q1080;
  return s.q720;
}

// El video se reproduce UNA sola vez tras el tap del usuario. No hay loop ni
// replay automatico: al terminar se muestra el boton "Volver a ver" y solo se
// reproduce de nuevo si el usuario lo decide (politica anti-consumo de transferencia).
// preload="none": no se descarga video hasta el tap (poster representa la carga).

export default function InvitationStage({
  sources,
  posterSrc,
  bannerSrc,
  mapsUrl,
  ctaText,
  guestName,
  shortName,
}: StageProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const openedRef = useRef(false);

  const [opened, setOpened] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [showSoundFallback, setShowSoundFallback] = useState(false);
  const [ended, setEnded] = useState(false);
  // SSR default 720p; se refina en cliente segun dispositivo/conexion (sin descargar).
  const [videoSrc, setVideoSrc] = useState(sources.q720);

  useEffect(() => {
    setVideoSrc(pickQuality(sources));
  }, [sources]);

  // Abrir invitacion: gesto del usuario -> reproducir desde 0 CON sonido.
  const openInvitation = useCallback(() => {
    const v = videoRef.current;
    openedRef.current = true;
    setOpened(true);
    setEnded(false);
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    v.volume = 1;
    const p = v.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        setSoundOn(true);
        setShowSoundFallback(false);
      }).catch(() => {
        // El navegador bloqueo el audio: fallback en silencio + boton secundario.
        v.muted = true;
        const p2 = v.play();
        if (p2 && typeof p2.catch === "function") p2.catch(() => {});
        setSoundOn(false);
        setShowSoundFallback(true);
      });
    } else {
      setSoundOn(true);
    }
  }, []);

  // Boton secundario de sonido (solo si el autoplay con audio fue bloqueado).
  const enableSound = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    const p = v.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        setSoundOn(true);
        setShowSoundFallback(false);
      }).catch(() => {});
    } else {
      setSoundOn(true);
      setShowSoundFallback(false);
    }
  }, []);

  // Al terminar: NO se reinicia solo. Se marca como terminado para mostrar el
  // boton "Volver a ver" (reproduccion manual unicamente, sin loop ni replay).
  const handleEnded = useCallback(() => {
    setEnded(true);
  }, []);

  // Volver a ver: solo por accion explicita del usuario.
  const replay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setEnded(false);
    v.currentTime = 0;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, []);

  // Pausar en background; reanudar (misma posicion) al volver si no ha terminado.
  // Nunca reproduce oculto y nunca reinicia automaticamente.
  useEffect(() => {
    const onVisibility = () => {
      const v = videoRef.current;
      if (!v) return;
      if (document.hidden) {
        v.pause();
      } else if (openedRef.current && !v.ended) {
        const p = v.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <main className="page">
      <h1 className="sr-only">Invitación a la fiesta de {guestName}</h1>

      <div className="composition">
        {/* ---------- Video (arriba) ---------- */}
        <div className="video-wrap">
          <video
            ref={videoRef}
            className={`video ${videoReady ? "is-ready" : ""}`}
            src={videoSrc}
            poster={posterSrc}
            playsInline
            preload="none"
            onLoadedMetadata={() => setVideoReady(true)}
            onCanPlay={() => setVideoReady(true)}
            onEnded={handleEnded}
            onError={() => setVideoReady(false)}
          />

          {/* Placeholder de carga: solo visible mientras el video carga tras el tap.
              Antes del tap se muestra el poster (no se descarga video). */}
          <div
            className={`video-placeholder ${videoReady || !opened ? "is-hidden" : ""}`}
            aria-hidden="true"
          >
            <span className="orb" />
          </div>

          {/* Boton de sonido secundario (solo si el audio fue bloqueado) */}
          {opened && showSoundFallback && !soundOn && !ended && (
            <button
              type="button"
              className="sound-btn"
              onClick={enableSound}
              aria-label="Activar sonido"
            >
              🔈 Activar sonido
            </button>
          )}

          {/* Al terminar: scrim + accion manual para volver a ver (sin replay automatico) */}
          {opened && ended && (
            <div className="replay-overlay">
              <button
                type="button"
                className="replay-btn"
                onClick={replay}
                aria-label="Volver a ver el video de la invitación"
              >
                ↺ Volver a ver
              </button>
            </div>
          )}
        </div>

        {/* ---------- Banner clickeable (abajo) ---------- */}
        <a
          className="banner-link"
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Ver la ubicación en Google Maps"
        >
          <span className="banner-cta">{ctaText}</span>
          <Image
            className="banner-img"
            src={bannerSrc}
            alt={`Invitación de ${guestName} — pulsa para ver la ubicación`}
            width={1600}
            height={800}
            sizes="(max-width: 520px) 100vw, 480px"
            priority
            style={{ width: "100%", height: "auto" }}
          />
        </a>
      </div>

      {/* ---------- Overlay de apertura (con sonido) ---------- */}
      {!opened && (
        <button
          type="button"
          className="open-overlay"
          onClick={openInvitation}
          aria-label={`Abrir la invitación de ${shortName} con sonido`}
        >
          <span className="open-orb" aria-hidden="true" />
          <span className="open-title">Toca para abrir la invitación de</span>
          <span className="open-name">{shortName}</span>
          <span className="open-sub">Activa la magia con sonido</span>
          <span className="open-cta">✨ Abrir invitación</span>
        </button>
      )}
    </main>
  );
}

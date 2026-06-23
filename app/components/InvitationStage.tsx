"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type StageProps = {
  videoSrc: string;
  posterSrc: string;
  bannerSrc: string;
  mapsUrl: string;
  ctaText: string;
  guestName: string;
  shortName: string;
};

// Pausa entre reproducciones (no es loop continuo): corre una vez, termina,
// espera 3 s y reinicia, solo si la pagina esta visible y ya se abrio.
const REPLAY_DELAY_MS = 3000;

export default function InvitationStage({
  videoSrc,
  posterSrc,
  bannerSrc,
  mapsUrl,
  ctaText,
  guestName,
  shortName,
}: StageProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const replayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openedRef = useRef(false);

  const [opened, setOpened] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [showSoundFallback, setShowSoundFallback] = useState(false);

  const clearReplay = useCallback(() => {
    if (replayTimer.current) {
      clearTimeout(replayTimer.current);
      replayTimer.current = null;
    }
  }, []);

  // Abrir invitacion: gesto del usuario -> reproducir desde 0 CON sonido.
  const openInvitation = useCallback(() => {
    const v = videoRef.current;
    openedRef.current = true;
    setOpened(true);
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

  // Al terminar: esperar 3 s y reiniciar (solo si visible + abierto).
  const handleEnded = useCallback(() => {
    clearReplay();
    replayTimer.current = setTimeout(() => {
      const v = videoRef.current;
      if (!v || document.hidden || !openedRef.current) return;
      v.currentTime = 0;
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }, REPLAY_DELAY_MS);
  }, [clearReplay]);

  // Pausar en background; reanudar al volver (nunca reproducir oculto).
  useEffect(() => {
    const onVisibility = () => {
      const v = videoRef.current;
      if (!v) return;
      if (document.hidden) {
        v.pause();
        clearReplay();
      } else if (openedRef.current) {
        if (v.ended) v.currentTime = 0;
        const p = v.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      clearReplay();
    };
  }, [clearReplay]);

  return (
    <main className="page">
      <h1 className="sr-only">Invitación a la fiesta de {guestName}</h1>

      <div className="composition">
        {/* ---------- Video (arriba) ---------- */}
        <div className="video-wrap">
          <video
            ref={videoRef}
            className={`video ${videoReady ? "is-ready" : ""}`}
            poster={posterSrc}
            playsInline
            preload="metadata"
            onLoadedMetadata={() => setVideoReady(true)}
            onCanPlay={() => setVideoReady(true)}
            onEnded={handleEnded}
            onError={() => setVideoReady(false)}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

          {/* Placeholder mientras cargan los metadatos del video */}
          <div
            className={`video-placeholder ${videoReady ? "is-hidden" : ""}`}
            aria-hidden="true"
          >
            <span className="orb" />
          </div>

          {/* Boton de sonido secundario (solo si el audio fue bloqueado) */}
          {opened && showSoundFallback && !soundOn && (
            <button
              type="button"
              className="sound-btn"
              onClick={enableSound}
              aria-label="Activar sonido"
            >
              🔈 Activar sonido
            </button>
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

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type EventData = {
  guestName: string;
  eyebrow: string;
  date: string;
  time: string;
  highlight: string;
  extra: string;
  mapsUrl: string;
};

// Posiciones fijas (no aleatorias) para evitar desajustes de hidratacion.
const FIREFLIES = [
  { left: 8, top: 18, size: 5, delay: 0, dur: 7 },
  { left: 20, top: 70, size: 3, delay: 1.4, dur: 9 },
  { left: 33, top: 30, size: 6, delay: 0.6, dur: 8 },
  { left: 47, top: 82, size: 4, delay: 2.1, dur: 10 },
  { left: 58, top: 14, size: 5, delay: 1.0, dur: 7.5 },
  { left: 70, top: 60, size: 3, delay: 0.3, dur: 9.5 },
  { left: 82, top: 26, size: 6, delay: 1.8, dur: 8.5 },
  { left: 90, top: 74, size: 4, delay: 0.9, dur: 7 },
  { left: 14, top: 48, size: 4, delay: 2.6, dur: 11 },
  { left: 40, top: 55, size: 3, delay: 1.2, dur: 8 },
  { left: 63, top: 40, size: 5, delay: 0.5, dur: 9 },
  { left: 76, top: 88, size: 4, delay: 2.3, dur: 10 },
  { left: 27, top: 10, size: 3, delay: 1.6, dur: 7.5 },
  { left: 52, top: 66, size: 5, delay: 0.2, dur: 8.5 },
  { left: 88, top: 50, size: 3, delay: 1.9, dur: 9 },
  { left: 6, top: 88, size: 4, delay: 0.8, dur: 10.5 },
];

export default function InvitationStage({ event }: { event: EventData }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  // Intenta activar el sonido del video (los moviles bloquean autoplay con audio).
  const enableSound = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.volume = 1;
    const p = v.play();
    if (p && typeof p.then === "function") {
      p.then(() => setSoundOn(true)).catch(() => setSoundOn(false));
    } else {
      setSoundOn(true);
    }
  }, []);

  // En el PRIMER toque/tecla del usuario, intenta activar sonido una sola vez.
  useEffect(() => {
    if (!videoReady || soundOn) return;
    const once = () => {
      enableSound();
      window.removeEventListener("pointerdown", once);
      window.removeEventListener("keydown", once);
    };
    window.addEventListener("pointerdown", once, { once: true });
    window.addEventListener("keydown", once, { once: true });
    return () => {
      window.removeEventListener("pointerdown", once);
      window.removeEventListener("keydown", once);
    };
  }, [videoReady, soundOn, enableSound]);

  return (
    <main className="screen">
      <section className="card" aria-label="Invitación digital">
        {/* Video final (loop, vertical). Mientras no exista, se muestra el placeholder. */}
        <video
          ref={videoRef}
          className={`card-video ${videoReady ? "is-ready" : ""}`}
          poster="/assets/poster/poster.jpg"
          playsInline
          muted
          loop
          autoPlay
          preload="metadata"
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
        >
          <source src="/assets/video/invitation.mp4" type="video/mp4" />
        </video>

        {/* Placeholder elegante mientras no hay video final */}
        <div className={`placeholder ${videoReady ? "is-hidden" : ""}`} aria-hidden="true">
          <span className="placeholder-orb" />
        </div>

        {/* Hojas bioluminiscentes decorativas */}
        <svg className="leaf leaf-top" viewBox="0 0 200 200" aria-hidden="true">
          <path
            d="M10 190 C 40 120, 120 40, 190 10 C 150 70, 110 110, 60 150 C 40 165, 20 180, 10 190 Z"
            fill="url(#leafGrad)"
          />
          <path d="M10 190 C 70 130, 130 70, 190 10" stroke="rgba(120,247,208,0.45)" strokeWidth="1.5" fill="none" />
          <defs>
            <linearGradient id="leafGrad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="rgba(20,90,90,0.55)" />
              <stop offset="1" stopColor="rgba(54,224,255,0.10)" />
            </linearGradient>
          </defs>
        </svg>
        <svg className="leaf leaf-bottom" viewBox="0 0 200 200" aria-hidden="true">
          <path
            d="M10 190 C 40 120, 120 40, 190 10 C 150 70, 110 110, 60 150 C 40 165, 20 180, 10 190 Z"
            fill="url(#leafGrad)"
          />
          <path d="M10 190 C 70 130, 130 70, 190 10" stroke="rgba(120,247,208,0.4)" strokeWidth="1.5" fill="none" />
        </svg>

        {/* Luciérnagas / esporas flotantes */}
        <div className="fireflies" aria-hidden="true">
          {FIREFLIES.map((f, i) => (
            <span
              key={i}
              className="firefly"
              style={{
                left: `${f.left}%`,
                top: `${f.top}%`,
                width: f.size,
                height: f.size,
                animationDelay: `${f.delay}s`,
                animationDuration: `${f.dur}s`,
              }}
            />
          ))}
        </div>

        {/* Velo para legibilidad del texto */}
        <div className="scrim" aria-hidden="true" />

        {/* Contenido de la invitacion */}
        <div className="content">
          <p className="eyebrow">{event.eyebrow}</p>
          <h1 className="guest-name">{event.guestName}</h1>

          <div className="details">
            <p className="date">{event.date}</p>
            <p className="time">{event.time}</p>
          </div>

          <div className="exclaims">
            <p className="highlight">{event.highlight}</p>
            <p className="extra">{event.extra}</p>
          </div>

          <div className="actions">
            <a
              className="btn-location"
              href={event.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="pin" aria-hidden="true">📍</span>
              Ver ubicación
            </a>

            <button
              type="button"
              className={`btn-sound ${soundOn ? "is-on" : ""}`}
              onClick={enableSound}
            >
              {soundOn ? "🔊 Sonido activado" : "🔈 Toca para activar sonido"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

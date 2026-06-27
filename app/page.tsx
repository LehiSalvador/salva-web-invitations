import InvitationStage from "./components/InvitationStage";

// Enlace de ubicacion del evento (abre en pestana nueva, solo desde el banner).
const MAPS_URL = "https://maps.app.goo.gl/zhxMEY4R3L6mgZc9A";

// Video servido desde Supabase Storage (bucket publico `invitations-public`).
// Fuente: VideoMiaIsabella.mp4 optimizado a 3 calidades (v3), 30fps, H.264+AAC,
// faststart, cache-control immutable. El frontend elige la calidad mas ligera
// segun dispositivo/conexion (default 720p) para minimizar el egress. No se suben
// videos a GitHub. URLs publicas (sin secretos: el ref aparece en toda URL Supabase).
const SUPABASE_MEDIA =
  "https://tefprgoggrkqzwrpoctr.supabase.co/storage/v1/object/public/invitations-public/mia-isabella/video";
const VIDEO_SOURCES = {
  q1080: `${SUPABASE_MEDIA}/invitation-v3-1080p.mp4`,
  q720: `${SUPABASE_MEDIA}/invitation-v3-720p.mp4`,
  q540: `${SUPABASE_MEDIA}/invitation-v3-540p.mp4`,
};
const POSTER_URL = `${SUPABASE_MEDIA}/poster-v3.webp`;

export default function Home() {
  return (
    <InvitationStage
      sources={VIDEO_SOURCES}
      posterSrc={POSTER_URL}
      bannerSrc="/assets/imagenes/banner-ubicacion.jpg"
      mapsUrl={MAPS_URL}
      ctaText="📍 Pulsa aquí para ver la ubicación"
      guestName="Mia Isabella Rangel Cárdenas"
      shortName="Mia Isabella"
    />
  );
}

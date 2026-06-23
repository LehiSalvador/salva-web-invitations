import { ImageResponse } from "next/og";

export const alt = "Invitación a la fiesta de Mia Isabella";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen de previsualizacion (WhatsApp / redes). Placeholder generado hasta tener portada final.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(120% 80% at 50% 0%, #0a3340 0%, transparent 55%), linear-gradient(180deg, #03101a 0%, #06212e 60%, #03101a 100%)",
          color: "#eafcff",
          fontFamily: "sans-serif",
          textAlign: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#78f7d0",
          }}
        >
          Estás invitad@ a la celebración de
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 78,
            fontWeight: 700,
            color: "#eafcff",
          }}
        >
          Mia Isabella
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 38,
            color: "#36e0ff",
          }}
        >
          14 de julio · 4:00 pm
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 30,
            color: "#8fb6ff",
          }}
        >
          ¡No faltes! · ¡Lluvia de sobres!
        </div>
      </div>
    ),
    { ...size }
  );
}

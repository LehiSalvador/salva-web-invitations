import { ImageResponse } from "next/og";
import { SalvaLogo } from "@/components/brand/SalvaLogo";
import { site } from "@/data/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px 80px",
          background: "radial-gradient(120% 90% at 78% 0%, #1a1d22 0%, #07090C 60%)",
          color: "#F4F1EA",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ display: "flex", width: 64, height: 65 }}>
            <SalvaLogo style={{ width: 64, height: 65 }} />
          </div>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 8, fontWeight: 600 }}>
            SALVA <span style={{ color: "#C8AD76", marginLeft: 12 }}>SYSTEMS</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 70, lineHeight: 1.05, fontWeight: 700, letterSpacing: -2, maxWidth: 980 }}>
            Convertimos problemas reales en soluciones digitales que funcionan.
          </div>
          <div style={{ display: "flex", marginTop: 32, fontSize: 26, color: "#A6A8AD" }}>
            Plataformas web · Apps · Automatización · IA aplicada
          </div>
        </div>
        <div style={{ display: "flex", height: 2, width: "100%", background: "linear-gradient(90deg, #7D6845, #C8AD76 50%, transparent)" }} />
      </div>
    ),
    size,
  );
}

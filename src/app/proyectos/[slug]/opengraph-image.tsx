import { ImageResponse } from "next/og";
import { SalvaLogo } from "@/components/brand/SalvaLogo";
import { projectBySlug, projects } from "@/data/projects";

export const alt = "Case study de Salva Systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const project = projectBySlug((await params).slug) ?? projects[0];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          background: "radial-gradient(110% 80% at 8% 0%, #12302a 0%, #060809 58%)",
          color: "#EEEBE4",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", width: 54, height: 55 }}>
              <SalvaLogo style={{ width: 54, height: 55 }} />
            </div>
            <div style={{ display: "flex", fontSize: 22, letterSpacing: 7, fontWeight: 600 }}>SALVA SYSTEMS</div>
          </div>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 5, color: "#6FD6B0" }}>CASE STUDY</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 5, color: "#A3A9AB" }}>{project.category.toUpperCase()}</div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 92, lineHeight: 1, fontWeight: 700, letterSpacing: -3 }}>{project.name}</div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 30, lineHeight: 1.35, color: "#C9CDCB", maxWidth: 960 }}>{project.pitch}</div>
        </div>
        <div style={{ display: "flex", height: 2, width: "100%", background: "linear-gradient(90deg, #6FD6B0, #C8AD76 50%, transparent)" }} />
      </div>
    ),
    size,
  );
}

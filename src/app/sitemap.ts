import type { MetadataRoute } from "next";
import { projectHref, projects } from "@/data/projects";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url?.origin ?? "https://salva-systems-website.vercel.app";
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/proyectos`, changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((project) => ({ url: `${base}${projectHref(project)}`, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}

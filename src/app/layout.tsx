import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { MotionObserver } from "@/components/MotionObserver";
import { site } from "@/data/site";
import "./globals.css";

const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  ...(site.url ? { metadataBase: site.url } : {}),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Salva Systems",
    "soluciones digitales",
    "automatización de procesos",
    "desarrollo de software",
    "plataformas web",
    "aplicaciones",
    "inteligencia artificial aplicada",
    "integraciones",
  ],
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#08090B",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-MX" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-bone focus:px-4 focus:py-2 focus:text-ink-950"
        >
          Saltar al contenido
        </a>
        {children}
        <MotionObserver />
      </body>
    </html>
  );
}

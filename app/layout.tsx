import type { Metadata, Viewport } from "next";
import { Cinzel, Quicksand } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

// Dominio reutilizado para esta invitacion (configurable en Vercel).
const SITE_URL = "https://premiumcapverify.site";
const OG_TITLE = "Invitación a la fiesta de Mia Isabella";
const OG_DESCRIPTION = "Te esperamos este 14 de julio a las 4:00 pm. ¡No faltes!";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: OG_TITLE,
  description: OG_DESCRIPTION,
  applicationName: "Invitación Mia Isabella",
  openGraph: {
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    url: "/",
    type: "website",
    locale: "es_MX",
    siteName: "Invitación Mia Isabella",
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
  },
  // Invitacion privada: no indexar en buscadores (el preview de WhatsApp sigue funcionando).
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#03101a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${cinzel.variable} ${quicksand.variable}`}>
      <body>{children}</body>
    </html>
  );
}

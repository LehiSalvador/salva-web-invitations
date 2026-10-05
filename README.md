# salva-systems-web

Sitio web oficial de Salva Systems: landing one-page sobre soluciones digitales, automatización, aplicaciones e inteligencia aplicada a operaciones.

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4
- Tipografías Instrument Serif (titulares) e IBM Plex Sans/Mono (texto y datos) con `next/font`
- Animaciones con CSS y un único IntersectionObserver, sin librerías de animación
- Sitio estático: sin backend, base de datos ni servicios externos

## Desarrollo

Requiere Node.js 20.9 o superior.

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build      # build de producción
```

## Estructura

```
src/app/                 layout, página, estilos globales, metadata, ícono, imagen Open Graph y robots
src/components/          secciones de la landing; ProjectDiagram.tsx dibuja la figura de cada proyecto
src/components/brand/    logo de Salva Systems (SalvaLogo) y marca con nombre (BrandMark)
src/data/site.ts         textos generales, navegación, WhatsApp y URL del sitio
src/data/projects.ts     proyectos: texto, componentes del sistema, pie de figura y logo
src/lib/whatsapp.ts      enlace wa.me con mensaje precargado
public/brand/            logo oficial de Salva Systems
public/projects/         logos de los proyectos
```

## Logos y assets

- **Salva Systems:** `public/brand/salva-systems-logo.svg` (colores originales) y `salva-systems-logo-inverse.svg` (para fondos oscuros). La interfaz dibuja el logo desde `src/components/brand/SalvaLogo.tsx` con la misma geometría, para poder animar sus partes. Si cambia el logo, actualiza ese componente, los archivos de `public/brand/` y `src/app/icon.svg`.
- **Proyectos:** cada entrada de `src/data/projects.ts` acepta `logo` (`src`, `alt`, `width`, `height`). Para cambiar una marca, reemplaza el archivo en `public/projects/` o actualiza la ruta; sin `logo`, la lámina del proyecto omite el sello. El diagrama de cada proyecto vive en `src/components/ProjectDiagram.tsx`, indexado por `id`.

## WhatsApp

El número y el mensaje precargado viven en el objeto `whatsapp` de `src/data/site.ts`. `src/lib/whatsapp.ts` arma el enlace `wa.me`. Si el número no está en formato internacional válido, el build falla.

## URL del sitio

`NEXT_PUBLIC_SITE_URL` es opcional y define la URL pública que se usa en la metadata y en Open Graph. Si no se define, Next.js toma la URL de producción que asigna Vercel. Las variables `NEXT_PUBLIC_*` se insertan al compilar, así que después de cambiarla hay que volver a desplegar.

## Deploy

El repositorio está conectado al proyecto de Vercel `salva-systems-web` por Git Integration: cada push a `main` genera un deployment de producción. El dominio corporativo se conectará más adelante. Cuando llegue ese momento, basta con agregarlo al proyecto en Vercel y actualizar `NEXT_PUBLIC_SITE_URL`.

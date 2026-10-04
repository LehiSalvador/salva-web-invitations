# Salva Systems — sitio web

Landing one-page de Salva Systems: soluciones digitales, automatización y tecnología para mejorar operaciones.

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4
- Motion (`motion/react`) para animaciones y Lucide para iconos
- Página estática: sin backend, base de datos ni servicios externos

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
src/app/            layout, página, estilos globales, metadata, icono, imagen OG, robots
src/components/     secciones y componentes interactivos
src/components/visuals/ProjectVisual.tsx   composiciones SVG de cada proyecto
src/data/site.ts    textos generales, navegación y configuración de WhatsApp
src/data/projects.ts datos del carrusel de proyectos
src/lib/whatsapp.ts  generación del enlace wa.me
```

## Configuración

| Variable | Uso |
| --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp en formato internacional, solo dígitos (ej. `52` + 10 dígitos). Si no está definido o no es válido, los botones de WhatsApp no generan enlace y la sección de contacto lo indica. |
| `NEXT_PUBLIC_SITE_URL` | Opcional. URL pública definitiva; se usa como `metadataBase` para Open Graph. |

Las variables `NEXT_PUBLIC_*` se insertan al compilar: después de configurarlas en Vercel hay que volver a desplegar.

## Marca y visuales

- El símbolo y wordmark actuales son un tratamiento temporal en `src/components/BrandMark.tsx` (y `src/app/icon.svg`). Para usar el logo oficial, reemplaza ese componente y el icono.
- Cada proyecto en `src/data/projects.ts` acepta `image: { src, alt }`. Coloca la imagen en `public/projects/` y agrégala al proyecto; reemplaza automáticamente la composición SVG.

## Deploy

El repositorio está conectado al proyecto de Vercel `premium-cap-verify` mediante Git Integration: cada push a `main` genera un deployment de producción.

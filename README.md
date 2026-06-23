# Invitación digital — Mia Isabella Rangel Cárdenas

Landing web móvil (una sola página) para la invitación a la fiesta.
Diseño vertical 9:16, estética de selva bioluminiscente azul, premium y mágica.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- Tipografías vía `next/font` (Cinzel + Quicksand)
- Imagen de previsualización (Open Graph) generada con `next/og`
- Lista para desplegar en **Vercel**

## Evento

- **Festejada:** Mia Isabella Rangel Cárdenas
- **Fecha:** 14 de julio · **Hora:** 4:00 pm
- **Ubicación:** botón "Ver ubicación" → Google Maps

## Desarrollo local

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint     # ESLint (next/core-web-vitals)
npm run build    # build de producción
```

## Video y portada finales

Coloca los archivos finales en:

- `public/assets/video/invitation.mp4`  → video vertical 9:16 en loop
- `public/assets/poster/poster.jpg`      → primer fotograma / portada

Mientras no existan, la página muestra un placeholder animado elegante.
El audio inicia en silencio (los móviles bloquean autoplay con sonido);
el usuario lo activa con el botón **"Toca para activar sonido"** o al primer toque.

## Previsualización en WhatsApp (Open Graph)

Metadatos configurados en `app/layout.tsx` y la imagen en `app/opengraph-image.tsx`.
Para reemplazar la portada final del preview, edita `app/opengraph-image.tsx`
o añade una imagen y referénciala en `openGraph.images`.

## Notas

- El dominio se reutiliza del proyecto anterior (configurado en Vercel).
- Página privada: `robots` en `noindex` (el preview de WhatsApp sigue funcionando).
- No contiene marcas, logos ni nombres oficiales de terceros.

# salva-systems-web

Sitio oficial de Salva Systems: empresa de desarrollo web, software a medida, automatización e inteligencia artificial aplicada.
Home ligera más un case study por proyecto, cada uno con una simulación animada de cómo funciona el sistema.

## Stack

- Next.js (App Router) + React + TypeScript, páginas estáticas (SSG)
- Tailwind CSS v4 más hojas propias en `src/styles/`
- Tipografías Archivo (titulares) e IBM Plex Sans/Mono (texto y datos) con `next/font`
- Motion propio: CSS, Web Animations API, CSS 3D, animaciones ligadas al scroll y View Transitions de React. Sin librerías de animación ni WebGL.
- Sin backend, base de datos ni servicios externos

## Desarrollo

Requiere Node.js 20.9 o superior.

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm run build      # build de producción
```

## Rutas

```
/                          home: hero, nosotros, qué hacemos, showcase de proyectos, proceso y contacto
/proyectos                 índice de proyectos con vista previa viva de cada uno
/proyectos/<slug>          case study: problema, simulación, cómo funciona, esquema y componentes
```

Slugs: `aplomo`, `atenor`, `careertrackly`, `salvaops`, `salva-exclusive-caps`, `archivo-system`.

## Estructura

```
src/app/                       layout (ambiente, navegación, footer), páginas, metadata, OG, sitemap y robots
src/components/home/           secciones de la home (Hero, HeroStack, About, Capabilities, Showcase, Process, Contact)
src/components/case/           piezas de los case studies (tarjeta del índice, cierre de contacto)
src/components/scenes/         simulación (Scene) y vista previa (Preview) de cada proyecto; index.ts las registra
src/components/motion/         motor de motion: Ambient, MotionObserver, InteractionEngine, Step, Packet, Reveal
src/components/ProjectDiagram.tsx  esquema conceptual de cada proyecto (sección "Esquema" del case study)
src/components/brand/          logo de Salva Systems (SalvaLogo) y marca con nombre (BrandMark)
src/data/                      textos: site.ts (navegación y WhatsApp), projects.ts (proyectos y case studies), capabilities.ts
src/styles/                    ambient, motion, interaction, diagrams y sections
public/brand/, public/projects/  logos
```

## Sistema de motion

- **Ambiente** (`Ambient.tsx` y `styles/ambient.css`): base obsidiana con halos de luz, retícula de puntos, partículas y estelas verdes.
  La lente verde que sigue al puntero revela la retícula iluminada. Todo va en una capa fija y se anima solo con `transform` y `opacity`, sin capas grandes en movimiento continuo.
- **Interacción** (`InteractionEngine.tsx`): un solo listener delegado de puntero.
  - `data-spotlight` ilumina superficies y bordes bajo el cursor.
  - `data-magnetic` desplaza botones hacia el puntero.
  - `data-tilt` inclina en 3D.
  - `.parallax` gira la pila del hero.
  - Solo se activa con mouse.
- **Simulación** (`MotionObserver.tsx`): `data-live` marca escenas que solo corren en pantalla.
  - Dentro, `Step` (`data-cycle` + ventanas `at`) arma líneas de tiempo declarativas.
  - `Packet` recorre rutas en coordenadas del diagrama, sincronizado con el mismo ciclo.
  - Todo con Web Animations, pausado fuera de pantalla.
- **Scroll**: `data-reveal` (fade, mask, scale, group) para entradas. Proceso usa `animation-timeline: view()` donde hay soporte.
- **Navegación**: `ViewTransition` de React para el cambio entre páginas y el morph del nombre del proyecto entre showcase, índice y case study.
- **Reduced motion**: sin animaciones continuas. Las escenas se muestran completas y estáticas y el ambiente queda fijo.

## Reglas de performance del motion

- Solo `transform` y `opacity`. Nada de atributos SVG, `stroke-dashoffset` en bucle, `filter` ni `box-shadow` animados.
- No animar pseudo-elementos ni puntos diminutos en bucle infinito: no se componen en GPU y fuerzan recálculos de estilo en cada frame.
- Keyframes CSS propios de una escena con la misma duración que su `data-cycle`. MotionObserver los alinea con la línea de tiempo al volver a pantalla y al redimensionar.
- Lo que el diseño responsive oculta (`display: none`) se pausa solo.

## Proyectos y escenas

Cada proyecto vive en `src/data/projects.ts` (texto, contexto, pasos, capacidades, logo y slug). Su simulación y su vista previa están en
`src/components/scenes/<Proyecto>Scene.tsx`. Para agregar un proyecto: añade la entrada de datos, crea su archivo de escena y regístralo en `scenes/index.ts`.

Logos: `public/projects/`. Sin `logo`, la interfaz omite el sello.

## WhatsApp

El número y el mensaje precargado viven en el objeto `whatsapp` de `src/data/site.ts`. `src/lib/whatsapp.ts` arma el enlace `wa.me`. Si el número no está en formato internacional válido, el build falla.

## URL del sitio

`NEXT_PUBLIC_SITE_URL` es opcional y define la URL pública que se usa en la metadata, Open Graph y el sitemap. Si no se define, Next.js toma la URL de producción que asigna Vercel. Las variables `NEXT_PUBLIC_*` se insertan al compilar, así que después de cambiarla hay que volver a desplegar.

## Deploy

El repositorio está conectado al proyecto de Vercel `salva-systems-web` por Git Integration: cada push a `main` genera un deployment de producción. El dominio corporativo se conectará más adelante. Cuando llegue ese momento, basta con agregarlo al proyecto en Vercel y actualizar `NEXT_PUBLIC_SITE_URL`.

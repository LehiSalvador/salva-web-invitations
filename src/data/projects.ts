export type ProjectLogo = {
  /** Archivo en /public/projects. Para cambiar una marca basta con reemplazar el archivo o esta ruta. */
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ProjectId = "aplomo" | "atenor" | "careertrackly" | "salvaops" | "salva-exclusive-caps" | "archivo";

export type Project = {
  id: ProjectId;
  /** Segmento de la URL del case study: /proyectos/<slug>. */
  slug: string;
  name: string;
  category: string;
  description: string;
  /** Frase corta para el showcase de la home. */
  pitch: string;
  /** El problema que atiende, sin cifras ni clientes inventados. */
  context: string;
  /** Cómo funciona, en pasos. */
  steps: { title: string; text: string }[];
  /** Piezas del sistema, tomadas de la descripción del proyecto. */
  parts: string[];
  /** Capacidades explicadas: una por pieza del sistema. */
  capabilities: { title: string; text: string }[];
  /** Pie de la figura conceptual del proyecto. */
  figure: string;
  /** Nombre técnico de la simulación principal (barra superior del visor). */
  scene: string;
  /** Relación de Salva Systems con el proyecto cuando no es un producto propio. */
  relation?: string;
  logo?: ProjectLogo;
};

export const projects: Project[] = [
  {
    id: "aplomo",
    slug: "aplomo",
    name: "Aplomo System",
    category: "Operaciones / Industria",
    description:
      "Plataforma de inteligencia operativa para digitalizar patios industriales, materiales, ubicaciones, flujos y trazabilidad.",
    pitch: "El patio industrial convertido en un modelo digital: qué hay, dónde está y cómo se movió.",
    context:
      "En un patio industrial conviven zonas de almacenamiento, materiales a granel y camiones que entran y salen. Cuando la ubicación de cada material depende de registros manuales o de la memoria del equipo, encontrar algo, planear un movimiento o reconstruir lo que pasó se vuelve lento y propenso a errores.",
    steps: [
      { title: "Modelar el patio", text: "Zonas, ubicaciones y materiales quedan representados en un mapa digital del patio." },
      { title: "Registrar movimientos", text: "Cada entrada, salida o cambio de ubicación se captura como un evento del flujo operativo." },
      { title: "Ubicar al instante", text: "La plataforma responde dónde está cada material y en qué estado se encuentra." },
      { title: "Rastrear el historial", text: "La trazabilidad permite reconstruir el recorrido completo de un material." },
    ],
    parts: ["Patios", "Materiales", "Ubicaciones", "Flujos", "Trazabilidad"],
    capabilities: [
      { title: "Patios", text: "Modelo digital de zonas y áreas operativas del patio." },
      { title: "Materiales", text: "Registro de materiales, incluido material a granel, por tipo y zona." },
      { title: "Ubicaciones", text: "Posiciones identificables para saber dónde está cada material." },
      { title: "Flujos", text: "Entradas, salidas y movimientos capturados como eventos." },
      { title: "Trazabilidad", text: "Historial consultable del recorrido de cada material." },
    ],
    figure: "Patio industrial: zonas, ubicaciones y ruta operativa de un material.",
    scene: "aplomo / patio-operativo",
    logo: { src: "/projects/aplomo-logo.svg", alt: "Isotipo de Aplomo System", width: 272, height: 272 },
  },
  {
    id: "atenor",
    slug: "atenor",
    name: "Atenor System",
    category: "Automatización / IA",
    description:
      "Plataforma multinegocio para centralizar atención, clientes y operaciones mediante WhatsApp, automatización e inteligencia artificial.",
    pitch: "Mensajes de WhatsApp que se entienden, se clasifican y se convierten en acciones.",
    context:
      "Los negocios que atienden por WhatsApp reciben consultas, pedidos y seguimientos mezclados en un mismo canal. Sin un sistema detrás, la respuesta depende de quién esté disponible y la información de clientes queda dispersa entre conversaciones.",
    steps: [
      { title: "Recibir", text: "Los mensajes de varios negocios llegan por WhatsApp a una misma plataforma." },
      { title: "Entender", text: "Automatización e inteligencia artificial identifican qué necesita cada mensaje." },
      { title: "Derivar", text: "Cada caso se dirige a atención, clientes u operación según corresponda." },
      { title: "Responder", text: "La conversación continúa con contexto y queda registrada para el negocio." },
    ],
    parts: ["Atención", "Clientes", "Operaciones", "WhatsApp", "Automatización", "IA"],
    capabilities: [
      { title: "Atención", text: "Conversaciones atendidas desde un solo lugar, sin perder el hilo." },
      { title: "Clientes", text: "Información de clientes centralizada en lugar de dispersa en chats." },
      { title: "Operaciones", text: "Solicitudes que se convierten en tareas para el equipo." },
      { title: "WhatsApp", text: "El canal que los clientes ya usan, conectado a la plataforma." },
      { title: "Automatización", text: "Flujos que resuelven lo repetitivo sin intervención manual." },
      { title: "IA", text: "Comprensión del mensaje para clasificar y priorizar." },
    ],
    figure: "Mensajes de varios negocios entran por WhatsApp, se procesan y se convierten en acciones.",
    scene: "atenor / bandeja-inteligente",
  },
  {
    id: "careertrackly",
    slug: "careertrackly",
    name: "Careertrackly",
    category: "Professional Tech",
    description:
      "Plataforma para crear, publicar y descubrir portfolios profesionales basados en trayectoria, proyectos y evidencia.",
    pitch: "Trayectoria, proyectos y evidencia organizados en un portfolio que se puede publicar y descubrir.",
    context:
      "Un CV resume una trayectoria en pocas líneas y deja fuera lo que mejor la demuestra: los proyectos realizados y la evidencia del trabajo. Mostrar esa experiencia de forma ordenada y verificable requiere más que un documento.",
    steps: [
      { title: "Registrar la trayectoria", text: "Etapas profesionales organizadas en una línea de tiempo." },
      { title: "Respaldar con proyectos", text: "Cada etapa se conecta con los proyectos que la demuestran." },
      { title: "Adjuntar evidencia", text: "Documentos y resultados sostienen cada proyecto." },
      { title: "Publicar y descubrir", text: "El portfolio se publica y puede encontrarse dentro de la plataforma." },
    ],
    parts: ["Trayectoria", "Proyectos", "Evidencia", "Portfolio"],
    capabilities: [
      { title: "Trayectoria", text: "Experiencia profesional estructurada como línea de tiempo." },
      { title: "Proyectos", text: "Trabajo concreto asociado a cada etapa." },
      { title: "Evidencia", text: "Respaldo verificable de lo que se hizo." },
      { title: "Portfolio", text: "Perfil publicable para compartir y ser descubierto." },
    ],
    figure: "Una trayectoria profesional respaldada por proyectos y evidencia, publicada como portfolio.",
    scene: "careertrackly / constructor-de-portfolio",
    logo: { src: "/projects/careertrackly-logo.svg", alt: "Logotipo de Careertrackly", width: 256, height: 228 },
  },
  {
    id: "salvaops",
    slug: "salvaops",
    name: "SalvaOps",
    category: "Developer Tools / AI Orchestration",
    description:
      "Aplicación local-first para desarrollo asistido por agentes que centraliza proyectos, proveedores de IA, operaciones, evidencia y automatización bajo un modelo de orquestación segura.",
    pitch: "Orquestación segura de agentes de IA: cada proyecto, proveedor y operación bajo control.",
    context:
      "Trabajar con agentes de IA en varios proyectos implica decidir qué proveedor atiende cada tarea, qué puede hacer cada agente y cómo comprobar lo que hizo. Sin una capa de orquestación, esa información queda repartida entre herramientas y sesiones.",
    steps: [
      { title: "Aislar por proyecto", text: "Cada proyecto tiene su propio espacio, agentes y reglas." },
      { title: "Orquestar", text: "Un broker decide qué proveedor de IA atiende cada operación." },
      { title: "Controlar", text: "Las operaciones pasan por un modelo de permisos antes de ejecutarse." },
      { title: "Registrar evidencia", text: "Cada operación queda documentada para revisarla después." },
    ],
    parts: ["Proyectos", "Agentes", "Proveedores de IA", "Operaciones", "Evidencia"],
    capabilities: [
      { title: "Proyectos", text: "Espacios separados para cada base de código y su contexto." },
      { title: "Agentes", text: "Desarrollo asistido por agentes dentro de límites definidos." },
      { title: "Proveedores de IA", text: "Varios proveedores coordinados desde un mismo broker." },
      { title: "Operaciones", text: "Acciones controladas bajo un modelo de orquestación segura." },
      { title: "Evidencia", text: "Registro de cada operación para auditar el trabajo." },
    ],
    figure: "Orquestación por proyecto: agente, broker y proveedor, con cada operación registrada como evidencia.",
    scene: "salvaops / consola-de-orquestación",
    logo: { src: "/projects/salvaops-logo.svg", alt: "Logotipo de SalvaOps", width: 128, height: 128 },
  },
  {
    id: "salva-exclusive-caps",
    slug: "salva-exclusive-caps",
    name: "Salva Exclusive Caps",
    category: "Commerce / Digital Experience",
    description:
      "Desarrollo de experiencia web, herramientas digitales y automatizaciones aplicadas a un negocio de comercio electrónico.",
    pitch: "Experiencia web, herramientas y automatizaciones para un negocio de comercio electrónico.",
    context:
      "Un negocio de comercio electrónico necesita que el catálogo se vea bien, que comprar sea sencillo y que las tareas repetitivas detrás de cada pedido no dependan de hacerlas a mano.",
    steps: [
      { title: "Catálogo", text: "Productos presentados de forma clara y atractiva." },
      { title: "Producto", text: "Cada artículo con la información necesaria para decidir la compra." },
      { title: "Pedido", text: "Un recorrido de compra directo, sin pasos de más." },
      { title: "Automatizaciones", text: "Tareas posteriores al pedido resueltas por herramientas digitales." },
    ],
    parts: ["Experiencia web", "Herramientas digitales", "Automatizaciones"],
    capabilities: [
      { title: "Experiencia web", text: "Diseño y desarrollo del recorrido de compra." },
      { title: "Herramientas digitales", text: "Soporte para la operación diaria del negocio." },
      { title: "Automatizaciones", text: "Procesos repetitivos resueltos sin intervención manual." },
    ],
    figure: "Del catálogo al producto y al pedido: el recorrido de compra que sostiene la experiencia web.",
    scene: "exclusive-caps / recorrido-de-compra",
    relation: "Implementación tecnológica para un negocio de comercio electrónico",
  },
  {
    id: "archivo",
    slug: "archivo-system",
    name: "Archivo System",
    category: "Knowledge / Digital Experience",
    description:
      "Plataforma digital orientada a organizar, presentar y preservar contenido, historias y conocimiento.",
    pitch: "Contenido, historias y conocimiento organizados en capas para presentarse y preservarse.",
    context:
      "El contenido valioso —documentos, historias y conocimiento— suele estar disperso y sin estructura. Eso lo vuelve difícil de encontrar, de presentar con cuidado y de conservar en el tiempo.",
    steps: [
      { title: "Organizar", text: "El contenido se estructura en colecciones, historias y documentos." },
      { title: "Relacionar", text: "Cada pieza se conecta con el contenido y el conocimiento que la rodea." },
      { title: "Presentar", text: "Las historias se muestran como una experiencia digital cuidada." },
      { title: "Preservar", text: "El archivo queda resguardado y disponible a largo plazo." },
    ],
    parts: ["Organizar", "Presentar", "Preservar"],
    capabilities: [
      { title: "Organizar", text: "Estructura en capas para contenido, historias y conocimiento." },
      { title: "Presentar", text: "Experiencia digital pensada para recorrer el archivo." },
      { title: "Preservar", text: "Conservación del contenido en un formato digital estable." },
    ],
    figure: "Capas de contenido, historias y conocimiento relacionadas dentro de un archivo.",
    scene: "archivo / capas-de-conocimiento",
    logo: { src: "/projects/archivo-system-logo.webp", alt: "Logotipo de Archivo System", width: 480, height: 756 },
  },
];

export const projectBySlug = (slug: string) => projects.find((project) => project.slug === slug);

export const projectHref = (project: Pick<Project, "slug">) => `/proyectos/${project.slug}`;

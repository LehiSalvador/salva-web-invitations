import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SalvaOps Connections para Vercel | Salva Systems",
  description: "Requisitos, conexión, permisos y privacidad de SalvaOps Connections para Vercel.",
};

const sections = [
  {
    title: "1. Qué es SalvaOps Connections",
    body: <p>SalvaOps Connections vincula una cuenta de Vercel con SalvaOps instalado en Windows. Desde el Desktop, el propietario elige qué proyectos de Vercel quedan asociados a cada Project de SalvaOps.</p>,
  },
  {
    title: "2. Requisitos",
    body: <ul><li>Windows.</li><li>SalvaOps instalado y abierto para administrar conexiones.</li><li>Una cuenta de Vercel con acceso a los proyectos que quieras vincular.</li></ul>,
  },
  {
    title: "3. Cómo conectar",
    body: <><p>En el Desktop, abre <strong>Cuentas conectadas</strong> para iniciar la autorización guiada cuando la integración esté registrada y habilitada. Mientras tanto, puedes conectar Vercel con un token manual. En ambos casos, SalvaOps conserva la credencial localmente en el Broker y el Vault de Windows.</p><p>Si Windows Hello está inscrito para SalvaOps, se solicita para iniciar la autorización y para guardar, cambiar o desconectar una credencial.</p></>,
  },
  {
    title: "4. Permisos que solicita Vercel",
    body: <><p>La configuración preparada para esta integración solicita lectura y escritura para Integration Configuration, Integration Resource, Deployments, Deployment Checks, Projects, Project Environment Variables, Global Project Environment Variables, Project Protection Bypass, Domains y Global Config. Solicita solo lectura para Teams y Current User. No solicita Billing, Log Drains ni Drains.</p><p>Estas categorías describen permisos seleccionados en Vercel; no significan que SalvaOps ejecute todas esas operaciones. En la superficie actual, SalvaOps solo lee los datos del proyecto vinculado, sus deployments, un deployment y nombres y destinos de variables de entorno. No modifica recursos de Vercel.</p></>,
  },
  {
    title: "5. Vincular proyectos de Vercel",
    body: <p>En un Project de SalvaOps, conecta el proyecto de Vercel que corresponda y asígnale un propósito o slot. Si vinculas varios recursos, cada uno debe tener un propósito claro. SalvaOps usa el binding de ese Project; si falta o no es válido, informa el problema y no cambia a otra cuenta o recurso.</p>,
  },
  {
    title: "6. Qué pueden leer los agentes",
    body: <><p>Claude Code, Codex y otros agentes autorizados pueden consultar el proyecto de Vercel vinculado, listar sus deployments, consultar un deployment y ver nombres y destinos de variables de entorno. Los valores de esas variables no se devuelven.</p><p>El Broker ejecuta las lecturas con la credencial guardada. El resultado para el agente indica <code>credential_returned=false</code>; el agente nunca recibe el token.</p></>,
  },
  {
    title: "7. Datos y privacidad",
    body: <><p>Las credenciales de la cuenta se guardan en el Broker y el Vault locales de Windows. En la autorización guiada, el relay procesa temporalmente el callback y el intercambio del código con Vercel. El resultado sellado queda disponible hasta cinco minutos; si no se recoge, un barrido diario lo elimina después de superar dos horas.</p><p>Consulta la <a href="/legal/salvaops/privacidad">Política de privacidad de SalvaOps</a> para conocer el tratamiento de datos.</p></>,
  },
  {
    title: "8. Desconectar y revocar",
    body: <p>Puedes desconectar la cuenta desde SalvaOps Desktop, en Cuentas conectadas. Para revocar la autorización de Vercel, hazlo también desde la configuración de integraciones de tu cuenta de Vercel. Desconectar en SalvaOps no sustituye esa revocación en Vercel.</p>,
  },
  {
    title: "9. Soporte",
    body: <p>Escribe a <a href="mailto:soporte@salvasystems.site">soporte@salvasystems.site</a>. También puedes consultar la <a href="/docs/salvaops/soporte">página de soporte</a>.</p>,
  },
];

export default function VercelConnectionsPage() {
  return <main style={{maxWidth: "860px", margin: "0 auto", padding: "64px 24px", color: "#24231f", background: "#f5f2ea", fontFamily: "Arial, sans-serif", lineHeight: 1.7}}><a href="https://www.salvasystems.site" style={{color:"inherit"}}>Salva Systems</a><article><p>SalvaOps · Conexiones</p><h1>SalvaOps Connections para Vercel</h1><p>Guía de conexión y permisos de lectura.</p>{sections.map(section => <section key={section.title} style={{marginTop:32}}><h2>{section.title}</h2><div style={{whiteSpace:"pre-line"}}>{section.body}</div></section>)}</article></main>;
}

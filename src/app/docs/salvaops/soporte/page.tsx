import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Soporte de SalvaOps | Salva Systems",
  description: "Contacto de soporte y privacidad para SalvaOps.",
};

const sections = [
  {
    title: "Soporte",
    body: <p>Para ayuda con SalvaOps Connections, escribe a <a href="mailto:soporte@salvasystems.site">soporte@salvasystems.site</a>.</p>,
  },
  {
    title: "Privacidad",
    body: <p>Para consultas de privacidad, escribe a <a href="mailto:privacidad@salvasystems.site">privacidad@salvasystems.site</a>.</p>,
  },
];

export default function SalvaOpsSupportPage() {
  return <main style={{maxWidth: "860px", margin: "0 auto", padding: "64px 24px", color: "#24231f", background: "#f5f2ea", fontFamily: "Arial, sans-serif", lineHeight: 1.7}}><a href="https://www.salvasystems.site" style={{color:"inherit"}}>Salva Systems</a><article><p>SalvaOps · Contacto</p><h1>Soporte de SalvaOps</h1>{sections.map(section => <section key={section.title} style={{marginTop:32}}><h2>{section.title}</h2><div style={{whiteSpace:"pre-line"}}>{section.body}</div></section>)}</article></main>;
}

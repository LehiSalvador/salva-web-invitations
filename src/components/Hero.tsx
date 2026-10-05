import type { CSSProperties } from "react";
import { SalvaLogo } from "@/components/brand/SalvaLogo";
import { cubic, Packet, PacketLayer } from "@/components/Packet";
import { whatsAppUrl } from "@/lib/whatsapp";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const inputs = [
  { y: 52, label: "PROCESO MANUAL" },
  { y: 152, label: "DATOS DISPERSOS" },
  { y: 252, label: "ATENCIÓN" },
];

const outputs = [
  { y: 34, label: "WEB" },
  { y: 108, label: "SOFTWARE" },
  { y: 182, label: "AUTOMATIZACIÓN" },
  { y: 256, label: "IA APLICADA" },
];

const log = ["entrada recibida", "proceso automatizado", "respuesta enviada", "registro guardado"];

/** Visual del hero: un sistema que recibe problemas y entrega soluciones, en un panel con profundidad. */
function SystemPanel() {
  return (
    <div data-live className="hero-stage rise-soft" style={delay(200)} aria-hidden="true">
      <div className="hero-panel">
        <div className="hero-panel__ghost hero-panel__ghost--2" />
        <div className="hero-panel__ghost hero-panel__ghost--1" />

        <div className="hero-panel__face border border-line-strong bg-ink-900">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <span className="label text-fog">
              <span className="hidden sm:inline">salva.systems / </span>pipeline
            </span>
            <span className="label flex items-center gap-2 text-mist">
              <span className="pulse size-1.5 rounded-full bg-signal" style={{ "--dur": "1.8s" } as CSSProperties} />
              en operación
            </span>
          </div>

          <div data-live className="dot-field relative">
            <svg viewBox="0 0 560 330" className="dg dg--hero block h-auto w-full" fill="none">
              {inputs.map((input) => (
                <g key={input.label}>
                  <path d={`M16 ${input.y}H172V${input.y + 36}H16Z`} className="dg-line dg-faint" />
                  <text x={28} y={input.y + 23} className="dg-label">
                    {input.label}
                  </text>
                  <path d={`M172 ${input.y + 18}C210 ${input.y + 18} 204 165 236 165`} className="dg-line dg-faint" />
                </g>
              ))}
              <path d="M236 117H332V213H236Z" className="dg-line dg-accent" />
              {outputs.map((output) => (
                <g key={output.label}>
                  <path d={`M332 165C370 165 364 ${output.y + 18} 404 ${output.y + 18}`} className="dg-line dg-faint" />
                  <path d={`M404 ${output.y}H544V${output.y + 36}H404Z`} className="dg-line" />
                  <text x={416} y={output.y + 23} className="dg-label dg-label-strong">
                    {output.label}
                  </text>
                </g>
              ))}
              <text x={16} y={318} className="dg-label">
                PROBLEMA
              </text>
              <text x={284} y={318} textAnchor="middle" className="dg-label dg-label-signal">
                SISTEMA
              </text>
              <text x={544} y={318} textAnchor="end" className="dg-label">
                SOLUCIÓN
              </text>
            </svg>

            <div className="hero-core">
              <span className="hero-core__ring spin" />
              <SalvaLogo tone="light" className="size-[62%]" />
            </div>

            <PacketLayer>
              {inputs.map((input, index) => (
                <Packet
                  key={input.label}
                  kind="msg"
                  size={[560, 330]}
                  route={[[132, input.y + 18], ...cubic([172, input.y + 18], [210, input.y + 18], [204, 165], [236, 165])]}
                  dur={3600}
                  delay={index * 1200}
                />
              ))}
              {outputs.map((output, index) => (
                <Packet
                  key={output.label}
                  tone="gold"
                  size={[560, 330]}
                  route={[...cubic([332, 165], [370, 165], [364, output.y + 18], [404, output.y + 18]), [440, output.y + 18]]}
                  dur={3600}
                  delay={1800 + index * 900}
                />
              ))}
            </PacketLayer>
          </div>

          <div className="flex items-center gap-3 border-t border-line px-4 py-2.5 font-mono text-[0.72rem] text-mist">
            <span className="text-gold-400">▸</span>
            <span className="hero-log">
              <span className="hero-log__track">
                {[...log, log[0]].map((line, index) => (
                  <span key={index}>{line}</span>
                ))}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative overflow-hidden bg-ink-950 pt-24 pb-16 lg:pt-32 lg:pb-24">
      <div className="mx-auto grid max-w-[90rem] items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6 xl:col-span-6">
          <p className="rise label flex items-center gap-3 text-mist" style={delay(100)}>
            <span className="h-px w-8 bg-gold-400" />
            Salva Systems · Software, automatización e IA
          </p>

          <h1
            id="hero-title"
            className="display mt-7 text-[clamp(2.35rem,8.6vw,3.6rem)] leading-[1.02] text-balance text-bone sm:text-[clamp(3rem,6.4vw,4.4rem)] lg:text-[clamp(3rem,4.3vw,4.6rem)]"
          >
            <span className="rise-line">
              <span style={delay(180)}>Convertimos problemas reales</span>
            </span>{" "}
            <span className="rise-line">
              <span style={delay(280)}>
                en <span className="text-gold-300">soluciones digitales</span>
              </span>
            </span>{" "}
            <span className="rise-line">
              <span style={delay(380)}>que funcionan.</span>
            </span>
          </h1>

          <p className="rise mt-7 max-w-xl text-[1.08rem] leading-relaxed text-pretty text-mist" style={delay(560)}>
            Desarrollamos sitios web, software a medida, automatizaciones y herramientas con inteligencia artificial que
            conectan procesos, tecnología y negocio.
          </p>

          <div className="rise mt-9 flex flex-wrap gap-3" style={delay(680)}>
            <a
              href="#proyectos"
              className="group inline-flex min-h-12 items-center gap-3 bg-gold-400 px-6 text-[0.95rem] font-medium text-ink-950 transition-colors hover:bg-gold-300"
            >
              Ver proyectos
              <span aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">
                ↓
              </span>
            </a>
            <a
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-12 items-center gap-3 border border-line-strong px-6 text-[0.95rem] text-bone transition-colors hover:border-bone"
            >
              Hablar por WhatsApp
              <span aria-hidden="true" className="text-gold-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
              <span className="sr-only">(se abre en una nueva pestaña)</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-6 xl:col-span-6">
          <SystemPanel />
        </div>
      </div>
    </section>
  );
}

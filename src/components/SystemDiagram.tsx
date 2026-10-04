const nodes = [
  { label: "PROCESOS", x: 90, y: 120 },
  { label: "DATOS", x: 430, y: 96 },
  { label: "AUTOMATIZACIÓN", x: 452, y: 388 },
  { label: "IA APLICADA", x: 70, y: 400 },
] as const;

const CENTER = { x: 260, y: 250 };

export function SystemDiagram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 500" fill="none" aria-hidden="true" className={className}>
      <defs>
        <radialGradient id="core-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#c8ad76" stopOpacity="0.32" />
          <stop offset="1" stopColor="#c8ad76" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="panel-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.03" />
        </linearGradient>
      </defs>

      <circle cx={CENTER.x} cy={CENTER.y} r="190" stroke="#ffffff" strokeOpacity="0.05" />
      <circle cx={CENTER.x} cy={CENTER.y} r="138" stroke="#c8ad76" strokeOpacity="0.16" strokeDasharray="2 6" />
      <g className="origin-[260px_250px] animate-[spin_60s_linear_infinite]">
        <circle cx={CENTER.x} cy={CENTER.y} r="190" stroke="#c8ad76" strokeOpacity="0.4" strokeDasharray="40 1154" strokeWidth="1.2" />
      </g>
      <circle cx={CENTER.x} cy={CENTER.y} r="120" fill="url(#core-glow)" />

      {nodes.map((node, i) => (
        <g key={node.label}>
          <path
            d={`M${CENTER.x} ${CENTER.y} L${node.x} ${node.y}`}
            stroke="#c8ad76"
            strokeOpacity="0.18"
          />
          <path
            d={`M${CENTER.x} ${CENTER.y} L${node.x} ${node.y}`}
            stroke="#d6bf8f"
            strokeOpacity="0.85"
            strokeWidth="1.4"
            strokeDasharray="3 237"
            className="animate-dash"
            style={{ animationDelay: `${i * -2.2}s` }}
          />
        </g>
      ))}

      <rect x="206" y="196" width="108" height="108" rx="26" fill="#0c0f13" stroke="url(#panel-stroke)" />
      <rect x="206" y="196" width="108" height="108" rx="26" stroke="#c8ad76" strokeOpacity="0.35" />
      <path
        d="M282 228H243V250H277V272H238"
        stroke="#c8ad76"
        strokeWidth="5"
        strokeLinecap="square"
      />
      <circle cx="282" cy="228" r="4.5" fill="#c8ad76" />
      <circle cx="238" cy="272" r="4.5" fill="#c8ad76" />

      {nodes.map((node, i) => {
        const width = node.label.length * 7.4 + 34;
        const left = Math.min(Math.max(node.x - width / 2, 4), 516 - width);
        return (
          <g key={`${node.label}-chip`}>
            <circle cx={node.x} cy={node.y} r="14" fill="#c8ad76" fillOpacity="0.1" className="animate-pulse-soft" style={{ animationDelay: `${i * 0.8}s` }} />
            <circle cx={node.x} cy={node.y} r="4" fill="#d6bf8f" />
            <rect
              x={left}
              y={node.y + (node.y < CENTER.y ? -50 : 22)}
              width={width}
              height="28"
              rx="14"
              fill="#11151b"
              stroke="#ffffff"
              strokeOpacity="0.1"
            />
            <text
              x={left + width / 2}
              y={node.y + (node.y < CENTER.y ? -31.5 : 40.5)}
              textAnchor="middle"
              fill="#a6a8ad"
              fontSize="11"
              letterSpacing="1.6"
              fontFamily="var(--font-geist-mono), ui-monospace, monospace"
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

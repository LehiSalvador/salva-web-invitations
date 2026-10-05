import type { ProjectVisualKind } from "@/data/projects";

const GOLD = "#c8ad76";
const GOLD_SOFT = "#7d6845";
const BONE = "#f4f1ea";
const MIST = "#a6a8ad";
const SURFACE = "#11151b";
const SURFACE_UP = "#161b22";
const LINE = "rgba(255,255,255,0.08)";
const MONO = "var(--font-geist-mono), ui-monospace, monospace";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 400 250" fill="none" aria-hidden="true" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="250" fill="#0c0f13" />
      <g stroke="rgba(255,255,255,0.035)">
        {Array.from({ length: 13 }, (_, i) => (
          <path key={`v${i}`} d={`M${i * 32 + 8} 0V250`} />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <path key={`h${i}`} d={`M0 ${i * 32 + 13}H400`} />
        ))}
      </g>
      {children}
    </svg>
  );
}

function IndustrialMap() {
  const bays = [
    { x: 46, y: 52, w: 92, h: 52 },
    { x: 150, y: 52, w: 64, h: 52 },
    { x: 46, y: 116, w: 64, h: 76 },
    { x: 122, y: 116, w: 92, h: 76 },
    { x: 226, y: 52, w: 64, h: 140 },
  ];
  return (
    <Frame>
      {bays.map((bay, i) => (
        <g key={i}>
          <rect x={bay.x} y={bay.y} width={bay.w} height={bay.h} rx="6" fill={SURFACE_UP} stroke={LINE} />
          {Array.from({ length: Math.floor(bay.w / 18) }, (_, j) => (
            <rect key={j} x={bay.x + 8 + j * 18} y={bay.y + 10} width="10" height={bay.h - 20} rx="2" fill={i === 3 && j === 2 ? GOLD : "#232a35"} fillOpacity={i === 3 && j === 2 ? 0.85 : 1} />
          ))}
        </g>
      ))}
      <path d="M30 210H300V36" stroke={GOLD} strokeOpacity="0.5" strokeDasharray="4 5" />
      <path d="M30 210H300V36" stroke={GOLD} strokeWidth="1.5" strokeDasharray="3 237" />
      <circle cx="182" cy="154" r="9" fill={GOLD} fillOpacity="0.15" />
      <circle cx="182" cy="154" r="3" fill={GOLD} />
      <rect x="306" y="52" width="74" height="140" rx="8" fill={SURFACE} stroke={LINE} />
      <text x="316" y="72" fill={MIST} fontSize="7.5" letterSpacing="1.2" fontFamily={MONO}>PATIO A-3</text>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="316" y={86 + i * 24} width="54" height="4" rx="2" fill="#232a35" />
          <rect x="316" y={86 + i * 24} width={[40, 26, 48, 18][i]} height="4" rx="2" fill={GOLD} fillOpacity={0.35 + i * 0.12} />
          <rect x="316" y={95 + i * 24} width="30" height="3" rx="1.5" fill="#232a35" />
        </g>
      ))}
      <text x="46" y="38" fill={MIST} fontSize="7.5" letterSpacing="1.4" fontFamily={MONO}>X 24.81 · Y 107.36</text>
    </Frame>
  );
}

function Conversations() {
  return (
    <Frame>
      <rect x="28" y="30" width="112" height="190" rx="10" fill={SURFACE} stroke={LINE} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x="36" y={40 + i * 35} width="96" height="29" rx="7" fill={i === 1 ? SURFACE_UP : "transparent"} stroke={i === 1 ? "rgba(200,173,118,0.3)" : "transparent"} />
          <circle cx="50" cy={54.5 + i * 35} r="7" fill={i === 1 ? GOLD : "#232a35"} fillOpacity={i === 1 ? 0.7 : 1} />
          <rect x="62" y={49 + i * 35} width={[48, 56, 40, 52, 44][i]} height="4" rx="2" fill={i === 1 ? BONE : "#2a313c"} fillOpacity={i === 1 ? 0.75 : 1} />
          <rect x="62" y={57 + i * 35} width={[34, 40, 28, 36, 30][i]} height="3" rx="1.5" fill="#232a35" />
        </g>
      ))}
      <rect x="150" y="30" width="222" height="190" rx="10" fill={SURFACE} stroke={LINE} />
      <rect x="164" y="48" width="120" height="26" rx="10" fill={SURFACE_UP} />
      <rect x="174" y="57" width="92" height="4" rx="2" fill="#3a424e" />
      <rect x="174" y="64" width="60" height="3" rx="1.5" fill="#2a313c" />
      <rect x="236" y="86" width="122" height="26" rx="10" fill={GOLD} fillOpacity="0.16" stroke="rgba(200,173,118,0.35)" />
      <rect x="246" y="95" width="96" height="4" rx="2" fill={GOLD} fillOpacity="0.7" />
      <rect x="246" y="102" width="64" height="3" rx="1.5" fill={GOLD} fillOpacity="0.4" />
      <rect x="164" y="124" width="100" height="26" rx="10" fill={SURFACE_UP} />
      <rect x="174" y="133" width="76" height="4" rx="2" fill="#3a424e" />
      <g>
        <rect x="164" y="166" width="194" height="36" rx="10" fill="#0c0f13" stroke="rgba(200,173,118,0.25)" />
        <path d="M178 184h10M183 179v10" stroke={GOLD} strokeWidth="1.4" />
        <text x="196" y="187" fill={MIST} fontSize="7.5" letterSpacing="1.2" fontFamily={MONO}>FLUJO · AUTO-RESPUESTA</text>
        <circle cx="344" cy="184" r="3" fill={GOLD} />
      </g>
    </Frame>
  );
}

function Portfolio() {
  return (
    <Frame>
      <rect x="34" y="36" width="128" height="178" rx="12" fill={SURFACE} stroke={LINE} />
      <circle cx="98" cy="84" r="24" fill={SURFACE_UP} stroke="rgba(200,173,118,0.45)" />
      <circle cx="98" cy="78" r="8" fill={GOLD_SOFT} />
      <path d="M84 96c3-8 25-8 28 0" stroke={GOLD_SOFT} strokeWidth="5" strokeLinecap="round" />
      <rect x="62" y="122" width="72" height="5" rx="2.5" fill={BONE} fillOpacity="0.75" />
      <rect x="72" y="133" width="52" height="3.5" rx="1.75" fill="#2a313c" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={52 + i * 32} y="152" width="26" height="12" rx="6" fill={i === 0 ? GOLD : "#232a35"} fillOpacity={i === 0 ? 0.3 : 1} />
      ))}
      <path d="M52 186H144" stroke={LINE} />
      <rect x="52" y="194" width="40" height="3.5" rx="1.75" fill="#2a313c" />
      {[0, 1].map((row) =>
        [0, 1].map((col) => {
          const x = 178 + col * 100;
          const y = 36 + row * 92;
          const highlight = row === 0 && col === 1;
          return (
            <g key={`${row}-${col}`}>
              <rect x={x} y={y} width="88" height="82" rx="10" fill={SURFACE} stroke={highlight ? "rgba(200,173,118,0.45)" : LINE} />
              <rect x={x + 8} y={y + 8} width="72" height="38" rx="6" fill={highlight ? GOLD : SURFACE_UP} fillOpacity={highlight ? 0.18 : 1} />
              <path d={`M${x + 16} ${y + 38} l14 -12 10 8 14 -14 18 18`} stroke={highlight ? GOLD : "#3a424e"} strokeWidth="1.4" />
              <rect x={x + 8} y={y + 54} width="54" height="4" rx="2" fill={BONE} fillOpacity="0.6" />
              <rect x={x + 8} y={y + 64} width="38" height="3" rx="1.5" fill="#2a313c" />
            </g>
          );
        }),
      )}
    </Frame>
  );
}

function Orchestration() {
  const agents = [
    { x: 200, y: 62 },
    { x: 262, y: 168 },
    { x: 138, y: 168 },
  ];
  return (
    <Frame>
      <rect x="22" y="30" width="86" height="190" rx="10" fill={SURFACE} stroke={LINE} />
      <text x="32" y="50" fill={MIST} fontSize="7" letterSpacing="1.2" fontFamily={MONO}>PROYECTOS</text>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="30" y={60 + i * 38} width="70" height="28" rx="6" fill={i === 1 ? SURFACE_UP : "transparent"} stroke={i === 1 ? "rgba(148,163,184,0.35)" : LINE} />
          <rect x="38" y={70 + i * 38} width={[40, 48, 34, 44][i]} height="4" rx="2" fill={i === 1 ? BONE : "#2a313c"} fillOpacity={i === 1 ? 0.7 : 1} />
          <rect x="38" y={78 + i * 38} width="26" height="3" rx="1.5" fill="#232a35" />
        </g>
      ))}
      <circle cx="200" cy="133" r="62" stroke="#2a313c" strokeDasharray="3 5" />
      {agents.map((a) => (
        <path key={`l${a.x}`} d={`M200 133L${a.x} ${a.y}`} stroke="#3a4556" strokeWidth="1.5" />
      ))}
      {agents.map((a, i) => (
        <g key={a.x}>
          <circle cx={a.x} cy={a.y} r="12" fill={SURFACE} stroke={i === 0 ? "#8fa6c8" : "#3a4556"} strokeWidth="2" />
          <circle cx={a.x} cy={a.y} r="3.5" fill={i === 0 ? "#8fa6c8" : "#4b586b"} />
        </g>
      ))}
      <rect x="187" y="120" width="26" height="26" rx="6" transform="rotate(45 200 133)" fill="#28405f" stroke="#cdd8e6" strokeOpacity="0.6" />
      <rect x="292" y="30" width="86" height="190" rx="10" fill={SURFACE} stroke={LINE} />
      <text x="302" y="50" fill={MIST} fontSize="7" letterSpacing="1.2" fontFamily={MONO}>EVIDENCIA</text>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <path d={`M302 ${68 + i * 30}l3 3 6-6`} stroke={i < 3 ? "#8fa6c8" : "#3a4556"} strokeWidth="1.5" />
          <rect x="318" y={64 + i * 30} width={[46, 38, 50, 30, 42][i]} height="4" rx="2" fill="#2a313c" />
          <rect x="318" y={72 + i * 30} width="28" height="3" rx="1.5" fill="#232a35" />
        </g>
      ))}
    </Frame>
  );
}

function Commerce() {
  return (
    <Frame>
      <rect x="30" y="30" width="340" height="190" rx="12" fill={SURFACE} stroke={LINE} />
      <path d="M30 58H370" stroke={LINE} />
      <rect x="44" y="40" width="44" height="8" rx="4" fill={BONE} fillOpacity="0.7" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={250 + i * 34} y="41" width="26" height="6" rx="3" fill="#2a313c" />
      ))}
      <rect x="44" y="72" width="150" height="134" rx="10" fill={SURFACE_UP} />
      <ellipse cx="119" cy="160" rx="50" ry="8" fill="#000" fillOpacity="0.35" />
      <path d="M78 146c0-30 18-48 41-48s41 18 41 48z" fill="#232a35" stroke="rgba(200,173,118,0.45)" />
      <path d="M78 146c-6 0-12 4-12 8h84" stroke="rgba(200,173,118,0.45)" fill="none" />
      <path d="M119 98v48M99 104c4 14 4 30 2 42M139 104c-4 14-4 30-2 42" stroke={GOLD} strokeOpacity="0.25" />
      <circle cx="119" cy="97" r="3" fill={GOLD} />
      <rect x="210" y="76" width="100" height="6" rx="3" fill={BONE} fillOpacity="0.8" />
      <rect x="210" y="90" width="70" height="4" rx="2" fill="#2a313c" />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={216 + i * 18} cy="116" r="6" fill={["#c8ad76", "#3a424e", "#5b4d36", "#232a35"][i]} stroke={i === 0 ? BONE : "transparent"} strokeOpacity="0.6" />
      ))}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={210 + i * 34} y="136" width="28" height="18" rx="5" fill="#0c0f13" stroke={i === 1 ? "rgba(200,173,118,0.5)" : LINE} />
      ))}
      <rect x="210" y="172" width="146" height="30" rx="15" fill={GOLD} fillOpacity="0.85" />
      <rect x="258" y="185" width="50" height="4" rx="2" fill="#07090c" fillOpacity="0.7" />
    </Frame>
  );
}

function Archive() {
  return (
    <Frame>
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={70 + i * 14}
          y={60 - i * 12}
          width="150"
          height="160"
          rx="10"
          fill={i === 2 ? SURFACE_UP : SURFACE}
          stroke={i === 2 ? "rgba(200,173,118,0.4)" : LINE}
        />
      ))}
      <rect x="112" y="52" width="66" height="44" rx="6" fill={GOLD} fillOpacity="0.12" />
      <path d="M120 88l14-14 10 8 12-12 14 18" stroke={GOLD} strokeWidth="1.4" />
      <rect x="112" y="108" width="110" height="5" rx="2.5" fill={BONE} fillOpacity="0.7" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x="112" y={122 + i * 11} width={[118, 104, 112, 86, 64][i]} height="3.5" rx="1.75" fill="#2a313c" />
      ))}
      <g>
        <path d="M262 50V210" stroke={LINE} />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <circle cx="262" cy={62 + i * 34} r={i === 2 ? 5 : 3.5} fill={i === 2 ? GOLD : "#3a424e"} />
            <text x="276" y={65 + i * 34} fontSize="7.5" letterSpacing="1.2" fontFamily={MONO} fill={i === 2 ? GOLD : MIST} fillOpacity={i === 2 ? 1 : 0.7}>
              {["COLECCIÓN", "HISTORIAS", "DOCUMENTOS", "MEMORIA", "ÍNDICE"][i]}
            </text>
          </g>
        ))}
      </g>
    </Frame>
  );
}

const visuals: Record<ProjectVisualKind, () => React.JSX.Element> = {
  "industrial-map": IndustrialMap,
  conversations: Conversations,
  portfolio: Portfolio,
  orchestration: Orchestration,
  commerce: Commerce,
  archive: Archive,
};

export function ProjectVisual({ kind }: { kind: ProjectVisualKind }) {
  const Visual = visuals[kind];
  return <Visual />;
}

export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#141922_0%,#07090c_62%)]" />
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(75%_65%_at_60%_35%,black,transparent)] opacity-70" />
      <div className="absolute -top-[18%] left-[38%] h-[70vmax] w-[70vmax] animate-drift rounded-full bg-[radial-gradient(closest-side,rgb(184_154_98/0.16),transparent)] will-change-transform" />
      <div className="absolute top-[30%] -left-[20%] h-[55vmax] w-[55vmax] animate-drift-slow rounded-full bg-[radial-gradient(closest-side,rgb(90_100_120/0.12),transparent)] will-change-transform" />
      <div className="hero-spotlight absolute inset-0 hidden opacity-0 transition-opacity duration-700 [@media(pointer:fine)]:block" />
      <svg
        className="absolute inset-0 h-full w-full opacity-60"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="hero-line" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#c8ad76" stopOpacity="0" />
            <stop offset="0.5" stopColor="#c8ad76" stopOpacity="0.55" />
            <stop offset="1" stopColor="#c8ad76" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M-40 640 C 320 600, 520 720, 820 610 S 1260 470, 1480 520" stroke="url(#hero-line)" strokeWidth="1" />
        <path
          d="M-40 640 C 320 600, 520 720, 820 610 S 1260 470, 1480 520"
          stroke="#c8ad76"
          strokeOpacity="0.5"
          strokeWidth="1.2"
          strokeDasharray="2 238"
          className="animate-dash"
        />
        <path d="M-40 760 C 380 700, 640 820, 980 720 S 1300 640, 1480 680" stroke="url(#hero-line)" strokeOpacity="0.5" strokeWidth="1" />
        <path
          d="M-40 760 C 380 700, 640 820, 980 720 S 1300 640, 1480 680"
          stroke="#c8ad76"
          strokeOpacity="0.4"
          strokeWidth="1.2"
          strokeDasharray="2 238"
          className="animate-dash [animation-delay:-4s]"
        />
        {[
          [212, 618],
          [820, 610],
          [1180, 506],
          [640, 766],
        ].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="7" fill="#c8ad76" fillOpacity="0.08" className="animate-pulse-soft" />
            <circle cx={cx} cy={cy} r="2" fill="#c8ad76" fillOpacity="0.8" />
          </g>
        ))}
      </svg>
      <div className="bg-noise absolute inset-0 opacity-[0.035] mix-blend-overlay" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-ink-950" />
    </div>
  );
}

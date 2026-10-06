"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Mode } from "@/data/ports";
import { craneEase } from "@/lib/motion";

/** Illustrated scene for each transport mode. Swaps with a heavy horizontal slide. */
export default function ModeScene({ mode }: { mode: Mode }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden bg-night">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.svg
          key={mode}
          viewBox="0 0 800 450"
          className="absolute inset-0 h-full w-full"
          initial={reduce ? { opacity: 0 } : { x: "60%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { x: "-40%", opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.8, ease: craneEase }}
          aria-hidden
        >
          {mode === "ocean" && <Ocean />}
          {mode === "air" && <Air />}
          {mode === "land" && <Land />}
        </motion.svg>
      </AnimatePresence>
      {/* chart grid overlay */}
      <div className="chart-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden />
    </div>
  );
}

const Sky = ({ glow = "#a4462a" }: { glow?: string }) => (
  <>
    <defs>
      <linearGradient id={`sky-${glow}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#081520" />
        <stop offset="0.75" stopColor="#12324a" />
        <stop offset="1" stopColor={glow} stopOpacity="0.55" />
      </linearGradient>
    </defs>
    <rect width="800" height="450" fill={`url(#sky-${glow})`} />
  </>
);

function Ocean() {
  return (
    <g>
      <Sky />
      <rect y="300" width="800" height="150" fill="#0b2233" />
      <g stroke="#8c99a1" strokeOpacity="0.25" fill="none" className="anim [animation:swell_10s_linear_infinite]">
        {[320, 350, 385, 420].map((y, i) => (
          <path key={y} d={`M0 ${y} ${Array.from({ length: 6 }).map(() => "q50 -6 100 0 t100 0").join(" ")}`} strokeWidth={1 + i * 0.4} />
        ))}
      </g>
      {/* quay & crane */}
      <rect x="560" y="290" width="240" height="160" fill="#07131c" />
      <rect x="560" y="290" width="240" height="4" fill="#f2c230" opacity="0.7" />
      <g fill="#1d3446">
        <rect x="620" y="110" width="10" height="180" />
        <rect x="720" y="110" width="10" height="180" />
        <rect x="380" y="100" width="420" height="14" />
        <rect x="640" y="70" width="60" height="30" />
      </g>
      <circle cx="384" cy="107" r="3" fill="#ff5a1f" className="anim [animation:beacon_2s_infinite]" />
      <line x1="470" y1="114" x2="470" y2="196" stroke="#b9c3c9" strokeWidth="1.5" />
      <rect x="430" y="196" width="80" height="28" fill="#ff5a1f" />
      <text x="470" y="215" textAnchor="middle" fontFamily="var(--font-stencil)" fontSize="12" fill="#0a1a26">TAS FCL</text>
      {/* vessel */}
      <g className="anim" style={{ animation: "bob 6s ease-in-out infinite" }}>
        <path d="M60 272 L540 272 L520 330 L84 330 Z" fill="#0a1723" />
        <rect x="60" y="270" width="480" height="5" fill="#a4462a" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={110 + i * 80} y="226" width="76" height="44" fill={["#12324a", "#7c3320", "#4a5a66", "#1a4260"][i]} stroke="#0a1a26" strokeWidth="2" />
            <rect x={110 + i * 80} y="182" width="76" height="44" fill={["#a4462a", "#12324a", "#1a4260", "#7c3320"][i]} stroke="#0a1a26" strokeWidth="2" opacity={i === 2 ? 0 : 1} />
          </g>
        ))}
        <rect x="450" y="190" width="56" height="80" fill="#0e1f2d" />
        <rect x="458" y="200" width="40" height="6" fill="#f2c230" opacity="0.6" />
        <g stroke="#eef1f0" strokeOpacity="0.6" strokeWidth="2">
          <line x1="90" y1="290" x2="104" y2="290" />
          <line x1="90" y1="302" x2="100" y2="302" />
          <line x1="90" y1="314" x2="104" y2="314" />
        </g>
      </g>
      <Tag x={24} y={28} text="PENANG PORT · BERTH OPS" />
      <Tag x={24} y={52} text="FCL · LCL · DG · PROJECT" dim />
    </g>
  );
}

function Air() {
  return (
    <g>
      <Sky glow="#f2c230" />
      {/* runway */}
      <path d="M0 380 L800 330 L800 450 L0 450Z" fill="#0b1a26" />
      <g stroke="#eef1f0" strokeOpacity="0.5" strokeWidth="3" strokeDasharray="30 26">
        <line x1="0" y1="420" x2="800" y2="385" />
      </g>
      {/* terminal / hub */}
      <rect x="40" y="300" width="300" height="70" fill="#0e2232" />
      <path d="M40 300 L190 270 L340 300Z" fill="#12324a" />
      <text x="190" y="342" textAnchor="middle" fontFamily="var(--font-stencil)" fontSize="15" fill="#8c99a1" letterSpacing="3">KLIA CARGO</text>
      {/* ULDs */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${380 + i * 54} 382 l44 0 l0 -30 l-10 -12 l-34 0 z`} fill={i === 1 ? "#ff5a1f" : "#4a5a66"} stroke="#0a1a26" strokeWidth="2" />
      ))}
      {/* plane */}
      <g className="anim" style={{ animation: "climb 9s cubic-bezier(.45,0,.55,1) infinite" }}>
        <g transform="translate(470 170) rotate(-8)">
          <path d="M-210 0 C-200 -18 -170 -24 -120 -24 L170 -24 C200 -24 222 -12 230 0 C222 12 200 20 170 20 L-120 20 C-170 20 -200 14 -210 0Z" fill="#d9dfdd" />
          <path d="M-20 -6 L-90 -98 L-62 -98 L60 -6Z" fill="#b9c3c9" />
          <path d="M-20 10 L-70 74 L-48 74 L40 10Z" fill="#8c99a1" />
          <path d="M-150 -22 L-196 -88 L-176 -88 L-110 -22Z" fill="#ff5a1f" />
          <rect x="-150" y="-12" width="250" height="3" fill="#0a1a26" opacity="0.5" />
          <text x="-60" y="10" fontFamily="var(--font-mono)" fontSize="11" fill="#0a1a26">AIR CARGO</text>
          <path d="M196 -12 L214 -12 L222 -4 L196 -4Z" fill="#0a1a26" />
        </g>
      </g>
      <Tag x={24} y={28} text="KLIA · CAINIAO AEROPOLIS eWTP HUB" />
      <Tag x={24} y={52} text="AIR · COURIER · HAND-CARRY" dim />
    </g>
  );
}

function Land() {
  return (
    <g>
      <Sky />
      {/* hills */}
      <path d="M0 290 C120 250 220 270 320 250 C420 230 520 262 620 246 C700 236 760 250 800 244 L800 320 L0 320Z" fill="#0f2738" />
      {/* road */}
      <rect y="320" width="800" height="130" fill="#0b1824" />
      <g className="anim [animation:road_1.2s_linear_infinite]">
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={i * 80 - 80} y="382" width="44" height="5" fill="#f2c230" opacity="0.85" />
        ))}
      </g>
      {/* gantry sign */}
      <g>
        <rect x="560" y="140" width="8" height="180" fill="#1d3446" />
        <rect x="760" y="140" width="8" height="180" fill="#1d3446" />
        <rect x="540" y="120" width="250" height="70" fill="#0e5a3a" stroke="#eef1f0" strokeWidth="2" />
        <text x="560" y="150" fontFamily="var(--font-display)" fontWeight="700" fontSize="20" fill="#eef1f0">JOHOR BAHRU</text>
        <text x="560" y="176" fontFamily="var(--font-display)" fontWeight="700" fontSize="20" fill="#eef1f0">SINGAPORE ↑</text>
        <text x="700" y="176" fontFamily="var(--font-mono)" fontSize="11" fill="#eef1f0">E2</text>
      </g>
      {/* truck */}
      <g transform="translate(110 236)">
        <rect x="0" y="0" width="300" height="96" fill="#a4462a" stroke="#0a1a26" strokeWidth="3" />
        {Array.from({ length: 14 }).map((_, i) => (
          <rect key={i} x={10 + i * 21} y="6" width="6" height="84" fill="#000" opacity="0.15" />
        ))}
        <text x="150" y="58" textAnchor="middle" fontFamily="var(--font-stencil)" fontSize="26" fill="#0a1a26" letterSpacing="2">BEXXBAY</text>
        <path d="M306 20 L370 20 L398 56 L398 104 L306 104Z" fill="#eef1f0" stroke="#0a1a26" strokeWidth="3" />
        <path d="M318 30 L364 30 L384 56 L318 56Z" fill="#12324a" />
        <rect x="-4" y="96" width="406" height="10" fill="#0a1a26" />
        {[40, 80, 250, 290, 360].map((x) => (
          <g key={x}>
            <circle cx={x} cy="110" r="17" fill="#0a1a26" />
            <circle cx={x} cy="110" r="7" fill="#4a5a66" />
          </g>
        ))}
        <rect x="392" y="80" width="10" height="8" fill="#f2c230" className="anim [animation:beacon_1.6s_infinite]" />
      </g>
      <Tag x={24} y={28} text="NORTH–SOUTH RUN · PENANG → SINGAPORE" />
      <Tag x={24} y={52} text="BONDED · FTL · LTL" dim />
    </g>
  );
}

function Tag({ x, y, text, dim = false }: { x: number; y: number; text: string; dim?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="-14" width={text.length * 7.3 + 18} height="20" fill="#0a1a26" opacity="0.8" />
      <rect x="0" y="-14" width="3" height="20" fill={dim ? "#8c99a1" : "#ff5a1f"} />
      <text x="11" y="0" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1" fill={dim ? "#8c99a1" : "#eef1f0"}>
        {text}
      </text>
    </g>
  );
}

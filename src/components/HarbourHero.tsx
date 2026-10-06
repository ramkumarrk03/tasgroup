"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { usePauseOffscreen, usePrefersReducedMotion } from "@/lib/hooks";

// Scene coordinates (viewBox 1600 × 900)
const BOOM_Y = 262;
const START_X = 774; // over the moored vessel
const END_X = 1418; // over the container stack
const DECK_Y = 700;
const BOX_W = 168;
const BOX_H = 58;
const PICK_Y = 610 - BOX_H; // top of box sitting on the vessel deck
const LAND_Y = DECK_Y - BOX_H * 3; // lands on a two-high stack
const HOIST_Y = 380;

export default function HarbourHero() {
  const root = useRef<HTMLElement>(null);
  const trolley = useRef<SVGGElement>(null);
  const cable = useRef<SVGGElement>(null);
  const spreader = useRef<SVGGElement>(null);
  const box = useRef<SVGGElement>(null);
  const stencilMask = useRef<SVGRectElement>(null);
  const reduce = usePrefersReducedMotion();
  usePauseOffscreen(root);

  useEffect(() => {
    const s = { x: START_X, sy: PICK_Y, by: PICK_Y };
    const apply = () => {
      trolley.current?.setAttribute("transform", `translate(${s.x} ${BOOM_Y})`);
      spreader.current?.setAttribute("transform", `translate(${s.x} ${s.sy})`);
      box.current?.setAttribute("transform", `translate(${s.x - BOX_W / 2} ${s.by})`);
      const len = Math.max(0, s.sy - BOOM_Y - 14);
      cable.current?.setAttribute("transform", `translate(${s.x} ${BOOM_Y + 14}) scale(1 ${len / 100})`);
    };

    if (reduce) {
      s.x = END_X;
      s.by = LAND_Y;
      s.sy = HOIST_Y;
      apply();
      stencilMask.current?.setAttribute("width", String(BOX_W));
      root.current?.querySelectorAll<HTMLElement>("[data-hero-line]").forEach((el) => (el.style.transform = "none"));
      return;
    }

    apply();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.35, onUpdate: apply });
      tl.from("[data-hero-line]", { yPercent: 105, duration: 1.1, ease: "power4.out", stagger: 0.12 }, 0)
        .from("[data-hero-fade]", { opacity: 0, y: 24, duration: 0.9, ease: "power3.out", stagger: 0.08 }, 0.55)
        // hoist off the vessel: slow take-up, firm
        .to(s, { sy: HOIST_Y, by: HOIST_Y, duration: 1.5, ease: "power2.inOut" }, 0.4)
        // trolley travels along the boom
        .to(s, { x: END_X, duration: 2.2, ease: "power3.inOut" }, 1.6)
        // lower onto the stack: decelerates hard, firm stop
        .to(s, { sy: LAND_Y, by: LAND_Y, duration: 1.6, ease: "power3.inOut" }, 3.5)
        // landing thud
        .to("[data-hero-scene]", { y: 2, duration: 0.07, ease: "power1.in", yoyo: true, repeat: 1 }, 5.1)
        .to(stencilMask.current, { attr: { width: BOX_W }, duration: 0.9, ease: "steps(8)" }, 5.25)
        // release and hoist the spreader clear
        .to(s, { sy: HOIST_Y + 40, duration: 1.4, ease: "power2.inOut" }, 5.6)
        .from("[data-hero-landed]", { opacity: 0, duration: 0.4 }, 5.2);
    }, root);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-night"
    >
      {/* Scene */}
      <svg
        data-hero-scene
        className="absolute inset-x-0 bottom-0 -z-10 h-[58%] w-full md:inset-0 md:h-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMaxYMax slice"
        aria-hidden
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#06121c" />
            <stop offset="0.55" stopColor="#0d283b" />
            <stop offset="0.8" stopColor="#1b3b52" />
            <stop offset="1" stopColor="#2a4252" />
          </linearGradient>
          <radialGradient id="dawn" cx="0.28" cy="0.7" r="0.55">
            <stop offset="0" stopColor="#ff5a1f" stopOpacity="0.38" />
            <stop offset="0.45" stopColor="#a4462a" stopOpacity="0.14" />
            <stop offset="1" stopColor="#a4462a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#163a52" />
            <stop offset="1" stopColor="#081824" />
          </linearGradient>
          <pattern id="ribs" width="9" height="10" patternUnits="userSpaceOnUse">
            <rect width="4" height="10" fill="#000" opacity="0.18" />
          </pattern>
          <pattern id="lattice" width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M0 0L22 22M22 0L0 22" stroke="#2e4a5f" strokeWidth="1.4" />
          </pattern>
          <linearGradient id="top-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0a1a26" />
            <stop offset="1" stopColor="#0a1a26" stopOpacity="0" />
          </linearGradient>
          <clipPath id="stencil-clip">
            <rect ref={stencilMask} x="0" y="0" width="0" height={BOX_H} />
          </clipPath>
        </defs>

        <rect width="1600" height="900" fill="url(#sky)" />
        <rect width="1600" height="900" fill="url(#dawn)" />
        <rect width="1600" height="260" fill="url(#top-fade)" />

        {/* Chart grid & coordinates */}
        <g stroke="#8c99a1" strokeOpacity="0.08">
          {Array.from({ length: 17 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="900" />
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 100} x2="1600" y2={i * 100} />
          ))}
        </g>

        {/* Penang island ridge across the channel */}
        <path
          d="M0 598 C90 560 160 548 240 560 C320 520 380 470 470 486 C540 498 590 540 660 548 C720 556 780 572 860 580 C960 590 1040 586 1120 594 L1600 600 L1600 620 L0 620Z"
          fill="#102a3c"
        />
        <path d="M0 606 C200 596 400 600 640 594 C900 590 1200 600 1600 604 L1600 620 L0 620Z" fill="#0c2131" />
        {/* lights on the far shore */}
        <g fill="#f2c230">
          {[120, 180, 260, 330, 405, 520, 610, 690, 760, 905, 980].map((x, i) => (
            <rect key={x} x={x} y={600 - (i % 3)} width="2" height="2" opacity={0.35 + (i % 3) * 0.2} />
          ))}
        </g>
        {/* Lighthouse beacon */}
        <g transform="translate(470 486)">
          <rect x="-3" y="-26" width="6" height="26" fill="#0c2131" />
          <circle cy="-28" r="3" fill="#f2c230" className="anim [animation:beacon_4s_infinite]" />
          <circle cy="-28" r="16" fill="#f2c230" opacity="0.15" className="anim [animation:beacon_4s_infinite]" />
        </g>

        {/* Water */}
        <rect y="612" width="1600" height="288" fill="url(#sea)" />
        <g className="anim [animation:swell_14s_linear_infinite]" stroke="#8c99a1" strokeOpacity="0.22" fill="none">
          {Array.from({ length: 7 }).map((_, i) => (
            <path
              key={i}
              d={`M0 ${640 + i * 34} ${Array.from({ length: 10 })
                .map((__, k) => `q50 ${-6 - i} 100 0 t100 0`)
                .join(" ")}`}
              strokeWidth={1 + i * 0.25}
              transform={`translate(${(i % 2) * -60} 0)`}
            />
          ))}
        </g>

        {/* Distant vessel gliding across the channel */}
        <g className="anim" style={{ animation: "drift 120s linear infinite" }}>
          <g transform="translate(0 594) scale(0.55)">
            <path d="M0 20 L250 20 L236 44 L14 44 Z" fill="#0b1e2c" />
            <rect x="24" y="-6" width="180" height="26" fill="#13324a" />
            <rect x="200" y="-30" width="30" height="50" fill="#0b1e2c" />
            <circle cx="214" cy="-36" r="3" fill="#ff5a1f" className="[animation:beacon_2.6s_infinite]" />
          </g>
        </g>

        {/* TAS tug */}
        <g className="anim" style={{ animation: "drift 70s linear -30s infinite" }}>
          <g transform="translate(0 668) scale(0.9)">
            <path d="M0 18 L92 18 Q96 30 82 36 L10 36 Q0 30 0 18Z" fill="#a4462a" />
            <rect x="0" y="16" width="92" height="4" fill="#0a1a26" />
            <rect x="34" y="-4" width="34" height="20" fill="#eef1f0" />
            <rect x="40" y="-16" width="16" height="12" fill="#eef1f0" />
            <rect x="38" y="2" width="28" height="5" fill="#0a1a26" opacity="0.8" />
            <text x="14" y="31" fontFamily="var(--font-mono)" fontSize="7" fill="#eef1f0">TAS MARINE</text>
          </g>
        </g>

        {/* Moored vessel alongside the quay (a calling ship being worked) */}
        <g transform="translate(560 560)">
          <path d="M0 50 L420 50 L400 96 L22 96 Z" fill="#0a1723" />
          <rect x="0" y="48" width="420" height="5" fill="#a4462a" />
          {/* Plimsoll / draft marks */}
          <g stroke="#eef1f0" strokeOpacity="0.55" strokeWidth="2">
            <line x1="40" y1="60" x2="52" y2="60" />
            <line x1="40" y1="70" x2="48" y2="70" />
            <line x1="40" y1="80" x2="52" y2="80" />
          </g>
          {/* deck cargo */}
          <rect x="20" y="-8" width="90" height="58" fill="#12324a" />
          <rect x="20" y="-8" width="90" height="58" fill="url(#ribs)" />
          <rect x="20" y="-66" width="90" height="58" fill="#4a5a66" />
          <rect x="20" y="-66" width="90" height="58" fill="url(#ribs)" />
          <rect x="304" y="-8" width="64" height="58" fill="#5b2a1c" />
          <rect x="304" y="-8" width="64" height="58" fill="url(#ribs)" />
          <rect x="372" y="-56" width="40" height="106" fill="#0e1f2d" />
          <rect x="378" y="-48" width="28" height="6" fill="#f2c230" opacity="0.6" />
        </g>

        {/* Quay */}
        <rect x="900" y={DECK_Y} width="700" height="200" fill="#07131c" />
        <rect x="900" y={DECK_Y} width="700" height="6" fill="#8c99a1" opacity="0.45" />
        <g fill="#f2c230">
          {Array.from({ length: 14 }).map((_, i) => (
            <rect key={i} x={906 + i * 50} y={DECK_Y + 6} width="25" height="4" opacity="0.8" />
          ))}
        </g>
        {/* fenders */}
        {[930, 1010, 1090].map((x) => (
          <rect key={x} x={x} y={DECK_Y + 14} width="22" height="40" rx="4" fill="#0f0f0f" />
        ))}
        <text x="1160" y={DECK_Y + 60} fontFamily="var(--font-stencil)" fontSize="26" fill="#8c99a1" opacity="0.35" letterSpacing="4">
          BERTH 06 · BUTTERWORTH
        </text>

        {/* Container stack */}
        {[
          [1336, 0, "#12324a"],
          [1336, 1, "#7c3320"],
          [1504, 0, "#a4462a"],
          [1504, 1, "#1a4260"],
          [1504, 2, "#4a5a66"],
          [1168, 0, "#4a5a66"],
        ].map(([x, lvl, c]) => (
          <g key={`${x}-${lvl}`} transform={`translate(${x} ${DECK_Y - BOX_H * ((lvl as number) + 1)})`}>
            <rect width={BOX_W} height={BOX_H} fill={c as string} stroke="#06121b" strokeWidth="2" />
            <rect width={BOX_W} height={BOX_H} fill="url(#ribs)" />
          </g>
        ))}

        {/* Crane */}
        <g fill="#1d3446">
          {/* legs */}
          <path d="M1092 700 L1112 700 L1128 300 L1108 300 Z" />
          <path d="M1296 700 L1316 700 L1300 300 L1280 300 Z" />
          <rect x="1092" y="470" width="224" height="16" />
          <rect x="1092" y="470" width="224" height="16" fill="url(#lattice)" />
          {/* portal beam */}
          <rect x="1100" y="290" width="210" height="22" />
          {/* machinery house */}
          <rect x="1150" y="214" width="150" height="58" fill="#24405a" />
          <rect x="1162" y="226" width="40" height="10" fill="#f2c230" opacity="0.5" />
          {/* apex */}
          <path d="M1180 214 L1214 120 L1232 120 L1266 214Z" />
          {/* boom */}
          <rect x="700" y={BOOM_Y - 12} width="900" height="24" />
          <rect x="700" y={BOOM_Y - 12} width="900" height="24" fill="url(#lattice)" />
          {/* stays */}
          <line x1="1223" y1="122" x2="720" y2={BOOM_Y - 12} stroke="#1d3446" strokeWidth="4" />
          <line x1="1223" y1="122" x2="940" y2={BOOM_Y - 12} stroke="#1d3446" strokeWidth="3" />
          <line x1="1223" y1="122" x2="1580" y2={BOOM_Y - 12} stroke="#1d3446" strokeWidth="4" />
          {/* operator cab */}
        </g>
        <rect x="700" y={BOOM_Y + 10} width="900" height="3" fill="#ff5a1f" opacity="0.7" />
        <circle cx="1223" cy="118" r="4" fill="#ff5a1f" className="anim [animation:beacon_2s_infinite]" />
        <circle cx="704" cy={BOOM_Y} r="3.5" fill="#ff5a1f" className="anim [animation:beacon_2s_-1s_infinite]" />
        <text x="1178" y="260" fontFamily="var(--font-stencil)" fontSize="18" fill="#eef1f0" opacity="0.75">
          TAS-06
        </text>

        {/* Trolley, cable, spreader, container */}
        <g ref={trolley} transform={`translate(${START_X} ${BOOM_Y})`}>
          <rect x="-26" y="-6" width="52" height="22" fill="#0a1a26" stroke="#8c99a1" strokeOpacity="0.5" />
          <rect x="-20" y="10" width="40" height="5" fill="#ff5a1f" />
        </g>
        <g ref={cable} transform={`translate(${START_X} ${BOOM_Y + 14}) scale(1 2.8)`}>
          <line x1="-9" y1="0" x2="-9" y2="100" stroke="#b9c3c9" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <line x1="9" y1="0" x2="9" y2="100" stroke="#b9c3c9" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </g>
        <g ref={box} transform={`translate(${START_X - BOX_W / 2} ${PICK_Y})`}>
          <rect width={BOX_W} height={BOX_H} fill="#ff5a1f" stroke="#7c3320" strokeWidth="2" />
          <rect width={BOX_W} height={BOX_H} fill="url(#ribs)" />
          {/* corner castings */}
          {[
            [0, 0],
            [BOX_W - 8, 0],
            [0, BOX_H - 8],
            [BOX_W - 8, BOX_H - 8],
          ].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" fill="#7c3320" />
          ))}
          <g clipPath="url(#stencil-clip)">
            <text
              x={BOX_W / 2}
              y={BOX_H / 2 + 7}
              textAnchor="middle"
              fontFamily="var(--font-stencil)"
              fontSize="20"
              fill="#0a1a26"
              letterSpacing="1"
            >
              TAS · EST. 1978
            </text>
          </g>
          <text x="10" y="16" fontFamily="var(--font-mono)" fontSize="7" fill="#0a1a26" opacity="0.7">
            TASU 197801 · 45G1
          </text>
        </g>
        <g ref={spreader} transform={`translate(${START_X} ${PICK_Y})`}>
          <rect x={-BOX_W / 2 - 4} y="-10" width={BOX_W + 8} height="10" fill="#f2c230" />
          <rect x="-16" y="-20" width="32" height="10" fill="#0a1a26" />
        </g>

        {/* AIS targets drifting on the chart */}
        <g fontFamily="var(--font-mono)" fontSize="11" fill="#8c99a1">
          {[
            { y: 742, d: "95s", delay: "-10s", id: "9V·FDR", c: "#8c99a1" },
            { y: 790, d: "140s", delay: "-60s", id: "9M·TUG", c: "#ff5a1f" },
            { y: 832, d: "110s", delay: "-35s", id: "AIS·BRG", c: "#8c99a1" },
          ].map((t) => (
            <g key={t.id} className="anim" style={{ animation: `drift ${t.d} linear ${t.delay} infinite` }}>
              <g transform={`translate(0 ${t.y})`}>
                <path d="M0 -6 L10 0 L0 6 Z" fill={t.c} />
                <line x1="10" y1="0" x2="40" y2="0" stroke={t.c} strokeOpacity="0.6" />
                <text x="14" y="-9">{t.id}</text>
              </g>
            </g>
          ))}
        </g>
      </svg>

      {/* Scrim for text legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,26,38,.9)_0%,rgba(10,26,38,.55)_45%,rgba(10,26,38,0)_70%),linear-gradient(90deg,rgba(10,26,38,.85)_0%,rgba(10,26,38,.4)_45%,rgba(10,26,38,0)_70%)] md:bg-[linear-gradient(90deg,rgba(10,26,38,.92)_0%,rgba(10,26,38,.55)_42%,rgba(10,26,38,0)_65%)]"
      />

      {/* Copy */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 pb-10 pt-28 sm:px-6 lg:px-10 lg:pt-36">
        <p data-hero-fade className="mono-label flex flex-wrap items-center gap-x-3 gap-y-1 text-steel">
          <span className="stencil text-sm text-orange">01</span>
          <span>Butterworth, Penang</span>
          <span aria-hidden>·</span>
          <span>05°24′N 100°21′E</span>
        </p>

        <h1 id="hero-title" className="display mt-5 text-[clamp(3.6rem,13.5vw,12.5rem)] leading-[0.82]">
          <span className="block overflow-hidden pb-[0.04em]">
            <span data-hero-line className="block">From the quay</span>
          </span>
          <span className="block overflow-hidden pb-[0.04em]">
            <span data-hero-line className="block text-orange">to the world.</span>
          </span>
        </h1>

        <p data-hero-fade className="mt-6 max-w-xl text-lg leading-relaxed text-hull/85 sm:text-xl">
          Roots in Penang&apos;s port since 1978. Today we move cargo by sea, air and land across Asia, the Middle
          East and Africa.
        </p>

        <div data-hero-fade className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/quote"
            className="group inline-flex items-center gap-3 bg-orange px-6 py-4 font-display text-lg font-bold uppercase tracking-[0.08em] text-night transition-colors hover:bg-hull"
          >
            Get an indicative quote
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="#network"
            className="inline-flex items-center gap-3 border border-hull/40 px-6 py-4 font-display text-lg font-bold uppercase tracking-[0.08em] text-hull transition-colors hover:border-orange hover:text-orange"
          >
            Explore our network <span aria-hidden>↓</span>
          </Link>
        </div>

        <div className="mt-auto flex items-end justify-between gap-6 pt-16">
          <p
            data-hero-fade
            className="mono-label border-l-2 border-orange bg-night/70 py-2 pl-3 pr-4 text-hull/80"
          >
            HQ Butterworth · 5 offices · Sea / Air / Land
          </p>
          <p data-hero-landed className="mono-label hidden text-right text-steel md:block">
            Box TASU 197801 · placed
            <br />
            Berth 06 · Crane TAS-06
          </p>
        </div>
      </div>
    </section>
  );
}

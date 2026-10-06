"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HARBOUR_HOTSPOTS } from "@/data/services";
import { liftEase } from "@/lib/motion";
import SignalFlag from "./SignalFlag";

const POS: Record<string, [number, number]> = {
  tugs: [118, 318],
  supplies: [372, 418],
  agency: [568, 150],
  stevedoring: [742, 112],
  survey: [800, 232],
  warehouse: [1010, 122],
};

const INK = "#12324a";

export default function PortOps() {
  const [active, setActive] = useState("stevedoring");
  const reduce = useReducedMotion();
  const spot = HARBOUR_HOTSPOTS.find((h) => h.id === active)!;
  const idx = HARBOUR_HOTSPOTS.findIndex((h) => h.id === active);

  return (
    <section id="port-ops" aria-labelledby="ops-title" className="relative overflow-hidden bg-hull py-24 text-night sm:py-32">
      {/* blueprint grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(18 50 74 / .07) 1px, transparent 1px), linear-gradient(to bottom, rgb(18 50 74 / .07) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="mono-label mb-5 flex items-center gap-3 text-steel-dark">
              <SignalFlag letter="P" />
              <span className="stencil text-base text-rust">05</span>
              <span className="h-px w-10 bg-current opacity-50" aria-hidden />
              Port operations · Penang
            </p>
            <h2 id="ops-title" className="display text-[clamp(2.75rem,8vw,7.5rem)]">
              What happens
              <br />
              <span className="text-rust">at the quay.</span>
            </h2>
          </div>
          <p className="max-w-md text-[17px] leading-relaxed text-night/75 lg:col-span-4 lg:justify-self-end">
            Ganu Jaya started here in 1978. TAS still works the berth with its own stevedore gangs, tugs and barges,
            ship agents and bonded sheds. Tap a numbered point to see what each one does.
          </p>
        </div>

        <div className="mt-14 grid gap-8 xl:grid-cols-12">
          {/* Diagram */}
          <div className="xl:col-span-8">
            <div className="overflow-x-auto border-2 border-night/80 bg-[#f6f8f7] [scrollbar-width:thin]">
              <div className="relative min-w-[760px]">
                <svg viewBox="0 0 1200 520" className="block h-auto w-full" role="img" aria-label="Harbour diagram with six service points: tugs and barges, vessel services, ship agency, stevedoring, survey and equipment, and warehousing.">
                  <Harbour />
                  {HARBOUR_HOTSPOTS.map((h, i) => {
                    const [x, y] = POS[h.id];
                    const on = h.id === active;
                    return (
                      <g key={h.id} transform={`translate(${x} ${y})`} className="cursor-pointer" onClick={() => setActive(h.id)}>
                        {on && !reduce && (
                          <circle r="18" fill="none" stroke="#ff5a1f" strokeWidth="2" className="origin-center [animation:ping-ring_2s_ease-out_infinite] [transform-box:fill-box]" />
                        )}
                        <circle r="17" fill={on ? "#ff5a1f" : "#0a1a26"} stroke="#f6f8f7" strokeWidth="3" />
                        <text textAnchor="middle" y="6" fontFamily="var(--font-stencil)" fontSize="17" fill={on ? "#0a1a26" : "#eef1f0"}>
                          {i + 1}
                        </text>
                        <text x="26" y="5" fontFamily="var(--font-mono)" fontSize="12" fontWeight="700" fill={INK} letterSpacing="1">
                          {h.label.toUpperCase()}
                        </text>
                      </g>
                    );
                  })}
                  {/* title block */}
                  <g transform="translate(940 450)" fontFamily="var(--font-mono)" fontSize="10" fill={INK}>
                    <rect width="250" height="62" fill="#f6f8f7" stroke={INK} strokeWidth="1.5" />
                    <line x1="0" y1="22" x2="250" y2="22" stroke={INK} />
                    <text x="10" y="15" fontWeight="700">DWG TAS-OPS-05 · PENANG PORT</text>
                    <text x="10" y="38">SECTION A–A · NOT TO SCALE</text>
                    <text x="10" y="53">DRAWN: TAS GROUP · REV 1978→</text>
                  </g>
                </svg>
              </div>
            </div>
            {/* Mobile / keyboard tabs */}
            <div role="tablist" aria-label="Port services" className="mt-4 grid grid-cols-2 gap-1 sm:grid-cols-3">
              {HARBOUR_HOTSPOTS.map((h, i) => (
                <button
                  key={h.id}
                  role="tab"
                  type="button"
                  id={`ops-tab-${h.id}`}
                  aria-selected={active === h.id}
                  aria-controls="ops-panel"
                  onClick={() => setActive(h.id)}
                  className={`flex items-center gap-2 border px-3 py-2.5 text-left font-display text-sm font-bold uppercase tracking-[0.08em] transition-colors ${
                    active === h.id ? "border-night bg-night text-hull" : "border-night/25 text-night hover:border-night"
                  }`}
                >
                  <span className={`stencil text-xs ${active === h.id ? "text-orange" : "text-rust"}`}>{String(i + 1).padStart(2, "0")}</span>
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          {/* Panel */}
          <div className="xl:col-span-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={spot.id}
                id="ops-panel"
                role="tabpanel"
                aria-labelledby={`ops-tab-${spot.id}`}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: liftEase }}
                className="relative bg-night p-6 text-hull sm:p-8"
              >
                <div className="flex items-start justify-between">
                  <span className="stencil text-6xl text-orange">{String(idx + 1).padStart(2, "0")}</span>
                  <span className="mono-label text-steel">Service point</span>
                </div>
                <h3 className="display mt-4 text-4xl">{spot.title}</h3>
                <ul className="mt-6 border-t border-steel/25">
                  {spot.items.map((it) => (
                    <li key={it} className="flex gap-3 border-b border-steel/25 py-3 text-[16px]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-orange" aria-hidden />
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { src: "/images/tug-tas-marine.webp", alt: "TAS Marine 102 tug boat at Penang Port" },
                { src: "/images/tug-barge.webp", alt: "TAS tug pushing a dry bulk barge" },
                { src: "/images/warehouse.webp", alt: "Inside a TAS bonded warehouse" },
              ].map((p) => (
                <div key={p.src} className="relative aspect-square overflow-hidden border-2 border-night">
                  <Image src={p.src} alt={p.alt} fill sizes="(min-width:1280px) 140px, 30vw" className="object-cover grayscale-[35%] contrast-[1.1] transition-[filter] duration-500 hover:grayscale-0" />
                </div>
              ))}
            </div>
            <p className="mono-label mt-2 text-steel-dark">Own fleet: tugs, barges &amp; passenger boats · Penang Port</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Line-drawn harbour cross-section. */
function Harbour() {
  return (
    <g stroke={INK} strokeWidth="2" fill="none" strokeLinejoin="round">
      {/* sea */}
      <rect x="0" y="352" width="1200" height="168" fill="#dfe8ec" stroke="none" />
      <line x1="0" y1="352" x2="900" y2="352" />
      {[380, 410, 440].map((y) => (
        <path key={y} d={`M0 ${y} ${Array.from({ length: 9 }).map(() => "q50 -5 100 0").join(" ")}`} strokeOpacity="0.3" strokeWidth="1.2" />
      ))}
      <text x="12" y="346" fontFamily="var(--font-mono)" fontSize="10" fill={INK} stroke="none">
        ▼ LWL
      </text>

      {/* quay */}
      <path d="M680 300 L1200 300 L1200 520 L680 520 Z" fill="#cfd8dc" />
      <path d="M680 300 L680 520" strokeWidth="3" />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x={688} y={312 + i * 28} width="18" height="18" fill="#0a1a26" stroke="none" opacity="0.8" />
      ))}
      <rect x="680" y="296" width="520" height="6" fill="#f2c230" stroke="none" />

      {/* moored vessel */}
      <path d="M190 272 L660 272 L640 352 L210 352 Z" fill="#f6f8f7" />
      <path d="M210 352 L640 352 L630 384 L222 384 Z" fill="#a4462a" stroke={INK} />
      <g strokeWidth="1.5">
        <line x1="230" y1="300" x2="246" y2="300" />
        <line x1="230" y1="316" x2="242" y2="316" />
        <line x1="230" y1="332" x2="246" y2="332" />
      </g>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={250 + i * 66} y="228" width="62" height="44" fill={i === 1 ? "#ff5a1f" : "#f6f8f7"} />
          <rect x={250 + i * 66} y="184" width="62" height="44" fill="#f6f8f7" />
        </g>
      ))}
      <path d="M530 272 L530 160 L620 160 L620 272" fill="#f6f8f7" />
      <rect x="540" y="172" width="70" height="14" fill="#12324a" stroke="none" />
      <line x1="575" y1="160" x2="575" y2="120" />
      <line x1="560" y1="132" x2="590" y2="132" />
      {/* mooring lines */}
      <path d="M640 280 Q670 300 700 300" strokeDasharray="4 3" />
      <path d="M200 280 Q160 300 150 330" strokeDasharray="4 3" />

      {/* tug */}
      <g transform="translate(40 310)">
        <path d="M0 22 L140 22 Q146 36 128 44 L12 44 Q0 36 0 22Z" fill="#a4462a" />
        <path d="M44 22 L44 -4 L100 -4 L100 22" fill="#f6f8f7" />
        <path d="M58 -4 L58 -20 L84 -20 L84 -4" fill="#f6f8f7" />
        <line x1="70" y1="-20" x2="70" y2="-40" />
        {[10, 30, 110, 130].map((x) => (
          <circle key={x} cx={x} cy="32" r="5" fill="#0a1a26" stroke="none" />
        ))}
      </g>

      {/* supply / bunker boat */}
      <g transform="translate(300 350)">
        <path d="M0 18 L130 18 L120 36 L8 36Z" fill="#f6f8f7" />
        <rect x="80" y="0" width="34" height="18" fill="#f6f8f7" />
        <rect x="14" y="6" width="56" height="12" fill="#12324a" stroke="none" />
        <path d="M60 6 Q60 -40 230 -60" strokeDasharray="5 4" stroke="#a4462a" />
      </g>

      {/* shore crane */}
      <g>
        <path d="M720 300 L732 120 L752 120 L764 300" fill="#f6f8f7" />
        <path d="M742 120 L620 70 M742 120 L840 104" strokeWidth="3" />
        <line x1="742" y1="120" x2="742" y2="70" />
        <line x1="742" y1="70" x2="620" y2="70" strokeWidth="1" />
        <line x1="640" y1="78" x2="640" y2="182" strokeWidth="1.5" />
        <rect x="622" y="182" width="36" height="16" fill="#f2c230" />
      </g>

      {/* forklift & gang */}
      <g transform="translate(820 252)">
        <path d="M0 0 L40 0 L48 30 L48 48 L0 48 Z" fill="#f2c230" />
        <rect x="6" y="6" width="22" height="20" fill="#f6f8f7" />
        <line x1="54" y1="-10" x2="54" y2="48" strokeWidth="3" />
        <line x1="54" y1="44" x2="78" y2="44" strokeWidth="3" />
        <circle cx="12" cy="48" r="7" fill="#0a1a26" stroke="none" />
        <circle cx="40" cy="48" r="7" fill="#0a1a26" stroke="none" />
      </g>
      {[920, 940, 960].map((x) => (
        <g key={x} transform={`translate(${x} 268)`}>
          <circle cx="0" cy="0" r="5" fill="#f2c230" />
          <line x1="0" y1="5" x2="0" y2="22" />
          <line x1="0" y1="22" x2="-5" y2="32" />
          <line x1="0" y1="22" x2="5" y2="32" />
          <line x1="-7" y1="12" x2="7" y2="12" />
        </g>
      ))}

      {/* warehouse */}
      <g>
        <path d="M980 300 L980 190 L1080 150 L1180 190 L1180 300" fill="#f6f8f7" />
        <rect x="1010" y="230" width="50" height="70" fill="#12324a" stroke="none" />
        <rect x="1100" y="230" width="50" height="70" fill="#dfe8ec" />
        {[1110, 1120, 1130, 1140].map((x) => (
          <line key={x} x1={x} y1="230" x2={x} y2="300" strokeWidth="1" />
        ))}
        <text x="1080" y="214" textAnchor="middle" fontFamily="var(--font-stencil)" fontSize="13" fill={INK} stroke="none" letterSpacing="2">
          BONDED
        </text>
        <rect x="1166" y="196" width="8" height="6" fill="#a4462a" stroke="none" />
      </g>
    </g>
  );
}

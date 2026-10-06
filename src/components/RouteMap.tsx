"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { LAND_MAIN } from "@/data/landPaths";
import { PORTS, PORT_BY_ID, REGIONS, HUB_ID, type Mode, type Region, type Port } from "@/data/ports";
import { ROUTES, PROJECTED, MODE_STYLE, project } from "@/lib/routes";
import { MAP } from "@/lib/geo";
import { haversineKm } from "@/data/quote";
import { usePauseOffscreen } from "@/lib/hooks";
import { craneEase } from "@/lib/motion";
import SectionHeader from "./SectionHeader";
import TallyCounter from "./TallyCounter";

const MODES: Mode[] = ["ocean", "air", "land"];
const COUNTRIES = new Set(PORTS.map((p) => p.country)).size;

// Graticule every 10°
const MERIDIANS = Array.from({ length: 11 }, (_, i) => 30 + i * 10);
const PARALLELS = [-10, 0, 10, 20, 30, 40];

const hubXY = PROJECTED[HUB_ID];
const ORIGIN = `${(hubXY[0] / MAP.w) * 100}% ${(hubXY[1] / MAP.h) * 100}%`;

export default function RouteMap({ standalone = false }: { standalone?: boolean }) {
  const [region, setRegion] = useState<Region | "all">("all");
  const [modes, setModes] = useState<Mode[]>(MODES);
  const [selected, setSelected] = useState<string>(HUB_ID);
  const [hovered, setHovered] = useState<string | null>(null);
  const [drawn, setDrawn] = useState(false);
  const reduce = useReducedMotion();

  const section = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  usePauseOffscreen(frame);

  // Zoom out from the Butterworth quay to the whole network as the map scrolls in
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce || standalone ? [1, 1] : [2.6, 1]);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setDrawn(true), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Mobile: start the pannable map on the eastern side (Penang & India)
  useEffect(() => {
    const s = scroller.current;
    if (s && s.scrollWidth > s.clientWidth) s.scrollLeft = (s.scrollWidth - s.clientWidth) * 0.72;
  }, []);

  const visiblePort = (p: Port) =>
    (region === "all" || p.region === region) && (p.kind === "office" || p.modes.some((m) => modes.includes(m)));

  const visiblePorts = useMemo(() => PORTS.filter(visiblePort), [region, modes]); // eslint-disable-line react-hooks/exhaustive-deps
  const visibleRoutes = useMemo(
    () => ROUTES.filter((r) => modes.includes(r.mode) && visiblePort(PORT_BY_ID[r.portId])),
    [region, modes], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const active = hovered ?? selected;
  const activePort = PORT_BY_ID[selected];

  const toggleMode = (m: Mode) =>
    setModes((cur) => (cur.includes(m) ? (cur.length > 1 ? cur.filter((x) => x !== m) : cur) : [...cur, m]));

  const countBy = (r: Region) => PORTS.filter((p) => p.region === r).length;

  return (
    <section
      ref={section}
      id="network"
      aria-labelledby="network-title"
      className={`chart-grid relative bg-night ${standalone ? "pt-28" : "py-24 sm:py-32"}`}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeader
          id="network-title"
          n="03"
          flag="N"
          kicker="Trade network"
          title={
            <>
              One quay.
              <br />
              <span className="text-orange">Dozens of ports.</span>
            </>
          }
          intro={
            <>
              Routes run out from Penang to every port in TAS&apos;s container line agency for WINWIN Lines, across the
              Indian Subcontinent, the Gulf, the Red Sea and East Africa, and back to our five offices.
            </>
          }
        />

        {/* Controls */}
        <div className="mt-12 flex flex-col gap-4 border-y border-steel/20 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Filter by region" className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:pb-0">
            {[{ id: "all" as const, short: "ALL", label: "All regions" }, ...REGIONS].map((r) => {
              const on = region === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setRegion(r.id)}
                  className={`shrink-0 border px-3.5 py-2 font-display text-sm font-bold uppercase tracking-[0.1em] transition-colors ${
                    on ? "border-orange bg-orange text-night" : "border-steel/30 text-hull/80 hover:border-hull hover:text-hull"
                  }`}
                >
                  <span className="hidden sm:inline">{r.label}</span>
                  <span className="sm:hidden">{r.short}</span>
                  {r.id !== "all" && <span className="ml-2 font-mono text-[11px] opacity-70">{countBy(r.id)}</span>}
                </button>
              );
            })}
          </div>
          <div role="group" aria-label="Filter by transport mode" className="flex gap-1">
            {MODES.map((m) => {
              const on = modes.includes(m);
              return (
                <button
                  key={m}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleMode(m)}
                  className={`flex items-center gap-2 border px-3.5 py-2 font-display text-sm font-bold uppercase tracking-[0.1em] transition-colors ${
                    on ? "border-hull/60 text-hull" : "border-steel/20 text-steel/60 line-through"
                  }`}
                >
                  <span
                    className="h-0.5 w-5"
                    style={{
                      background: on
                        ? m === "air"
                          ? `repeating-linear-gradient(90deg, ${MODE_STYLE[m].color} 0 3px, transparent 3px 6px)`
                          : MODE_STYLE[m].color
                        : "#4a5a66",
                    }}
                    aria-hidden
                  />
                  {MODE_STYLE[m].label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* Map */}
          <div ref={frame} className="relative self-start overflow-hidden border border-steel/20 bg-[#071521]">
            <div ref={scroller} className="overflow-x-auto overscroll-x-contain [scrollbar-width:thin]">
              <div className="min-w-[860px] overflow-hidden md:min-w-0">
              <motion.div style={{ scale, transformOrigin: ORIGIN }}>
                <svg viewBox={`0 0 ${MAP.w} ${MAP.h}`} className="block h-auto w-full" role="img" aria-label="Map of TAS Group routes from Penang. Use the port list for an accessible alternative.">
                  <defs>
                    <path id="land-main" d={LAND_MAIN} />
                    <radialGradient id="hub-glow">
                      <stop offset="0" stopColor="#ff5a1f" stopOpacity="0.35" />
                      <stop offset="1" stopColor="#ff5a1f" stopOpacity="0" />
                    </radialGradient>
                    <symbol id="ico-ship" viewBox="-8 -4 16 8" overflow="visible">
                      <path d="M-7 -2.5 L5 -2.5 L8 0 L5 2.5 L-7 2.5 Z" fill="#ff5a1f" />
                      <rect x="-5" y="-1.4" width="6" height="2.8" fill="#0a1a26" />
                    </symbol>
                    <symbol id="ico-plane" viewBox="-8 -8 16 16" overflow="visible">
                      <path d="M8 0 L-2 -1.2 L-5 -6 L-6.5 -6 L-4.5 -1.2 L-7 -1 L-8 -3 L-9 -3 L-8.4 0 L-9 3 L-8 3 L-7 1 L-4.5 1.2 L-6.5 6 L-5 6 L-2 1.2Z" fill="#f2c230" />
                    </symbol>
                    <symbol id="ico-truck" viewBox="-8 -4 16 8" overflow="visible">
                      <rect x="-8" y="-3" width="11" height="6" fill="#eef1f0" />
                      <path d="M3 -2 L6.5 -2 L8 0 L8 3 L3 3 Z" fill="#eef1f0" />
                    </symbol>
                  </defs>

                  {/* graticule */}
                  <g stroke="#8c99a1" strokeOpacity="0.1" strokeWidth="1">
                    {MERIDIANS.map((lon) => {
                      const [x] = project([lon, 0]);
                      return <line key={lon} x1={x} y1={0} x2={x} y2={MAP.h} />;
                    })}
                    {PARALLELS.map((lat) => {
                      const [, y] = project([60, lat]);
                      return <line key={lat} x1={0} y1={y} x2={MAP.w} y2={y} strokeOpacity={lat === 0 ? 0.25 : 0.1} strokeDasharray={lat === 0 ? "6 6" : undefined} />;
                    })}
                  </g>
                  <g fontFamily="var(--font-mono)" fontSize="10" fill="#8c99a1" fillOpacity="0.55">
                    {MERIDIANS.map((lon) => {
                      const [x] = project([lon, 0]);
                      return (
                        <text key={lon} x={x + 4} y={MAP.h - 8}>
                          {lon}°E
                        </text>
                      );
                    })}
                    {PARALLELS.map((lat) => {
                      const [, y] = project([60, lat]);
                      return (
                        <text key={lat} x={6} y={y - 4}>
                          {Math.abs(lat)}°{lat < 0 ? "S" : lat > 0 ? "N" : ""} {lat === 0 ? "EQUATOR" : ""}
                        </text>
                      );
                    })}
                  </g>

                  {/* land with depth-contour halo */}
                  <use href="#land-main" fill="none" stroke="#8c99a1" strokeOpacity="0.07" strokeWidth="14" strokeLinejoin="round" />
                  <use href="#land-main" fill="none" stroke="#8c99a1" strokeOpacity="0.1" strokeWidth="5" strokeLinejoin="round" strokeDasharray="1 4" />
                  <use href="#land-main" fill="#1c4462" stroke="#3a6a8e" strokeWidth="0.8" />

                  {/* Sea labels */}
                  <g fontFamily="var(--font-stencil)" fontSize="15" fill="#8c99a1" fillOpacity="0.35" letterSpacing="6">
                    <text x={project([64, 12])[0]} y={project([64, 12])[1]}>ARABIAN SEA</text>
                    <text x={project([85.5, 13.5])[0]} y={project([85.5, 13.5])[1]}>BAY OF BENGAL</text>
                    <text x={project([70, -5])[0]} y={project([70, -5])[1]}>INDIAN OCEAN</text>
                    <text x={project([108, 9])[0]} y={project([108, 9])[1]} fontSize="11">S. CHINA SEA</text>
                  </g>

                  {/* routes */}
                  <g fill="none" strokeLinecap="round">
                    <AnimatePresence>
                      {visibleRoutes.map((r, i) => {
                        const st = MODE_STYLE[r.mode];
                        const dim = active !== HUB_ID && active !== r.portId;
                        return (
                          <motion.path
                            key={r.id}
                            id={`route-${r.id}`}
                            d={r.d}
                            stroke={st.color}
                            strokeWidth={dim ? st.width * 0.8 : active === r.portId ? st.width * 1.9 : st.width}
                            strokeDasharray={r.mode === "air" ? st.dash : undefined}
                            initial={reduce ? { opacity: dim ? 0.25 : 0.9 } : r.mode === "air" ? { opacity: 0 } : { pathLength: 0, opacity: 0.9 }}
                            animate={
                              drawn || reduce
                                ? r.mode === "air"
                                  ? { opacity: dim ? 0.12 : 0.6 }
                                  : { pathLength: 1, opacity: dim ? 0.22 : 0.9 }
                                : undefined
                            }
                            exit={{ opacity: 0, transition: { duration: 0.25 } }}
                            transition={{
                              pathLength: { duration: reduce ? 0 : 1.4, ease: craneEase, delay: reduce ? 0 : Math.min(i * 0.035, 1.2) },
                              opacity: { duration: reduce ? 0 : 0.4, delay: r.mode === "air" && !reduce ? 0.6 + i * 0.02 : 0 },
                            }}
                          />
                        );
                      })}
                    </AnimatePresence>
                  </g>

                  {/* moving vessels / planes / trucks */}
                  {!reduce && drawn && (
                    <g>
                      {visibleRoutes
                        .filter((_, i) => i % 2 === 0 || visibleRoutes.length < 14)
                        .map((r, i) => (
                          <use key={`mv-${r.id}`} href={`#ico-${r.mode === "ocean" ? "ship" : r.mode === "air" ? "plane" : "truck"}`} width="16" height="8" x="-8" y="-4" opacity="0.95">
                            <animateMotion
                              dur={`${Math.max(6, r.length / (r.mode === "air" ? 60 : 28))}s`}
                              begin={`${1.6 + (i % 9) * 0.7}s`}
                              repeatCount="indefinite"
                              rotate="auto"
                            >
                              <mpath href={`#route-${r.id}`} />
                            </animateMotion>
                          </use>
                        ))}
                    </g>
                  )}

                  {/* hub glow */}
                  <circle cx={hubXY[0]} cy={hubXY[1]} r="60" fill="url(#hub-glow)" />

                  {/* ports */}
                  <g>
                    {visiblePorts.map((p) => {
                      const [x, y] = PROJECTED[p.id];
                      const isActive = active === p.id;
                      const isOffice = p.kind === "office";
                      const showLabel = isActive || p.id === HUB_ID;
                      return (
                        <g
                          key={p.id}
                          transform={`translate(${x} ${y})`}
                          className="cursor-pointer outline-none [&:focus-visible>circle.ring]:stroke-signal"
                          tabIndex={-1}
                          onMouseEnter={() => setHovered(p.id)}
                          onMouseLeave={() => setHovered(null)}
                          onClick={() => setSelected(p.id)}
                        >
                          <circle r="13" fill="transparent" />
                          {isOffice ? (
                            <>
                              {!reduce && (
                                <circle r="6" fill="none" stroke="#ff5a1f" strokeWidth="1.2" className="anim origin-center [animation:ping-ring_2.8s_ease-out_infinite] [transform-box:fill-box]" />
                              )}
                              <rect x="-4.5" y="-4.5" width="9" height="9" fill={isActive ? "#f2c230" : "#ff5a1f"} stroke="#0a1a26" strokeWidth="1.5" transform="rotate(45)" />
                            </>
                          ) : (
                            <>
                              <circle r={isActive ? 6 : 3.6} fill={isActive ? "#f2c230" : "#0a1a26"} stroke={p.kind === "inland" ? "#eef1f0" : "#ff5a1f"} strokeWidth="1.6" />
                            </>
                          )}
                          {showLabel && (
                            <g pointerEvents="none">
                              <rect x="10" y="-22" width={p.code.length * 7.6 + 12} height="17" fill="#0a1a26" stroke={isActive ? "#f2c230" : "#ff5a1f"} strokeWidth="1" />
                              <text x="16" y="-9.5" fontFamily="var(--font-mono)" fontSize="11" fontWeight="700" fill="#eef1f0">
                                {p.code}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </g>
                </svg>
              </motion.div>
              </div>
            </div>

            {/* map overlays */}
            <div className="pointer-events-none absolute left-3 top-3 hidden flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-steel sm:flex">
              <span>Chart · TAS-NET-01</span>
              <span>Mercator · Hub MYPEN</span>
            </div>
            <p className="pointer-events-none absolute bottom-3 right-3 bg-night/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-steel md:hidden">
              ← Drag to pan →
            </p>
          </div>

          {/* Port card + list */}
          <aside aria-label="Port details" className="grid content-start gap-4 md:grid-cols-2 xl:grid-cols-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePort.id}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: craneEase }}
                className="relative border border-steel/25 bg-night-2 p-5"
                aria-live="polite"
              >
                <div className="hazard absolute inset-x-0 top-0 h-1.5 opacity-80" aria-hidden />
                <div className="mt-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="stencil text-3xl text-orange">{activePort.code}</p>
                    <p className="mt-1 font-display text-2xl font-bold uppercase leading-tight">{activePort.name}</p>
                    <p className="mono-label mt-1 text-steel">
                      {activePort.country} · {REGIONS.find((r) => r.id === activePort.region)?.label}
                    </p>
                  </div>
                  <span className="mono-label shrink-0 border border-steel/30 px-2 py-1 text-steel">
                    {activePort.kind === "office" ? "TAS office" : activePort.kind === "inland" ? "Inland" : "Agency port"}
                  </span>
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-hull/85">{activePort.role}</p>
                <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-steel/20 pt-4 font-mono text-xs">
                  <div>
                    <dt className="text-steel">MODES</dt>
                    <dd className="mt-1 flex gap-1.5 uppercase">
                      {activePort.modes.map((m) => (
                        <span key={m} style={{ color: MODE_STYLE[m].color }}>
                          {m}
                        </span>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-steel">FROM PENANG</dt>
                    <dd className="mt-1 text-hull">
                      {activePort.id === HUB_ID
                        ? "HUB"
                        : `≈ ${Math.round(haversineKm(PORT_BY_ID[HUB_ID].coords, activePort.coords) / 1.852).toLocaleString("en-MY")} nm*`}
                    </dd>
                  </div>
                </dl>
                {activePort.id !== HUB_ID && (
                  <Link
                    href={`/quote?to=${activePort.id}`}
                    className="mt-4 flex items-center justify-between bg-orange px-4 py-3 font-display text-sm font-bold uppercase tracking-[0.1em] text-night transition-colors hover:bg-hull"
                  >
                    Quote to {activePort.name.split(" (")[0]} <span aria-hidden>→</span>
                  </Link>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="border border-steel/20">
              <p className="mono-label border-b border-steel/20 px-4 py-3 text-steel">
                Port list · {visiblePorts.length} shown
              </p>
              <ul className="max-h-[300px] overflow-y-auto lg:max-h-[340px]">
                {(region === "all" ? [...REGIONS] : REGIONS.filter((r) => r.id === region)).map((r) => {
                  const list = visiblePorts.filter((p) => p.region === r.id);
                  if (!list.length) return null;
                  return (
                    <li key={r.id}>
                      <p className="sticky top-0 bg-night px-4 py-2 font-display text-xs font-bold uppercase tracking-[0.18em] text-orange">
                        {r.label}
                      </p>
                      <ul>
                        {list.map((p) => (
                          <li key={p.id}>
                            <button
                              type="button"
                              onClick={() => setSelected(p.id)}
                              onFocus={() => setHovered(p.id)}
                              onBlur={() => setHovered(null)}
                              onMouseEnter={() => setHovered(p.id)}
                              onMouseLeave={() => setHovered(null)}
                              aria-pressed={selected === p.id}
                              className={`flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm transition-colors ${
                                selected === p.id ? "bg-orange/15 text-hull" : "text-hull/80 hover:bg-deep/60"
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span className={`h-2 w-2 ${p.kind === "office" ? "rotate-45 bg-orange" : "rounded-full border border-orange"}`} aria-hidden />
                                {p.name}
                              </span>
                              <span className="font-mono text-[11px] text-steel">{p.code}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>

        {/* Tally board */}
        <div className="mt-10 grid grid-cols-2 gap-8 border-t border-steel/20 pt-8 sm:grid-cols-4">
          <TallyCounter value={PORTS.filter((p) => p.kind === "port").length} label="Agency ports" />
          <TallyCounter value={COUNTRIES} label="Countries" />
          <TallyCounter value={5} label="TAS offices" />
          <TallyCounter value={3} digits={1} label="Modes · sea / air / land" />
        </div>
        <p className="mono-label mt-6 text-steel/80">
          * Great-circle distance, for orientation only. Ports from the WINWIN Lines list on tasgroup.com.my. Air arcs
          show reach from KLIA, not scheduled flights.
        </p>
      </div>
    </section>
  );
}

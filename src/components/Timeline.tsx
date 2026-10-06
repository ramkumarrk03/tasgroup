"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { TIMELINE, type Milestone } from "@/data/timeline";
import { useMediaQuery } from "@/lib/hooks";
import { craneEase } from "@/lib/motion";
import SectionHeader from "./SectionHeader";

const COLORS = ["#a4462a", "#12324a", "#4a5a66", "#7c3320", "#1a4260", "#a4462a", "#ff5a1f"];
const BOX_W = 360;
const STEP = 250;
const BOX_H = 210;

export default function Timeline() {
  const desktop = useMediaQuery("(min-width: 1024px)");
  const reduce = useReducedMotion();
  return desktop && !reduce ? <HorizontalTimeline /> : <StackedTimeline />;
}

function Header() {
  return (
    <SectionHeader
      id="timeline-title"
      n="06"
      flag="T"
      kicker="1978 → today"
      title={
        <>
          Stacked <span className="text-orange">since 1978.</span>
        </>
      }
      intro="Each milestone is a box on the quay. The stack started with one stevedoring company in Penang and now covers sea, air and land."
    />
  );
}

function HorizontalTimeline() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const trackW = (TIMELINE.length - 1) * STEP + BOX_W + 200;
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -(trackW - 1100)]);
  const wallX = useTransform(x, (v) => v * 0.6);

  return (
    <section ref={ref} id="timeline" aria-labelledby="timeline-title" className="relative h-[280vh] bg-night">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden pt-24">
        <div className="mx-auto w-full max-w-[1440px] px-10">
          <Header />
        </div>
        <div className="relative mt-auto h-[calc(2*210px+120px)] origin-bottom [@media(max-height:820px)]:h-[calc((2*210px+120px)*.8)] [@media(max-height:820px)]:[&>ol]:scale-[.8] [&>ol]:origin-bottom-left">
          <motion.ol style={{ x }} className="absolute bottom-[96px] left-[max(2.5rem,calc((100vw-1440px)/2+2.5rem))] h-[420px]" aria-label="Milestones">
            {TIMELINE.map((m, i) => (
              <li
                key={m.code}
                className="absolute"
                style={{ left: i * STEP, bottom: i % 2 ? BOX_H : 0, width: BOX_W, height: BOX_H, zIndex: i % 2 ? 2 : 1 }}
              >
                <motion.div
                  className="h-full"
                  initial={{ y: -260, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 1.1, ease: craneEase }}
                >
                  <Box m={m} color={COLORS[i]} />
                </motion.div>
              </li>
            ))}
          </motion.ol>
          {/* quay wall */}
          <div className="absolute inset-x-0 bottom-0 h-[96px] border-t-4 border-signal bg-[#07131c]">
            <motion.div style={{ x: wallX }} className="flex h-full items-center gap-16 whitespace-nowrap pl-10 font-mono text-xs tracking-[0.2em] text-steel/60">
              {Array.from({ length: 14 }).map((_, i) => (
                <span key={i} className="flex items-center gap-3">
                  <span className="h-8 w-3 rounded-t-full bg-[#1a2a36]" aria-hidden />
                  QUAY WALL · BERTH {String(i + 1).padStart(2, "0")}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StackedTimeline() {
  const reduce = useReducedMotion();
  return (
    <section id="timeline" aria-labelledby="timeline-title" className="relative bg-night py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <Header />
        <ol className="mt-12 flex flex-col gap-3" aria-label="Milestones">
          {TIMELINE.map((m, i) => (
            <motion.li
              key={m.code}
              className="h-[210px] sm:ml-[var(--off)]"
              style={{ ["--off" as string]: `${(i % 2) * 12}%` }}
              initial={reduce ? false : { y: -60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: craneEase }}
            >
              <Box m={m} color={COLORS[i]} />
            </motion.li>
          ))}
        </ol>
        <div className="mt-3 h-6 border-t-4 border-signal bg-[#07131c]" aria-hidden />
      </div>
    </section>
  );
}

function Box({ m, color }: { m: Milestone; color: string }) {
  const light = color === "#ff5a1f";
  return (
    <article
      className="relative flex h-full max-w-[420px] flex-col overflow-hidden border-2 border-night p-5"
      style={{ background: color }}
    >
      <div className="corrugated absolute inset-0 opacity-70" aria-hidden />
      {[
        "left-0 top-0",
        "right-0 top-0",
        "bottom-0 left-0",
        "bottom-0 right-0",
      ].map((p) => (
        <span key={p} className={`absolute ${p} h-3 w-3 bg-night/70`} aria-hidden />
      ))}
      <div className={`relative flex items-start justify-between ${light ? "text-night" : "text-hull"}`}>
        <span className="stencil text-xs opacity-80">{m.code}</span>
        <span className="display text-5xl leading-none">{m.year}</span>
      </div>
      <div className={`relative mt-auto ${light ? "text-night" : "text-hull"}`}>
        <h3 className="font-display text-2xl font-extrabold uppercase leading-tight">{m.title}</h3>
        <p className={`mt-1.5 text-[14px] leading-snug ${light ? "text-night/85" : "text-hull/85"}`}>{m.text}</p>
        {m.note && <p className="mt-1 font-mono text-[10px] uppercase tracking-wider opacity-70">ⓘ {m.note}</p>}
      </div>
    </article>
  );
}

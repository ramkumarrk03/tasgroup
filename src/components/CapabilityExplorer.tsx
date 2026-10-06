"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { MODES } from "@/data/services";
import type { Mode } from "@/data/ports";
import { craneEase, liftEase } from "@/lib/motion";
import { usePauseOffscreen } from "@/lib/hooks";
import SectionHeader from "./SectionHeader";
import Telegraph from "./Telegraph";
import ModeScene from "./ModeScene";

export default function CapabilityExplorer() {
  const [mode, setMode] = useState<Mode>("ocean");
  const info = MODES.find((m) => m.id === mode)!;
  const reduce = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  usePauseOffscreen(root);

  return (
    <section ref={root} id="capabilities" aria-labelledby="cap-title" className="relative overflow-hidden bg-deep py-24 sm:py-32">
      <div className="corrugated pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <SectionHeader
          id="cap-title"
          n="04"
          flag="E"
          kicker="Capability explorer"
          title={
            <>
              Ocean. Air. <span className="text-orange">Land.</span>
            </>
          }
          intro="Pull the lever to choose a mode. Each one shows the services, licences and offices that move your cargo that way."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Control column */}
          <div className="flex flex-col gap-8 lg:col-span-4">
            <div className="border border-steel/25 bg-night/70 p-5 sm:p-6">
              <p className="mono-label mb-4 flex items-center justify-between text-steel">
                <span>Bridge · engine order</span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange [animation:beacon_2s_infinite]" aria-hidden />
                  Live
                </span>
              </p>
              <div className="flex justify-center">
                <Telegraph options={MODES} value={mode} onChange={setMode} />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-1">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id)}
                    aria-pressed={mode === m.id}
                    className={`py-2 font-display text-sm font-bold uppercase tracking-[0.12em] transition-colors ${
                      mode === m.id ? "bg-orange text-night" : "bg-deep text-hull/75 hover:text-hull"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: liftEase }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1"
              >
                <div>
                  <p className="mono-label mb-3 text-steel">Credentials</p>
                  <ul className="flex flex-wrap gap-2">
                    {info.credentials.map((c) => (
                      <li key={c} className="stencil -rotate-1 border-2 border-signal/80 px-2.5 py-1 text-xs text-signal">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mono-label mb-3 text-steel">Offices</p>
                  <ul className="flex flex-col gap-1.5">
                    {info.offices.map((o) => (
                      <li key={o} className="flex items-center gap-2 font-display text-lg font-semibold uppercase tracking-wide">
                        <span className="h-2 w-2 rotate-45 bg-orange" aria-hidden />
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Scene + content */}
          <div className="lg:col-span-8">
            <div className="relative border border-steel/25">
              <ModeScene mode={mode} />
              <AnimatePresence>
                {info.image && (
                  <motion.figure
                    key={info.image.src}
                    initial={reduce ? false : { opacity: 0, y: 30, rotate: 4 }}
                    animate={{ opacity: 1, y: 0, rotate: 2 }}
                    exit={reduce ? undefined : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.7, ease: craneEase, delay: reduce ? 0 : 0.35 }}
                    className="absolute -bottom-8 right-3 hidden w-[34%] border-[6px] border-hull bg-hull shadow-[0_20px_40px_-12px_rgba(0,0,0,.7)] sm:block"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image src={info.image.src} alt={info.image.alt} fill sizes="(min-width:1024px) 300px, 34vw" className="object-cover contrast-[1.08] saturate-[.85]" />
                    </div>
                    <figcaption className="pt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-night/70">
                      TAS operations · photo
                    </figcaption>
                  </motion.figure>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-10 grid gap-8 md:grid-cols-2"
              >
                <div>
                  <p className="stencil text-sm text-orange">{info.order}</p>
                  <h3 className="display mt-2 text-4xl sm:text-5xl">{info.headline}</h3>
                  <p className="mt-4 max-w-md text-[17px] leading-relaxed text-hull/80">{info.intro}</p>
                </div>
                <ul className="border-t border-steel/25">
                  {info.services.map((s, i) => (
                    <motion.li
                      key={s}
                      initial={reduce ? false : { opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, ease: liftEase, delay: reduce ? 0 : 0.1 + i * 0.06 }}
                      className="flex items-baseline gap-4 border-b border-steel/25 py-3"
                    >
                      <span className="font-mono text-xs text-orange">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-[17px] text-hull">{s}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            <CargoSteps key={mode} steps={info.steps} />
          </div>
        </div>
      </div>
    </section>
  );
}

function CargoSteps({ steps }: { steps: { title: string; text: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const play = inView || reduce;

  return (
    <div ref={ref} className="mt-12">
      <p className="mono-label mb-5 text-steel">How your cargo moves</p>
      <ol className="relative grid gap-6 sm:grid-cols-4 sm:gap-4">
        {/* track */}
        <div className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-steel/30 sm:left-0 sm:right-0 sm:top-[7px] sm:h-px sm:w-full" aria-hidden />
        <motion.div
          className="absolute left-[7px] top-2 hidden h-px origin-left bg-orange sm:left-0 sm:top-[7px] sm:block sm:w-full"
          initial={{ scaleX: reduce ? 1 : 0 }}
          animate={{ scaleX: play ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : 2.4, ease: craneEase, delay: 0.2 }}
          aria-hidden
        />
        {steps.map((s, i) => (
          <motion.li
            key={s.title}
            className="relative pl-8 sm:pl-0 sm:pt-8"
            initial={reduce ? false : { opacity: 0.25 }}
            animate={{ opacity: play ? 1 : 0.25 }}
            transition={{ duration: 0.4, delay: reduce ? 0 : 0.3 + i * 0.6 }}
          >
            <span className="absolute left-0 top-0 flex h-[15px] w-[15px] items-center justify-center border-2 border-orange bg-deep" aria-hidden>
              <span className="h-1.5 w-1.5 bg-orange" />
            </span>
            <span className="font-mono text-xs text-steel">STEP {String(i + 1).padStart(2, "0")}</span>
            <p className="mt-1 font-display text-2xl font-bold uppercase">{s.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-hull/75">{s.text}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

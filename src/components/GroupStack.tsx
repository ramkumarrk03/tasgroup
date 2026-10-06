"use client";

import { motion, useReducedMotion } from "framer-motion";
import { COMPANIES } from "@/data/services";
import { craneEase } from "@/lib/motion";
import SectionHeader from "./SectionHeader";

const FILLS = ["#ff5a1f", "#12324a", "#a4462a", "#1a4260", "#4a5a66", "#7c3320"];

export default function GroupStack() {
  const reduce = useReducedMotion();
  const n = COMPANIES.length;
  return (
    <section id="group" aria-labelledby="group-title" className="relative overflow-hidden bg-night-2 py-24 sm:py-32">
      <div className="chart-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-[1440px] gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-5">
          <SectionHeader
            compact
            id="group-title"
            n="07"
            flag="G"
            kicker="The group"
            title={
              <>
                Six companies.
                <br />
                <span className="text-orange">One stack.</span>
              </>
            }
          />
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-hull/75">
            TAS Management Holdings sits on top. Each company below it handles one part of the job, from Ganu
            Jaya&apos;s stevedores at the bottom of the stack to forwarding, line agency and trucking above.
          </p>
          <p className="mono-label mt-8 text-steel">Reg. nos. as listed on tasgroup.com.my</p>
        </div>

        <ol className="flex flex-col gap-1.5 lg:col-span-7" aria-label="Group companies, top of stack first">
          {COMPANIES.map((c, i) => (
            <motion.li
              key={c.id}
              initial={reduce ? false : { y: -120, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-5% 0px" }}
              // bottom of the stack lands first, like a real yard stack
              transition={{ duration: 0.9, ease: craneEase, delay: reduce ? 0 : (n - 1 - i) * 0.18 }}
            >
              <div
                tabIndex={0}
                className="group relative flex min-h-[92px] items-center gap-4 overflow-hidden border-2 border-night px-5 py-4 outline-none transition-transform duration-500 ease-[var(--ease-crane)] hover:-translate-y-1.5 focus-visible:-translate-y-1.5 focus-visible:outline-2 focus-visible:outline-signal sm:gap-6 sm:px-7"
                style={{ background: FILLS[i] }}
              >
                <div className="corrugated absolute inset-0 opacity-80" aria-hidden />
                <span className="absolute left-0 top-0 h-3 w-3 bg-night/60" aria-hidden />
                <span className="absolute right-0 top-0 h-3 w-3 bg-night/60" aria-hidden />
                <span className="absolute bottom-0 left-0 h-3 w-3 bg-night/60" aria-hidden />
                <span className="absolute bottom-0 right-0 h-3 w-3 bg-night/60" aria-hidden />

                <div className={`relative flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between ${i === 0 ? "text-night" : "text-hull"}`}>
                  <div>
                    <p className="stencil text-[clamp(1.4rem,3.4vw,2.4rem)] leading-none">{c.short}</p>
                    <p className={`mt-1.5 text-[14px] ${i === 0 ? "text-night/80" : "text-hull/80"}`}>{c.role}</p>
                  </div>
                  <dl className="flex gap-5 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.12em]">
                    <div>
                      <dt className="opacity-60">Reg.</dt>
                      <dd>{c.reg}</dd>
                    </div>
                    {c.since && (
                      <div>
                        <dt className="opacity-60">Since</dt>
                        <dd>{c.since}</dd>
                      </div>
                    )}
                  </dl>
                </div>
                <span className="sr-only">{c.name}</span>
              </div>
            </motion.li>
          ))}
          <li aria-hidden className="mt-1 h-3 border-t-4 border-signal bg-[#07131c]" />
        </ol>
      </div>
    </section>
  );
}

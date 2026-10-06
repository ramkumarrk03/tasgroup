"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/** Mechanical tally-board counter: each digit rolls on its own drum. */
export default function TallyCounter({ value, digits = 2, label }: { value: number; digits?: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const str = String(value).padStart(digits, "0");

  return (
    <div ref={ref} className="flex flex-col gap-2">
      <div className="flex gap-[3px]" aria-hidden>
        {str.split("").map((ch, i) => {
          const n = Number(ch);
          return (
            <span
              key={i}
              className="relative block h-[1.1em] w-[0.72em] overflow-hidden bg-night-2 font-mono text-4xl font-bold leading-[1.1] text-hull shadow-[inset_0_8px_10px_-6px_rgba(0,0,0,.8),inset_0_-8px_10px_-6px_rgba(0,0,0,.8)] sm:text-5xl"
            >
              <motion.span
                className="absolute inset-x-0 top-0 flex flex-col items-center"
                initial={false}
                animate={{ y: inView || reduce ? `${-n * 1.1}em` : "0em" }}
                transition={{ duration: reduce ? 0 : 1.6 + i * 0.35, ease: [0.7, 0, 0.2, 1], delay: 0.15 }}
              >
                {Array.from({ length: 10 }).map((_, k) => (
                  <span key={k} className="block h-[1.1em]">
                    {k}
                  </span>
                ))}
              </motion.span>
              <span className="absolute inset-x-0 top-1/2 h-px bg-night/80" />
            </span>
          );
        })}
      </div>
      <span className="sr-only">{value} </span>
      <span className="mono-label text-steel">{label}</span>
    </div>
  );
}

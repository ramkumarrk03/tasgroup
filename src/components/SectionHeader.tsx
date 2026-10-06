"use client";

import { motion, useReducedMotion } from "framer-motion";
import { liftEase } from "@/lib/motion";
import SignalFlag from "./SignalFlag";

type Props = {
  n: string;
  flag: string;
  kicker: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  tone?: "dark" | "light";
  id?: string;
  className?: string;
  compact?: boolean;
};

export default function SectionHeader({ n, flag, kicker, title, intro, tone = "dark", id, className = "", compact = false }: Props) {
  const reduce = useReducedMotion();
  const muted = tone === "dark" ? "text-steel" : "text-steel-dark";
  return (
    <div className={`grid gap-6 ${compact ? "" : "lg:grid-cols-12"} lg:items-end ${className}`}>
      <div className={compact ? "" : "lg:col-span-8"}>
        <div className={`mono-label mb-5 flex items-center gap-3 ${muted}`}>
          <SignalFlag letter={flag} />
          <span className="stencil text-base tracking-[0.1em] text-orange">{n}</span>
          <span className="h-px w-10 bg-current opacity-50" aria-hidden />
          <span>{kicker}</span>
        </div>
        <motion.h2
          id={id}
          className="display text-[clamp(2.75rem,8vw,7.5rem)]"
          initial={reduce ? false : { y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1, ease: liftEase }}
        >
          {title}
        </motion.h2>
      </div>
      {intro && (
        <p className={`max-w-md text-[17px] leading-relaxed lg:col-span-4 lg:justify-self-end ${tone === "dark" ? "text-hull/75" : "text-night/75"}`}>
          {intro}
        </p>
      )}
    </div>
  );
}

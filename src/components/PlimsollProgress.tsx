"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/** Draft-mark scroll indicator on the right edge: the waterline rises as you read down the page. */
export default function PlimsollProgress() {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.6 });
  const top = useTransform(p, [0, 1], ["100%", "0%"]);

  return (
    <div aria-hidden className="pointer-events-none fixed right-3 top-1/2 z-40 hidden h-[44vh] w-7 -translate-y-1/2 lg:block">
      <div className="relative h-full w-full">
        {/* draft marks every 10% */}
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className="absolute right-0 flex items-center gap-1" style={{ top: `${i * 10}%` }}>
            <span className="font-mono text-[8px] text-steel/70">{i % 2 === 0 ? 10 - i : ""}</span>
            <span className={`h-px ${i % 2 === 0 ? "w-3 bg-steel/70" : "w-2 bg-steel/40"}`} />
          </div>
        ))}
        {/* waterline */}
        <motion.div className="absolute inset-x-0 bottom-0 border-t-2 border-orange bg-orange/10" style={{ top }}>
          <span className="absolute -left-1 -top-[5px] h-2 w-2 rotate-45 bg-orange" />
        </motion.div>
      </div>
    </div>
  );
}

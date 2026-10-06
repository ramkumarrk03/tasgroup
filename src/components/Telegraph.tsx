"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Mode } from "@/data/ports";
import { craneEase } from "@/lib/motion";

type Opt = { id: Mode; label: string; order: string };

const ANGLES = [-52, 0, 52];

/** Ship's engine-order telegraph used as a three-way mode switch (radio group). */
export default function Telegraph({
  options,
  value,
  onChange,
  size = "lg",
  label = "Transport mode",
}: {
  options: Opt[];
  value: Mode;
  onChange: (m: Mode) => void;
  size?: "lg" | "sm";
  label?: string;
}) {
  const reduce = useReducedMotion();
  const idx = Math.max(0, options.findIndex((o) => o.id === value));

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let next = -1;
    if (["ArrowRight", "ArrowDown"].includes(e.key)) next = (idx + 1) % options.length;
    else if (["ArrowLeft", "ArrowUp"].includes(e.key)) next = (idx - 1 + options.length) % options.length;
    if (next < 0) return;
    e.preventDefault();
    onChange(options[next].id);
    e.currentTarget.querySelectorAll<HTMLButtonElement>("[role=radio]")[next]?.focus();
  };

  const R = 130;
  const polar = (deg: number, r: number) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return [Math.round((160 + r * Math.cos(a)) * 100) / 100, Math.round((170 + r * Math.sin(a)) * 100) / 100];
  };
  const sector = (deg: number, r0: number, r1: number) => {
    const a0 = deg - 24;
    const a1 = deg + 24;
    const [x0, y0] = polar(a0, r1);
    const [x1, y1] = polar(a1, r1);
    const [x2, y2] = polar(a1, r0);
    const [x3, y3] = polar(a0, r0);
    return `M${x0} ${y0}A${r1} ${r1} 0 0 1 ${x1} ${y1}L${x2} ${y2}A${r0} ${r0} 0 0 0 ${x3} ${y3}Z`;
  };

  return (
    <div className={size === "lg" ? "w-full max-w-[420px]" : "w-full max-w-[300px]"}>
      <div
        role="radiogroup"
        aria-label={label}
        className="relative"
        onKeyDown={onKey}
      >
        <svg viewBox="0 0 320 200" className="block w-full" aria-hidden>
          {/* housing */}
          <path d={`M${160 - R - 18} 170 A${R + 18} ${R + 18} 0 0 1 ${160 + R + 18} 170Z`} fill="#0a1a26" stroke="#8c99a1" strokeOpacity="0.5" strokeWidth="2" />
          <path d={`M${160 - R - 8} 170 A${R + 8} ${R + 8} 0 0 1 ${160 + R + 8} 170`} fill="none" stroke="#f2c230" strokeOpacity="0.35" strokeWidth="1" />
          {/* bolts */}
          {[-80, -40, 0, 40, 80].map((d) => {
            const [x, y] = polar(d, R + 12);
            return <circle key={d} cx={x} cy={y} r="2.2" fill="#8c99a1" opacity="0.6" />;
          })}
          {/* sectors */}
          {options.map((o, i) => {
            const on = i === idx;
            const [tx, ty] = polar(ANGLES[i], R - 34);
            return (
              <g key={o.id}>
                <path d={sector(ANGLES[i], 52, R - 4)} fill={on ? "#ff5a1f" : "#12324a"} stroke="#0a1a26" strokeWidth="3" style={{ transition: "fill .35s" }} />
                <text
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="var(--font-display)"
                  fontWeight="800"
                  fontSize="19"
                  letterSpacing="1.5"
                  fill={on ? "#0a1a26" : "#eef1f0"}
                  transform={`rotate(${ANGLES[i]} ${tx} ${ty})`}
                  style={{ transition: "fill .35s" }}
                >
                  {o.label.toUpperCase()}
                </text>
                <text
                  x={polar(ANGLES[i], R - 14)[0]}
                  y={polar(ANGLES[i], R - 14)[1]}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="var(--font-mono)"
                  fontSize="7.5"
                  letterSpacing="1"
                  fill={on ? "#0a1a26" : "#8c99a1"}
                  transform={`rotate(${ANGLES[i]} ${polar(ANGLES[i], R - 14)[0]} ${polar(ANGLES[i], R - 14)[1]})`}
                >
                  {o.order}
                </text>
              </g>
            );
          })}
          {/* lever */}
          <motion.g
            initial={false}
            animate={{ rotate: ANGLES[idx] }}
            transition={reduce ? { duration: 0 } : { duration: 0.7, ease: craneEase }}
            style={{ originX: "160px", originY: "170px", transformBox: "view-box" }}
          >
            <rect x="155" y="44" width="10" height="126" rx="2" fill="#d9dfdd" />
            <rect x="148" y="34" width="24" height="22" rx="3" fill="#eef1f0" stroke="#0a1a26" strokeWidth="2" />
            <rect x="152" y="40" width="16" height="3" fill="#ff5a1f" />
          </motion.g>
          <circle cx="160" cy="170" r="22" fill="#1a4260" stroke="#8c99a1" strokeWidth="2" />
          <circle cx="160" cy="170" r="7" fill="#0a1a26" />
          <rect x="10" y="170" width="300" height="30" fill="#0a1a26" />
          <text x="160" y="190" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="2" fill="#8c99a1">
            ENGINE ORDER · {options[idx].label.toUpperCase()}
          </text>
        </svg>

        {/* accessible hit targets laid over the sectors */}
        <div className="absolute inset-x-0 top-0 grid h-[78%] grid-cols-3">
          {options.map((o, i) => (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={i === idx}
              tabIndex={i === idx ? 0 : -1}
              onClick={() => onChange(o.id)}
              className="h-full w-full cursor-pointer rounded-t-full focus-visible:outline-2"
            >
              <span className="sr-only">
                {o.label} ({o.order.toLowerCase()})
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

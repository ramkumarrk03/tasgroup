"use client";

import { LAND_MAIN } from "@/data/landPaths";
import { PORT_BY_ID } from "@/data/ports";
import { PROJECTED } from "@/lib/routes";
import { arcPath } from "@/lib/geo";
import { motion, useReducedMotion } from "framer-motion";

/** Small chart that frames just the origin → destination leg. */
export default function RoutePreview({ from, to, tone = "dark", className = "" }: { from: string; to: string; tone?: "dark" | "light"; className?: string }) {
  const reduce = useReducedMotion();
  const a = PROJECTED[from];
  const b = PROJECTED[to];
  if (!a || !b) return null;

  const pad = 60;
  const minX = Math.min(a[0], b[0]) - pad;
  const minY = Math.min(a[1], b[1]) - pad;
  let w = Math.abs(a[0] - b[0]) + pad * 2;
  let h = Math.abs(a[1] - b[1]) + pad * 2;
  // keep a 2:1 frame
  const cx = minX + w / 2;
  const cy = minY + h / 2;
  if (w / h < 2) w = h * 2;
  else h = w / 2;
  const vb = `${cx - w / 2} ${cy - h / 2} ${w} ${h}`;
  const k = w / 400; // stroke scale

  const land = tone === "dark" ? "#1c4462" : "#d3dde2";
  const sea = tone === "dark" ? "#071521" : "#f3f6f5";
  const ink = tone === "dark" ? "#eef1f0" : "#0a1a26";

  return (
    <svg viewBox={vb} className={`block w-full ${className}`} role="img" aria-label={`Route preview from ${PORT_BY_ID[from].name} to ${PORT_BY_ID[to].name}`}>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} fill={sea} />
      <path d={LAND_MAIN} fill={land} stroke={tone === "dark" ? "#3a6a8e" : "#9fb0b9"} strokeWidth={0.6 * k} />
      <motion.path
        key={`${from}-${to}`}
        d={arcPath(a, b, 0.2)}
        fill="none"
        stroke="#ff5a1f"
        strokeWidth={2.4 * k}
        strokeLinecap="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduce ? 0 : 1.2, ease: [0.7, 0, 0.2, 1] }}
      />
      {[a, b].map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r={5 * k} fill={i === 0 ? "#ff5a1f" : sea} stroke="#ff5a1f" strokeWidth={2 * k} />
          <text x={p[0] + 8 * k} y={p[1] - 8 * k} fontSize={11 * k} fontFamily="var(--font-mono)" fontWeight="700" fill={ink}>
            {PORT_BY_ID[i === 0 ? from : to].code}
          </text>
        </g>
      ))}
    </svg>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CREDENTIALS, type Credential } from "@/data/services";
import SignalFlag from "./SignalFlag";

const INKS = ["#a4462a", "#12324a", "#d6461a", "#12324a", "#a4462a"];

export default function CredentialsStrip() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="cred-title" className="relative overflow-hidden bg-hull text-night">
      <div className="hazard h-2 w-full" aria-hidden />
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mono-label mb-4 flex items-center gap-3 text-steel-dark">
              <SignalFlag letter="C" />
              <span className="stencil text-base text-rust">02</span>
              <span className="h-px w-10 bg-current opacity-50" aria-hidden />
              Licences &amp; credentials
            </p>
            <h2 id="cred-title" className="display text-[clamp(2.4rem,6vw,4.75rem)]">
              Licensed on the quay.
            </h2>
          </div>
          <p className="max-w-sm text-[16px] leading-relaxed text-night/75">
            TAS holds these licences itself, so you don&apos;t need a middleman for clearance, stevedoring or line
            agency.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {CREDENTIALS.map((c, i) => (
            <li key={c.id} className="group flex flex-col items-center text-center">
              <motion.div
                initial={reduce ? false : { scale: 1.9, opacity: 0, rotate: -18 }}
                whileInView={{ scale: 1, opacity: 1, rotate: [-8, 6, -4, 5, -6][i] }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.3, ease: [0.9, 0, 0.6, 1], delay: reduce ? 0 : 0.2 + i * 0.16 }}
              >
                <Stamp c={c} ink={INKS[i]} />
              </motion.div>
              <p className="mt-3 max-w-[220px] text-sm leading-snug text-night/75 transition-opacity duration-300 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
                {c.meaning}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Stamp({ c, ink }: { c: Credential; ink: string }) {
  const id = `stamp-${c.id}`;
  return (
    <div tabIndex={0} className="outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-night" aria-label={`${c.title}, ${c.issuer}`}>
      <svg viewBox="0 0 200 200" className="h-36 w-36 sm:h-40 sm:w-40" aria-hidden>
        <defs>
          <path id={`${id}-arc`} d="M100 100 m-72 0 a72 72 0 1 1 144 0 a72 72 0 1 1 -144 0" />
          <filter id={`${id}-ink`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={c.id.length} />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 1.5" />
            <feComposite in="SourceGraphic" operator="in" />
          </filter>
        </defs>
        <g filter={`url(#${id}-ink)`} fill={ink} stroke={ink}>
          <circle cx="100" cy="100" r="94" fill="none" strokeWidth="6" />
          <circle cx="100" cy="100" r="84" fill="none" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="54" fill="none" strokeWidth="2" />
          <text fontFamily="var(--font-display)" fontWeight="700" fontSize="12.5" letterSpacing="1.6" stroke="none">
            <textPath href={`#${id}-arc`} startOffset="25%" textAnchor="middle">
              {c.title.toUpperCase()} · {c.issuer.toUpperCase()} ·
            </textPath>
          </text>
          <text x="100" y="108" textAnchor="middle" fontFamily="var(--font-stencil)" fontSize={c.code.length > 3 ? 30 : 38} stroke="none">
            {c.code}
          </text>
          <text x="100" y="134" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="2" stroke="none">
            ★ TAS ★
          </text>
        </g>
      </svg>
    </div>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { OFFICES, EMAIL, type Office } from "@/data/offices";
import { PORT_BY_ID } from "@/data/ports";
import { LAND_MINI } from "@/data/landPaths";
import { MINI, makeProjection } from "@/lib/geo";
import { craneEase } from "@/lib/motion";
import LocalClock from "./LocalClock";

const proj = makeProjection(MINI);
const P = (c: [number, number]) => {
  const [x, y] = proj(c) as [number, number];
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10] as const;
};

const SERVICES = [
  "Sea freight (FCL / LCL)",
  "Air freight",
  "Trucking & haulage",
  "Customs clearance",
  "Warehousing",
  "Project cargo / heavy lift",
  "Ship agency & marine services",
  "Stevedoring",
  "Tugs & barges",
];

export default function ContactDesk() {
  const [active, setActive] = useState<string>("penang");
  const office = OFFICES.find((o) => o.id === active)!;

  return (
    <>
      <section aria-labelledby="offices-title" className="bg-night py-12 sm:py-16">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:px-10">
          <h2 id="offices-title" className="sr-only">
            Offices
          </h2>
          <div className="lg:col-span-5">
            <MiniMap active={active} onSelect={setActive} />
          </div>
          <ul className="grid content-start gap-2 sm:grid-cols-2 lg:col-span-7">
            {OFFICES.map((o) => (
              <li key={o.id} className={o.hq ? "sm:col-span-2" : ""}>
                <OfficeCard o={o} active={o.id === active} onSelect={() => setActive(o.id)} />
              </li>
            ))}
          </ul>
        </div>
        <p className="sr-only" aria-live="polite">
          Selected office: {office.name}
        </p>
      </section>
      <EnquiryForm />
    </>
  );
}

function MiniMap({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  const reduce = useReducedMotion();
  const [lx, ly] = P([100.0, 4.2]);
  return (
    <div className="relative border border-steel/25 bg-[#071521] lg:sticky lg:top-28">
      <svg viewBox={`0 0 ${MINI.w} ${MINI.h}`} className="block h-auto w-full" role="img" aria-label="Map of TAS offices in Peninsular Malaysia and Singapore">
        <g stroke="#8c99a1" strokeOpacity="0.1">
          {Array.from({ length: 7 }).map((_, i) => {
            const [x] = P([99 + i, 3]);
            return <line key={`m${i}`} x1={x} y1="0" x2={x} y2={MINI.h} />;
          })}
          {Array.from({ length: 7 }).map((_, i) => {
            const [, y] = P([100, 1 + i]);
            return <line key={`p${i}`} x1="0" y1={y} x2={MINI.w} y2={y} />;
          })}
        </g>
        <path d={LAND_MINI} fill="#1c4462" stroke="#3a6a8e" strokeWidth="1" />
        <text x={lx} y={ly} fontFamily="var(--font-stencil)" fontSize="14" letterSpacing="5" fill="#8c99a1" fillOpacity="0.5" transform={`rotate(-62 ${lx} ${ly})`}>
          STRAIT OF MALACCA
        </text>
        {/* trucking spine */}
        <path
          d={[OFFICES[0], OFFICES[1], OFFICES[2], OFFICES[4]].map((o, i) => `${i ? "L" : "M"}${P(o.coords).join(",")}`).join("")}
          fill="none"
          stroke="#eef1f0"
          strokeOpacity="0.35"
          strokeWidth="2"
          strokeDasharray="6 6"
        />
        {OFFICES.map((o) => {
          const [x, y] = P(o.coords);
          const on = o.id === active;
          return (
            <g key={o.id} transform={`translate(${x} ${y})`} className="cursor-pointer" onClick={() => onSelect(o.id)}>
              {on && !reduce && <circle r="10" fill="none" stroke="#ff5a1f" strokeWidth="2" className="origin-center [animation:ping-ring_2s_ease-out_infinite] [transform-box:fill-box]" />}
              <rect x="-7" y="-7" width="14" height="14" transform="rotate(45)" fill={on ? "#f2c230" : "#ff5a1f"} stroke="#0a1a26" strokeWidth="2" />
              <g transform={`translate(${o.id === "klia" || o.id === "singapore" ? 14 : -14} 0)`}>
                <text
                  textAnchor={o.id === "klia" || o.id === "singapore" ? "start" : "end"}
                  y="5"
                  fontFamily="var(--font-display)"
                  fontWeight="700"
                  fontSize="17"
                  letterSpacing="1"
                  fill={on ? "#f2c230" : "#eef1f0"}
                >
                  {o.name.toUpperCase()}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
      <div className="pointer-events-none absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.14em] text-steel">
        Chart TAS-MY-02 · Peninsular Malaysia &amp; Singapore
      </div>
      <motion.div
        key={active}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: craneEase }}
        className="absolute bottom-3 right-3 bg-night/90 px-3 py-2 font-mono text-xs text-hull"
      >
        {PORT_BY_ID[active]?.code ?? ""} · <LocalClock tz={OFFICES.find((o) => o.id === active)!.timezone} />
      </motion.div>
    </div>
  );
}

function OfficeCard({ o, active, onSelect }: { o: Office; active: boolean; onSelect: () => void }) {
  const q = encodeURIComponent(o.address.join(" ").replace(/,\s*$/, ""));
  return (
    <article
      className={`relative h-full border p-5 transition-colors ${active ? "border-orange bg-orange/10" : "border-steel/25 bg-night-2"}`}
      onMouseEnter={onSelect}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="stencil text-sm text-orange">
            {o.code}
            {o.hq && <span className="ml-2 text-signal">HQ</span>}
          </p>
          <h3 className="mt-1 font-display text-2xl font-extrabold uppercase">
            <button type="button" onClick={onSelect} className="text-left hover:text-orange" aria-pressed={active}>
              {o.name}
            </button>
          </h3>
          <p className="text-sm text-steel">{o.focus}</p>
        </div>
        <span className="font-mono text-xs text-steel">
          <LocalClock tz={o.timezone} />
        </span>
      </div>
      <address className="mt-3 text-[15px] not-italic leading-relaxed text-hull/80">
        {o.address.map((l) => (
          <span key={l} className="block">
            {l}
          </span>
        ))}
      </address>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm">
        <a href={o.telHref} className="text-hull underline decoration-orange underline-offset-4 hover:text-orange">
          {o.tel}
        </a>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${q}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-steel hover:text-hull"
        >
          Get directions ↗
        </a>
      </div>
    </article>
  );
}

function EnquiryForm() {
  const params = useSearchParams();
  const reduce = useReducedMotion();
  const ref = params.get("ref") ?? "";
  const from = PORT_BY_ID[params.get("from") ?? ""];
  const to = PORT_BY_ID[params.get("to") ?? ""];
  const mode = params.get("mode");
  const prefillMessage =
    ref && from && to
      ? `Please send a firm quote for ${mode ? mode + " " : ""}freight from ${from.name} (${from.code}) to ${to.name} (${to.code}). Demo ticket ref ${ref}.`
      : "";
  const prefillService = mode === "air" ? "Air freight" : mode === "land" ? "Trucking & haulage" : mode === "ocean" ? "Sea freight (FCL / LCL)" : "";

  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const errs: Record<string, string> = {};
    if (!String(f.get("name") ?? "").trim()) errs.name = "Please enter your name.";
    const email = String(f.get("email") ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Please enter a valid email address.";
    if (!String(f.get("message") ?? "").trim()) errs.message = "Tell us what you need to move.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`);
      first?.focus();
      return;
    }
    setSent(true);
  };

  return (
    <section aria-labelledby="enquiry-title" className="border-t border-steel/20 bg-night-2 py-16 sm:py-24">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-4">
          <h2 id="enquiry-title" className="display text-[clamp(2.6rem,6vw,5rem)]">
            Send an <span className="text-orange">enquiry.</span>
          </h2>
          <p className="mt-5 max-w-sm text-[17px] leading-relaxed text-hull/75">
            The Butterworth desk handles enquiries for every office. For anything urgent, call or email directly.
          </p>
          <div className="mt-8 space-y-3 font-mono">
            <a href={`mailto:${EMAIL}`} className="block text-lg text-hull underline decoration-orange decoration-2 underline-offset-4 hover:text-orange">
              {EMAIL}
            </a>
            <a href="tel:+6043312922" className="block text-lg text-hull hover:text-orange">
              +604-331 2922
            </a>
          </div>
          <p className="mono-label mt-8 text-steel">Demo form · nothing is sent from this page</p>
        </div>

        <div className="relative lg:col-span-8">
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.form key="form" onSubmit={onSubmit} noValidate exit={{ opacity: 0 }} className="grid gap-4 sm:grid-cols-2">
                <Field name="name" label="Full name" required error={errors.name} autoComplete="name" />
                <Field name="company" label="Company" autoComplete="organization" />
                <Field name="email" label="Email" type="email" required error={errors.email} autoComplete="email" />
                <Field name="phone" label="Phone" type="tel" autoComplete="tel" />
                <SelectField name="service" label="Service of interest" options={SERVICES} defaultValue={prefillService} />
                <Field name="ref" label="Quote reference (optional)" defaultValue={ref} />
                <Field name="message" label="What do you need to move?" textarea required error={errors.message} defaultValue={prefillMessage} className="sm:col-span-2" />
                <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                  <button type="submit" className="group bg-orange px-7 py-4 font-display text-lg font-bold uppercase tracking-[0.08em] text-night transition-colors hover:bg-hull">
                    Send enquiry <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </button>
                  <p className="text-sm text-steel">Required fields are marked *</p>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="sent"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative flex min-h-[360px] flex-col items-start justify-center border border-steel/25 bg-night p-8"
                role="status"
              >
                <motion.div
                  initial={reduce ? false : { scale: 2.2, opacity: 0, rotate: -24 }}
                  animate={{ scale: 1, opacity: 1, rotate: -8 }}
                  transition={{ duration: 0.3, ease: [0.9, 0, 0.6, 1], delay: 0.15 }}
                  className="border-4 border-orange px-5 py-2 font-display text-5xl font-extrabold uppercase tracking-wider text-orange"
                >
                  Received
                </motion.div>
                <p className="mt-8 max-w-lg text-lg text-hull/85">
                  Thanks. In this demo nothing has actually been sent. To reach the real desk, email{" "}
                  <a href={`mailto:${EMAIL}`} className="underline decoration-orange underline-offset-4">
                    {EMAIL}
                  </a>{" "}
                  or call +604-331 2922.
                </p>
                <button type="button" onClick={() => setSent(false)} className="mt-6 font-display text-sm font-bold uppercase tracking-[0.12em] text-orange hover:text-hull">
                  ← Write another enquiry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  error,
  textarea,
  defaultValue,
  autoComplete,
  className = "",
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  error?: string;
  textarea?: boolean;
  defaultValue?: string;
  autoComplete?: string;
  className?: string;
}) {
  const id = useId();
  const errId = `${id}-err`;
  const cls = `w-full border bg-night px-4 font-sans text-[16px] text-hull outline-none transition-colors placeholder:text-steel/60 focus:border-orange ${
    error ? "border-signal" : "border-steel/30"
  }`;
  return (
    <div className={className}>
      <label htmlFor={id} className="mono-label mb-1.5 block text-steel">
        {label}
        {required && <span className="text-orange"> *</span>}
      </label>
      {textarea ? (
        <textarea id={id} name={name} rows={5} defaultValue={defaultValue} required={required} aria-invalid={!!error} aria-describedby={error ? errId : undefined} className={`${cls} py-3`} />
      ) : (
        <input id={id} name={name} type={type} defaultValue={defaultValue} required={required} autoComplete={autoComplete} aria-invalid={!!error} aria-describedby={error ? errId : undefined} className={`${cls} h-12`} />
      )}
      {error && (
        <p id={errId} className="mt-1.5 text-sm text-signal">
          ▲ {error}
        </p>
      )}
    </div>
  );
}

function SelectField({ name, label, options, defaultValue }: { name: string; label: string; options: string[]; defaultValue?: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mono-label mb-1.5 block text-steel">
        {label}
      </label>
      <div className="relative">
        <select id={id} name={name} defaultValue={defaultValue} className="h-12 w-full appearance-none border border-steel/30 bg-night pl-4 pr-9 text-[16px] text-hull focus:border-orange">
          <option value="">Select a service</option>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-orange" aria-hidden>
          ▾
        </span>
      </div>
    </div>
  );
}

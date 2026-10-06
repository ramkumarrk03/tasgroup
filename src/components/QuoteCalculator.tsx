"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PORTS, PORT_BY_ID, REGIONS, type Mode } from "@/data/ports";
import { CARGO_TYPES, EXTRAS, estimate, type CargoType, type ExtraId, type QuoteInput, type QuoteResult } from "@/data/quote";
import { MODES } from "@/data/services";
import { useMediaQuery } from "@/lib/hooks";
import { craneEase } from "@/lib/motion";
import Telegraph from "./Telegraph";
import RoutePreview from "./RoutePreview";

const STEPS = ["Route", "Mode", "Cargo", "Size", "Options"] as const;

const DEFAULT: QuoteInput = {
  origin: "penang",
  destination: "jebelali",
  mode: "ocean",
  cargo: "fcl",
  containers: 1,
  weightKg: 1200,
  volumeCbm: 6,
  extras: ["customs"],
};

export default function QuoteCalculator() {
  const params = useSearchParams();
  const [input, setInput] = useState<QuoteInput>(() => {
    const to = params.get("to");
    return to && PORT_BY_ID[to] && to !== DEFAULT.origin ? { ...DEFAULT, destination: to } : DEFAULT;
  });
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<QuoteResult | null>(null);
  const [resultFor, setResultFor] = useState<string>("");
  const [touched, setTouched] = useState(false);
  const desktop = useMediaQuery("(min-width: 1024px)");
  const ticketRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof QuoteInput>(k: K, v: QuoteInput[K]) => setInput((cur) => ({ ...cur, [k]: v }));

  // Keep cargo type compatible with the chosen mode
  useEffect(() => {
    const ok = CARGO_TYPES.find((c) => c.id === input.cargo)?.modes.includes(input.mode);
    if (!ok) set("cargo", "general");
  }, [input.mode, input.cargo]);

  const errors = useMemo(() => {
    const e: Partial<Record<"route" | "size" | "mode", string>> = {};
    if (input.origin === input.destination) e.route = "Origin and destination must be different.";
    if (input.cargo === "fcl") {
      if (!(input.containers >= 1 && input.containers <= 50)) e.size = "Enter between 1 and 50 containers.";
    } else if (!(input.weightKg > 0 || input.volumeCbm > 0)) e.size = "Enter a weight or a volume.";
    const probe = estimate(input);
    if (!e.route && !probe.feasible) e.mode = probe.note;
    return e;
  }, [input]);

  const stepError = (i: number) => (i === 0 ? errors.route : i === 1 ? errors.mode : i === 3 ? errors.size : undefined);
  const valid = Object.keys(errors).length === 0;
  const key = JSON.stringify(input);
  const stale = result && resultFor !== key;

  const generate = () => {
    setTouched(true);
    if (!valid) {
      const first = [0, 1, 3].find((i) => stepError(i));
      if (first !== undefined) setStep(first);
      return;
    }
    setResult(estimate(input));
    setResultFor(key);
    requestAnimationFrame(() => {
      if (!desktop) ticketRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const show = (i: number) => desktop || step === i;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      {/* ── Form console ── */}
      <form
        className="lg:col-span-7"
        onSubmit={(e) => {
          e.preventDefault();
          generate();
        }}
        noValidate
        aria-describedby="quote-demo-note"
      >
        {/* Mobile progress: draft marks */}
        <div className="mb-6 lg:hidden" aria-hidden={desktop}>
          <div className="flex items-end gap-1">
            {STEPS.map((s, i) => (
              <button
                key={s}
                type="button"
                onClick={() => setStep(i)}
                className={`flex-1 border-t-4 pt-2 text-left font-mono text-[10px] uppercase tracking-[0.12em] ${
                  i <= step ? "border-orange text-hull" : "border-steel/30 text-steel"
                }`}
                aria-current={i === step ? "step" : undefined}
              >
                {String(i + 1).padStart(2, "0")}
                <span className="block font-display text-sm font-bold">{s}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {show(0) && (
            <Fieldset n={1} title="Route" error={touched || input.origin === input.destination ? errors.route : undefined}>
              <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
                <PortSelect label="Origin" value={input.origin} onChange={(v) => set("origin", v)} />
                <button
                  type="button"
                  onClick={() => setInput((c) => ({ ...c, origin: c.destination, destination: c.origin }))}
                  className="h-12 border border-steel/30 px-3 font-mono text-sm text-hull transition-colors hover:border-orange hover:text-orange"
                  aria-label="Swap origin and destination"
                >
                  ⇄
                </button>
                <PortSelect label="Destination" value={input.destination} onChange={(v) => set("destination", v)} />
              </div>
              {input.origin !== input.destination && (
                <div className="mt-4 overflow-hidden border border-steel/20">
                  <RoutePreview from={input.origin} to={input.destination} />
                </div>
              )}
            </Fieldset>
          )}

          {show(1) && (
            <Fieldset n={2} title="Mode" error={errors.mode}>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-8">
                <Telegraph size="sm" options={MODES} value={input.mode} onChange={(m: Mode) => set("mode", m)} label="Transport mode" />
                <p className="text-[15px] leading-relaxed text-hull/75">
                  <span className="font-display text-xl font-bold uppercase text-hull">{MODES.find((m) => m.id === input.mode)?.label}</span>
                  <br />
                  {MODES.find((m) => m.id === input.mode)?.headline}.
                </p>
              </div>
            </Fieldset>
          )}

          {show(2) && (
            <Fieldset n={3} title="Cargo type">
              <div role="radiogroup" aria-label="Cargo type" className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {CARGO_TYPES.map((c) => {
                  const allowed = c.modes.includes(input.mode);
                  const on = input.cargo === c.id;
                  return (
                    <label
                      key={c.id}
                      className={`relative flex cursor-pointer flex-col border p-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-signal ${
                        !allowed ? "cursor-not-allowed opacity-40" : on ? "border-orange bg-orange/10" : "border-steel/30 hover:border-hull"
                      }`}
                    >
                      <input
                        type="radio"
                        name="cargo"
                        value={c.id}
                        checked={on}
                        disabled={!allowed}
                        onChange={() => set("cargo", c.id as CargoType)}
                        className="sr-only"
                      />
                      <span className="font-display text-lg font-bold uppercase">{c.label}</span>
                      <span className="text-xs text-steel">{allowed ? c.hint : `Not offered by ${input.mode}`}</span>
                      {on && <span className="absolute right-2 top-2 h-2 w-2 bg-orange" aria-hidden />}
                    </label>
                  );
                })}
              </div>
            </Fieldset>
          )}

          {show(3) && (
            <Fieldset n={4} title="Size" error={touched ? errors.size : undefined}>
              {input.cargo === "fcl" ? (
                <NumberField label="40' containers" unit="BOX" min={1} max={50} value={input.containers} onChange={(v) => set("containers", v)} />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  <NumberField label="Gross weight" unit="kg" min={0} max={500000} step={50} value={input.weightKg} onChange={(v) => set("weightKg", v)} />
                  <NumberField label="Volume" unit="CBM" min={0} max={2000} step={0.5} value={input.volumeCbm} onChange={(v) => set("volumeCbm", v)} />
                </div>
              )}
            </Fieldset>
          )}

          {show(4) && (
            <Fieldset n={5} title="Options">
              <div className="grid gap-2 sm:grid-cols-3">
                {EXTRAS.map((x) => {
                  const on = input.extras.includes(x.id);
                  return (
                    <label
                      key={x.id}
                      className={`flex cursor-pointer items-start gap-3 border p-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-signal ${
                        on ? "border-orange bg-orange/10" : "border-steel/30 hover:border-hull"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() =>
                          set("extras", on ? input.extras.filter((e) => e !== x.id) : ([...input.extras, x.id] as ExtraId[]))
                        }
                        className="mt-1 h-4 w-4 accent-[#ff5a1f]"
                      />
                      <span>
                        <span className="block font-display text-base font-bold uppercase">{x.label}</span>
                        <span className="text-xs text-steel">{x.hint}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </Fieldset>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {!desktop && step > 0 && (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="border border-steel/40 px-5 py-4 font-display text-base font-bold uppercase tracking-[0.08em]">
              ← Back
            </button>
          )}
          {!desktop && step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => {
                setTouched(true);
                if (!stepError(step)) setStep((s) => s + 1);
              }}
              className="flex-1 bg-hull px-5 py-4 font-display text-base font-bold uppercase tracking-[0.08em] text-night"
            >
              Next · {STEPS[step + 1]} →
            </button>
          ) : (
            <button type="submit" className="group flex-1 bg-orange px-6 py-4 font-display text-lg font-bold uppercase tracking-[0.08em] text-night transition-colors hover:bg-hull sm:flex-none">
              {result ? "Regenerate ticket" : "Generate indicative ticket"} <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </button>
          )}
        </div>
        <p id="quote-demo-note" className="mono-label mt-4 text-steel">
          Demo estimate · no price is calculated · nothing is submitted
        </p>
      </form>

      {/* ── Ticket ── */}
      <div ref={ticketRef} className="scroll-mt-24 lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          {result ? (
            <AnimatePresence mode="wait">
              <Ticket key={result.ref + resultFor} input={JSON.parse(resultFor)} result={result} stale={!!stale} />
            </AnimatePresence>
          ) : (
            <div className="flex aspect-[4/5] max-h-[560px] w-full flex-col items-center justify-center gap-3 border-2 border-dashed border-steel/30 p-8 text-center">
              <span className="stencil text-5xl text-steel/40">B/L</span>
              <p className="font-display text-2xl font-bold uppercase text-steel">Awaiting cargo details</p>
              <p className="max-w-xs text-sm text-steel">
                Fill in the route, mode and cargo. Your indicative ticket prints here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Fieldset({ n, title, error, children }: { n: number; title: string; error?: string; children: React.ReactNode }) {
  const id = useId();
  return (
    <fieldset className="border border-steel/25 bg-night-2 p-5 sm:p-6" aria-describedby={error ? id : undefined}>
      <legend className="sr-only">{title}</legend>
      <div className="mb-4 flex items-center gap-3" aria-hidden>
        <span className="stencil text-lg text-orange">{String(n).padStart(2, "0")}</span>
        <span className="font-display text-xl font-bold uppercase tracking-wide">{title}</span>
      </div>
      {children}
      {error && (
        <p id={id} role="alert" className="mt-3 flex items-center gap-2 text-sm text-signal">
          <span aria-hidden>▲</span> {error}
        </p>
      )}
    </fieldset>
  );
}

function PortSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mono-label mb-1.5 block text-steel">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full appearance-none border border-steel/30 bg-night pl-3 pr-9 font-display text-lg font-semibold uppercase tracking-wide text-hull focus:border-orange"
        >
          {REGIONS.map((r) => (
            <optgroup key={r.id} label={r.label}>
              {PORTS.filter((p) => p.region === r.id).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.code}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-orange" aria-hidden>
          ▾
        </span>
      </div>
    </div>
  );
}

function NumberField({
  label,
  unit,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  unit: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  const id = useId();
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <div>
      <label htmlFor={id} className="mono-label mb-1.5 block text-steel">
        {label}
      </label>
      <div className="flex h-12 border border-steel/30 focus-within:border-orange">
        <button type="button" aria-label={`Decrease ${label}`} onClick={() => onChange(clamp(+(value - step).toFixed(2)))} className="w-12 border-r border-steel/30 font-mono text-lg hover:text-orange">
          −
        </button>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
          className="w-full min-w-0 bg-transparent px-3 text-center font-mono text-lg text-hull outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="flex items-center pr-3 font-mono text-xs text-steel">{unit}</span>
        <button type="button" aria-label={`Increase ${label}`} onClick={() => onChange(clamp(+(value + step).toFixed(2)))} className="w-12 border-l border-steel/30 font-mono text-lg hover:text-orange">
          +
        </button>
      </div>
    </div>
  );
}

function Ticket({ input, result, stale }: { input: QuoteInput; result: QuoteResult; stale: boolean }) {
  const reduce = useReducedMotion();
  const o = PORT_BY_ID[input.origin];
  const d = PORT_BY_ID[input.destination];
  const [date, setDate] = useState("");
  useEffect(() => {
    setDate(new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date()).toUpperCase());
  }, []);
  const cargo = CARGO_TYPES.find((c) => c.id === input.cargo)!;
  const href = `/contact?ref=${encodeURIComponent(result.ref)}&from=${o.id}&to=${d.id}&mode=${input.mode}&cargo=${input.cargo}`;

  return (
    <motion.div
      initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={reduce ? undefined : { opacity: 0, y: 20 }}
      transition={{ duration: 1.1, ease: craneEase }}
      className="relative"
      aria-live="polite"
    >
      <article className={`relative bg-hull text-night shadow-[0_30px_60px_-24px_rgba(0,0,0,.8)] transition-opacity ${stale ? "opacity-60" : ""}`} aria-label="Indicative demo ticket">
        {/* perforation */}
        <div className="h-3 bg-[radial-gradient(circle_at_8px_0,#0a1a26_6px,transparent_6.5px)] bg-[length:16px_12px]" aria-hidden />
        <div className="p-5 sm:p-6">
          <header className="flex items-start justify-between gap-4 border-b-2 border-night pb-3">
            <div>
              <p className="stencil text-[11px] text-rust">TAS Group · Bill of lading · Demo estimate</p>
              <p className="mt-1 font-display text-2xl font-extrabold uppercase sm:text-3xl">{result.ref}</p>
            </div>
            <div className="text-right font-mono text-[10px] leading-relaxed text-steel-dark">
              <p>ISSUED</p>
              <p className="text-night" suppressHydrationWarning>{date || "—"}</p>
            </div>
          </header>

          <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-start gap-2">
            <div>
              <p className="font-mono text-[10px] text-steel-dark">PORT OF LOADING</p>
              <p className="font-mono text-lg font-bold">{o.code}</p>
              <p className="text-xs">{o.name}</p>
            </div>
            <span className="mt-4 font-mono text-rust" aria-hidden>━━▶</span>
            <div className="text-right">
              <p className="font-mono text-[10px] text-steel-dark">PORT OF DISCHARGE</p>
              <p className="font-mono text-lg font-bold">{d.code}</p>
              <p className="text-xs">{d.name}</p>
            </div>
          </div>

          <div className="mt-4 border border-night/20">
            <RoutePreview from={o.id} to={d.id} tone="light" />
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-dashed border-night/40 pt-4 font-mono text-xs">
            <Row k="MODE" v={input.mode.toUpperCase()} />
            <Row k="CARGO" v={cargo.label.toUpperCase()} />
            <Row k="CHARGEABLE" v={result.chargeable.toUpperCase()} />
            <Row k="DISTANCE ≈" v={`${result.distanceKm.toLocaleString("en-MY")} KM`} />
          </dl>

          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-dashed border-night/40 pt-4">
            <div>
              <p className="font-mono text-[10px] text-steel-dark">COST BAND (RELATIVE)</p>
              <div className="mt-1.5 flex gap-1" aria-label={`Band ${result.band} of 5, ${result.bandLabel}`} role="img">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className={`h-6 flex-1 ${i < result.band ? "bg-orange" : "bg-night/10"}`}
                    initial={reduce ? false : { scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: reduce ? 0 : 0.9 + i * 0.08, duration: 0.25 }}
                    style={{ originY: 1 }}
                  />
                ))}
              </div>
              <p className="mt-1 font-display text-lg font-bold uppercase">
                Band {result.band} · {result.bandLabel}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-steel-dark">ETA WINDOW (INDICATIVE)</p>
              <p className="mt-1 font-display text-4xl font-extrabold leading-none">
                {result.etaDays[0]}–{result.etaDays[1]}
              </p>
              <p className="font-mono text-[10px] uppercase">days, not a commitment</p>
            </div>
          </div>

          <ul className="mt-4 space-y-1 border-t border-dashed border-night/40 pt-3 text-sm">
            {result.handling.map((h) => (
              <li key={h} className="flex gap-2">
                <span className="text-rust" aria-hidden>
                  ▪
                </span>
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link href={href} className="group flex flex-1 items-center justify-between bg-night px-5 py-4 font-display text-base font-bold uppercase tracking-[0.08em] text-hull transition-colors hover:bg-orange hover:text-night">
              Request firm quote <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <p className="mt-3 text-[11px] leading-snug text-steel-dark">
            Demo output for illustration. Bands are relative and the ETA window is a rough distance-based range. Our
            desk confirms real rates, schedules and transit times with a firm quote.
          </p>
        </div>

        {/* Stamp */}
        <motion.div
          initial={reduce ? false : { scale: 2.4, opacity: 0, rotate: -30 }}
          animate={{ scale: 1, opacity: 0.92, rotate: -12 }}
          transition={{ delay: reduce ? 0 : 1.15, duration: 0.28, ease: [0.9, 0, 0.6, 1] }}
          className="pointer-events-none absolute right-4 top-24 border-[3px] border-rust px-3 py-1.5 text-center text-rust mix-blend-multiply sm:right-6"
          aria-hidden
        >
          <p className="font-display text-xl font-extrabold uppercase leading-none tracking-wider">Indicative demo estimate</p>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">Not a price</p>
        </motion.div>
      </article>
      {stale && (
        <p className="mt-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-signal" role="status">
          ▲ Details changed. Regenerate to update the ticket.
        </p>
      )}
    </motion.div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[10px] text-steel-dark">{k}</dt>
      <dd className="mt-0.5 font-bold">{v}</dd>
    </div>
  );
}

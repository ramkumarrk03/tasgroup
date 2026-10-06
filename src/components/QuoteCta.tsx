import Link from "next/link";
import { OFFICES } from "@/data/offices";
import LocalClock from "./LocalClock";
import SignalFlag from "./SignalFlag";

export default function QuoteCta() {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden bg-orange text-night">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-12 lg:items-center lg:px-10">
        <div className="lg:col-span-7">
          <p className="mono-label mb-5 flex items-center gap-3">
            <SignalFlag letter="Q" />
            <span className="stencil text-base">08</span>
            <span className="h-px w-10 bg-current opacity-50" aria-hidden />
            Quote &amp; contact
          </p>
          <h2 id="cta-title" className="display text-[clamp(3rem,9vw,8.5rem)]">
            Move something
            <br />
            with us.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-night/85">
            Tell us the origin, destination, mode and cargo. You get an indicative ticket in under a minute, and our
            Butterworth desk follows up with a firm quote.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/quote"
              className="group inline-flex items-center gap-3 bg-night px-6 py-4 font-display text-lg font-bold uppercase tracking-[0.08em] text-hull transition-colors hover:bg-deep"
            >
              Get an indicative quote <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border-2 border-night px-6 py-4 font-display text-lg font-bold uppercase tracking-[0.08em] transition-colors hover:bg-night hover:text-hull"
            >
              Talk to a desk
            </Link>
          </div>
        </div>

        {/* Ticket preview */}
        <div className="lg:col-span-5">
          <div className="relative mx-auto max-w-[420px] rotate-[3deg] bg-hull p-6 shadow-[0_30px_60px_-20px_rgba(10,26,38,.6)]">
            <div className="absolute inset-x-0 -top-2 h-4 bg-[radial-gradient(circle_at_8px_0,transparent_7px,#eef1f0_7.5px)] bg-[length:16px_16px]" aria-hidden />
            <div className="flex items-start justify-between border-b-2 border-night pb-3">
              <div>
                <p className="stencil text-xs text-rust">Bill of lading · preview</p>
                <p className="mt-1 font-display text-2xl font-extrabold uppercase">TAS-PENJEA-O</p>
              </div>
              <span className="mono-label border border-night px-2 py-1">Demo</span>
            </div>
            <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 font-mono text-sm">
              <div>
                <p className="text-[10px] text-steel-dark">PORT OF LOADING</p>
                <p className="font-bold">MYPEN</p>
              </div>
              <span className="text-rust" aria-hidden>
                ━━▶
              </span>
              <div className="text-right">
                <p className="text-[10px] text-steel-dark">PORT OF DISCHARGE</p>
                <p className="font-bold">AEJEA</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-dashed border-night/40 pt-3 font-mono text-xs">
              <p>MODE · OCEAN FCL</p>
              <p className="text-right">BAND · ▮▮▮▯▯</p>
            </div>
            <div className="absolute -right-3 bottom-6 rotate-[-14deg] border-[3px] border-rust px-3 py-1 font-display text-lg font-extrabold uppercase tracking-wider text-rust opacity-90">
              Indicative only
            </div>
          </div>
        </div>
      </div>

      {/* Offices */}
      <div className="bg-night text-hull">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10">
          <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
            <h3 className="display text-4xl sm:text-5xl">Five desks. One group.</h3>
            <Link href="/contact" className="font-display text-sm font-bold uppercase tracking-[0.12em] text-orange hover:text-hull">
              All contact details →
            </Link>
          </div>
          <ul className="grid gap-px bg-steel/20 sm:grid-cols-2 lg:grid-cols-5">
            {OFFICES.map((o) => (
              <li key={o.id} className="flex flex-col bg-night p-5">
                <div className="flex items-center justify-between">
                  <span className="stencil text-2xl text-orange">{o.code}</span>
                  <span className="font-mono text-xs text-steel">
                    <LocalClock tz={o.timezone} />
                  </span>
                </div>
                <p className="mt-3 font-display text-xl font-bold uppercase">
                  {o.name}
                  {o.hq && <span className="ml-2 align-middle text-xs text-signal">HQ</span>}
                </p>
                <p className="mt-1 text-sm text-steel">{o.focus}</p>
                <address className="mt-3 text-sm not-italic leading-relaxed text-hull/75">
                  {o.address.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
                <a href={o.telHref} className="mt-auto pt-4 font-mono text-sm text-hull hover:text-orange">
                  {o.tel}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

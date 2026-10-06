import Link from "next/link";
import { EMAIL } from "@/data/offices";
import { COMPANIES } from "@/data/services";
import Logo from "./Logo";
import SignalFlag from "./SignalFlag";

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-steel/20 bg-night text-hull">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-5">
          <Logo />
          <p className="display mt-8 text-[clamp(2.5rem,6vw,4.5rem)]">
            Delivering
            <br />
            <span className="text-orange">solutions.</span>
          </p>
          <a href={`mailto:${EMAIL}`} className="mt-6 inline-block font-mono text-base text-hull underline decoration-orange decoration-2 underline-offset-4 hover:text-orange">
            {EMAIL}
          </a>
          <p className="mt-2 font-mono text-sm text-steel">
            HQ <a href="tel:+6043312922" className="hover:text-hull">+604-331 2922</a>
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 lg:col-span-7 lg:grid-cols-3">
          <div>
            <p className="mono-label mb-4 text-steel">Explore</p>
            <ul className="space-y-2 font-display text-lg font-semibold uppercase tracking-wide">
              <li><Link href="/#network" className="hover:text-orange">Network</Link></li>
              <li><Link href="/#capabilities" className="hover:text-orange">Capabilities</Link></li>
              <li><Link href="/#port-ops" className="hover:text-orange">Port operations</Link></li>
              <li><Link href="/#timeline" className="hover:text-orange">Since 1978</Link></li>
              <li><Link href="/network" className="hover:text-orange">Full network map</Link></li>
            </ul>
          </div>
          <div>
            <p className="mono-label mb-4 text-steel">Act</p>
            <ul className="space-y-2 font-display text-lg font-semibold uppercase tracking-wide">
              <li><Link href="/quote" className="hover:text-orange">Get a quote</Link></li>
              <li><Link href="/contact" className="hover:text-orange">Contact &amp; offices</Link></li>
            </ul>
          </div>
          <div className="col-span-2 lg:col-span-1">
            <p className="mono-label mb-4 text-steel">Group companies</p>
            <ul className="space-y-1.5 text-sm text-hull/75">
              {COMPANIES.map((c) => (
                <li key={c.id}>
                  {c.name} <span className="font-mono text-[11px] text-steel">({c.reg})</span>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
      <div className="border-t border-steel/20">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <div className="flex items-center gap-2" aria-label="Signal flags spelling T A S" role="img">
            <SignalFlag letter="T" className="h-6 w-9" />
            <SignalFlag letter="A" className="h-6 w-9" />
            <SignalFlag letter="S" className="h-6 w-9" />
            <span className="mono-label ml-3 text-steel">T · A · S</span>
          </div>
          <p className="mono-label text-steel">© {new Date().getFullYear()} TAS Group of Companies · Butterworth, Penang</p>
        </div>
      </div>
    </footer>
  );
}

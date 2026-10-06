"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { craneEase } from "@/lib/motion";
import Logo from "./Logo";
import LocalClock from "./LocalClock";

const LINKS = [
  { href: "/#network", label: "Network", n: "03" },
  { href: "/#capabilities", label: "Capabilities", n: "04" },
  { href: "/#port-ops", label: "Port Ops", n: "05" },
  { href: "/#group", label: "Group", n: "07" },
  { href: "/contact", label: "Contact", n: "—" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${
        solid || open ? "border-b border-steel/15 bg-night/92 backdrop-blur-sm" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-4 sm:px-6 lg:h-[72px] lg:px-10">
        <Link href="/" aria-label="TAS Group home" className="shrink-0">
          <Logo />
        </Link>

        <div className="mono-label hidden items-center gap-3 text-steel xl:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-orange [animation:beacon_3s_infinite]" aria-hidden />
          <span>PENANG 05°24′N 100°21′E</span>
          <LocalClock />
        </div>

        <nav aria-label="Main" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group relative block px-3 py-2 font-display text-[15px] font-semibold uppercase tracking-[0.08em] text-hull/85 transition-colors hover:text-hull"
                >
                  {l.label}
                  <span className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-orange transition-transform duration-300 ease-[var(--ease-crane)] group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/quote"
          className="group ml-auto hidden items-center gap-2 bg-orange px-5 py-2.5 font-display text-[15px] font-bold uppercase tracking-[0.08em] text-night transition-colors hover:bg-hull sm:flex lg:ml-2"
        >
          Get a Quote
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>

        <button
          type="button"
          className="ml-auto flex h-11 w-11 items-center justify-center border border-steel/30 sm:ml-2 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3 w-5">
            <span className={`absolute left-0 top-0 h-0.5 w-5 bg-hull transition-transform duration-300 ${open ? "translate-y-[5px] rotate-45" : ""}`} />
            <span className={`absolute bottom-0 left-0 h-0.5 w-5 bg-hull transition-transform duration-300 ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: craneEase }}
            className="chart-grid fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-night lg:hidden"
          >
            <nav aria-label="Mobile" className="flex min-h-full flex-col px-4 pb-8 pt-6 sm:px-6">
              <div className="hazard mb-6 h-2 w-full opacity-80" aria-hidden />
              <ul className="flex flex-col">
                {LINKS.map((l) => (
                  <li key={l.href} className="border-b border-steel/20">
                    <Link href={l.href} className="flex items-baseline gap-4 py-4" onClick={() => setOpen(false)}>
                      <span className="stencil w-8 text-sm text-orange">{l.n}</span>
                      <span className="display text-5xl">{l.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/quote"
                className="mt-8 flex items-center justify-between bg-orange px-5 py-4 font-display text-xl font-bold uppercase tracking-wider text-night"
              >
                Get an indicative quote <span aria-hidden>→</span>
              </Link>
              <p className="mono-label mt-auto pt-10 text-steel">
                Dock signboard · Butterworth, Penang · enquiry@tasgroup.com.my
              </p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

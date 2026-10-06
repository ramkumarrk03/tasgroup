import SignalFlag from "./SignalFlag";

export default function PageHeader({ flag, kicker, title, intro }: { flag: string; kicker: string; title: React.ReactNode; intro?: React.ReactNode }) {
  return (
    <header className="relative overflow-hidden border-b border-steel/20 bg-night pt-32 pb-12 sm:pt-40 sm:pb-16">
      <div className="chart-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <p className="mono-label mb-5 flex items-center gap-3 text-steel">
          <SignalFlag letter={flag} />
          <span>{kicker}</span>
        </p>
        <h1 className="display text-[clamp(3.2rem,10vw,9rem)]">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-hull/80">{intro}</p>}
      </div>
    </header>
  );
}

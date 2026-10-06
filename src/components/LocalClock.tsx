"use client";

import { useEffect, useState } from "react";

/** Live local time for a timezone. Renders a fixed-width placeholder until mounted (no hydration mismatch). */
export default function LocalClock({ tz = "Asia/Kuala_Lumpur", className = "" }: { tz?: string; className?: string }) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, [tz]);

  return (
    <span className={`tabular-nums ${className}`} suppressHydrationWarning>
      {now ?? "--:--"} <span className="opacity-60">LT</span>
    </span>
  );
}

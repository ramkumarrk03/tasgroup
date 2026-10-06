import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import QuoteCalculator from "@/components/QuoteCalculator";

export const metadata: Metadata = {
  title: "Indicative quote",
  description: "Build an indicative demo ticket for sea, air or land freight with TAS Group, then request a firm quote.",
};

export default function QuotePage() {
  return (
    <>
      <PageHeader
        flag="Q"
        kicker="Quote desk · Butterworth"
        title={
          <>
            Indicative <span className="text-orange">quote.</span>
          </>
        }
        intro="Five quick steps give you a bill-of-lading-style ticket with a relative cost band and a rough ETA window. It is a demo, not a price. Our desk sends the firm quote."
      />
      <section aria-label="Quote calculator" className="bg-night py-12 sm:py-16">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <Suspense fallback={<div className="h-[600px]" />}>
            <QuoteCalculator />
          </Suspense>
        </div>
      </section>
    </>
  );
}

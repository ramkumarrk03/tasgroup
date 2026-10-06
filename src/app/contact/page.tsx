import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import ContactDesk from "@/components/ContactDesk";

export const metadata: Metadata = {
  title: "Contact & offices",
  description: "TAS Group offices in Penang (HQ, Butterworth), Port Klang, KLIA, Langkawi and Singapore. Email enquiry@tasgroup.com.my or call +604-331 2922.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        flag="H"
        kicker="Contact · five offices"
        title={
          <>
            Find us on <span className="text-orange">the quay.</span>
          </>
        }
        intro="Head office is in Butterworth, across the channel from Penang Port. We also have desks in Port Klang, at KLIA Cargo Village, in Langkawi and in Singapore."
      />
      <Suspense fallback={<div className="h-[600px] bg-night" />}>
        <ContactDesk />
      </Suspense>
    </>
  );
}

"use client";

import { useState } from "react";
import HeroSection               from "@/components/HeroSection";
import TrustMarquee              from "@/components/TrustMarquee";
import HowItWorks                from "@/components/HowItWorks";
import MortgageCalculator        from "@/components/MortgageCalculator";
import OfficeLocator             from "@/components/OfficeLocator";
import WhatsAppWidget            from "@/components/WhatsAppWidget";
import ApplicationStatusModal    from "@/components/ApplicationStatusModal";
import type { BranchSlug }       from "@/components/EligibilityFunnel";

/**
 * Client-side wrapper that lifts selectedBranch and statusModal state.
 * Keeps page.tsx a Server Component (no "use client" at the page level).
 */
export default function HomeClient({ siteSettings }: { siteSettings?: any }) {
  const [selectedBranch,  setSelectedBranch]  = useState<BranchSlug>("abuja");
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  return (
    <>
      <main id="main-content">
        <HeroSection siteSettings={siteSettings} />
        <TrustMarquee />
        <HowItWorks onCheckStatus={() => setStatusModalOpen(true)} />
        <MortgageCalculator />
        <OfficeLocator
          selectedBranch={selectedBranch}
          onBranchChange={setSelectedBranch}
        />
      </main>
      <WhatsAppWidget selectedBranch={selectedBranch} />
      <ApplicationStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
      />
    </>
  );
}

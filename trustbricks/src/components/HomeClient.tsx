"use client";

import { useState } from "react";
import HeroSection               from "@/components/HeroSection";
import TrustMarquee              from "@/components/TrustMarquee";
import HowItWorks                from "@/components/HowItWorks";
import MortgageCalculator        from "@/components/MortgageCalculator";
import OfficeLocator             from "@/components/OfficeLocator";
import WhatsAppWidget            from "@/components/WhatsAppWidget";
import ApplicationStatusModal    from "@/components/ApplicationStatusModal";
import EligibilityFunnel         from "@/components/EligibilityFunnel";
import type { BranchSlug }       from "@/components/EligibilityFunnel";

/**
 * Client-side wrapper that lifts selectedBranch and statusModal state.
 * Keeps page.tsx a Server Component (no "use client" at the page level).
 */
export default function HomeClient({ siteSettings, branches = [] }: { siteSettings?: any, branches?: any[] }) {
  const [selectedBranch,  setSelectedBranch]  = useState<BranchSlug | string>(branches.length > 0 ? branches[0].id : "abuja");
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [funnelOpen, setFunnelOpen] = useState(false);

  return (
    <>
      <main id="main-content">
        <HeroSection siteSettings={siteSettings} branches={branches} />
        <TrustMarquee />
        <HowItWorks onCheckStatus={() => setStatusModalOpen(true)} />
        <MortgageCalculator onApply={() => setFunnelOpen(true)} />
        <OfficeLocator
          selectedBranch={selectedBranch}
          onBranchChange={setSelectedBranch}
          branches={branches}
        />
      </main>
      <WhatsAppWidget selectedBranch={selectedBranch} branches={branches} />
      <ApplicationStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
      />
      <EligibilityFunnel
        isOpen={funnelOpen}
        onClose={() => setFunnelOpen(false)}
        branches={branches}
      />
    </>
  );
}

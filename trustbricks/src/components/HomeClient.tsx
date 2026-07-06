"use client";

import { useState } from "react";
import HeroSection        from "@/components/HeroSection";
import TrustMarquee       from "@/components/TrustMarquee";
import HowItWorks         from "@/components/HowItWorks";
import MortgageCalculator from "@/components/MortgageCalculator";
import OfficeLocator      from "@/components/OfficeLocator";
import WhatsAppWidget     from "@/components/WhatsAppWidget";
import type { BranchSlug } from "@/components/EligibilityFunnel";

/**
 * Client-side wrapper that lifts selectedBranch state.
 * Keeps page.tsx a Server Component (no "use client" at the page level).
 */
export default function HomeClient({ siteSettings }: { siteSettings?: any }) {
  const [selectedBranch, setSelectedBranch] = useState<BranchSlug>("abuja");

  return (
    <>
      <main id="main-content">
        <HeroSection siteSettings={siteSettings} />
        <TrustMarquee />
        <HowItWorks />
        <MortgageCalculator />
        <OfficeLocator
          selectedBranch={selectedBranch}
          onBranchChange={setSelectedBranch}
        />
      </main>
      <WhatsAppWidget selectedBranch={selectedBranch} />
    </>
  );
}

"use client";

import { useState } from "react";
import HeroSection               from "@/components/HeroSection";
import TrustMarquee              from "@/components/TrustMarquee";
import HowItWorks                from "@/components/HowItWorks";
import OfficeLocator             from "@/components/OfficeLocator";
import WhatsAppWidget            from "@/components/WhatsAppWidget";
import ApplicationStatusModal    from "@/components/ApplicationStatusModal";
import CoreValuesSection         from "@/components/CoreValuesSection";
import PropertiesTeaser          from "@/components/PropertiesTeaser";
import TestimonialsSection       from "@/components/TestimonialsSection";
import type { BranchSlug }       from "@/components/EligibilityFunnel";

/**
 * Client-side wrapper that lifts selectedBranch and statusModal state.
 * Keeps page.tsx a Server Component (no "use client" at the page level).
 */
interface HomeClientProps {
  siteSettings?: any;
  branches?: any[];
  testimonials?: any[];
  properties?: any[];
}

export default function HomeClient({ siteSettings, branches = [], testimonials = [], properties = [] }: HomeClientProps) {
  const [selectedBranch,  setSelectedBranch]  = useState<BranchSlug | string>(branches.length > 0 ? branches[0].id : "abuja");
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  let coreValues: any[] = [];
  try { coreValues = JSON.parse(siteSettings?.coreValues || "[]"); } catch { coreValues = []; }

  return (
    <>
      <main id="main-content">
        <HeroSection siteSettings={siteSettings} branches={branches} />
        <TrustMarquee />
        <HowItWorks onCheckStatus={() => setStatusModalOpen(true)} />
        <CoreValuesSection vision={siteSettings?.vision} mission={siteSettings?.mission} coreValues={coreValues} />
        <PropertiesTeaser properties={properties} />
        <TestimonialsSection testimonials={testimonials} />
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
    </>
  );
}

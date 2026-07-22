import { Metadata } from "next";
import Link from "next/link";
import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import { getAdminConfig } from "@/app/actions/adminActions";
import { CheckCircle2, ShieldCheck, PhoneCall, Clock, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Application Received | Trust Bricks Properties",
  description: "Your PenCom RSA equity verification request has been received. An advisor will contact you within 24 hours.",
};

export default async function ApplySuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; leadId?: string }>;
}) {
  const { name, leadId } = await searchParams;
  const config = await getAdminConfig();
  const siteSettings = config?.site || {};
  const applicantName = name ? decodeURIComponent(name) : "Applicant";

  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] font-sans antialiased selection:bg-[var(--color-clay-500)] selection:text-white flex flex-col justify-between">
      <GlobalNavbar />

      <main id="main-content" className="flex-grow pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-8 relative overflow-hidden">
          
          {/* ICON BADGE */}
          <div className="w-20 h-20 rounded-full bg-[var(--color-moss)]/10 text-[var(--color-moss)] mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          {/* HEADINGS */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-clay-50)] border border-[var(--color-clay-200)] text-[var(--color-clay-700)] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[var(--color-clay-500)]" />
              <span>Application Submitted Successfully</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[var(--color-text-heading)] tracking-tight">
              Thank You, {applicantName}!
            </h1>
            <p className="text-base text-[var(--color-text-muted)] max-w-xl mx-auto">
              Your mortgage equity verification request has been securely logged and routed to our advisory desk.
            </p>
          </div>

          {/* 24 HOUR FOLLOW UP NOTICE BOX */}
          <div className="bg-[var(--color-clay-50)] border-2 border-[var(--color-clay-200)] rounded-2xl p-6 sm:p-8 text-left space-y-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[var(--color-clay-500)] text-white shrink-0 mt-0.5">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-black text-[var(--color-text-heading)]">
                  Next Step: Dedicated Advisor Follow-up Within 24 Hours
                </h2>
                <p className="text-sm text-[var(--color-text-body)] leading-relaxed">
                  A dedicated PenCom mortgage advisor from our team will review your submitted RSA figures and contact you directly via phone and email within <strong>24 hours</strong> to guide you through verification and PFA documentation.
                </p>
              </div>
            </div>

            {leadId && (
              <div className="pt-3 border-t border-[var(--color-clay-200)] flex justify-between items-center text-xs text-[var(--color-text-muted)]">
                <span>Application Reference ID:</span>
                <span className="font-mono font-bold text-[var(--color-text-heading)] bg-white px-2.5 py-1 rounded-md border border-[var(--color-clay-200)]">
                  {leadId}
                </span>
              </div>
            )}
          </div>

          {/* WHAT TO EXPECT LIST */}
          <div className="text-left space-y-3 bg-[var(--color-mortar-50)] p-6 rounded-2xl border border-[var(--color-border)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-body)]">What Happens Next:</h3>
            <ul className="space-y-2 text-sm text-[var(--color-text-body)]">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-clay-500)] shrink-0" />
                <span>Verification of your RSA balance with your selected PFA rules.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-clay-500)] shrink-0" />
                <span>Issuance of official PenCom mortgage equity application forms.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-clay-500)] shrink-0" />
                <span>Pairing with approved Primary Mortgage Banks (PMBs) for home equity financing.</span>
              </li>
            </ul>
          </div>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--color-ink-700)] text-white text-sm font-bold tracking-wide hover:bg-[var(--color-ink-600)] transition-colors shadow-md"
            >
              <Home className="w-4 h-4" />
              <span>Return to Homepage</span>
            </Link>
            <Link
              href="/#contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-text-heading)] text-sm font-bold hover:bg-[var(--color-mortar-50)] transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-[var(--color-clay-500)]" />
              <span>Contact Regional Hub</span>
            </Link>
          </div>

        </div>
      </main>

      <Footer siteSettings={siteSettings} />
    </div>
  );
}

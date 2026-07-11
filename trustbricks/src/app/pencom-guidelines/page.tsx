"use client";

import { motion } from "framer-motion";
import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import { CheckCircle2, AlertCircle, FileText, Landmark } from "lucide-react";

export default function PenComGuidelinesPage() {
  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] flex flex-col font-sans antialiased">
      <GlobalNavbar />

      <main className="flex-grow pt-32 pb-24">
        <section className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="space-y-6 mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-clay-500)]/10 border border-[var(--color-clay-500)]/20 text-[var(--color-clay-500)] text-xs font-bold uppercase tracking-wider">
              Official Regulations
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-[var(--color-text-heading)] leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Understanding the PenCom <br />
              <span className="text-[var(--color-clay-500)]">25% RSA Guideline</span>
            </h1>
            <p className="text-base text-[var(--color-text-body)] leading-relaxed">
              In accordance with Section 89(2) of the Pension Reform Act 2014, the National Pension Commission (PenCom) has authorized guidelines for employees to access 25% of their Retirement Savings Account balance.
            </p>
          </div>

          <div className="bg-[var(--color-card)] rounded-3xl p-8 border border-[var(--color-border)] shadow-card space-y-10">
            {/* Core Guidelines */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                <FileText className="w-6 h-6 text-[var(--color-clay-500)]" /> Core Provisions
              </h2>
              <p className="text-sm text-[var(--color-text-body)] leading-relaxed">
                The guideline permits active contributors to apply their RSA balance towards the equity payment of a primary mortgage. Key parameters are detailed below:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[var(--color-mortar-50)] border border-[var(--color-border)]">
                  <span className="text-xs text-[var(--color-text-muted)] font-bold uppercase">Maximum Limit</span>
                  <p className="text-lg font-black text-[var(--color-text-heading)]" style={{ fontFamily: "var(--font-display)" }}>25% of RSA Balance</p>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--color-mortar-50)] border border-[var(--color-border)]">
                  <span className="text-xs text-[var(--color-text-muted)] font-bold uppercase">Contribution Duration</span>
                  <p className="text-lg font-black text-[var(--color-text-heading)]" style={{ fontFamily: "var(--font-display)" }}>Min. 60 Months (5 Years)</p>
                </div>
              </div>
            </div>

            <hr className="border-[var(--color-border)]" />

            {/* Eligibility Requirements */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)]" style={{ fontFamily: "var(--font-display)" }}>
                Contributor Eligibility Requirements
              </h2>
              <ul className="space-y-3.5">
                {[
                  "Must be an active employee under the Contributory Pension Scheme (CPS).",
                  "Must have had employer and employee contributions paid consecutively or cumulatively for at least 60 months.",
                  "Must have a valid mortgage offer letter issued by a Primary Mortgage Bank (PMB) or Commercial Bank licensed by the Central Bank of Nigeria (CBN).",
                  "Must not have less than 3 years to retire from active employment.",
                  "Married couples can make joint equity applications, provided both meet individual eligibility guidelines."
                ].map((rule, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[var(--color-moss)] shrink-0 mt-0.5" />
                    <span className="text-sm text-[var(--color-text-body)] leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="border-[var(--color-border)]" />

            {/* Warnings / Disclaimers */}
            <div className="p-5 rounded-2xl bg-[var(--color-seal)]/5 border border-[var(--color-seal)]/20 text-[var(--color-seal)] flex items-start gap-4">
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5 text-[var(--color-clay-500)]" />
              <div className="space-y-1">
                <h4 className="font-bold text-[var(--color-text-heading)] text-sm">Crucial Information</h4>
                <p className="text-xs text-[var(--color-text-body)] leading-relaxed">
                  RSA funds obtained under these guidelines can **only** be paid directly to the licensed mortgage lender. No cash disbursements can be made directly to the employee or property vendor. If the application is aborted, the funds must be returned to the PFA by the bank.
                </p>
              </div>
            </div>

            {/* List of PFAs supported */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[var(--color-text-heading)] flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                <Landmark className="w-5 h-5 text-[var(--color-clay-500)]" /> Supported Pension Fund Administrators
              </h2>
              <p className="text-xs text-[var(--color-text-body)] leading-relaxed">
                Trust Bricks Properties processes documents in accordance with standards for all PFAs in Nigeria, including Stanbic IBTC Pension Managers, Leadway PFA, Premium Pension, ARM Pension, FCMB Pensions, Sigma Pensions, and others.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import { CheckCircle2, AlertCircle, FileText, Landmark } from "lucide-react";

export default function PenComGuidelinesPage() {
  return (
    <div className="min-h-screen bg-[#F0F4F9] flex flex-col font-sans antialiased">
      <GlobalNavbar />

      <main className="flex-grow pt-32 pb-24">
        <section className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="space-y-6 mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8600A]/10 border border-[#E8600A]/20 text-[#E8600A] text-xs font-bold uppercase tracking-wider">
              Official Regulations
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-[#0D1F3C] leading-tight" style={{ fontFamily: "var(--font-display)" }}>
              Understanding the PenCom <br />
              <span className="text-[#E8600A]">25% RSA Guideline</span>
            </h1>
            <p className="text-base text-[#475569] leading-relaxed">
              In accordance with Section 89(2) of the Pension Reform Act 2014, the National Pension Commission (PenCom) has authorized guidelines for employees to access 25% of their Retirement Savings Account balance.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-card space-y-10">
            {/* Core Guidelines */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#0D1F3C] flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                <FileText className="w-6 h-6 text-[#E8600A]" /> Core Provisions
              </h2>
              <p className="text-sm text-[#475569] leading-relaxed">
                The guideline permits active contributors to apply their RSA balance towards the equity payment of a primary mortgage. Key parameters are detailed below:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#EEF2F7] border border-slate-200">
                  <span className="text-xs text-slate-400 font-bold uppercase">Maximum Limit</span>
                  <p className="text-lg font-black text-[#0D1F3C]" style={{ fontFamily: "var(--font-display)" }}>25% of RSA Balance</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#EEF2F7] border border-slate-200">
                  <span className="text-xs text-slate-400 font-bold uppercase">Contribution Duration</span>
                  <p className="text-lg font-black text-[#0D1F3C]" style={{ fontFamily: "var(--font-display)" }}>Min. 60 Months (5 Years)</p>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Eligibility Requirements */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#0D1F3C]" style={{ fontFamily: "var(--font-display)" }}>
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
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-[#475569] leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="border-slate-100" />

            {/* Warnings / Disclaimers */}
            <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-[#B8952A] flex items-start gap-4">
              <AlertCircle className="w-6 h-6 shrink-0 mt-0.5 text-[#E8600A]" />
              <div className="space-y-1">
                <h4 className="font-bold text-[#0D1F3C] text-sm">Crucial Information</h4>
                <p className="text-xs text-[#475569] leading-relaxed">
                  RSA funds obtained under these guidelines can **only** be paid directly to the licensed mortgage lender. No cash disbursements can be made directly to the employee or property vendor. If the application is aborted, the funds must be returned to the PFA by the bank.
                </p>
              </div>
            </div>

            {/* List of PFAs supported */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#0D1F3C] flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                <Landmark className="w-5 h-5 text-[#E8600A]" /> Supported Pension Fund Administrators
              </h2>
              <p className="text-xs text-[#475569] leading-relaxed">
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

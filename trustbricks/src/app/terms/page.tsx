"use client";

import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#F0F4F9] flex flex-col font-sans antialiased">
      <GlobalNavbar />

      <main className="flex-grow pt-32 pb-24">
        <section className="max-w-3xl mx-auto px-6 lg:px-8">
          <h1 className="text-4xl font-black text-[#0D1F3C] mb-8" style={{ fontFamily: "var(--font-display)" }}>
            Terms of Service
          </h1>
          
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200/60 shadow-card space-y-6 text-[#475569] text-sm leading-relaxed">
            <p className="text-xs text-slate-400">Last updated: July 06, 2026</p>

            <h2 className="text-xl font-bold text-[#0D1F3C] pt-2" style={{ fontFamily: "var(--font-display)" }}>1. Services Provided</h2>
            <p>
              Trust Bricks Properties Ltd provides housing advisory, mortgage facilitation, and pre-qualification estimation services. We assist clients in preparing eligibility documents for submission to primary mortgage banks and Pension Fund Administrators (PFAs).
            </p>

            <h2 className="text-xl font-bold text-[#0D1F3C] pt-2" style={{ fontFamily: "var(--font-display)" }}>2. Estimations Disclaimer</h2>
            <p>
              Calculations performed by our eligibility tools or online calculators are approximations based on guidelines issued by the National Pension Commission (PenCom). Final approval, withdrawable percentages, and home purchase budgets are determined solely by your PFA and PenCom.
            </p>

            <h2 className="text-xl font-bold text-[#0D1F3C] pt-2" style={{ fontFamily: "var(--font-display)" }}>3. No Financial Advisory</h2>
            <p>
              The materials and consultations provided by Trust Bricks are for educational and facilitation purposes. They do not constitute formal investment, tax, or legal advice. Clients should consult their pension specialists or financial planners before making withdrawals.
            </p>

            <h2 className="text-xl font-bold text-[#0D1F3C] pt-2" style={{ fontFamily: "var(--font-display)" }}>4. Limitation of Liability</h2>
            <p>
              Trust Bricks Properties Ltd shall not be liable for any delays in PFA approvals, failures in bank mortgage applications, or changes to the PenCom guidelines introduced by regulatory authorities.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

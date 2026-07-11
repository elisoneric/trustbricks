import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "How It Works | PenCom RSA Mortgage Guide",
  description: "Learn how to unlock 25% of your Retirement Savings Account to fund your home mortgage down payment in Nigeria.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] flex flex-col font-sans antialiased">
      <GlobalNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 lg:px-8 bg-[var(--color-ink-700)] text-white relative overflow-hidden">
        <div className="pattern-brick absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true" />
        <div className="max-w-4xl mx-auto text-center relative">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            How the <span className="text-[var(--color-clay-500)]">PenCom 25% RSA</span> Guideline Works
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Unlocking your Retirement Savings Account for a mortgage down payment is now a reality. Here is everything you need to know to get started.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto px-6 lg:px-8 py-16 w-full">
        <div className="bg-[var(--color-card)] rounded-2xl shadow-sm border border-[var(--color-border)] p-8 md:p-12 space-y-12">

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-4" style={{ fontFamily: "var(--font-display)" }}>
              1. What is the PenCom RSA Mortgage Policy?
            </h2>
            <p className="text-[var(--color-text-body)] leading-relaxed mb-4">
              The National Pension Commission (PenCom) recently approved guidelines allowing Nigerian workers to use up to 25% of their Retirement Savings Account (RSA) balance as equity contribution for a residential mortgage.
            </p>
            <p className="text-[var(--color-text-body)] leading-relaxed">
              This means if you have been contributing to your pension and dreaming of homeownership, your pension can now serve as the critical down payment required by mortgage banks.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-4" style={{ fontFamily: "var(--font-display)" }}>
              2. Are You Eligible?
            </h2>
            <p className="text-[var(--color-text-body)] leading-relaxed mb-6">
              To qualify for this benefit, you must meet the following strict criteria set by PenCom:
            </p>
            <ul className="space-y-4">
              {[
                "You must have an active RSA with both employer and employee mandatory contributions for a cumulative minimum period of 60 months (5 years).",
                "Your offer letter for the property must be from a licensed Primary Mortgage Bank (PMB) or Commercial Bank approved by the CBN.",
                "The maximum withdrawal allowed is 25% of the total RSA balance as of the date of application.",
                "If 25% of your RSA balance is more than the required equity, you can only access the exact amount needed for the equity.",
                "You must not be retiring within the next 3 years.",
                "Married couples can make a joint application, provided both meet the eligibility criteria."
              ].map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <CheckCircle2 className="w-6 h-6 text-[var(--color-clay-500)] shrink-0 mt-0.5" />
                  <span className="text-[var(--color-text-body)] leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-4" style={{ fontFamily: "var(--font-display)" }}>
              3. Our Process at Trust Bricks
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-ink-700)] text-white flex items-center justify-center font-bold shrink-0" style={{ fontFamily: "var(--font-display)" }}>
                  1
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--color-text-heading)] mb-2">Check Your Eligibility</h3>
                  <p className="text-[var(--color-text-body)] leading-relaxed">Use our eligibility calculator to see if your current RSA balance meets the threshold required by your Pension Fund Administrator (PFA).</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-ink-700)] text-white flex items-center justify-center font-bold shrink-0" style={{ fontFamily: "var(--font-display)" }}>
                  2
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--color-text-heading)] mb-2">Consultation</h3>
                  <p className="text-[var(--color-text-body)] leading-relaxed">Our regional advisors in Abuja, Lagos, Adamawa, or Kaduna will reach out to guide you through selecting a property and securing your mortgage offer letter.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-ink-700)] text-white flex items-center justify-center font-bold shrink-0" style={{ fontFamily: "var(--font-display)" }}>
                  3
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--color-text-heading)] mb-2">Application & Approval</h3>
                  <p className="text-[var(--color-text-body)] leading-relaxed">We assist you in submitting the required documents to your PFA. Once approved by PenCom, the funds are disbursed directly to your mortgage lender.</p>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-[var(--color-border)]" />

          {/* CTA */}
          <section className="text-center bg-[var(--color-mortar-50)] rounded-xl p-8">
            <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Ready to take the first step?
            </h2>
            <p className="text-[var(--color-text-body)] mb-8">
              Find out if you qualify in less than 60 seconds.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold text-white bg-[var(--color-clay-500)] rounded-full hover:bg-[var(--color-clay-600)] transition-colors"
            >
              Check My Eligibility
            </Link>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] flex flex-col font-sans antialiased">
      <GlobalNavbar />

      <main className="flex-grow pt-32 pb-24">
        <section className="max-w-3xl mx-auto px-6 lg:px-8">
          <h1 className="text-4xl font-black text-[var(--color-text-heading)] mb-8" style={{ fontFamily: "var(--font-display)" }}>
            Privacy Policy
          </h1>

          <div className="bg-[var(--color-card)] rounded-3xl p-8 md:p-10 border border-[var(--color-border)] shadow-card space-y-6 text-[var(--color-text-body)] text-sm leading-relaxed">
            <p className="text-xs text-[var(--color-text-muted)]">Last updated: July 06, 2026</p>

            <h2 className="text-xl font-bold text-[var(--color-text-heading)] pt-2" style={{ fontFamily: "var(--font-display)" }}>1. Information We Collect</h2>
            <p>
              When you use the Trust Bricks Properties Ltd portal, check your mortgage eligibility, or request advisory services, we collect information including your name, phone number, email address, estimation of your Retirement Savings Account (RSA) balance, and your current Pension Fund Administrator (PFA).
            </p>

            <h2 className="text-xl font-bold text-[var(--color-text-heading)] pt-2" style={{ fontFamily: "var(--font-display)" }}>2. How We Use Your Information</h2>
            <p>
              We use the collected information exclusively to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Process and calculate your potential 25% downpayment capacity.</li>
              <li>Provide advisory support through our regional offices in Abuja, Lagos, Adamawa, and Kaduna.</li>
              <li>Coordinate with licensed mortgage banks and your PFA on your behalf, with your explicit authorization.</li>
            </ul>

            <h2 className="text-xl font-bold text-[var(--color-text-heading)] pt-2" style={{ fontFamily: "var(--font-display)" }}>3. Information Sharing and Disclosure</h2>
            <p>
              We do not sell, rent, or trade your personal data to third parties. We only share details with licensed primary mortgage banks or Pension Fund Administrators to compile your eligibility applications as instructed by you.
            </p>

            <h2 className="text-xl font-bold text-[var(--color-text-heading)] pt-2" style={{ fontFamily: "var(--font-display)" }}>4. Security</h2>
            <p>
              We implement industry-standard administrative, physical, and electronic security measures to safeguard your personal details and RSA estimations from unauthorized access, loss, or manipulation.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

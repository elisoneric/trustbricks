import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import { getAdminConfig } from "@/app/actions/adminActions";

export const metadata = {
  title: "Terms of Service | Trust Bricks Properties Ltd",
};

export default async function TermsOfServicePage() {
  const config = await getAdminConfig();

  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] flex flex-col font-sans antialiased">
      <GlobalNavbar />

      <main className="flex-grow pt-32 pb-24">
        <section className="max-w-3xl mx-auto px-6 lg:px-8">
          <h1 className="text-4xl font-black text-[var(--color-text-heading)] mb-8" style={{ fontFamily: "var(--font-display)" }}>
            Terms of Service
          </h1>

          <div className="bg-[var(--color-card)] rounded-3xl p-8 md:p-10 border border-[var(--color-border)] shadow-card space-y-6 text-[var(--color-text-body)] text-sm leading-relaxed">
            <p className="text-xs text-[var(--color-text-muted)]">Last updated: July 23, 2026</p>

            <h2 className="text-xl font-bold text-[var(--color-text-heading)] pt-2" style={{ fontFamily: "var(--font-display)" }}>1. Services Provided</h2>
            <p>
              Trust Bricks Properties Ltd provides housing advisory, mortgage facilitation, and pre-qualification estimation services. We assist clients in preparing eligibility documents for submission to primary mortgage banks and Pension Fund Administrators (PFAs).
            </p>

            <h2 className="text-xl font-bold text-[var(--color-text-heading)] pt-2" style={{ fontFamily: "var(--font-display)" }}>2. Estimations Disclaimer</h2>
            <p>
              Calculations performed by our eligibility tools or online calculators are approximations based on guidelines issued by the National Pension Commission (PenCom). Final approval, withdrawable percentages, and home purchase budgets are determined solely by your PFA and PenCom.
            </p>

            <h2 className="text-xl font-bold text-[var(--color-text-heading)] pt-2" style={{ fontFamily: "var(--font-display)" }}>3. No Financial Advisory</h2>
            <p>
              The materials and consultations provided by Trust Bricks are for educational and facilitation purposes. They do not constitute formal investment, tax, or legal advice. Clients should consult their pension specialists or financial planners before making withdrawals.
            </p>

            <h2 className="text-xl font-bold text-[var(--color-text-heading)] pt-2" style={{ fontFamily: "var(--font-display)" }}>4. Limitation of Liability</h2>
            <p>
              Trust Bricks Properties Ltd shall not be liable for any delays in PFA approvals, failures in bank mortgage applications, or changes to the PenCom guidelines introduced by regulatory authorities.
            </p>

            <h2 className="text-xl font-bold text-[var(--color-text-heading)] pt-2" style={{ fontFamily: "var(--font-display)" }}>5. Property Listings</h2>
            <p>
              In addition to mortgage facilitation, Trust Bricks Properties Ltd lists residential, commercial, and land properties for sale on this website in an advisory and intermediary capacity. We do not guarantee the accuracy, availability, or condition of any third-party property listing, and all property transactions are subject to independent due diligence, inspection, and separate sale/purchase agreements between the client and the property owner or developer. Listed prices are indicative and subject to change without notice. Construction-related properties or off-plan developments are subject to separate construction and payment agreements outside the scope of these Terms.
            </p>

            <h2 className="text-xl font-bold text-[var(--color-text-heading)] pt-2" style={{ fontFamily: "var(--font-display)" }}>6. Limitation of Liability — Property Listings</h2>
            <p>
              Trust Bricks Properties Ltd shall not be liable for disputes, losses, or damages arising from property transactions facilitated or listed on this website, including but not limited to title defects, construction delays, or misrepresentation by third-party sellers, developers, or agents. Clients are strongly encouraged to conduct independent legal and physical due diligence before making any property-related commitment.
            </p>
          </div>
        </section>
      </main>

      <Footer siteSettings={config?.site} />
    </div>
  );
}

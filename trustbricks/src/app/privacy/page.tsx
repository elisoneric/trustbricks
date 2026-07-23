import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import { getAdminConfig } from "@/app/actions/adminActions";

export const metadata = {
  title: "Privacy Policy | Trust Bricks Properties Ltd",
};

export default async function PrivacyPolicyPage() {
  const config = await getAdminConfig();
  const dpoName = config?.site?.dpoName || "";
  const dpoEmail = config?.site?.dpoEmail || "dpo@trustbrickspropertieslimited.com.ng";

  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] flex flex-col font-sans antialiased">
      <GlobalNavbar />

      <main className="flex-grow pt-32 pb-24">
        <section className="max-w-3xl mx-auto px-6 lg:px-8">
          <h1 className="text-4xl font-black text-[var(--color-text-heading)] mb-8" style={{ fontFamily: "var(--font-display)" }}>
            Privacy Policy
          </h1>

          <div className="bg-[var(--color-card)] rounded-3xl p-8 md:p-10 border border-[var(--color-border)] shadow-card space-y-6 text-[var(--color-text-body)] text-sm leading-relaxed">
            <p className="text-xs text-[var(--color-text-muted)]">Last updated: July 20, 2026</p>

            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-heading)] pt-2" style={{ fontFamily: "var(--font-display)" }}>1. Introduction and Identity</h2>
              <p className="mt-2">
                Welcome to Trust Bricks Properties Ltd. We respect your privacy and are committed to protecting your personal data in compliance with the Nigeria Data Protection Act (NDPA) 2023 and the General Application and Implementation Directive (GAID) 2025. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
              </p>
              <p className="mt-2">
                <strong>Data Controller:</strong> Trust Bricks Properties Ltd is the controller and responsible for your personal data.
              </p>
              <p className="mt-2">
                <strong>Contact Details:</strong> For any privacy-specific concerns, you can reach our Data Protection Officer{dpoName ? ` (${dpoName})` : " (DPO)"} at {dpoEmail} or visit any of our regional offices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-heading)] pt-2" style={{ fontFamily: "var(--font-display)" }}>2. Categories of Personal Data Collected</h2>
              <p className="mt-2">
                When you use our portal to check your mortgage eligibility or request advisory services, we may collect, use, store and transfer different kinds of personal data about you, including:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Identity Data:</strong> First name, last name, date of birth.</li>
                <li><strong>Contact Data:</strong> Phone number, email address, physical address.</li>
                <li><strong>Financial & Pension Data:</strong> Estimation of your Retirement Savings Account (RSA) balance, current Pension Fund Administrator (PFA), employment details.</li>
                <li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting, and operating system.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-heading)] pt-2" style={{ fontFamily: "var(--font-display)" }}>3. Purpose and Lawful Basis for Processing</h2>
              <p className="mt-2">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances and on the following lawful bases:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Consent:</strong> When you provide explicit consent for us to calculate your 25% downpayment capacity and provide advisory support. You have the right to withdraw consent at any time.</li>
                <li><strong>Contractual Necessity:</strong> Where we need to perform the contract we are about to enter into or have entered into with you (e.g., initiating a mortgage application process).</li>
                <li><strong>Legitimate Interests:</strong> For running our business, provision of administration and IT services, network security, and to prevent fraud.</li>
                <li><strong>Legal Obligation:</strong> Where we need to comply with a legal or regulatory obligation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-heading)] pt-2" style={{ fontFamily: "var(--font-display)" }}>4. Data Subject Rights</h2>
              <p className="mt-2">
                Under the NDPA, you have rights regarding your personal data:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Request access:</strong> Receive a copy of the personal data we hold about you.</li>
                <li><strong>Request correction (Rectification):</strong> Have any incomplete or inaccurate data we hold about you corrected.</li>
                <li><strong>Request erasure:</strong> Ask us to delete or remove personal data where there is no good reason for us continuing to process it.</li>
                <li><strong>Object to processing:</strong> Object where we are relying on a legitimate interest and there is something about your particular situation which makes you want to object.</li>
                <li><strong>Request restriction of processing:</strong> Ask us to suspend the processing of your personal data in certain scenarios.</li>
                <li><strong>Request data portability:</strong> Request the transfer of your personal data to you or to a third party.</li>
                <li><strong>Withdraw consent:</strong> Withdraw consent at any time where we are relying on consent to process your personal data.</li>
              </ul>
              <p className="mt-2">To exercise any of these rights, please contact our DPO.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-heading)] pt-2" style={{ fontFamily: "var(--font-display)" }}>5. Third-Party Sharing and Cross-Border Transfers</h2>
              <p className="mt-2">
                We do not sell your personal data. We may share your personal data with:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Licensed Primary Mortgage Banks (PMBs) and your Pension Fund Administrator (PFA) to facilitate your mortgage application, strictly with your authorization.</li>
                <li>Service providers acting as processors who provide IT and system administration services.</li>
              </ul>
              <p className="mt-2">
                If we transfer your personal data outside of Nigeria (e.g., using cloud service providers), we ensure a similar degree of protection is afforded to it by ensuring adequate safeguards are implemented in compliance with the NDPA.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-heading)] pt-2" style={{ fontFamily: "var(--font-display)" }}>6. Data Retention Policy</h2>
              <p className="mt-2">
                We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements. Typically, applicant data is retained for the duration of the mortgage processing period and an additional statutory period required by Nigerian financial regulations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-[var(--color-text-heading)] pt-2" style={{ fontFamily: "var(--font-display)" }}>7. Data Security Measures</h2>
              <p className="mt-2">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. We limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
              </p>
            </section>
          </div>
        </section>
      </main>

      <Footer siteSettings={config?.site} />
    </div>
  );
}

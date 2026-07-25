import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import FaqPageClient, { FAQItem } from "@/components/FaqPageClient";
import { getAdminConfig } from "@/app/actions/adminActions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Trust Bricks Properties Ltd",
  description: "Find answers to common questions about PenCom RSA 25% mortgage withdrawals, eligibility criteria, and PFA application procedures.",
  alternates: {
    canonical: "https://trustbrickspropertieslimited.com.ng/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions | Trust Bricks Properties Ltd",
    description: "Find answers to common questions about PenCom RSA 25% mortgage withdrawals, eligibility criteria, and PFA application procedures.",
    url: "https://trustbrickspropertieslimited.com.ng/faq",
    siteName: "Trust Bricks Properties",
    locale: "en_NG",
    type: "website",
  },
};

const FAQS: FAQItem[] = [
  {
    question: "How much can I withdraw from my Retirement Savings Account (RSA)?",
    answer: "You are allowed to withdraw a maximum of 25% of your total RSA balance at the time of your application. These funds must be utilized strictly as the equity contribution (down payment) for a residential mortgage."
  },
  {
    question: "Can my spouse and I pool our RSA accounts for a joint application?",
    answer: "Yes. Married couples can make a joint application. Both parties must be contributors and individually meet all the eligibility criteria set by PenCom (such as having contributed for at least 60 months)."
  },
  {
    question: "Can I use the RSA withdrawal to purchase raw land?",
    answer: "No. Under the official PenCom guidelines, the mortgage must be for a residential property (completed home). It cannot be used to purchase empty plots of land or commercial properties."
  },
  {
    question: "What happens to my pension funds if the home purchase fails?",
    answer: "If the mortgage facilitation or property transaction fails after the funds have been approved and disbursed, the commercial/primary mortgage bank is legally required to return the funds directly back to your PFA. The funds cannot be paid to you in cash."
  },
  {
    question: "How long does the entire PFA and PenCom approval process take?",
    answer: "Once all required documentation is submitted, the PFA has up to 10 working days to review and submit the application to PenCom. PenCom generally reviews and provides approvals within another 5 to 10 working days, after which funds are disbursed directly to the bank."
  }
];

export default async function FAQPage() {
  const config = await getAdminConfig();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] flex flex-col font-sans antialiased">
      {/* Google SERP FAQ Rich Snippet */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GlobalNavbar />

      <main className="flex-grow pt-32 pb-24">
        <section className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-clay-500)]/10 border border-[var(--color-clay-500)]/20 text-[var(--color-clay-500)] text-xs font-bold uppercase tracking-wider mb-6">
              Help Center
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-[var(--color-text-heading)] mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Frequently Asked <br />
              <span className="text-[var(--color-clay-500)]">Questions.</span>
            </h1>
            <p className="text-sm text-[var(--color-text-body)] leading-relaxed">
              Find answers to the most common inquiries regarding PFA eligibility, withdrawal thresholds, and mortgage approvals in Nigeria.
            </p>
          </div>

          <FaqPageClient faqs={FAQS} />
        </section>
      </main>

      <Footer siteSettings={config?.site} />
    </div>
  );
}

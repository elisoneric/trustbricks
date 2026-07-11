"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import { ChevronDown, HelpCircle, HelpCircle as HelpIcon } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

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
  },
  {
    question: "Is there a minimum RSA balance required to qualify?",
    answer: "While PenCom doesn't state a minimum balance, the actual limit depends on your PFA and the equity required for the home you wish to buy. For example, Stanbic IBTC requires a minimum RSA balance of ₦5,000,000 to process eligibility for their sponsored property lists."
  }
];

function FAQAccordionItem({ faq, isOpen, onClick }: { faq: FAQItem; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-[var(--color-border)] py-4">
      <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center justify-between text-left py-2 font-bold text-[var(--color-text-heading)] text-base hover:text-[var(--color-clay-500)] transition-colors focus:outline-none"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <span className="flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-[var(--color-clay-500)] shrink-0" />
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="text-[var(--color-text-muted)]"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 18 }}
            className="overflow-hidden"
          >
            <p className="text-sm text-[var(--color-text-body)] leading-relaxed pt-2 pb-4 pl-8">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] flex flex-col font-sans antialiased">
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

          <div className="bg-[var(--color-card)] rounded-3xl p-8 md:p-10 border border-[var(--color-border)] shadow-card">
            <div className="divide-y divide-[var(--color-border)]">
              {FAQS.map((faq, index) => (
                <FAQAccordionItem
                  key={faq.question}
                  faq={faq}
                  isOpen={openIndex === index}
                  onClick={() => toggleIndex(index)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

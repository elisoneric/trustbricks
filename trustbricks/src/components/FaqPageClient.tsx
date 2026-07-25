"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

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

export default function FaqPageClient({ faqs }: { faqs: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-[var(--color-card)] rounded-3xl p-8 md:p-10 border border-[var(--color-border)] shadow-card">
      <div className="divide-y divide-[var(--color-border)]">
        {faqs.map((faq, index) => (
          <FAQAccordionItem
            key={faq.question}
            faq={faq}
            isOpen={openIndex === index}
            onClick={() => toggleIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}

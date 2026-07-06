"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BranchSlug } from "./EligibilityFunnel";

/* ── WHATSAPP NUMBERS PER STATE ──────────────────────────────────────────── */
const WA_NUMBERS: Record<BranchSlug, string> = {
  abuja:   "+2348030000001",
  lagos:   "+2348050000002",
  adamawa: "+2348070000003",
  kaduna:  "+2348090000004",
};

const WA_MESSAGE = encodeURIComponent(
  "Hello! I'd like to speak with a Trust Brick Properties advisor about the PenCom mortgage scheme."
);

/* ── COMPONENT ──────────────────────────────────────────────────────────── */
interface WhatsAppWidgetProps {
  /** Receives the currently selected branch from parent context. Defaults to abuja. */
  selectedBranch?: BranchSlug;
}

export default function WhatsAppWidget({ selectedBranch = "abuja" }: WhatsAppWidgetProps) {
  const [visible,    setVisible]    = useState(false);
  const [showToast,  setShowToast]  = useState(false);
  const [prevBranch, setPrevBranch] = useState<BranchSlug>(selectedBranch);
  const [jiggle,     setJiggle]     = useState(false);

  /* Delay mount so it doesn't compete with page load */
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  /* Show toast after mounting */
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setShowToast(true), 800);
    const t2 = setTimeout(() => setShowToast(false), 5000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [visible]);

  /* Jiggle when branch changes */
  useEffect(() => {
    if (selectedBranch !== prevBranch) {
      setPrevBranch(selectedBranch);
      setJiggle(true);
      setShowToast(true);
      const t = setTimeout(() => setJiggle(false), 500);
      const t2 = setTimeout(() => setShowToast(false), 4000);
      return () => { clearTimeout(t); clearTimeout(t2); };
    }
  }, [selectedBranch, prevBranch]);

  const waUrl = `https://wa.me/${WA_NUMBERS[selectedBranch]}?text=${WA_MESSAGE}`;

  const cityLabel: Record<BranchSlug, string> = {
    abuja:   "Abuja",
    lagos:   "Lagos",
    adamawa: "Adamawa",
    kaduna:  "Kaduna",
  };

  return (
    <AnimatePresence>
      {visible && (
        <div
          className="fixed bottom-6 right-6 z-[300] flex flex-col items-end gap-3"
          role="complementary"
          aria-label="WhatsApp contact widget"
        >
          {/* Toast notification */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                key="toast"
                initial={{ opacity: 0, x: 20, scale: 0.92 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.92 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="max-w-[220px] rounded-2xl px-4 py-3 text-sm shadow-lg pointer-events-none"
                style={{
                  backgroundColor: "#FFFFFF",
                  boxShadow: "var(--shadow-dialog)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <p
                  className="font-semibold text-xs mb-0.5"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-text-heading)" }}
                >
                  Chat with {cityLabel[selectedBranch]} Office
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ fontFamily: "var(--font-body)", color: "var(--color-text-body)" }}
                >
                  We typically reply within minutes.
                </p>
                {/* Triangle */}
                <div
                  aria-hidden="true"
                  className="absolute -bottom-2 right-[26px] w-4 h-2 overflow-hidden"
                >
                  <div
                    className="w-3 h-3 rotate-45 translate-x-0.5 -translate-y-1.5 border-r border-b"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "var(--color-border)",
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main button */}
          <motion.a
            key="wa-button"
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={
              jiggle
                ? {
                    scale: 1,
                    opacity: 1,
                    rotate: [0, -8, 8, -5, 5, 0],
                    transition: { rotate: { duration: 0.45, ease: "easeInOut" } },
                  }
                : { scale: 1, opacity: 1 }
            }
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="pulse-ring relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-xl"
            style={{
              backgroundColor: "#25D366",
              boxShadow: "0 4px 24px rgba(37, 211, 102, 0.45)",
            }}
            aria-label={`Open WhatsApp chat with our ${cityLabel[selectedBranch]} office`}
            onMouseEnter={() => setShowToast(true)}
            onMouseLeave={() => {
              setTimeout(() => setShowToast(false), 2000);
            }}
          >
            <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </motion.a>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ── ICON ────────────────────────────────────────────────────────────────── */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

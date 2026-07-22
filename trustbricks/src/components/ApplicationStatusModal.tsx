"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Phone, CreditCard, Lock, Search, CheckCircle2 } from "lucide-react";
import { trackLeadStatus } from "@/app/actions/leadRouting";

/* ─── TYPES ──────────────────────────────────────────────────────────────── */
interface StatusResponse {
  found: boolean;
  status: string | null;
  description: string | null;
  step: number | null;
  total_steps: number;
}

type ModalState = "form" | "loading" | "result" | "not-found" | "error";

/* ─── BACKDROP VARIANTS ──────────────────────────────────────────────────── */
const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22 } },
  exit:    { opacity: 0, transition: { duration: 0.18 } },
};

const panelVariants: Variants = {
  hidden:  { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { type: "spring" as const, stiffness: 340, damping: 30 } },
  exit:    { opacity: 0, y: 16, scale: 0.97, transition: { duration: 0.18 } },
};

const contentVariants: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 280, damping: 28, delay: 0.05 } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.12 } },
};

/* ─── PROGRESS BAR ───────────────────────────────────────────────────────── */
function StepProgressBar({ step, totalSteps }: { step: number; totalSteps: number }) {
  const pct = Math.min(100, Math.round((step / totalSteps) * 100));
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Progress</span>
        <span className="text-xs font-black text-[var(--color-clay-500)]">{pct}%</span>
      </div>
      <div className="w-full h-2.5 bg-[var(--color-mortar-100)] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-clay-500)] to-[var(--color-clay-200)]"
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.3 }}
        />
      </div>
      <div className="flex justify-between text-[10px] font-bold text-[var(--color-text-muted)] mt-1.5">
        <span>Step {step} of {totalSteps}</span>
        <span>{step === totalSteps ? "Complete ✓" : "In Progress"}</span>
      </div>
    </div>
  );
}

/* ─── SPINNER ────────────────────────────────────────────────────────────── */
function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-[var(--color-mortar-100)]" />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-clay-500)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-[var(--color-clay-500)]/20 animate-pulse" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-[var(--color-text-heading)] font-bold text-sm">Searching Records…</p>
        <p className="text-[var(--color-text-muted)] text-xs mt-1">Checking our secure database</p>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────────── */
interface ApplicationStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicationStatusModal({ isOpen, onClose }: ApplicationStatusModalProps) {
  const [state, setState] = useState<ModalState>("form");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [phone, setPhone] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [result, setResult] = useState<StatusResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"phone" | "account">("phone");

  const overlayRef = useRef<HTMLDivElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  /* Reset state when modal opens */
  useEffect(() => {
    if (isOpen) {
      setState("form");
      setPhone("");
      setAccountNumber("");
      setErrorMsg("");
      setActiveTab("phone");
      setTimeout(() => phoneInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  /* Escape key handler */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  /* Body scroll lock */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation — matches the tracking API's contract: digits only (leading + ok),
    // phone needs 10+ digits, account number needs 6+ digits, at least one required.
    const trimPhone = phone.trim();
    const trimAccount = accountNumber.trim();
    const phoneDigits = trimPhone.replace(/^\+/, "");
    const accountDigits = trimAccount;

    if (!trimPhone && !trimAccount) {
      setErrorMsg("Please enter at least one field — phone number or account number.");
      return;
    }
    if (trimPhone && (!/^\d+$/.test(phoneDigits) || phoneDigits.length < 10)) {
      setErrorMsg("Enter a valid phone number (at least 10 digits).");
      return;
    }
    if (trimAccount && (!/^\d+$/.test(accountDigits) || accountDigits.length < 6)) {
      setErrorMsg("Account number must be digits only, at least 6 digits.");
      return;
    }

    setErrorMsg("");
    setState("loading");

    try {
      const searchTerm = trimPhone || trimAccount;

      // 1. Check local database first via Server Action
      const localResult = await trackLeadStatus(searchTerm);
      if (localResult.found) {
        setResult(localResult);
        setState("result");
        return;
      }

      // 2. Fallback to external tracking API if available
      try {
        const body: Record<string, string> = {};
        if (trimPhone)   body.phone_number = trimPhone;
        if (trimAccount) body.account_number = trimAccount;

        const res = await fetch(
          "https://equity.trustbrickspropertieslimited.com.ng/api/portal/track",
          {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(body),
          }
        );

        if (res.ok) {
          const data: StatusResponse = await res.json();
          if (data.found) {
            setResult(data);
            setState("result");
            return;
          }
        }
      } catch (externalErr) {
        console.warn("External tracking API endpoint unreachable, falling back to local result.", externalErr);
      }

      // If not found in either database, show clean Not Found screen instead of Query Failed error
      setState("not-found");
    } catch (err: any) {
      console.error("[APPLICATION TRACKING ERROR]", err);
      setState("not-found");
    }
  };

  const handleReset = () => {
    setState("form");
    setPhone("");
    setAccountNumber("");
    setErrorMsg("");
    setResult(null);
    setTimeout(() => phoneInputRef.current?.focus(), 100);
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          key="overlay"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: "rgba(16, 25, 43, 0.65)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
          <motion.div
            key="panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full sm:max-w-lg bg-[var(--color-card)] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(16,25,43,0.3)]"
          >
            <div className="relative px-7 pt-8 pb-6 bg-gradient-to-br from-[var(--color-ink-700)] via-[var(--color-ink-600)] to-[var(--color-ink-500)] overflow-hidden">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200 text-white/70"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
              <h2 className="text-xl font-black text-white mb-1">Check My Application</h2>
              <p className="text-white/55 text-sm font-medium">Track your application stage.</p>
            </div>

            <div className="px-7 py-6">
              <AnimatePresence mode="wait">
                {state === "form" && (
                  <motion.div key="form" variants={contentVariants} initial="hidden" animate="visible" exit="exit">
                    <div className="flex gap-1 p-1 bg-[var(--color-mortar-100)] rounded-xl mb-6">
                      {(["phone", "account"] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => {
                            setActiveTab(tab);
                            setErrorMsg("");
                            if (tab === "phone") {
                              setTimeout(() => phoneInputRef.current?.focus(), 100);
                            }
                          }}
                          className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all duration-200 ${
                            activeTab === tab
                              ? "bg-white text-[var(--color-text-heading)] shadow-sm"
                              : "text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]"
                          }`}
                        >
                          {tab === "phone" ? "Phone Number" : "Account Number"}
                        </button>
                      ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <AnimatePresence mode="wait">
                        {activeTab === "phone" ? (
                          <motion.div
                            key="phone-field"
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 8 }}
                            transition={{ duration: 0.15 }}
                          >
                            <label htmlFor="app-status-phone" className="block text-xs font-black text-[var(--color-text-body)] uppercase tracking-widest mb-2">
                              Phone Number
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                                <Phone className="w-4 h-4" />
                              </span>
                              <input
                                ref={phoneInputRef}
                                id="app-status-phone"
                                type="tel"
                                placeholder="e.g. 2348031234567"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-[var(--color-mortar-50)] border border-[var(--color-border)] rounded-xl text-base text-[var(--color-text-body)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-clay-500)] focus:ring-1 focus:ring-[var(--color-clay-500)] transition-colors"
                              />
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="account-field"
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 8 }}
                            transition={{ duration: 0.15 }}
                          >
                            <label htmlFor="app-status-account" className="block text-xs font-black text-[var(--color-text-body)] uppercase tracking-widest mb-2">
                              AMB Account Number
                            </label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                                <CreditCard className="w-4 h-4" />
                              </span>
                              <input
                                id="app-status-account"
                                type="text"
                                placeholder="Enter your account number"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-[var(--color-mortar-50)] border border-[var(--color-border)] rounded-xl text-base text-[var(--color-text-body)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-clay-500)] focus:ring-1 focus:ring-[var(--color-clay-500)] transition-colors"
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {errorMsg && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs font-bold text-[var(--color-red)] pl-1"
                        >
                          ⚠️ {errorMsg}
                        </motion.p>
                      )}

                      <div className="pt-2">
                        <button
                          type="submit"
                          className="w-full py-3.5 rounded-xl bg-[var(--color-ink-700)] text-white text-sm font-black tracking-wide hover:bg-[var(--color-ink-600)] transition-colors shadow-[0_8px_24px_rgba(16,25,43,0.2)] hover:shadow-[0_12px_32px_rgba(16,25,43,0.3)]"
                        >
                          Track My Application →
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {state === "loading" && (
                  <motion.div key="loading" variants={contentVariants} initial="hidden" animate="visible" exit="exit" className="py-12 flex flex-col items-center justify-center">
                    <div className="relative w-16 h-16 mb-6">
                      <div className="absolute inset-0 rounded-full border-4 border-[var(--color-mortar-100)]" />
                      <div className="absolute inset-0 rounded-full border-4 border-t-[var(--color-clay-500)] animate-spin" />
                    </div>
                    <p className="text-sm font-bold text-[var(--color-text-heading)] uppercase tracking-widest animate-pulse">Retrieving status…</p>
                  </motion.div>
                )}

                {state === "result" && result && (
                  <motion.div key="result" variants={contentVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                    <div className="p-5 bg-[var(--color-mortar-50)] rounded-2xl border border-[var(--color-border)]">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[var(--color-clay-500)]/10 text-[var(--color-clay-500)] text-[10px] font-black uppercase tracking-widest mb-3">Active Stage</span>
                      <h3 className="text-lg font-black text-[var(--color-text-heading)] mb-1">{result.status}</h3>
                      <p className="text-sm text-[var(--color-text-body)] leading-relaxed font-medium">{result.description}</p>
                    </div>

                    {result.step !== null && result.total_steps > 0 && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-[var(--color-text-muted)] uppercase tracking-widest">Progress</span>
                          <span className="text-[var(--color-clay-500)] font-black">{result.step} of {result.total_steps} Stages</span>
                        </div>
                        <div className="h-2 w-full bg-[var(--color-mortar-100)] rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${(result.step / result.total_steps) * 100}%` }} transition={{ duration: 0.5, ease: "easeOut" }} className="h-full bg-[var(--color-clay-500)] rounded-full" />
                        </div>
                      </div>
                    )}

                    <div className="pt-2 flex gap-3">
                      <button type="button" onClick={handleReset} className="flex-1 py-3 rounded-xl border border-[var(--color-border)] text-[var(--color-text-body)] text-sm font-bold hover:bg-[var(--color-mortar-50)] transition-colors">← Track Another</button>
                      <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-[var(--color-ink-700)] text-white text-sm font-bold hover:bg-[var(--color-ink-600)] transition-colors">Close Window</button>
                    </div>
                  </motion.div>
                )}

                {state === "not-found" && (
                  <motion.div key="not-found" variants={contentVariants} initial="hidden" animate="visible" exit="exit" className="py-6 text-center space-y-5">
                    <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto text-amber-500">
                      <Search className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base font-black text-[var(--color-text-heading)] uppercase tracking-wider">No Application Found</h3>
                      <p className="text-sm text-[var(--color-text-muted)] max-w-sm mx-auto font-medium leading-relaxed">We couldn't find an active mortgage application matching those details. Please check the inputs or contact support.</p>
                    </div>
                    <button type="button" onClick={handleReset} className="w-full py-3 rounded-xl border border-[var(--color-border)] text-[var(--color-text-body)] text-sm font-bold hover:bg-[var(--color-mortar-50)] transition-colors">← Double Check Details</button>
                  </motion.div>
                )}

                {state === "error" && (
                  <motion.div key="error" variants={contentVariants} initial="hidden" animate="visible" exit="exit" className="py-6 text-center space-y-6">
                    <div className="w-14 h-14 rounded-full bg-[var(--color-red)]/10 flex items-center justify-center mx-auto text-[var(--color-red)]">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base font-black text-[var(--color-text-heading)] uppercase tracking-wider">Query Failed</h3>
                      <p className="text-sm text-[var(--color-text-muted)] max-w-sm mx-auto font-medium leading-relaxed">{errorMsg || "An error occurred. Please try again later."}</p>
                      <div className="bg-[var(--color-mortar-50)] p-4 rounded-xl border border-[var(--color-border)] text-left mt-4 space-y-2">
                        <p className="text-[var(--color-text-muted)] text-[10px] font-black uppercase tracking-widest mb-2">Need Help?</p>
                        <a href="tel:+2349155553558" className="flex items-center gap-3 text-[var(--color-clay-500)] text-sm font-bold hover:text-[var(--color-clay-600)] transition-colors">
                          <Phone className="w-3.5 h-3.5" /> +234 915 555 3558
                        </a>
                      </div>
                    </div>
                    <button type="button" onClick={handleReset} className="w-full py-3 rounded-xl border border-[var(--color-border)] text-[var(--color-text-body)] text-sm font-bold hover:bg-[var(--color-mortar-50)] transition-colors">← Try Again</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}

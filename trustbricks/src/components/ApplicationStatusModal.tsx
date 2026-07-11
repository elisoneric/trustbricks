"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Phone, CreditCard, Lock, Search, CheckCircle2 } from "lucide-react";

/* ─── TYPES ──────────────────────────────────────────────────────────────── */
interface Application {
  reference: string;
  application_type: string;
  label: string;
  description: string;
  step: number;
  total_steps: number;
  last_updated: string;
}

interface StatusResponse {
  found: boolean;
  applications: Application[];
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
  const [phone, setPhone] = useState("");
  const [bvn, setBvn] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"phone" | "bvn">("phone");

  const overlayRef = useRef<HTMLDivElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  /* Reset state when modal opens */
  useEffect(() => {
    if (isOpen) {
      setState("form");
      setPhone("");
      setBvn("");
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

    // Validation
    const trimPhone = phone.trim();
    const trimBvn = bvn.trim();

    if (!trimPhone && !trimBvn) {
      setErrorMsg("Please enter at least one field — phone number or BVN.");
      return;
    }
    if (trimPhone && !/^0[789][01]\d{8}$/.test(trimPhone)) {
      setErrorMsg("Enter a valid Nigerian phone number (e.g. 08012345678).");
      return;
    }
    if (trimBvn && !/^\d{11}$/.test(trimBvn)) {
      setErrorMsg("BVN must be exactly 11 digits.");
      return;
    }

    setErrorMsg("");
    setState("loading");

    try {
      const body: Record<string, string> = {};
      if (trimPhone) body.phone_number = trimPhone;
      if (trimBvn)   body.bvn = trimBvn;

      const res = await fetch(
        "https://dev.trustbrickspropertieslimited.com.ng/api/portal/status-check",
        {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(body),
        }
      );

      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Too many requests. Please wait a moment and try again.");
      }
      if (res.status === 422) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Invalid input. Please check your details.");
      }
      if (!res.ok) {
        throw new Error("Something went wrong. Please try again later.");
      }

      const data: StatusResponse = await res.json();

      if (data.found && data.applications.length > 0) {
        setApplications(data.applications);
        setState("result");
      } else {
        setState("not-found");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      setState("form");
    }
  };

  const handleReset = () => {
    setState("form");
    setPhone("");
    setBvn("");
    setErrorMsg("");
    setTimeout(() => phoneInputRef.current?.focus(), 100);
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-NG", {
        day: "numeric", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
    } catch { return iso; }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          key="overlay"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: "rgba(16, 25, 43, 0.65)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
          role="dialog"
          aria-modal="true"
          aria-label="Check application status"
        >
          <motion.div
            key="panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full sm:max-w-lg bg-[var(--color-card)] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(16,25,43,0.3)]"
          >
            {/* ── TOP GRADIENT HEADER ── */}
            <div className="relative px-7 pt-8 pb-6 bg-gradient-to-br from-[var(--color-ink-700)] via-[var(--color-ink-600)] to-[var(--color-ink-500)] overflow-hidden">
              {/* Decorative orbs */}
              <div className="absolute top-[-20px] right-[-20px] w-40 h-40 rounded-full bg-[var(--color-clay-500)]/15 blur-[50px] pointer-events-none" />
              <div className="absolute bottom-[-10px] left-[-10px] w-28 h-28 rounded-full bg-[var(--color-ink-400)]/15 blur-[40px] pointer-events-none" />

              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200 text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                aria-label="Close modal"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>

              {/* Icon badge */}
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-clay-500)] flex items-center justify-center mb-4 shadow-[0_8px_24px_rgba(184,80,46,0.4)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <h2 className="text-xl font-black text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>
                Check My Application
              </h2>
              <p className="text-white/55 text-sm font-medium">
                Enter your phone number or BVN to track your application stage.
              </p>
            </div>

            {/* ── BODY ── */}
            <div className="px-7 py-6">
              <AnimatePresence mode="wait">

                {/* ── FORM STATE ── */}
                {state === "form" && (
                  <motion.div key="form" variants={contentVariants} initial="hidden" animate="visible" exit="exit">

                    {/* Tab switcher */}
                    <div className="flex gap-1 p-1 bg-[var(--color-mortar-100)] rounded-xl mb-6">
                      {(["phone", "bvn"] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={[
                            "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-bold rounded-lg transition-all duration-200",
                            activeTab === tab
                              ? "bg-[var(--color-card)] text-[var(--color-ink-700)] shadow-sm"
                              : "text-[var(--color-text-muted)] hover:text-[var(--color-text-body)]",
                          ].join(" ")}
                        >
                          {tab === "phone" ? <Phone className="w-3.5 h-3.5" /> : <CreditCard className="w-3.5 h-3.5" />}
                          {tab === "phone" ? "Phone Number" : "BVN"}
                        </button>
                      ))}
                    </div>

                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                      {activeTab === "phone" ? (
                        <div>
                          <label htmlFor="app-status-phone" className="block text-xs font-black text-[var(--color-text-body)] uppercase tracking-widest mb-2">
                            Phone Number
                          </label>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-sm font-bold pointer-events-none select-none font-tabular">
                              +234
                            </div>
                            <input
                              ref={phoneInputRef}
                              id="app-status-phone"
                              type="tel"
                              inputMode="numeric"
                              placeholder="08012345678"
                              value={phone}
                              onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 11)); setErrorMsg(""); }}
                              className="w-full pl-14 pr-4 py-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-mortar-50)] text-[var(--color-text-heading)] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-clay-500)]/40 focus:border-[var(--color-clay-500)] transition-all placeholder:text-[var(--color-mortar-300)]"
                            />
                          </div>
                          <p className="text-[11px] text-[var(--color-text-muted)] mt-2 font-medium">Nigerian number starting with 0 (11 digits)</p>
                        </div>
                      ) : (
                        <div>
                          <label htmlFor="app-status-bvn" className="block text-xs font-black text-[var(--color-text-body)] uppercase tracking-widest mb-2">
                            BVN
                          </label>
                          <input
                            id="app-status-bvn"
                            type="text"
                            inputMode="numeric"
                            placeholder="12345678901"
                            value={bvn}
                            onChange={(e) => { setBvn(e.target.value.replace(/\D/g, "").slice(0, 11)); setErrorMsg(""); }}
                            className="w-full px-4 py-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-mortar-50)] text-[var(--color-text-heading)] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-clay-500)]/40 focus:border-[var(--color-clay-500)] transition-all placeholder:text-[var(--color-mortar-300)]"
                          />
                          <p className="text-[11px] text-[var(--color-text-muted)] mt-2 font-medium">Your 11-digit Bank Verification Number</p>
                        </div>
                      )}

                      {/* Optional second field (subtle) */}
                      <button
                        type="button"
                        className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-clay-500)] font-semibold underline underline-offset-2 transition-colors"
                        onClick={() => setActiveTab(activeTab === "phone" ? "bvn" : "phone")}
                      >
                        + Also add {activeTab === "phone" ? "BVN" : "phone"} for better accuracy
                      </button>

                      {/* Error message */}
                      <AnimatePresence>
                        {errorMsg && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-start gap-3 px-4 py-3 bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 rounded-xl"
                          >
                            <span className="text-[var(--color-error)] mt-0.5 shrink-0">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M7 4v4M7 9.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                            </span>
                            <p className="text-[var(--color-error)] text-xs font-semibold">{errorMsg}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3.5 rounded-xl bg-[var(--color-ink-700)] text-white text-sm font-black tracking-wide hover:bg-[var(--color-ink-600)] transition-colors shadow-[0_8px_24px_rgba(16,25,43,0.2)] hover:shadow-[0_12px_32px_rgba(16,25,43,0.3)]"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Track My Application →
                      </motion.button>
                    </form>

                    {/* Privacy note */}
                    <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-[var(--color-text-muted)] mt-5 font-medium">
                      <Lock className="w-3 h-3" />
                      Fully encrypted. Your data is never stored.
                    </p>
                  </motion.div>
                )}

                {/* ── LOADING STATE ── */}
                {state === "loading" && (
                  <motion.div key="loading" variants={contentVariants} initial="hidden" animate="visible" exit="exit">
                    <Spinner />
                  </motion.div>
                )}

                {/* ── RESULT STATE ── */}
                {state === "result" && (
                  <motion.div key="result" variants={contentVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-moss)]/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-[var(--color-moss)]" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-[var(--color-text-heading)]">Application Found</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{applications.length} active record{applications.length !== 1 ? "s" : ""}</p>
                      </div>
                    </div>

                    <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1 scroll-smooth">
                      {applications.map((app, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-mortar-50)] p-5 relative overflow-hidden"
                        >
                          {/* Top accent */}
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--color-clay-500)] to-[var(--color-clay-200)]" />

                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div>
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[var(--color-clay-500)]/10 text-[var(--color-clay-500)] text-[10px] font-black uppercase tracking-widest mb-2">
                                {app.application_type}
                              </span>
                              <p className="text-base font-black text-[var(--color-text-heading)] leading-tight">{app.label}</p>
                            </div>
                            <span className="text-[10px] font-bold text-[var(--color-text-muted)] bg-[var(--color-card)] border border-[var(--color-border)] px-2.5 py-1.5 rounded-lg shrink-0 font-tabular">
                              {app.reference}
                            </span>
                          </div>

                          <StepProgressBar step={app.step} totalSteps={app.total_steps} />

                          <p className="text-sm text-[var(--color-text-body)] font-medium leading-relaxed mt-4 pt-4 border-t border-[var(--color-border)]">
                            {app.description}
                          </p>

                          <p className="text-[11px] text-[var(--color-text-muted)] font-semibold mt-3">
                            Last updated: {formatDate(app.last_updated)}
                          </p>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="flex-1 py-3 rounded-xl border border-[var(--color-border)] text-[var(--color-text-body)] text-sm font-bold hover:bg-[var(--color-mortar-50)] transition-colors"
                      >
                        Search Again
                      </button>
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-[var(--color-ink-700)] text-white text-sm font-bold hover:bg-[var(--color-ink-600)] transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── NOT FOUND STATE ── */}
                {state === "not-found" && (
                  <motion.div key="not-found" variants={contentVariants} initial="hidden" animate="visible" exit="exit" className="text-center py-6">
                    <div className="w-16 h-16 rounded-3xl bg-[var(--color-mortar-100)] flex items-center justify-center mx-auto mb-5">
                      <Search className="w-7 h-7 text-[var(--color-text-muted)]" />
                    </div>

                    <h3 className="text-lg font-black text-[var(--color-text-heading)] mb-2">No Application Found</h3>
                    <p className="text-[var(--color-text-muted)] text-sm font-medium leading-relaxed mb-6 max-w-xs mx-auto">
                      We couldn't find an application matching your details. Double-check your information or reach out to our team.
                    </p>

                    {/* Support contact card */}
                    <div className="bg-[var(--color-ink-700)] rounded-2xl p-5 text-left mb-5">
                      <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-2">Need Help?</p>
                      <p className="text-white font-bold text-sm mb-3">Talk to our support team directly</p>
                      <div className="space-y-2">
                        <a
                          href="tel:+2349155553558"
                          className="flex items-center gap-3 text-[var(--color-clay-200)] text-sm font-bold hover:text-[var(--color-clay-100)] transition-colors font-tabular"
                        >
                          <span className="w-7 h-7 rounded-full bg-[var(--color-clay-500)]/15 flex items-center justify-center shrink-0">
                            <Phone className="w-3.5 h-3.5" />
                          </span>
                          +234 915 555 3558
                        </a>
                        <a
                          href="mailto:support@trustbrickspropertieslimited.com.ng"
                          className="flex items-center gap-3 text-white/60 text-sm font-medium hover:text-white/90 transition-colors"
                        >
                          <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                          support@trustbricksproperties…
                        </a>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full py-3 rounded-xl border border-[var(--color-border)] text-[var(--color-text-body)] text-sm font-bold hover:bg-[var(--color-mortar-50)] transition-colors"
                    >
                      ← Try Again
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

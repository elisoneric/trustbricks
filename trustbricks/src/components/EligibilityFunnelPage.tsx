"use client";

import { useReducer, useCallback, useId, useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Landmark, Waves, Mountain, Wheat, Bell, PartyPopper, CheckCircle2, ShieldCheck, ArrowLeft, Lock } from "lucide-react";
import { processMortgageLead } from "@/app/actions/leadRouting";
import { PFA_OPTIONS, PFA_RULES, FALLBACK_BRANCHES, checkEligibility, type BranchSlug, type PfaSlug, type EligibilityResult } from "./EligibilityFunnel";

const BRANCH_ICONS: Record<string, React.ReactNode> = {
  abuja:   <Landmark className="w-6 h-6" />,
  lagos:   <Waves className="w-6 h-6" />,
  kaduna:  <Wheat className="w-6 h-6" />,
  kano:    <Landmark className="w-6 h-6" />,
  kwara:   <Wheat className="w-6 h-6" />,
  yola:    <Mountain className="w-6 h-6" />,
  benue:   <Wheat className="w-6 h-6" />,
  ogun:    <Mountain className="w-6 h-6" />,
  lokoja:  <Waves className="w-6 h-6" />,
  calabar: <Waves className="w-6 h-6" />,
  minna:   <Landmark className="w-6 h-6" />,
  ibadan:  <Landmark className="w-6 h-6" />,
  ekiti:   <Mountain className="w-6 h-6" />,
  bauchi:  <Mountain className="w-6 h-6" />,
};

interface LeadFormData {
  fullName:     string;
  phone:        string;
  email:        string;
  employer:     string;
  employerType: string;
  ndpaConsent:  boolean;
}

const INITIAL_LEAD_FORM: LeadFormData = {
  fullName:     "",
  phone:        "",
  email:        "",
  employer:     "",
  employerType: "",
  ndpaConsent:  false,
};

type FunnelStep = 1 | 2 | 3 | 4 | 5 | "success" | "ineligible";

interface FunnelState {
  step:              FunnelStep;
  branch:            string | null;
  pfa:               PfaSlug | null;
  rsaRaw:            string;
  yearsInServiceRaw: string;
  yearsToRetireRaw:  string;
  result:            EligibilityResult | null;
  leadForm:          LeadFormData;
  submitting:        boolean;
  errors:            Partial<Record<keyof LeadFormData | "consent", string>>;
}

type FunnelAction =
  | { type: "SET_BRANCH";    branch: string }
  | { type: "SET_PFA";       pfa: PfaSlug }
  | { type: "SET_RSA_RAW";   value: string }
  | { type: "SET_YEARS_IN_SERVICE"; value: string }
  | { type: "SET_YEARS_TO_RETIRE"; value: string }
  | { type: "VALIDATE";      result: EligibilityResult }
  | { type: "SET_STEP";      step: FunnelStep }
  | { type: "UPDATE_LEAD";   field: keyof LeadFormData; value: any }
  | { type: "SET_ERRORS";    errors: Partial<Record<keyof LeadFormData | "consent", string>> }
  | { type: "SUBMITTING" }
  | { type: "RESET" };

const INITIAL_STATE: FunnelState = {
  step: 1, branch: null, pfa: null, rsaRaw: "", yearsInServiceRaw: "", yearsToRetireRaw: "",
  result: null, leadForm: INITIAL_LEAD_FORM, submitting: false, errors: {},
};

function funnelReducer(state: FunnelState, action: FunnelAction): FunnelState {
  switch (action.type) {
    case "SET_BRANCH":
      return { ...state, branch: action.branch };
    case "SET_PFA":
      return { ...state, pfa: action.pfa };
    case "SET_RSA_RAW":
      return { ...state, rsaRaw: action.value };
    case "SET_YEARS_IN_SERVICE":
      return { ...state, yearsInServiceRaw: action.value };
    case "SET_YEARS_TO_RETIRE":
      return { ...state, yearsToRetireRaw: action.value };
    case "VALIDATE":
      return {
        ...state,
        result: action.result,
        step:   action.result.isEligible ? "success" : "ineligible",
      };
    case "SET_STEP":
      return { ...state, step: action.step };
    case "UPDATE_LEAD":
      return {
        ...state,
        leadForm: { ...state.leadForm, [action.field]: action.value },
        errors:   { ...state.errors, [action.field]: undefined, consent: undefined },
      };
    case "SET_ERRORS":
      return { ...state, errors: action.errors, submitting: false };
    case "SUBMITTING":
      return { ...state, submitting: true };
    case "RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
}

function formatNaira(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return "₦" + Number(digits).toLocaleString("en-NG");
}

function parseNaira(raw: string): number {
  return Number(raw.replace(/[^0-9]/g, ""));
}

export default function EligibilityFunnelPage({ branches = [] }: { branches?: any[] }) {
  const activeBranches = branches.length > 0 ? branches : FALLBACK_BRANCHES;
  const [state, dispatch] = useReducer(funnelReducer, INITIAL_STATE);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStep1Next = () => {
    if (!state.branch) return;
    dispatch({ type: "SET_STEP", step: 2 });
  };

  const handleStep2Next = () => {
    if (!state.pfa) return;
    dispatch({ type: "SET_STEP", step: 3 });
  };

  const handleStep3Validate = () => {
    if (!state.pfa) return;
    const balance = parseNaira(state.rsaRaw);
    const yrsService = parseInt(state.yearsInServiceRaw, 10);
    const yrsRetire = parseInt(state.yearsToRetireRaw, 10);
    if (!balance || isNaN(yrsService) || isNaN(yrsRetire)) return;
    const result = checkEligibility(state.pfa, balance, yrsService, yrsRetire);
    dispatch({ type: "VALIDATE", result });
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Partial<Record<keyof LeadFormData | "consent", string>> = {};

    if (!state.leadForm.fullName.trim()) {
      errors.fullName = "Please enter your full name.";
    }
    if (!/^\+?[0-9\s\-()]{7,15}$/.test(state.leadForm.phone.trim())) {
      errors.phone = "Enter a valid Nigerian phone number.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.leadForm.email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    if (!state.leadForm.ndpaConsent) {
      errors.consent = "You must consent to NDPA data processing to submit your request.";
    }

    if (Object.keys(errors).length > 0) {
      dispatch({ type: "SET_ERRORS", errors });
      return;
    }

    dispatch({ type: "SUBMITTING" });

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("branch_id", state.branch || "Abuja");
        const pfaOption = PFA_OPTIONS.find((o) => o.slug === state.pfa);
        formData.append("pfa_id", pfaOption?.label || state.pfa || "Stanbic IBTC");
        formData.append("rsa_balance", String(state.result?.rsaBalance ?? parseNaira(state.rsaRaw) ?? 0));
        formData.append("years_in_work", String(state.result?.yearsInService ?? parseInt(state.yearsInServiceRaw, 10) ?? 0));
        formData.append("years_to_retire", String(state.result?.yearsToRetire ?? parseInt(state.yearsToRetireRaw, 10) ?? 0));
        formData.append("full_name", state.leadForm.fullName);
        formData.append("phone", state.leadForm.phone);
        formData.append("email", state.leadForm.email);
        formData.append("employer_type", state.leadForm.employer || "Private Sector");

        const response = await processMortgageLead(formData);

        if (response.success) {
          const nameEncoded = encodeURIComponent(state.leadForm.fullName);
          const leadIdEncoded = encodeURIComponent(response.leadId || "");
          router.push(`/apply/success?name=${nameEncoded}&leadId=${leadIdEncoded}`);
        } else {
          dispatch({ 
            type: "SET_ERRORS", 
            errors: { fullName: response.message || "Failed to process lead." } 
          });
        }
      } catch (error) {
        dispatch({ 
          type: "SET_ERRORS", 
          errors: { fullName: "An unexpected error occurred. Please try again." } 
        });
      }
    });
  };

  const getStepProgress = () => {
    if (state.step === 1) return 20;
    if (state.step === 2) return 40;
    if (state.step === 3) return 60;
    if (state.step === "success" || state.step === "ineligible") return 80;
    if (state.step === 5) return 100;
    return 0;
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* HEADER BADGE */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-clay-50)] border border-[var(--color-clay-200)] text-[var(--color-clay-700)] text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-[var(--color-clay-500)]" />
          <span>PenCom RSA Equity Scheme Verification</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[var(--color-text-heading)] tracking-tight">
          Check Your Pension Equity Eligibility
        </h1>
        <p className="mt-2 text-base text-[var(--color-text-muted)] max-w-2xl mx-auto">
          Calculate how much you can unlock from your RSA balance to fund your home deposit under approved PenCom guidelines.
        </p>
      </div>

      {/* PROGRESS BAR */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-4 sm:p-6 mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
            Verification Step
          </span>
          <span className="text-xs font-black text-[var(--color-clay-500)]">
            {getStepProgress()}% Completed
          </span>
        </div>
        <div className="w-full h-2.5 bg-[var(--color-mortar-100)] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--color-clay-500)] to-[var(--color-clay-200)] rounded-full"
            animate={{ width: `${getStepProgress()}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <AnimatePresence mode="wait">

          {/* STEP 1 — BRANCH */}
          {state.step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="text-xs font-bold text-[var(--color-clay-500)] uppercase tracking-wider">Step 1 of 5</span>
                <h2 className="text-2xl font-black text-[var(--color-text-heading)] mt-1">Select Your Nearest Regional Hub</h2>
                <p className="text-sm text-[var(--color-text-muted)]">Choose the office location that handles your state.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {activeBranches.map((b: any) => {
                  const slug = b.slug || b.id;
                  const name = b.name;
                  const isSelected = state.branch === slug;
                  return (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => dispatch({ type: "SET_BRANCH", branch: slug })}
                      className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-[var(--color-clay-500)] bg-[var(--color-clay-50)] ring-2 ring-[var(--color-clay-500)]"
                          : "border-[var(--color-border)] hover:border-[var(--color-ink-300)] bg-white"
                      }`}
                    >
                      <div className={`mb-2 ${isSelected ? "text-[var(--color-clay-600)]" : "text-[var(--color-ink-500)]"}`}>
                        {BRANCH_ICONS[slug] || <Landmark className="w-6 h-6" />}
                      </div>
                      <span className="font-bold text-sm text-[var(--color-text-heading)]">{name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!state.branch}
                  onClick={handleStep1Next}
                  className="px-8 py-3.5 rounded-xl bg-[var(--color-clay-500)] text-white font-bold text-sm tracking-wide disabled:opacity-40 hover:bg-[var(--color-clay-600)] transition-colors shadow-md"
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2 — PFA */}
          {state.step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_STEP", step: 1 })}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] mb-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Branch
                </button>
                <span className="block text-xs font-bold text-[var(--color-clay-500)] uppercase tracking-wider">Step 2 of 5</span>
                <h2 className="text-2xl font-black text-[var(--color-text-heading)] mt-1">Select Your Pension Fund Administrator (PFA)</h2>
                <p className="text-sm text-[var(--color-text-muted)]">PenCom rules vary depending on your administrator.</p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-body)]">
                  PFA Administrator
                </label>
                <select
                  value={state.pfa || ""}
                  onChange={(e) => dispatch({ type: "SET_PFA", pfa: e.target.value as PfaSlug })}
                  className="w-full px-4 py-3.5 bg-white border border-[var(--color-border)] rounded-xl text-base font-medium text-[var(--color-text-heading)] focus:ring-2 focus:ring-[var(--color-clay-500)] outline-none"
                >
                  <option value="">Select your PFA...</option>
                  {PFA_OPTIONS.map((opt) => (
                    <option key={opt.slug} value={opt.slug}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_STEP", step: 1 })}
                  className="px-5 py-3 text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)]"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={!state.pfa}
                  onClick={handleStep2Next}
                  className="px-8 py-3.5 rounded-xl bg-[var(--color-clay-500)] text-white font-bold text-sm tracking-wide disabled:opacity-40 hover:bg-[var(--color-clay-600)] transition-colors shadow-md"
                >
                  Next Step →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 — RSA & SERVICE */}
          {state.step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_STEP", step: 2 })}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] mb-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to PFA
                </button>
                <span className="block text-xs font-bold text-[var(--color-clay-500)] uppercase tracking-wider">Step 3 of 5</span>
                <h2 className="text-2xl font-black text-[var(--color-text-heading)] mt-1">Enter Your RSA & Career Details</h2>
                <p className="text-sm text-[var(--color-text-muted)]">PenCom requires a minimum of 5 years service and more than 3 years to retirement.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-body)] mb-1.5">
                    Estimated RSA Balance (₦)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₦12,500,000"
                    value={formatNaira(state.rsaRaw)}
                    onChange={(e) => dispatch({ type: "SET_RSA_RAW", value: e.target.value })}
                    className="w-full px-4 py-3.5 bg-white border border-[var(--color-border)] rounded-xl text-lg font-bold text-[var(--color-text-heading)] focus:ring-2 focus:ring-[var(--color-clay-500)] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-body)] mb-1.5">
                      Years in Continuous Service
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      placeholder="e.g. 7"
                      value={state.yearsInServiceRaw}
                      onChange={(e) => dispatch({ type: "SET_YEARS_IN_SERVICE", value: e.target.value })}
                      className="w-full px-4 py-3.5 bg-white border border-[var(--color-border)] rounded-xl text-base font-bold text-[var(--color-text-heading)] focus:ring-2 focus:ring-[var(--color-clay-500)] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-body)] mb-1.5">
                      Years Left Until Retirement
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      placeholder="e.g. 15"
                      value={state.yearsToRetireRaw}
                      onChange={(e) => dispatch({ type: "SET_YEARS_TO_RETIRE", value: e.target.value })}
                      className="w-full px-4 py-3.5 bg-white border border-[var(--color-border)] rounded-xl text-base font-bold text-[var(--color-text-heading)] focus:ring-2 focus:ring-[var(--color-clay-500)] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_STEP", step: 2 })}
                  className="px-5 py-3 text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)]"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={!parseNaira(state.rsaRaw) || !state.yearsInServiceRaw || !state.yearsToRetireRaw}
                  onClick={handleStep3Validate}
                  className="px-8 py-3.5 rounded-xl bg-[var(--color-clay-500)] text-white font-bold text-sm tracking-wide disabled:opacity-40 hover:bg-[var(--color-clay-600)] transition-colors shadow-md"
                >
                  Calculate Eligibility →
                </button>
              </div>
            </motion.div>
          )}

          {/* SUCCESS / ELIGIBLE OUTCOME */}
          {state.step === "success" && (
            <motion.div
              key="success-outcome"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 text-center py-4"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--color-moss)]/10 text-[var(--color-moss)] mx-auto flex items-center justify-center">
                <PartyPopper className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold text-[var(--color-moss)] uppercase tracking-wider">Verification Complete</span>
                <h2 className="text-3xl font-black text-[var(--color-text-heading)] mt-1">You Are Eligible! 🎉</h2>
                <p className="text-sm text-[var(--color-text-muted)] max-w-lg mx-auto mt-2">
                  You meet the 25% RSA Equity Contribution threshold under PenCom guidelines.
                </p>
              </div>

              <div className="bg-[var(--color-clay-50)] border border-[var(--color-clay-200)] rounded-2xl p-6 text-left max-w-md mx-auto space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">Estimated RSA Balance:</span>
                  <span className="font-bold text-[var(--color-text-heading)]">₦{(state.result?.rsaBalance || 0).toLocaleString("en-NG")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">Max 25% Equity Contribution:</span>
                  <span className="font-black text-[var(--color-clay-700)] text-base">
                    ₦{((state.result?.rsaBalance || 0) * 0.25).toLocaleString("en-NG")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--color-text-muted)]">PFA Administrator:</span>
                  <span className="font-bold text-[var(--color-text-heading)]">{state.result?.pfaName}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => dispatch({ type: "SET_STEP", step: 5 })}
                className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[var(--color-clay-500)] text-white font-black text-base hover:bg-[var(--color-clay-600)] transition-colors shadow-lg"
              >
                Proceed to Submit Details →
              </button>
            </motion.div>
          )}

          {/* INELIGIBLE OUTCOME */}
          {state.step === "ineligible" && (
            <motion.div
              key="ineligible-outcome"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 text-center py-4"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--color-warning)]/10 text-[var(--color-warning)] mx-auto flex items-center justify-center">
                <Bell className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-[var(--color-text-heading)]">Verification Notice</h2>
                <p className="text-sm text-[var(--color-text-muted)] max-w-lg mx-auto mt-2">
                  {state.result?.failureReason || "Your current details do not meet the minimum PenCom continuous service or RSA threshold."}
                </p>
              </div>

              <div className="pt-4 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_STEP", step: 3 })}
                  className="px-6 py-3 rounded-xl border border-[var(--color-border)] text-sm font-bold text-[var(--color-text-heading)]"
                >
                  Adjust Numbers
                </button>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "SET_STEP", step: 5 })}
                  className="px-8 py-3 rounded-xl bg-[var(--color-clay-500)] text-white text-sm font-bold"
                >
                  Request Advisory Help →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5 — APPLICANT DETAILS + NDPA CONSENT */}
          {state.step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <span className="text-xs font-bold text-[var(--color-clay-500)] uppercase tracking-wider">Step 5 of 5</span>
                <h2 className="text-2xl font-black text-[var(--color-text-heading)] mt-1">Submit Your Details for Advisory</h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                  A dedicated PenCom mortgage advisor will review your figures and contact you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-body)] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chukwuma Olumide Egbede"
                    value={state.leadForm.fullName}
                    onChange={(e) => dispatch({ type: "UPDATE_LEAD", field: "fullName", value: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-[var(--color-border)] rounded-xl text-base text-[var(--color-text-heading)] focus:ring-2 focus:ring-[var(--color-clay-500)] outline-none"
                  />
                  {state.errors.fullName && <p className="text-xs text-[var(--color-error)] mt-1">{state.errors.fullName}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-body)] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 08031234567"
                      value={state.leadForm.phone}
                      onChange={(e) => dispatch({ type: "UPDATE_LEAD", field: "phone", value: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[var(--color-border)] rounded-xl text-base text-[var(--color-text-heading)] focus:ring-2 focus:ring-[var(--color-clay-500)] outline-none"
                    />
                    {state.errors.phone && <p className="text-xs text-[var(--color-error)] mt-1">{state.errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-body)] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@example.com"
                      value={state.leadForm.email}
                      onChange={(e) => dispatch({ type: "UPDATE_LEAD", field: "email", value: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-[var(--color-border)] rounded-xl text-base text-[var(--color-text-heading)] focus:ring-2 focus:ring-[var(--color-clay-500)] outline-none"
                    />
                    {state.errors.email && <p className="text-xs text-[var(--color-error)] mt-1">{state.errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text-body)] mb-1">
                    Employer / Sector
                  </label>
                  <select
                    value={state.leadForm.employer}
                    onChange={(e) => dispatch({ type: "UPDATE_LEAD", field: "employer", value: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-[var(--color-border)] rounded-xl text-base text-[var(--color-text-heading)] focus:ring-2 focus:ring-[var(--color-clay-500)] outline-none"
                  >
                    <option value="Private Sector">Private Sector</option>
                    <option value="Federal Government">Federal Civil Service</option>
                    <option value="State Government">State Civil Service</option>
                    <option value="Self Employed / Business Owner">Self Employed / Entrepreneur</option>
                  </select>
                </div>

                {/* NDPA CONSENT CHECKBOX */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={state.leadForm.ndpaConsent}
                      onChange={(e) => dispatch({ type: "UPDATE_LEAD", field: "ndpaConsent", value: e.target.checked })}
                      className="mt-1 w-4 h-4 rounded text-[var(--color-clay-500)] focus:ring-[var(--color-clay-500)] border-[var(--color-border)] cursor-pointer"
                    />
                    <span className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                      I consent to Trust Bricks Properties Ltd collecting and processing my data in compliance with the{" "}
                      <strong>Nigeria Data Protection Act (NDPA)</strong> to facilitate my RSA mortgage equity verification as outlined in the{" "}
                      <Link href="/privacy" target="_blank" className="underline text-[var(--color-clay-700)] font-bold hover:text-[var(--color-clay-600)]">
                        Privacy Policy
                      </Link>.
                    </span>
                  </label>
                  {state.errors.consent && (
                    <p className="text-xs font-bold text-[var(--color-error)] mt-1 pl-7">⚠️ {state.errors.consent}</p>
                  )}
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => dispatch({ type: "SET_STEP", step: "success" })}
                    className="px-5 py-3 text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)]"
                  >
                    ← Review Calculation
                  </button>
                  <button
                    type="submit"
                    disabled={state.submitting || isPending || !state.leadForm.ndpaConsent}
                    className="px-10 py-4 rounded-xl bg-[var(--color-clay-500)] text-white font-black text-base hover:bg-[var(--color-clay-600)] disabled:opacity-50 transition-colors shadow-lg"
                  >
                    {state.submitting || isPending ? "Routing Lead..." : "Submit Application →"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

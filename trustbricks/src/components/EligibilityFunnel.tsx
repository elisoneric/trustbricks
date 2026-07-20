"use client";

import { useReducer, useCallback, useId, useTransition, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Landmark, Waves, Mountain, Wheat, Bell, PartyPopper } from "lucide-react";
import { processMortgageLead } from "@/app/actions/leadRouting";

const BRANCH_ICONS: Record<BranchSlug, React.ReactNode> = {
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

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES & CONSTANTS
═══════════════════════════════════════════════════════════════════════════ */

export type BranchSlug = "abuja" | "lagos" | "kano" | "kwara" | "yola" | "benue" | "ogun" | "lokoja" | "calabar" | "minna" | "ibadan" | "ekiti" | "bauchi" | "kaduna";
export type PfaSlug =
  | "stanbic-ibtc"
  | "gt-pension"
  | "trustfund"
  | "nupemco"
  | "tangerine-apt"
  | "norrenberger"
  | "nlpc"
  | "premium"
  | "accessarm"
  | "leadway-pensure"
  | "oak"
  | "citizens"
  | "cardinalstone"
  | "crusader"
  | "fcmb"
  | "fidelity"
  | "npf"
  | "pal"
  | "veritas";

export interface Branch {
  slug: BranchSlug;
  name: string;
  emoji: string;
}

export interface PfaOption {
  slug: PfaSlug;
  label: string;
  /** Sub-group label for grouped select rendering */
  group?: string;
}

export interface PfaRule {
  slug: PfaSlug;
  name: string;
  minBalance: number;
}

/* ── BRANCH REGISTRY (Fallback) ──────────────────────────────────────────────────── */
export const FALLBACK_BRANCHES: Branch[] = [
  { slug: "abuja",    name: "Abuja (FCT)",    emoji: "🏛️" },
  { slug: "lagos",    name: "Lagos",          emoji: "🌊" },
  { slug: "kano",     name: "Kano",           emoji: "🕌" },
  { slug: "kwara",    name: "Kwara",          emoji: "🌴" },
  { slug: "yola",     name: "Yola (Adamawa)", emoji: "🏔️" },
  { slug: "benue",    name: "Benue",          emoji: "🌾" },
  { slug: "ogun",     name: "Ogun",           emoji: "⛰️" },
  { slug: "lokoja",   name: "Lokoja",         emoji: "💧" },
  { slug: "calabar",  name: "Calabar",        emoji: "🌳" },
  { slug: "minna",    name: "Minna",          emoji: "🏛️" },
  { slug: "ibadan",   name: "Ibadan",         emoji: "🏺" },
  { slug: "ekiti",    name: "Ekiti",          emoji: "🏔️" },
  { slug: "bauchi",   name: "Bauchi",         emoji: "🦒" },
  { slug: "kaduna",   name: "Kaduna",         emoji: "🌾" },
];

/* ── PFA REGISTRY ─────────────────────────────────────────────────────── */
export const PFA_OPTIONS: PfaOption[] = [
  { slug: "stanbic-ibtc",    label: "Stanbic IBTC Pension Managers",   group: "Major" },
  { slug: "gt-pension",      label: "Guaranty Trust (GT) Pension Managers", group: "Major" },
  { slug: "accessarm",       label: "AccessARM Pensions",       group: "Major" },
  { slug: "premium",         label: "Premium Pensions",         group: "Major" },
  { slug: "trustfund",       label: "Trustfund Pensions",      group: "Standard" },
  { slug: "nupemco",         label: "NUPEMCO Pensions",         group: "Standard" },
  { slug: "tangerine-apt",   label: "Tangerine APT Pensions",   group: "Standard" },
  { slug: "norrenberger",    label: "Norrenberger Pensions",    group: "Standard" },
  { slug: "nlpc",            label: "NLPC Pensions",            group: "Standard" },
  { slug: "leadway-pensure", label: "Leadway Pensure PFA",      group: "Standard" },
  { slug: "oak",             label: "Oak Pensions",             group: "Standard" },
  { slug: "citizens",        label: "Citizens Pensions",        group: "Standard" },
  { slug: "cardinalstone",   label: "CardinalStone Pensions",   group: "Standard" },
  { slug: "crusader",        label: "Crusader Pensions",        group: "Standard" },
  { slug: "fcmb",            label: "FCMB Pensions",            group: "Standard" },
  { slug: "fidelity",        label: "Fidelity Pension Managers", group: "Standard" },
  { slug: "npf",             label: "NPF Pension",              group: "Standard" },
  { slug: "pal",             label: "PAL Pensions",             group: "Standard" },
  { slug: "veritas",         label: "Veritas Glanvills Pensions", group: "Standard" },
];

/* ── PFA THRESHOLD RULES ─────────────────────────────────────────────── */
export const PFA_RULES: Record<PfaSlug, PfaRule> = {
  "stanbic-ibtc":    { slug: "stanbic-ibtc",    name: "Stanbic IBTC Pension Managers",     minBalance: 500_000 },
  "gt-pension":      { slug: "gt-pension",      name: "Guaranty Trust (GT) Pension",       minBalance: 500_000 },
  "accessarm":       { slug: "accessarm",       name: "AccessARM Pensions",                minBalance: 500_000 },
  "premium":         { slug: "premium",         name: "Premium Pensions",                  minBalance: 500_000 },
  "trustfund":       { slug: "trustfund",       name: "Trustfund Pensions",                minBalance: 500_000 },
  "nupemco":         { slug: "nupemco",         name: "NUPEMCO Pensions",                  minBalance: 500_000 },
  "tangerine-apt":   { slug: "tangerine-apt",   name: "Tangerine APT Pensions",            minBalance: 500_000 },
  "norrenberger":    { slug: "norrenberger",    name: "Norrenberger Pensions",             minBalance: 500_000 },
  "nlpc":            { slug: "nlpc",            name: "NLPC Pensions",                     minBalance: 500_000 },
  "leadway-pensure": { slug: "leadway-pensure", name: "Leadway Pensure PFA",               minBalance: 500_000 },
  "oak":             { slug: "oak",             name: "Oak Pensions",                      minBalance: 500_000 },
  "citizens":        { slug: "citizens",        name: "Citizens Pensions",                 minBalance: 500_000 },
  "cardinalstone":   { slug: "cardinalstone",   name: "CardinalStone Pensions",            minBalance: 500_000 },
  "crusader":        { slug: "crusader",        name: "Crusader Pensions",                 minBalance: 500_000 },
  "fcmb":            { slug: "fcmb",            name: "FCMB Pensions",                     minBalance: 500_000 },
  "fidelity":        { slug: "fidelity",        name: "Fidelity Pension Managers",         minBalance: 500_000 },
  "npf":             { slug: "npf",             name: "NPF Pension",                       minBalance: 500_000 },
  "pal":             { slug: "pal",             name: "PAL Pensions",                      minBalance: 500_000 },
  "veritas":         { slug: "veritas",         name: "Veritas Glanvills Pensions",        minBalance: 500_000 },
};

/* ═══════════════════════════════════════════════════════════════════════════
   CORE ELIGIBILITY ENGINE
   Pure function — no side effects, fully testable.
═══════════════════════════════════════════════════════════════════════════ */
export interface EligibilityResult {
  isEligible: boolean;
  pfaName: string;
  minBalance: number;
  rsaBalance: number;
  shortfall: number;
  failureReason?: string;
  yearsInService?: number;
  yearsToRetire?: number;
}

export function checkEligibility(
  pfaSlug: PfaSlug,
  rsaBalance: number,
  yearsInService: number,
  yearsToRetire: number
): EligibilityResult {
  const rule = PFA_RULES[pfaSlug];
  let isEligible = true;
  let failureReason = "";

  if (yearsInService < 5) {
    isEligible = false;
    failureReason = "You must have at least 5 years in continuous service.";
  } else if (yearsToRetire <= 3) {
    isEligible = false;
    failureReason = "You must have more than 3 years remaining until retirement.";
  }

  return {
    isEligible,
    pfaName:    rule ? rule.name : "Unknown PFA",
    minBalance: rule ? rule.minBalance : 0,
    rsaBalance,
    shortfall:  0,
    yearsInService,
    yearsToRetire,
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   LEAD CAPTURE FORM STATE
═══════════════════════════════════════════════════════════════════════════ */
interface LeadFormData {
  fullName:     string;
  phone:        string;
  email:        string;
  employer:     string;
  employerType: string;
}

const INITIAL_LEAD_FORM: LeadFormData = {
  fullName:     "",
  phone:        "",
  email:        "",
  employer:     "",
  employerType: "",
};

/* ═══════════════════════════════════════════════════════════════════════════
   FUNNEL STATE MACHINE (useReducer)
═══════════════════════════════════════════════════════════════════════════ */
type FunnelStep = 1 | 2 | 3 | 4 | 5 | "success" | "ineligible";

interface FunnelState {
  step:        FunnelStep;
  branch:      string | null;
  pfa:         PfaSlug | null;
  rsaRaw:      string;         // raw string the user types
  yearsInServiceRaw: string;
  yearsToRetireRaw: string;
  result:      EligibilityResult | null;
  leadForm:    LeadFormData;
  submitting:  boolean;
  submitted:   boolean;
  errors:      Partial<Record<keyof LeadFormData, string>>;
}

type FunnelAction =
  | { type: "SET_BRANCH";    branch: string }
  | { type: "SET_PFA";       pfa: PfaSlug }
  | { type: "SET_RSA_RAW";   value: string }
  | { type: "SET_YEARS_IN_SERVICE"; value: string }
  | { type: "SET_YEARS_TO_RETIRE"; value: string }
  | { type: "VALIDATE";      result: EligibilityResult }
  | { type: "SET_STEP";      step: FunnelStep }
  | { type: "UPDATE_LEAD";   field: keyof LeadFormData; value: string }
  | { type: "SET_ERRORS";    errors: Partial<Record<keyof LeadFormData, string>> }
  | { type: "SUBMITTING" }
  | { type: "SUBMITTED" }
  | { type: "RESET" };

const INITIAL_STATE: FunnelState = {
  step: 1, branch: null, pfa: null, rsaRaw: "", yearsInServiceRaw: "", yearsToRetireRaw: "",
  result: null, leadForm: INITIAL_LEAD_FORM, submitting: false,
  submitted: false, errors: {},
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
        errors:   { ...state.errors, [action.field]: undefined },
      };
    case "SET_ERRORS":
      return { ...state, errors: action.errors };
    case "SUBMITTING":
      return { ...state, submitting: true };
    case "SUBMITTED":
      return { ...state, submitting: false, submitted: true, step: 5 };
    case "RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════════ */
/** Format number string as ₦ currency while user types */
function formatNaira(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return "₦" + Number(digits).toLocaleString("en-NG");
}

/** Parse user-typed string back to a plain number */
function parseNaira(raw: string): number {
  return Number(raw.replace(/[^0-9]/g, ""));
}

/** Group PFA options by group label for <select> rendering */
function groupedPfaOptions(): Record<string, PfaOption[]> {
  return PFA_OPTIONS.reduce<Record<string, PfaOption[]>>((acc, opt) => {
    const g = opt.group ?? "Other";
    if (!acc[g]) acc[g] = [];
    acc[g].push(opt);
    return acc;
  }, {});
}

/** Validate the lead form. Returns errors object (empty = valid) */
function validateLeadForm(form: LeadFormData): Partial<Record<keyof LeadFormData, string>> {
  const errors: Partial<Record<keyof LeadFormData, string>> = {};
  if (!form.fullName.trim())
    errors.fullName = "Please enter your full name.";
  if (!/^\+?[0-9\s\-()]{7,15}$/.test(form.phone.trim()))
    errors.phone = "Enter a valid Nigerian phone number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "Enter a valid email address.";
  return errors;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOTION VARIANTS
═══════════════════════════════════════════════════════════════════════════ */
const backdropVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1 },
  exit:    { opacity: 0 },
};

const dialogVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.93, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 30, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    scale: 0.93,
    y: 24,
    transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
  },
};

const stepVariants: Variants = {
  hidden:  { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 240, damping: 26 },
  },
  exit: {
    opacity: 0,
    x: -32,
    transition: { duration: 0.14, ease: [0.4, 0, 1, 1] },
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   STEP CONFIGURATION
═══════════════════════════════════════════════════════════════════════════ */
const NUMERIC_STEPS = [1, 2, 3] as const;

function stepLabel(step: FunnelStep): string {
  const map: Partial<Record<string, string>> = {
    "1": "Select Branch",
    "2": "Select PFA",
    "3": "Enter RSA Balance",
    "success":    "Eligible!",
    "ineligible": "Not Yet Eligible",
    "5":          "Your Details",
  };
  return map[String(step)] ?? "";
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
interface EligibilityFunnelProps {
  isOpen:  boolean;
  onClose: () => void;
  branches?: any[];
}

export default function EligibilityFunnel({ isOpen, onClose, branches = [] }: EligibilityFunnelProps) {
  const activeBranches = branches.length > 0 ? branches : FALLBACK_BRANCHES;
  const [state, dispatch] = useReducer(funnelReducer, INITIAL_STATE);
  const [isPending, startTransition] = useTransition();
  const dialogId = useId();
  const headingId = `${dialogId}-heading`;

  /* ── NAVIGATION ─────────────────────────────────────────────── */
  const goToStep = useCallback((step: FunnelStep) => {
    dispatch({ type: "SET_STEP", step });
  }, []);

  const handleStep1Next = () => {
    if (!state.branch) return;
    goToStep(2);
  };

  const handleStep2Next = () => {
    if (!state.pfa) return;
    goToStep(3);
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
    const errors = validateLeadForm(state.leadForm);
    if (Object.keys(errors).length > 0) {
      dispatch({ type: "SET_ERRORS", errors });
      return;
    }
    dispatch({ type: "SUBMITTING" });

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("branch_id", state.branch || "");
        formData.append("pfa_id", state.pfa || "");
        formData.append("rsa_balance", String(state.result?.rsaBalance || 0));
        formData.append("years_in_work", String(state.result?.yearsInService || 0));
        formData.append("years_to_retire", String(state.result?.yearsToRetire || 0));
        formData.append("full_name", state.leadForm.fullName);
        formData.append("phone", state.leadForm.phone);
        formData.append("email", state.leadForm.email);
        formData.append("employer_type", state.leadForm.employer);

        const response = await processMortgageLead(formData);

        if (response.success) {
          dispatch({ type: "SUBMITTED" });
        } else {
          dispatch({ 
            type: "SET_ERRORS", 
            errors: { fullName: response.message || "Failed to process lead." } 
          });
        }
      } catch (error) {
        dispatch({ 
          type: "SET_ERRORS", 
          errors: { fullName: "An unexpected error occurred." } 
        });
      }
    });
  };

  const handleClose = () => {
    onClose();
    /* reset after exit animation */
    setTimeout(() => dispatch({ type: "RESET" }), 350);
  };

  /* ── RENDER ─────────────────────────────────────────────────── */
  return (
    <AnimatePresence>
      {isOpen && (
        /* BACKDROP */
        <motion.div
          key="backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[rgba(13,31,60,0.85)] backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden="true"
        >
          {/* DIALOG */}
          <motion.div
            key="dialog"
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            className="relative w-full max-w-lg bg-[var(--color-card)] rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-dialog)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── DIALOG HEADER ── */}
            <DialogHeader
              step={state.step}
              headingId={headingId}
              onClose={handleClose}
            />

            {/* ── PROGRESS BAR ── */}
            {(state.step === 1 || state.step === 2 || state.step === 3) && (
              <ProgressBar currentStep={state.step as 1 | 2 | 3} />
            )}

            {/* ── STEP CONTENT ── */}
            <div className="p-6 sm:p-8" style={{ minHeight: "320px" }}>
              <AnimatePresence mode="wait">
                {/* STEP 1 — BRANCH */}
                {state.step === 1 && (
                  <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                    <Step1Branch
                      branches={activeBranches}
                      selected={state.branch}
                      onSelect={(b) => dispatch({ type: "SET_BRANCH", branch: b })}
                      onNext={handleStep1Next}
                    />
                  </motion.div>
                )}

                {/* STEP 2 — PFA */}
                {state.step === 2 && (
                  <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                    <Step2Pfa
                      selected={state.pfa}
                      onSelect={(p) => dispatch({ type: "SET_PFA", pfa: p })}
                      onNext={handleStep2Next}
                      onBack={() => goToStep(1)}
                    />
                  </motion.div>
                )}

                {/* STEP 3 — RSA BALANCE & DETAILS */}
                {state.step === 3 && (
                  <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                    <Step3Balance
                      pfa={state.pfa!}
                      rsaRaw={state.rsaRaw}
                      yearsInServiceRaw={state.yearsInServiceRaw}
                      yearsToRetireRaw={state.yearsToRetireRaw}
                      onChangeRsa={(v) => dispatch({ type: "SET_RSA_RAW", value: v })}
                      onChangeYearsInService={(v) => dispatch({ type: "SET_YEARS_IN_SERVICE", value: v })}
                      onChangeYearsToRetire={(v) => dispatch({ type: "SET_YEARS_TO_RETIRE", value: v })}
                      onValidate={handleStep3Validate}
                      onBack={() => goToStep(2)}
                    />
                  </motion.div>
                )}

                {/* STEP 4A — ELIGIBLE */}
                {state.step === "success" && state.result && (
                  <motion.div key="success" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                    <StepSuccess
                      result={state.result}
                      onContinue={() => goToStep(5)}
                    />
                  </motion.div>
                )}

                {/* STEP 4B — INELIGIBLE */}
                {state.step === "ineligible" && state.result && (
                  <motion.div key="ineligible" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                    <StepIneligible
                      result={state.result}
                      onRestart={() => dispatch({ type: "RESET" })}
                      onClose={handleClose}
                    />
                  </motion.div>
                )}

                {/* STEP 5 — LEAD FORM */}
                {state.step === 5 && (
                  <motion.div key="step5" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                    {state.submitted ? (
                      <StepThankYou onClose={handleClose} />
                    ) : (
                      <Step5LeadForm
                        form={state.leadForm}
                        errors={state.errors}
                        submitting={isPending}
                        onChange={(field, value) =>
                          dispatch({ type: "UPDATE_LEAD", field, value })
                        }
                        onSubmit={handleLeadSubmit}
                        onBack={() =>
                          goToStep(state.result?.isEligible ? "success" : "ineligible")
                        }
                      />
                    )}
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

/* ═══════════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════════════════════════ */

/* ── DIALOG HEADER ───────────────────────────────────────────────────────── */
function DialogHeader({
  step, headingId, onClose,
}: {
  step: FunnelStep;
  headingId: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[var(--color-border)] bg-[var(--color-ink-700)]">
      <div>
        <p
          className="text-[0.6875rem] font-semibold tracking-[0.12em] uppercase text-[var(--color-pencom-gold)] mb-0.5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          PenCom Eligibility Checker
        </p>
        <h2
          id={headingId}
          className="text-base font-bold text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {stepLabel(step)}
        </h2>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close eligibility checker"
        className="flex items-center justify-center w-8 h-8 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-clay-500)]"
      >
        <XIcon className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}

/* ── PROGRESS BAR ────────────────────────────────────────────────────────── */
function ProgressBar({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  const pct = ((currentStep - 1) / 2) * 100;
  return (
    <div className="h-1 bg-[var(--color-mortar-50)] relative" role="progressbar"
      aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={3}
      aria-label={`Step ${currentStep} of 3`}>
      <motion.div
        className="absolute inset-y-0 left-0 bg-[var(--color-clay-500)]"
        initial={{ width: "0%" }}
        animate={{ width: `${pct}%` }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
      />
    </div>
  );
}

/* ── STEP 1: BRANCH ──────────────────────────────────────────────────────── */
function Step1Branch({
  branches, selected, onSelect, onNext,
}: {
  branches: any[];
  selected: string | null;
  onSelect: (b: string) => void;
  onNext: () => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = branches.filter((b) => {
    const term = search.toLowerCase();
    const nameMatch = b.name ? b.name.toLowerCase().includes(term) : false;
    const cityMatch = b.city ? b.city.toLowerCase().includes(term) : false;
    const stateMatch = b.state ? b.state.toLowerCase().includes(term) : false;
    return nameMatch || cityMatch || stateMatch;
  });

  return (
    <div>
      <StepInstruction
        step={1}
        title="Select your nearest branch"
        hint="Your dedicated advisor will be based at this location."
      />
      
      {/* Search Input */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Search by city, branch or state..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 pl-10 rounded-[var(--radius-md)] border-2 border-[var(--color-border)] bg-[var(--color-card)] text-sm text-[var(--color-text-heading)] placeholder-slate-400 focus:outline-none focus:border-[var(--color-clay-500)] focus:ring-2 focus:ring-[var(--color-clay-500)]/20 transition-all font-medium"
          style={{ fontFamily: "var(--font-body)" }}
        />
        <span className="absolute left-3.5 top-3.5 text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3.5 top-3.5 text-[11px] text-slate-400 hover:text-[var(--color-clay-500)] font-bold uppercase tracking-wider transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Scrollable list of branches */}
      <div 
        className="max-h-[220px] overflow-y-auto pr-1 mb-8 border border-[var(--color-border)] rounded-[var(--radius-lg)] bg-[var(--color-card)] divide-y divide-[var(--color-border)] shadow-sm scrollbar-thin"
        role="radiogroup" 
        aria-label="Branch selection"
      >
        {filtered.length > 0 ? (
          filtered.map((b) => {
            const branchId = b.id || b.slug;
            const isSelected = selected === branchId;
            return (
              <button
                key={branchId}
                type="button"
                onClick={() => onSelect(branchId)}
                className={[
                  "w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-all duration-[120ms] text-left",
                  isSelected
                    ? "bg-[var(--color-clay-50)] text-[var(--color-ink-700)]"
                    : "text-[var(--color-text-body)] hover:bg-slate-50/50"
                ].join(" ")}
                style={{ fontFamily: "var(--font-display)" }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[var(--color-clay-500)] text-lg" aria-hidden="true">
                    {b.iconType || b.emoji || BRANCH_ICONS[b.slug as BranchSlug] || "📍"}
                  </span>
                  <div>
                    <p className={isSelected ? "text-[var(--color-ink-700)] font-bold text-sm" : "text-[var(--color-text-heading)] font-semibold text-sm"}>
                      {b.name}
                    </p>
                    {b.city && (
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                        {b.city}, {b.state || ""}
                      </p>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-[var(--color-clay-500)] flex items-center justify-center shrink-0">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs font-medium">
            No matching branches found.
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <PrimaryButton onClick={onNext} disabled={!selected}>
          Continue <ArrowRightSm />
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ── STEP 2: PFA ─────────────────────────────────────────────────────────── */
function Step2Pfa({
  selected, onSelect, onNext, onBack,
}: {
  selected: PfaSlug | null;
  onSelect: (p: PfaSlug) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const grouped = groupedPfaOptions();
  const selectedOption = PFA_OPTIONS.find((o) => o.slug === selected);

  return (
    <div>
      <StepInstruction
        step={2}
        title="Select your Pension Fund Administrator"
        hint="Find your PFA on your pension statement or the PenCom portal."
      />

      <div className="mb-2">
        <label
          htmlFor="pfa-select"
          className="block text-xs font-semibold text-[var(--color-text-body)] mb-1.5"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Your PFA
        </label>
        <select
          id="pfa-select"
          value={selected ?? ""}
          onChange={(e) => onSelect(e.target.value as PfaSlug)}
          aria-label="Select your Pension Fund Administrator"
          className={[
            "w-full px-4 py-3 rounded-[var(--radius-md)] border-2 bg-[var(--color-card)] appearance-none",
            "text-sm text-[var(--color-text-heading)] font-medium",
            "transition-colors duration-[180ms]",
            "focus:outline-none focus:border-[var(--color-clay-500)] focus:ring-2 focus:ring-[var(--color-clay-500)]/20",
            selected ? "border-[var(--color-clay-500)]" : "border-[var(--color-border)]",
          ].join(" ")}
          style={{ fontFamily: "var(--font-body)" }}
        >
          <option value="" disabled>Choose your PFA…</option>
          {Object.entries(grouped).map(([groupName, opts]) => (
            <optgroup key={groupName} label={groupName}>
              {opts.map((opt) => (
                <option key={opt.slug} value={opt.slug}>{opt.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Citizens tier info removed */}
      {/* Threshold preview removed for standard rules */}

      <div className="flex items-center justify-between mt-8">
        <BackButton onClick={onBack} />
        <PrimaryButton onClick={onNext} disabled={!selected}>
          Continue <ArrowRightSm />
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ── STEP 3: RSA BALANCE ─────────────────────────────────────────────────── */
function Step3Balance({
  pfa, rsaRaw, yearsInServiceRaw, yearsToRetireRaw, onChangeRsa, onChangeYearsInService, onChangeYearsToRetire, onValidate, onBack,
}: {
  pfa: PfaSlug;
  rsaRaw: string;
  yearsInServiceRaw: string;
  yearsToRetireRaw: string;
  onChangeRsa: (v: string) => void;
  onChangeYearsInService: (v: string) => void;
  onChangeYearsToRetire: (v: string) => void;
  onValidate: () => void;
  onBack: () => void;
}) {
  const parsedBalance = parseNaira(rsaRaw);
  const isValid = parsedBalance >= 1 && yearsInServiceRaw.trim() !== "" && yearsToRetireRaw.trim() !== "";

  const handleRsaInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeRsa(e.target.value.replace(/\D/g, ""));
  };
  const displayRsa = rsaRaw ? formatNaira(rsaRaw) : "";

  return (
    <div>
      <StepInstruction
        step={3}
        title="Check Eligibility & Calculate Equity"
        hint="Fill in your details to see if you qualify and estimate your 25% contribution."
      />

      <div className="space-y-4 mb-2">
        <div>
          <label className="block text-xs font-semibold text-[var(--color-text-body)] mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
            RSA Balance
          </label>
          <input
            type="text" inputMode="numeric" value={displayRsa} onChange={handleRsaInput} placeholder="₦0"
            className="w-full px-4 py-4 rounded-[var(--radius-md)] border-2 bg-[var(--color-card)] font-tabular text-lg text-[var(--color-text-heading)] font-bold transition-colors duration-[180ms] focus:outline-none focus:border-[var(--color-clay-500)] focus:ring-2 border-[var(--color-border)]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-body)] mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
              Years in Service
            </label>
            <input
              type="number" value={yearsInServiceRaw} onChange={e => onChangeYearsInService(e.target.value)} placeholder="e.g. 6"
              className="w-full px-4 py-4 rounded-[var(--radius-md)] border-2 bg-[var(--color-card)] font-tabular text-lg text-[var(--color-text-heading)] font-bold transition-colors duration-[180ms] focus:outline-none focus:border-[var(--color-clay-500)] focus:ring-2 border-[var(--color-border)]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-body)] mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
              Years to Retire
            </label>
            <input
              type="number" value={yearsToRetireRaw} onChange={e => onChangeYearsToRetire(e.target.value)} placeholder="e.g. 10"
              className="w-full px-4 py-4 rounded-[var(--radius-md)] border-2 bg-[var(--color-card)] font-tabular text-lg text-[var(--color-text-heading)] font-bold transition-colors duration-[180ms] focus:outline-none focus:border-[var(--color-clay-500)] focus:ring-2 border-[var(--color-border)]"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <BackButton onClick={onBack} />
        <PrimaryButton onClick={onValidate} disabled={!isValid}>
          Check Eligibility <ArrowRightSm />
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ── STEP SUCCESS ────────────────────────────────────────────────────────── */
function StepSuccess({
  result, onContinue,
}: {
  result: EligibilityResult;
  onContinue: () => void;
}) {
  return (
    <div className="text-center">
      {/* Checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 20, delay: 0.1 }}
        className="mx-auto mb-5 w-20 h-20 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center"
        aria-hidden="true"
      >
        <svg className="w-10 h-10 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </motion.div>

      <h3 className="text-2xl font-black text-[var(--color-success)] mb-2" style={{ fontFamily: "var(--font-display)" }}>
        You Qualify!
      </h3>
      <p className="text-sm text-[var(--color-text-body)] mb-6" style={{ fontFamily: "var(--font-body)" }}>
        Your RSA balance of{" "}
        <strong className="font-tabular text-[var(--color-text-heading)]">
          ₦{result.rsaBalance.toLocaleString("en-NG")}
        </strong>{" "}
        meets the required length of service and time to retirement.
      </p>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mb-7 text-left">
        <div className="rounded-[var(--radius-md)] bg-[var(--color-success)]/8 border border-[var(--color-success)]/20 p-4">
          <p className="font-tabular text-xl font-black text-[var(--color-success)]" style={{ fontFamily: "var(--font-display)" }}>
            ₦{(result.rsaBalance * 0.25).toLocaleString("en-NG")}
          </p>
          <p className="text-xs text-[var(--color-text-body)] mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
            Potential 25% equity contribution
          </p>
        </div>
        <div className="rounded-[var(--radius-md)] bg-[var(--color-mortar-50)] border border-[var(--color-mortar-100)] p-4">
          <p className="font-tabular text-xl font-black text-[var(--color-ink-700)]" style={{ fontFamily: "var(--font-display)" }}>
            ₦{result.rsaBalance.toLocaleString("en-NG")}
          </p>
          <p className="text-xs text-[var(--color-text-body)] mt-0.5" style={{ fontFamily: "var(--font-body)" }}>
            Your RSA balance
          </p>
        </div>
      </div>

      <PrimaryButton onClick={onContinue} fullWidth>
        Claim Your Spot — Enter Your Details <ArrowRightSm />
      </PrimaryButton>
    </div>
  );
}

/* ── STEP INELIGIBLE ─────────────────────────────────────────────────────── */
function StepIneligible({
  result, onRestart, onClose,
}: {
  result: EligibilityResult;
  onRestart: () => void;
  onClose: () => void;
}) {
  return (
    <div className="text-center">
      {/* X icon */}
      <div
        className="mx-auto mb-5 w-20 h-20 rounded-full bg-[var(--color-error)]/8 flex items-center justify-center"
        aria-hidden="true"
      >
        <XIcon className="w-10 h-10 text-[var(--color-error)]" />
      </div>

      <h3 className="text-xl font-black text-[var(--color-text-heading)] mb-2" style={{ fontFamily: "var(--font-display)" }}>
        Not Yet Eligible
      </h3>
      <p className="text-sm text-[var(--color-text-body)] mb-1" style={{ fontFamily: "var(--font-body)" }}>
        You do not meet the minimum statutory requirements for the PenCom mortgage scheme.
      </p>
      <p className="text-sm text-[var(--color-error)] font-semibold mb-7" style={{ fontFamily: "var(--font-body)" }}>
        {result.failureReason}
      </p>

      <div className="flex flex-col gap-3">
        <a
          href={`https://wa.me/2348030000000?text=${encodeURIComponent("Hello, I'd like to be notified when I'm eligible for the PenCom mortgage scheme.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className={[
            "flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-[var(--radius-pill)]",
            "bg-[#25D366] text-white font-bold text-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]",
          ].join(" ")}
          style={{ fontFamily: "var(--font-display)" }}
        >
          <Bell className="w-4 h-4" />
          Notify Me When I Qualify
        </a>
        <button
          type="button"
          onClick={onRestart}
          className={[
            "w-full px-5 py-3.5 rounded-[var(--radius-pill)] border-2 border-[var(--color-ink-700)]",
            "text-[var(--color-ink-700)] text-sm font-semibold",
            "hover:bg-[var(--color-ink-700)] hover:text-white transition-all duration-[280ms]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink-700)]",
          ].join(" ")}
          style={{ fontFamily: "var(--font-display)" }}
        >
          Try a Different PFA
        </button>
      </div>
    </div>
  );
}

/* ── STEP 5: LEAD FORM ───────────────────────────────────────────────────── */
function Step5LeadForm({
  form, errors, submitting, onChange, onSubmit, onBack,
}: {
  form: LeadFormData;
  errors: Partial<Record<keyof LeadFormData, string>>;
  submitting: boolean;
  onChange: (field: keyof LeadFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}) {
  return (
    <form onSubmit={onSubmit} noValidate>
      <StepInstruction
        step={5}
        title="Your details"
        hint="A dedicated advisor will contact you within 24 hours."
      />

      <div className="flex flex-col gap-4 mb-6">
        <FormField
          id="lead-name"
          label="Full Name *"
          type="text"
          value={form.fullName}
          error={errors.fullName}
          onChange={(v) => onChange("fullName", v)}
          autoComplete="name"
          placeholder="e.g. Chukwuemeka Obi"
        />
        <FormField
          id="lead-phone"
          label="Phone Number *"
          type="tel"
          value={form.phone}
          error={errors.phone}
          onChange={(v) => onChange("phone", v)}
          autoComplete="tel"
          placeholder="e.g. +234 803 000 0000"
        />
        <FormField
          id="lead-email"
          label="Email Address *"
          type="email"
          value={form.email}
          error={errors.email}
          onChange={(v) => onChange("email", v)}
          autoComplete="email"
          placeholder="you@example.com"
        />
        <FormField
          id="lead-employer"
          label="Employer / Organisation"
          type="text"
          value={form.employer}
          onChange={(v) => onChange("employer", v)}
          autoComplete="organization"
          placeholder="e.g. Federal Ministry of Finance"
        />
      </div>

      <div className="flex items-center justify-between">
        <BackButton onClick={onBack} />
        <button
          type="submit"
          disabled={submitting}
          className={[
            "inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-pill)]",
            "bg-[var(--color-clay-500)] text-white text-sm font-bold",
            "shadow-[var(--shadow-action-glow)]",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            "transition-all duration-[280ms] hover:bg-[var(--color-clay-600)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-clay-500)]",
          ].join(" ")}
          style={{ fontFamily: "var(--font-display)" }}
          aria-live="polite"
        >
          {submitting ? (
            <>
              <SpinnerIcon className="w-4 h-4 animate-spin" aria-hidden="true" />
              Submitting…
            </>
          ) : (
            <>Submit My Details <ArrowRightSm /></>
          )}
        </button>
      </div>
    </form>
  );
}

/* ── STEP THANK YOU ──────────────────────────────────────────────────────── */
function StepThankYou({ onClose }: { onClose: () => void }) {
  return (
    <div className="text-center py-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 20 }}
        className="mb-5 flex justify-center text-[var(--color-clay-500)]" aria-hidden="true"
      >
        <PartyPopper className="w-12 h-12" />
      </motion.div>
      <h3 className="text-2xl font-black text-[var(--color-text-heading)] mb-3" style={{ fontFamily: "var(--font-display)" }}>
        We've Got You!
      </h3>
      <p className="text-sm text-[var(--color-text-body)] mb-6" style={{ fontFamily: "var(--font-body)" }}>
        Your dedicated advisor will reach out within <strong>24 hours</strong>.
        Keep an eye on your phone and email.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="px-8 py-3 rounded-[var(--radius-pill)] bg-[var(--color-ink-700)] text-white text-sm font-bold hover:bg-[var(--color-ink-600)] transition-colors duration-[280ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-ink-700)]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Close
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED UI PRIMITIVES
═══════════════════════════════════════════════════════════════════════════ */

function StepInstruction({
  step, title, hint,
}: {
  step: number | string;
  title: string;
  hint: string;
}) {
  return (
    <div className="mb-5">
      <p className="text-[0.6875rem] font-semibold tracking-[0.1em] uppercase text-[var(--color-clay-500)] mb-1" style={{ fontFamily: "var(--font-display)" }}>
        {typeof step === "number" ? `Step ${step}` : ""}
      </p>
      <h3 className="text-base font-bold text-[var(--color-text-heading)] mb-1" style={{ fontFamily: "var(--font-display)" }}>
        {title}
      </h3>
      <p className="text-xs text-[var(--color-text-body)]" style={{ fontFamily: "var(--font-body)" }}>
        {hint}
      </p>
    </div>
  );
}

function FormField({
  id, label, type, value, error, onChange, autoComplete, placeholder,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-[var(--color-text-body)] mb-1.5" style={{ fontFamily: "var(--font-body)" }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={[
          "w-full px-4 py-3 rounded-[var(--radius-md)] border-2 bg-[var(--color-card)] text-sm",
          "text-[var(--color-text-heading)] transition-colors duration-[180ms]",
          "placeholder:text-[var(--color-text-muted)]",
          "focus:outline-none focus:ring-2 focus:ring-[var(--color-clay-500)]/20",
          error
            ? "border-[var(--color-error)] focus:border-[var(--color-error)]"
            : "border-[var(--color-border)] focus:border-[var(--color-clay-500)]",
        ].join(" ")}
        style={{ fontFamily: "var(--font-body)" }}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-[var(--color-error)]" style={{ fontFamily: "var(--font-body)" }}>
          {error}
        </p>
      )}
    </div>
  );
}

function PrimaryButton({
  onClick, disabled, children, fullWidth,
}: {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      className={[
        "inline-flex items-center justify-center gap-2",
        "px-6 py-3 rounded-[var(--radius-pill)]",
        "bg-[var(--color-clay-500)] text-white text-sm font-bold",
        "shadow-[var(--shadow-action-glow)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "transition-all duration-[280ms] hover:bg-[var(--color-clay-600)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-clay-500)]",
        fullWidth ? "w-full" : "",
      ].join(" ")}
      style={{ fontFamily: "var(--font-display)" }}
    >
      {children}
    </motion.button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-body)] hover:text-[var(--color-text-heading)] transition-colors duration-[180ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink-700)] rounded"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
      </svg>
      Back
    </button>
  );
}

/* ── ICONS ──────────────────────────────────────────────────────────────── */
function XIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
    </svg>
  );
}

function ArrowRightSm() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
    </svg>
  );
}

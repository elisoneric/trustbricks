"use client";

import { useState, useRef, useEffect } from "react";
import { motion, Variants, useScroll, useTransform, animate, useReducedMotion } from "framer-motion";
import { ShieldCheck, Landmark, MapPin, ArrowRight, Building2, MousePointer2, Sparkles } from "lucide-react";
import EligibilityFunnel from "./EligibilityFunnel";
import { useRouter } from "next/navigation";

/* ── INTERACTIVE BUTTON COMPONENT ───────────────────────────────────────── */
function MagneticCTA({ onClick, children, className, style, ariaLabel }: any) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reduceMotion) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current!.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x, y });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x * 0.15, y: position.y * 0.15 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={className}
      style={style}
      aria-label={ariaLabel}
    >
      {children}
    </motion.button>
  );
}

/* ── FRAMER MOTION VARIANTS (opacity/transform only — no filter:blur) ───── */
const containerVariants: Variants = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeSlideUp: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
};

const scaleIn: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 130, damping: 24, delay: 0.35 },
  },
};

/* ── TRUST CHIP DATA ─────────────────────────────────────────────────────── */
const TRUST_CHIPS = [
  { icon: <ShieldCheck className="w-4 h-4 text-[var(--color-moss)]" />, label: "PenCom Regulated" },
  { icon: <Landmark className="w-4 h-4 text-[var(--color-ink-400)]" />, label: "19 PFAs Supported" },
  { icon: <MapPin className="w-4 h-4 text-[var(--color-clay-500)]" />, label: "14 Branches" },
  { icon: <Building2 className="w-4 h-4 text-[var(--color-mortar-500)]" />, label: "RC: 9552712" },
];

/* ── COMPONENT ──────────────────────────────────────────────────────────── */
export default function HeroSection({ siteSettings, branches = [] }: { siteSettings?: any, branches?: any[] }) {
  const [funnelOpen, setFunnelOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Case 1: arrived via router.push from another page — URL has ?eligibility=true
    const params = new URLSearchParams(window.location.search);
    if (params.get("eligibility") === "true") {
      setFunnelOpen(true);
      window.history.replaceState({}, "", window.location.pathname);
    }

    // Case 2: already on '/' — navbar fires this custom event directly
    const handleOpen = () => setFunnelOpen(true);
    window.addEventListener("openEligibilityFunnel", handleOpen);
    return () => window.removeEventListener("openEligibilityFunnel", handleOpen);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scaleDown = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleEligibilityClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setFunnelOpen(true);
  };

  const displayTitle = siteSettings?.heroTitle || "Your RSA Can Open Your Front Door";
  const displaySubtitle = siteSettings?.heroSubtitle || "Access up to 25% of your Retirement Savings Account (RSA) as equity contribution towards a residential mortgage under PenCom guidelines. We handle the verification, documentation, and PFA coordination.";
  const displaySlogan = siteSettings?.slogan || "We Value your trust";

  // Word-level reveal (opacity/y only — highlighted words carry the clay gradient)
  const titleWords = displayTitle.split(" ");
  const highlightWords = ["RSA", "Balance", "Front", "Door", "RSA Balance", "Front Door"];

  return (
    <>
      <section
        ref={sectionRef}
        id="hero"
        aria-label="Hero — RSA mortgage eligibility"
        className="relative w-full flex flex-col items-center justify-start overflow-hidden pt-24 pb-24 lg:pt-28 lg:pb-32"
        style={{
          background: "var(--color-card)",
          minHeight: "100vh",
        }}
      >
        {/* ── AMBIENT BACKDROP: brick-course texture + soft color wash ── */}
        <motion.div style={{ y: reduceMotion ? 0 : bgY, opacity: reduceMotion ? 1 : opacityFade }} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-clay-500)]/5 blur-[120px]" />
          <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[var(--color-ink-700)]/5 blur-[150px]" />
          <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-[var(--color-moss)]/5 blur-[120px]" />

          {/* Brick coursing texture overlay — the site's signature motif, kept ambient/quiet */}
          <div
            className="absolute inset-0 pattern-brick opacity-[0.35]"
            style={{
              maskImage: "radial-gradient(ellipse at center, black 35%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 35%, transparent 75%)",
            }}
          />
        </motion.div>

        {/* ── SIGNATURE MOMENT: brick wall assembling on load ── */}
        <BrickBuildAccents />

        <motion.div
          style={{ scale: reduceMotion ? 1 : scaleDown, opacity: reduceMotion ? 1 : opacityFade }}
          className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-12"
        >
          {/* ════════════════════════════
              TOP CENTER: HEADLINE & COPY
          ════════════════════════════ */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            {/* Eyebrow */}
            <motion.div variants={fadeSlideUp} className="mb-6 z-10">
              <span
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--color-border)] bg-[var(--color-card)]/50 backdrop-blur-md shadow-sm text-[var(--color-text-body)] text-xs font-bold tracking-[0.15em] uppercase hover:bg-[var(--color-card)] hover:shadow-md transition-all duration-300"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-clay-500)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-clay-500)]"></span>
                </span>
                {displaySlogan}
              </span>
            </motion.div>

            {/* Headline — single measured reveal per word (opacity/y only) */}
            <h1
              className="text-[clamp(3rem,6vw,5.5rem)] font-black leading-[1.05] tracking-[-0.04em] text-[var(--color-text-heading)] mb-8"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {titleWords.map((word: string, i: number) => {
                const cleanWord = word.replace(/[^a-zA-Z]/g, '');
                const isHighlight = highlightWords.includes(cleanWord);
                return (
                  <span key={i} className="inline-block overflow-hidden pb-2 mr-[0.25em]">
                    <motion.span
                      initial={reduceMotion ? false : { y: "100%" }}
                      animate={{ y: 0 }}
                      transition={{ type: "spring", stiffness: 110, damping: 16, delay: reduceMotion ? 0 : i * 0.04 }}
                      className={`inline-block ${isHighlight ? "text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-clay-500)] via-[var(--color-clay-200)] to-[var(--color-clay-500)] bg-[length:200%_auto] animate-[gradient_3s_ease_infinite]" : ""}`}
                    >
                      {word}
                    </motion.span>
                  </span>
                );
              })}
            </h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeSlideUp}
              className="text-lg lg:text-xl leading-[1.6] text-[var(--color-text-body)] mb-10 max-w-2xl font-medium"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {displaySubtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeSlideUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16"
            >
              <MagneticCTA
                onClick={handleEligibilityClick}
                className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[var(--color-ink-700)] text-white overflow-hidden shadow-[0_8px_30px_rgba(16,25,43,0.15)] hover:shadow-[0_20px_40px_rgba(16,25,43,0.25)] w-full sm:w-auto"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-ink-700)] via-[var(--color-ink-500)] to-[var(--color-ink-700)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 text-base font-bold tracking-wide">Check Eligibility</span>
                <motion.div className="relative z-10 bg-white/10 p-1.5 rounded-full" whileHover={{ x: 3 }}>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </MagneticCTA>

              <a
                href="#how-it-works"
                onClick={(e) => handleSmoothScroll(e, "how-it-works")}
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[var(--color-card)] text-[var(--color-text-heading)] text-base font-bold border border-[var(--color-border)] hover:border-[var(--color-border-emphasis)] hover:bg-[var(--color-mortar-50)] transition-all duration-300 w-full sm:w-auto shadow-sm hover:shadow-md"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <MousePointer2 className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-clay-500)] transition-colors" />
                See How It Works
              </a>
            </motion.div>
          </motion.div>

          {/* ════════════════════════════
              BOTTOM: MASSIVE INTERACTIVE WIDGET
          ════════════════════════════ */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="w-full max-w-5xl mx-auto mt-4"
          >
            <HeroInteractiveEstimatorCard onCheckEligibility={() => setFunnelOpen(true)} />
          </motion.div>

          {/* Trust Chips Below Widget */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.9, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 lg:gap-8 mt-16"
          >
            {TRUST_CHIPS.map((chip, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-body)] bg-[var(--color-card)] px-4 py-2 rounded-full border border-[var(--color-border)] shadow-sm">
                {chip.icon}
                <span style={{ fontFamily: "var(--font-body)" }}>{chip.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Shimmer & Gradient animation styles */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}} />
      </section>

      {/* ── ELIGIBILITY FUNNEL MODAL ── */}
      <EligibilityFunnel
        isOpen={funnelOpen}
        onClose={() => setFunnelOpen(false)}
        branches={branches}
      />
    </>
  );
}

/* ── SIGNATURE MOMENT: BRICK WALL BUILD ─────────────────────────────────────
   The one "spend the boldness here" moment. Two small running-bond wall
   fragments assemble course-by-course on load — literal to "Trust Bricks" —
   replacing the previous floating 3D glass-house/shield/coin decoration.
   Transform/opacity only (no blur), pauses respecting reduced motion. ── */
function BrickWall({ rows = 4, cols = 5, brickSize = 22 }: { rows?: number; cols?: number; brickSize?: number }) {
  const reduceMotion = useReducedMotion();
  const gap = 3;

  return (
    <div
      aria-hidden="true"
      className="flex flex-col-reverse gap-[3px]"
      style={{ width: cols * brickSize + (cols - 1) * gap }}
    >
      {Array.from({ length: rows }).map((_, rowIdx) => {
        const offset = rowIdx % 2 === 1;
        return (
          <div key={rowIdx} className="flex gap-[3px]" style={{ marginLeft: offset ? brickSize / 2 : 0 }}>
            {Array.from({ length: offset ? cols - 1 : cols }).map((_, colIdx) => (
              <motion.span
                key={colIdx}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: reduceMotion ? 0 : (rows - rowIdx) * 0.09 + colIdx * 0.05,
                  ease: "easeOut",
                }}
                className="block rounded-[2px] bg-gradient-to-br from-[var(--color-clay-500)] to-[var(--color-clay-600)] shadow-sm"
                style={{ width: brickSize, height: brickSize * 0.46 }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

function BrickBuildAccents() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="absolute top-[14%] left-[4%] opacity-70 hidden md:block">
        <BrickWall rows={5} cols={4} brickSize={18} />
      </div>
      <div className="absolute bottom-[10%] right-[5%] opacity-60 hidden md:block">
        <BrickWall rows={3} cols={6} brickSize={16} />
      </div>
    </div>
  );
}

/* ── SUB-COMPONENTS ─────────────────────────────────────────────────────── */

/**
 * Spring-animated Counter
 */
function AnimatedCounter({ value, prefix = "₦", duration = 1.2 }: { value: number; prefix?: string; duration?: number }) {
  const [displayVal, setDisplayVal] = useState(value);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const controls = animate(displayVal, value, {
      duration: duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayVal(Math.round(latest)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, reduceMotion]);

  const shown = reduceMotion ? value : displayVal;
  return <span className="font-tabular tracking-tight">{prefix}{shown.toLocaleString("en-NG")}</span>;
}

/**
 * Interactive Estimator Card
 */
function HeroInteractiveEstimatorCard({ onCheckEligibility }: { onCheckEligibility: () => void }) {
  const [rsaBalance, setRsaBalance] = useState(15000000); // Default ₦15M

  const min = 2000000;   // ₦2M
  const max = 80000000;  // ₦80M
  const step = 500000;   // ₦500k

  // Calculations
  const equityContribution = rsaBalance * 0.25;

  return (
    <div className="relative w-full rounded-[2.5rem] bg-[var(--color-card)] border border-[var(--color-border)] shadow-[0_40px_80px_-20px_rgba(16,25,43,0.12)] p-2">
      {/* Outer border gradient effect */}
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />

      <div className="relative bg-[var(--color-mortar-50)]/60 rounded-[2rem] p-6 sm:p-10 lg:p-12 overflow-hidden border border-[var(--color-border)]">

        {/* Subtle glowing orb inside the card */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[var(--color-clay-500)]/10 to-transparent rounded-full blur-[80px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">

          {/* Left Side: Controls */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-card)] border border-[var(--color-border)] rounded-full text-xs font-bold text-[var(--color-text-body)] mb-6 shadow-sm">
                <Building2 className="w-3.5 h-3.5 text-[var(--color-clay-500)]" />
                Mortgage Estimator
              </div>
              <h2 className="text-3xl font-black text-[var(--color-text-heading)] leading-tight mb-2" style={{ fontFamily: "var(--font-display)" }}>
                Dial in your balance.
              </h2>
              <p className="text-[var(--color-text-muted)] text-sm font-medium">Drag the slider to see your immediate purchasing power under PenCom rules.</p>
            </div>

            <div className="bg-[var(--color-card)] rounded-2xl p-6 border border-[var(--color-border)] shadow-sm">
              <div className="flex justify-between items-end mb-6">
                <span className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Current RSA Balance</span>
                <span className="text-2xl font-black text-[var(--color-clay-500)]">
                  <AnimatedCounter value={rsaBalance} />
                </span>
              </div>

              <div className="relative w-full h-12 flex items-center">
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={rsaBalance}
                  onChange={(e) => setRsaBalance(Number(e.target.value))}
                  className="w-full h-3 bg-[var(--color-mortar-100)] rounded-full appearance-none cursor-pointer relative z-10 accent-[var(--color-ink-700)] hover:accent-[var(--color-clay-500)] transition-all"
                  aria-label="RSA Balance slider"
                />
                {/* Custom Fill track */}
                <div
                  className="absolute left-0 h-3 bg-[var(--color-ink-700)] rounded-full pointer-events-none"
                  style={{ width: `${((rsaBalance - min) / (max - min)) * 100}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-[var(--color-text-muted)] font-bold mt-2">
                <span>₦2M</span>
                <span>₦80M+</span>
              </div>
            </div>
          </div>

          {/* Right Side: Results Display */}
          <div className="lg:col-span-7 grid grid-cols-1 gap-4 h-full">

            {/* Equity Card */}
            <div className="bg-[var(--color-ink-700)] rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden group shadow-lg">
              {/* Animated glass shine */}
              <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[150%] group-hover:translate-x-[50%] transition-transform duration-1000 ease-in-out" />

              <div className="relative z-10">
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">25% Equity Release</p>
                <div className="text-4xl lg:text-5xl font-black text-white mb-4">
                  <AnimatedCounter value={equityContribution} />
                </div>
                <div className="w-12 h-1 bg-[var(--color-clay-500)] rounded-full opacity-80" />
              </div>
            </div>

            {/* Target Home Card */}
            <div className="bg-[var(--color-card)] rounded-3xl p-8 flex items-center border border-[var(--color-border)] shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-clay-500)]/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />

              <motion.button
                onClick={onCheckEligibility}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 bg-[var(--color-clay-500)]/10 hover:bg-[var(--color-clay-500)]/20 text-[var(--color-clay-500)] py-3.5 rounded-xl font-bold transition-colors"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <Sparkles className="w-4 h-4" />
                Verify & Apply
              </motion.button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, Variants, useScroll, useTransform, animate, useAnimation, useInView } from "framer-motion";
import { ShieldCheck, Landmark, MapPin, ArrowRight, ChevronDown, Sparkles, Building2, MousePointer2 } from "lucide-react";
import EligibilityFunnel from "./EligibilityFunnel";
import { useRouter } from "next/navigation";

/* ── INTERACTIVE BUTTON COMPONENT ───────────────────────────────────────── */
function MagneticCTA({ onClick, children, className, style, ariaLabel }: any) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
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

/* ── FRAMER MOTION VARIANTS ─────────────────────────────────────────────── */
const containerVariants: Variants = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeSlideUp: Variants = {
  hidden:  { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

const scaleIn: Variants = {
  hidden:  { opacity: 0, scale: 0.95, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 120, damping: 25, delay: 0.4 },
  },
};

/* ── TRUST CHIP DATA ─────────────────────────────────────────────────────── */
const TRUST_CHIPS = [
  { icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />, label: "PenCom Regulated" },
  { icon: <Landmark className="w-4 h-4 text-blue-500" />, label: "12 PFAs Supported" },
  { icon: <MapPin className="w-4 h-4 text-rose-500" />, label: "4 State Offices" },
  { icon: <Building2 className="w-4 h-4 text-slate-500" />, label: "RC: 9552712" },
];

/* ── COMPONENT ──────────────────────────────────────────────────────────── */
export default function HeroSection({ siteSettings }: { siteSettings?: any } = {}) {
  const [funnelOpen, setFunnelOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkParams = () => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("eligibility") === "true") {
          setFunnelOpen(true);
          const newUrl = window.location.pathname;
          window.history.replaceState({}, "", newUrl);
        }
      };
      checkParams();
      window.addEventListener("popstate", checkParams);
      return () => window.removeEventListener("popstate", checkParams);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scaleDown = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleEligibilityClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/?eligibility=true", { scroll: false });
  };

  const displayTitle = siteSettings?.heroTitle || "Your RSA Balance Can Open Your Front Door";
  const displaySubtitle = siteSettings?.heroSubtitle || "Unlock 25% of your Retirement Savings Account to finance your residential mortgage down payment. We simplify the verification, banking matches, and PFA approvals.";
  const displaySlogan = siteSettings?.slogan || "We Value your trust";

  // Dynamic Word Highlighting
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
          background: "#FFFFFF",
          minHeight: "100vh", // Flexible height but at least viewport height
        }}
      >
        {/* ── PREMIUM MESH GRADIENT BACKDROP ── */}
        <motion.div style={{ y: bgY, opacity: opacityFade }} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-amber-500)]/5 blur-[120px]" />
          <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#0D1F3C]/5 blur-[150px]" />
          <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px]" />
          
          {/* Subtle Grid overlay */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(13,31,60,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(13,31,60,0.02) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
              maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)"
            }}
          />
        </motion.div>

        {/* ── FAINT ABSTRACT 3D SHAPES ── */}
        <Background3DShapes />



        <motion.div 
          style={{ scale: scaleDown, opacity: opacityFade }}
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
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-slate-200/60 bg-white/50 backdrop-blur-md shadow-sm text-slate-700 text-xs font-bold tracking-[0.15em] uppercase hover:bg-white hover:shadow-md transition-all duration-300"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-amber-500)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-amber-500)]"></span>
                </span>
                {displaySlogan}
              </span>
            </motion.div>


            {/* Kinetic Typography H1 */}
            <h1
              className="text-[clamp(3rem,6vw,5.5rem)] font-black leading-[1.05] tracking-[-0.04em] text-[#050B14] mb-8"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {titleWords.map((word: string, i: number) => {
                const cleanWord = word.replace(/[^a-zA-Z]/g, '');
                const isHighlight = highlightWords.includes(cleanWord);
                return (
                  <span key={i} className="inline-block overflow-hidden pb-2 mr-[0.25em]">
                    <motion.span
                      initial={{ y: "100%", rotateZ: 5 }}
                      animate={{ y: 0, rotateZ: 0 }}
                      transition={{ type: "spring", stiffness: 100, damping: 15, delay: i * 0.05 }}
                      className={`inline-block ${isHighlight ? "text-transparent bg-clip-text bg-gradient-to-r from-[#E8600A] via-[#FF8C42] to-[#E8600A] bg-[length:200%_auto] animate-[gradient_3s_ease_infinite]" : ""}`}
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
              className="text-lg lg:text-xl leading-[1.6] text-slate-600 mb-10 max-w-2xl font-medium"
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
                className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#050B14] text-white overflow-hidden shadow-[0_8px_30px_rgba(5,11,20,0.15)] hover:shadow-[0_20px_40px_rgba(5,11,20,0.25)] w-full sm:w-auto"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#050B14] via-[#162E57] to-[#050B14] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 text-base font-bold tracking-wide">Check Eligibility</span>
                <motion.div className="relative z-10 bg-white/10 p-1.5 rounded-full" whileHover={{ x: 3 }}>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </MagneticCTA>

              <a
                href="#how-it-works"
                onClick={(e) => handleSmoothScroll(e, "how-it-works")}
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-slate-800 text-base font-bold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 w-full sm:w-auto shadow-sm hover:shadow-md"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <MousePointer2 className="w-4 h-4 text-slate-400 group-hover:text-[var(--color-amber-500)] transition-colors" />
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
            transition={{ delay: 1.2, duration: 1 }}
            className="flex flex-wrap items-center justify-center gap-4 lg:gap-8 mt-16"
          >
            {TRUST_CHIPS.map((chip, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
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
      />
    </>
  );
}

/* ── BACKGROUND 3D SHAPES ───────────────────────────────────────────────── */

const GlassHouse3D = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_20px_50px_rgba(232,96,10,0.15)]">
    <defs>
      <linearGradient id="wallGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(255, 255, 255, 0.28)" />
        <stop offset="100%" stopColor="rgba(255, 255, 255, 0.04)" />
      </linearGradient>
      <linearGradient id="wallGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(232, 96, 10, 0.22)" />
        <stop offset="100%" stopColor="rgba(232, 96, 10, 0.04)" />
      </linearGradient>
      <linearGradient id="roofGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF8C42" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#E8600A" stopOpacity="0.8" />
      </linearGradient>
      <linearGradient id="roofGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E8600A" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#9E3C00" stopOpacity="0.8" />
      </linearGradient>
    </defs>
    <polygon points="100,165 35,130 100,95 165,130" fill="rgba(5, 11, 20, 0.03)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    <polygon points="35,130 100,165 100,105 35,70" fill="url(#wallGradLeft)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
    <polygon points="100,165 165,130 165,70 100,105" fill="url(#wallGradRight)" stroke="rgba(232, 96, 10, 0.25)" strokeWidth="1.2" />
    <polygon points="30,70 100,105 100,45 30,10" fill="url(#roofGradLeft)" />
    <polygon points="100,105 170,70 170,10 100,45" fill="url(#roofGradRight)" />
    <polygon points="115,147 135,137 135,107 115,117" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
  </svg>
);

const PFALogo3D = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_25px_60px_rgba(13,31,60,0.12)]">
    <defs>
      <linearGradient id="shieldLeft" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0B1C33" />
        <stop offset="100%" stopColor="#050B14" />
      </linearGradient>
      <linearGradient id="shieldRight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E3E6B" />
        <stop offset="100%" stopColor="#0F2440" />
      </linearGradient>
      <linearGradient id="goldHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFC107" />
        <stop offset="100%" stopColor="#E8600A" />
      </linearGradient>
    </defs>
    <polygon points="100,175 40,140 40,55 100,25 160,55 160,140" fill="rgba(5, 11, 20, 0.08)" />
    <path d="M100,170 L45,138 L45,60 L100,30 Z" fill="url(#shieldLeft)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
    <path d="M100,170 L155,138 L155,60 L100,30 Z" fill="url(#shieldRight)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
    <path d="M100,65 L125,85 L100,135 L75,85 Z" fill="url(#goldHighlight)" opacity="0.85" />
    <text x="100" y="112" fontSize="22" fontWeight="900" fill="#FFFFFF" textAnchor="middle" letterSpacing="2.5" fontFamily="sans-serif" transform="skewY(-8)">
      PFA
    </text>
  </svg>
);

const NairaCoin3D = () => (
  <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-[0_15px_40px_rgba(232,96,10,0.08)]">
    <defs>
      <linearGradient id="coinFace" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE082" />
        <stop offset="50%" stopColor="#FFB300" />
        <stop offset="100%" stopColor="#FFA000" />
      </linearGradient>
      <linearGradient id="coinRim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFA000" />
        <stop offset="100%" stopColor="#FF6F00" />
      </linearGradient>
    </defs>
    <ellipse cx="80" cy="85" rx="70" ry="70" fill="url(#coinRim)" />
    <ellipse cx="80" cy="78" rx="68" ry="68" fill="url(#coinFace)" stroke="#FFF" strokeWidth="0.4" />
    <ellipse cx="80" cy="78" rx="55" ry="55" fill="none" stroke="#FF6F00" strokeWidth="1.2" strokeDasharray="5 3" />
    <text x="80" y="98" fontSize="56" fontWeight="900" fill="#B7791F" textAnchor="middle" fontFamily="sans-serif">
      ₦
    </text>
  </svg>
);

function Background3DShapes() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true" style={{ perspective: '1200px' }}>
      
      {/* 1. Floating Glassmorphic 3D House - Top Left */}
      <motion.div
        className="absolute top-[12%] left-[4%] w-28 h-28 lg:w-40 lg:h-40"
        initial={{ rotateX: 10, rotateY: -15, rotateZ: 0, y: 0 }}
        animate={{
          rotateY: [-15, 10, -15],
          rotateX: [10, -10, 10],
          y: [0, -25, 0]
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <GlassHouse3D />
      </motion.div>

      {/* 2. Floating PFA Shield - Center Right */}
      <motion.div
        className="absolute top-[35%] right-[3%] w-24 h-24 lg:w-36 lg:h-36"
        initial={{ rotateX: 5, rotateY: 20, y: 0 }}
        animate={{
          rotateY: [20, -5, 20],
          rotateX: [5, 15, 5],
          y: [0, 20, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <PFALogo3D />
      </motion.div>

      {/* 3. Floating Naira Coin - Top Right */}
      <motion.div
        className="absolute top-[14%] right-[8%] w-16 h-16 lg:w-26 lg:h-26"
        initial={{ rotateY: 10, rotateX: 25, y: 0 }}
        animate={{
          rotateY: [10, 45, 10],
          y: [0, -15, 0]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <NairaCoin3D />
      </motion.div>

      {/* 4. Second Glassmorphic House - Bottom Left */}
      <motion.div
        className="absolute bottom-[18%] left-[8%] w-32 h-32 lg:w-44 lg:h-44 opacity-80"
        initial={{ rotateX: -10, rotateY: 10, y: 0 }}
        animate={{
          rotateY: [10, -15, 10],
          rotateX: [-10, 10, -10],
          y: [0, 30, 0]
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <GlassHouse3D />
      </motion.div>

      {/* 5. Second Naira Coin - Bottom Right */}
      <motion.div
        className="absolute bottom-[28%] right-[6%] w-14 h-14 lg:w-22 lg:h-22 opacity-70"
        initial={{ rotateY: -30, rotateX: 15, y: 0 }}
        animate={{
          rotateY: [-30, -5, -30],
          y: [0, -20, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <NairaCoin3D />
      </motion.div>

    </div>
  );
}

/* ── SUB-COMPONENTS ─────────────────────────────────────────────────────── */

/**
 * Spring-animated Counter
 */
function AnimatedCounter({ value, prefix = "₦", duration = 1.2 }: { value: number; prefix?: string; duration?: number }) {
  const [displayVal, setDisplayVal] = useState(value);

  useEffect(() => {
    const controls = animate(displayVal, value, {
      duration: duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayVal(Math.round(latest)),
    });
    return () => controls.stop();
  }, [value, duration]);

  return <span className="font-tabular tracking-tight">{prefix}{displayVal.toLocaleString("en-NG")}</span>;
}

/**
 * Super Premium Ultra-Wide Estimator Card
 */
function HeroInteractiveEstimatorCard({ onCheckEligibility }: { onCheckEligibility: () => void }) {
  const [rsaBalance, setRsaBalance] = useState(15000000); // Default ₦15M

  const min = 2000000;   // ₦2M
  const max = 80000000;  // ₦80M
  const step = 500000;   // ₦500k

  // Calculations
  const equityContribution = rsaBalance * 0.25;
  const purchasingPower = equityContribution * 5; // Assuming 20% downpayment standard

  return (
    <div className="relative w-full rounded-[2.5rem] bg-white border border-slate-200/60 shadow-[0_40px_80px_-20px_rgba(13,31,60,0.12)] p-2">
      {/* Outer border gradient effect */}
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />
      
      <div className="relative bg-slate-50/50 rounded-[2rem] p-6 sm:p-10 lg:p-12 overflow-hidden border border-slate-100">
        
        {/* Subtle glowing orb inside the card */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[var(--color-amber-500)]/10 to-transparent rounded-full blur-[80px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          
          {/* Left Side: Controls */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 mb-6 shadow-sm">
                <Building2 className="w-3.5 h-3.5 text-[var(--color-amber-500)]" />
                Mortgage Estimator
              </div>
              <h2 className="text-3xl font-black text-[#050B14] leading-tight mb-2" style={{ fontFamily: "var(--font-display)" }}>
                Dial in your balance.
              </h2>
              <p className="text-slate-500 text-sm font-medium">Drag the slider to see your immediate purchasing power under PenCom rules.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-end mb-6">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Current RSA Balance</span>
                <span className="text-2xl font-black text-[var(--color-amber-500)]">
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
                  className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer relative z-10 accent-[#050B14] hover:accent-[var(--color-amber-500)] transition-all"
                  aria-label="RSA Balance slider"
                />
                {/* Custom Fill track */}
                <div 
                  className="absolute left-0 h-3 bg-[#050B14] rounded-full pointer-events-none"
                  style={{ width: `${((rsaBalance - min) / (max - min)) * 100}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-slate-400 font-bold mt-2">
                <span>₦2M</span>
                <span>₦80M+</span>
              </div>
            </div>
          </div>

          {/* Right Side: Results Display */}
          <div className="lg:col-span-7 grid grid-cols-1 gap-4 h-full">
            
            {/* Equity Card */}
            <div className="bg-[#050B14] rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden group shadow-lg">
              {/* Animated glass shine */}
              <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[150%] group-hover:translate-x-[50%] transition-transform duration-1000 ease-in-out" />
              
              <div className="relative z-10">
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">25% Equity Release</p>
                <div className="text-4xl lg:text-5xl font-black text-white mb-4">
                  <AnimatedCounter value={equityContribution} />
                </div>
                <div className="w-12 h-1 bg-[var(--color-amber-500)] rounded-full opacity-80" />
              </div>
            </div>

            {/* Target Home Card */}
            <div className="bg-white rounded-3xl p-8 flex flex-col justify-between border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-amber-500)]/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
              
              <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Target Home Budget</p>
                <div className="text-3xl lg:text-4xl font-black text-[#050B14]">
                  <AnimatedCounter value={purchasingPower} />
                </div>
                <p className="text-slate-400 text-xs mt-3 font-medium leading-relaxed">
                  Assuming your 25% RSA equity is used as a 20% downpayment on the total property.
                </p>
              </div>

              <motion.button
                onClick={onCheckEligibility}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-[var(--color-amber-500)]/10 hover:bg-[var(--color-amber-500)]/20 text-[var(--color-amber-500)] py-3.5 rounded-xl font-bold transition-colors"
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

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import ApplicationStatusModal from "@/components/ApplicationStatusModal";

/* ── TYPES ──────────────────────────────────────────────────────────────── */
interface NavLink {
  label: string;
  href: string;
}

/* ── CONSTANTS ──────────────────────────────────────────────────────────── */
const NAV_LINKS: NavLink[] = [
  { label: "Home",         href: "/" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Our Offices",  href: "/#offices" },
  { label: "Contact",      href: "/contact" },
];

/* ── FRAMER MOTION VARIANTS ─────────────────────────────────────────────── */
const drawerVariants: Variants = {
  hidden:  { height: 0, opacity: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      height:     { type: "spring", stiffness: 320, damping: 32 },
      opacity:    { duration: 0.15 },
      staggerChildren: 0.06,
      delayChildren:   0.05,
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height:  { type: "spring", stiffness: 400, damping: 40 },
      opacity: { duration: 0.12 },
    },
  },
};

const drawerItemVariants: Variants = {
  hidden:  { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 280, damping: 26 },
  },
};

const hamburgerTopVariants: Variants = {
  closed: { rotate: 0,   y: 0 },
  open:   { rotate: 45,  y: 7 },
};
const hamburgerMidVariants: Variants = {
  closed: { opacity: 1, scaleX: 1 },
  open:   { opacity: 0, scaleX: 0 },
};
const hamburgerBotVariants: Variants = {
  closed: { rotate: 0,   y: 0 },
  open:   { rotate: -45, y: -7 },
};

/* ── COMPONENT ──────────────────────────────────────────────────────────── */
export default function GlobalNavbar() {
  const [scrolled,         setScrolled]         = useState(false);
  const [mobileOpen,       setMobileOpen]       = useState(false);
  const [statusModalOpen,  setStatusModalOpen]  = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      const targetId = href.replace("/#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
        setMobileOpen(false);
      }
    } else if (href.startsWith("/#")) {
      setMobileOpen(false);
    }
  };

  const handleEligibilityClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      // Already on home — fire event directly so HeroSection opens instantly
      window.dispatchEvent(new CustomEvent("openEligibilityFunnel"));
    } else {
      router.push("/?eligibility=true", { scroll: false });
    }
    setMobileOpen(false);
  };

  /* Scroll detection */
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 16);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* Lock body scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeDrawer = () => setMobileOpen(false);

  /* ── RENDER ───────────────────────────────────────────────── */
  return (
    <header
      role="banner"
      className={[
        "fixed z-[100] transition-all duration-500",
        scrolled
          ? "top-4 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-[90%] md:max-w-5xl rounded-2xl bg-[#FDFBF7]/90 backdrop-blur-[16px] saturate-[1.8] border border-[var(--color-border)] shadow-[0_8px_32px_rgba(16,25,43,0.08)]"
          : "top-0 inset-x-0 bg-transparent",
      ].join(" ")}
    >
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between"
        aria-label="Primary navigation"
      >
        {/* ── LOGO ── */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-clay-500)] rounded-md"
          aria-label="Trust Bricks Properties — home"
        >
          {/* Brick coursing mark — two offset courses, literal to the brand */}
          <span
            aria-hidden="true"
            className="flex flex-col gap-[3px] w-9 h-9 rounded-[8px] bg-[var(--color-ink-700)] p-[6px] select-none"
          >
            <span className="flex gap-[3px] flex-1">
              <span className="flex-1 rounded-[1.5px] bg-[var(--color-clay-500)]" />
              <span className="flex-1 rounded-[1.5px] bg-[var(--color-clay-500)]" />
            </span>
            <span className="flex gap-[3px] flex-1 pl-[9px]">
              <span className="flex-1 rounded-[1.5px] bg-[var(--color-clay-500)]" />
              <span className="flex-1 rounded-[1.5px] bg-[var(--color-clay-500)]" />
            </span>
          </span>
          <span
            className="leading-tight select-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--color-clay-500)]">
              Trust Bricks
            </span>
            <span className="block text-[13px] font-black text-[var(--color-ink-700)] tracking-tight">
              PROPERTIES LTD
            </span>
          </span>
        </Link>

        {/* ── DESKTOP NAV ── */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={[
                  "relative px-3 py-1.5 text-sm font-medium text-[var(--color-text-heading)] cursor-pointer",
                  "transition-colors duration-[300ms] hover:text-[var(--color-clay-500)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-clay-500)] rounded",
                  "after:content-[''] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px]",
                  "after:bg-[var(--color-clay-500)] after:scale-x-0 after:origin-left",
                  "after:transition-transform after:duration-[300ms] hover:after:scale-x-100",
                ].join(" ")}
                style={{ fontFamily: "var(--font-body)" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* ── DESKTOP CTAs ── */}
        <div className="hidden md:flex items-center gap-3">
          {/* Secondary: Check Application status */}
          <motion.button
            type="button"
            onClick={() => setStatusModalOpen(true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className={[
              "inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-pill)]",
              "border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-ink-700)] text-sm font-bold",
              "hover:bg-[var(--color-mortar-50)] hover:border-[var(--color-border-emphasis)]",
              "shadow-sm hover:shadow-md",
              "transition-all duration-[280ms]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-clay-500)]",
            ].join(" ")}
            style={{ fontFamily: "var(--font-display)" }}
            aria-label="Check my application status"
            id="navbar-check-application-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Track Application
          </motion.button>

          {/* Primary: Check Eligibility */}
          <motion.a
            href="/?eligibility=true"
            onClick={handleEligibilityClick}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className={[
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-pill)]",
              "bg-[var(--color-clay-500)] text-white text-sm font-bold",
              "hover:bg-[var(--color-clay-600)]",
              "shadow-[var(--shadow-action-glow)] hover:shadow-[0_0_32px_rgba(184,80,46,0.5)]",
              "transition-all duration-[280ms]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-clay-500)]",
            ].join(" ")}
            style={{ fontFamily: "var(--font-display)" }}
            aria-label="Open the eligibility checker"
          >
            Check My Eligibility
            <ArrowRight className="w-4 h-4 transition-transform duration-[180ms] group-hover:translate-x-1" />
          </motion.a>
        </div>

        {/* ── HAMBURGER ── */}
        <button
          type="button"
          className={[
            "md:hidden relative z-10 flex flex-col justify-center items-center w-10 h-10 gap-[5px] rounded-lg",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-clay-500)]",
          ].join(" ")}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-drawer"
        >
          {([
            [hamburgerTopVariants, "top"],
            [hamburgerMidVariants, "mid"],
            [hamburgerBotVariants, "bot"],
          ] as const).map(([variant, key]) => (
            <motion.span
              key={key}
              variants={variant as Variants}
              animate={mobileOpen ? "open" : "closed"}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="block w-6 h-[2px] bg-[var(--color-ink-700)] rounded-full origin-center"
              aria-hidden="true"
            />
          ))}
        </button>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav-drawer"
            key="drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden overflow-hidden bg-[var(--color-ink-700)] border-t border-[rgba(255,255,255,0.08)]"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <ul className="px-4 pt-4 pb-6 flex flex-col gap-1" role="list">
              {NAV_LINKS.map((link) => (
                <motion.li key={link.href} variants={drawerItemVariants}>
                  <Link
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={[
                      "block px-4 py-3 rounded-[var(--radius-md)] text-base font-semibold text-white/80",
                      "hover:text-white hover:bg-white/10 transition-colors duration-[180ms]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-clay-500)]",
                    ].join(" ")}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}

              {/* Track Application CTA in drawer */}
              <motion.li variants={drawerItemVariants} className="mt-3">
                <button
                  type="button"
                  onClick={() => { setStatusModalOpen(true); setMobileOpen(false); }}
                  className={[
                    "flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-[var(--radius-pill)]",
                    "bg-white/10 text-white font-bold text-base border border-white/15",
                    "hover:bg-white/15 transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-clay-500)]",
                  ].join(" ")}
                  style={{ fontFamily: "var(--font-display)" }}
                  aria-label="Track my application status"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Track My Application
                </button>
              </motion.li>

              {/* Eligibility CTA in drawer */}
              <motion.li variants={drawerItemVariants}>
                <a
                  href="/?eligibility=true"
                  onClick={handleEligibilityClick}
                  className={[
                    "flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-[var(--radius-pill)]",
                    "bg-[var(--color-clay-500)] text-white font-bold text-base",
                    "shadow-[var(--shadow-action-glow)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-clay-500)]",
                  ].join(" ")}
                  style={{ fontFamily: "var(--font-display)" }}
                  aria-label="Open the eligibility checker"
                >
                  Check My Eligibility
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── APPLICATION STATUS MODAL ── */}
      <ApplicationStatusModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
      />
    </header>
  );
}

/* ── INLINE SVG ICON ─────────────────────────────────────────────────────── */
function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

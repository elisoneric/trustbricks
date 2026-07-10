"use client";

import { motion, Variants } from 'framer-motion';
import { CheckCircle, Building, Key } from './Icons';

const springBouncy = { type: "spring" as const, stiffness: 380, damping: 22 };

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 280, damping: 28 } }
};

interface HowItWorksProps {
  onCheckStatus?: () => void;
}

export default function HowItWorks({ onCheckStatus }: HowItWorksProps) {
  const steps = [
    { icon: <CheckCircle />, title: "Verify Eligibility", desc: "Run your RSA balance through our real-time checker. Know your exact 25% qualification status instantly." },
    { icon: <Building />, title: "We Handle The PFA", desc: "Our specialized advisors coordinate directly with your PFA to secure the equity release. No paperwork stress." },
    { icon: <Key />, title: "Receive Your Keys", desc: "Your equity is applied as a down payment. You move into your new home while your pension remains secure." }
  ];

  return (
    <section id="how-it-works" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <span className="text-[#E8600A] font-extrabold text-sm tracking-widest uppercase mb-4 block">The 25% RSA Process</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#050B14]">From Pension to Property.</h2>
        </div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8"
        >
          {steps.map((step, i) => (
            <motion.div 
              key={i} variants={fadeSlideUp}
              whileHover={{ y: -16, transition: springBouncy }}
              className="bg-white rounded-3xl p-10 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(13,31,60,0.12)] transition-shadow relative overflow-hidden group cursor-pointer"
            >
              {/* Dynamic Bottom Border Reveal */}
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[#E8600A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              
              <motion.div 
                animate={{ y: [-3, 3, -3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                className="w-16 h-16 bg-[#F0F4F9] text-[#050B14] group-hover:bg-[#E8600A] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#E8600A]/30 transition-all duration-300 rounded-2xl flex items-center justify-center mb-8"
              >
                {step.icon}
              </motion.div>
              <h3 className="text-2xl font-bold text-[#050B14] mb-4">Step {i + 1}: <br/>{step.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── ALREADY APPLIED? TRACK YOUR APPLICATION ── */}
        {onCheckStatus && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 200, damping: 28, delay: 0.3 }}
            className="mt-16 relative rounded-3xl overflow-hidden"
          >
            {/* Dark gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050B14] via-[#0D1F3C] to-[#050B14]" />
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#E8600A]/20 blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-blue-500/10 blur-[70px] pointer-events-none" />
            {/* Subtle grid */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-8 md:px-12 md:py-10">
              {/* Left: copy */}
              <div className="flex items-center gap-5">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-[#E8600A] flex items-center justify-center shrink-0 shadow-[0_8px_24px_rgba(232,96,10,0.45)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[#E8600A] text-xs font-black uppercase tracking-widest mb-1">Already Applied?</p>
                  <h3 className="text-white text-xl font-black leading-snug">Track your application status</h3>
                  <p className="text-white/45 text-sm font-medium mt-0.5">Enter your phone or BVN — get your stage instantly.</p>
                </div>
              </div>

              {/* Right: CTA button */}
              <motion.button
                type="button"
                onClick={onCheckStatus}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="shrink-0 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#E8600A] text-white text-sm font-black tracking-wide shadow-[0_8px_24px_rgba(232,96,10,0.45)] hover:bg-[#ff7c2a] hover:shadow-[0_12px_36px_rgba(232,96,10,0.6)] transition-all duration-250"
                style={{ fontFamily: "var(--font-display, 'Inter', sans-serif)" }}
                id="check-application-status-btn"
              >
                Check My Application
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd"/>
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

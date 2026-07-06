"use client";

import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { ChevronRight, ShieldCheck } from './Icons';

const springStandard = { type: "spring" as const, stiffness: 280, damping: 28 };
const springBouncy = { type: "spring" as const, stiffness: 380, damping: 22 };

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: springStandard }
};

export default function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 250]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-[#F0F4F9] min-h-screen flex items-center">
      {/* Dynamic, Continuous Background Motion */}
      <motion.div 
        animate={{ rotate: [0, 90, 180, 270, 360], scale: [1, 1.1, 1, 1.1, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-bl from-[#E8600A]/10 to-transparent rounded-full blur-[100px] pointer-events-none" 
      />
      <motion.div 
        animate={{ rotate: [360, 270, 180, 90, 0], scale: [1, 1.2, 1, 1.2, 1] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] left-[-10%] w-[700px] h-[700px] bg-gradient-to-tr from-[#0D1F3C]/10 to-transparent rounded-full blur-[120px] pointer-events-none" 
      />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-2xl relative z-20">
          <motion.div variants={fadeSlideUp} className="flex items-center gap-2 mb-6">
            <span className="px-4 py-1.5 bg-white shadow-md shadow-[#0D1F3C]/5 text-[#0D1F3C] text-xs font-extrabold uppercase tracking-widest rounded-full border border-slate-200 flex items-center gap-2">
              <ShieldCheck /> PENCOM APPROVED
            </span>
          </motion.div>
          
          <motion.h1 variants={fadeSlideUp} className="text-5xl lg:text-[4.2rem] font-extrabold text-[#0D1F3C] leading-[1.05] tracking-tight mb-6">
            Your RSA Balance Can <br/>
            <motion.span 
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8600A] via-[#FF8C42] to-[#D4530A] bg-[length:200%_auto]"
            >
              Open Your Front Door.
            </motion.span>
          </motion.h1>
          
          <motion.p variants={fadeSlideUp} className="text-lg text-slate-600 mb-10 leading-relaxed max-w-lg font-medium">
            Use up to 25% of your Retirement Savings Account as equity for your dream home. Teamwork makes the dream work—we handle the PFA paperwork.
          </motion.p>
          
          <motion.div variants={fadeSlideUp} className="flex flex-col sm:flex-row gap-4">
            <motion.button 
              whileHover={{ scale: 1.05, y: -4, boxShadow: "0 20px 40px -10px rgba(232, 96, 10, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              transition={springBouncy}
              className="bg-[#E8600A] text-white px-8 py-4 rounded-full font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-[#E8600A]/30 relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-12"></span>
              Check My Eligibility <ChevronRight />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(13, 31, 60, 0.05)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full font-bold text-[#0D1F3C] border-2 border-slate-200 flex items-center justify-center gap-2 bg-white/50 backdrop-blur-sm transition-colors"
            >
              See How It Works
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Continuous 3D Floating Asset */}
        <motion.div style={{ y: y2, opacity }} className="relative perspective-1000 hidden lg:block z-10">
          <motion.div 
            animate={{ 
              y: [-15, 15, -15], 
              rotateX: [2, -2, 2], 
              rotateY: [-3, 3, -3] 
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full aspect-square max-w-md mx-auto bg-gradient-to-tr from-[#0D1F3C] to-[#1E3A5F] rounded-[2.5rem] shadow-[0_40px_80px_rgba(13,31,60,0.4)] border border-white/10 overflow-hidden"
          >
            {/* Dynamic Glassmorphism Overlay */}
            <div className="absolute inset-0 opacity-30 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[pulse_4s_ease-in-out_infinite]"></div>
            
            {/* Floating Internal Card */}
            <motion.div 
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-10 left-8 right-8 bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="text-white/80 text-xs font-bold uppercase tracking-widest">RSA Equity Power</div>
                <div className="p-2 bg-[#E8600A]/20 rounded-full text-[#E8600A]">
                  <ShieldCheck />
                </div>
              </div>
              <div className="text-white text-[2.75rem] font-extrabold tracking-tight mb-2 leading-none">₦ 7,500,000</div>
              <div className="text-[#E8600A] text-sm font-bold flex items-center gap-1.5 mt-3">
                <span className="w-2 h-2 rounded-full bg-[#E8600A] animate-pulse"></span>
                Verified via Stanbic IBTC
              </div>
              
              <div className="mt-6 h-2.5 w-full bg-[#0D1F3C]/50 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  animate={{ width: ['0%', '75%', '75%'] }} 
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
                  className="h-full bg-gradient-to-r from-[#E8600A] to-[#FBCAA6] rounded-full relative"
                >
                  <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
        
      </div>

      {/* Required for the shimmer animation used in Tailwind classes above */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </section>
  );
}

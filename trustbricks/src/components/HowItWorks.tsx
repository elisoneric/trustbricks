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

export default function HowItWorks() {
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
      </div>
    </section>
  );
}

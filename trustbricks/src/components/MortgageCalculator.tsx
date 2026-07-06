"use client";

import React, { useState, useEffect } from 'react';
import { motion, animate } from 'framer-motion';

function useAnimatedNumber(value: number) {
  const [displayValue, setDisplayValue] = useState(value);
  
  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (v) => setDisplayValue(Math.round(v))
    });
    return controls.stop;
  }, [value]);
  
  return displayValue;
}

const springStandard = { type: "spring" as const, stiffness: 280, damping: 28 };
const springBouncy = { type: "spring" as const, stiffness: 380, damping: 22 };

export default function MortgageCalculator() {
  const [propertyValue, setPropertyValue] = useState(2500000);
  const [rsaBalance, setRsaBalance] = useState(5000000);

  const equity25 = rsaBalance * 0.25;
  const maxContribution = propertyValue * 0.25;
  const eligibleContribution = Math.min(equity25, maxContribution);
  
  const animatedContribution = useAnimatedNumber(eligibleContribution);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(val);
  };

  return (
    <section className="py-24 bg-[#F0F4F9] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={springStandard}
          className="bg-[#050B14] rounded-[2.5rem] p-10 lg:p-16 shadow-[0_30px_60px_rgba(13,31,60,0.3)] relative overflow-hidden"
        >
          {/* Ambient Calculator Blobs */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E8600A] blur-[120px] rounded-full pointer-events-none"
          ></motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <h3 className="text-[#B8952A] text-xs font-extrabold uppercase tracking-widest mb-4">Interactive Tool</h3>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-10 leading-tight">Calculate Your Housing Equity Power.</h2>
              
              <div className="space-y-10">
                <div>
                  <div className="flex justify-between text-white text-sm font-semibold mb-4">
                    <label>Target Property Value</label>
                    <span className="text-[#E8600A] font-bold tracking-wide">{formatCurrency(propertyValue)}</span>
                  </div>
                  <input 
                    type="range" min="200000" max="5000000" step="50000"
                    value={propertyValue} onChange={(e) => setPropertyValue(Number(e.target.value))}
                    className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#E8600A] hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#E8600A]/50 transition-all"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-white text-sm font-semibold mb-4">
                    <label>Current RSA Balance</label>
                    <span className="text-[#E8600A] font-bold tracking-wide">{formatCurrency(rsaBalance)}</span>
                  </div>
                  <input 
                    type="range" min="1000000" max="50000000" step="500000"
                    value={rsaBalance} onChange={(e) => setRsaBalance(Number(e.target.value))}
                    className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#E8600A] hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#E8600A]/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <motion.div 
              whileHover={{ y: -4 }} transition={springBouncy}
              className="bg-white rounded-3xl p-10 text-center shadow-[0_20px_40px_rgba(13,31,60,0.15)] hover:shadow-[0_30px_60px_rgba(13,31,60,0.25)] transition-shadow duration-300 relative overflow-hidden group"
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#E8600A] text-white px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg z-10">
                Estimated Result
              </div>
              <div className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-4 mt-2">Your 25% Equity Contribution</div>
              <div className="text-[2.75rem] font-extrabold text-[#050B14] mb-6 tabular-nums tracking-tight">
                {formatCurrency(animatedContribution)}
              </div>
              <p className="text-xs text-slate-400 mb-8 font-medium px-4 leading-relaxed">
                * Based on PenCom guidelines. Capped at 25% of total property value.
              </p>
              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full bg-[#050B14] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#162E57] hover:shadow-[0_8px_20px_rgba(13,31,60,0.2)] transition-all duration-300 relative overflow-hidden"
              >
                Apply With This Value →
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

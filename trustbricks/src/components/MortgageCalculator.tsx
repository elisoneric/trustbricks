"use client";

import React, { useState, useEffect } from 'react';
import { motion, animate, useReducedMotion } from 'framer-motion';

function useAnimatedNumber(value: number, skip: boolean) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (skip) return;
    const controls = animate(displayValue, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate: (v) => setDisplayValue(Math.round(v))
    });
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, skip]);

  return skip ? value : displayValue;
}

const springStandard = { type: "spring" as const, stiffness: 280, damping: 28 };
const springBouncy = { type: "spring" as const, stiffness: 380, damping: 22 };

export default function MortgageCalculator() {
  const reduceMotion = useReducedMotion();
  const [propertyValue, setPropertyValue] = useState(2500000);
  const [rsaBalance, setRsaBalance] = useState(5000000);

  const equity25 = rsaBalance * 0.25;
  const maxContribution = propertyValue * 0.25;
  const eligibleContribution = Math.min(equity25, maxContribution);

  const animatedContribution = useAnimatedNumber(eligibleContribution, !!reduceMotion);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(val);
  };

  return (
    <section className="py-24 bg-[var(--color-body-bg)] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={springStandard}
          className="bg-[var(--color-ink-700)] rounded-[2.5rem] p-10 lg:p-16 shadow-[0_30px_60px_rgba(16,25,43,0.3)] relative overflow-hidden"
        >
          {/* Ambient Calculator Blobs */}
          <motion.div
            animate={reduceMotion ? undefined : { scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-clay-500)] blur-[120px] rounded-full pointer-events-none opacity-10"
          ></motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <h3 className="text-[var(--color-seal)] text-xs font-extrabold uppercase tracking-widest mb-4">Interactive Tool</h3>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-10 leading-tight" style={{ fontFamily: "var(--font-display)" }}>Calculate Your Housing Equity Power.</h2>

              <div className="space-y-10">
                <div>
                  <div className="flex justify-between text-white text-sm font-semibold mb-4">
                    <label>Target Property Value</label>
                    <span className="text-[var(--color-clay-200)] font-bold tracking-wide font-tabular">{formatCurrency(propertyValue)}</span>
                  </div>
                  <input
                    type="range" min="200000" max="5000000" step="50000"
                    value={propertyValue} onChange={(e) => setPropertyValue(Number(e.target.value))}
                    className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--color-clay-500)] hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-clay-500)]/50 transition-all"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-white text-sm font-semibold mb-4">
                    <label>Current RSA Balance</label>
                    <span className="text-[var(--color-clay-200)] font-bold tracking-wide font-tabular">{formatCurrency(rsaBalance)}</span>
                  </div>
                  <input
                    type="range" min="1000000" max="50000000" step="500000"
                    value={rsaBalance} onChange={(e) => setRsaBalance(Number(e.target.value))}
                    className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--color-clay-500)] hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-clay-500)]/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <motion.div
              whileHover={{ y: -4 }} transition={springBouncy}
              className="bg-[var(--color-card)] rounded-3xl p-10 text-center shadow-[0_20px_40px_rgba(16,25,43,0.15)] hover:shadow-[0_30px_60px_rgba(16,25,43,0.25)] transition-shadow duration-300 relative overflow-hidden group"
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[var(--color-clay-500)] text-white px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg z-10">
                Estimated Result
              </div>
              <div className="text-[var(--color-text-muted)] text-sm font-bold uppercase tracking-widest mb-4 mt-2">Your 25% Equity Contribution</div>
              <div className="text-[2.75rem] font-extrabold text-[var(--color-text-heading)] mb-6 font-tabular tracking-tight">
                {formatCurrency(animatedContribution)}
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mb-8 font-medium px-4 leading-relaxed">
                * Based on PenCom guidelines. Capped at 25% of total property value.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full bg-[var(--color-ink-700)] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[var(--color-ink-600)] hover:shadow-[0_8px_20px_rgba(16,25,43,0.2)] transition-all duration-300 relative overflow-hidden"
                style={{ fontFamily: "var(--font-display)" }}
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

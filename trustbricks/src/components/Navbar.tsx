"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from './Icons';

const springStandard = { type: "spring" as const, stiffness: 280, damping: 28 };

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }} animate={{ y: 0 }} transition={springStandard}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/80 backdrop-blur-xl shadow-[0_4px_32px_rgba(13,31,60,0.08)] border-b border-slate-200/50 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 bg-[#0D1F3C] rounded-md flex items-center justify-center transform -rotate-6 shadow-lg shadow-navy-900/20 relative overflow-hidden group">
             <div className="absolute inset-0 bg-[#E8600A] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <div className="w-5 h-5 border-[2.5px] border-[#E8600A] group-hover:border-white rounded-sm relative z-10 transition-colors"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-[18px] leading-none tracking-tight text-[#0D1F3C]">
              TRUST BRICKS<span className="text-[#E8600A]">.</span>
            </span>
            <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase mt-0.5">Properties Ltd</span>
          </div>
        </motion.div>
        
        <div className="hidden md:flex items-center gap-8 text-[14px] font-semibold text-[#0D1F3C]/80">
          {['Home', 'How It Works', 'Offices', 'Insights'].map((item) => (
             <a href="#" key={item} className="hover:text-[#E8600A] transition-colors relative group">
              {item}
              <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-[#E8600A] transition-all duration-300 ease-out group-hover:w-full rounded-full"></span>
            </a>
          ))}
        </div>

        <motion.button 
          whileHover={{ scale: 1.05, y: -2, boxShadow: "0 10px 30px -10px rgba(232, 96, 10, 0.7)" }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:flex items-center gap-2 bg-[#E8600A] text-white px-7 py-3 rounded-full font-bold text-sm transition-all relative overflow-hidden group"
        >
          <span className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out skew-x-12"></span>
          Check Eligibility <ChevronRight />
        </motion.button>
      </div>
    </motion.nav>
  );
}

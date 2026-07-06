"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function TrustMarquee() {
  const logos = [
    "PENCOM REGULATED", "STANBIC IBTC", "GT PENSION", "TRUSTFUND", 
    "PREMIUM PENSIONS", "ACCESS ARM", "OAK PENSIONS", "LEADWAY PENSURE"
  ];

  return (
    <div className="bg-[#0D1F3C] py-6 border-y border-[#1E3A5F] overflow-hidden flex items-center relative shadow-[inset_0_4px_20px_rgba(0,0,0,0.2)]">
      <div className="absolute left-0 w-32 h-full bg-gradient-to-r from-[#0D1F3C] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 w-32 h-full bg-gradient-to-l from-[#0D1F3C] to-transparent z-10 pointer-events-none"></div>
      
      <motion.div 
        animate={{ x: [0, -1920] }}
        transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
        className="flex gap-16 items-center whitespace-nowrap pl-16"
      >
        {[...logos, ...logos, ...logos].map((logo, i) => (
          <div key={i} className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-default text-white font-bold tracking-widest text-sm">
            <div className="w-2 h-2 rounded-full bg-[#E8600A] animate-pulse"></div>
            {logo}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

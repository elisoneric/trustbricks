"use client";

import React, { useRef } from 'react';
import { useReducedMotion, useInView } from 'framer-motion';

export default function TrustMarquee() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "0px 0px 200px 0px" });
  const logos = [
    "PENCOM REGULATED", "STANBIC IBTC", "GT PENSION", "TRUSTFUND",
    "PREMIUM PENSIONS", "ACCESS ARM", "OAK PENSIONS", "LEADWAY PENSURE"
  ];

  const isPaused = !isInView || reduceMotion;

  return (
    <div ref={containerRef} className="bg-[var(--color-ink-700)] py-6 border-y border-[var(--color-ink-500)] overflow-hidden flex items-center relative shadow-[inset_0_4px_20px_rgba(0,0,0,0.2)]">
      <div className="absolute left-0 w-32 h-full bg-gradient-to-r from-[var(--color-ink-700)] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 w-32 h-full bg-gradient-to-l from-[var(--color-ink-700)] to-transparent z-10 pointer-events-none"></div>

      {/* CSS-driven (0% -> -50%) so it stays seamless regardless of font/content width,
          and pausing via animation-play-state never causes a jump-to-start snap. */}
      <div className={`marquee-track gap-16 items-center pl-16${isPaused ? " is-paused" : ""}`}>
        {[...logos, ...logos].map((logo, i) => (
          <div key={i} className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity duration-300 cursor-default text-white font-bold tracking-widest text-sm whitespace-nowrap">
            <div className="w-2 h-2 rounded-full bg-[var(--color-clay-500)] animate-pulse"></div>
            {logo}
          </div>
        ))}
      </div>
    </div>
  );
}

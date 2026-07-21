"use client";

import React, { useRef, useState } from 'react';
import { useReducedMotion, useInView } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

interface PfaEntry {
  name: string;
  slug: string;
}

const PFAS: PfaEntry[] = [
  { name: "Stanbic IBTC",        slug: "stanbic-ibtc" },
  { name: "GT Pension",          slug: "gt-pension" },
  { name: "Trustfund",           slug: "trustfund" },
  { name: "Premium Pensions",    slug: "premium-pensions" },
  { name: "AccessARM",           slug: "access-arm" },
  { name: "Oak Pensions",        slug: "oak-pensions" },
  { name: "Leadway Pensure",     slug: "leadway-pensure" },
  { name: "Citizens Pensions",   slug: "citizens-pensions" },
  { name: "Crusader Pensions",   slug: "crusader-pensions" },
  { name: "NLPC Pensions",       slug: "nlpc-pensions" },
  { name: "NPF Pensions",        slug: "npf-pension" },
  { name: "NUPEMCO",             slug: "nupemco" },
  { name: "Norrenberger",        slug: "norrenberger" },
  { name: "CardinalStone",       slug: "cardinalstone" },
  { name: "FCMB Pensions",       slug: "fcmb-pensions" },
  { name: "Fidelity Pensions",   slug: "fidelity-pensions" },
  { name: "PAL Pensions",        slug: "pal-pensions" },
  { name: "Veritas Glanvills",   slug: "veritas-glanvills" },
  { name: "Tangerine APT",       slug: "tangerine-apt" },
];

/* Renders the logo image if it exists at /pfa-logos/{slug}.png; falls back
   to a styled name badge (dot + name) so the marquee never shows a broken image. */
function PfaBadge({ name, slug }: PfaEntry) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex items-center gap-2.5 px-1">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-clay-500)]" />
        <span className="text-white font-bold tracking-widest text-sm whitespace-nowrap">{name.toUpperCase()}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center h-9">
      <img
        src={`/pfa-logos/${slug}.png`}
        alt={name}
        className="h-9 w-auto max-w-[140px] object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export default function TrustMarquee() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "0px 0px 200px 0px" });

  const isPaused = !isInView || reduceMotion;

  return (
    <div ref={containerRef} className="bg-[var(--color-ink-700)] py-7 border-y border-[var(--color-ink-500)] overflow-hidden flex items-center relative shadow-[inset_0_4px_20px_rgba(0,0,0,0.2)]">
      <div className="absolute left-0 w-32 h-full bg-gradient-to-r from-[var(--color-ink-700)] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 w-32 h-full bg-gradient-to-l from-[var(--color-ink-700)] to-transparent z-10 pointer-events-none"></div>

      {/* CSS-driven (0% -> -50%) so it stays seamless regardless of font/content width,
          and pausing via animation-play-state never causes a jump-to-start snap. */}
      <div className={`marquee-track gap-14 items-center pl-16${isPaused ? " is-paused" : ""}`}>
        {[0, 1].flatMap((loop) => [
          <div key={`pencom-${loop}`} className="flex items-center gap-2 px-1 opacity-90 shrink-0">
            <ShieldCheck className="w-4 h-4 text-[var(--color-clay-500)]" />
            <span className="text-white font-bold tracking-widest text-sm whitespace-nowrap">PENCOM REGULATED</span>
          </div>,
          ...PFAS.map((pfa) => (
            <div key={`${pfa.slug}-${loop}`} className="flex items-center cursor-default">
              <PfaBadge {...pfa} />
            </div>
          )),
        ])}
      </div>
    </div>
  );
}

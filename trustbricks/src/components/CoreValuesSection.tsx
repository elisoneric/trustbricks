"use client";

import { motion, Variants } from "framer-motion";
import { Award, Building, Heart, Star, ShieldCheck, Handshake, TrendingUp, Users } from "lucide-react";
import type { CoreValue } from "@/lib/types";

const ICONS: Record<string, any> = { Award, Building, Heart, Star, ShieldCheck, Handshake, TrendingUp, Users };

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

interface CoreValuesSectionProps {
  vision?: string;
  mission?: string;
  coreValues?: CoreValue[];
  compact?: boolean;
}

export default function CoreValuesSection({ vision, mission, coreValues = [], compact = false }: CoreValuesSectionProps) {
  if (!vision && !mission && coreValues.length === 0) return null;

  return (
    <section className={compact ? "" : "py-24 bg-[var(--color-body-bg)]"}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {!compact && (
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-clay-500)]/10 border border-[var(--color-clay-500)]/20 text-[var(--color-clay-500)] text-xs font-bold uppercase tracking-wider mb-6">
              Who We Are
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[var(--color-text-heading)]" style={{ fontFamily: "var(--font-display)" }}>
              Our Purpose &amp; Principles.
            </h2>
          </div>
        )}

        {(vision || mission) && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
          >
            {vision && (
              <motion.div variants={itemVariants} className="bg-[var(--color-card)] rounded-3xl p-8 border border-[var(--color-border)] shadow-card hover:shadow-card-hover transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-ink-700)]/5 flex items-center justify-center text-[var(--color-clay-500)] mb-6">
                  <Building className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-heading)] mb-4" style={{ fontFamily: "var(--font-display)" }}>Our Vision</h3>
                <p className="text-[var(--color-text-body)] leading-relaxed">{vision}</p>
              </motion.div>
            )}
            {mission && (
              <motion.div variants={itemVariants} className="bg-[var(--color-card)] rounded-3xl p-8 border border-[var(--color-border)] shadow-card hover:shadow-card-hover transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-ink-700)]/5 flex items-center justify-center text-[var(--color-clay-500)] mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-text-heading)] mb-4" style={{ fontFamily: "var(--font-display)" }}>Our Mission</h3>
                <p className="text-[var(--color-text-body)] leading-relaxed">{mission}</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {coreValues.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-[var(--color-card)] rounded-3xl p-8 md:p-12 border border-[var(--color-border)] shadow-card"
          >
            <h3 className="text-2xl font-extrabold text-[var(--color-text-heading)] text-center mb-12" style={{ fontFamily: "var(--font-display)" }}>
              Our Core Pillars
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreValues.map((value, i) => {
                const Icon = ICONS[value.icon || ""] || Star;
                return (
                  <motion.div key={i} variants={itemVariants} className="space-y-3">
                    <div className="text-[var(--color-clay-500)] font-bold text-lg flex items-center gap-2">
                      <Icon className="w-5 h-5" /> {value.title}
                    </div>
                    <p className="text-sm text-[var(--color-text-body)] leading-relaxed">{value.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

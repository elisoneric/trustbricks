"use client";

import { motion, Variants } from "framer-motion";
import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import { Building, ShieldCheck, Award, Heart } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] flex flex-col font-sans antialiased">
      <GlobalNavbar />

      <main className="flex-grow pt-32 pb-24">
        {/* Hero Section */}
        <section className="px-6 lg:px-8 text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--color-clay-500)]/10 border border-[var(--color-clay-500)]/20 text-[var(--color-clay-500)] text-xs font-bold uppercase tracking-wider mb-6">
              About Trust Bricks
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-[var(--color-text-heading)] leading-tight mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Teamwork Makes The <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-clay-500)] to-[var(--color-clay-600)]">Dream Work.</span>
            </h1>
            <p className="text-lg text-[var(--color-text-body)] leading-relaxed">
              Trust Bricks Properties Ltd is a mortgage facilitation and real estate advisory firm in Nigeria.
              We assist active contributors under the Contributory Pension Scheme (CPS) in accessing up to 25% of their RSA balance as equity contribution towards residential mortgages, in accordance with PenCom guidelines.
            </p>
          </motion.div>
        </section>

        {/* Content Section */}
        <section className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          >
            {/* Vision */}
            <motion.div variants={itemVariants} className="bg-[var(--color-card)] rounded-3xl p-8 border border-[var(--color-border)] shadow-card hover:shadow-card-hover transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-ink-700)]/5 flex items-center justify-center text-[var(--color-clay-500)] mb-6">
                <Building className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-4" style={{ fontFamily: "var(--font-display)" }}>Our Vision</h2>
              <p className="text-[var(--color-text-body)] leading-relaxed">
                To become the most reliable and transparent gateway to homeownership in Nigeria, enabling every citizen
                to effortlessly transition from tenant to homeowner using their pension assets as leverage.
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div variants={itemVariants} className="bg-[var(--color-card)] rounded-3xl p-8 border border-[var(--color-border)] shadow-card hover:shadow-card-hover transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-ink-700)]/5 flex items-center justify-center text-[var(--color-clay-500)] mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-4" style={{ fontFamily: "var(--font-display)" }}>Our Mission</h2>
              <p className="text-[var(--color-text-body)] leading-relaxed">
                To simplify the complexity of PFA approvals and primary mortgage bank requirements. We guide our clients through
                structured real estate options that conform completely with National Pension Commission guidelines.
              </p>
            </motion.div>
          </motion.div>

          {/* Corporate Core Values */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-[var(--color-card)] rounded-3xl p-8 md:p-12 border border-[var(--color-border)] shadow-card mb-16"
          >
            <h2 className="text-3xl font-extrabold text-[var(--color-text-heading)] text-center mb-12" style={{ fontFamily: "var(--font-display)" }}>
              Our Core Pillars
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="text-[var(--color-clay-500)] font-bold text-lg flex items-center gap-2">
                  <Award className="w-5 h-5" /> Integrity First
                </div>
                <p className="text-sm text-[var(--color-text-body)] leading-relaxed">
                  We maintain absolute compliance with federal guidelines and coordinate honestly with all licensed PFAs and mortgage banks.
                </p>
              </div>
              <div className="space-y-3">
                <div className="text-[var(--color-clay-500)] font-bold text-lg flex items-center gap-2">
                  <Building className="w-5 h-5" /> Customer Obsession
                </div>
                <p className="text-sm text-[var(--color-text-body)] leading-relaxed">
                  Navigating real estate paperwork can be daunting. We do the heavy lifting to ensure you can focus on moving into your home.
                </p>
              </div>
              <div className="space-y-3">
                <div className="text-[var(--color-clay-500)] font-bold text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5" /> Teamwork & Speed
                </div>
                <p className="text-sm text-[var(--color-text-body)] leading-relaxed">
                  Our regional hubs cooperate directly to synchronize files between state land ministries, commercial banks, and PFAs.
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

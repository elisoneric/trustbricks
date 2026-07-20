"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Landmark, CheckCircle2, ChevronRight } from "lucide-react";
import { submitContactForm } from "@/app/actions/contactActions";

export default function MortgageAdvisoryPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pfa: "stanbic",
    balance: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await submitContactForm({
        name: formData.name,
        email: formData.email,
        office: "Mortgage Advisory",
        message: `Phone: ${formData.phone}\nPFA: ${formData.pfa}\nEstimated Balance: ${formData.balance}\n\nRequesting mortgage advisory consultation.`,
      });
      setSubmitted(true);
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] flex flex-col font-sans antialiased">
      <GlobalNavbar />

      <main className="flex-grow pt-32 pb-24">
        <section className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-12 items-center">
            
            {/* Left side: Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="space-y-6"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-clay-500)]/10 border border-[var(--color-clay-500)]/20 text-[var(--color-clay-500)] text-xs font-bold uppercase tracking-wider">
                Expert Guidance
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-[var(--color-text-heading)] leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                Mortgage Advisory <br />
                <span className="text-[var(--color-clay-500)]">Simplified.</span>
              </h1>
              <p className="text-[var(--color-text-body)] leading-relaxed text-base">
                Our mortgage advisory service acts as the direct bridge between your PFA, home builders, and the primary mortgage banks. We ensure you fulfill all guidelines and obtain the most competitive interest rates.
              </p>

              {/* Steps grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-card">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-ink-500)]/10 flex items-center justify-center text-[var(--color-ink-500)] mb-4">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[var(--color-text-heading)] mb-2" style={{ fontFamily: "var(--font-display)" }}>PFA Coordination</h3>
                  <p className="text-xs text-[var(--color-text-body)] leading-relaxed">
                    We compile and pre-screen all RSA application documents to guarantee speed and avoid rejection by your Pension Fund Administrator.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-card">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-clay-500)]/10 flex items-center justify-center text-[var(--color-clay-500)] mb-4">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[var(--color-text-heading)] mb-2" style={{ fontFamily: "var(--font-display)" }}>Bank Matchmaking</h3>
                  <p className="text-xs text-[var(--color-text-body)] leading-relaxed">
                    We match you with commercial and mortgage lenders that align with your budget and interest rate capacity in Nigeria.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right side: Interactive Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 18, delay: 0.15 }}
              className="bg-[var(--color-card)] rounded-[2rem] p-8 border border-[var(--color-border)] shadow-card-hover"
            >
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-[var(--color-text-heading)]" style={{ fontFamily: "var(--font-display)" }}>
                      Request Free Advisory
                    </h2>
                    <p className="text-xs text-[var(--color-text-body)] mt-1">
                      Our certified advisors will review your eligibility within 24 hours.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="name" className="text-xs font-bold text-[var(--color-text-heading)] uppercase tracking-wide">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="e.g. Tunde Johnson"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-clay-500)]/35"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="email" className="text-xs font-bold text-[var(--color-text-heading)] uppercase tracking-wide">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="tunde@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-clay-500)]/35"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="phone" className="text-xs font-bold text-[var(--color-text-heading)] uppercase tracking-wide">Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      placeholder="e.g. +234 803 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-clay-500)]/35"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="pfa" className="text-xs font-bold text-[var(--color-text-heading)] uppercase tracking-wide">Select PFA</label>
                      <select
                        id="pfa"
                        value={formData.pfa}
                        onChange={(e) => setFormData({ ...formData, pfa: e.target.value })}
                        className="w-full px-3 py-3 rounded-xl border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-clay-500)]/35 bg-[var(--color-card)]"
                      >
                        <option value="stanbic">Stanbic IBTC</option>
                        <option value="leadway">Leadway PFA</option>
                        <option value="premium">Premium Pension</option>
                        <option value="arm">ARM Pension</option>
                        <option value="other">Other PFA</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="balance" className="text-xs font-bold text-[var(--color-text-heading)] uppercase tracking-wide">Est. RSA Balance (₦)</label>
                      <input
                        id="balance"
                        type="text"
                        required
                        placeholder="e.g. 10,000,000"
                        value={formData.balance}
                        onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-clay-500)]/35 font-tabular"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[var(--color-clay-500)] text-white font-bold text-sm hover:bg-[var(--color-clay-600)] shadow-lg shadow-[var(--color-clay-500)]/20 transition-all duration-300 cursor-pointer"
                  >
                    <span>Submit Advisory Request</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-[var(--color-moss)]/10 text-[var(--color-moss)] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-[var(--color-text-heading)]" style={{ fontFamily: "var(--font-display)" }}>
                    Advisory Requested!
                  </h3>
                  <p className="text-sm text-[var(--color-text-body)] max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong className="text-[var(--color-text-heading)]">{formData.name}</strong>. A Trust Bricks PenCom specialist will call you at <strong className="text-[var(--color-text-heading)]">{formData.phone}</strong> shortly to review your mortgage requirements.
                  </p>
                </motion.div>
              )}
            </motion.div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

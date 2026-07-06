"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Landmark, CheckCircle2, ChevronRight } from "lucide-react";

export default function MortgageAdvisoryPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pfa: "stanbic",
    balance: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F0F4F9] flex flex-col font-sans antialiased">
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8600A]/10 border border-[#E8600A]/20 text-[#E8600A] text-xs font-bold uppercase tracking-wider">
                Expert Guidance
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-[#0D1F3C] leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                Mortgage Advisory <br />
                <span className="text-[#E8600A]">Simplified.</span>
              </h1>
              <p className="text-[#475569] leading-relaxed text-base">
                Our mortgage advisory service acts as the direct bridge between your PFA, home builders, and the primary mortgage banks. We ensure you fulfill all guidelines and obtain the most competitive interest rates.
              </p>

              {/* Steps grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-card">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 mb-4">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[#0D1F3C] mb-2" style={{ fontFamily: "var(--font-display)" }}>PFA Coordination</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    We compile and pre-screen all RSA application documents to guarantee speed and avoid rejection by your Pension Fund Administrator.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-card">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-[#E8600A] mb-4">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-[#0D1F3C] mb-2" style={{ fontFamily: "var(--font-display)" }}>Bank Matchmaking</h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
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
              className="bg-white rounded-[2rem] p-8 border border-slate-200/60 shadow-card-hover"
            >
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-[#0D1F3C]" style={{ fontFamily: "var(--font-display)" }}>
                      Request Free Advisory
                    </h2>
                    <p className="text-xs text-[#475569] mt-1">
                      Our certified advisors will review your eligibility within 24 hours.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="name" className="text-xs font-bold text-[#0D1F3C] uppercase tracking-wide">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="e.g. Tunde Johnson"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="email" className="text-xs font-bold text-[#0D1F3C] uppercase tracking-wide">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="tunde@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="phone" className="text-xs font-bold text-[#0D1F3C] uppercase tracking-wide">Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      placeholder="e.g. +234 803 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="pfa" className="text-xs font-bold text-[#0D1F3C] uppercase tracking-wide">Select PFA</label>
                      <select
                        id="pfa"
                        value={formData.pfa}
                        onChange={(e) => setFormData({ ...formData, pfa: e.target.value })}
                        className="w-full px-3 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35 bg-white"
                      >
                        <option value="stanbic">Stanbic IBTC</option>
                        <option value="leadway">Leadway PFA</option>
                        <option value="premium">Premium Pension</option>
                        <option value="arm">ARM Pension</option>
                        <option value="other">Other PFA</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="balance" className="text-xs font-bold text-[#0D1F3C] uppercase tracking-wide">Est. RSA Balance (₦)</label>
                      <input
                        id="balance"
                        type="text"
                        required
                        placeholder="e.g. 10,000,000"
                        value={formData.balance}
                        onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#E8600A] text-white font-bold text-sm hover:bg-[#D4530A] shadow-lg shadow-[#E8600A]/20 transition-all duration-300 cursor-pointer"
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
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-[#0D1F3C]" style={{ fontFamily: "var(--font-display)" }}>
                    Advisory Requested!
                  </h3>
                  <p className="text-sm text-[#475569] max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong className="text-[#0D1F3C]">{formData.name}</strong>. A Trust Bricks PenCom specialist will call you at <strong className="text-[#0D1F3C]">{formData.phone}</strong> shortly to review your mortgage requirements.
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

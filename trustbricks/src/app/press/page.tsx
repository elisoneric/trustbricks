"use client";

import { motion } from "framer-motion";
import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import { Calendar, ArrowRight, Rss } from "lucide-react";

const ARTICLES = [
  {
    title: "Trust Bricks Properties Facilitates Over ₦1.2B in RSA Mortgage Withdrawals",
    date: "June 28, 2026",
    excerpt: "Trust Bricks successfully partners with leading Pension Fund Administrators (PFAs) to disburse down payments for over 150 civil servants and professionals in Abuja and Lagos.",
    category: "Milestone",
  },
  {
    title: "PenCom Approves New Adjustments to Joint RSA Mortgage Contributions",
    date: "May 14, 2026",
    excerpt: "Understanding the latest administrative changes that allow married couples in Nigeria to pool their retirement savings accounts for a combined equity contribution.",
    category: "Regulatory Update",
  },
  {
    title: "Trust Bricks Properties Ltd Announces Expansion to Adamawa and Kaduna States",
    date: "April 02, 2026",
    excerpt: "New physical hub centers open in Yola and Kaduna to support northern professionals looking to process RSA mortgage down payments.",
    category: "Expansion",
  }
];

export default function PressPage() {
  return (
    <div className="min-h-screen bg-[#F0F4F9] flex flex-col font-sans antialiased">
      <GlobalNavbar />

      <main className="flex-grow pt-32 pb-24">
        <section className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8600A]/10 border border-[#E8600A]/20 text-[#E8600A] text-xs font-bold uppercase tracking-wider mb-6">
              Press & Media
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-[#0D1F3C] mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Latest News & <br />
              <span className="text-[#E8600A]">Announcements.</span>
            </h1>
            <p className="text-sm text-[#475569] leading-relaxed">
              Find our latest corporate statements, regulatory announcements, and media assets regarding PenCom RSA mortgage guides.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ARTICLES.map((article, index) => (
              <motion.article
                key={article.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#E8600A] uppercase tracking-wider bg-[#E8600A]/5 px-2.5 py-1 rounded-md">
                      {article.category}
                    </span>
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {article.date}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0D1F3C] leading-snug line-clamp-3 hover:text-[#E8600A] cursor-pointer transition-colors" style={{ fontFamily: "var(--font-display)" }}>
                    {article.title}
                  </h3>

                  <p className="text-xs text-[#475569] leading-relaxed line-clamp-4">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-6">
                  <a
                    href="#"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D1F3C] hover:text-[#E8600A] transition-colors group"
                  >
                    <span>Read Full Release</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Media Kit Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-16 bg-[#0D1F3C] rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-center gap-8"
          >
            <div className="space-y-3 max-w-xl">
              <h2 className="text-2xl font-bold flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                <Rss className="w-6 h-6 text-[#E8600A]" /> Media Kit & Resources
              </h2>
              <p className="text-sm text-white/70 leading-relaxed">
                Looking for brand assets, logos, office photos, or certified executive headshots of the Trust Bricks management team? Download our official package.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => alert("Downloading Media Kit...")}
                className="px-6 py-3.5 rounded-xl bg-[var(--color-amber-500)] hover:bg-[#D4530A] text-white font-bold text-sm transition-all duration-200 cursor-pointer shadow-lg"
              >
                Download Assets (14MB)
              </button>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

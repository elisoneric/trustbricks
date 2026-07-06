"use client";

import { motion } from "framer-motion";
import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import { Briefcase, MapPin, Calendar, Clock, ArrowUpRight } from "lucide-react";

const JOBS = [
  {
    title: "Lead Mortgage Facilitator",
    department: "Advisory Operations",
    location: "Abuja (HQ)",
    type: "Full-Time",
    posted: "2 days ago",
  },
  {
    title: "Regional Sales Coordinator",
    department: "Real Estate Partners",
    location: "Lagos Hub",
    type: "Full-Time",
    posted: "1 week ago",
  },
  {
    title: "Client Relationship Officer",
    department: "Customer Experience",
    location: "Kaduna Office",
    type: "Full-Time",
    posted: "3 days ago",
  },
  {
    title: "Data and Compliance Analyst",
    department: "Legal & Compliance",
    location: "Abuja (HQ) / Remote",
    type: "Contract",
    posted: "5 days ago",
  }
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#F0F4F9] flex flex-col font-sans antialiased">
      <GlobalNavbar />

      <main className="flex-grow pt-32 pb-24">
        <section className="max-w-4xl mx-auto px-6 lg:px-8 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8600A]/10 border border-[#E8600A]/20 text-[#E8600A] text-xs font-bold uppercase tracking-wider mb-6">
              Join Our Team
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-[#0D1F3C] mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Build the Future of <br />
              <span className="text-[#E8600A]">Homeownership.</span>
            </h1>
            <p className="text-lg text-[#475569] leading-relaxed max-w-2xl mx-auto">
              At Trust Bricks, we work collaboratively to dismantle the barriers preventing millions of Nigerians from owning homes. Join us in making a real-world impact.
            </p>
          </motion.div>
        </section>

        {/* Jobs List */}
        <section className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="space-y-4">
            {JOBS.map((job, index) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 16, delay: index * 0.08 }}
                whileHover={{ y: -3, scale: 1.01 }}
                className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col sm:flex-row justify-between sm:items-center gap-6"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[#E8600A] uppercase tracking-wider bg-[#E8600A]/5 px-2.5 py-1 rounded-md">
                    {job.department}
                  </span>
                  <h3 className="text-xl font-bold text-[#0D1F3C]" style={{ fontFamily: "var(--font-display)" }}>
                    {job.title}
                  </h3>
                  
                  {/* Job Metadata */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#475569] font-medium">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {job.type}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {job.posted}</span>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => alert(`Applying for ${job.title} position...`)}
                    className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-[#0D1F3C] hover:bg-[#1E3A5F] text-white text-xs font-bold transition-all duration-200 cursor-pointer shadow-md"
                  >
                    <span>Apply Now</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

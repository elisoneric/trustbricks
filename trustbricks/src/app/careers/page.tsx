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
    <div className="min-h-screen bg-[var(--color-body-bg)] flex flex-col font-sans antialiased">
      <GlobalNavbar />

      <main className="flex-grow pt-32 pb-24">
        <section className="max-w-4xl mx-auto px-6 lg:px-8 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-clay-500)]/10 border border-[var(--color-clay-500)]/20 text-[var(--color-clay-500)] text-xs font-bold uppercase tracking-wider mb-6">
              Join Our Team
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-[var(--color-text-heading)] mb-6" style={{ fontFamily: "var(--font-display)" }}>
              Build the Future of <br />
              <span className="text-[var(--color-clay-500)]">Homeownership.</span>
            </h1>
            <p className="text-lg text-[var(--color-text-body)] leading-relaxed max-w-2xl mx-auto">
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
                className="bg-[var(--color-card)] rounded-2xl p-6 border border-[var(--color-border)] shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col sm:flex-row justify-between sm:items-center gap-6"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold text-[var(--color-clay-500)] uppercase tracking-wider bg-[var(--color-clay-500)]/5 px-2.5 py-1 rounded-md">
                    {job.department}
                  </span>
                  <h3 className="text-xl font-bold text-[var(--color-text-heading)]" style={{ fontFamily: "var(--font-display)" }}>
                    {job.title}
                  </h3>

                  {/* Job Metadata */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[var(--color-text-body)] font-medium">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[var(--color-text-muted)]" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[var(--color-text-muted)]" /> {job.type}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[var(--color-text-muted)]" /> {job.posted}</span>
                  </div>
                </div>

                <div>
                  <a
                    href={`mailto:careers@trustbrickspropertieslimited.com.ng?subject=Application: ${encodeURIComponent(job.title)}`}
                    className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-[var(--color-ink-700)] hover:bg-[var(--color-ink-600)] text-white text-xs font-bold transition-all duration-200 cursor-pointer shadow-md"
                  >
                    <span>Apply Now</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
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

"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, ArrowUpRight, Briefcase } from "lucide-react";
import { format } from "date-fns";

interface JobRecord {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  externalApplyUrl: string;
  postedAt: string | Date;
}

export default function CareersPageClient({ jobs }: { jobs: JobRecord[] }) {
  return (
    <>
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

      <section className="max-w-4xl mx-auto px-6 lg:px-8">
        {jobs.length === 0 ? (
          <div className="text-center py-16 text-[var(--color-text-muted)]">
            <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No open roles right now — check back soon.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 16, delay: index * 0.08 }}
                whileHover={{ y: -3, scale: 1.01 }}
                className="bg-[var(--color-card)] rounded-2xl p-6 border border-[var(--color-border)] shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col sm:flex-row justify-between sm:items-center gap-6"
              >
                <div className="space-y-2">
                  {job.department && (
                    <span className="text-xs font-bold text-[var(--color-clay-500)] uppercase tracking-wider bg-[var(--color-clay-500)]/5 px-2.5 py-1 rounded-md">
                      {job.department}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-[var(--color-text-heading)]" style={{ fontFamily: "var(--font-display)" }}>
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[var(--color-text-body)] font-medium">
                    {job.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[var(--color-text-muted)]" /> {job.location}</span>}
                    {job.type && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[var(--color-text-muted)]" /> {job.type}</span>}
                  </div>
                  {job.description && <p className="text-xs text-[var(--color-text-body)] leading-relaxed max-w-xl">{job.description}</p>}
                  {job.requirements && (
                    <p className="text-xs text-[var(--color-text-muted)] leading-relaxed max-w-xl">
                      <strong className="text-[var(--color-text-body)]">Requirements:</strong> {job.requirements}
                    </p>
                  )}
                </div>

                <div>
                  <a
                    href={job.externalApplyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-[var(--color-ink-700)] hover:bg-[var(--color-ink-600)] text-white text-xs font-bold transition-all duration-200 cursor-pointer shadow-md"
                  >
                    <span>Apply Now</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

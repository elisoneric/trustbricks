"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface TestimonialRecord {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatarUrl: string | null;
  rating: number;
}

export default function TestimonialsSection({ testimonials }: { testimonials: TestimonialRecord[] }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-24 bg-[var(--color-card)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-clay-500)]/10 border border-[var(--color-clay-500)]/20 text-[var(--color-clay-500)] text-xs font-bold uppercase tracking-wider mb-6">
            Happy Customers
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[var(--color-text-heading)]" style={{ fontFamily: "var(--font-display)" }}>
            Real Nigerians, Real Homes.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.slice(0, 6).map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 3) * 0.1 }}
              className="bg-[var(--color-body-bg)] rounded-2xl p-6 border border-[var(--color-border)] shadow-card"
            >
              <Quote className="w-6 h-6 text-[var(--color-clay-500)]/40 mb-3" />
              <p className="text-sm text-[var(--color-text-body)] leading-relaxed mb-5">{t.quote}</p>
              <div className="flex items-center gap-3">
                {t.avatarUrl ? (
                  <img src={t.avatarUrl} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[var(--color-clay-500)]/10 text-[var(--color-clay-500)] flex items-center justify-center font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-[var(--color-text-heading)]">{t.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{t.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[var(--color-clay-500)] text-[var(--color-clay-500)]" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

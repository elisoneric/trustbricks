"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Home, ArrowRight } from "lucide-react";

interface PropertyRecord {
  id: string;
  title: string;
  category: string;
  priceLabel: string;
  price: number | null;
  city: string;
  state: string;
  images: string;
}

export default function PropertiesTeaser({ properties }: { properties: PropertyRecord[] }) {
  if (!properties || properties.length === 0) return null;

  return (
    <section className="py-24 bg-[var(--color-body-bg)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-clay-500)]/10 border border-[var(--color-clay-500)]/20 text-[var(--color-clay-500)] text-xs font-bold uppercase tracking-wider mb-4">
              Beyond Mortgages
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[var(--color-text-heading)]" style={{ fontFamily: "var(--font-display)" }}>
              Featured Properties.
            </h2>
          </div>
          <Link href="/properties" className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-clay-500)] hover:underline shrink-0">
            View All Properties <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.slice(0, 3).map((property, index) => {
            const images: string[] = JSON.parse(property.images || "[]");
            return (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Link href={`/properties/${property.id}`} className="block bg-[var(--color-card)] rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-card hover:shadow-card-hover transition-all duration-300 group">
                  <div className="relative h-48 w-full overflow-hidden bg-[var(--color-mortar-50)]">
                    {images[0] ? (
                      <img src={images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]"><Home className="w-8 h-8 opacity-30" /></div>
                    )}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-bold uppercase">{property.category}</span>
                  </div>
                  <div className="p-5 space-y-1.5">
                    <h3 className="text-sm font-bold text-[var(--color-text-heading)] line-clamp-1" style={{ fontFamily: "var(--font-display)" }}>{property.title}</h3>
                    <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {property.city}, {property.state}</p>
                    <p className="text-sm font-bold text-[var(--color-clay-500)]">{property.priceLabel || (property.price ? `₦${property.price.toLocaleString()}` : "Price on request")}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

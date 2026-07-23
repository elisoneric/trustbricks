"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, BedDouble, Bath, Ruler, Home } from "lucide-react";
import { PROPERTY_CATEGORIES } from "@/lib/types";

interface PropertyRecord {
  id: string;
  title: string;
  category: string;
  status: string;
  price: number | null;
  priceLabel: string;
  city: string;
  state: string;
  bedrooms: number | null;
  bathrooms: number | null;
  sizeSqm: number | null;
  images: string;
  featured: boolean;
}

const FILTERS = ["ALL", ...PROPERTY_CATEGORIES] as const;

export default function PropertiesPageClient({ properties }: { properties: PropertyRecord[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");

  const filtered = filter === "ALL" ? properties : properties.filter((p) => p.category === filter);

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-clay-500)]/10 border border-[var(--color-clay-500)]/20 text-[var(--color-clay-500)] text-xs font-bold uppercase tracking-wider mb-6">
          Properties
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-[var(--color-text-heading)] mb-6" style={{ fontFamily: "var(--font-display)" }}>
          Homes, Land & <br />
          <span className="text-[var(--color-clay-500)]">Commercial Spaces.</span>
        </h1>
        <p className="text-sm text-[var(--color-text-body)] leading-relaxed">
          Browse residential, commercial, and land listings available through Trust Bricks Properties — alongside our core PenCom RSA mortgage service.
        </p>
      </div>

      <div className="flex justify-center gap-2 mb-10 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-colors cursor-pointer ${
              filter === f
                ? "bg-[var(--color-clay-500)] text-white"
                : "bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text-body)] hover:border-[var(--color-clay-500)]"
            }`}
          >
            {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-text-muted)]">
          <Home className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No properties in this category yet — check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((property, index) => {
            const images: string[] = JSON.parse(property.images || "[]");
            return (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 6) * 0.06 }}
              >
                <Link
                  href={`/properties/${property.id}`}
                  className="block bg-[var(--color-card)] rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-card hover:shadow-card-hover transition-all duration-300 group"
                >
                  <div className="relative h-52 w-full overflow-hidden bg-[var(--color-mortar-50)]">
                    {images[0] ? (
                      <img src={images[0]} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">
                        <Home className="w-10 h-10 opacity-30" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-bold uppercase tracking-wide">
                      {property.category}
                    </span>
                    {property.status !== "AVAILABLE" && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[var(--color-clay-500)] text-white text-[10px] font-bold uppercase tracking-wide">
                        {property.status.replace("_", " ")}
                      </span>
                    )}
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-[var(--color-text-heading)] line-clamp-1" style={{ fontFamily: "var(--font-display)" }}>
                      {property.title}
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> {property.city}, {property.state}
                    </p>
                    <p className="text-sm font-bold text-[var(--color-clay-500)]">
                      {property.priceLabel || (property.price ? `₦${property.price.toLocaleString()}` : "Price on request")}
                    </p>
                    {(property.bedrooms || property.bathrooms || property.sizeSqm) && (
                      <div className="flex items-center gap-4 pt-2 border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                        {property.bedrooms ? <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" /> {property.bedrooms}</span> : null}
                        {property.bathrooms ? <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {property.bathrooms}</span> : null}
                        {property.sizeSqm ? <span className="flex items-center gap-1"><Ruler className="w-3.5 h-3.5" /> {property.sizeSqm}m²</span> : null}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}

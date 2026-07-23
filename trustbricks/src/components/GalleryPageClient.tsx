"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImageOff } from "lucide-react";

interface GalleryImageRecord {
  id: string;
  url: string;
  caption: string;
  category: string;
}

export default function GalleryPageClient({ images }: { images: GalleryImageRecord[] }) {
  const [selected, setSelected] = useState<GalleryImageRecord | null>(null);
  const categories = Array.from(new Set(images.map((i) => i.category)));

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-clay-500)]/10 border border-[var(--color-clay-500)]/20 text-[var(--color-clay-500)] text-xs font-bold uppercase tracking-wider mb-6">
          Gallery
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-[var(--color-text-heading)] mb-6" style={{ fontFamily: "var(--font-display)" }}>
          A Look Inside <br />
          <span className="text-[var(--color-clay-500)]">Trust Bricks.</span>
        </h1>
        <p className="text-sm text-[var(--color-text-body)] leading-relaxed">
          Our offices, our team, and the properties we help Nigerians call home.
        </p>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-text-muted)]">
          <ImageOff className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No photos yet — check back soon.</p>
        </div>
      ) : (
        categories.map((category) => (
          <div key={category} className="mb-14">
            <h2 className="text-lg font-bold text-[var(--color-text-heading)] mb-5 capitalize" style={{ fontFamily: "var(--font-display)" }}>
              {category}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.filter((i) => i.category === category).map((img, index) => (
                <motion.button
                  key={img.id}
                  type="button"
                  onClick={() => setSelected(img)}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % 8) * 0.04 }}
                  className="relative rounded-xl overflow-hidden aspect-square group cursor-pointer"
                >
                  <img src={img.url} alt={img.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {img.caption && (
                    <span className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent text-white text-[10px] text-left truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {img.caption}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        ))
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[500] bg-black/85 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out"
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              src={selected.url}
              alt={selected.caption}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[85vh] rounded-2xl object-contain"
            />
            {selected.caption && (
              <p className="absolute bottom-6 text-white/80 text-sm">{selected.caption}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

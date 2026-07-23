"use client";

import { useState } from "react";
import { updateTestimonial, deleteTestimonial } from "@/app/actions/testimonialActions";
import { Trash, Pencil, X, Check, Star, Quote } from "lucide-react";

interface TestimonialRecord {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatarUrl: string | null;
  rating: number;
  published: boolean;
}

export default function TestimonialEditForm({ testimonial }: { testimonial: TestimonialRecord }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputClass = "w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35";

  const handleSubmit = async (formData: FormData) => {
    setSaving(true);
    await updateTestimonial(testimonial.id, formData);
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="p-5 flex justify-between items-start gap-4 hover:bg-slate-50/20 transition-colors">
      <div className="space-y-1 flex-grow">
        <div className="flex items-center gap-2">
          {testimonial.avatarUrl && <img src={testimonial.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />}
          <h4 className="font-bold text-slate-900 text-base" style={{ fontFamily: "var(--font-display)" }}>{testimonial.name}</h4>
          {!testimonial.published && <span className="px-1.5 py-0.5 bg-slate-200 text-slate-500 text-[9px] font-bold rounded uppercase">Draft</span>}
        </div>

        {editing ? (
          <form action={handleSubmit} className="mt-2 space-y-2">
            <input name="name" defaultValue={testimonial.name} placeholder="Name" required className={inputClass} />
            <input name="role" defaultValue={testimonial.role} placeholder="Role (e.g. Homeowner, Lagos)" className={inputClass} />
            <textarea name="quote" defaultValue={testimonial.quote} placeholder="Quote" rows={3} required className={`${inputClass} resize-none`} />
            <div className="grid grid-cols-2 gap-2 items-center">
              <select name="rating" defaultValue={testimonial.rating} className={inputClass}>
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
              </select>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <input type="checkbox" name="published" defaultChecked={testimonial.published} className="rounded" /> Published
              </label>
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              Photo: <input type="file" name="avatar" accept="image/*" className="text-xs" />
            </label>
            <div className="flex gap-2 mt-2">
              <button type="submit" disabled={saving} className="flex items-center gap-1 px-3 py-1.5 bg-[#0D1F3C] text-white text-[10px] font-bold rounded-lg hover:bg-[#1E3A5F] transition-colors cursor-pointer disabled:opacity-50">
                <Check className="w-3 h-3" /> {saving ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <X className="w-3 h-3" /> Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <p className="text-xs text-slate-500">{testimonial.role}</p>
            <p className="text-xs text-slate-500 flex items-start gap-1.5 italic">
              <Quote className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" /> {testimonial.quote}
            </p>
            <div className="flex gap-0.5">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-[#E8600A] text-[#E8600A]" />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex gap-1 shrink-0">
        {!editing && (
          <button type="button" onClick={() => setEditing(true)} className="p-2 text-slate-400 hover:text-[#E8600A] hover:bg-orange-50 rounded-xl transition-all cursor-pointer" aria-label={`Edit ${testimonial.name}`}>
            <Pencil className="w-4 h-4" />
          </button>
        )}
        <form action={async () => { await deleteTestimonial(testimonial.id); }}>
          <button type="submit" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer" aria-label={`Remove ${testimonial.name}`}>
            <Trash className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

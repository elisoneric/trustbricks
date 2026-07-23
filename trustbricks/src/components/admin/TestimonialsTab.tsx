import { createTestimonial } from "@/app/actions/testimonialActions";
import TestimonialEditForm from "@/components/TestimonialEditForm";
import { Plus } from "lucide-react";

export default function TestimonialsTab({ testimonials }: { testimonials: any[] }) {
  const inputClass = "w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-[#0D1F3C]" style={{ fontFamily: "var(--font-display)" }}>Testimonials</h2>
        <p className="text-slate-500 text-xs mt-0.5">Happy-customer quotes shown on the homepage.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-8 items-start">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-card">
          <h3 className="text-lg font-bold text-[#0D1F3C] mb-4" style={{ fontFamily: "var(--font-display)" }}>Add Testimonial</h3>
          <form action={async (formData) => { 'use server'; await createTestimonial(formData); }} className="space-y-3">
            <input name="name" required placeholder="Customer name" className={inputClass} />
            <input name="role" placeholder="Role (e.g. Homeowner, Lagos)" className={inputClass} />
            <textarea name="quote" required placeholder="Quote" rows={3} className={`${inputClass} resize-none`} />
            <div className="grid grid-cols-2 gap-3 items-center">
              <select name="rating" defaultValue={5} className={inputClass}>
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
              </select>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <input type="checkbox" name="published" defaultChecked className="rounded" /> Published
              </label>
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              Photo: <input type="file" name="avatar" accept="image/*" className="text-xs" />
            </label>
            <button type="submit" className="w-full flex items-center justify-center gap-1.5 py-3 rounded-lg bg-[#0D1F3C] hover:bg-[#1E3A5F] text-white text-xs font-bold transition-colors cursor-pointer shadow-md">
              <Plus className="w-4 h-4" /> Add Testimonial
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-card overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Testimonials ({testimonials?.length || 0})</span>
          </div>
          <div className="divide-y divide-slate-100">
            {!testimonials || testimonials.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">No testimonials yet.</div>
            ) : (
              testimonials.map((t: any) => <TestimonialEditForm key={t.id} testimonial={t} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

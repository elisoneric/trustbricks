import { createProperty } from "@/app/actions/propertyActions";
import { PROPERTY_CATEGORIES, PROPERTY_STATUSES } from "@/lib/types";
import PropertyEditForm from "@/components/PropertyEditForm";
import { Plus } from "lucide-react";

export default function PropertiesTab({ properties }: { properties: any[] }) {
  const inputClass = "w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-[#0D1F3C]" style={{ fontFamily: "var(--font-display)" }}>Properties</h2>
        <p className="text-slate-500 text-xs mt-0.5">Manage residential, commercial, and land listings shown on the Properties page.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-8 items-start">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-card">
          <h3 className="text-lg font-bold text-[#0D1F3C] mb-4" style={{ fontFamily: "var(--font-display)" }}>Add New Property</h3>
          <form action={async (formData) => { 'use server'; await createProperty(formData); }} className="space-y-3">
            <input name="title" required placeholder="Title" className={inputClass} />
            <div className="grid grid-cols-2 gap-3">
              <select name="category" className={inputClass}>
                {PROPERTY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select name="status" className={inputClass}>
                {PROPERTY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <textarea name="description" placeholder="Description" rows={2} className={`${inputClass} resize-none`} />
            <div className="grid grid-cols-2 gap-3">
              <input name="city" required placeholder="City" className={inputClass} />
              <input name="state" required placeholder="State" className={inputClass} />
            </div>
            <input name="address" placeholder="Address" className={inputClass} />
            <div className="grid grid-cols-2 gap-3">
              <input name="price" type="number" placeholder="Price (₦)" className={inputClass} />
              <input name="priceLabel" placeholder='e.g. "Price on request"' className={inputClass} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <input name="bedrooms" type="number" placeholder="Beds" className={inputClass} />
              <input name="bathrooms" type="number" placeholder="Baths" className={inputClass} />
              <input name="sizeSqm" type="number" placeholder="Sqm" className={inputClass} />
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input type="checkbox" name="featured" className="rounded" /> Featured on homepage
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              Photos: <input type="file" name="images" accept="image/*" multiple className="text-xs" />
            </label>
            <button type="submit" className="w-full flex items-center justify-center gap-1.5 py-3 rounded-lg bg-[#0D1F3C] hover:bg-[#1E3A5F] text-white text-xs font-bold transition-colors cursor-pointer shadow-md">
              <Plus className="w-4 h-4" /> Add Property
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-card overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Listings ({properties?.length || 0})</span>
          </div>
          <div className="divide-y divide-slate-100">
            {!properties || properties.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">No properties yet.</div>
            ) : (
              properties.map((p: any) => <PropertyEditForm key={p.id} property={p} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

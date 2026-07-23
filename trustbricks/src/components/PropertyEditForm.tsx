"use client";

import { useState } from "react";
import { updateProperty, deleteProperty, removePropertyImage } from "@/app/actions/propertyActions";
import { PROPERTY_CATEGORIES, PROPERTY_STATUSES } from "@/lib/types";
import { MapPin, Trash, Pencil, X, Check, Home, ImagePlus } from "lucide-react";

interface PropertyRecord {
  id: string;
  title: string;
  category: string;
  status: string;
  description: string;
  price: number | null;
  priceLabel: string;
  city: string;
  state: string;
  address: string;
  bedrooms: number | null;
  bathrooms: number | null;
  sizeSqm: number | null;
  images: string;
  featured: boolean;
}

export default function PropertyEditForm({ property }: { property: PropertyRecord }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const images: string[] = JSON.parse(property.images || "[]");

  const inputClass =
    "w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35";

  const handleSubmit = async (formData: FormData) => {
    setSaving(true);
    await updateProperty(property.id, formData);
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="p-5 flex justify-between items-start gap-4 hover:bg-slate-50/20 transition-colors">
      <div className="space-y-1 flex-grow">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-bold text-slate-900 text-base flex items-center gap-1.5" style={{ fontFamily: "var(--font-display)" }}>
            <Home className="w-4 h-4 text-slate-400" /> {property.title}
          </h4>
          <span className="px-1.5 py-0.5 bg-[#0D1F3C]/5 text-[#0D1F3C] text-[9px] font-bold rounded uppercase">{property.category}</span>
          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-bold rounded uppercase">{property.status}</span>
          {property.featured && <span className="px-1.5 py-0.5 bg-[#E8600A]/10 text-[#E8600A] text-[9px] font-bold rounded uppercase">Featured</span>}
        </div>

        {editing ? (
          <form action={handleSubmit} className="mt-2 space-y-2">
            <input name="title" defaultValue={property.title} placeholder="Title" required className={inputClass} />
            <div className="grid grid-cols-2 gap-2">
              <select name="category" defaultValue={property.category} className={inputClass}>
                {PROPERTY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select name="status" defaultValue={property.status} className={inputClass}>
                {PROPERTY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <textarea name="description" defaultValue={property.description} placeholder="Description" rows={2} className={`${inputClass} resize-none`} />
            <div className="grid grid-cols-2 gap-2">
              <input name="city" defaultValue={property.city} placeholder="City" required className={inputClass} />
              <input name="state" defaultValue={property.state} placeholder="State" required className={inputClass} />
            </div>
            <input name="address" defaultValue={property.address} placeholder="Address" className={inputClass} />
            <div className="grid grid-cols-2 gap-2">
              <input name="price" type="number" defaultValue={property.price ?? ""} placeholder="Price (₦)" className={inputClass} />
              <input name="priceLabel" defaultValue={property.priceLabel} placeholder='e.g. "Price on request"' className={inputClass} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input name="bedrooms" type="number" defaultValue={property.bedrooms ?? ""} placeholder="Beds" className={inputClass} />
              <input name="bathrooms" type="number" defaultValue={property.bathrooms ?? ""} placeholder="Baths" className={inputClass} />
              <input name="sizeSqm" type="number" defaultValue={property.sizeSqm ?? ""} placeholder="Sqm" className={inputClass} />
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input type="checkbox" name="featured" defaultChecked={property.featured} className="rounded" />
              Featured on homepage
            </label>

            {images.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {images.map((img) => (
                  <div key={img} className="relative">
                    <img src={img} alt="" className="w-14 h-14 object-cover rounded-lg border border-slate-200" />
                    <button
                      type="button"
                      onClick={async () => { await removePropertyImage(property.id, img); }}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px]"
                      aria-label="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
              <ImagePlus className="w-3.5 h-3.5" /> Add more photos
              <input type="file" name="images" accept="image/*" multiple className="hidden" onChange={(e) => e.target.form?.requestSubmit()} />
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
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {property.address}{property.address ? ", " : ""}{property.city}, {property.state}
            </p>
            <p className="text-xs text-slate-500">{property.priceLabel || (property.price ? `₦${property.price.toLocaleString()}` : "Price on request")}</p>
            {images.length > 0 && (
              <div className="flex gap-1.5 mt-1">
                {images.slice(0, 4).map((img) => (
                  <img key={img} src={img} alt="" className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                ))}
                {images.length > 4 && <span className="text-[10px] text-slate-400 self-center">+{images.length - 4}</span>}
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex gap-1 shrink-0">
        {!editing && (
          <button type="button" onClick={() => setEditing(true)} className="p-2 text-slate-400 hover:text-[#E8600A] hover:bg-orange-50 rounded-xl transition-all cursor-pointer" aria-label={`Edit ${property.title}`}>
            <Pencil className="w-4 h-4" />
          </button>
        )}
        <form action={async () => { await deleteProperty(property.id); }}>
          <button type="submit" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer" aria-label={`Remove ${property.title}`}>
            <Trash className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

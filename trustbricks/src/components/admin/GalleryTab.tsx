import { createGalleryImage, deleteGalleryImage } from "@/app/actions/galleryActions";
import { Plus, Trash } from "lucide-react";

export default function GalleryTab({ images }: { images: any[] }) {
  const inputClass = "w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-[#0D1F3C]" style={{ fontFamily: "var(--font-display)" }}>Gallery</h2>
        <p className="text-slate-500 text-xs mt-0.5">Photos shown on the public Gallery page and across the homepage.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-card">
        <h3 className="text-lg font-bold text-[#0D1F3C] mb-4" style={{ fontFamily: "var(--font-display)" }}>Add Photo</h3>
        <form action={async (formData) => { 'use server'; await createGalleryImage(formData); }} className="grid grid-cols-1 md:grid-cols-[2fr_2fr_2fr_auto] gap-3 items-end">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Image</label>
            <input type="file" name="image" accept="image/*" required className="text-xs" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Caption</label>
            <input name="caption" placeholder="Caption (optional)" className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Category</label>
            <input name="category" defaultValue="general" placeholder="e.g. offices, team, events" className={inputClass} />
          </div>
          <button type="submit" className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-[#0D1F3C] hover:bg-[#1E3A5F] text-white text-xs font-bold transition-colors cursor-pointer shadow-md">
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-card overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Photos ({images?.length || 0})</span>
        </div>
        {!images || images.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">No photos yet.</div>
        ) : (
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img: any) => (
              <div key={img.id} className="relative group">
                <img src={img.url} alt={img.caption || ""} className="w-full h-28 object-cover rounded-xl border border-slate-200" />
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/60 text-white text-[9px] font-bold rounded uppercase">{img.category}</span>
                <form action={async () => { 'use server'; await deleteGalleryImage(img.id); }} className="absolute top-1.5 right-1.5">
                  <button type="submit" className="w-6 h-6 bg-white/90 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-lg flex items-center justify-center transition-colors cursor-pointer" aria-label="Delete photo">
                    <Trash className="w-3 h-3" />
                  </button>
                </form>
                {img.caption && <p className="text-[10px] text-slate-500 mt-1 truncate">{img.caption}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { createJob } from "@/app/actions/jobActions";
import JobEditForm from "@/components/JobEditForm";
import { Plus } from "lucide-react";

export default function CareersTab({ jobs }: { jobs: any[] }) {
  const inputClass = "w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-[#0D1F3C]" style={{ fontFamily: "var(--font-display)" }}>Careers</h2>
        <p className="text-slate-500 text-xs mt-0.5">Job listings link out to the HR portal for applications — description and requirements can be left blank.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-8 items-start">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-card">
          <h3 className="text-lg font-bold text-[#0D1F3C] mb-4" style={{ fontFamily: "var(--font-display)" }}>Add Job Listing</h3>
          <form action={async (formData) => { 'use server'; await createJob(formData); }} className="space-y-3">
            <input name="title" required placeholder="Job title" className={inputClass} />
            <div className="grid grid-cols-2 gap-3">
              <input name="department" placeholder="Department" className={inputClass} />
              <input name="location" placeholder="Location" className={inputClass} />
            </div>
            <input name="type" defaultValue="Full-Time" placeholder="Type" className={inputClass} />
            <textarea name="description" placeholder="Description (optional)" rows={2} className={`${inputClass} resize-none`} />
            <textarea name="requirements" placeholder="Requirements (optional)" rows={2} className={`${inputClass} resize-none`} />
            <input name="externalApplyUrl" type="url" required placeholder="HR portal application link" className={inputClass} />
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input type="checkbox" name="published" defaultChecked className="rounded" /> Published
            </label>
            <button type="submit" className="w-full flex items-center justify-center gap-1.5 py-3 rounded-lg bg-[#0D1F3C] hover:bg-[#1E3A5F] text-white text-xs font-bold transition-colors cursor-pointer shadow-md">
              <Plus className="w-4 h-4" /> Add Job Listing
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-card overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Job Listings ({jobs?.length || 0})</span>
          </div>
          <div className="divide-y divide-slate-100">
            {!jobs || jobs.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">No job listings yet.</div>
            ) : (
              jobs.map((j: any) => <JobEditForm key={j.id} job={j} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { updateJob, deleteJob } from "@/app/actions/jobActions";
import { Trash, Pencil, X, Check, Briefcase, Link as LinkIcon } from "lucide-react";

interface JobRecord {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  externalApplyUrl: string;
  published: boolean;
}

export default function JobEditForm({ job }: { job: JobRecord }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputClass = "w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35";

  const handleSubmit = async (formData: FormData) => {
    setSaving(true);
    await updateJob(job.id, formData);
    setSaving(false);
    setEditing(false);
  };

  return (
    <div className="p-5 flex justify-between items-start gap-4 hover:bg-slate-50/20 transition-colors">
      <div className="space-y-1 flex-grow">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-slate-900 text-base flex items-center gap-1.5" style={{ fontFamily: "var(--font-display)" }}>
            <Briefcase className="w-4 h-4 text-slate-400" /> {job.title}
          </h4>
          {!job.published && <span className="px-1.5 py-0.5 bg-slate-200 text-slate-500 text-[9px] font-bold rounded uppercase">Draft</span>}
        </div>

        {editing ? (
          <form action={handleSubmit} className="mt-2 space-y-2">
            <input name="title" defaultValue={job.title} placeholder="Job title" required className={inputClass} />
            <div className="grid grid-cols-2 gap-2">
              <input name="department" defaultValue={job.department} placeholder="Department" className={inputClass} />
              <input name="location" defaultValue={job.location} placeholder="Location" className={inputClass} />
            </div>
            <input name="type" defaultValue={job.type} placeholder="Type (e.g. Full-Time)" className={inputClass} />
            <textarea name="description" defaultValue={job.description} placeholder="Description (optional)" rows={2} className={`${inputClass} resize-none`} />
            <textarea name="requirements" defaultValue={job.requirements} placeholder="Requirements (optional)" rows={2} className={`${inputClass} resize-none`} />
            <input name="externalApplyUrl" type="url" defaultValue={job.externalApplyUrl} placeholder="HR portal application link" required className={inputClass} />
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <input type="checkbox" name="published" defaultChecked={job.published} className="rounded" /> Published
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
            <p className="text-xs text-slate-500">{job.department} {job.department && job.location ? "·" : ""} {job.location} {job.type ? `· ${job.type}` : ""}</p>
            <a href={job.externalApplyUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#E8600A] flex items-center gap-1.5 hover:underline break-all">
              <LinkIcon className="w-3.5 h-3.5 shrink-0" /> {job.externalApplyUrl}
            </a>
          </>
        )}
      </div>

      <div className="flex gap-1 shrink-0">
        {!editing && (
          <button type="button" onClick={() => setEditing(true)} className="p-2 text-slate-400 hover:text-[#E8600A] hover:bg-orange-50 rounded-xl transition-all cursor-pointer" aria-label={`Edit ${job.title}`}>
            <Pencil className="w-4 h-4" />
          </button>
        )}
        <form action={async () => { await deleteJob(job.id); }}>
          <button type="submit" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer" aria-label={`Remove ${job.title}`}>
            <Trash className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

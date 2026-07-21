"use client";

import { useState } from "react";
import { updateBranch, deleteBranch } from "@/app/actions/adminActions";
import { MapPin, Phone, Mail, Trash, Pencil, X, Check, Building } from "lucide-react";

interface BranchEditFormProps {
  branch: {
    id: string;
    name: string;
    city: string;
    state: string;
    address: string;
    phone: string;
    email: string;
    iconType: string;
    landmark?: string;
    whatsapp?: string;
    hours?: string;
    mapQuery?: string;
  };
}

export default function BranchEditForm({ branch }: BranchEditFormProps) {
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(branch.phone);
  const [email, setEmail] = useState(branch.email);
  const [address, setAddress] = useState(branch.address);
  const [city, setCity] = useState(branch.city);
  const [state, setState] = useState(branch.state);
  const [landmark, setLandmark] = useState(branch.landmark || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateBranch(branch.id, { phone, email, address, city, state, landmark });
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = async () => {
    await deleteBranch(branch.id);
  };

  const handleCancel = () => {
    setPhone(branch.phone);
    setEmail(branch.email);
    setAddress(branch.address);
    setCity(branch.city);
    setState(branch.state);
    setLandmark(branch.landmark || "");
    setEditing(false);
  };

  const inputClass =
    "flex-grow px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35";

  return (
    <div className="p-5 flex justify-between items-start gap-4 hover:bg-slate-50/20 transition-colors">
      <div className="space-y-1 flex-grow">
        <h4 className="font-bold text-slate-900 text-base" style={{ fontFamily: "var(--font-display)" }}>
          {branch.iconType} {branch.name}
        </h4>

        {editing ? (
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" className={inputClass} />
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className={`${inputClass} max-w-[140px]`} />
              <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" className={`${inputClass} max-w-[140px]`} />
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input type="text" value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Landmark (optional)" className={inputClass} />
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className={inputClass} />
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={inputClass} />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#0D1F3C] text-white text-[10px] font-bold rounded-lg hover:bg-[#1E3A5F] transition-colors cursor-pointer disabled:opacity-50"
              >
                <Check className="w-3 h-3" />
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> {branch.address}{branch.city || branch.state ? `, ${branch.city}, ${branch.state}` : ""}
            </p>
            {branch.landmark && (
              <p className="text-xs text-slate-400 flex items-center gap-1.5 ml-5">
                {branch.landmark}
              </p>
            )}
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> {branch.phone || "—"}
            </p>
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> {branch.email}
            </p>
          </>
        )}
      </div>

      <div className="flex gap-1 shrink-0">
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="p-2 text-slate-400 hover:text-[#E8600A] hover:bg-orange-50 rounded-xl transition-all cursor-pointer"
            aria-label={`Edit ${branch.name}`}
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
        <form action={handleDelete}>
          <button
            type="submit"
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
            aria-label={`Remove ${branch.name}`}
          >
            <Trash className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

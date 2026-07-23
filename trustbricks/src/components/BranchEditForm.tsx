"use client";

import { useState } from "react";
import { updateBranch, deleteBranch } from "@/app/actions/adminActions";
import { MapPin, Phone, Mail, Trash, Pencil, X, Check, Building, MessageCircle, Tag, Clock, ShieldCheck, Locate } from "lucide-react";

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
    csuEmail?: string;
    csuPhone?: string;
    isHQ?: boolean;
    lat?: number | null;
    lng?: number | null;
  };
}

export default function BranchEditForm({ branch }: BranchEditFormProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(branch.name);
  const [iconType, setIconType] = useState(branch.iconType);
  const [phone, setPhone] = useState(branch.phone);
  const [whatsapp, setWhatsapp] = useState(branch.whatsapp || "");
  const [email, setEmail] = useState(branch.email);
  const [address, setAddress] = useState(branch.address);
  const [city, setCity] = useState(branch.city);
  const [state, setState] = useState(branch.state);
  const [landmark, setLandmark] = useState(branch.landmark || "");
  const [hours, setHours] = useState(branch.hours || "");
  const [csuEmail, setCsuEmail] = useState(branch.csuEmail || "");
  const [csuPhone, setCsuPhone] = useState(branch.csuPhone || "");
  const [isHQ, setIsHQ] = useState(branch.isHQ || false);
  const [lat, setLat] = useState(branch.lat != null ? String(branch.lat) : "");
  const [lng, setLng] = useState(branch.lng != null ? String(branch.lng) : "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateBranch(branch.id, {
      name, iconType, phone, whatsapp, email, address, city, state, landmark, hours, csuEmail, csuPhone, isHQ,
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
    });
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = async () => {
    await deleteBranch(branch.id);
  };

  const handleCancel = () => {
    setName(branch.name);
    setIconType(branch.iconType);
    setPhone(branch.phone);
    setWhatsapp(branch.whatsapp || "");
    setEmail(branch.email);
    setAddress(branch.address);
    setCity(branch.city);
    setState(branch.state);
    setLandmark(branch.landmark || "");
    setHours(branch.hours || "");
    setCsuEmail(branch.csuEmail || "");
    setCsuPhone(branch.csuPhone || "");
    setIsHQ(branch.isHQ || false);
    setEditing(false);
  };

  const inputClass =
    "flex-grow px-2 py-1.5 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35";

  return (
    <div className="p-5 flex justify-between items-start gap-4 hover:bg-slate-50/20 transition-colors">
      <div className="space-y-1 flex-grow">
        <h4 className="font-bold text-slate-900 text-base flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
          {branch.iconType} {branch.name}
          {branch.isHQ && (
            <span className="px-1.5 py-0.5 bg-[#E8600A]/10 text-[#E8600A] text-[9px] font-bold rounded uppercase">HQ</span>
          )}
        </h4>

        {editing ? (
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input type="text" value={iconType} onChange={(e) => setIconType(e.target.value)} placeholder="Icon (emoji)" className={`${inputClass} max-w-[70px]`} />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Branch Name" className={inputClass} />
            </div>
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
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (CSU line)" className={inputClass} />
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="WhatsApp (e.g. +2348020772033)" className={inputClass} />
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={inputClass} />
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input type="text" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="Hours (e.g. Mon – Fri: 8am – 5pm)" className={inputClass} />
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input type="text" value={csuEmail} onChange={(e) => setCsuEmail(e.target.value)} placeholder="CSU Email (for lead routing)" className={inputClass} />
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input type="text" value={csuPhone} onChange={(e) => setCsuPhone(e.target.value)} placeholder="CSU Phone" className={inputClass} />
            </div>
            <div className="flex items-center gap-2">
              <Locate className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input type="text" inputMode="decimal" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Latitude (e.g. 9.0765)" className={`${inputClass} max-w-[160px]`} />
              <input type="text" inputMode="decimal" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="Longitude (e.g. 7.3986)" className={`${inputClass} max-w-[160px]`} />
            </div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 pl-1">
              <input type="checkbox" checked={isHQ} onChange={(e) => setIsHQ(e.target.checked)} className="rounded" />
              HQ branch (receives cc on every lead)
            </label>
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
              <MessageCircle className="w-3.5 h-3.5 text-slate-400" /> {branch.whatsapp || "—"}
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

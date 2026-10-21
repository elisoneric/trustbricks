"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Building, CheckCircle2, ChevronRight, Headphones, Clock } from "lucide-react";
import { submitContactForm } from "@/app/actions/contactActions";

interface BranchRecord {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  email: string;
}

const DEFAULT_BRANCH_MAP: Record<string, { address: string; phone: string }> = {
  abuja:   { address: "Area 3, block 5, House 4 Cross River Street Garki, Abuja", phone: "+2347078387777" },
  lagos:   { address: "TOWRY CLOSE, IDEJO STREET ,OFF ADEOLA ODEKU VICTORIA ISLAND,LAGOS", phone: "+2349065652920" },
  kano:    { address: "10/24 Ruqayya Plaza, Civic Centre, Opposite MTN.", phone: "+2348085537624" },
  ibadan:  { address: "No 19 Oshin street, Bodija Estate, Ibadan.", phone: "+2347031631941" },
  minna:   { address: "Jaiye Plaza shiroro road opposite unity block Minna.", phone: "+2348020772033" },
  yola:    { address: "Abdullahi Bashir Road Dougerei", phone: "+2349136881719" },
  adamawa: { address: "Abdullahi Bashir Road Dougerei", phone: "+2349136881719" },
  kaduna:  { address: "FIRST FLOOR, SUIT 212, 11 COURSE ROAD OPP 54 COMPLEX AMSSCO PLAZA BY MURTALA SQUARE KADUNA", phone: "+2348141735416" },
  bauchi:  { address: "F1 Jos Road, Adjacent AHMIS Filling Station Bauchi.", phone: "+2349032899612" },
  benue:   { address: "No 7 Ashby Investment House, New Bridge Road, Makurdi", phone: "+2347037382530" },
};

export default function ContactPageClient({ branches }: { branches: BranchRecord[] }) {
  const firstBranchId = branches[0]?.id || "";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    office: firstBranchId,
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const office = branches.find((b) => b.id === formData.office);
      await submitContactForm({
        name: formData.name,
        email: formData.email,
        office: office?.name || formData.office,
        officeBranchId: office?.id,
        message: formData.message,
      });
      setSubmitted(true);
    });
  };

  const rawOffice = branches.find((b) => b.id === formData.office) || branches[0];
  const branchKey = rawOffice?.name?.toLowerCase() || "";
  const fallback = DEFAULT_BRANCH_MAP[branchKey];

  const selectedOffice = rawOffice ? {
    ...rawOffice,
    address: (rawOffice.address && !rawOffice.address.includes("Cadastral") && !rawOffice.address.includes("Broad Street")) ? rawOffice.address : (fallback?.address || rawOffice.address || ""),
    phone: (rawOffice.phone && !rawOffice.phone.includes("803 000 0001")) ? rawOffice.phone : (fallback?.phone || rawOffice.phone || ""),
  } : null;

  return (
    <section className="max-w-6xl mx-auto px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-clay-500)]/10 border border-[var(--color-clay-500)]/20 text-[var(--color-clay-500)] text-xs font-bold uppercase tracking-wider mb-6">
          Contact Center
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-[var(--color-text-heading)] mb-6" style={{ fontFamily: "var(--font-display)" }}>
          Get in Touch with <br />
          <span className="text-[var(--color-clay-500)]">Our Offices.</span>
        </h1>
        <p className="text-sm text-[var(--color-text-body)] leading-relaxed">
          Connect with our regional advisors for instant support on properties, PFA approvals, or interest rates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[5fr_6fr] gap-12 items-start">

        {/* Form Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="bg-[var(--color-card)] rounded-3xl p-8 border border-[var(--color-border)] shadow-card"
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-xl font-bold text-[var(--color-text-heading)] mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Send a Message
              </h3>

              <div className="space-y-1">
                <label htmlFor="name" className="text-xs font-bold text-[var(--color-text-heading)] uppercase tracking-wide">Full Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="e.g. Chinwe Obi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-clay-500)]/35"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-bold text-[var(--color-text-heading)] uppercase tracking-wide">Email Address</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="chinwe@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-clay-500)]/35"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="office" className="text-xs font-bold text-[var(--color-text-heading)] uppercase tracking-wide">Target Office</label>
                <select
                  id="office"
                  value={formData.office}
                  onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                  className="w-full px-3 py-3 rounded-xl border border-[var(--color-border)] text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-clay-500)]/35 bg-[var(--color-card)]"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="text-xs font-bold text-[var(--color-text-heading)] uppercase tracking-wide">Message / Query</label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  placeholder="How can we assist you with your RSA mortgage?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-clay-500)]/35 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[var(--color-clay-500)] text-white font-bold text-sm hover:bg-[var(--color-clay-600)] shadow-lg shadow-[var(--color-clay-500)]/20 transition-all duration-300 cursor-pointer disabled:opacity-60"
              >
                <span>{isPending ? "Sending..." : "Send Message"}</span>
                {!isPending && <ChevronRight className="w-4 h-4" />}
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--color-moss)]/10 text-[var(--color-moss)] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-[var(--color-text-heading)]" style={{ fontFamily: "var(--font-display)" }}>
                Message Sent!
              </h3>
              <p className="text-sm text-[var(--color-text-body)] max-w-sm mx-auto leading-relaxed">
                Thank you, <strong className="text-[var(--color-text-heading)]">{formData.name}</strong>. Your query has been forwarded to the <strong className="text-[var(--color-text-heading)]">{selectedOffice?.name}</strong> office. We will reply to your email at <strong className="text-[var(--color-text-heading)]">{formData.email}</strong> shortly.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Right Column: Direct CUG Lines & Office Directory */}
        <div className="space-y-6">

          {/* Direct Headquarters CUG Lines Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="bg-[var(--color-card)] rounded-3xl p-6 sm:p-7 border border-[var(--color-border)] shadow-card space-y-5"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-full bg-[var(--color-clay-500)]/10 text-[var(--color-clay-500)] text-[10px] font-extrabold uppercase tracking-widest mb-1">
                  Official CUG Lines
                </span>
                <h3 className="text-lg font-bold text-[var(--color-text-heading)]" style={{ fontFamily: "var(--font-display)" }}>
                  Head Office Direct Support
                </h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[var(--color-clay-500)]/10 text-[var(--color-clay-500)] flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
            </div>

            <p className="text-xs text-[var(--color-text-body)] leading-relaxed">
              Connect directly with our corporate department heads for urgent inquiries, mortgage verification escalations, and official assistance.
            </p>

            <div className="space-y-3">
              {/* Head Customer Service */}
              <div className="p-4 rounded-2xl bg-[var(--color-body-bg)] border border-[var(--color-border)] space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-clay-500)]">
                      Customer Service Desk
                    </span>
                    <h4 className="text-sm font-bold text-[var(--color-text-heading)]" style={{ fontFamily: "var(--font-display)" }}>
                      Head Customer Service CUG line
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    Live
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <a
                    href="tel:+2347034931151"
                    className="text-base sm:text-lg font-bold text-[var(--color-text-heading)] hover:text-[var(--color-clay-500)] transition-colors font-tabular"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    0703 493 1151
                  </a>
                  <div className="flex items-center gap-2">
                    <a
                      href="tel:+2347034931151"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-ink-700)] text-white text-xs font-bold hover:bg-[var(--color-ink-800)] transition-colors"
                      title="Call Head Customer Service"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                    <a
                      href={`https://wa.me/2347034931151?text=${encodeURIComponent("Hello Head of Customer Service, I am contacting you from the TrustBricks website regarding my mortgage inquiry.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba59] transition-colors"
                      title="WhatsApp Head Customer Service"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Head Operations */}
              <div className="p-4 rounded-2xl bg-[var(--color-body-bg)] border border-[var(--color-border)] space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-clay-500)]">
                      Operations &amp; Processing Desk
                    </span>
                    <h4 className="text-sm font-bold text-[var(--color-text-heading)]" style={{ fontFamily: "var(--font-display)" }}>
                      Head Operations CUG line
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    Live
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <a
                    href="tel:+2347044134107"
                    className="text-base sm:text-lg font-bold text-[var(--color-text-heading)] hover:text-[var(--color-clay-500)] transition-colors font-tabular"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    0704 413 4107
                  </a>
                  <div className="flex items-center gap-2">
                    <a
                      href="tel:+2347044134107"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-ink-700)] text-white text-xs font-bold hover:bg-[var(--color-ink-800)] transition-colors"
                      title="Call Head Operations"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                    <a
                      href={`https://wa.me/2347044134107?text=${encodeURIComponent("Hello Head of Operations, I am contacting you from the TrustBricks website regarding mortgage operations and processing.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba59] transition-colors"
                      title="WhatsApp Head Operations"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border)]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--color-clay-500)]" /> Mon – Fri: 8:00 AM – 5:00 PM (WAT)
              </span>
              <span>Abuja HQ</span>
            </div>
          </motion.div>

          {/* Regional Office Directory */}
          <div className="bg-[var(--color-card)] rounded-2xl p-6 border border-[var(--color-border)] shadow-card">
            <h3 className="text-lg font-bold text-[var(--color-text-heading)] mb-4" style={{ fontFamily: "var(--font-display)" }}>
              Regional Office Directory
            </h3>
            <div className="space-y-1 mb-5">
              <label htmlFor="office-selector" className="text-xs font-bold text-[var(--color-text-heading)] uppercase tracking-wide">
                Select a Branch
              </label>
              <select
                id="office-selector"
                value={formData.office}
                onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                className="w-full px-3 py-3 rounded-xl border border-[var(--color-border)] text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-clay-500)]/35 bg-[var(--color-card)]"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            {selectedOffice && (
              <div className="rounded-xl border border-[var(--color-border)] p-5 space-y-3 bg-[var(--color-body-bg)]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-clay-500)]/10 text-[var(--color-clay-500)] flex items-center justify-center shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-[var(--color-text-heading)] text-base" style={{ fontFamily: "var(--font-display)" }}>
                    {selectedOffice.name}
                  </h4>
                </div>
                <p className="text-xs text-[var(--color-text-body)] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" />
                  {selectedOffice.address
                    ? [
                        selectedOffice.address,
                        selectedOffice.city && !selectedOffice.address.includes(selectedOffice.city) ? selectedOffice.city : null,
                        selectedOffice.state && !selectedOffice.address.includes(selectedOffice.state) ? selectedOffice.state : null,
                      ].filter(Boolean).join(", ")
                    : "Office location details coming soon"}
                </p>
                <p className="text-xs text-[var(--color-text-body)] flex items-center gap-1.5 font-tabular">
                  <Phone className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" /> {selectedOffice.phone || "Official line pending"}
                </p>
                <p className="text-xs text-[var(--color-text-body)] flex items-center gap-1.5 break-all">
                  <Mail className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" /> {selectedOffice.email}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}

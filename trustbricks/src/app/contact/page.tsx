"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GlobalNavbar from "@/components/GlobalNavbar";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Building, CheckCircle2, ChevronRight } from "lucide-react";

const OFFICES = [
  {
    slug: "abuja",
    name: "Abuja Office (HQ)",
    address: "Plot 234, Wuse Zone 5, FCT",
    phone: "+234 803 000 0001",
    email: "abuja@trustbrickproperties.ng",
  },
  {
    slug: "lagos",
    name: "Lagos Hub",
    address: "14 Broad Street, Lagos Island, Lagos",
    phone: "+234 805 000 0002",
    email: "lagos@trustbrickproperties.ng",
  },
  {
    slug: "kano",
    name: "Kano Center",
    address: "Plot 45, Murtala Muhammad Way, Kano",
    phone: "+234 811 000 0005",
    email: "kano@trustbrickproperties.ng",
  },
  {
    slug: "kwara",
    name: "Kwara Center",
    address: "18 Ibrahim Taiwo Road, Ilorin, Kwara",
    phone: "+234 811 000 0006",
    email: "kwara@trustbrickproperties.ng",
  },
  {
    slug: "yola",
    name: "Yola Hub (Adamawa)",
    address: "12 Atiku Road, Jimeta, Yola, Adamawa",
    phone: "+234 807 000 0003",
    email: "adamawa@trustbrickproperties.ng",
  },
  {
    slug: "benue",
    name: "Benue Center",
    address: "24 J.S. Tarka Road, Makurdi, Benue",
    phone: "+234 811 000 0007",
    email: "benue@trustbrickproperties.ng",
  },
  {
    slug: "ogun",
    name: "Ogun Center",
    address: "10 Lalubu Street, Oke-Ilewo, Abeokuta, Ogun",
    phone: "+234 811 000 0008",
    email: "ogun@trustbrickproperties.ng",
  },
  {
    slug: "lokoja",
    name: "Lokoja Center",
    address: "5 Murtala Way, Lokoja, Kogi",
    phone: "+234 811 000 0009",
    email: "lokoja@trustbrickproperties.ng",
  },
  {
    slug: "calabar",
    name: "Calabar Center",
    address: "12 Marian Road, Calabar, Cross River",
    phone: "+234 811 000 0010",
    email: "calabar@trustbrickproperties.ng",
  },
  {
    slug: "minna",
    name: "Minna Center",
    address: "6 Bosso Road, Minna, Niger",
    phone: "+234 811 000 0011",
    email: "minna@trustbrickproperties.ng",
  },
  {
    slug: "ibadan",
    name: "Ibadan Center",
    address: "30 Ring Road, Challenge, Ibadan, Oyo",
    phone: "+234 811 000 0012",
    email: "ibadan@trustbrickproperties.ng",
  },
  {
    slug: "ekiti",
    name: "Ekiti Center",
    address: "15 Ado-Iworoko Road, Ado-Ekiti, Ekiti",
    phone: "+234 811 000 0013",
    email: "ekiti@trustbrickproperties.ng",
  },
  {
    slug: "bauchi",
    name: "Bauchi Center",
    address: "8 Yakubu Bauchi Road, Bauchi",
    phone: "+234 811 000 0014",
    email: "bauchi@trustbrickproperties.ng",
  },
  {
    slug: "kaduna",
    name: "Kaduna Hub",
    address: "8 Ali Akilu Road, Kaduna North, Kaduna",
    phone: "+234 809 000 0004",
    email: "kaduna@trustbrickproperties.ng",
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    office: "abuja",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[var(--color-body-bg)] flex flex-col font-sans antialiased">
      <GlobalNavbar />

      <main className="flex-grow pt-32 pb-24">
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
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-clay-500)]/35"
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
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-clay-500)]/35"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="office" className="text-xs font-bold text-[var(--color-text-heading)] uppercase tracking-wide">Target Office</label>
                    <select
                      id="office"
                      value={formData.office}
                      onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                      className="w-full px-3 py-3 rounded-xl border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-clay-500)]/35 bg-[var(--color-card)]"
                    >
                      <option value="abuja">Abuja Office (HQ)</option>
                      <option value="lagos">Lagos Hub</option>
                      <option value="kano">Kano Center</option>
                      <option value="kwara">Kwara Center</option>
                      <option value="yola">Yola Hub (Adamawa)</option>
                      <option value="benue">Benue Center</option>
                      <option value="ogun">Ogun Center</option>
                      <option value="lokoja">Lokoja Center</option>
                      <option value="calabar">Calabar Center</option>
                      <option value="minna">Minna Center</option>
                      <option value="ibadan">Ibadan Center</option>
                      <option value="ekiti">Ekiti Center</option>
                      <option value="bauchi">Bauchi Center</option>
                      <option value="kaduna">Kaduna Hub</option>
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
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-clay-500)]/35 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[var(--color-clay-500)] text-white font-bold text-sm hover:bg-[var(--color-clay-600)] shadow-lg shadow-[var(--color-clay-500)]/20 transition-all duration-300 cursor-pointer"
                  >
                    <span>Send Message</span>
                    <ChevronRight className="w-4 h-4" />
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
                    Thank you, <strong className="text-[var(--color-text-heading)]">{formData.name}</strong>. Your query has been forwarded to the <strong className="text-[var(--color-text-heading)]">{formData.office}</strong> office. We will reply to your email at <strong className="text-[var(--color-text-heading)]">{formData.email}</strong> shortly.
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Offices Cards Column */}
            <div className="space-y-4">
              {OFFICES.map((office) => {
                const isActive = formData.office === office.slug;
                return (
                  <motion.div
                    key={office.slug}
                    animate={{
                      borderColor: isActive ? "var(--color-clay-500)" : "rgba(198, 184, 158, 0.6)",
                      scale: isActive ? 1.02 : 1
                    }}
                    transition={{ type: "spring", stiffness: 150, damping: 15 }}
                    className={`bg-[var(--color-card)] rounded-3xl p-6 border-2 shadow-card flex items-start gap-4 transition-all duration-300`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-[var(--color-clay-500)]/10 text-[var(--color-clay-500)]' : 'bg-[var(--color-ink-700)]/5 text-[var(--color-ink-700)]'
                    }`}>
                      <Building className="w-5 h-5" />
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-[var(--color-text-heading)] text-lg" style={{ fontFamily: "var(--font-display)" }}>
                        {office.name}
                      </h4>
                      <p className="text-xs text-[var(--color-text-body)] leading-relaxed flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" /> {office.address}
                      </p>
                      <p className="text-xs text-[var(--color-text-body)] flex items-center gap-1.5 font-tabular">
                        <Phone className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" /> {office.phone}
                      </p>
                      <p className="text-xs text-[var(--color-text-body)] flex items-center gap-1.5 break-all">
                        <Mail className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" /> {office.email}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

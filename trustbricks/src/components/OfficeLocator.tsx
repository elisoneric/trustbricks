"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Landmark, Waves, Mountain, Wheat, MapPin, Phone, Zap } from "lucide-react";
import type { BranchSlug } from "./EligibilityFunnel";

/* ── OFFICE DATA ─────────────────────────────────────────────────────────── */
interface Office {
  slug: BranchSlug;
  city: string;
  state: string;
  icon: React.ReactNode;
  address: string;
  landmark: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: string;
  mapQuery: string;
}

const OFFICES: Office[] = [
  {
    slug:      "abuja",
    city:      "Abuja",
    state:     "FCT",
    icon:      <Landmark className="w-6 h-6" />,
    address:   "Plot 234, Cadastral Zone B12, Wuse Zone 5",
    landmark:  "Near FCDA Secretariat",
    phone:     "+234 803 000 0001",
    whatsapp:  "+2348030000001",
    email:     "abuja@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Wuse+Zone+5+Abuja+Nigeria",
  },
  {
    slug:      "lagos",
    city:      "Lagos",
    state:     "Lagos",
    icon:      <Waves className="w-6 h-6" />,
    address:   "14 Broad Street, Lagos Island",
    landmark:  "Opposite First Bank HQ",
    phone:     "+234 805 000 0002",
    whatsapp:  "+2348050000002",
    email:     "lagos@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Broad+Street+Lagos+Island+Nigeria",
  },
  {
    slug:      "kano",
    city:      "Kano",
    state:     "Kano",
    icon:      <Landmark className="w-6 h-6" />,
    address:   "Plot 45, Murtala Muhammad Way, Kano",
    landmark:  "Near Kano Central Mosque",
    phone:     "+234 811 000 0005",
    whatsapp:  "+2348110000005",
    email:     "kano@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Murtala+Muhammad+Way+Kano+Nigeria",
  },
  {
    slug:      "kwara",
    city:      "Ilorin",
    state:     "Kwara",
    icon:      <Wheat className="w-6 h-6" />,
    address:   "18 Ibrahim Taiwo Road, Ilorin",
    landmark:  "Near Kwara State Stadium",
    phone:     "+234 811 000 0006",
    whatsapp:  "+2348110000006",
    email:     "kwara@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Ibrahim+Taiwo+Road+Ilorin+Nigeria",
  },
  {
    slug:      "yola",
    city:      "Yola",
    state:     "Adamawa",
    icon:      <Mountain className="w-6 h-6" />,
    address:   "12 Atiku Road, Jimeta, Yola",
    landmark:  "Near Adamawa State Government House",
    phone:     "+234 807 000 0003",
    whatsapp:  "+2348070000003",
    email:     "adamawa@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Jimeta+Yola+Adamawa+Nigeria",
  },
  {
    slug:      "benue",
    city:      "Makurdi",
    state:     "Benue",
    icon:      <Wheat className="w-6 h-6" />,
    address:   "24 J.S. Tarka Road, Makurdi",
    landmark:  "Near Benue State University",
    phone:     "+234 811 000 0007",
    whatsapp:  "+2348110000007",
    email:     "benue@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "JS+Tarka+Road+Makurdi+Nigeria",
  },
  {
    slug:      "ogun",
    city:      "Abeokuta",
    state:     "Ogun",
    icon:      <Mountain className="w-6 h-6" />,
    address:   "10 Lalubu Street, Oke-Ilewo, Abeokuta",
    landmark:  "Near Abeokuta Sports Club",
    phone:     "+234 811 000 0008",
    whatsapp:  "+2348110000008",
    email:     "ogun@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Lalubu+Street+Oke+Ilewo+Abeokuta+Nigeria",
  },
  {
    slug:      "lokoja",
    city:      "Lokoja",
    state:     "Kogi",
    icon:      <Waves className="w-6 h-6" />,
    address:   "5 Murtala Way, Lokoja",
    landmark:  "Near Kogi State Specialist Hospital",
    phone:     "+234 811 000 0009",
    whatsapp:  "+2348110000009",
    email:     "lokoja@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Murtala+Way+Lokoja+Nigeria",
  },
  {
    slug:      "calabar",
    city:      "Calabar",
    state:     "Cross River",
    icon:      <Waves className="w-6 h-6" />,
    address:   "12 Marian Road, Calabar",
    landmark:  "Near Calabar Mall",
    phone:     "+234 811 000 0010",
    whatsapp:  "+2348110000010",
    email:     "calabar@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Marian+Road+Calabar+Nigeria",
  },
  {
    slug:      "minna",
    city:      "Minna",
    state:     "Niger",
    icon:      <Landmark className="w-6 h-6" />,
    address:   "6 Bosso Road, Minna",
    landmark:  "Near Federal University of Technology Minna",
    phone:     "+234 811 000 0011",
    whatsapp:  "+2348110000011",
    email:     "minna@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Bosso+Road+Minna+Nigeria",
  },
  {
    slug:      "ibadan",
    city:      "Ibadan",
    state:     "Oyo",
    icon:      <Landmark className="w-6 h-6" />,
    address:   "30 Ring Road, Challenge, Ibadan",
    landmark:  "Near Challenge Bus Stop",
    phone:     "+234 811 000 0012",
    whatsapp:  "+2348110000012",
    email:     "ibadan@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Ring+Road+Challenge+Ibadan+Nigeria",
  },
  {
    slug:      "ekiti",
    city:      "Ado-Ekiti",
    state:     "Ekiti",
    icon:      <Mountain className="w-6 h-6" />,
    address:   "15 Ado-Iworoko Road, Ado-Ekiti",
    landmark:  "Near Ekiti State University",
    phone:     "+234 811 000 0013",
    whatsapp:  "+2348110000013",
    email:     "ekiti@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Ado+Iworoko+Road+Ado+Ekiti+Nigeria",
  },
  {
    slug:      "bauchi",
    city:      "Bauchi",
    state:     "Bauchi",
    icon:      <Mountain className="w-6 h-6" />,
    address:   "8 Yakubu Bauchi Road, Bauchi",
    landmark:  "Near Bauchi State Government House",
    phone:     "+234 811 000 0014",
    whatsapp:  "+2348110000014",
    email:     "bauchi@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Yakubu+Bauchi+Road+Bauchi+Nigeria",
  },
  {
    slug:      "kaduna",
    city:      "Kaduna",
    state:     "Kaduna",
    icon:      <Wheat className="w-6 h-6" />,
    address:   "8 Ali Akilu Road, Kaduna North",
    landmark:  "Near Barau Dikko Teaching Hospital",
    phone:     "+234 809 000 0004",
    whatsapp:  "+2348090000004",
    email:     "kaduna@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Ali+Akilu+Road+Kaduna+Nigeria",
  },
];

/* ── FRAMER VARIANTS ─────────────────────────────────────────────────────── */
const detailVariants: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 280, damping: 28 },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.14, ease: [0.4, 0, 1, 1] },
  },
};

/* ── COMPONENT ───────────────────────────────────────────────────────────── */
interface OfficeLocatorProps {
  selectedBranch: string;
  onBranchChange: (slug: string) => void;
  branches?: any[];
}

export default function OfficeLocator({ selectedBranch, onBranchChange, branches = [] }: OfficeLocatorProps) {
  const activeOffices = branches.length > 0 ? branches : OFFICES;
  const currentOffice = activeOffices.find((o) => (o.id || o.slug) === selectedBranch) || activeOffices[0];

  return (
    <section
      id="offices"
      aria-labelledby="offices-heading"
      className="py-24 lg:py-32"
      style={{ backgroundColor: "var(--color-card)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
        >
          <p
            className="text-[0.6875rem] font-semibold tracking-[0.14em] uppercase mb-3"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-clay-500)" }}
          >
            {activeOffices.length} State Offices
          </p>
          <h2
            id="offices-heading"
            className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-black tracking-tight mb-4"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text-heading)",
              letterSpacing: "-0.02em",
            }}
          >
            We're in Your City
          </h2>
          <p
            className="max-w-md mx-auto text-base leading-relaxed"
            style={{ fontFamily: "var(--font-body)", color: "var(--color-text-body)" }}
          >
            Walk in or reach out — a licensed advisor is ready to guide you through your
            PenCom mortgage from start to finish.
          </p>
        </motion.div>

        {/* Branch dropdown selector */}
        <motion.div
          className="max-w-md mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
        >
          <label
            htmlFor="office-branch-select"
            className="block text-xs font-bold tracking-wide uppercase mb-2 text-center"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-clay-500)" }}
          >
            Choose your city
          </label>
          <select
            id="office-branch-select"
            value={selectedBranch}
            onChange={(e) => onBranchChange(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl border-2 text-base font-semibold appearance-none cursor-pointer transition-colors duration-[180ms] focus:outline-none focus:ring-2 focus:ring-[var(--color-clay-500)]/20"
            style={{
              fontFamily: "var(--font-display)",
              borderColor: "var(--color-clay-500)",
              backgroundColor: "var(--color-card)",
              color: "var(--color-text-heading)",
            }}
          >
            {activeOffices.map((office) => {
              const slug = office.id || office.slug;
              return (
                <option key={slug} value={slug}>
                  {office.city}, {office.state}
                </option>
              );
            })}
          </select>
        </motion.div>

        {/* Detail panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedBranch}
            id={`office-detail-${selectedBranch}`}
            role="tabpanel"
            aria-labelledby={`office-tab-${selectedBranch}`}
            variants={detailVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="rounded-2xl border overflow-hidden"
            style={{
              borderColor: "var(--color-border)",
              boxShadow: "var(--shadow-card-hover)",
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
              {/* Address */}
              <DetailBlock label="Office Address" icon={<MapPin className="w-3.5 h-3.5" />}>
                <p
                  className="text-sm font-semibold mb-0.5"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-text-heading)" }}
                >
                  {currentOffice.address}
                </p>
                <p
                  className="text-xs"
                  style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}
                >
                  {currentOffice.landmark}
                </p>
              </DetailBlock>

              <Divider />

              {/* Contact */}
              <DetailBlock label="Contact" icon={<Phone className="w-3.5 h-3.5" />}>
                <a
                  href={`tel:${currentOffice.phone.replace(/\s/g, "")}`}
                  className="block text-sm font-semibold mb-1 hover:underline font-tabular"
                  style={{ fontFamily: "var(--font-display)", color: "var(--color-ink-700)" }}
                >
                  {currentOffice.phone}
                </a>
                <a
                  href={`mailto:${currentOffice.email}`}
                  className="block text-xs hover:underline"
                  style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}
                >
                  {currentOffice.email}
                </a>
              </DetailBlock>

              <Divider />

              {/* Actions */}
              <DetailBlock label="Quick Actions" icon={<Zap className="w-3.5 h-3.5" />}>
                <div className="flex flex-col gap-2">
                  <motion.a
                    href={`https://wa.me/${currentOffice.whatsapp}?text=${encodeURIComponent(
                      `Hello, I'd like to speak with a Trust Bricks Properties advisor at your ${currentOffice.city} office.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 380, damping: 22 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white"
                    style={{
                      fontFamily: "var(--font-display)",
                      backgroundColor: "#25D366",
                    }}
                    aria-label={`WhatsApp the ${currentOffice.city} office`}
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    WhatsApp {currentOffice.city}
                  </motion.a>
                  <a
                    href={`https://maps.google.com/?q=${currentOffice.mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors duration-[180ms] hover:border-[var(--color-ink-700)] hover:text-[var(--color-ink-700)]"
                    style={{
                      fontFamily: "var(--font-display)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text-body)",
                    }}
                    aria-label={`Open ${currentOffice.city} office in Google Maps`}
                  >
                    <MapPin className="w-4 h-4" />
                    Get Directions
                  </a>
                </div>
                <p
                  className="text-[10px] mt-3"
                  style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}
                >
                  {currentOffice.hours}
                </p>
              </DetailBlock>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ── PRIMITIVES ──────────────────────────────────────────────────────────── */
function DetailBlock({
  label, icon, children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center gap-2 mb-3">
        <span aria-hidden="true" style={{ color: "var(--color-clay-500)" }}>{icon}</span>
        <p
          className="text-[0.6875rem] font-semibold tracking-[0.1em] uppercase"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-clay-500)" }}
        >
          {label}
        </p>
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div
      aria-hidden="true"
      className="hidden lg:block w-px my-6"
      style={{ backgroundColor: "var(--color-border)" }}
    />
  );
}

/* ── ICONS ──────────────────────────────────────────────────────────────── */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

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
    address:   "Area 3, block 5, House 4 Cross River Street Garki, Abuja",
    landmark:  "Cross River Street Garki",
    phone:     "+2347078387777",
    whatsapp:  "+2347078387777",
    email:     "abuja@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Cross+River+Street+Garki+Abuja+Nigeria",
  },
  {
    slug:      "lagos",
    city:      "Lagos",
    state:     "Lagos",
    icon:      <Waves className="w-6 h-6" />,
    address:   "TOWRY CLOSE, IDEJO STREET ,OFF ADEOLA ODEKU VICTORIA ISLAND,LAGOS",
    landmark:  "OFF ADEOLA ODEKU VICTORIA ISLAND",
    phone:     "+2349065652920",
    whatsapp:  "+2349065652920",
    email:     "lagos@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Adeola+Odeku+Victoria+Island+Lagos+Nigeria",
  },
  {
    slug:      "kano",
    city:      "Kano",
    state:     "Kano",
    icon:      <Landmark className="w-6 h-6" />,
    address:   "10/24 Ruqayya Plaza, Civic Centre, Opposite MTN.",
    landmark:  "Opposite MTN, Civic Centre",
    phone:     "+2348085537624",
    whatsapp:  "+2348085537624",
    email:     "kano@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Civic+Centre+Kano+Nigeria",
  },
  {
    slug:      "ibadan",
    city:      "Ibadan",
    state:     "Oyo",
    icon:      <Landmark className="w-6 h-6" />,
    address:   "No 19 Oshin street, Bodija Estate, Ibadan.",
    landmark:  "Bodija Estate",
    phone:     "+2347031631941",
    whatsapp:  "+2347031631941",
    email:     "ibadan@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Bodija+Estate+Ibadan+Nigeria",
  },
  {
    slug:      "minna",
    city:      "Minna",
    state:     "Niger",
    icon:      <Landmark className="w-6 h-6" />,
    address:   "Jaiye Plaza shiroro road opposite unity block Minna.",
    landmark:  "Opposite Unity Block",
    phone:     "+2348020772033",
    whatsapp:  "+2348020772033",
    email:     "minna@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Shiroro+Road+Minna+Nigeria",
  },
  {
    slug:      "yola",
    city:      "Yola",
    state:     "Adamawa",
    icon:      <Mountain className="w-6 h-6" />,
    address:   "Abdullahi Bashir Road Dougerei",
    landmark:  "Dougerei",
    phone:     "+2349136881719",
    whatsapp:  "+2349136881719",
    email:     "adamawa@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Dougerei+Yola+Adamawa+Nigeria",
  },
  {
    slug:      "kaduna",
    city:      "Kaduna",
    state:     "Kaduna",
    icon:      <Wheat className="w-6 h-6" />,
    address:   "FIRST FLOOR, SUIT 212, 11 COURSE ROAD OPP 54 COMPLEX AMSSCO PLAZA BY MURTALA SQUARE KADUNA",
    landmark:  "OPP 54 COMPLEX AMSSCO PLAZA BY MURTALA SQUARE",
    phone:     "+2348141735416",
    whatsapp:  "+2348141735416",
    email:     "kaduna@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Murtala+Square+Kaduna+Nigeria",
  },
  {
    slug:      "bauchi",
    city:      "Bauchi",
    state:     "Bauchi",
    icon:      <Mountain className="w-6 h-6" />,
    address:   "F1 Jos Road, Adjacent AHMIS Filling Station Bauchi.",
    landmark:  "Adjacent AHMIS Filling Station",
    phone:     "+2349032899612",
    whatsapp:  "+2349032899612",
    email:     "bauchi@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Jos+Road+Bauchi+Nigeria",
  },
  {
    slug:      "kwara",
    city:      "Ilorin",
    state:     "Kwara",
    icon:      <Wheat className="w-6 h-6" />,
    address:   "",
    landmark:  "",
    phone:     "",
    whatsapp:  "",
    email:     "kwara@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Ilorin+Kwara+Nigeria",
  },
  {
    slug:      "benue",
    city:      "Makurdi",
    state:     "Benue",
    icon:      <Wheat className="w-6 h-6" />,
    address:   "No 7 Ashby Investment House, New Bridge Road, Makurdi",
    landmark:  "Contact: Mr James Gyuren",
    phone:     "+2347037382530",
    whatsapp:  "+2347037382530",
    email:     "benue@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Makurdi+Benue+Nigeria",
  },
  {
    slug:      "ogun",
    city:      "Abeokuta",
    state:     "Ogun",
    icon:      <Mountain className="w-6 h-6" />,
    address:   "",
    landmark:  "",
    phone:     "",
    whatsapp:  "",
    email:     "ogun@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Abeokuta+Ogun+Nigeria",
  },
  {
    slug:      "lokoja",
    city:      "Lokoja",
    state:     "Kogi",
    icon:      <Waves className="w-6 h-6" />,
    address:   "",
    landmark:  "",
    phone:     "",
    whatsapp:  "",
    email:     "lokoja@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Lokoja+Kogi+Nigeria",
  },
  {
    slug:      "calabar",
    city:      "Calabar",
    state:     "Cross River",
    icon:      <Waves className="w-6 h-6" />,
    address:   "",
    landmark:  "",
    phone:     "",
    whatsapp:  "",
    email:     "calabar@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Calabar+Cross+River+Nigeria",
  },
  {
    slug:      "ekiti",
    city:      "Ado-Ekiti",
    state:     "Ekiti",
    icon:      <Mountain className="w-6 h-6" />,
    address:   "",
    landmark:  "",
    phone:     "",
    whatsapp:  "",
    email:     "ekiti@trustbrickproperties.ng",
    hours:     "Mon – Fri: 8am – 5pm",
    mapQuery:  "Ado+Ekiti+Nigeria",
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
  const activeOffices = OFFICES;
  const currentOffice = activeOffices.find((o) => ((o as any).id || o.slug) === selectedBranch) || activeOffices[0];

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
              const slug = (office as any).id || office.slug;
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
                  {currentOffice.address || "Office location details coming soon"}
                </p>
                <p
                  className="text-xs"
                  style={{ fontFamily: "var(--font-body)", color: "var(--color-text-muted)" }}
                >
                  {currentOffice.landmark || (currentOffice.address ? "" : "Contact regional advisor for assistance")}
                </p>
              </DetailBlock>

              <Divider />

              {/* Contact */}
              <DetailBlock label="Contact" icon={<Phone className="w-3.5 h-3.5" />}>
                {currentOffice.phone ? (
                  <a
                    href={`tel:${currentOffice.phone.replace(/\s/g, "")}`}
                    className="block text-sm font-semibold mb-1 hover:underline font-tabular"
                    style={{ fontFamily: "var(--font-display)", color: "var(--color-ink-700)" }}
                  >
                    {currentOffice.phone}
                  </a>
                ) : (
                  <p
                    className="text-sm font-semibold mb-1 font-tabular"
                    style={{ fontFamily: "var(--font-display)", color: "var(--color-text-muted)" }}
                  >
                    Official line pending
                  </p>
                )}
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
                  <div className="flex items-center gap-2">
                    {currentOffice.phone ? (
                      <motion.a
                        href={`tel:${currentOffice.phone.replace(/\s+/g, "")}`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 380, damping: 22 }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white"
                        style={{
                          fontFamily: "var(--font-display)",
                          backgroundColor: "var(--color-ink-700)",
                        }}
                        aria-label={`Call the ${currentOffice.city} office`}
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </motion.a>
                    ) : null}
                    {currentOffice.whatsapp ? (
                      <motion.a
                        href={`https://wa.me/${currentOffice.whatsapp}?text=${encodeURIComponent(
                          `Hello, I'd like to speak with a Trust Bricks Properties advisor at your ${currentOffice.city} office.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 380, damping: 22 }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white"
                        style={{
                          fontFamily: "var(--font-display)",
                          backgroundColor: "#25D366",
                        }}
                        aria-label={`WhatsApp the ${currentOffice.city} office`}
                      >
                        <WhatsAppIcon className="w-4 h-4" />
                        WhatsApp
                      </motion.a>
                    ) : null}
                  </div>
                  {currentOffice.address && currentOffice.mapQuery ? (
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
                  ) : null}
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

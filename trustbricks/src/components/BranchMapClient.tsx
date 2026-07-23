"use client";

import { useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, X, RotateCcw, Building } from "lucide-react";

interface BranchRecord {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  landmark?: string;
  phone: string;
  whatsapp?: string;
  email: string;
  hours?: string;
  csuEmail?: string;
  csuPhone?: string;
  isHQ?: boolean;
  lat: number | null;
  lng: number | null;
}

const GEO_URL = "/nigeria-states.json";
const NIGERIA_CENTER: [number, number] = [8.6753, 9.0820];
const DEFAULT_ZOOM = 5.5;

export default function BranchMapClient({ branches }: { branches: BranchRecord[] }) {
  const [selected, setSelected] = useState<BranchRecord | null>(null);
  const [center, setCenter] = useState<[number, number]>(NIGERIA_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const mappedBranches = useMemo(() => branches.filter((b) => b.lat != null && b.lng != null), [branches]);
  const unmappedBranches = useMemo(() => branches.filter((b) => b.lat == null || b.lng == null), [branches]);

  const selectBranch = (branch: BranchRecord) => {
    setSelected(branch);
    if (branch.lat != null && branch.lng != null) {
      setCenter([branch.lng, branch.lat]);
      setZoom(8);
    }
  };

  const handleStateClick = (geo: any) => {
    const { longitude, latitude } = geo.properties || {};
    if (longitude && latitude) {
      setCenter([parseFloat(longitude), parseFloat(latitude)]);
      setZoom(7);
    }
  };

  const resetView = () => {
    setCenter(NIGERIA_CENTER);
    setZoom(DEFAULT_ZOOM);
    setSelected(null);
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Map */}
        <div className="relative rounded-3xl overflow-hidden bg-[var(--color-ink-700)] border border-[var(--color-border)] aspect-[4/3] sm:aspect-[16/10]">
          <button
            onClick={resetView}
            className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset View
          </button>

          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 2200, center: NIGERIA_CENTER }}
            className="w-full h-full"
          >
            <ZoomableGroup center={center} zoom={zoom} onMoveEnd={({ coordinates, zoom: z }) => { setCenter(coordinates); setZoom(z); }} minZoom={4} maxZoom={16}>
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => handleStateClick(geo)}
                      style={{
                        default: { fill: "#1E3A5F", stroke: "#0D1F3C", strokeWidth: 0.5, outline: "none", cursor: "pointer" },
                        hover: { fill: "#E8600A", stroke: "#0D1F3C", strokeWidth: 0.5, outline: "none", cursor: "pointer" },
                        pressed: { fill: "#D4530A", stroke: "#0D1F3C", strokeWidth: 0.5, outline: "none" },
                      }}
                    />
                  ))
                }
              </Geographies>

              {mappedBranches.map((branch) => (
                <Marker
                  key={branch.id}
                  coordinates={[branch.lng as number, branch.lat as number]}
                  onClick={() => selectBranch(branch)}
                >
                  <circle
                    r={selected?.id === branch.id ? 7 : 5}
                    fill={branch.isHQ ? "#E8600A" : "#FFFFFF"}
                    stroke="#0D1F3C"
                    strokeWidth={1.5}
                    className="cursor-pointer transition-all"
                  />
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {/* Detail Panel / Directory */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[var(--color-card)] rounded-2xl p-6 border border-[var(--color-border)] shadow-card space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-clay-500)]/10 text-[var(--color-clay-500)] flex items-center justify-center shrink-0">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--color-text-heading)] text-base" style={{ fontFamily: "var(--font-display)" }}>
                        {selected.name}
                      </h3>
                      {selected.isHQ && <span className="text-[9px] font-bold text-[var(--color-clay-500)] uppercase">Headquarters</span>}
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)]" aria-label="Close">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-[var(--color-text-body)] flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0 mt-0.5" />
                  {selected.address || "Office location details coming soon"}{selected.city ? `, ${selected.city}, ${selected.state}` : ""}
                </p>
                <p className="text-xs text-[var(--color-text-body)] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[var(--color-text-muted)]" /> {selected.csuPhone || selected.phone || "Official line pending"}
                </p>
                <p className="text-xs text-[var(--color-text-body)] flex items-center gap-1.5 break-all">
                  <Mail className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" /> {selected.csuEmail || selected.email}
                </p>
                {(selected.phone || selected.whatsapp) && (
                  <div className="flex gap-2 pt-2">
                    <a href={`tel:${(selected.csuPhone || selected.phone).replace(/\s+/g, "")}`} className="flex-1 text-center py-2 rounded-lg bg-[var(--color-ink-700)] text-white text-xs font-bold">Call</a>
                    <a href={`https://wa.me/${selected.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 rounded-lg bg-[#25D366] text-white text-xs font-bold">WhatsApp</a>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[var(--color-card)] rounded-2xl p-6 border border-[var(--color-border)] text-center"
              >
                <MapPin className="w-8 h-8 text-[var(--color-clay-500)] mx-auto mb-2" />
                <p className="text-xs text-[var(--color-text-body)]">Click a state to zoom in, or click a branch marker for full contact details.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] shadow-card overflow-hidden max-h-80 overflow-y-auto">
            <div className="px-4 py-3 bg-[var(--color-mortar-50)] border-b border-[var(--color-border)]">
              <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wide">All Branches ({branches.length})</span>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => selectBranch(b)}
                  className={`w-full text-left px-4 py-2.5 text-xs hover:bg-[var(--color-mortar-50)] transition-colors cursor-pointer ${selected?.id === b.id ? "bg-[var(--color-clay-500)]/5 font-bold" : ""}`}
                >
                  {b.name}, {b.state}
                  {b.lat == null && <span className="text-[9px] text-[var(--color-text-muted)] ml-1.5">(location pending)</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

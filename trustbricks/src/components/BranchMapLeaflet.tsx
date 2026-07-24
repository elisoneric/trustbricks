"use client";

import { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
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

const NIGERIA_CENTER: [number, number] = [9.082, 8.6753];
const DEFAULT_ZOOM = 6;

// Create a custom DivIcon that looks like our old SVG circle markers
const createCustomIcon = (isHQ: boolean, isSelected: boolean) => {
  const size = isSelected ? 18 : 14;
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `<div style="
      background-color: ${isHQ ? '#E8600A' : '#FFFFFF'};
      border: 2px solid #0D1F3C;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0,0,0,0.4);
      transition: all 0.2s;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Component to handle flying to selected marker and resetting view
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 0.8,
    });
  }, [center, zoom, map]);

  return null;
}

export default function BranchMapLeaflet({ branches }: { branches: BranchRecord[] }) {
  const [selected, setSelected] = useState<BranchRecord | null>(null);
  const [center, setCenter] = useState<[number, number]>(NIGERIA_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const mappedBranches = useMemo(
    () => branches.filter((b) => b.lat != null && b.lng != null && !isNaN(Number(b.lat)) && !isNaN(Number(b.lng))),
    [branches]
  );

  const selectBranch = (branch: BranchRecord) => {
    setSelected(branch);
    if (branch.lat != null && branch.lng != null && !isNaN(Number(branch.lat)) && !isNaN(Number(branch.lng))) {
      setCenter([Number(branch.lat), Number(branch.lng)]);
      setZoom(13); // Zoom in on the specific branch
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
        <div className="relative rounded-3xl overflow-hidden bg-[var(--color-ink-700)] border border-[var(--color-border)] aspect-[4/3] sm:aspect-[16/10] z-0">
          <button
            onClick={resetView}
            className="absolute top-4 right-4 z-[1000] flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-gray-100 shadow-md text-[var(--color-text-heading)] text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset View
          </button>

          <MapContainer 
            center={center} 
            zoom={zoom} 
            scrollWheelZoom={false}
            className="w-full h-full z-0"
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController center={center} zoom={zoom} />

            {mappedBranches.map((branch) => (
              <Marker
                key={branch.id}
                position={[Number(branch.lat), Number(branch.lng)]}
                icon={createCustomIcon(!!branch.isHQ, selected?.id === branch.id)}
                eventHandlers={{
                  click: () => selectBranch(branch),
                }}
              >
              </Marker>
            ))}
          </MapContainer>
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
                  <button onClick={() => setSelected(null)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] cursor-pointer" aria-label="Close">
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
                <p className="text-xs text-[var(--color-text-body)]">Click a branch marker for full contact details.</p>
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

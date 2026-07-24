"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const BranchMapLeaflet = dynamic(() => import("./BranchMapLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="w-full bg-[var(--color-ink-700)] rounded-3xl aspect-[4/3] sm:aspect-[16/10] flex flex-col items-center justify-center border border-[var(--color-border)]">
      <Loader2 className="w-8 h-8 text-white animate-spin mb-4" />
      <span className="text-white font-semibold text-sm">Loading Map...</span>
    </div>
  ),
});

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

export default function BranchMapClient({ branches }: { branches: BranchRecord[] }) {
  return <BranchMapLeaflet branches={branches} />;
}

"use client";

import { ChevronDown } from "lucide-react";
import { updateLeadStatus } from "@/app/actions/adminActions";

export default function LeadStatusSelect({ leadId, currentStatus }: { 
  leadId: string; 
  currentStatus: string; 
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'qualified': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'disqualified': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'converted': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <form action={async (formData) => {
      const newStatus = formData.get('status') as string;
      await updateLeadStatus(leadId, newStatus);
    }}>
      <div className="relative inline-block w-32">
        <select
          name="status"
          defaultValue={currentStatus}
          onChange={(e) => e.target.form?.requestSubmit()}
          className={`appearance-none w-full border text-xs font-bold rounded-lg px-2.5 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#E8600A]/50 cursor-pointer transition-colors ${getStatusColor(currentStatus)}`}
        >
          <option value="new">New Lead</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="converted">Converted</option>
          <option value="disqualified">Disqualified</option>
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-50 text-slate-700" />
      </div>
    </form>
  );
}

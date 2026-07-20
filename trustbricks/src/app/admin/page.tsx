import { getLeads, updateLeadStatus, getAdminConfig, updateSiteSettings, addOfficer, removeOfficer, adminLogin, adminLogout, getBranches, createBranch, updateBranch, deleteBranch } from '@/app/actions/adminActions';
import { format } from 'date-fns';
import { cookies } from 'next/headers';
import { Search, Filter, Mail, Phone, ChevronDown, Plus, Trash, Settings, Users, Database, LogOut, Lock, MapPin, Pencil } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import BranchEditForm from '@/components/BranchEditForm';

export const metadata = {
  title: 'Admin Panel | Trust Bricks Properties Ltd',
};

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  const isAuthenticated = session === 'authenticated';

  // 1. GATED AUTHENTICATION LOCK SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#081526] px-4 font-sans selection:bg-[#E8600A]">
        {/* Decorative glowing orb */}
        <div className="absolute w-[300px] h-[300px] bg-[#E8600A]/10 blur-[80px] rounded-full top-[15%] left-[20%] pointer-events-none" />
        <div className="absolute w-[350px] h-[350px] bg-indigo-500/10 blur-[90px] rounded-full bottom-[15%] right-[20%] pointer-events-none" />

        <div className="w-full max-w-[420px] bg-[#0D1F3C]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative z-10 text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-14 h-14 bg-gradient-to-tr from-[#E8600A] to-[#FF8C42] rounded-2xl flex items-center justify-center shadow-lg shadow-[#E8600A]/20">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
              Admin Verification
            </h1>
            <p className="text-xs text-slate-400">
              Enter password to access Trust Bricks customizer.
            </p>
          </div>

          <form action={async (formData) => {
            'use server';
            const pass = formData.get('password') as string;
            await adminLogin(pass);
          }} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest pl-1">Security Key</label>
              <input
                name="password"
                type="password"
                required
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/50 focus:border-transparent transition-all"
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3.5 bg-[#E8600A] hover:bg-[#D4530A] text-white font-bold text-sm rounded-xl cursor-pointer shadow-lg shadow-[#E8600A]/10 transition-all duration-300"
            >
              Unlock Dashboard
            </button>
          </form>
          
          <div className="text-[10px] text-slate-500">
            Authorized personnel only.
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED PANEL
  const { tab = 'leads' } = await searchParams;
  const { success, leads } = await getLeads();
  const config = await getAdminConfig();
  const { branches } = await getBranches();

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
    <div className="min-h-screen bg-[#F0F4F9] text-[#0D1F3C] font-sans antialiased flex flex-col">
      {/* Dashboard Navbar */}
      <header className="bg-white border-b border-gray-200/80 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="" className="w-8 h-8" />
              <div className="flex flex-col">
                <span className="font-extrabold text-[16px] leading-none tracking-tight text-[#0D1F3C]" style={{ fontFamily: "var(--font-display)" }}>
                  TRUST BRICKS
                </span>
                <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase mt-0.5">Control Panel</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <form action={async () => {
                'use server';
                await adminLogout();
              }}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          <Link
            href="/admin?tab=leads"
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              tab === 'leads'
                ? 'bg-[#0D1F3C] text-white shadow-md'
                : 'bg-white hover:bg-slate-50 text-[#0D1F3C]/80 border border-slate-200/40'
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            <Database className="w-4 h-4" />
            Leads Manager ({leads?.length || 0})
          </Link>
          <Link
            href="/admin?tab=officers"
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              tab === 'officers'
                ? 'bg-[#0D1F3C] text-white shadow-md'
                : 'bg-white hover:bg-slate-50 text-[#0D1F3C]/80 border border-slate-200/40'
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            <Users className="w-4 h-4" />
            Conversion Officers ({config.officers?.length || 0})
          </Link>
          <Link
            href="/admin?tab=settings"
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              tab === 'settings'
                ? 'bg-[#0D1F3C] text-white shadow-md'
                : 'bg-white hover:bg-slate-50 text-[#0D1F3C]/80 border border-slate-200/40'
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            <Settings className="w-4 h-4" />
            Frontend Customizer
          </Link>
          <Link
            href="/admin?tab=branches"
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              tab === 'branches'
                ? 'bg-[#0D1F3C] text-white shadow-md'
                : 'bg-white hover:bg-slate-50 text-[#0D1F3C]/80 border border-slate-200/40'
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            <MapPin className="w-4 h-4" />
            Branches
          </Link>
        </aside>

        {/* Tab Content Display */}
        <main className="flex-grow">
          {/* TAB 1: LEADS MANAGER */}
          {tab === 'leads' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-[#0D1F3C]" style={{ fontFamily: "var(--font-display)" }}>Inbound Leads</h2>
                  <p className="text-slate-500 text-xs mt-0.5">Manage and track PenCom RSA mortgage inquiries.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                        <th className="px-6 py-4">Submission Date</th>
                        <th className="px-6 py-4">Client Contact</th>
                        <th className="px-6 py-4">Details</th>
                        <th className="px-6 py-4 text-right">RSA Balance</th>
                        <th className="px-6 py-4">Eligibility</th>
                        <th className="px-6 py-4">Action Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {!success || !leads || leads.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                            No active inquiries recorded.
                          </td>
                        </tr>
                      ) : (
                        leads.map((lead: any) => (
                          <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="font-semibold text-slate-900">{format(new Date(lead.createdAt), 'MMM d, yyyy')}</span>
                              <span className="block text-slate-400 text-xs mt-0.5">{format(new Date(lead.createdAt), 'h:mm a')}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-bold text-slate-950">{lead.full_name}</span>
                              <span className="block text-slate-500 text-xs mt-0.5">{lead.phone}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex px-2 py-0.5 bg-slate-100 text-[#0D1F3C] text-[10px] font-bold rounded mb-1">{lead.branch?.name || "Abuja (HQ)"}</span>
                              <span className="block text-slate-400 text-xs">{lead.employer_type}</span>
                            </td>
                            <td className="px-6 py-4 text-right font-semibold text-slate-900">
                              ₦{lead.rsa_balance.toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              {lead.is_eligible ? (
                                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 border border-emerald-200 text-emerald-800">
                                  Eligible
                                </span>
                              ) : (
                                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 border border-rose-200 text-rose-800">
                                  Ineligible
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <form action={async (formData) => {
                                'use server';
                                const newStatus = formData.get('status') as string;
                                await updateLeadStatus(lead.id, newStatus);
                              }}>
                                <div className="relative inline-block w-32">
                                  <select
                                    name="status"
                                    defaultValue={lead.status || 'new'}
                                    onChange={(e) => e.target.form?.requestSubmit()}
                                    className={`appearance-none w-full border text-xs font-bold rounded-lg px-2.5 py-1.5 pr-8 focus:outline-none focus:ring-2 focus:ring-[#E8600A]/50 cursor-pointer transition-colors ${getStatusColor(lead.status || 'new')}`}
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
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OFFICERS MANAGER */}
          {tab === 'officers' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#0D1F3C]" style={{ fontFamily: "var(--font-display)" }}>
                  Leads Conversion Officers
                </h2>
                <p className="text-slate-500 text-xs mt-0.5">Manage regional assignments and roles for officers handling leads.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-8 items-start">
                {/* Add Officer Form */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-card">
                  <h3 className="text-lg font-bold text-[#0D1F3C] mb-4" style={{ fontFamily: "var(--font-display)" }}>
                    Add New Officer
                  </h3>
                  <form action={async (formData) => {
                    'use server';
                    const name = formData.get('name') as string;
                    const email = formData.get('email') as string;
                    const role = formData.get('role') as string;
                    const branch = formData.get('branch') as string;
                    await addOfficer({ name, email, role, branch });
                  }} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                      <input
                        name="name"
                        type="text"
                        required
                        placeholder="e.g. Samuel Ade"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Email</label>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="samuel@trustbrickproperties.ng"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Role</label>
                        <select
                          name="role"
                          className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35"
                        >
                          <option value="Conversion Officer">Conversion Officer</option>
                          <option value="Lead Advisor">Lead Advisor</option>
                          <option value="Regional Manager">Regional Manager</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Branch</label>
                        <select
                          name="branch"
                          className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35"
                        >
                          <option value="Abuja (HQ)">Abuja (HQ)</option>
                          <option value="Lagos Hub">Lagos Hub</option>
                          <option value="Kano Center">Kano Center</option>
                          <option value="Kwara Center">Kwara Center</option>
                          <option value="Yola Hub (Adamawa)">Yola Hub (Adamawa)</option>
                          <option value="Benue Center">Benue Center</option>
                          <option value="Ogun Center">Ogun Center</option>
                          <option value="Lokoja Center">Lokoja Center</option>
                          <option value="Calabar Center">Calabar Center</option>
                          <option value="Minna Center">Minna Center</option>
                          <option value="Ibadan Center">Ibadan Center</option>
                          <option value="Ekiti Center">Ekiti Center</option>
                          <option value="Bauchi Center">Bauchi Center</option>
                          <option value="Kaduna Hub">Kaduna Hub</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-1.5 py-3 rounded-lg bg-[#E8600A] text-white text-xs font-bold hover:bg-[#D4530A] transition-colors cursor-pointer shadow-md shadow-[#E8600A]/10"
                    >
                      <Plus className="w-4 h-4" /> Add Officer
                    </button>
                  </form>
                </div>

                {/* Directory List */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-card overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Officer Directory</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {config.officers.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-sm">No officers configured.</div>
                    ) : (
                      config.officers.map((officer: any) => (
                        <div key={officer.id} className="p-5 flex justify-between items-center gap-4 hover:bg-slate-50/20 transition-colors">
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-900 text-base" style={{ fontFamily: "var(--font-display)" }}>
                              {officer.name}
                            </h4>
                            <p className="text-xs text-slate-500 flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-slate-400" /> {officer.email}
                            </p>
                            <div className="flex gap-2 pt-1">
                              <span className="px-2 py-0.5 bg-[#E8600A]/5 text-[#E8600A] text-[9px] font-bold rounded uppercase">
                                {officer.role}
                              </span>
                              <span className="px-2 py-0.5 bg-[#0D1F3C]/5 text-[#0D1F3C] text-[9px] font-bold rounded uppercase">
                                {officer.branch}
                              </span>
                            </div>
                          </div>
                          <form action={async () => {
                            'use server';
                            await removeOfficer(officer.id);
                          }}>
                            <button
                              type="submit"
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                              aria-label={`Remove ${officer.name}`}
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </form>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SITE CUSTOMIZER */}
          {tab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#0D1F3C]" style={{ fontFamily: "var(--font-display)" }}>
                  Frontend Customizer
                </h2>
                <p className="text-slate-500 text-xs mt-0.5">Edit texts, contact details, and metadata that render on the home interface.</p>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-card">
                <form action={async (formData) => {
                  'use server';
                  const slogan = formData.get('slogan') as string;
                  const heroTitle = formData.get('heroTitle') as string;
                  const heroSubtitle = formData.get('heroSubtitle') as string;
                  const companyPhone = formData.get('companyPhone') as string;
                  const companyEmail = formData.get('companyEmail') as string;
                  const rcNumber = formData.get('rcNumber') as string;
                  await updateSiteSettings({ slogan, heroTitle, heroSubtitle, companyPhone, companyEmail, rcNumber });
                }} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Brand Slogan</label>
                      <input
                        name="slogan"
                        type="text"
                        defaultValue={config.site.slogan}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">RC Registration Number</label>
                      <input
                        name="rcNumber"
                        type="text"
                        defaultValue={config.site.rcNumber}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Hero Headline</label>
                    <input
                      name="heroTitle"
                      type="text"
                      defaultValue={config.site.heroTitle}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Hero Subtitle</label>
                    <textarea
                      name="heroSubtitle"
                      rows={3}
                      defaultValue={config.site.heroSubtitle}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Support Phone Number</label>
                      <input
                        name="companyPhone"
                        type="text"
                        defaultValue={config.site.companyPhone}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Support Email Address</label>
                      <input
                        name="companyEmail"
                        type="text"
                        defaultValue={config.site.companyEmail}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-3.5 bg-[#0D1F3C] hover:bg-[#1E3A5F] text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition-all"
                    >
                      Save Configuration
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: BRANCHES MANAGER */}
          {tab === 'branches' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#0D1F3C]" style={{ fontFamily: "var(--font-display)" }}>
                  Branches
                </h2>
                <p className="text-slate-500 text-xs mt-0.5">Manage office locations and contact details.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-8 items-start">
                {/* Add Branch Form */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-card">
                  <h3 className="text-lg font-bold text-[#0D1F3C] mb-4" style={{ fontFamily: "var(--font-display)" }}>
                    Add New Branch
                  </h3>
                  <form action={async (formData) => {
                    'use server';
                    const data = {
                      name: formData.get('name') as string,
                      city: formData.get('city') as string,
                      state: formData.get('state') as string,
                      address: formData.get('address') as string,
                      landmark: formData.get('landmark') as string,
                      phone: formData.get('phone') as string,
                      whatsapp: formData.get('whatsapp') as string,
                      email: formData.get('email') as string,
                      hours: formData.get('hours') as string,
                      mapQuery: formData.get('mapQuery') as string,
                      iconType: formData.get('iconType') as string,
                    };
                    await createBranch(data);
                  }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Name</label>
                        <input name="name" required placeholder="Abuja (HQ)" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">City</label>
                        <input name="city" required placeholder="Abuja" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">State</label>
                        <input name="state" required placeholder="FCT" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Icon (Emoji)</label>
                        <input name="iconType" required placeholder="🏛️" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Address</label>
                      <input name="address" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Phone</label>
                        <input name="phone" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">WhatsApp</label>
                        <input name="whatsapp" required placeholder="+234..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Email</label>
                        <input name="email" required type="email" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Hours</label>
                        <input name="hours" required placeholder="Mon - Fri: 8am - 5pm" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Landmark</label>
                        <input name="landmark" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Map Query</label>
                        <input name="mapQuery" required placeholder="City+Country" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                    </div>
                    <button type="submit" className="w-full flex items-center justify-center gap-1.5 py-3 rounded-lg bg-[#0D1F3C] hover:bg-[#1E3A5F] text-white text-xs font-bold transition-colors cursor-pointer shadow-md">
                      <Plus className="w-4 h-4" /> Add Branch
                    </button>
                  </form>
                </div>

                {/* Directory List */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-card overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Active Branches ({branches?.length || 0})</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {!branches || branches.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-sm">No branches configured.</div>
                    ) : (
                      branches.map((b: any) => (
                        <BranchEditForm key={b.id} branch={b} />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

import { getLeads, updateLeadStatus, getAdminConfig, updateSiteSettings, getBranches, createBranch, updateBranch, deleteBranch } from '@/app/actions/adminActions';
import { getUsers, createUser, setUserActive } from '@/app/actions/userActions';
import { getProperties } from '@/app/actions/propertyActions';
import { getTestimonials } from '@/app/actions/testimonialActions';
import { getJobs } from '@/app/actions/jobActions';
import { getGalleryImages } from '@/app/actions/galleryActions';
import { getBlogPosts } from '@/app/actions/blogActions';
import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import { Mail, Phone, ChevronDown, Plus, Settings, Users as UsersIcon, Database, LogOut, MapPin, ShieldCheck, Home, Star, Briefcase, Image as ImageIcon, FileText } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import BranchEditForm from '@/components/BranchEditForm';
import PropertiesTab from '@/components/admin/PropertiesTab';
import TestimonialsTab from '@/components/admin/TestimonialsTab';
import CareersTab from '@/components/admin/CareersTab';
import GalleryTab from '@/components/admin/GalleryTab';
import BlogTab from '@/components/admin/BlogTab';
import LeadStatusSelect from '@/components/admin/LeadStatusSelect';

export const metadata = {
  title: 'Admin Panel | Trust Bricks Properties Ltd',
};

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/admin/login');
  }

  const role = ((session.user as any)?.role as 'SUPER_ADMIN' | 'CSU_STAFF') || 'CSU_STAFF';
  const branchId = ((session.user as any)?.branchId as string | null) || null;
  const isSuperAdmin = role === 'SUPER_ADMIN';

  const resolvedParams = searchParams ? await searchParams : {};
  const rawTab = resolvedParams?.tab || 'leads';
  // CSU staff can only ever see their own leads — no other tab exists for them.
  const tab = isSuperAdmin ? rawTab : 'leads';

  const leadsResult = await getLeads(isSuperAdmin ? null : branchId);
  const success = leadsResult?.success ?? false;
  const leads = leadsResult?.leads || [];

  const config = isSuperAdmin ? await getAdminConfig() : null;
  const branchesResult = await getBranches();
  const branches = branchesResult?.branches || [];

  const usersResult = isSuperAdmin && tab === 'users' ? await getUsers() : null;
  const propertiesResult = isSuperAdmin && tab === 'properties' ? await getProperties() : null;
  const testimonialsResult = isSuperAdmin && tab === 'testimonials' ? await getTestimonials() : null;
  const jobsResult = isSuperAdmin && tab === 'careers' ? await getJobs() : null;
  const galleryResult = isSuperAdmin && tab === 'gallery' ? await getGalleryImages() : null;
  const blogResult = isSuperAdmin && tab === 'blog' ? await getBlogPosts() : null;
  const myBranch = !isSuperAdmin && branches ? branches.find((b: any) => b.id === branchId) : null;

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
              <img src="/logo.png?v=3" alt="" className="h-10 w-auto" />
              <div className="flex flex-col">
                <span className="font-extrabold text-[16px] leading-none tracking-tight text-[#0D1F3C]" style={{ fontFamily: "var(--font-display)" }}>
                  TRUST BRICKS
                </span>
                <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase mt-0.5">Control Panel</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{session?.user?.name || session?.user?.email || 'User'}</span>
                <span className="px-2 py-0.5 bg-[#0D1F3C]/5 text-[#0D1F3C] text-[9px] font-bold rounded uppercase">{(role || 'STAFF').replace('_', ' ')}</span>
              </div>
              <form action={async () => {
                'use server';
                await signOut({ redirectTo: '/admin/login' });
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
            {isSuperAdmin ? 'Leads Manager' : 'My Branch Leads'} ({leads?.length || 0})
          </Link>

          {isSuperAdmin && (
            <>
              <Link
                href="/admin?tab=users"
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  tab === 'users'
                    ? 'bg-[#0D1F3C] text-white shadow-md'
                    : 'bg-white hover:bg-slate-50 text-[#0D1F3C]/80 border border-slate-200/40'
                }`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                <UsersIcon className="w-4 h-4" />
                Users
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
                Site Content
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
              <Link
                href="/admin?tab=properties"
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  tab === 'properties'
                    ? 'bg-[#0D1F3C] text-white shadow-md'
                    : 'bg-white hover:bg-slate-50 text-[#0D1F3C]/80 border border-slate-200/40'
                }`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                <Home className="w-4 h-4" />
                Properties
              </Link>
              <Link
                href="/admin?tab=testimonials"
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  tab === 'testimonials'
                    ? 'bg-[#0D1F3C] text-white shadow-md'
                    : 'bg-white hover:bg-slate-50 text-[#0D1F3C]/80 border border-slate-200/40'
                }`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                <Star className="w-4 h-4" />
                Testimonials
              </Link>
              <Link
                href="/admin?tab=careers"
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  tab === 'careers'
                    ? 'bg-[#0D1F3C] text-white shadow-md'
                    : 'bg-white hover:bg-slate-50 text-[#0D1F3C]/80 border border-slate-200/40'
                }`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                <Briefcase className="w-4 h-4" />
                Careers
              </Link>
              <Link
                href="/admin?tab=gallery"
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  tab === 'gallery'
                    ? 'bg-[#0D1F3C] text-white shadow-md'
                    : 'bg-white hover:bg-slate-50 text-[#0D1F3C]/80 border border-slate-200/40'
                }`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                <ImageIcon className="w-4 h-4" />
                Gallery
              </Link>
              <Link
                href="/admin?tab=blog"
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  tab === 'blog'
                    ? 'bg-[#0D1F3C] text-white shadow-md'
                    : 'bg-white hover:bg-slate-50 text-[#0D1F3C]/80 border border-slate-200/40'
                }`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                <FileText className="w-4 h-4" />
                Blog
              </Link>
            </>
          )}

          {!isSuperAdmin && myBranch && (
            <div className="bg-white rounded-xl p-4 border border-slate-200/40 space-y-2 mt-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">My Branch Contact</p>
              <p className="text-sm font-bold text-[#0D1F3C]">{myBranch.name}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1.5"><Phone className="w-3 h-3" /> {myBranch.csuPhone || myBranch.phone || '—'}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 break-all"><Mail className="w-3 h-3 shrink-0" /> {myBranch.csuEmail || myBranch.email || '—'}</p>
            </div>
          )}
        </aside>

        {/* Tab Content Display */}
        <main className="flex-grow">
          {/* TAB: LEADS MANAGER */}
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
                        <th className="px-6 py-4">Branch &amp; CSU Contact</th>
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
                              <span className="block text-slate-400 text-[11px]">{lead.branch?.csuEmail || lead.branch?.email || '—'}</span>
                              <span className="block text-slate-400 text-[11px]">{lead.branch?.csuPhone || lead.branch?.phone || '—'}</span>
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
                              <LeadStatusSelect leadId={lead.id} currentStatus={lead.status || 'new'} />
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

          {/* TAB: USERS MANAGER (SUPER_ADMIN only) */}
          {isSuperAdmin && tab === 'users' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#0D1F3C]" style={{ fontFamily: "var(--font-display)" }}>
                  Staff Accounts
                </h2>
                <p className="text-slate-500 text-xs mt-0.5">Create admin and CSU staff accounts. CSU staff only see leads for their assigned branch.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-8 items-start">
                {/* Add User Form */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-card">
                  <h3 className="text-lg font-bold text-[#0D1F3C] mb-4" style={{ fontFamily: "var(--font-display)" }}>
                    Add New User
                  </h3>
                  <form action={async (formData) => {
                    'use server';
                    const name = formData.get('name') as string;
                    const email = formData.get('email') as string;
                    const password = formData.get('password') as string;
                    const role = formData.get('role') as 'SUPER_ADMIN' | 'CSU_STAFF';
                    const branchId = formData.get('branchId') as string;
                    await createUser({ name, email, password, role, branchId });
                  }} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                      <input name="name" type="text" required placeholder="e.g. Samuel Ade" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Email</label>
                      <input name="email" type="email" required placeholder="samuel@trustbrickproperties.ng" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Temporary Password</label>
                      <input name="password" type="text" required minLength={8} placeholder="Min. 8 characters" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Role</label>
                        <select name="role" className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35">
                          <option value="CSU_STAFF">CSU Staff</option>
                          <option value="SUPER_ADMIN">Super Admin</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Branch (CSU only)</label>
                        <select name="branchId" className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35">
                          {branches?.map((b: any) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="w-full flex items-center justify-center gap-1.5 py-3 rounded-lg bg-[#E8600A] text-white text-xs font-bold hover:bg-[#D4530A] transition-colors cursor-pointer shadow-md shadow-[#E8600A]/10">
                      <Plus className="w-4 h-4" /> Create User
                    </button>
                  </form>
                </div>

                {/* Directory List */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-card overflow-hidden">
                  <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Staff Directory ({usersResult?.users?.length || 0})</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {!usersResult?.users || usersResult.users.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-sm">No users configured.</div>
                    ) : (
                      usersResult.users.map((u: any) => (
                        <div key={u.id} className="p-5 flex justify-between items-center gap-4 hover:bg-slate-50/20 transition-colors">
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                              {u.name}
                              {!u.active && <span className="px-1.5 py-0.5 bg-slate-200 text-slate-500 text-[9px] font-bold rounded uppercase">Deactivated</span>}
                            </h4>
                            <p className="text-xs text-slate-500 flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-slate-400" /> {u.email}
                            </p>
                            <div className="flex gap-2 pt-1">
                              <span className="px-2 py-0.5 bg-[#E8600A]/5 text-[#E8600A] text-[9px] font-bold rounded uppercase flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> {u.role.replace('_', ' ')}
                              </span>
                              {u.branch && (
                                <span className="px-2 py-0.5 bg-[#0D1F3C]/5 text-[#0D1F3C] text-[9px] font-bold rounded uppercase">
                                  {u.branch.name}
                                </span>
                              )}
                            </div>
                          </div>
                          <form action={async () => {
                            'use server';
                            await setUserActive(u.id, !u.active);
                          }}>
                            <button
                              type="submit"
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${u.active ? 'text-red-500 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                            >
                              {u.active ? 'Deactivate' : 'Reactivate'}
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

          {/* TAB: SITE CONTENT (SUPER_ADMIN only) */}
          {isSuperAdmin && tab === 'settings' && config && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#0D1F3C]" style={{ fontFamily: "var(--font-display)" }}>
                  Site Content
                </h2>
                <p className="text-slate-500 text-xs mt-0.5">Edit texts, contact details, and page content that render across the site.</p>
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
                  const dpoName = formData.get('dpoName') as string;
                  const dpoEmail = formData.get('dpoEmail') as string;
                  const vision = formData.get('vision') as string;
                  const mission = formData.get('mission') as string;
                  const aboutBody = formData.get('aboutBody') as string;
                  const aboutHeroImage = formData.get('aboutHeroImage') as string;
                  const coreValues = formData.get('coreValues') as string;
                  const leadershipTeam = formData.get('leadershipTeam') as string;
                  await updateSiteSettings({ slogan, heroTitle, heroSubtitle, companyPhone, companyEmail, rcNumber, dpoName, dpoEmail, vision, mission, aboutBody, aboutHeroImage, coreValues, leadershipTeam });
                }} className="space-y-6">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Brand Slogan</label>
                      <input name="slogan" type="text" defaultValue={config.site.slogan} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">RC Registration Number</label>
                      <input name="rcNumber" type="text" defaultValue={config.site.rcNumber} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Hero Headline</label>
                    <input name="heroTitle" type="text" defaultValue={config.site.heroTitle} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Hero Subtitle</label>
                    <textarea name="heroSubtitle" rows={3} defaultValue={config.site.heroSubtitle} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35 resize-none" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Support Phone Number</label>
                      <input name="companyPhone" type="text" defaultValue={config.site.companyPhone} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Support Email Address</label>
                      <input name="companyEmail" type="text" defaultValue={config.site.companyEmail} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Data Protection Officer (shown on Privacy Policy)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">DPO Name</label>
                        <input name="dpoName" type="text" defaultValue={config.site.dpoName} placeholder="e.g. Chidinma Okeke" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">DPO Email</label>
                        <input name="dpoEmail" type="email" defaultValue={config.site.dpoEmail} placeholder="dpo@trustbrickspropertieslimited.com.ng" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Vision, Mission &amp; About</p>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Vision</label>
                        <textarea name="vision" rows={2} defaultValue={config.site.vision} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35 resize-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Mission</label>
                        <textarea name="mission" rows={2} defaultValue={config.site.mission} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35 resize-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">About Page Body</label>
                        <textarea name="aboutBody" rows={4} defaultValue={config.site.aboutBody} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35 resize-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">About Page Hero Image URL</label>
                        <input name="aboutHeroImage" type="text" defaultValue={config.site.aboutHeroImage || ''} placeholder="/uploads/... or full URL" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Core Values &amp; Leadership (advanced — raw JSON)</p>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Core Values — JSON array of {'{'}title, description, icon{'}'}</label>
                        <textarea name="coreValues" rows={4} defaultValue={config.site.coreValues} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35 resize-none" />
                        <p className="text-[10px] text-slate-400">Icon options: Award, Building, Heart, Star, ShieldCheck, Handshake, TrendingUp, Users</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Leadership Team — JSON array of {'{'}name, title, photoUrl, bio{'}'}</label>
                        <textarea name="leadershipTeam" rows={4} defaultValue={config.site.leadershipTeam} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35 resize-none" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button type="submit" className="px-6 py-3.5 bg-[#0D1F3C] hover:bg-[#1E3A5F] text-white text-xs font-bold rounded-xl cursor-pointer shadow-md transition-all">
                      Save Configuration
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB: BRANCHES MANAGER (SUPER_ADMIN only) */}
          {isSuperAdmin && tab === 'branches' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#0D1F3C]" style={{ fontFamily: "var(--font-display)" }}>
                  Branches
                </h2>
                <p className="text-slate-500 text-xs mt-0.5">Manage office locations, CSU contact details, and map coordinates.</p>
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
                      csuEmail: formData.get('csuEmail') as string,
                      csuPhone: formData.get('csuPhone') as string,
                      isHQ: formData.get('isHQ') === 'on',
                      lat: formData.get('lat') ? parseFloat(formData.get('lat') as string) : undefined,
                      lng: formData.get('lng') ? parseFloat(formData.get('lng') as string) : undefined,
                    };
                    await createBranch(data);
                  }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Name</label>
                        <input name="name" required placeholder="Abuja (HQ)" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">City</label>
                        <input name="city" required placeholder="Abuja" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">State</label>
                        <input name="state" required placeholder="FCT" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Icon (Emoji)</label>
                        <input name="iconType" required placeholder="🏛️" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Address</label>
                      <input name="address" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Phone</label>
                        <input name="phone" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">WhatsApp</label>
                        <input name="whatsapp" required placeholder="+234..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Email</label>
                        <input name="email" required type="email" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Hours</label>
                        <input name="hours" required placeholder="Mon - Fri: 8am - 5pm" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Landmark</label>
                        <input name="landmark" required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Map Query</label>
                        <input name="mapQuery" required placeholder="City+Country" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">CSU Email</label>
                        <input name="csuEmail" placeholder="branch-csu@trustbricks..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">CSU Phone</label>
                        <input name="csuPhone" placeholder="+234..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Latitude (for Branches map)</label>
                        <input name="lat" type="text" inputMode="decimal" placeholder="e.g. 9.0765" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Longitude</label>
                        <input name="lng" type="text" inputMode="decimal" placeholder="e.g. 7.3986" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#E8600A]/35" />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <input type="checkbox" name="isHQ" className="rounded" />
                      This is the HQ branch (receives cc on every lead)
                    </label>
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

          {/* TAB: PROPERTIES (SUPER_ADMIN only) */}
          {isSuperAdmin && tab === 'properties' && (
            <PropertiesTab properties={propertiesResult?.properties || []} />
          )}

          {/* TAB: TESTIMONIALS (SUPER_ADMIN only) */}
          {isSuperAdmin && tab === 'testimonials' && (
            <TestimonialsTab testimonials={testimonialsResult?.testimonials || []} />
          )}

          {/* TAB: CAREERS (SUPER_ADMIN only) */}
          {isSuperAdmin && tab === 'careers' && (
            <CareersTab jobs={jobsResult?.jobs || []} />
          )}

          {/* TAB: GALLERY (SUPER_ADMIN only) */}
          {isSuperAdmin && tab === 'gallery' && (
            <GalleryTab images={galleryResult?.images || []} />
          )}

          {/* TAB: BLOG (SUPER_ADMIN only) */}
          {isSuperAdmin && tab === 'blog' && (
            <BlogTab posts={blogResult?.posts || []} />
          )}
        </main>
      </div>
    </div>
  );
}

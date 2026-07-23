'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// --- BRANCHES ---
export async function getBranches() {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    });
    return { success: true, branches };
  } catch (error: any) {
    console.error('[ADMIN GET BRANCHES ERROR]', error);
    return { success: false, message: 'Failed to fetch branches', branches: [] };
  }
}

export async function createBranch(data: {
  name: string; city: string; state: string; address: string; landmark: string; phone: string; whatsapp: string; email: string; hours: string; mapQuery: string; iconType: string;
  csuEmail?: string; csuPhone?: string; isHQ?: boolean; lat?: number; lng?: number;
}) {
  try {
    if (data.isHQ) {
      await prisma.branch.updateMany({ where: { isHQ: true }, data: { isHQ: false } });
    }
    const branch = await prisma.branch.create({ data });
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/contact');
    revalidatePath('/branches');
    return { success: true, branch };
  } catch (error: any) {
    console.error('[ADMIN CREATE BRANCH ERROR]', error);
    return { success: false, message: 'Failed to create branch' };
  }
}

export async function updateBranch(id: string, data: Partial<{
  name: string; city: string; state: string; address: string; landmark: string; phone: string; whatsapp: string; email: string; hours: string; mapQuery: string; iconType: string;
  csuEmail: string; csuPhone: string; isHQ: boolean; lat: number; lng: number;
}>) {
  try {
    if (data.isHQ) {
      await prisma.branch.updateMany({ where: { isHQ: true, NOT: { id } }, data: { isHQ: false } });
    }
    const branch = await prisma.branch.update({ where: { id }, data });
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/contact');
    revalidatePath('/branches');
    return { success: true, branch };
  } catch (error: any) {
    console.error('[ADMIN UPDATE BRANCH ERROR]', error);
    return { success: false, message: 'Failed to update branch' };
  }
}

export async function deleteBranch(id: string) {
  try {
    await prisma.branch.delete({ where: { id } });
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/contact');
    revalidatePath('/branches');
    return { success: true };
  } catch (error: any) {
    console.error('[ADMIN DELETE BRANCH ERROR]', error);
    return { success: false, message: 'Failed to delete branch' };
  }
}

// --- LEADS ---
// branchId: pass to scope results to a single branch (CSU_STAFF); omit for all leads (SUPER_ADMIN)
export async function getLeads(branchId?: string | null) {
  try {
    const leads = await prisma.lead.findMany({
      where: branchId ? { branch_id: branchId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { branch: true, pfa: true },
    });
    return { success: true, leads };
  } catch (error: any) {
    console.error('[ADMIN GET LEADS ERROR]', error);
    return { success: false, message: 'Failed to fetch leads', leads: [] };
  }
}

export async function updateLeadStatus(leadId: string, status: string) {
  try {
    const validStatuses = ['new', 'contacted', 'qualified', 'disqualified', 'converted'];
    if (!validStatuses.includes(status)) {
      return { success: false, message: 'Invalid status' };
    }

    const lead = await prisma.lead.update({
      where: { id: leadId },
      data: { status },
    });

    revalidatePath('/admin');
    return { success: true, lead };
  } catch (error: any) {
    console.error('[ADMIN UPDATE LEAD STATUS ERROR]', error);
    return { success: false, message: 'Failed to update lead status' };
  }
}

// --- SITE SETTINGS (DB-backed — was a JSON file on disk, wiped on every
// container redeploy; now a durable singleton row) ---
const DEFAULT_SITE_SETTINGS = {
  slogan: "We Value Your Trust",
  heroTitle: "Your RSA Can Open Your Front Door",
  heroSubtitle: "Access up to 25% of your Retirement Savings Account (RSA) as equity contribution towards a residential mortgage under PenCom guidelines. We handle the verification, documentation, and PFA coordination.",
  companyPhone: "+234 901 234 5678",
  companyEmail: "hq@trustbrickspropertieslimited.com.ng",
  rcNumber: "9552712",
  dpoName: "",
  dpoEmail: "",
  vision: "",
  mission: "",
  coreValues: "[]",
  aboutHeroImage: null as string | null,
  aboutBody: "",
  leadershipTeam: "[]",
};

export async function getAdminConfig() {
  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      update: {},
      create: { id: 'singleton', ...DEFAULT_SITE_SETTINGS },
    });
    return { site: settings };
  } catch (error) {
    console.error('[ADMIN GET SITE SETTINGS ERROR]', error);
    return { site: { id: 'singleton', ...DEFAULT_SITE_SETTINGS, updatedAt: new Date() } };
  }
}

export async function updateSiteSettings(settings: Partial<typeof DEFAULT_SITE_SETTINGS>) {
  try {
    await prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      update: settings,
      create: { id: 'singleton', ...DEFAULT_SITE_SETTINGS, ...settings },
    });
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/about');
    revalidatePath('/privacy');
    return { success: true };
  } catch (error) {
    console.error('[ADMIN UPDATE SETTINGS ERROR]', error);
    return { success: false, message: 'Failed to update settings' };
  }
}

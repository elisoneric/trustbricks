'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

// Helper to get filepath to config
const getConfigPath = () => path.join(process.cwd(), 'src', 'app', 'actions', 'adminConfig.json');

// --- BRANCHES ---
export async function getBranches() {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { name: 'asc' },
    });
    return { success: true, branches };
  } catch (error: any) {
    console.error('[ADMIN GET BRANCHES ERROR]', error);
    return { success: false, message: 'Failed to fetch branches', branches: [] };
  }
}

export async function createBranch(data: {
  name: string; city: string; state: string; address: string; landmark: string; phone: string; whatsapp: string; email: string; hours: string; mapQuery: string; iconType: string;
}) {
  try {
    const branch = await prisma.branch.create({ data });
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/contact');
    return { success: true, branch };
  } catch (error: any) {
    console.error('[ADMIN CREATE BRANCH ERROR]', error);
    return { success: false, message: 'Failed to create branch' };
  }
}

export async function updateBranch(id: string, data: Partial<{
  name: string; city: string; state: string; address: string; landmark: string; phone: string; whatsapp: string; email: string; hours: string; mapQuery: string; iconType: string;
}>) {
  try {
    const branch = await prisma.branch.update({ where: { id }, data });
    revalidatePath('/admin');
    revalidatePath('/');
    revalidatePath('/contact');
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
    return { success: true };
  } catch (error: any) {
    console.error('[ADMIN DELETE BRANCH ERROR]', error);
    return { success: false, message: 'Failed to delete branch' };
  }
}

// Get leads for the dashboard
export async function getLeads() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        branch: true,
        pfa: true,
      },
    });
    return { success: true, leads };
  } catch (error: any) {
    console.error('[ADMIN GET LEADS ERROR]', error);
    return { success: false, message: 'Failed to fetch leads', leads: [] };
  }
}

// Update lead status
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

// Get admin configuration
export async function getAdminConfig() {
  try {
    const configPath = getConfigPath();
    const data = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Default fallback config
    return {
      site: {
        slogan: "We Value Your Trust",
        heroTitle: "Your RSA Balance Can Open Your Front Door",
        heroSubtitle: "Unlock 25% of your Retirement Savings Account (RSA) to finance your residential mortgage down payment. We simplify the verification, banking matches, and PFA approvals.",
        companyPhone: "+234 901 234 5678",
        companyEmail: "hq@trustbrickspropertieslimited.com.ng",
        rcNumber: "9552712"
      },
      officers: [
        { id: "1", name: "Adewale Fashola", email: "adewale@trustbrickproperties.ng", role: "Senior Conversion Officer", branch: "Lagos Office" },
        { id: "2", name: "Amina Usman", email: "amina@trustbrickproperties.ng", role: "Lead Conversion Officer", branch: "Abuja (HQ)" }
      ]
    };
  }
}

// Save site settings
export async function updateSiteSettings(settings: any) {
  try {
    const config = await getAdminConfig();
    config.site = { ...config.site, ...settings };
    await fs.writeFile(getConfigPath(), JSON.stringify(config, null, 2), 'utf-8');
    
    // Revalidate paths to refresh page state on the frontend
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('[ADMIN UPDATE SETTINGS ERROR]', error);
    return { success: false, message: 'Failed to update settings' };
  }
}

// Add conversion officer role
export async function addOfficer(officerData: { name: string; email: string; role: string; branch: string }) {
  try {
    const config = await getAdminConfig();
    const newOfficer = {
      id: String(Date.now()),
      ...officerData
    };
    config.officers.push(newOfficer);
    await fs.writeFile(getConfigPath(), JSON.stringify(config, null, 2), 'utf-8');
    
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('[ADMIN ADD OFFICER ERROR]', error);
    return { success: false, message: 'Failed to add officer' };
  }
}

// Remove conversion officer role
export async function removeOfficer(id: string) {
  try {
    const config = await getAdminConfig();
    config.officers = config.officers.filter((o: any) => o.id !== id);
    await fs.writeFile(getConfigPath(), JSON.stringify(config, null, 2), 'utf-8');
    
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('[ADMIN REMOVE OFFICER ERROR]', error);
    return { success: false, message: 'Failed to remove officer' };
  }
}

// Admin Panel Login Check
export async function adminLogin(password: string) {
  const adminPass = process.env.ADMIN_PASSWORD || 'admin';
  if (password === adminPass) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 2, // 2 hours
      path: '/'
    });
    return { success: true };
  }
  return { success: false, message: 'Invalid password' };
}

// Admin Panel Logout
export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  revalidatePath('/admin');
  return { success: true };
}

'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

async function requireSuperAdmin() {
  const session = await auth();
  if ((session?.user as any)?.role !== 'SUPER_ADMIN') {
    throw new Error('Forbidden: super admin access required');
  }
}

export async function getJobs(publishedOnly = false) {
  try {
    const jobs = await prisma.jobListing.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: { postedAt: 'desc' },
    });
    return { success: true, jobs };
  } catch (error: any) {
    console.error('[JOBS GET ERROR]', error);
    return { success: false, message: 'Failed to fetch jobs', jobs: [] };
  }
}

function parseFields(formData: FormData) {
  return {
    title: (formData.get('title') as string) || '',
    department: (formData.get('department') as string) || '',
    location: (formData.get('location') as string) || '',
    type: (formData.get('type') as string) || 'Full-Time',
    description: (formData.get('description') as string) || '',
    requirements: (formData.get('requirements') as string) || '',
    externalApplyUrl: (formData.get('externalApplyUrl') as string) || '',
    published: formData.get('published') === 'on',
  };
}

export async function createJob(formData: FormData) {
  try {
    await requireSuperAdmin();
    await prisma.jobListing.create({ data: parseFields(formData) });
    revalidatePath('/admin');
    revalidatePath('/careers');
    return { success: true };
  } catch (error: any) {
    console.error('[JOBS CREATE ERROR]', error);
    return { success: false, message: error.message || 'Failed to create job listing' };
  }
}

export async function updateJob(id: string, formData: FormData) {
  try {
    await requireSuperAdmin();
    await prisma.jobListing.update({ where: { id }, data: parseFields(formData) });
    revalidatePath('/admin');
    revalidatePath('/careers');
    return { success: true };
  } catch (error: any) {
    console.error('[JOBS UPDATE ERROR]', error);
    return { success: false, message: error.message || 'Failed to update job listing' };
  }
}

export async function deleteJob(id: string) {
  try {
    await requireSuperAdmin();
    await prisma.jobListing.delete({ where: { id } });
    revalidatePath('/admin');
    revalidatePath('/careers');
    return { success: true };
  } catch (error: any) {
    console.error('[JOBS DELETE ERROR]', error);
    return { success: false, message: error.message || 'Failed to delete job listing' };
  }
}

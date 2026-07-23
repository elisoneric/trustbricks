'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { saveUpload, deleteUpload } from '@/lib/uploads';

const prisma = new PrismaClient();

async function requireSuperAdmin() {
  const session = await auth();
  if ((session?.user as any)?.role !== 'SUPER_ADMIN') {
    throw new Error('Forbidden: super admin access required');
  }
}

export async function getTestimonials(publishedOnly = false) {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, testimonials };
  } catch (error: any) {
    console.error('[TESTIMONIALS GET ERROR]', error);
    return { success: false, message: 'Failed to fetch testimonials', testimonials: [] };
  }
}

async function upsertFromForm(formData: FormData, existingAvatar?: string | null) {
  const name = (formData.get('name') as string) || '';
  const role = (formData.get('role') as string) || '';
  const quote = (formData.get('quote') as string) || '';
  const rating = parseInt((formData.get('rating') as string) || '5', 10);
  const published = formData.get('published') === 'on';
  let avatarUrl = existingAvatar || null;
  const file = formData.get('avatar') as File | null;
  if (file && file.size > 0) avatarUrl = await saveUpload(file, 'testimonials');
  return { name, role, quote, rating, published, avatarUrl };
}

export async function createTestimonial(formData: FormData) {
  try {
    await requireSuperAdmin();
    const data = await upsertFromForm(formData);
    await prisma.testimonial.create({ data });
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('[TESTIMONIALS CREATE ERROR]', error);
    return { success: false, message: error.message || 'Failed to create testimonial' };
  }
}

export async function updateTestimonial(id: string, formData: FormData) {
  try {
    await requireSuperAdmin();
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    const data = await upsertFromForm(formData, existing?.avatarUrl);
    await prisma.testimonial.update({ where: { id }, data });
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('[TESTIMONIALS UPDATE ERROR]', error);
    return { success: false, message: error.message || 'Failed to update testimonial' };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await requireSuperAdmin();
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (existing?.avatarUrl) await deleteUpload(existing.avatarUrl);
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('[TESTIMONIALS DELETE ERROR]', error);
    return { success: false, message: error.message || 'Failed to delete testimonial' };
  }
}

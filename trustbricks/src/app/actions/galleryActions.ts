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

export async function getGalleryImages() {
  try {
    const images = await prisma.galleryImage.findMany({ orderBy: [{ category: 'asc' }, { order: 'asc' }, { createdAt: 'desc' }] });
    return { success: true, images };
  } catch (error: any) {
    console.error('[GALLERY GET ERROR]', error);
    return { success: false, message: 'Failed to fetch gallery images', images: [] };
  }
}

export async function createGalleryImage(formData: FormData) {
  try {
    await requireSuperAdmin();
    const file = formData.get('image') as File | null;
    if (!file || file.size === 0) return { success: false, message: 'An image file is required' };
    const url = await saveUpload(file, 'gallery');
    const caption = (formData.get('caption') as string) || '';
    const category = (formData.get('category') as string) || 'general';
    await prisma.galleryImage.create({ data: { url, caption, category } });
    revalidatePath('/admin');
    revalidatePath('/gallery');
    return { success: true };
  } catch (error: any) {
    console.error('[GALLERY CREATE ERROR]', error);
    return { success: false, message: error.message || 'Failed to add image' };
  }
}

export async function deleteGalleryImage(id: string) {
  try {
    await requireSuperAdmin();
    const existing = await prisma.galleryImage.findUnique({ where: { id } });
    if (existing) await deleteUpload(existing.url);
    await prisma.galleryImage.delete({ where: { id } });
    revalidatePath('/admin');
    revalidatePath('/gallery');
    return { success: true };
  } catch (error: any) {
    console.error('[GALLERY DELETE ERROR]', error);
    return { success: false, message: error.message || 'Failed to delete image' };
  }
}

'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { saveUpload, deleteUpload } from '@/lib/uploads';
import type { PropertyCategory, PropertyStatus } from '@/lib/types';

const prisma = new PrismaClient();

async function requireSuperAdmin() {
  const session = await auth();
  if ((session?.user as any)?.role !== 'SUPER_ADMIN') {
    throw new Error('Forbidden: super admin access required');
  }
}

export async function getProperties(publishedOnly = false) {
  try {
    const properties = await prisma.property.findMany({
      where: publishedOnly ? { status: { not: 'SOLD' } } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, properties };
  } catch (error: any) {
    console.error('[PROPERTIES GET ERROR]', error);
    return { success: false, message: 'Failed to fetch properties', properties: [] };
  }
}

function parseFormFields(formData: FormData) {
  return {
    title: (formData.get('title') as string) || '',
    category: (formData.get('category') as PropertyCategory) || 'RESIDENTIAL',
    status: (formData.get('status') as PropertyStatus) || 'AVAILABLE',
    description: (formData.get('description') as string) || '',
    price: formData.get('price') ? parseFloat(formData.get('price') as string) : null,
    priceLabel: (formData.get('priceLabel') as string) || '',
    city: (formData.get('city') as string) || '',
    state: (formData.get('state') as string) || '',
    address: (formData.get('address') as string) || '',
    bedrooms: formData.get('bedrooms') ? parseInt(formData.get('bedrooms') as string, 10) : null,
    bathrooms: formData.get('bathrooms') ? parseInt(formData.get('bathrooms') as string, 10) : null,
    sizeSqm: formData.get('sizeSqm') ? parseFloat(formData.get('sizeSqm') as string) : null,
    featured: formData.get('featured') === 'on',
  };
}

export async function createProperty(formData: FormData) {
  try {
    await requireSuperAdmin();
    const fields = parseFormFields(formData);
    const images: string[] = [];
    const files = formData.getAll('images') as File[];
    for (const file of files) {
      if (file && file.size > 0) images.push(await saveUpload(file, 'properties'));
    }
    await prisma.property.create({ data: { ...fields, images: JSON.stringify(images) } });
    revalidatePath('/admin');
    revalidatePath('/properties');
    return { success: true };
  } catch (error: any) {
    console.error('[PROPERTIES CREATE ERROR]', error);
    return { success: false, message: error.message || 'Failed to create property' };
  }
}

export async function updateProperty(id: string, formData: FormData) {
  try {
    await requireSuperAdmin();
    const fields = parseFormFields(formData);
    const existing = await prisma.property.findUnique({ where: { id } });
    let images: string[] = existing ? JSON.parse(existing.images || '[]') : [];
    const files = formData.getAll('images') as File[];
    const newImages: string[] = [];
    for (const file of files) {
      if (file && file.size > 0) newImages.push(await saveUpload(file, 'properties'));
    }
    if (newImages.length > 0) images = [...images, ...newImages];
    await prisma.property.update({ where: { id }, data: { ...fields, images: JSON.stringify(images) } });
    revalidatePath('/admin');
    revalidatePath('/properties');
    return { success: true };
  } catch (error: any) {
    console.error('[PROPERTIES UPDATE ERROR]', error);
    return { success: false, message: error.message || 'Failed to update property' };
  }
}

export async function removePropertyImage(id: string, imageUrl: string) {
  try {
    await requireSuperAdmin();
    const existing = await prisma.property.findUnique({ where: { id } });
    if (!existing) return { success: false, message: 'Property not found' };
    const images: string[] = JSON.parse(existing.images || '[]').filter((u: string) => u !== imageUrl);
    await prisma.property.update({ where: { id }, data: { images: JSON.stringify(images) } });
    await deleteUpload(imageUrl);
    revalidatePath('/admin');
    revalidatePath('/properties');
    return { success: true };
  } catch (error: any) {
    console.error('[PROPERTIES REMOVE IMAGE ERROR]', error);
    return { success: false, message: error.message || 'Failed to remove image' };
  }
}

export async function deleteProperty(id: string) {
  try {
    await requireSuperAdmin();
    const existing = await prisma.property.findUnique({ where: { id } });
    if (existing) {
      const images: string[] = JSON.parse(existing.images || '[]');
      for (const img of images) await deleteUpload(img);
    }
    await prisma.property.delete({ where: { id } });
    revalidatePath('/admin');
    revalidatePath('/properties');
    return { success: true };
  } catch (error: any) {
    console.error('[PROPERTIES DELETE ERROR]', error);
    return { success: false, message: error.message || 'Failed to delete property' };
  }
}

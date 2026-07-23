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

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function getBlogPosts(publishedOnly = false) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: publishedOnly ? { published: true } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, posts };
  } catch (error: any) {
    console.error('[BLOG GET ERROR]', error);
    return { success: false, message: 'Failed to fetch posts', posts: [] };
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    return { success: true, post };
  } catch (error: any) {
    console.error('[BLOG GET BY SLUG ERROR]', error);
    return { success: false, post: null };
  }
}

async function parseFields(formData: FormData, existingCover?: string | null) {
  const title = (formData.get('title') as string) || '';
  let slug = (formData.get('slug') as string) || slugify(title);
  slug = slugify(slug);
  const published = formData.get('published') === 'on';
  let coverImage = existingCover || null;
  const file = formData.get('coverImage') as File | null;
  if (file && file.size > 0) coverImage = await saveUpload(file, 'blog');
  return {
    title,
    slug,
    excerpt: (formData.get('excerpt') as string) || '',
    body: (formData.get('body') as string) || '',
    authorName: (formData.get('authorName') as string) || 'Trust Bricks Team',
    coverImage,
    published,
    publishedAt: published ? new Date() : null,
  };
}

export async function createBlogPost(formData: FormData) {
  try {
    await requireSuperAdmin();
    const data = await parseFields(formData);
    await prisma.blogPost.create({ data });
    revalidatePath('/admin');
    revalidatePath('/insights');
    return { success: true };
  } catch (error: any) {
    console.error('[BLOG CREATE ERROR]', error);
    if (error?.code === 'P2002') return { success: false, message: 'A post with that slug already exists' };
    return { success: false, message: error.message || 'Failed to create post' };
  }
}

export async function updateBlogPost(id: string, formData: FormData) {
  try {
    await requireSuperAdmin();
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    const data = await parseFields(formData, existing?.coverImage);
    await prisma.blogPost.update({ where: { id }, data });
    revalidatePath('/admin');
    revalidatePath('/insights');
    return { success: true };
  } catch (error: any) {
    console.error('[BLOG UPDATE ERROR]', error);
    if (error?.code === 'P2002') return { success: false, message: 'A post with that slug already exists' };
    return { success: false, message: error.message || 'Failed to update post' };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await requireSuperAdmin();
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (existing?.coverImage) await deleteUpload(existing.coverImage);
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath('/admin');
    revalidatePath('/insights');
    return { success: true };
  } catch (error: any) {
    console.error('[BLOG DELETE ERROR]', error);
    return { success: false, message: error.message || 'Failed to delete post' };
  }
}

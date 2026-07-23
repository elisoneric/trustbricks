'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { auth } from '@/lib/auth';
import type { Role } from '@/lib/types';

const prisma = new PrismaClient();

async function requireSuperAdmin() {
  const session = await auth();
  if ((session?.user as any)?.role !== 'SUPER_ADMIN') {
    throw new Error('Forbidden: super admin access required');
  }
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: { branch: true },
    });
    return { success: true, users };
  } catch (error: any) {
    console.error('[USERS GET ERROR]', error);
    return { success: false, message: 'Failed to fetch users', users: [] };
  }
}

export async function createUser(data: { name: string; email: string; password: string; role: Role; branchId?: string | null }) {
  try {
    await requireSuperAdmin();
    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
        branch_id: data.role === 'CSU_STAFF' ? data.branchId || null : null,
      },
    });
    revalidatePath('/admin');
    return { success: true, user };
  } catch (error: any) {
    console.error('[USERS CREATE ERROR]', error);
    if (error?.code === 'P2002') {
      return { success: false, message: 'A user with that email already exists' };
    }
    return { success: false, message: error.message || 'Failed to create user' };
  }
}

export async function setUserActive(id: string, active: boolean) {
  try {
    await requireSuperAdmin();
    await prisma.user.update({ where: { id }, data: { active } });
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('[USERS SET ACTIVE ERROR]', error);
    return { success: false, message: error.message || 'Failed to update user' };
  }
}

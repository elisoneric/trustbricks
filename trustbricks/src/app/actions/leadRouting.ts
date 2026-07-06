'use server';

import { headers } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// In-memory rate limiter: IP -> { count, timestamp }
// Suitable for single VPS / Docker deployment
const RATE_LIMIT_MAP = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_MAX = 3; // Max 3 submissions per IP per hour
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

export type LeadResponse = {
  success: boolean;
  message?: string;
  leadId?: string;
};

export async function processMortgageLead(formData: FormData): Promise<LeadResponse> {
  try {
    // --- RATE LIMITING START ---
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    
    if (ip !== 'unknown') {
      const now = Date.now();
      const record = RATE_LIMIT_MAP.get(ip);
      
      if (record) {
        if (now - record.timestamp > RATE_LIMIT_WINDOW_MS) {
          // Reset window
          RATE_LIMIT_MAP.set(ip, { count: 1, timestamp: now });
        } else if (record.count >= RATE_LIMIT_MAX) {
          console.warn(`[RATE LIMIT] IP ${ip} exceeded max submissions`);
          return { success: false, message: 'You have exceeded the maximum number of submissions. Please try again later.' };
        } else {
          // Increment count
          RATE_LIMIT_MAP.set(ip, { count: record.count + 1, timestamp: record.timestamp });
        }
      } else {
        RATE_LIMIT_MAP.set(ip, { count: 1, timestamp: now });
      }
    }
    // --- RATE LIMITING END ---
    const full_name = formData.get('full_name') as string;
    const phone = formData.get('phone') as string;
    const employer_type = formData.get('employer_type') as string;
    const rsa_balance_str = formData.get('rsa_balance') as string;
    const branch_id = formData.get('branch_id') as string;
    const pfa_id = formData.get('pfa_id') as string;

    if (!full_name || !phone || !rsa_balance_str || !branch_id || !pfa_id) {
      return { success: false, message: 'Missing required fields' };
    }

    const rsa_balance = parseFloat(rsa_balance_str);
    if (isNaN(rsa_balance)) {
      return { success: false, message: 'Invalid RSA balance' };
    }

    // 1. Fetch PFA Rule to validate server-side
    const pfaRule = await prisma.pfaRule.findUnique({
      where: { id: pfa_id },
    });

    if (!pfaRule) {
      return { success: false, message: 'Invalid PFA selected' };
    }

    // 2. Fetch Branch
    const branch = await prisma.branch.findUnique({
      where: { id: branch_id },
    });

    if (!branch) {
      return { success: false, message: 'Invalid Branch selected' };
    }

    // 3. Strict Server-Side Mathematical Validation
    const is_eligible = rsa_balance >= pfaRule.minimum_threshold;

    // 4. Save to Database
    const lead = await prisma.lead.create({
      data: {
        full_name,
        phone,
        employer_type: employer_type || 'Unknown',
        rsa_balance,
        is_eligible,
        pfa_id,
        branch_id,
      },
    });

    // In a full production setup, here you would:
    // a. Send an email to `branch.email`
    // b. Trigger a WhatsApp message to `branch.whatsapp`
    console.log(`[ROUTING ENGINE] Lead ${lead.id} routed to ${branch.name}. Eligible: ${is_eligible}`);

    return {
      success: true,
      leadId: lead.id,
      message: is_eligible 
        ? 'Congratulations! You are eligible for the mortgage.' 
        : 'Unfortunately, your RSA balance does not meet the minimum threshold.',
    };

  } catch (error: any) {
    console.error('[LEAD ROUTING ERROR]', error);
    return {
      success: false,
      message: 'An unexpected error occurred while processing your lead.',
    };
  }
}

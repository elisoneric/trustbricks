'use server';

import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export type LeadResponse = {
  success: boolean;
  message?: string;
  leadId?: string;
};

export type TrackStatusResponse = {
  found: boolean;
  status: string | null;
  description: string | null;
  step: number | null;
  total_steps: number;
};

export async function processMortgageLead(formData: FormData): Promise<LeadResponse> {
  try {
    const full_name = (formData.get('full_name') as string)?.trim();
    const phone = (formData.get('phone') as string)?.trim();
    const email = (formData.get('email') as string)?.trim() || '';
    const employer_type = (formData.get('employer_type') as string)?.trim() || 'Private Sector';
    const rsa_balance_str = formData.get('rsa_balance') as string;
    const years_in_work_str = formData.get('years_in_work') as string;
    const years_to_retire_str = formData.get('years_to_retire') as string;
    const branch_id = (formData.get('branch_id') as string)?.trim();
    const pfa_id = (formData.get('pfa_id') as string)?.trim();

    if (!full_name || !phone) {
      return { success: false, message: 'Please provide your full name and phone number.' };
    }

    const rsa_balance = parseFloat(rsa_balance_str || '0') || 0;
    const years_in_work = parseInt(years_in_work_str || '0', 10) || 0;
    const years_to_retire = parseInt(years_to_retire_str || '0', 10) || 0;

    // 1. Resolve PFA Rule robustly
    let pfaRule = null;
    if (pfa_id) {
      pfaRule = await prisma.pfaRule.findFirst({
        where: {
          OR: [
            { id: pfa_id },
            { name: { equals: pfa_id } }
          ]
        }
      });
    }

    if (!pfaRule) {
      pfaRule = await prisma.pfaRule.findFirst({ orderBy: { createdAt: 'asc' } });
    }

    if (!pfaRule) {
      pfaRule = await prisma.pfaRule.create({
        data: {
          name: pfa_id || 'Stanbic IBTC',
          minimum_threshold: 5000000
        }
      });
    }

    // 2. Resolve Branch robustly
    let branch = null;
    if (branch_id) {
      branch = await prisma.branch.findFirst({
        where: {
          OR: [
            { id: branch_id },
            { name: { equals: branch_id } }
          ]
        }
      });
    }

    if (!branch) {
      branch = await prisma.branch.findFirst({ orderBy: { name: 'asc' } });
    }

    if (!branch) {
      branch = await prisma.branch.create({
        data: {
          name: 'Abuja',
          city: 'Abuja',
          state: 'FCT',
          whatsapp: '+2347078387777',
          phone: '+2347078387777',
          email: 'abuja@trustbrickproperties.ng',
          address: 'Area 3, block 5, House 4 Cross River Street Garki, Abuja',
        }
      });
    }

    // 3. Strict Server-Side Validation
    const is_eligible = years_in_work >= 5 && years_to_retire >= 3;

    // 4. Save to Database
    const lead = await prisma.lead.create({
      data: {
        full_name,
        phone,
        employer_type,
        rsa_balance,
        years_in_work,
        years_to_retire,
        is_eligible,
        pfa_id: pfaRule.id,
        branch_id: branch.id,
      },
    });

    // 5. Send Notification Email — routed to the lead's chosen branch CSU line,
    //    with the HQ CSU line cc'd so admin always has visibility on every lead.
    try {
      const hqBranch = branch.isHQ ? null : await prisma.branch.findFirst({ where: { isHQ: true } });
      const toEmail = branch.csuEmail || branch.email || process.env.NOTIFICATION_EMAIL || 'csu@trustbrickpropertieslimited.com.ng';
      const ccEmail = hqBranch ? (hqBranch.csuEmail || hqBranch.email) : null;
      const ccList = ccEmail && ccEmail !== toEmail ? [ccEmail] : undefined;

      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"Trust Bricks Automations" <${process.env.SMTP_USER}>`,
          to: toEmail,
          cc: ccList,
          subject: `New Mortgage Lead - ${full_name}`,
          html: `
            <h2>New Mortgage Lead Submitted</h2>
            <p><strong>Name:</strong> ${full_name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email || 'N/A'}</p>
            <p><strong>Employer Type:</strong> ${employer_type}</p>
            <p><strong>RSA Balance:</strong> ₦${rsa_balance.toLocaleString('en-NG')}</p>
            <p><strong>Years in Service:</strong> ${years_in_work}</p>
            <p><strong>Years to Retire:</strong> ${years_to_retire}</p>
            <p><strong>Eligible:</strong> <span style="color: ${is_eligible ? 'green' : 'red'}">${is_eligible ? 'Yes' : 'No'}</span></p>
            <p><strong>Preferred Branch:</strong> ${branch.name}</p>
            <p><strong>PFA:</strong> ${pfaRule.name}</p>
            <hr />
            <p><small>This email was automatically generated by the Trust Bricks system.</small></p>
          `,
        });
        console.log(`[ROUTING ENGINE] Notification email sent to ${toEmail}${ccList ? ` (cc: ${ccList.join(', ')})` : ''}`);
      } else {
        console.warn('[ROUTING ENGINE] SMTP credentials (SMTP_USER & SMTP_PASS) not configured in environment variables. Email notification skipped.');
      }
    } catch (emailErr) {
      console.error('[ROUTING ENGINE] Failed to send email:', emailErr);
    }

    console.log(`[ROUTING ENGINE] Lead ${lead.id} routed to ${branch.name}. Eligible: ${is_eligible}`);

    return {
      success: true,
      leadId: lead.id,
      message: is_eligible 
        ? 'You meet the PenCom requirements for the RSA equity contribution scheme.'
        : 'Your current RSA balance does not meet the minimum threshold set by your PFA.',
    };

  } catch (error: any) {
    console.error('[LEAD ROUTING ERROR]', error?.stack || error);
    return {
      success: false,
      message: error?.message || 'An unexpected error occurred while processing your lead.',
    };
  }
}

export async function trackLeadStatus(phoneOrAccount: string): Promise<TrackStatusResponse> {
  try {
    const rawInput = phoneOrAccount.trim();
    if (!rawInput) {
      return { found: false, status: null, description: null, step: null, total_steps: 4 };
    }

    const digitsOnly = rawInput.replace(/[^0-9]/g, '');

    // Search in database by phone number or ID
    const lead = await prisma.lead.findFirst({
      where: {
        OR: [
          { phone: { contains: rawInput } },
          ...(digitsOnly ? [{ phone: { contains: digitsOnly } }] : []),
          { id: rawInput }
        ]
      },
      include: {
        branch: true,
        pfa: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    if (lead) {
      const isNew = lead.status === 'new';
      return {
        found: true,
        status: isNew ? 'Verification & PFA Review' : lead.status.toUpperCase(),
        description: `Application for ${lead.full_name} (${lead.pfa.name}) is currently undergoing verification by our ${lead.branch.name} regional advisory desk.`,
        step: isNew ? 2 : 3,
        total_steps: 4,
      };
    }

    return { found: false, status: null, description: null, step: null, total_steps: 4 };
  } catch (error) {
    console.error('[TRACK LEAD ERROR]', error);
    return { found: false, status: null, description: null, step: null, total_steps: 4 };
  }
}

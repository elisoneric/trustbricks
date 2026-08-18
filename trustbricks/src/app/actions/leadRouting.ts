'use server';

import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

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
          email: 'csu@trustbrickspropertieslimited.com.ng',
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

    // 5. Send Notification Email — ALWAYS sent to primary central CSU address
    const centralCsuEmail = 'csu@trustbrickspropertieslimited.com.ng';
    const branchEmail = branch?.csuEmail || branch?.email;
    const ccList = branchEmail && branchEmail.toLowerCase() !== centralCsuEmail.toLowerCase() ? [branchEmail] : undefined;

    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.trim();
    const smtpHost = process.env.SMTP_HOST?.trim() || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpSecure = process.env.SMTP_SECURE !== undefined 
      ? process.env.SMTP_SECURE === 'true' 
      : smtpPort === 465;
    const smtpFrom = process.env.SMTP_FROM?.trim() || smtpUser || 'no-reply@trustbrickspropertieslimited.com.ng';

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            rejectUnauthorized: false,
          },
          connectionTimeout: 10000,
        });

        await transporter.sendMail({
          from: `"Trust Bricks Automations" <${smtpFrom}>`,
          to: centralCsuEmail,
          cc: ccList,
          replyTo: email || undefined,
          subject: `[New Lead] ${full_name} (${branch.name} Region)`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #f97316; padding: 16px 20px; color: #ffffff;">
                <h2 style="margin: 0; font-size: 18px;">New Mortgage Eligibility Lead</h2>
              </div>
              <div style="padding: 20px; color: #333333; line-height: 1.6;">
                <p>A new mortgage lead has just been submitted on the public website.</p>
                <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                  <tr style="border-bottom: 1px solid #eeeeee;">
                    <td style="padding: 8px 0; font-weight: bold; width: 40%;">Full Name:</td>
                    <td style="padding: 8px 0;">${full_name}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eeeeee;">
                    <td style="padding: 8px 0; font-weight: bold;">Phone Number:</td>
                    <td style="padding: 8px 0;"><a href="tel:${phone}">${phone}</a></td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eeeeee;">
                    <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                    <td style="padding: 8px 0;">${email ? `<a href="mailto:${email}">${email}</a>` : 'Not provided'}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eeeeee;">
                    <td style="padding: 8px 0; font-weight: bold;">Employer Type:</td>
                    <td style="padding: 8px 0;">${employer_type}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eeeeee;">
                    <td style="padding: 8px 0; font-weight: bold;">RSA Balance:</td>
                    <td style="padding: 8px 0; font-weight: bold; color: #0284c7;">?${rsa_balance.toLocaleString('en-NG')}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eeeeee;">
                    <td style="padding: 8px 0; font-weight: bold;">Years in Service:</td>
                    <td style="padding: 8px 0;">${years_in_work} years</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eeeeee;">
                    <td style="padding: 8px 0; font-weight: bold;">Years to Retire:</td>
                    <td style="padding: 8px 0;">${years_to_retire} years</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eeeeee;">
                    <td style="padding: 8px 0; font-weight: bold;">Eligible (PenCom):</td>
                    <td style="padding: 8px 0; font-weight: bold; color: ${is_eligible ? '#16a34a' : '#dc2626'};">${is_eligible ? 'YES' : 'NO'}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #eeeeee;">
                    <td style="padding: 8px 0; font-weight: bold;">Target Region / Branch:</td>
                    <td style="padding: 8px 0;">${branch.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">PFA:</td>
                    <td style="padding: 8px 0;">${pfaRule.name}</td>
                  </tr>
                </table>
                <div style="margin-top: 20px; padding: 12px; background-color: #f8fafc; border-radius: 6px; font-size: 12px; color: #64748b;">
                  Lead Reference ID: <code>${lead.id}</code><br />
                  Submitted: ${new Date().toUTCString()}
                </div>
              </div>
            </div>
          `,
        });
        console.log(`[ROUTING ENGINE] Lead notification successfully delivered to ${centralCsuEmail}${ccList ? ` (cc: ${ccList.join(', ')})` : ''}`);
      } catch (emailErr: any) {
        console.error('[ROUTING ENGINE ERROR] Failed to send email notification:', emailErr?.message || emailErr);
      }
    } else {
      console.warn('[ROUTING ENGINE WARNING] SMTP credentials (SMTP_USER & SMTP_PASS) not set in environment variables. Email notification skipped.');
    }

    console.log(`[ROUTING ENGINE] Lead ${lead.id} registered for ${branch.name}. Eligible: ${is_eligible}`);

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

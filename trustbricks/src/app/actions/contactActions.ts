'use server';

import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function submitContactForm(data: {
  name: string;
  email: string;
  office: string;
  officeBranchId?: string;
  message: string;
}) {
  try {
    if (!data.name || !data.email || !data.message) {
      return { success: false, message: 'Missing required fields' };
    }

    try {
      await prisma.contactMessage.create({
        data: {
          name: data.name,
          email: data.email,
          office_branch_id: data.officeBranchId || null,
          message: data.message,
        },
      });
    } catch (dbErr) {
      console.error('[CONTACT FORM] Failed to persist message:', dbErr);
    }

    const branch = data.officeBranchId
      ? await prisma.branch.findUnique({ where: { id: data.officeBranchId } })
      : null;
      
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
          from: `"Trust Bricks Contact Form" <${smtpFrom}>`,
          to: centralCsuEmail,
          cc: ccList,
          replyTo: data.email,
          subject: `[Contact Form] ${data.name} — ${data.office}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
              <div style="background-color: #1e293b; padding: 16px 20px; color: #ffffff;">
                <h2 style="margin: 0; font-size: 18px;">New Contact Message</h2>
              </div>
              <div style="padding: 20px; color: #333333; line-height: 1.6;">
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
                <p><strong>Target Office / Department:</strong> ${data.office}</p>
                <div style="margin: 16px 0; padding: 12px; background-color: #f8fafc; border-left: 4px solid #f97316; border-radius: 4px;">
                  <strong>Message:</strong><br />
                  <p style="white-space: pre-wrap; margin: 8px 0 0 0;">${data.message}</p>
                </div>
                <hr style="border: none; border-top: 1px solid #eeeeee; margin: 16px 0;" />
                <p style="font-size: 12px; color: #64748b; margin: 0;">Sent via Trust Bricks website contact portal.</p>
              </div>
            </div>
          `,
        });
        console.log(`[CONTACT FORM] Message delivered to ${centralCsuEmail}${ccList ? ` (cc: ${ccList.join(', ')})` : ''}`);
      } catch (err: any) {
        console.error('[CONTACT FORM ERROR] SMTP delivery failed:', err?.message || err);
      }
    } else {
      console.warn('[CONTACT FORM] SMTP not configured. Message logged to DB only.');
    }

    return { success: true };
  } catch (error) {
    console.error('[CONTACT FORM ERROR]', error);
    return { success: false, message: 'Failed to send message' };
  }
}

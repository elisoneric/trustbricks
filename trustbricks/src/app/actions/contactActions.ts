'use server';

import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

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

    // Persist first so the message is never silently lost even if email fails
    // or SMTP isn't configured — visible in the admin panel either way.
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
    const hqBranch = branch?.isHQ ? null : await prisma.branch.findFirst({ where: { isHQ: true } });
    const toEmail = branch?.csuEmail || branch?.email || 'customerservice@trustbrickspropertieslimited.com.ng';
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
        from: `"Trust Bricks Contact Form" <${process.env.SMTP_USER}>`,
        to: toEmail,
        cc: ccList,
        replyTo: data.email,
        subject: `Contact Form: ${data.name} — ${data.office}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Target Office:</strong> ${data.office}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message.replace(/\n/g, '<br />')}</p>
          <hr />
          <p><small>Sent from the Trust Bricks website contact form.</small></p>
        `,
      });
    } else {
      console.warn('[CONTACT FORM] SMTP not configured. Message logged only.');
      console.log('[CONTACT FORM]', JSON.stringify(data));
    }

    return { success: true };
  } catch (error) {
    console.error('[CONTACT FORM ERROR]', error);
    return { success: false, message: 'Failed to send message' };
  }
}

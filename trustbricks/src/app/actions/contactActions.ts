'use server';

import nodemailer from 'nodemailer';

export async function submitContactForm(data: {
  name: string;
  email: string;
  office: string;
  message: string;
}) {
  try {
    if (!data.name || !data.email || !data.message) {
      return { success: false, message: 'Missing required fields' };
    }

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
        to: 'customerservice@trustbrickspropertieslimited.com.ng',
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

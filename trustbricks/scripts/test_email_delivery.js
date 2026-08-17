const nodemailer = require('nodemailer');

async function testDelivery() {
  console.log('Testing SMTP dispatch to csu@trustbrickspropertieslimited.com.ng...');

  const host = process.env.SMTP_HOST || 'mail.trustbrickspropertieslimited.com.ng';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE !== undefined ? process.env.SMTP_SECURE === 'true' : port === 465;
  const user = process.env.SMTP_USER || 'noreply@trustbrickspropertieslimited.com.ng';
  const pass = process.env.SMTP_PASS;

  if (!pass) {
    console.error('Error: Set SMTP_PASS environment variable before running this test.');
    console.log('Usage:');
    console.log('  $env:SMTP_PASS="your_password"; node scripts/test_email_delivery.js');
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 10000,
  });

  try {
    console.log(`Connecting to ${host}:${port} (secure=${secure}) as ${user}...`);
    await transporter.verify();
    console.log('[OK] SMTP Connection verified successfully!');

    const info = await transporter.sendMail({
      from: `"Trust Bricks Automations" <${user}>`,
      to: 'csu@trustbrickspropertieslimited.com.ng',
      subject: '[Test] Trust Bricks Lead Routing Verification',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #f97316;">SMTP Test Successful</h2>
          <p>This is a verification test from the Trust Bricks lead routing system.</p>
          <p>All leads from the public site will now be received at <strong>csu@trustbrickspropertieslimited.com.ng</strong>.</p>
          <p><small>Timestamp: ${new Date().toUTCString()}</small></p>
        </div>
      `,
    });

    console.log('[OK] Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  } catch (err) {
    console.error('[FAIL] SMTP delivery failed:', err);
  }
}

testDelivery();

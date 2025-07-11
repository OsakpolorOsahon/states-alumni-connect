import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY environment variable not set. Email notifications will be disabled.");
}

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.log('Email would be sent:', params);
    return true; // Return true in development mode
  }

  try {
    await resend.emails.send({
      from: params.from,
      to: params.to,
      subject: params.subject,
      html: params.html || params.text,
    });
    return true;
  } catch (error) {
    console.error('Resend email error:', error);
    return false;
  }
}

export async function sendApprovalEmail(memberEmail: string, memberName: string, approved: boolean): Promise<boolean> {
  const subject = approved ? 'Welcome to SMMOWCUB!' : 'SMMOWCUB Application Update';
  const html = approved ? 
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2563eb;">Welcome to SMMOWCUB!</h2>
      <p>Dear ${memberName},</p>
      <p>Congratulations! Your membership application has been approved.</p>
      <p>You can now log in to access all member features and connect with fellow Statesmen.</p>
      <p><a href="${process.env.CLIENT_URL || 'http://localhost:5000'}/login" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to Your Account</a></p>
      <p>Best regards,<br>SMMOWCUB Team</p>
    </div>
    `
    :
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #dc2626;">Application Update</h2>
      <p>Dear ${memberName},</p>
      <p>Thank you for your interest in SMMOWCUB. After careful review, we regret to inform you that your membership application was not approved at this time.</p>
      <p>If you have questions about this decision, please contact us for more information.</p>
      <p>Best regards,<br>SMMOWCUB Team</p>
    </div>
    `;

  return sendEmail({
    to: memberEmail,
    from: 'SMMOWCUB <noreply@smmowcub.org>', // Replace with your verified sender
    subject,
    html
  });
}
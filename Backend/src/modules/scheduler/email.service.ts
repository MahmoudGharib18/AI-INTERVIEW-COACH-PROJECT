import { env } from '#/config/env.js';
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendSessionReminderEmail = async (
  toEmail: string,
  userName: string,
  sessionId: string
): Promise<void> => {
  const sessionUrl = `${env.CLIENT_URL}/sessions/${sessionId}`;

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: toEmail,
    subject: 'Your daily interview session is ready',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Hey ${userName},</h2>
        <p>Your daily interview session is ready. You have <strong>3 hours</strong> to start it before it's marked late.</p>
        <p>
          <a href="${sessionUrl}" style="display:inline-block; padding: 12px 24px; background:#111; color:#fff; text-decoration:none; border-radius:6px;">
            Start Session
          </a>
        </p>
        <p style="color:#666; font-size:14px;">Keep your streak alive.</p>
      </div>
    `,
  });
};
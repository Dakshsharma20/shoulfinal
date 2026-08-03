import nodemailer from "nodemailer";

let cachedTransporter: nodemailer.Transporter | null = null;

export function isEmailConfigured(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

/**
 * Works with any SMTP provider — Gmail (with an app password), SendGrid,
 * AWS SES, Mailgun, Postmark, etc. — rather than locking the project to
 * one vendor's proprietary API. Point SMTP_HOST/PORT at whichever
 * provider you choose; see .env.local.example for the exact variables.
 */
function getTransporter(): nodemailer.Transporter {
  if (!isEmailConfigured()) {
    throw new Error(
      "Email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD in .env.local."
    );
  }
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return cachedTransporter;
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ sent: boolean; error?: string }> {
  if (!isEmailConfigured()) {
    console.warn(`Email not configured — skipped sending "${subject}" to ${to}`);
    return { sent: false, error: "Email not configured" };
  }
  try {
    const transporter = getTransporter();
    const fromName = process.env.EMAIL_FROM_NAME || "Soul Hues";
    const fromAddress = process.env.SMTP_USER;
    await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to,
      subject,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error(`Failed to send email "${subject}" to ${to}:`, err);
    return { sent: false, error: (err as Error).message };
  }
}

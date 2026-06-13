import { Resend } from "resend";

const FROM_ADDRESS = "Tundemy <notifications@tundemy.com>";

function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

async function sendEmail(to: string, subject: string, html: string) {
  const resend = getClient();
  if (!resend) {
    console.warn(`RESEND_API_KEY not set — skipping email "${subject}" to ${to}`);
    return;
  }
  try {
    await resend.emails.send({ from: FROM_ADDRESS, to, subject, html });
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}

function wrapper(title: string, bodyHtml: string): string {
  return `
    <div style="font-family: Inter, Arial, sans-serif; background-color: #f9fafb; padding: 32px;">
      <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="display: flex; height: 6px;">
          <div style="flex: 1; background: #000000;"></div>
          <div style="flex: 1; background: #bb0000;"></div>
          <div style="flex: 1; background: #2d8a4e;"></div>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 20px; font-weight: 800; color: #0f1f3d; margin: 0 0 24px;">
            Tund<span style="color: #2d8a4e;">emy</span>
          </p>
          <h1 style="font-size: 18px; font-weight: 800; color: #0f1f3d; margin: 0 0 12px;">${title}</h1>
          ${bodyHtml}
          <p style="font-size: 12px; color: #9ca3af; margin: 32px 0 0;">
            Tundemy — Africa's AI Skills Platform
          </p>
        </div>
      </div>
    </div>
  `;
}

export async function sendEnrollmentEmail(to: string, courseTitle: string, courseSlug: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tundemy.com";
  const html = wrapper(
    "You're enrolled!",
    `
      <p style="font-size: 14px; color: #374151; line-height: 1.6; margin: 0 0 16px;">
        Your payment was successful and you now have full access to <strong>${courseTitle}</strong>.
      </p>
      <a href="${appUrl}/courses/${courseSlug}/learn"
        style="display: inline-block; background: #2d8a4e; color: #ffffff; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 24px; border-radius: 12px;">
        Start Learning
      </a>
    `
  );
  await sendEmail(to, `Welcome to ${courseTitle} — Tundemy`, html);
}

export async function sendCertificateEmail(to: string, courseTitle: string, courseSlug: string, certId: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tundemy.com";
  const html = wrapper(
    "Congratulations — you earned a certificate!",
    `
      <p style="font-size: 14px; color: #374151; line-height: 1.6; margin: 0 0 16px;">
        You've completed <strong>${courseTitle}</strong> and your certificate of completion is ready.
        Certificate ID: <strong>${certId}</strong>
      </p>
      <a href="${appUrl}/dashboard/certificates/${courseSlug}"
        style="display: inline-block; background: #2d8a4e; color: #ffffff; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 24px; border-radius: 12px;">
        View Certificate
      </a>
    `
  );
  await sendEmail(to, `Your ${courseTitle} certificate is ready — Tundemy`, html);
}

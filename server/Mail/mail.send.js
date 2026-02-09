import "dotenv/config";
import nodemailer from "nodemailer";

/* ---------------- Transporter ---------------- */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/* ---------------- Generic Sender ---------------- */
export async function sendEmail({ to, subject, text, html }) {
  try {
    if (!to) throw new Error("Missing recipient email");
    if (!subject) throw new Error("Missing subject");
    if (!text && !html) throw new Error("Missing email content");

    const mailResponse = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent:", mailResponse.messageId);
    return mailResponse;
  } catch (error) {
    console.error("Mail error:", error);
    throw error;
  }
}

/* ---------------- Email Verification ---------------- */
export const sendVerificationEmail = async ({
  email,
  name = "",
  verifyLink,
}) => {
  return sendEmail({
    to: email,
    subject: "Verify your email - SMARTSCHOLAR",
    text: `Hello ${name || "there"},

Thanks for registering in SMARTSCHOLAR.

Please verify your email using the link below:
${verifyLink}

This link expires in 24 hours.
`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6">
        <h2>Hello ${name || "there"} 👋</h2>
        <p>Thanks for registering in <b>SMARTSCHOLAR</b>.</p>
        <p>Please verify your email by clicking the button below:</p>

        <p>
          <a href="${verifyLink}"
             style="display:inline-block;padding:10px 16px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">
            Verify Email
          </a>
        </p>

        <p>If the button doesn't work, copy and paste this link:</p>
        <p>${verifyLink}</p>

        <p><small>This link expires in 24 hours.</small></p>
      </div>
    `,
  });
};

/* ---------------- Event Application Approved ---------------- */
export const sendApplicationApprovedEmail = async ({
  email,
  studentName = "",
  eventName = "",
  collegeName = "",
  eventDate = "",
}) => {
  return sendEmail({
    to: email,
    subject: `Event Application Approved - ${eventName}`,
    text: `Hello ${studentName || "there"},

Great news! Your application for "${eventName}" has been approved by ${collegeName || "the college"}.

${eventDate ? `Event Date: ${eventDate}` : ""}

We look forward to seeing you at the event!

Best regards,
SMARTSCHOLAR Team
`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <div style="background: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">✅ Application Approved</h2>
        </div>
        
        <div style="padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hello <strong>${studentName || "there"}</strong>,</p>
          
          <p>Great news! Your application for <strong>"${eventName}"</strong> has been approved by <strong>${collegeName || "the college"}</strong>.</p>
          
          ${eventDate ? `<p style="background: white; padding: 12px; border-left: 4px solid #10b981; margin: 16px 0;"><strong>Event Date:</strong> ${eventDate}</p>` : ""}
          
          <p>We look forward to seeing you at the event!</p>
          
          <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">
            Best regards,<br>
            <strong>SMARTSCHOLAR Team</strong>
          </p>
        </div>
      </div>
    `,
  });
};

/* ---------------- Event Application Rejected ---------------- */
export const sendApplicationRejectedEmail = async ({
  email,
  studentName = "",
  eventName = "",
  collegeName = "",
  rejectionReason = "",
}) => {
  return sendEmail({
    to: email,
    subject: `Event Application Update - ${eventName}`,
    text: `Hello ${studentName || "there"},

We regret to inform you that your application for "${eventName}" has not been approved by ${collegeName || "the college"}.

${rejectionReason ? `Reason: ${rejectionReason}` : ""}

You can explore other events and apply again. Don't be discouraged – there are many more opportunities available!

Best regards,
SMARTSCHOLAR Team
`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <div style="background: #ef4444; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0;">Application Update</h2>
        </div>
        
        <div style="padding: 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Hello <strong>${studentName || "there"}</strong>,</p>
          
          <p>We regret to inform you that your application for <strong>"${eventName}"</strong> has not been approved by <strong>${collegeName || "the college"}</strong>.</p>
          
          ${rejectionReason ? `
          <div style="background: #fee2e2; padding: 12px; border-left: 4px solid #ef4444; margin: 16px 0;">
            <p style="margin: 0;"><strong>Reason:</strong></p>
            <p style="margin: 8px 0 0 0;">${rejectionReason}</p>
          </div>
          ` : ""}
          
          <p>You can explore other events and apply again. Don't be discouraged – there are many more opportunities available!</p>
          
          <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">
            Best regards,<br>
            <strong>SMARTSCHOLAR Team</strong>
          </p>
        </div>
      </div>
    `,
  });
};
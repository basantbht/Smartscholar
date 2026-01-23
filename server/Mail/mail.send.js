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

        <p>If the button doesn’t work, copy and paste this link:</p>
        <p>${verifyLink}</p>

        <p><small>This link expires in 24 hours.</small></p>
      </div>
    `,
  });
};
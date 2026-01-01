import nodemailer from "nodemailer"

export const sendMail = async ({ email }) => {
  console.log(email)
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Verify Your Email.",
      // text: `Your verification code is ${verifyToken}.`,
      text: `Your account is created.`,
    }


    const mailResponse = await transporter.sendMail(mailOptions);

    console.log("Email Sent");
    return mailResponse;

  } catch (e) {
    console.error("Mail error:", error);
    throw new Error("Failed to send email");
  }
}
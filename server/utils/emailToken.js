// utils/emailToken.js
import jwt from "jsonwebtoken";

export const createEmailVerifyToken = (userId) => {
  console.log(process.env.EMAIL_VERIFY_SECRET)
  return jwt.sign(
    { type: "email_verify", userId },
    process.env.EMAIL_VERIFY_SECRET,
    { expiresIn: "24h" }
  );
};

export const verifyEmailVerifyToken = (token) => {
  return jwt.verify(token, process.env.EMAIL_VERIFY_SECRET);
};

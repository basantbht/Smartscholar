import jwt from "jsonwebtoken";

/**
 * Create a password reset token (valid for 15 minutes)
 */
export const createPasswordResetToken = (userId) => {
  return jwt.sign(
    { type: "password_reset", userId },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

/**
 * Verify password reset token
 */
export const verifyPasswordResetToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== "password_reset") {
      throw new Error("Invalid token type");
    }
    
    return decoded;
  } catch (error) {
    throw error;
  }
};
import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.js";
import { sendVerificationEmail, sendPasswordResetEmail } from "../Mail/mail.send.js";
import { createEmailVerifyToken, verifyEmailVerifyToken } from "../utils/emailToken.js";
import { createPasswordResetToken, verifyPasswordResetToken } from "../utils/passwordResetToken.js";
import { generateToken } from "../utils/generateToken.js";

const emailRegex = /^\S+@\S+\.\S+$/;

// register user
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, confirmPassword, role } = req.body;

  // ✅ validations (like your old project)
  if (!name || !email || !password || !confirmPassword) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  if (!emailRegex.test(email)) {
    return next(new ErrorHandler("Invalid email format.", 400));
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password and Confirm password should be same.", 400));
  }

  // ✅ safe role
  const allowedRoles = ["Student", "College"];
  const safeRole = allowedRoles.includes(role) ? role : "Student";

  const exists = await User.findOne({ email });
  if (exists) {
    return next(new ErrorHandler("Email is already registered.", 400));
  }

  // ✅ create user unverified
  const user = await User.create({
    name,
    email,
    password, // will hash in model pre-save
    role: safeRole,
    isVerified: false,
  });

  // ✅ send verification email
  const token = createEmailVerifyToken(user._id);
  const verifyLink = `${process.env.BACKEND_URL}/api/v1/auth/verify-email?token=${token}`;

  await sendVerificationEmail({
    email: user.email,
    name: user.name,
    verifyLink,
  });

  res.status(201).json({
    success: true,
    message: "Registered successfully. Please verify your email.",
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    },
  });
});

// login user
export const login = asyncHandler(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return next(new ErrorHandler("Email, password, role are required", 400));
  }

  if (!emailRegex.test(email)) {
    return next(new ErrorHandler("Invalid email format.", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid credentials", 401));

  if (user.role !== role) {
    return next(new ErrorHandler("Role mismatch", 401));
  }

  if (!user.isVerified) {
    return next(new ErrorHandler("User not verified. Please check your email.", 403));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return next(new ErrorHandler("Invalid credentials", 401));

  generateToken(user, 200, "Logged in successfully", res);
});

// logout
export const logout = asyncHandler(async (req, res) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out",
    });
});

// get current user
export const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

// verify your email
export const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.query;
  if (!token) return next(new ErrorHandler("Missing token", 400));

  let payload;
  try {
    payload = verifyEmailVerifyToken(token);
  } catch (e) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?verified=false&reason=expired`);
  }

  if (payload?.type !== "email_verify" || !payload?.userId) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?verified=false&reason=invalid`);
  }

  const user = await User.findById(payload.userId);
  if (!user) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?verified=false&reason=notfound`);
  }

  if (user.isVerified) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?verified=already`);
  }

  user.isVerified = true;
  await user.save();

  return res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
});

// ✅ FORGOT PASSWORD - Send reset email
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Email is required", 400));
  }

  if (!emailRegex.test(email)) {
    return next(new ErrorHandler("Invalid email format", 400));
  }

  const user = await User.findOne({ email });
  
  // ✅ Security: Don't reveal if user exists or not
  // Always return success message to prevent email enumeration
  if (!user) {
    return res.status(200).json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  }

  // ✅ Generate reset token
  const resetToken = createPasswordResetToken(user._id);
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  // ✅ Send email
  try {
    await sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      resetLink,
    });

    res.status(200).json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return next(new ErrorHandler("Failed to send reset email. Please try again later.", 500));
  }
});

// ✅ RESET PASSWORD - Verify token and update password
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token, newPassword, confirmPassword } = req.body;

  if (!token || !newPassword || !confirmPassword) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  if (newPassword.length < 6) {
    return next(new ErrorHandler("Password must be at least 6 characters long", 400));
  }

  // ✅ Verify token
  let payload;
  try {
    payload = verifyPasswordResetToken(token);
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired reset token", 400));
  }

  if (!payload?.userId) {
    return next(new ErrorHandler("Invalid reset token", 400));
  }

  // ✅ Find user and update password
  const user = await User.findById(payload.userId);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // ✅ Update password (will be hashed by model pre-save hook)
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully. You can now login with your new password.",
  });
});
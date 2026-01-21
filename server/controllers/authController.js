import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.js";
import { generateToken } from "../utils/generateToken.js";

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Name, email, password are required", 400));
  }

  const allowedRoles = ["Student", "College"];
  const safeRole = allowedRoles.includes(role) ? role : "Student";

  const exists = await User.findOne({ email });
  if (exists) {
    return next(new ErrorHandler("User already exists", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    role: safeRole,
  });

  res.status(201).json({
    success: true,
    message: "Registered successfully. Please login.",
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

/**
 * LOGIN
 * ✅ Token generated here
 */
export const login = asyncHandler(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return next(
      new ErrorHandler("Email, password, role are required", 400)
    );
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  if (user.role !== role) {
    return next(new ErrorHandler("Role mismatch", 401));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  generateToken(user, 200, "Logged in successfully", res);
});

/**
 * LOGOUT
 */
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

/**
 * GET CURRENT USER
 */
export const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

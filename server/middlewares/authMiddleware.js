import jwt from "jsonwebtoken";
import ErrorHandler from "./error.js";
import { User } from "../models/user.js";
import { asyncHandler } from "./asyncHandler.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) return next(new ErrorHandler("Not authenticated", 401));

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password");
  if (!user) return next(new ErrorHandler("User not found", 401));

  req.user = user;
  next();
});

export const isAuthorized = (...roles) => (req, res, next) => {
  const role = req.user?.role;
  if (!role || !roles.includes(role)) {
    return next(new ErrorHandler("Not authorized", 403));
  }
  next();
};

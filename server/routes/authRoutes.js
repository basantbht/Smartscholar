import express from "express";
import { 
  register, 
  login, 
  logout, 
  me, 
  verifyEmail,
  forgotPassword,
  resetPassword 
} from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuthenticated, me);
router.post("/logout", isAuthenticated, logout);
router.get("/verify-email", verifyEmail);

// ✅ Password reset routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
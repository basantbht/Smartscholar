import express from "express";
import {
  scholarshipChat,
  scholarshipHealth,
  clearSession,
} from "../controllers/chatController.js";

// Optional: protect routes with auth middleware
// import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// POST /api/v1/scholarship/chat
// Body: { question: string, sessionId?: string }
router.post("/chat", scholarshipChat);

// GET /api/v1/scholarship/health
router.get("/health", scholarshipHealth);

// DELETE /api/v1/scholarship/session/:sessionId
router.delete("/session/:sessionId", clearSession);

export default router;
import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  getMyNotifications,
  markNotificationRead,
  markAllRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", isAuthenticated, getMyNotifications);
router.put("/:id/read", isAuthenticated, markNotificationRead);
router.put("/read-all", isAuthenticated, markAllRead);
router.delete("/:id", isAuthenticated, deleteNotification);

export default router;

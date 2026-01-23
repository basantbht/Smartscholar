import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import {
  getPendingCollegeVerifications,
  getCollegeVerification,
  reviewCollegeVerification,
} from "../controllers/adminController.js";

const router = express.Router();

router.get(
  "/college-verifications/pending",
  isAuthenticated,
  isAuthorized("Admin"),
  getPendingCollegeVerifications
);

router.get(
  "/college-verifications/:collegeId",
  isAuthenticated,
  isAuthorized("Admin"),
  getCollegeVerification
);

router.put(
  "/college-verifications/:collegeId/review",
  isAuthenticated,
  isAuthorized("Admin"),
  reviewCollegeVerification
);

export default router;

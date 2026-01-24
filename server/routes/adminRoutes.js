import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import {
  getPendingCollegeVerifications,
  getCollegeVerification,
  reviewCollegeVerification,
  updateCollegeVerification,
   getAllColleges,
  getCollegeById,
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


// Get all colleges
router.get("/colleges", isAuthenticated, isAuthorized("Admin","Student"), getAllColleges);

// Get single college
router.get("/colleges/:id", isAuthenticated, isAuthorized("Admin"), getCollegeById);

// Update college verification
router.put(
  "/colleges/:id/verification",
  isAuthenticated,
  isAuthorized("Admin"),
  updateCollegeVerification
);

export default router;

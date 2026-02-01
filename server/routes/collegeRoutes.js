import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { uploadImage, uploadDocument, handleUploadError } from "../middlewares/upload.js";
import {
  createCollegeProfile,
  updateCollegeProfile,
  getMyProfile,
  submitVerificationDocs,
  getMyVerificationStatus,
  getMyApplications,
  reviewApplication,
  getSessionRequests,
  updateSessionRequest,
} from "../controllers/collegeController.js";

import {
  createScholarship,
  getMyScholarships,
  getScholarshipById,
  updateScholarship,
  deleteScholarship,
  getScholarshipsByCollegeId,
  getAllActiveScholarships,
  getScholarshipStats,
  toggleScholarshipStatus,
} from "../controllers/scholarshipController.js";

const router = express.Router();

// Profile routes - use uploadImage for profile pictures
router.post(
  "/profile",
  isAuthenticated,
  isAuthorized("College"),
  uploadImage.single("image"),
  handleUploadError,
  createCollegeProfile
);

router.put(
  "/profile", 
  isAuthenticated, 
  isAuthorized("College"), 
  uploadImage.single("image"),
  handleUploadError, 
  updateCollegeProfile
);

router.get(
  "/profile",
  isAuthenticated,
  isAuthorized("College"),
  getMyProfile
);

// Verification routes - use uploadDocument for PDFs and documents
router.get(
  "/verification", 
  isAuthenticated, 
  isAuthorized("College"), 
  getMyVerificationStatus
);

router.post(
  "/verification/submit", 
  isAuthenticated, 
  isAuthorized("College"), 
  uploadDocument.array("docs", 10),
  handleUploadError, 
  submitVerificationDocs
);

// Application routes
router.get(
  "/applications", 
  isAuthenticated, 
  isAuthorized("College"), 
  getMyApplications
);

router.put(
  "/applications/:applicationId/review", 
  isAuthenticated, 
  isAuthorized("College"), 
  reviewApplication
);

// Session routes
router.get(
  "/sessions", 
  isAuthenticated, 
  isAuthorized("College"), 
  getSessionRequests
);

router.put(
  "/sessions/:sessionId", 
  isAuthenticated, 
  isAuthorized("College"), 
  updateSessionRequest
);

// Scholarship routes (College authenticated)
router.post(
  "/scholarships",
  isAuthenticated,
  isAuthorized("College"),
  createScholarship
);

router.get(
  "/scholarships",
  isAuthenticated,
  isAuthorized("College"),
  getMyScholarships
);

router.get(
  "/scholarships/stats",
  isAuthenticated,
  isAuthorized("College"),
  getScholarshipStats
);

router.get(
  "/scholarships/:scholarshipId",
  isAuthenticated,
  isAuthorized("College","Student"),
  getScholarshipById
);

router.put(
  "/scholarships/:scholarshipId",
  isAuthenticated,
  isAuthorized("College"),
  updateScholarship
);

router.patch(
  "/scholarships/:scholarshipId/toggle-status",
  isAuthenticated,
  isAuthorized("College"),
  toggleScholarshipStatus
);

router.delete(
  "/scholarships/:scholarshipId",
  isAuthenticated,
  isAuthorized("College"),
  deleteScholarship
);

// Public routes (for students/visitors)
router.get("/colleges/:collegeId/scholarships", getScholarshipsByCollegeId);
router.get("/scholarships/public/all", getAllActiveScholarships);

export default router;
import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { uploadImage, uploadDocument, handleUploadError } from "../middlewares/upload.js";
import {
  createCollegeProfile,
  updateCollegeProfile,
  getMyProfile,
  submitVerificationDocs,
  getMyVerificationStatus,
  createPost,
  getMyPosts,
  getMyApplications,
  reviewApplication,
  getSessionRequests,
  updateSessionRequest,
} from "../controllers/collegeController.js";

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
  uploadDocument.array("docs", 10),  // ✅ Changed from uploadDocuments to uploadDocument
  handleUploadError, 
  submitVerificationDocs
);

// Post routes
router.post(
  "/posts", 
  isAuthenticated, 
  isAuthorized("College"), 
  createPost
);

router.get(
  "/posts", 
  isAuthenticated, 
  isAuthorized("College"), 
  getMyPosts
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

export default router;
import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { upload, handleUploadError } from "../middlewares/upload.js";
import {
  updateCollegeProfile,
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

router.put(
  "/profile",
  isAuthenticated,
  isAuthorized("College"),
  updateCollegeProfile
);

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
  upload.array("docs", 10),
  handleUploadError,
  submitVerificationDocs
);

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

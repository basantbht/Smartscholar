import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { uploadImage, handleUploadError, uploadDocument } from "../middlewares/upload.js";
import {
  listPublicPosts,
  getPost,
  applyToPost,
  listMyApplications,
  requestSession,
  listMySessions,
  getAllColleges,
  getCollegeById,
} from "../controllers/studentController.js";

const router = express.Router();

// Public post listing
router.get(
  "/posts",
  isAuthenticated,
  isAuthorized("Student"),
  listPublicPosts
);

router.get(
  "/posts/:postId",
  isAuthenticated,
  isAuthorized("Student"),
  getPost
);

router.post(
  "/posts/:postId/apply",
  isAuthenticated,
  isAuthorized("Student"),
  uploadDocument.array("docs", 10),
  handleUploadError,
  applyToPost
);

router.get(
  "/applications",
  isAuthenticated,
  isAuthorized("Student"),
  listMyApplications
);

router.post(
  "/sessions",
  isAuthenticated,
  isAuthorized("Student"),
  requestSession
);

router.get(
  "/sessions",
  isAuthenticated,
  isAuthorized("Student"),
  listMySessions
);

// College routes
router.get(
  "/colleges",
  isAuthenticated,
  isAuthorized("Student"),
  getAllColleges
);

router.get(
  "/colleges/:collegeId",
  isAuthenticated,
  isAuthorized("Student"),
  getCollegeById
);

export default router;
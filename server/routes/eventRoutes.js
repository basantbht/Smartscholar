// routes/collegeEventRoutes.js
import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { uploadEventImages, handleUploadError } from "../middlewares/upload.js";
import {
  createEvent,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  toggleEventStatus,
  getAllCollegesEvents,
  applyForEvent,
  getAllEventApplications,
  getApplicationById,
  approveApplication,
  rejectApplication,
  updatePaymentStatus,
  getMyStudentApplications,
} from "../controllers/eventController.js";

const router = express.Router();


//for students routes
router.get("/all", getAllCollegesEvents);
router.get("/my-applications", isAuthenticated, isAuthorized("Student"), getMyStudentApplications); // NEW: Get all my applications

// Event CRUD
router.post(
  "/",
  isAuthenticated,
  isAuthorized("College"),
  uploadEventImages,
  handleUploadError,
  createEvent
);

router.get(
  "/",
  isAuthenticated,
  isAuthorized("College", "Student"),
  getMyEvents
);

router.get(
  "/:eventId",
  isAuthenticated,
  isAuthorized("College","Student"),
  getEventById
);

router.put(
  "/:eventId",
  isAuthenticated,
  isAuthorized("College"),
  uploadEventImages,
  handleUploadError,
  updateEvent
);

router.delete(
  "/:eventId",
  isAuthenticated,
  isAuthorized("College"),
  deleteEvent
);

// Event Status
router.patch(
  "/:eventId/status",
  isAuthenticated,
  isAuthorized("College"),
  toggleEventStatus
);

// College only
// Get all applications for a specific event
router.get(
  "/:eventId/applications",
  isAuthenticated,
  isAuthorized("College"),
  getAllEventApplications
);

// Get single application details
router.get(
  "/applications/:applicationId",
  isAuthenticated,
  isAuthorized("College"),
  getApplicationById
);

// Approve application
router.patch(
  "/applications/:applicationId/approve",
  isAuthenticated,
  isAuthorized("College"),
  approveApplication
);

// Reject application
router.patch(
  "/applications/:applicationId/reject",
  isAuthenticated,
  isAuthorized("College"),
  rejectApplication
);

// Update payment status
router.patch(
  "/applications/:applicationId/payment",
  isAuthenticated,
  isAuthorized("College"),
  updatePaymentStatus
);





// apply for events
router.post(
  "/:eventId/apply",
  isAuthenticated,
  isAuthorized("Student"),
  applyForEvent
);



export default router;
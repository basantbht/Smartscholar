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
  getEventRegistrations,
  reviewEventRegistration,
  toggleEventStatus,
} from "../controllers/eventController.js";

const router = express.Router();

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

// Event Registrations
router.get(
  "/:eventId/registrations",
  isAuthenticated,
  isAuthorized("College"),
  getEventRegistrations
);

router.put(
  "/registrations/:registrationId/review",
  isAuthenticated,
  isAuthorized("College"),
  reviewEventRegistration
);

export default router;
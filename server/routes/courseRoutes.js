import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import {
  createCourse,
  getMyCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByCollegeId,
  getAllCollegesCourses,
  
} from "../controllers/courseController.js";

const router = express.Router();

//for students
router.get("/all", getAllCollegesCourses);

// Course routes
router.post(
  "/",
  isAuthenticated,
  isAuthorized("College"),
  createCourse
);

router.get(
  "/",
  isAuthenticated,
  isAuthorized("College"),
  getMyCourses
);

router.get(
  "/:courseId",
  isAuthenticated,
  isAuthorized("College"),
  getCourseById
);

router.put(
  "/:courseId",
  isAuthenticated,
  isAuthorized("College"),
  updateCourse
);

router.delete(
  "/:courseId",
  isAuthenticated,
  isAuthorized("College"),
  deleteCourse
);

router.get("/colleges/:collegeId/courses", getCoursesByCollegeId);

export default router;
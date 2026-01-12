import express from "express";
import {
  createScholarship,
  getAllScholarships,
  updateScholarship,
  deleteScholarship,
} from "../controllers/scholarship.controller.js";

const router = express.Router();

// CREATE
router.post("/", createScholarship);

// READ
router.get("/", getAllScholarships);

// UPDATE
router.put("/:id", updateScholarship);

// DELETE
router.delete("/:id", deleteScholarship);

export default router;

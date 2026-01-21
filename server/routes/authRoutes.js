import express from "express";
import { register, login, logout, me } from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuthenticated, me);
router.post("/logout", isAuthenticated, logout);

export default router;

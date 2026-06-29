import { Router } from "express";

import {
  login,
  logout,
  refreshToken,
  getMe,
} from "../controllers/auth.controller";

import { protect } from "@/middlewares/auth.middleware";

const router = Router();

// Public Routes
router.post("/login", login);
router.post("/refresh-token", refreshToken);

// Protected Routes
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;
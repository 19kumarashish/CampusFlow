import { Router } from "express";

import { protect } from "@/middlewares/auth.middleware";

import {
    getMe,
    login,
    logout,
    refreshToken,
} from "../controllers/auth.controller";

const router = Router();

// Public Routes
router.post("/login", login);
router.post("/refresh-token", refreshToken);

// Protected Routes
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;
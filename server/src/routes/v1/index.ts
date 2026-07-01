import { Router } from "express";

import authRoutes from "@/modules/auth/routes/auth.routes";
import userRoutes from "@/modules/users/routes/user.routes";

const router = Router();

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

export default router;
import { Router } from "express";

import {
  createUser,
  getUsers,
} from "../controllers/user.controller";

import { protect } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/shared/enums/user-role.enum";

const router = Router();

router.post(
  "/",
  protect,
  authorize(UserRole.ADMIN),
  createUser,
);

router.get(
  "/",
  protect,
  authorize(UserRole.ADMIN),
  getUsers,
);

export default router;
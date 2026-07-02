import { Router } from "express";

import {
  changePassword,
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
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

// Must come before "/:id"
router.patch(
  "/change-password",
  protect,
  changePassword,
);

router.get(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  getUserById,
);

router.patch(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  updateUser,
);

router.delete(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  deleteUser,
);

export default router;
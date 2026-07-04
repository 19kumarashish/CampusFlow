import { Router } from "express";

import { protect } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/shared/enums/user-role.enum";
import { validateObjectId } from "@/shared/middlewares/validate-object-id.middleware";

import {
  changePassword,
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateProfile,
  updateUser,
} from "../controllers/user.controller";

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

// Must come before "/:id"
router.patch(
  "/profile",
  protect,
  updateProfile,
);

router.get(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  validateObjectId(),
  getUserById,
);

router.patch(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  validateObjectId(),
  updateUser,
);

router.delete(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  validateObjectId(),
  deleteUser,
);

export default router;
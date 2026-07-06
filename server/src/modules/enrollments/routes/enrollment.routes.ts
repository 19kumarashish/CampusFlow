import { Router } from "express";

import { protect } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/shared/enums/user-role.enum";
import { validateObjectId } from "@/shared/middlewares/validate-object-id.middleware";

import {
  createEnrollment,
  deleteEnrollment,
  getEnrollmentById,
  getEnrollments,
  updateEnrollment,
} from "../controllers/enrollment.controller";

const router = Router();

router.post(
  "/",
  protect,
  authorize(UserRole.ADMIN),
  createEnrollment,
);

router.get(
  "/",
  protect,
  getEnrollments,
);

router.get(
  "/:id",
  protect,
  validateObjectId(),
  getEnrollmentById,
);

router.patch(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  validateObjectId(),
  updateEnrollment,
);

router.delete(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  validateObjectId(),
  deleteEnrollment,
);

export default router;
import { Router } from "express";

import { protect } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/shared/enums/user-role.enum";
import { validateObjectId } from "@/shared/middlewares/validate-object-id.middleware";

import {
  createAttendance,
  deleteAttendance,
  getAttendance,
  getAttendanceById,
  getAttendancePercentage,
  updateAttendance,
} from "../controllers/attendance.controller";

const router = Router();

router.post(
  "/",
  protect,
  authorize(
    UserRole.ADMIN,
    UserRole.TEACHER,
  ),
  createAttendance,
);

router.get(
  "/",
  protect,
  getAttendance,
);

router.get(
  "/:id",
  protect,
  validateObjectId(),
  getAttendanceById,
);

router.patch(
  "/:id",
  protect,
  authorize(
    UserRole.ADMIN,
    UserRole.TEACHER,
  ),
  validateObjectId(),
  updateAttendance,
);

router.delete(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  validateObjectId(),
  deleteAttendance,
);

router.get(
  "/summary/:enrollmentId",
  protect,
  validateObjectId("enrollmentId"),
  getAttendancePercentage,
);

export default router;
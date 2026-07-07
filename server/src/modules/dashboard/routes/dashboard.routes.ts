import { Router } from "express";

import { protect } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/shared/enums/user-role.enum";
import { validateObjectId } from "@/shared/middlewares/validate-object-id.middleware";

import {
  getAdminDashboard,
  getDashboard,
  getFacultyDashboard,
  getStudentDashboard,
} from "../controllers/dashboard.controller";

const router = Router();

router.get(
  "/",
  protect,
  getDashboard,
);

router.get(
  "/admin",
  protect,
  authorize(UserRole.ADMIN),
  getAdminDashboard,
);

router.get(
  "/faculty/:facultyId",
  protect,
  authorize(
    UserRole.ADMIN,
    UserRole.TEACHER,
  ),
  validateObjectId("facultyId"),
  getFacultyDashboard,
);

router.get(
  "/student/:enrollmentId",
  protect,
  authorize(
    UserRole.ADMIN,
    UserRole.STUDENT,
  ),
  validateObjectId("enrollmentId"),
  getStudentDashboard,
);

export default router;
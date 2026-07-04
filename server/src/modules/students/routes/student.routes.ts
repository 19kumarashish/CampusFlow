import { Router } from "express";

import { protect } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/shared/enums/user-role.enum";
import { validateObjectId } from "@/shared/middlewares/validate-object-id.middleware";

import {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudents,
  updateStudent,
} from "../controllers/student.controller";

const router = Router();

router.post(
  "/",
  protect,
  authorize(UserRole.ADMIN),
  createStudent,
);

router.get(
  "/",
  protect,
  getStudents,
);

router.get(
  "/:id",
  protect,
  validateObjectId(),
  getStudentById,
);

router.patch(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  validateObjectId(),
  updateStudent,
);

router.delete(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  validateObjectId(),
  deleteStudent,
);

export default router;
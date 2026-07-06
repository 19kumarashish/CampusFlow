import { Router } from "express";

import { protect } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/shared/enums/user-role.enum";
import { validateObjectId } from "@/shared/middlewares/validate-object-id.middleware";

import {
  createAssignment,
  createSubmission,
  deleteAssignment,
  getAssignmentById,
  getAssignments,
  getSubmissions,
  gradeSubmission,
  updateAssignment,
} from "../controllers/assignment.controller";


const router = Router();

router.post(
  "/",
  protect,
  authorize(UserRole.TEACHER, UserRole.ADMIN),
  createAssignment,
);

router.get(
  "/",
  protect,
  getAssignments,
);

router.get(
  "/:id",
  protect,
  validateObjectId(),
  getAssignmentById,
);

router.patch(
  "/:id",
  protect,
  authorize(UserRole.TEACHER, UserRole.ADMIN),
  validateObjectId(),
  updateAssignment,
);

router.delete(
  "/:id",
  protect,
  authorize(UserRole.TEACHER, UserRole.ADMIN),
  validateObjectId(),
  deleteAssignment,
);

router.post(
  "/submit",
  protect,
  authorize(UserRole.STUDENT),
  createSubmission,
);

router.get(
  "/submissions",
  protect,
  getSubmissions,
);

router.patch(
  "/submissions/:id/grade",
  protect,
  authorize(UserRole.TEACHER, UserRole.ADMIN),
  validateObjectId(),
  gradeSubmission,
);

export default router;
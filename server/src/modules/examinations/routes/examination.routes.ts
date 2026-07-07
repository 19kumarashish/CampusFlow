import { Router } from "express";

import { protect } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/shared/enums/user-role.enum";
import { validateObjectId } from "@/shared/middlewares/validate-object-id.middleware";

import {
  createExamination,
  createExamResult,
  deleteExamination,
  getExaminationById,
  getExaminations,
  getExamResults,
  updateExamination,
  updateExamResult,
} from "../controllers/examination.controller";


const router = Router();

router.post(
  "/",
  protect,
  authorize(UserRole.TEACHER, UserRole.ADMIN),
  createExamination,
);

router.get(
  "/",
  protect,
  getExaminations,
);

router.get(
  "/:id",
  protect,
  validateObjectId(),
  getExaminationById,
);

router.patch(
  "/:id",
  protect,
  authorize(UserRole.TEACHER, UserRole.ADMIN),
  validateObjectId(),
  updateExamination,
);

router.delete(
  "/:id",
  protect,
  authorize(UserRole.TEACHER, UserRole.ADMIN),
  validateObjectId(),
  deleteExamination,
);

router.post(
  "/results",
  protect,
  authorize(UserRole.TEACHER, UserRole.ADMIN),
  createExamResult,
);

router.get(
  "/results",
  protect,
  getExamResults,
);

router.patch(
  "/results/:id",
  protect,
  authorize(UserRole.TEACHER, UserRole.ADMIN),
  validateObjectId(),
  updateExamResult,
);

export default router;
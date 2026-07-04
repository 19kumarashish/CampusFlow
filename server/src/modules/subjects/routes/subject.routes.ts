import { Router } from "express";

import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../controllers/subject.controller";

import { protect } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";

import { validateObjectId } from "@/shared/middlewares/validate-object-id.middleware";
import { UserRole } from "@/shared/enums/user-role.enum";

const router = Router();

router.post(
  "/",
  protect,
  authorize(UserRole.ADMIN),
  createSubject,
);

router.get(
  "/",
  protect,
  getSubjects,
);

router.get(
  "/:id",
  protect,
  validateObjectId(),
  getSubjectById,
);

router.patch(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  validateObjectId(),
  updateSubject,
);

router.delete(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  validateObjectId(),
  deleteSubject,
);

export default router;
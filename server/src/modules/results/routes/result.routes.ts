import { Router } from "express";

import { protect } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/shared/enums/user-role.enum";
import { validateObjectId } from "@/shared/middlewares/validate-object-id.middleware";

import {
  createResult,
  generateSemesterResult,
  generateTranscript,
  getResults,
  getSemesterResults,
  publishResult,
} from "../controllers/result.controller";

const router = Router();

router.post(
  "/",
  protect,
  authorize(UserRole.TEACHER, UserRole.ADMIN),
  createResult,
);

router.get(
  "/",
  protect,
  getResults,
);

router.post(
  "/semester",
  protect,
  authorize(UserRole.TEACHER, UserRole.ADMIN),
  generateSemesterResult,
);

router.get(
  "/semester",
  protect,
  getSemesterResults,
);

router.patch(
  "/:id/publish",
  protect,
  authorize(UserRole.ADMIN),
  validateObjectId(),
  publishResult,
);

router.get(
  "/transcript/:enrollmentId",
  protect,
  validateObjectId("enrollmentId"),
  generateTranscript,
);

export default router;
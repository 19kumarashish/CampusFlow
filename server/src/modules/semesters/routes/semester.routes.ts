import { Router } from "express";

import { protect } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/shared/enums/user-role.enum";
import { validateObjectId } from "@/shared/middlewares/validate-object-id.middleware";

import {
  createSemester,
  deleteSemester,
  getSemesterById,
  getSemesters,
  updateSemester,
} from "../controllers/semester.controller";

const router = Router();

router.post(
  "/",
  protect,
  authorize(UserRole.ADMIN),
  createSemester,
);

router.get(
  "/",
  protect,
  getSemesters,
);

router.get(
  "/:id",
  protect,
  validateObjectId(),
  getSemesterById,
);

router.patch(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  validateObjectId(),
  updateSemester,
);

router.delete(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  validateObjectId(),
  deleteSemester,
);

export default router;
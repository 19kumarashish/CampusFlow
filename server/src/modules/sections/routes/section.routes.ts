import { Router } from "express";

import { protect } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/shared/enums/user-role.enum";
import { validateObjectId } from "@/shared/middlewares/validate-object-id.middleware";

import {
  createSection,
  deleteSection,
  getSectionById,
  getSections,
  updateSection,
} from "../controllers/section.controller";

const router = Router();

router.post(
  "/",
  protect,
  authorize(UserRole.ADMIN),
  createSection,
);

router.get(
  "/",
  protect,
  getSections,
);

router.get(
  "/:id",
  protect,
  validateObjectId(),
  getSectionById,
);

router.patch(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  validateObjectId(),
  updateSection,
);

router.delete(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  validateObjectId(),
  deleteSection,
);

export default router;
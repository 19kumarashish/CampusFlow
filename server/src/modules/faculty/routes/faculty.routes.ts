import { Router } from "express";

import { protect } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/shared/enums/user-role.enum";
import { validateObjectId } from "@/shared/middlewares/validate-object-id.middleware";

import {
  createFaculty,
  deleteFaculty,
  getFaculties,
  getFacultyById,
  updateFaculty,
} from "../controllers/faculty.controller";

const router = Router();

router.post(
  "/",
  protect,
  authorize(UserRole.ADMIN),
  createFaculty,
);

router.get(
  "/",
  protect,
  getFaculties,
);

router.get(
  "/:id",
  protect,
  validateObjectId(),
  getFacultyById,
);

router.patch(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  validateObjectId(),
  updateFaculty,
);

router.delete(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  validateObjectId(),
  deleteFaculty,
);

export default router;
import { Router } from "express";

import { protect } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/shared/enums/user-role.enum";
import { validateObjectId } from "@/shared/middlewares/validate-object-id.middleware";

import {
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  getDepartments,
  updateDepartment,
} from "../controllers/department.controller";

const router = Router();

router.post(
  "/",
  protect,
  authorize(UserRole.ADMIN),
  createDepartment,
);

router.get(
  "/",
  protect,
  getDepartments,
);

router.get(
  "/:id",
  protect,
  validateObjectId(),
  getDepartmentById,
);

router.patch(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  validateObjectId(),
  updateDepartment,
);

router.delete(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  validateObjectId(),
  deleteDepartment,
);

export default router;
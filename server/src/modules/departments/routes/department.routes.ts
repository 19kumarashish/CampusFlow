import { Router } from "express";

import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "../controllers/department.controller";

import { protect } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/shared/enums/user-role.enum";

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
  getDepartmentById,
);

router.patch(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  updateDepartment,
);

router.delete(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  deleteDepartment,
);

export default router;
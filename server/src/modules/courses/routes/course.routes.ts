import { Router } from "express";

import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller";

import { protect } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/shared/enums/user-role.enum";

const router = Router();

router.post(
  "/",
  protect,
  authorize(UserRole.ADMIN),
  createCourse,
);

router.get(
  "/",
  protect,
  getCourses,
);

router.get(
  "/:id",
  protect,
  getCourseById,
);

router.patch(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  updateCourse,
);

router.delete(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  deleteCourse,
);

export default router;
import { Router } from "express";

import { protect } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/shared/enums/user-role.enum";
import { validateObjectId } from "@/shared/middlewares/validate-object-id.middleware";

import {
  createTimetable,
  deleteTimetable,
  getTimetable,
  getTimetableById,
  updateTimetable,
} from "../controllers/timetable.controller";

const router = Router();

router.post(
  "/",
  protect,
  authorize(UserRole.ADMIN),
  createTimetable,
);

router.get(
  "/",
  protect,
  getTimetable,
);

router.get(
  "/:id",
  protect,
  validateObjectId(),
  getTimetableById,
);

router.patch(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  validateObjectId(),
  updateTimetable,
);

router.delete(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  validateObjectId(),
  deleteTimetable,
);

export default router;


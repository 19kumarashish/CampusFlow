import { Router } from "express";
import { protect } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/shared/enums/user-role.enum";

import {
  promoteStudents,
  getPromotionHistory,
  getBacklogs,
  createBacklog,
  clearBacklog,
  getRevaluations,
  createRevaluationRequest,
  approveRevaluationRequest,
  getAcademicEvents,
  createAcademicEvent,
  updateAcademicEvent,
  deleteAcademicEvent,
} from "../controllers/academic.controller";

const router = Router();

// Promotions
router.post("/promotions/promote", protect, authorize(UserRole.ADMIN), promoteStudents);
router.get("/promotions/history", protect, getPromotionHistory);

// Backlogs
router.get("/backlogs", protect, getBacklogs);
router.post("/backlogs", protect, authorize(UserRole.ADMIN), createBacklog);
router.patch("/backlogs/:id/clear", protect, authorize(UserRole.ADMIN), clearBacklog);

// Revaluations
router.get("/revaluations", protect, getRevaluations);
router.post("/revaluations", protect, createRevaluationRequest);
router.patch("/revaluations/:id/approve", protect, authorize(UserRole.ADMIN), approveRevaluationRequest);

// Academic Events / Calendar
router.get("/calendar", protect, getAcademicEvents);
router.post("/calendar", protect, authorize(UserRole.ADMIN), createAcademicEvent);
router.patch("/calendar/:id", protect, authorize(UserRole.ADMIN), updateAcademicEvent);
router.delete("/calendar/:id", protect, authorize(UserRole.ADMIN), deleteAcademicEvent);

export default router;

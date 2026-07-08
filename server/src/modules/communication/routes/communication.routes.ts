import { Router } from "express";

import { protect } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/shared/enums/user-role.enum";
import { validateObjectId } from "@/shared/middlewares/validate-object-id.middleware";

import {
  createAnnouncement,
  getAnnouncements,
  getNotifications,
  getUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  updateNotificationPreference,
} from "../controllers/communication.controller";

const router = Router();

router.post(
  "/announcements",
  protect,
  authorize(UserRole.ADMIN),
  createAnnouncement,
);

router.get(
  "/announcements",
  protect,
  getAnnouncements,
);

router.get(
  "/notifications",
  protect,
  getNotifications,
);

router.get(
  "/notifications/unread-count",
  protect,
  getUnreadCount,
);

router.patch(
  "/notifications/:id/read",
  protect,
  validateObjectId(),
  markNotificationAsRead,
);

router.patch(
  "/notifications/read-all",
  protect,
  markAllNotificationsAsRead,
);

router.patch(
  "/preferences",
  protect,
  updateNotificationPreference,
);

export default router;
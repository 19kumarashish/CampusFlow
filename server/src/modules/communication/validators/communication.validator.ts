import { z } from "zod";

import { NotificationChannel } from "@/shared/enums/notification-channel.enum";
import { NotificationStatus } from "@/shared/enums/notification-status.enum";
import { NotificationType } from "@/shared/enums/notification-type.enum";
import { paginationSchema } from "@/shared/validators/pagination.validator";

export const createAnnouncementSchema =
  z.object({
    title: z
      .string()
      .trim()
      .min(3)
      .max(200),

    message: z
      .string()
      .trim()
      .min(5),

    targetRoles: z.array(
      z.string(),
    ),

    publishAt:
      z.coerce.date().optional(),

    expiresAt:
      z.coerce.date().optional(),
  });

export const createNotificationSchema =
  z.object({
    recipient: z.string(),

    title: z
      .string()
      .trim()
      .min(3)
      .max(200),

    message: z
      .string()
      .trim()
      .min(3),

    type:
      z.nativeEnum(
        NotificationType,
      ),

    channel:
      z.nativeEnum(
        NotificationChannel,
      ).optional(),
  });

export const getNotificationsQuerySchema =
  paginationSchema.extend({
    status:
      z.nativeEnum(
        NotificationStatus,
      ).optional(),

    type:
      z.nativeEnum(
        NotificationType,
      ).optional(),

    sortBy:
      z.enum([
        "createdAt",
      ]).default(
        "createdAt",
      ),
  });

export const updateNotificationPreferenceSchema =
  z.object({
    emailEnabled: z.boolean().optional(),

    inAppEnabled: z.boolean().optional(),

    pushEnabled: z.boolean().optional(),

    assignmentNotifications: z.boolean().optional(),

    examinationNotifications: z.boolean().optional(),

    resultNotifications: z.boolean().optional(),

    announcementNotifications: z.boolean().optional(),

    attendanceNotifications: z.boolean().optional(),

    systemNotifications: z.boolean().optional(),
  });
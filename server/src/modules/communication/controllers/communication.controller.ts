import { Request, Response } from "express";

import { AuthRequest } from "@/types/auth-request";
import { ApiResponse } from "@/utils/ApiResponse";
import { asyncHandler } from "@/utils/asyncHandler";

import { communicationService } from "../services/communication.service";
import {
  createAnnouncementSchema,
  getNotificationsQuerySchema,
  updateNotificationPreferenceSchema,
} from "../validators/communication.validator";

/**
 * Create Announcement
 */
export const createAnnouncement = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = createAnnouncementSchema.parse(req.body);

    const announcement =
      await communicationService.createAnnouncement({
        ...data,
        createdBy: req.user!._id,
      });

    res.status(201).json(
      new ApiResponse(
        true,
        "Announcement created successfully",
        announcement
      )
    );
  }
);

/**
 * Get All Announcements
 */
export const getAnnouncements = asyncHandler(
  async (_req: Request, res: Response) => {
    const announcements =
      await communicationService.getAnnouncements();

    res.status(200).json(
      new ApiResponse(
        true,
        "Announcements fetched successfully",
        announcements
      )
    );
  }
);

/**
 * Get Notifications
 */
export const getNotifications = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const query = getNotificationsQuerySchema.parse(req.query);

    const notifications =
      await communicationService.getNotifications(
        req.user!._id.toString(),
        query.page,
        query.limit
      );

    res.status(200).json(
      new ApiResponse(
        true,
        "Notifications fetched successfully",
        notifications
      )
    );
  }
);

/**
 * Get Unread Notification Count
 */
export const getUnreadCount = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const count =
      await communicationService.getUnreadCount(req.user!._id.toString());

    res.status(200).json(
      new ApiResponse(
        true,
        "Unread notification count fetched successfully",
        { count }
      )
    );
  }
);

/**
 * Mark Notification as Read
 */
export const markNotificationAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const notification =
      await communicationService.markAsRead(req.params.id as string);

    res.status(200).json(
      new ApiResponse(
        true,
        "Notification marked as read",
        notification
      )
    );
  }
);

/**
 * Mark All Notifications as Read
 */
export const markAllNotificationsAsRead = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    await communicationService.markAllAsRead(req.user!._id.toString());

    res.status(200).json(
      new ApiResponse(
        true,
        "All notifications marked as read"
      )
    );
  }
);

/**
 * Update Notification Preferences
 */
export const updateNotificationPreference = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data =
      updateNotificationPreferenceSchema.parse(req.body);

    const preference =
      await communicationService.updateNotificationPreference(
        req.user!._id.toString(),
        data
      );

    res.status(200).json(
      new ApiResponse(
        true,
        "Notification preferences updated successfully",
        preference
      )
    );
  }
);
import { NotificationStatus } from "@/shared/enums/notification-status.enum";

import { Announcement, IAnnouncement } from "../models/announcement.model";
import {
  INotification,
  Notification,
} from "../models/notification.model";
import {
  INotificationPreference,
  NotificationPreference,
} from "../models/notification-preference.model";

class CommunicationRepository {
  // ==========================
  // Announcement
  // ==========================

  async createAnnouncement(data: Partial<IAnnouncement>) {
    return Announcement.create(data);
  }

  async findAnnouncementById(id: string) {
    return Announcement.findById(id);
  }

  async getActiveAnnouncements() {
    const now = new Date();

    return Announcement.find({
      publishAt: { $lte: now },
      $or: [
        { expiresAt: null },
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: now } },
      ],
    }).sort({
      publishAt: -1,
    });
  }

  // ==========================
  // Notification
  // ==========================

  async createNotification(data: Partial<INotification>) {
    return Notification.create(data);
  }

  async getUserNotifications(
    userId: string,
    page: number,
    limit: number
  ) {
    const skip = (page - 1) * limit;

    return Notification.find({
      recipient: userId,
    })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);
  }

  async getUnreadCount(userId: string) {
    return Notification.countDocuments({
      recipient: userId,
      status: NotificationStatus.UNREAD,
    });
  }

  async markAsRead(id: string) {
    return Notification.findByIdAndUpdate(
      id,
      {
        status: NotificationStatus.READ,
        readAt: new Date(),
      },
      {
        new: true,
      }
    );
  }

  async markAllAsRead(userId: string) {
    return Notification.updateMany(
      {
        recipient: userId,
        status: NotificationStatus.UNREAD,
      },
      {
        status: NotificationStatus.READ,
        readAt: new Date(),
      }
    );
  }

  // ==========================
  // Notification Preferences
  // ==========================

  async findNotificationPreference(userId: string) {
    return NotificationPreference.findOne({
      user: userId,
    });
  }

  async updateNotificationPreference(
    userId: string,
    data: Partial<INotificationPreference>
  ) {
    return NotificationPreference.findOneAndUpdate(
      {
        user: userId,
      },
      {
        $set: data,
      },
      {
        new: true,
        upsert: true,
      }
    );
  }
}

export const communicationRepository =
  new CommunicationRepository();
import { NotificationType } from "@/shared/enums/notification-type.enum";
import { ApiError } from "@/utils/ApiError";

import { CreateAnnouncementDto } from "../dto/create-announcement.dto";
import { CreateNotificationDto } from "../dto/create-notification.dto";
import { UpdateNotificationPreferenceDto } from "../dto/update-notification-preference.dto";
import { communicationRepository } from "../repositories/communication.repository";

class CommunicationService {
  // ==========================
  // Announcement
  // ==========================

  async createAnnouncement(data: CreateAnnouncementDto) {
    return communicationRepository.createAnnouncement(data);
  }

  async getAnnouncements() {
    return communicationRepository.getActiveAnnouncements();
  }

  // ==========================
  // Notification
  // ==========================

  async createNotification(data: CreateNotificationDto) {
    // Load user preferences
    const preference =
      await communicationRepository.findNotificationPreference(
        data.recipient.toString()
      );

    // No preferences found -> create notification
    if (!preference) {
      return communicationRepository.createNotification(data);
    }

    // Respect user preferences
    switch (data.type) {
      case NotificationType.ASSIGNMENT:
        if (!preference.assignmentNotifications) return null;
        break;

      case NotificationType.EXAMINATION:
        if (!preference.examinationNotifications) return null;
        break;

      case NotificationType.RESULT:
        if (!preference.resultNotifications) return null;
        break;

      case NotificationType.ATTENDANCE:
        if (!preference.attendanceNotifications) return null;
        break;

      case NotificationType.ANNOUNCEMENT:
        if (!preference.announcementNotifications) return null;
        break;
    }

    // Create notification
    const notification =
      await communicationRepository.createNotification(data);

    // Future integrations
    // - Socket.IO
    // - Email
    // - Push Notifications

    return notification;
  }

  async getNotifications(
    userId: string,
    page: number,
    limit: number
  ) {
    return communicationRepository.getUserNotifications(
      userId,
      page,
      limit
    );
  }

  async getUnreadCount(userId: string) {
    return communicationRepository.getUnreadCount(userId);
  }

  async markAsRead(id: string) {
    const notification =
      await communicationRepository.markAsRead(id);

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    return notification;
  }

  async markAllAsRead(userId: string) {
    return communicationRepository.markAllAsRead(userId);
  }

  // ==========================
  // Notification Preferences
  // ==========================

  async updateNotificationPreference(
    userId: string,
    data: UpdateNotificationPreferenceDto
  ) {
    return communicationRepository.updateNotificationPreference(
      userId,
      data
    );
  }
}

export const communicationService =
  new CommunicationService();
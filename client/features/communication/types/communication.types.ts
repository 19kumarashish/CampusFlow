import type { User } from "@/features/auth/types/auth.types";
import type { PaginationMeta } from "@/features/users/types/user.types";

export type NotificationChannel = "IN_APP" | "EMAIL" | "PUSH";
export type NotificationStatus = "UNREAD" | "READ";
export type NotificationType = "ANNOUNCEMENT" | "ASSIGNMENT" | "EXAMINATION" | "RESULT" | "ATTENDANCE" | "SYSTEM";

export interface Announcement {
  _id: string;
  title: string;
  message: string;
  createdBy: User;
  targetRoles: string[];
  publishAt: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  recipient: User | string;
  title: string;
  message: string;
  type: NotificationType;
  channel: NotificationChannel;
  status: NotificationStatus;
  referenceId?: string;
  referenceModel?: string;
  readAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreference {
  _id: string;
  user: string;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  pushEnabled: boolean;
  assignmentNotifications: boolean;
  examinationNotifications: boolean;
  resultNotifications: boolean;
  announcementNotifications: boolean;
  attendanceNotifications: boolean;
  systemNotifications: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementInput {
  title: string;
  message: string;
  targetRoles: string[];
  publishAt?: string;
  expiresAt?: string;
}

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  status?: NotificationStatus;
  type?: NotificationType;
}

export interface GetNotificationsResponse {
  notifications: Notification[];
  pagination: PaginationMeta;
}

export interface UpdateNotificationPreferenceInput {
  emailEnabled?: boolean;
  inAppEnabled?: boolean;
  pushEnabled?: boolean;
  assignmentNotifications?: boolean;
  examinationNotifications?: boolean;
  resultNotifications?: boolean;
  announcementNotifications?: boolean;
  attendanceNotifications?: boolean;
  systemNotifications?: boolean;
}

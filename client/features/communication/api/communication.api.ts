import { api } from "@/lib/api/axios";
import type { ApiResponse } from "@/features/auth/types/auth.types";
import type {
  Announcement,
  CreateAnnouncementInput,
  Notification,
  GetNotificationsParams,
  GetNotificationsResponse,
  NotificationPreference,
  UpdateNotificationPreferenceInput,
} from "../types/communication.types";

export const createAnnouncement = async (
  data: CreateAnnouncementInput
): Promise<Announcement> => {
  const response = await api.post<ApiResponse<Announcement>>("/communication/announcements", data);
  return response.data.data;
};

export const getAnnouncements = async (): Promise<Announcement[]> => {
  const response = await api.get<ApiResponse<Announcement[]>>("/communication/announcements");
  return response.data.data;
};

export const getNotifications = async (
  params?: GetNotificationsParams
): Promise<GetNotificationsResponse> => {
  const response = await api.get<ApiResponse<GetNotificationsResponse>>("/communication/notifications", {
    params,
  });
  return response.data.data;
};

export const getUnreadCount = async (): Promise<{ count: number }> => {
  const response = await api.get<ApiResponse<{ count: number }>>("/communication/notifications/unread-count");
  return response.data.data;
};

export const markNotificationAsRead = async (id: string): Promise<Notification> => {
  const response = await api.patch<ApiResponse<Notification>>(`/communication/notifications/${id}/read`);
  return response.data.data;
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await api.patch<ApiResponse<null>>("/communication/notifications/read-all");
};

export const updateNotificationPreference = async (
  data: UpdateNotificationPreferenceInput
): Promise<NotificationPreference> => {
  const response = await api.patch<ApiResponse<NotificationPreference>>("/communication/preferences", data);
  return response.data.data;
};

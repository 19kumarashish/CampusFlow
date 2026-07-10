import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  createAnnouncement,
  getAnnouncements,
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  updateNotificationPreference,
} from "../api/communication.api";
import type {
  Announcement,
  CreateAnnouncementInput,
  Notification,
  GetNotificationsParams,
  GetNotificationsResponse,
  NotificationPreference,
  UpdateNotificationPreferenceInput,
} from "../types/communication.types";

export const useAnnouncementsQuery = () => {
  return useQuery<Announcement[], Error>({
    queryKey: ["announcements"],
    queryFn: getAnnouncements,
    staleTime: 60 * 1000,
  });
};

export const useNotificationsQuery = (params?: GetNotificationsParams) => {
  return useQuery<GetNotificationsResponse, Error>({
    queryKey: ["notifications", params],
    queryFn: () => getNotifications(params),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
  });
};

export const useUnreadCountQuery = (enabled = true) => {
  return useQuery<{ count: number }, Error>({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadCount,
    enabled,
    refetchInterval: 15 * 1000, // Auto-poll unread count every 15s
  });
};

export const useCreateAnnouncementMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Announcement, Error, CreateAnnouncementInput>({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      toast.success("Announcement published successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to publish announcement.";
      toast.error(errorMessage);
    },
  });
};

export const useMarkReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Notification, Error, string>({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification marked as read");
    },
  });
};

export const useMarkAllReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    },
  });
};

export const useUpdatePreferenceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<NotificationPreference, Error, UpdateNotificationPreferenceInput>({
    mutationFn: updateNotificationPreference,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preferences"] });
      toast.success("Notification preferences saved successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to save preferences.";
      toast.error(errorMessage);
    },
  });
};

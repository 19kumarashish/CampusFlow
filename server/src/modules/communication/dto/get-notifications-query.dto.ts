import { NotificationStatus } from "@/shared/enums/notification-status.enum";

export interface GetNotificationsQueryDto {
  page?: number;

  limit?: number;

  status?: NotificationStatus;

  type?: string;

  sortBy?: string;

  sortOrder?: "asc" | "desc";
}
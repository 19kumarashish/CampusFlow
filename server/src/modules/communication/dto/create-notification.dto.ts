import { Types } from "mongoose";

import { NotificationChannel } from "@/shared/enums/notification-channel.enum";
import { NotificationType } from "@/shared/enums/notification-type.enum";

export interface CreateNotificationDto {
  recipient: Types.ObjectId;

  title: string;

  message: string;

  type: NotificationType;

  channel?: NotificationChannel;

  referenceId?: Types.ObjectId;

  referenceModel?: string;

  expiresAt?: Date;
}
import { Document, Types } from "mongoose";

import { NotificationChannel } from "@/shared/enums/notification-channel.enum";
import { NotificationStatus } from "@/shared/enums/notification-status.enum";
import { NotificationType } from "@/shared/enums/notification-type.enum";

export interface INotification
  extends Document {
  recipient: Types.ObjectId;

  title: string;

  message: string;

  type: NotificationType;

  channel: NotificationChannel;

  status: NotificationStatus;

  referenceId?: Types.ObjectId;

  referenceModel?: string;

  readAt?: Date;

  expiresAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}
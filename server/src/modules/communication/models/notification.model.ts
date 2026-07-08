import { Document, model, Schema, Types } from "mongoose";

import { NotificationChannel } from "@/shared/enums/notification-channel.enum";
import { NotificationStatus } from "@/shared/enums/notification-status.enum";
import { NotificationType } from "@/shared/enums/notification-type.enum";

// Interface
export interface INotification extends Document {
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

// Schema
const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },

    channel: {
      type: String,
      enum: Object.values(NotificationChannel),
      default: NotificationChannel.IN_APP,
    },

    status: {
      type: String,
      enum: Object.values(NotificationStatus),
      default: NotificationStatus.UNREAD,
    },

    referenceId: {
      type: Schema.Types.ObjectId,
    },

    referenceModel: {
      type: String,
    },

    readAt: {
      type: Date,
    },

    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ recipient: 1 });
notificationSchema.index({ status: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ channel: 1 });

// Read history
notificationSchema.index({
  recipient: 1,
  status: 1,
});

// Notification feed
notificationSchema.index({
  recipient: 1,
  createdAt: -1,
});

// TTL Index (Auto delete expired notifications)
notificationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

// Model
export const Notification = model<INotification>(
  "Notification",
  notificationSchema
);
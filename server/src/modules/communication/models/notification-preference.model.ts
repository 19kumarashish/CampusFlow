import { Document, model, Schema, Types } from "mongoose";

// Interface
export interface INotificationPreference extends Document {
  user: Types.ObjectId;

  emailEnabled: boolean;
  inAppEnabled: boolean;
  pushEnabled: boolean;

  assignmentNotifications: boolean;
  examinationNotifications: boolean;
  resultNotifications: boolean;
  announcementNotifications: boolean;
  attendanceNotifications: boolean;
  systemNotifications: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// Schema
const notificationPreferenceSchema =
  new Schema<INotificationPreference>(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
      },

      emailEnabled: {
        type: Boolean,
        default: true,
      },

      inAppEnabled: {
        type: Boolean,
        default: true,
      },

      pushEnabled: {
        type: Boolean,
        default: true,
      },

      assignmentNotifications: {
        type: Boolean,
        default: true,
      },

      examinationNotifications: {
        type: Boolean,
        default: true,
      },

      resultNotifications: {
        type: Boolean,
        default: true,
      },

      announcementNotifications: {
        type: Boolean,
        default: true,
      },

      attendanceNotifications: {
        type: Boolean,
        default: true,
      },

      systemNotifications: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

// Index
notificationPreferenceSchema.index({
  user: 1,
});

// Model
export const NotificationPreference =
  model<INotificationPreference>(
    "NotificationPreference",
    notificationPreferenceSchema
  );
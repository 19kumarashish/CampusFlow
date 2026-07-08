import { Document, Types } from "mongoose";

export interface INotificationPreference
  extends Document {
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
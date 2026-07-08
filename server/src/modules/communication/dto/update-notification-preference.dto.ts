export interface UpdateNotificationPreferenceDto {
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
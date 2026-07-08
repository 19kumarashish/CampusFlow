export interface UpdateAnnouncementDto {
  title?: string;

  message?: string;

  targetRoles?: string[];

  publishAt?: Date;

  expiresAt?: Date;
}
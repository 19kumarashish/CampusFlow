import { Types } from "mongoose";

export interface CreateAnnouncementDto {
  title: string;

  message: string;

  createdBy: Types.ObjectId;

  targetRoles: string[];

  publishAt?: Date;

  expiresAt?: Date;
}
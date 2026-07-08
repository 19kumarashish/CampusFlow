import { Document, Types } from "mongoose";

export interface IAnnouncement
  extends Document {
  title: string;

  message: string;

  createdBy: Types.ObjectId;

  targetRoles: string[];

  publishAt: Date;

  expiresAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}
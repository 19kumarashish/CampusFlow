import { Document, Types } from "mongoose";

import { UserStatus } from "@/shared/enums/user-status.enum";

export interface IUser extends Document {
  firstName: string;

  lastName: string;

  email: string;

  phone: string;

  password: string;

  avatar?: string;

  role: Types.ObjectId;

  status: UserStatus;

  isEmailVerified: boolean;

  lastLogin?: Date;

  createdAt: Date;

  updatedAt: Date;
}
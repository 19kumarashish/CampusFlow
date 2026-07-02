import { Document, Types } from "mongoose";

import { IRole } from "@/modules/roles/models/role.interface";
import { UserStatus } from "@/shared/enums/user-status.enum";

export interface IUser extends Document {
  _id: Types.ObjectId;

  firstName: string;

  lastName: string;

  email: string;

  phone: string;

  password: string;

  avatar?: string;

  role: Types.ObjectId | IRole;

  status: UserStatus;

  isEmailVerified: boolean;

  lastLogin?: Date;

  createdAt: Date;

  updatedAt: Date;

  deletedAt?: Date;
}
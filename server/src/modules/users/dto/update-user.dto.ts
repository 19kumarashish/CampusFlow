import { Types } from "mongoose";

import { UserStatus } from "@/shared/enums/user-status.enum";

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  avatar?: string;
  roleId?: Types.ObjectId;
  status?: UserStatus;
}
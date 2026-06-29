import { UserRole } from "@/shared/enums/user-role.enum";
import { UserStatus } from "@/shared/enums/user-status.enum";

export interface IUser {
  firstName: string;
  lastName: string;

  email: string;

  phone: string;

  password: string;

  avatar?: string;

  role: UserRole;

  status: UserStatus;

  isEmailVerified: boolean;

  lastLogin?: Date;
}
import { Types } from "mongoose";

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  roleId: string;
}
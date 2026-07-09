import type { User, UserStatus } from "@/features/auth/types/auth.types";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  roleId: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  avatar?: string;
  roleId?: string;
  status?: UserStatus;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  sortBy?: "firstName" | "lastName" | "email" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  status?: UserStatus;
  role?: string; // Expects Role ObjectId
}

export interface GetUsersResponse {
  users: User[];
  pagination: PaginationMeta;
}

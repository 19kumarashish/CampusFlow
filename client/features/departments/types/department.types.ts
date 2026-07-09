import type { PaginationMeta } from "@/features/users/types/user.types";

export type DepartmentStatus = "ACTIVE" | "INACTIVE";

export interface Department {
  _id: string;
  name: string;
  code: string;
  description?: string;
  status: DepartmentStatus;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentInput {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateDepartmentInput {
  name?: string;
  code?: string;
  description?: string;
  status?: DepartmentStatus;
}

export interface GetDepartmentsParams {
  page?: number;
  limit?: number;
  sortBy?: "name" | "code" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  status?: DepartmentStatus;
}

export interface GetDepartmentsResponse {
  departments: Department[];
  pagination: PaginationMeta;
}

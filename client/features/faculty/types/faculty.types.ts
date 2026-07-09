import type { User } from "@/features/auth/types/auth.types";
import type { Department } from "@/features/departments/types/department.types";
import type { PaginationMeta } from "@/features/users/types/user.types";

export type Designation =
  | "HOD"
  | "PROFESSOR"
  | "ASSOCIATE_PROFESSOR"
  | "ASSISTANT_PROFESSOR"
  | "LECTURER"
  | "VISITING_FACULTY";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "VISITING";

export type FacultyStatus = "ACTIVE" | "INACTIVE";

export interface Faculty {
  _id: string;
  user: User; // Populated User details
  employeeId: string;
  department: Department; // Populated Department object
  designation: Designation;
  qualification: string;
  specialization: string;
  experience: number; // in years
  joiningDate: string;
  employmentType: EmploymentType;
  status: FacultyStatus;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFacultyInput {
  user: string; // User ObjectId
  employeeId: string;
  department: string; // Department ObjectId
  designation: Designation;
  qualification: string;
  specialization: string;
  experience: number;
  joiningDate: string; // Date string
  employmentType: EmploymentType;
}

export interface UpdateFacultyInput {
  user?: string;
  employeeId?: string;
  department?: string;
  designation?: Designation;
  qualification?: string;
  specialization?: string;
  experience?: number;
  joiningDate?: string;
  employmentType?: EmploymentType;
  status?: FacultyStatus;
}

export interface GetFacultiesParams {
  page?: number;
  limit?: number;
  sortBy?: "employeeId" | "designation" | "joiningDate" | "experience" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  department?: string; // Department ObjectId filter
  designation?: Designation;
  employmentType?: EmploymentType;
  status?: FacultyStatus;
}

export interface GetFacultiesResponse {
  faculties: Faculty[];
  pagination: PaginationMeta;
}

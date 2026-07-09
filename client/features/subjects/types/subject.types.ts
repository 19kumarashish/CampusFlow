import type { Department } from "@/features/departments/types/department.types";
import type { Course } from "@/features/courses/types/course.types";
import type { PaginationMeta } from "@/features/users/types/user.types";

export type SubjectType = "THEORY" | "LAB" | "PROJECT" | "ELECTIVE";

export type SubjectStatus = "ACTIVE" | "INACTIVE";

export interface Subject {
  _id: string;
  name: string;
  code: string;
  department: Department; // Populated Department object
  course: Course; // Populated Course object
  semester: number;
  credits: number;
  type: SubjectType;
  status: SubjectStatus;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectInput {
  name: string;
  code: string;
  department: string; // Department ObjectId string
  course: string; // Course ObjectId string
  semester: number;
  credits: number;
  type: SubjectType;
}

export interface UpdateSubjectInput {
  name?: string;
  code?: string;
  department?: string;
  course?: string;
  semester?: number;
  credits?: number;
  type?: SubjectType;
  status?: SubjectStatus;
}

export interface GetSubjectsParams {
  page?: number;
  limit?: number;
  sortBy?: "name" | "code" | "semester" | "credits" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  department?: string; // Department ObjectId filter
  course?: string; // Course ObjectId filter
  semester?: number;
  type?: SubjectType;
  status?: SubjectStatus;
}

export interface GetSubjectsResponse {
  subjects: Subject[];
  pagination: PaginationMeta;
}

import type { Department } from "@/features/departments/types/department.types";
import type { PaginationMeta } from "@/features/users/types/user.types";

export type DegreeType =
  | "BTECH"
  | "MTECH"
  | "BCA"
  | "MCA"
  | "BSC"
  | "MSC"
  | "BCOM"
  | "MCOM"
  | "BA"
  | "MA"
  | "MBA"
  | "PHD";

export type CourseStatus = "ACTIVE" | "INACTIVE";

export interface Course {
  _id: string;
  name: string;
  code: string;
  department: Department; // Populated Department object
  degree: DegreeType;
  duration: number; // in years
  totalSemesters: number;
  status: CourseStatus;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseInput {
  name: string;
  code: string;
  department: string; // Department ObjectId string
  degree: DegreeType;
  duration: number;
  totalSemesters: number;
}

export interface UpdateCourseInput {
  name?: string;
  code?: string;
  department?: string;
  degree?: DegreeType;
  duration?: number;
  totalSemesters?: number;
  status?: CourseStatus;
}

export interface GetCoursesParams {
  page?: number;
  limit?: number;
  sortBy?: "name" | "code" | "degree" | "duration" | "totalSemesters" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  department?: string; // Department ObjectId filter
  degree?: DegreeType;
  status?: CourseStatus;
}

export interface GetCoursesResponse {
  courses: Course[];
  pagination: PaginationMeta;
}

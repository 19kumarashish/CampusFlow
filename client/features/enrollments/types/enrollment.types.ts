import type { Student } from "@/features/students/types/student.types";
import type { Course } from "@/features/courses/types/course.types";
import type { Semester } from "@/features/semesters/types/semester.types";
import type { Section } from "@/features/sections/types/section.types";
import type { PaginationMeta } from "@/features/users/types/user.types";

export interface Enrollment {
  _id: string;
  student: Student; // Populated Student details
  course: Course; // Populated Course details
  semester: Semester; // Populated Semester details
  section: Section; // Populated Section details
  enrollmentDate: string;
  status: "ACTIVE" | "INACTIVE";
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEnrollmentInput {
  student: string; // Student ObjectId
  course: string; // Course ObjectId
  semester: string; // Semester ObjectId
  section: string; // Section ObjectId
  enrollmentDate?: string; // Date string
}

export interface UpdateEnrollmentInput {
  student?: string;
  course?: string;
  semester?: string;
  section?: string;
  enrollmentDate?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface GetEnrollmentsParams {
  page?: number;
  limit?: number;
  sortBy?: "enrollmentDate" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  student?: string; // Student ObjectId filter
  course?: string; // Course ObjectId filter
  semester?: string; // Semester ObjectId filter
  section?: string; // Section ObjectId filter
  status?: "ACTIVE" | "INACTIVE";
}

export interface GetEnrollmentsResponse {
  enrollments: Enrollment[];
  pagination: PaginationMeta;
}

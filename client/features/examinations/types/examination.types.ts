import type { PaginationMeta } from "@/features/users/types/user.types";
import type { Subject } from "@/features/subjects/types/subject.types";
import type { Faculty } from "@/features/faculty/types/faculty.types";
import type { Section } from "@/features/sections/types/section.types";
import type { Semester } from "@/features/semesters/types/semester.types";
import type { Enrollment } from "@/features/enrollments/types/enrollment.types";

export type ExamStatus = "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED";
export type ExamType = "MIDTERM" | "FINAL" | "PRACTICAL" | "VIVA" | "QUIZ" | "ASSIGNMENT";
export type Grade = "A+" | "A" | "B+" | "B" | "C" | "D" | "F";

export interface Examination {
  _id: string;
  title: string;
  subject: Subject;
  faculty: Faculty;
  section: Section;
  semester: Semester;
  examType: ExamType;
  date: string;
  startTime: string;
  endTime: string;
  hall: string;
  maximumMarks: number;
  passingMarks: number;
  status: ExamStatus;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ExamResult {
  _id: string;
  examination: Examination | string;
  enrollment: Enrollment;
  obtainedMarks: number;
  grade: Grade;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExaminationInput {
  title: string;
  subject: string; // Subject ID
  faculty: string; // Faculty ID
  section: string; // Section ID
  semester: string; // Semester ID
  examType: ExamType;
  date: string;
  startTime: string;
  endTime: string;
  hall: string;
  maximumMarks: number;
  passingMarks: number;
}

export interface UpdateExaminationInput {
  title?: string;
  examType?: ExamType;
  date?: string;
  startTime?: string;
  endTime?: string;
  hall?: string;
  maximumMarks?: number;
  passingMarks?: number;
  status?: ExamStatus;
}

export interface CreateExamResultInput {
  examination: string;
  enrollment: string;
  obtainedMarks: number;
  remarks?: string;
}

export interface UpdateExamResultInput {
  obtainedMarks?: number;
  remarks?: string;
}

export interface GetExaminationsParams {
  page?: number;
  limit?: number;
  subject?: string;
  faculty?: string;
  section?: string;
  semester?: string;
  examType?: ExamType;
  status?: ExamStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface GetExaminationsResponse {
  examinations: Examination[];
  pagination: PaginationMeta;
}

export interface GetExamResultsParams {
  page?: number;
  limit?: number;
  examination?: string;
  enrollment?: string;
  grade?: Grade;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetExamResultsResponse {
  results: ExamResult[];
  pagination: PaginationMeta;
}

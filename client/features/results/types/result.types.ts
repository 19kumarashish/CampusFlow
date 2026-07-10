import type { PaginationMeta } from "@/features/users/types/user.types";
import type { Subject } from "@/features/subjects/types/subject.types";
import type { Semester } from "@/features/semesters/types/semester.types";
import type { Enrollment } from "@/features/enrollments/types/enrollment.types";

export type ResultStatus = "DRAFT" | "PUBLISHED" | "REVISED";
export type Grade = "A+" | "A" | "B+" | "B" | "C" | "D" | "F";

export interface SubjectResult {
  _id: string;
  enrollment: Enrollment;
  subject: Subject;
  assignmentMarks: number;
  examMarks: number;
  totalMarks: number;
  percentage: number;
  grade: Grade;
  gradePoint: number;
  status: ResultStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SemesterResult {
  _id: string;
  enrollment: Enrollment;
  semester: Semester;
  sgpa: number;
  cgpa: number;
  creditsEarned: number;
  creditsAttempted: number;
  totalSubjects: number;
  passedSubjects: number;
  failedSubjects: number;
  percentage: number;
  status: ResultStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TranscriptSemester {
  semesterNumber: number;
  semesterName: string;
  sgpa: number;
  cgpa: number;
  creditsAttempted: number;
  creditsEarned: number;
  subjects: {
    code: string;
    name: string;
    grade: Grade;
    gradePoint: number;
    credits: number;
  }[];
}

export interface TranscriptResponse {
  student: {
    name: string;
    studentId: string;
    rollNumber: string;
    registrationNumber: string;
    department: string;
    course: string;
  };
  semesters: TranscriptSemester[];
  cumulativeCgpa: number;
  totalCreditsAttempted: number;
  totalCreditsEarned: number;
}

export interface CreateResultInput {
  enrollment: string; // Enrollment ObjectId
  subject: string; // Subject ObjectId
}

export interface CreateSemesterResultInput {
  enrollment: string; // Enrollment ObjectId
  semester: string; // Semester ObjectId
}

export interface GetResultsParams {
  page?: number;
  limit?: number;
  enrollment?: string;
  subject?: string;
  status?: ResultStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetResultsResponse {
  results: SubjectResult[];
  pagination: PaginationMeta;
}

export interface GetSemesterResultsParams {
  page?: number;
  limit?: number;
  enrollment?: string;
  semester?: string;
  status?: ResultStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetSemesterResultsResponse {
  results: SemesterResult[];
  pagination: PaginationMeta;
}

import type { User } from "@/features/auth/types/auth.types";
import type { Department } from "@/features/departments/types/department.types";
import type { Course } from "@/features/courses/types/course.types";
import type { PaginationMeta } from "@/features/users/types/user.types";

export type AdmissionType = "REGULAR" | "LATERAL_ENTRY" | "TRANSFER";

export type BloodGroup =
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "O_POSITIVE"
  | "O_NEGATIVE";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type StudentStatus = "ACTIVE" | "GRADUATED" | "DROPPED" | "SUSPENDED" | "ALUMNI";

export interface Student {
  _id: string;
  user: User; // Populated User details
  studentId: string;
  registrationNumber: string;
  rollNumber: string;
  department: Department; // Populated Department object
  course: Course; // Populated Course object
  currentSemester: number;
  admissionYear: number;
  admissionType: AdmissionType;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  guardianName: string;
  guardianPhone: string;
  address: string;
  status: StudentStatus;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentInput {
  user: string; // User ObjectId
  studentId: string;
  registrationNumber: string;
  rollNumber: string;
  department: string; // Department ObjectId
  course: string; // Course ObjectId
  currentSemester: number;
  admissionYear: number;
  admissionType: AdmissionType;
  dateOfBirth: string; // Date string
  gender: Gender;
  bloodGroup: BloodGroup;
  guardianName: string;
  guardianPhone: string;
  address: string;
}

export interface UpdateStudentInput {
  user?: string;
  studentId?: string;
  registrationNumber?: string;
  rollNumber?: string;
  department?: string;
  course?: string;
  currentSemester?: number;
  admissionYear?: number;
  admissionType?: AdmissionType;
  dateOfBirth?: string;
  gender?: Gender;
  bloodGroup?: BloodGroup;
  guardianName?: string;
  guardianPhone?: string;
  address?: string;
  status?: StudentStatus;
}

export interface GetStudentsParams {
  page?: number;
  limit?: number;
  sortBy?: "studentId" | "rollNumber" | "currentSemester" | "admissionYear" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  department?: string; // Department ObjectId filter
  course?: string; // Course ObjectId filter
  currentSemester?: number;
  admissionYear?: number;
  admissionType?: AdmissionType;
  gender?: Gender;
  status?: StudentStatus;
}

export interface GetStudentsResponse {
  students: Student[];
  pagination: PaginationMeta;
}

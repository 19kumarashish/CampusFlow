import type { PaginationMeta } from "@/features/users/types/user.types";

export type SemesterType = "ODD" | "EVEN";

export interface Semester {
  _id: string;
  name: string;
  semesterNumber: number;
  type: SemesterType;
  academicYear: string;
  course: string; // Course ID reference
  startDate: string;
  endDate: string;
  registrationStart: string;
  registrationEnd: string;
  examStart: string;
  examEnd: string;
  resultDate: string;
  isCurrent: boolean;
  status: "ACTIVE" | "INACTIVE";
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetSemestersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface GetSemestersResponse {
  semesters: Semester[];
  pagination: PaginationMeta;
}

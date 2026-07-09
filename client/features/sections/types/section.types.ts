import type { Semester } from "@/features/semesters/types/semester.types";
import type { Faculty } from "@/features/faculty/types/faculty.types";
import type { PaginationMeta } from "@/features/users/types/user.types";

export interface Section {
  _id: string;
  name: string;
  semester: Semester; // Populated Semester details
  capacity: number;
  classroom: string;
  facultyAdvisor: Faculty; // Populated Faculty details (with user nested)
  status: "ACTIVE" | "INACTIVE";
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSectionInput {
  name: string;
  semester: string; // Semester ObjectId
  capacity: number;
  classroom: string;
  facultyAdvisor: string; // Faculty ObjectId
}

export interface UpdateSectionInput {
  name?: string;
  semester?: string;
  capacity?: number;
  classroom?: string;
  facultyAdvisor?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface GetSectionsParams {
  page?: number;
  limit?: number;
  sortBy?: "name" | "capacity" | "createdAt";
  sortOrder?: "asc" | "desc";
  search?: string;
  semester?: string; // Semester ObjectId filter
  facultyAdvisor?: string; // Faculty ObjectId filter
  status?: "ACTIVE" | "INACTIVE";
}

export interface GetSectionsResponse {
  sections: Section[];
  pagination: PaginationMeta;
}

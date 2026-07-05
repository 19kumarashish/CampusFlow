import { SemesterType } from "@/shared/enums/semester-type.enum";
import { Status } from "@/shared/enums/status.enum";

export interface GetSemestersQueryDto {
  page?: number;

  limit?: number;

  search?: string;

  course?: string;

  academicYear?: string;

  semesterNumber?: number;

  type?: SemesterType;

  isCurrent?: boolean;

  status?: Status;

  sortBy?: string;

  sortOrder?: "asc" | "desc";
}
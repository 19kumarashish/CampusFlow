import { Status } from "@/shared/enums/status.enum";
import { SubjectType } from "@/shared/enums/subject-type.enum";

export interface GetSubjectsQueryDto {
  page?: number;

  limit?: number;

  search?: string;

  department?: string;

  course?: string;

  semester?: number;

  type?: SubjectType;

  status?: Status;

  sortBy?: string;

  sortOrder?: "asc" | "desc";
}
import { Status } from "@/shared/enums/status.enum";

export interface GetSectionsQueryDto {
  page?: number;

  limit?: number;

  search?: string;

  semester?: string;

  facultyAdvisor?: string;

  status?: Status;

  sortBy?: string;

  sortOrder?: "asc" | "desc";
}
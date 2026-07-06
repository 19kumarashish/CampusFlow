import { Status } from "@/shared/enums/status.enum";

export interface GetEnrollmentsQueryDto {
  page?: number;

  limit?: number;

  search?: string;

  student?: string;

  course?: string;

  semester?: string;

  section?: string;

  status?: Status;

  sortBy?: string;

  sortOrder?: "asc" | "desc";
}
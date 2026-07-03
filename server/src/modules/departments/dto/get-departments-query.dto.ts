import { Status } from "@/shared/enums/status.enum";

export interface GetDepartmentsQueryDto {
  page?: number;
  limit?: number;

  search?: string;

  sortBy?: string;
  sortOrder?: "asc" | "desc";

  status?: Status;
}
import { ResultStatus } from "@/shared/enums/result-status.enum";

export interface GetResultsQueryDto {
  page?: number;

  limit?: number;

  enrollment?: string;

  subject?: string;

  status?: ResultStatus;

  sortBy?: string;

  sortOrder?: "asc" | "desc";
}
import { ResultStatus } from "@/shared/enums/result-status.enum";

export interface GetSemesterResultsQueryDto {
  page?: number;

  limit?: number;

  enrollment?: string;

  semester?: string;

  status?: ResultStatus;

  sortBy?: string;

  sortOrder?: "asc" | "desc";
}
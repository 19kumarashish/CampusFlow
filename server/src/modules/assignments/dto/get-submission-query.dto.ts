import { SubmissionStatus } from "@/shared/enums/submission-status.enum";

export interface GetSubmissionQueryDto {
  page?: number;

  limit?: number;

  assignment?: string;

  enrollment?: string;

  status?: SubmissionStatus;

  sortBy?: string;

  sortOrder?: "asc" | "desc";
}
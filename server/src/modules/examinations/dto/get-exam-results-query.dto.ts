import { Grade } from "@/shared/enums/grade.enum";

export interface GetExamResultsQueryDto {
  page?: number;

  limit?: number;

  examination?: string;

  enrollment?: string;

  grade?: Grade;

  sortBy?: string;

  sortOrder?: "asc" | "desc";
}
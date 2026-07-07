import { ExamStatus } from "@/shared/enums/exam-status.enum";
import { ExamType } from "@/shared/enums/exam-type.enum";

export interface GetExaminationsQueryDto {
  page?: number;

  limit?: number;

  subject?: string;

  faculty?: string;

  section?: string;

  semester?: string;

  examType?: ExamType;

  status?: ExamStatus;

  sortBy?: string;

  sortOrder?: "asc" | "desc";
}
import { Day } from "@/shared/enums/day.enum";
import { Status } from "@/shared/enums/status.enum";

export interface GetTimetableQueryDto {
  page?: number;

  limit?: number;

  section?: string;

  faculty?: string;

  subject?: string;

  classroom?: string;

  day?: Day;

  status?: Status;

  sortBy?: string;

  sortOrder?: "asc" | "desc";
}
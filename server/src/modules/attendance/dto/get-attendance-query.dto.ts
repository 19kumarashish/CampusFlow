import { AttendanceStatus } from "@/shared/enums/attendance-status.enum";

export interface GetAttendanceQueryDto {
  page?: number;

  limit?: number;

  enrollment?: string;

  subject?: string;

  faculty?: string;

  date?: string;

  status?: AttendanceStatus;

  sortBy?: string;

  sortOrder?: "asc" | "desc";
}
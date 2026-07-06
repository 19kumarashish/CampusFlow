import { AssignmentStatus } from "@/shared/enums/assignment-status.enum";

export interface GetAssignmentQueryDto {
  page?: number;

  limit?: number;

  subject?: string;

  faculty?: string;

  section?: string;

  semester?: string;

  status?: AssignmentStatus;

  sortBy?: string;

  sortOrder?: "asc" | "desc";
}
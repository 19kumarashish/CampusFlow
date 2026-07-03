import { Status } from "@/shared/enums/status.enum";
import { DegreeType } from "@/shared/enums/degree-type.enum";

export interface GetCoursesQueryDto {
  page?: number;

  limit?: number;

  search?: string;

  department?: string;

  degree?: DegreeType;

  status?: Status;

  sortBy?: string;

  sortOrder?: "asc" | "desc";
}
import { Designation } from "@/shared/enums/designation.enum";
import { EmploymentType } from "@/shared/enums/employment-type.enum";
import { Status } from "@/shared/enums/status.enum";

export interface GetFacultiesQueryDto {
  page?: number;

  limit?: number;

  search?: string;

  department?: string;

  designation?: Designation;

  employmentType?: EmploymentType;

  status?: Status;

  sortBy?: string;

  sortOrder?: "asc" | "desc";
}
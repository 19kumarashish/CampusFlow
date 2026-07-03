import { Status } from "@/shared/enums/status.enum";

export interface UpdateDepartmentDto {
  name?: string;
  code?: string;
  description?: string;
  status?: Status;
}
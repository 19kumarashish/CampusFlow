import { ResultStatus } from "@/shared/enums/result-status.enum";

export interface UpdateResultDto {
  status?: ResultStatus;
}
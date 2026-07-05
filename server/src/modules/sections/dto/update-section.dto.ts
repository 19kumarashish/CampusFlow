import { Types } from "mongoose";

import { Status } from "@/shared/enums/status.enum";

export interface UpdateSectionDto {
  name?: string;

  semester?: Types.ObjectId;

  capacity?: number;

  classroom?: string;

  facultyAdvisor?: Types.ObjectId;

  status?: Status;
}
import { Types } from "mongoose";

import { Status } from "@/shared/enums/status.enum";
import { SubjectType } from "@/shared/enums/subject-type.enum";

export interface UpdateSubjectDto {
  name?: string;

  code?: string;

  department?: Types.ObjectId;

  course?: Types.ObjectId;

  semester?: number;

  credits?: number;

  type?: SubjectType;

  status?: Status;
}
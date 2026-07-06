import { Types } from "mongoose";

import { Status } from "@/shared/enums/status.enum";

export interface UpdateEnrollmentDto {
  student?: Types.ObjectId;

  course?: Types.ObjectId;

  semester?: Types.ObjectId;

  section?: Types.ObjectId;

  enrollmentDate?: Date;

  status?: Status;
}
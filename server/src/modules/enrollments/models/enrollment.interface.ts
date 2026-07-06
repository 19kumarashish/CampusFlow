import { Document, Types } from "mongoose";

import { Status } from "@/shared/enums/status.enum";

export interface IEnrollment
  extends Document {
  student: Types.ObjectId;

  course: Types.ObjectId;

  semester: Types.ObjectId;

  section: Types.ObjectId;

  enrollmentDate: Date;

  status: Status;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}
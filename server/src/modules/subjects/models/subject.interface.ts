import { Document, Types } from "mongoose";

import { Status } from "@/shared/enums/status.enum";
import { SubjectType } from "@/shared/enums/subject-type.enum";

export interface ISubject
  extends Document {
  name: string;

  code: string;

  department: Types.ObjectId;

  course: Types.ObjectId;

  semester: number;

  credits: number;

  type: SubjectType;

  status: Status;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}
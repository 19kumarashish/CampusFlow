import { Document, Types } from "mongoose";

import { SemesterType } from "@/shared/enums/semester-type.enum";
import { Status } from "@/shared/enums/status.enum";

export interface ISemester extends Document {
  name: string;

  semesterNumber: number;

  type: SemesterType;

  academicYear: string;

  course: Types.ObjectId;

  startDate: Date;

  endDate: Date;

  registrationStart: Date;

  registrationEnd: Date;

  examStart: Date;

  examEnd: Date;

  resultDate: Date;

  isCurrent: boolean;

  status: Status;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}
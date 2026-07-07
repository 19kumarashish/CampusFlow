import { Document, Types } from "mongoose";

import { Grade } from "@/shared/enums/grade.enum";
import { ResultStatus } from "@/shared/enums/result-status.enum";

export interface IResult extends Document {
  enrollment: Types.ObjectId;

  subject: Types.ObjectId;

  assignmentMarks: number;

  examMarks: number;

  totalMarks: number;

  percentage: number;

  grade: Grade;

  gradePoint: number;

  status: ResultStatus;

  createdAt: Date;

  updatedAt: Date;
}
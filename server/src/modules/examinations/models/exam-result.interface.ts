import { Document, Types } from "mongoose";

import { Grade } from "@/shared/enums/grade.enum";

export interface IExamResult
  extends Document {
  examination: Types.ObjectId;

  enrollment: Types.ObjectId;

  obtainedMarks: number;

  grade: Grade;

  remarks?: string;

  createdAt: Date;

  updatedAt: Date;
}
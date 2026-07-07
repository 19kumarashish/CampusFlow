import { Types } from "mongoose";

export interface CreateExamResultDto {
  examination: Types.ObjectId;

  enrollment: Types.ObjectId;

  obtainedMarks: number;

  remarks?: string;
}
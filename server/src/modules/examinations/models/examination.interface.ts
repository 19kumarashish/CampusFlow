import { Document, Types } from "mongoose";

import { ExamStatus } from "@/shared/enums/exam-status.enum";
import { ExamType } from "@/shared/enums/exam-type.enum";

export interface IExamination
  extends Document {
  title: string;

  subject: Types.ObjectId;

  faculty: Types.ObjectId;

  section: Types.ObjectId;

  semester: Types.ObjectId;

  examType: ExamType;

  date: Date;

  startTime: string;

  endTime: string;

  hall: string;

  maximumMarks: number;

  passingMarks: number;

  status: ExamStatus;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}
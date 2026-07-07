import { Types } from "mongoose";

import { ExamType } from "@/shared/enums/exam-type.enum";

export interface CreateExaminationDto {
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
}
import { Document, Types } from "mongoose";

import { ResultStatus } from "@/shared/enums/result-status.enum";

export interface ISemesterResult
  extends Document {
  enrollment: Types.ObjectId;

  semester: Types.ObjectId;

  sgpa: number;

  cgpa: number;

  creditsEarned: number;

  creditsAttempted: number;

  totalSubjects: number;

  passedSubjects: number;

  failedSubjects: number;

  percentage: number;

  status: ResultStatus;

  publishedAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}
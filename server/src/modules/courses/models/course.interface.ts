import { Document, Types } from "mongoose";

import { Status } from "@/shared/enums/status.enum";

export interface ICourse extends Document {
  name: string;

  code: string;

  department: Types.ObjectId;

  degree: string;

  duration: number;

  totalSemesters: number;

  status: Status;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}
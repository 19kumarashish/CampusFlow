import { Document, Types } from "mongoose";

import { AttendanceStatus } from "@/shared/enums/attendance-status.enum";

export interface IAttendance extends Document {
  enrollment: Types.ObjectId;

  subject: Types.ObjectId;

  faculty: Types.ObjectId;

  date: Date;

  lectureNumber: number;

  status: AttendanceStatus;

  remarks?: string;

  createdAt: Date;

  updatedAt: Date;
}
import { Types } from "mongoose";

import { AttendanceStatus } from "@/shared/enums/attendance-status.enum";

export interface CreateAttendanceDto {
  enrollment: Types.ObjectId;

  subject: Types.ObjectId;

  faculty: Types.ObjectId;

  date: Date;

  lectureNumber: number;

  status: AttendanceStatus;

  remarks?: string;
}
import { Types } from "mongoose";

import { Day } from "@/shared/enums/day.enum";
import { Status } from "@/shared/enums/status.enum";

export interface UpdateTimetableDto {
  section?: Types.ObjectId;

  subject?: Types.ObjectId;

  faculty?: Types.ObjectId;

  classroom?: string;

  day?: Day;

  startTime?: string;

  endTime?: string;

  status?: Status;
}
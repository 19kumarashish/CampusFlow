import { Types } from "mongoose";

import { Day } from "@/shared/enums/day.enum";

export interface CreateTimetableDto {
  section: Types.ObjectId;

  subject: Types.ObjectId;

  faculty: Types.ObjectId;

  classroom: string;

  day: Day;

  startTime: string;

  endTime: string;
}
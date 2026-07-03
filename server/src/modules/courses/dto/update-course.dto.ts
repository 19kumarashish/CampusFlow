import { Types } from "mongoose";

import { Status } from "@/shared/enums/status.enum";
import { DegreeType } from "@/shared/enums/degree-type.enum";

export interface UpdateCourseDto {
  name?: string;

  code?: string;

  department?: Types.ObjectId;

  degree?: DegreeType;

  duration?: number;

  totalSemesters?: number;

  status?: Status;
}
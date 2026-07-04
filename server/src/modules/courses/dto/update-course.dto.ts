import { Types } from "mongoose";

import { DegreeType } from "@/shared/enums/degree-type.enum";
import { Status } from "@/shared/enums/status.enum";

export interface UpdateCourseDto {
  name?: string;

  code?: string;

  department?: Types.ObjectId;

  degree?: DegreeType;

  duration?: number;

  totalSemesters?: number;

  status?: Status;
}
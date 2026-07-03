import { Types } from "mongoose";

import { DegreeType } from "@/shared/enums/degree-type.enum";

export interface CreateCourseDto {
  name: string;

  code: string;

  department: Types.ObjectId;

  degree: DegreeType;

  duration: number;

  totalSemesters: number;
}
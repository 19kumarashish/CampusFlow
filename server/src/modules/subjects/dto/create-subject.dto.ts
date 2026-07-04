import { Types } from "mongoose";

import { SubjectType } from "@/shared/enums/subject-type.enum";

export interface CreateSubjectDto {
  name: string;

  code: string;

  department: Types.ObjectId;

  course: Types.ObjectId;

  semester: number;

  credits: number;

  type: SubjectType;
}
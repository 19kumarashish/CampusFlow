import { Types } from "mongoose";

import { SemesterType } from "@/shared/enums/semester-type.enum";

export interface CreateSemesterDto {
  name: string;

  semesterNumber: number;

  type: SemesterType;

  academicYear: string;

  course: Types.ObjectId;

  startDate: Date;

  endDate: Date;

  registrationStart: Date;

  registrationEnd: Date;

  examStart: Date;

  examEnd: Date;

  resultDate: Date;

  isCurrent?: boolean;
}
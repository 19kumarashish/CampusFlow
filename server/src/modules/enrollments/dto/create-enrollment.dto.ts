import { Types } from "mongoose";

export interface CreateEnrollmentDto {
  student: Types.ObjectId;

  course: Types.ObjectId;

  semester: Types.ObjectId;

  section: Types.ObjectId;

  enrollmentDate?: Date;
}
import { Types } from "mongoose";

export interface CreateSemesterResultDto {
  enrollment: Types.ObjectId;

  semester: Types.ObjectId;
}
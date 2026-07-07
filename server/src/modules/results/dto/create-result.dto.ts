import { Types } from "mongoose";

export interface CreateResultDto {
  enrollment: Types.ObjectId;

  subject: Types.ObjectId;
}
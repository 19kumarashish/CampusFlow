import { Types } from "mongoose";

export interface CreateSectionDto {
  name: string;

  semester: Types.ObjectId;

  capacity: number;

  classroom: string;

  facultyAdvisor: Types.ObjectId;
}
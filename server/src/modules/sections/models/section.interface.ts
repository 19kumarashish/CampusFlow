import { Document, Types } from "mongoose";

import { Status } from "@/shared/enums/status.enum";

export interface ISection
  extends Document {
  name: string;

  semester: Types.ObjectId;

  capacity: number;

  classroom: string;

  facultyAdvisor: Types.ObjectId;

  status: Status;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}
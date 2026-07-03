import { Document } from "mongoose";

import { Status } from "@/shared/enums/status.enum";

export interface IDepartment extends Document {
  name: string;
  code: string;
  description?: string;

  status: Status;

  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}
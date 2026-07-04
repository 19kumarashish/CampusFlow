import { Document, Types } from "mongoose";

import { Designation } from "@/shared/enums/designation.enum";
import { EmploymentType } from "@/shared/enums/employment-type.enum";
import { Status } from "@/shared/enums/status.enum";

export interface IFaculty extends Document {
  user: Types.ObjectId;

  employeeId: string;

  department: Types.ObjectId;

  designation: Designation;

  qualification: string;

  specialization: string;

  experience: number;

  joiningDate: Date;

  employmentType: EmploymentType;

  status: Status;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}
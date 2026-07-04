import { Types } from "mongoose";

import { Designation } from "@/shared/enums/designation.enum";
import { EmploymentType } from "@/shared/enums/employment-type.enum";

export interface CreateFacultyDto {
  user: Types.ObjectId;

  employeeId: string;

  department: Types.ObjectId;

  designation: Designation;

  qualification: string;

  specialization: string;

  experience: number;

  joiningDate: Date;

  employmentType: EmploymentType;
}
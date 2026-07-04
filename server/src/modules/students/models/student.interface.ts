import { Document, Types } from "mongoose";

import { AdmissionType } from "@/shared/enums/admission-type.enum";
import { BloodGroup } from "@/shared/enums/blood-group.enum";
import { Gender } from "@/shared/enums/gender.enum";
import { StudentStatus } from "@/shared/enums/student-status.enum";

export interface IStudent extends Document {
  user: Types.ObjectId;

  studentId: string;

  registrationNumber: string;

  rollNumber: string;

  department: Types.ObjectId;

  course: Types.ObjectId;

  currentSemester: number;

  admissionYear: number;

  admissionType: AdmissionType;

  dateOfBirth: Date;

  gender: Gender;

  bloodGroup: BloodGroup;

  guardianName: string;

  guardianPhone: string;

  address: string;

  status: StudentStatus;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}
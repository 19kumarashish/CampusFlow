import { model,Schema } from "mongoose";

import { AdmissionType } from "@/shared/enums/admission-type.enum";
import { BloodGroup } from "@/shared/enums/blood-group.enum";
import { Gender } from "@/shared/enums/gender.enum";
import { StudentStatus } from "@/shared/enums/student-status.enum";

import { IStudent } from "./student.interface";

const studentSchema = new Schema<IStudent>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    studentId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    rollNumber: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    currentSemester: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    admissionYear: {
      type: Number,
      required: true,
      min: 2000,
    },

    admissionType: {
      type: String,
      enum: Object.values(AdmissionType),
      default: AdmissionType.REGULAR,
    },

    dateOfBirth: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: Object.values(Gender),
      required: true,
    },

    bloodGroup: {
      type: String,
      enum: Object.values(BloodGroup),
      required: true,
    },

    guardianName: {
      type: String,
      required: true,
      trim: true,
    },

    guardianPhone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(StudentStatus),
      default: StudentStatus.ACTIVE,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

/* -------------------------------------------------------------------------- */
/*                                   Indexes                                  */
/* -------------------------------------------------------------------------- */

// Unique indexes (optional because unique already creates indexes)
studentSchema.index({ studentId: 1 });
studentSchema.index({ registrationNumber: 1 });

// Single-field indexes
studentSchema.index({ department: 1 });
studentSchema.index({ course: 1 });
studentSchema.index({ currentSemester: 1 });
studentSchema.index({ admissionYear: 1 });
studentSchema.index({ status: 1 });
studentSchema.index({ rollNumber: 1 });

// Compound indexes
studentSchema.index({
  course: 1,
  currentSemester: 1,
});

studentSchema.index({
  department: 1,
  currentSemester: 1,
});

studentSchema.index({
  admissionYear: 1,
  course: 1,
});

studentSchema.index({
  rollNumber: 1,
  course: 1,
});

studentSchema.index({
  department: 1,
  admissionYear: 1,
});

studentSchema.index({
  course: 1,
  currentSemester: 1,
  status: 1,
});

export const Student = model<IStudent>(
  "Student",
  studentSchema,
);
import { model,Schema } from "mongoose";

import { SemesterType } from "@/shared/enums/semester-type.enum";
import { Status } from "@/shared/enums/status.enum";

import { ISemester } from "./semester.interface";

const semesterSchema = new Schema<ISemester>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    semesterNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    type: {
      type: String,
      enum: Object.values(SemesterType),
      required: true,
    },

    academicYear: {
      type: String,
      required: true,
      trim: true,
    },

    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    registrationStart: {
      type: Date,
      required: true,
    },

    registrationEnd: {
      type: Date,
      required: true,
    },

    examStart: {
      type: Date,
      required: true,
    },

    examEnd: {
      type: Date,
      required: true,
    },

    resultDate: {
      type: Date,
      required: true,
    },

    isCurrent: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
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

// Single-field indexes
semesterSchema.index({ course: 1 });
semesterSchema.index({ semesterNumber: 1 });
semesterSchema.index({ academicYear: 1 });
semesterSchema.index({ status: 1 });
semesterSchema.index({ isCurrent: 1 });

// Compound indexes

// Frequently used for fetching semesters of a course in an academic year
semesterSchema.index({
  course: 1,
  academicYear: 1,
});

// Frequently used for fetching a specific semester
semesterSchema.index({
  course: 1,
  semesterNumber: 1,
  academicYear: 1,
});

// Ensure no duplicate semester exists for the same course & academic year
semesterSchema.index(
  {
    course: 1,
    semesterNumber: 1,
    academicYear: 1,
  },
  {
    unique: true,
  },
);

export const Semester = model<ISemester>(
  "Semester",
  semesterSchema,
);
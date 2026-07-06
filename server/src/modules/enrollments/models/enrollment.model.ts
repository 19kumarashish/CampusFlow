import { model,Schema } from "mongoose";

import { Status } from "@/shared/enums/status.enum";

import { IEnrollment } from "./enrollment.interface";

const enrollmentSchema = new Schema<IEnrollment>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    semester: {
      type: Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },

    section: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },

    enrollmentDate: {
      type: Date,
      default: Date.now,
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
  }
);

// ======================
// Indexes
// ======================

// Optimize lookup by student
enrollmentSchema.index({
  student: 1,
});

// Optimize lookup by course
enrollmentSchema.index({
  course: 1,
});

// Optimize lookup by semester
enrollmentSchema.index({
  semester: 1,
});

// Optimize lookup by section
enrollmentSchema.index({
  section: 1,
});

// Optimize lookup by status
enrollmentSchema.index({
  status: 1,
});

// Frequently used for attendance
enrollmentSchema.index({
  section: 1,
  semester: 1,
});

// Prevent duplicate enrollment in the same semester
enrollmentSchema.index(
  {
    student: 1,
    semester: 1,
  },
  {
    unique: true,
  }
);

// Frequently used when filtering course + semester + section
enrollmentSchema.index({
  course: 1,
  semester: 1,
  section: 1,
});

// ======================
// Export Model
// ======================

export const Enrollment = model<IEnrollment>(
  "Enrollment",
  enrollmentSchema
);
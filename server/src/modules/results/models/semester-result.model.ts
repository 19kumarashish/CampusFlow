import { model,Schema } from "mongoose";

import { ResultStatus } from "@/shared/enums/result-status.enum";

import { ISemesterResult } from "./semester-result.interface";

const semesterResultSchema = new Schema<ISemesterResult>(
  {
    enrollment: {
      type: Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },

    semester: {
      type: Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },

    sgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    cgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    creditsEarned: {
      type: Number,
      required: true,
      min: 0,
    },

    creditsAttempted: {
      type: Number,
      required: true,
      min: 0,
    },

    totalSubjects: {
      type: Number,
      required: true,
    },

    passedSubjects: {
      type: Number,
      required: true,
    },

    failedSubjects: {
      type: Number,
      required: true,
    },

    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: Object.values(ResultStatus),
      default: ResultStatus.DRAFT,
    },

    publishedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// ==============================
// Validation
// ==============================

// Passed + Failed = Total Subjects
semesterResultSchema.path("passedSubjects").validate(
  function (this: ISemesterResult, value: number) {
    return (
      value + this.failedSubjects ===
      this.totalSubjects
    );
  },
  "Invalid subject counts",
);

// Credits earned cannot exceed attempted
semesterResultSchema.path("creditsEarned").validate(
  function (this: ISemesterResult, value: number) {
    return value <= this.creditsAttempted;
  },
  "Credits earned cannot exceed attempted",
);

// ==============================
// Indexes
// ==============================

// Student lookup
semesterResultSchema.index({
  enrollment: 1,
});

// Semester lookup
semesterResultSchema.index({
  semester: 1,
});

// Publication status
semesterResultSchema.index({
  status: 1,
});

// One semester result per enrollment
semesterResultSchema.index(
  {
    enrollment: 1,
    semester: 1,
  },
  {
    unique: true,
  },
);

// Transcript generation
semesterResultSchema.index({
  enrollment: 1,
  semester: 1,
});

// Merit list
semesterResultSchema.index({
  semester: 1,
  sgpa: -1,
});

// CGPA ranking
semesterResultSchema.index({
  cgpa: -1,
});

// ==============================
// Export
// ==============================

export const SemesterResult =
  model<ISemesterResult>(
    "SemesterResult",
    semesterResultSchema,
  );
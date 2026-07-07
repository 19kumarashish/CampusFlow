import { model,Schema } from "mongoose";

import { Grade } from "@/shared/enums/grade.enum";
import { ResultStatus } from "@/shared/enums/result-status.enum";

import { IResult } from "./result.interface";

const resultSchema = new Schema<IResult>(
  {
    enrollment: {
      type: Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },

    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    assignmentMarks: {
      type: Number,
      required: true,
      min: 0,
    },

    examMarks: {
      type: Number,
      required: true,
      min: 0,
    },

    totalMarks: {
      type: Number,
      required: true,
      min: 0,
    },

    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    grade: {
      type: String,
      enum: Object.values(Grade),
      required: true,
    },

    gradePoint: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    status: {
      type: String,
      enum: Object.values(ResultStatus),
      default: ResultStatus.DRAFT,
    },
  },
  {
    timestamps: true,
  },
);

// =======================
// Indexes
// =======================

// Student Results
resultSchema.index({
  enrollment: 1,
});

// Subject Results
resultSchema.index({
  subject: 1,
});

// Publication Status
resultSchema.index({
  status: 1,
});

// Prevent duplicate results
resultSchema.index(
  {
    enrollment: 1,
    subject: 1,
  },
  {
    unique: true,
  },
);

// Transcript generation
resultSchema.index({
  enrollment: 1,
  subject: 1,
});

// Department analytics
resultSchema.index({
  subject: 1,
  grade: 1,
});

// Student dashboard
resultSchema.index({
  enrollment: 1,
  status: 1,
});

// =======================
// Validation
// =======================

resultSchema.path("totalMarks").validate(
  function (this: IResult, value: number) {
    return (
      value ===
      this.assignmentMarks + this.examMarks
    );
  },
  "Invalid total marks",
);

// =======================
// Export
// =======================

export const Result = model<IResult>(
  "Result",
  resultSchema,
);
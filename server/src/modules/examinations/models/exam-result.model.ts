import { model,Schema } from "mongoose";

import { Grade } from "@/shared/enums/grade.enum";

import { IExamResult } from "./exam-result.interface";

const examResultSchema = new Schema<IExamResult>(
  {
    examination: {
      type: Schema.Types.ObjectId,
      ref: "Examination",
      required: true,
    },

    enrollment: {
      type: Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },

    obtainedMarks: {
      type: Number,
      required: true,
      min: 0,
    },

    grade: {
      type: String,
      enum: Object.values(Grade),
      required: true,
    },

    remarks: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * ==========================
 * Basic Indexes
 * ==========================
 */

// Examination lookup
examResultSchema.index({
  examination: 1,
});

// Student (Enrollment) lookup
examResultSchema.index({
  enrollment: 1,
});

// Grade lookup
examResultSchema.index({
  grade: 1,
});

/**
 * ==========================
 * Performance Indexes
 * ==========================
 */

// One result per student per examination
examResultSchema.index(
  {
    examination: 1,
    enrollment: 1,
  },
  {
    unique: true,
  }
);

// Student result history
examResultSchema.index({
  enrollment: 1,
  createdAt: -1,
});

// Grade analytics per examination
examResultSchema.index({
  examination: 1,
  grade: 1,
});

export const ExamResult = model<IExamResult>(
  "ExamResult",
  examResultSchema
);
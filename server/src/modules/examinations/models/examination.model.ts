import { model,Schema } from "mongoose";

import { ExamStatus } from "@/shared/enums/exam-status.enum";
import { ExamType } from "@/shared/enums/exam-type.enum";

import { IExamination } from "./examination.interface";

const examinationSchema = new Schema<IExamination>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    faculty: {
      type: Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },

    section: {
      type: Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },

    semester: {
      type: Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },

    examType: {
      type: String,
      enum: Object.values(ExamType),
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    hall: {
      type: String,
      required: true,
      trim: true,
    },

    maximumMarks: {
      type: Number,
      required: true,
      min: 1,
    },

    passingMarks: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(ExamStatus),
      default: ExamStatus.SCHEDULED,
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

/**
 * ==========================
 * Validation
 * ==========================
 */

// Passing marks cannot exceed maximum marks
examinationSchema.path("passingMarks").validate(
  function (this: IExamination, value: number) {
    return value <= this.maximumMarks;
  },
  "Passing marks cannot exceed maximum marks"
);

// End time must be after start time
examinationSchema.path("endTime").validate(
  function (this: IExamination, value: string) {
    return value > this.startTime;
  },
  "End time must be after start time"
);

/**
 * ==========================
 * Basic Indexes
 * ==========================
 */

examinationSchema.index({ subject: 1 });

examinationSchema.index({ faculty: 1 });

examinationSchema.index({ section: 1 });

examinationSchema.index({ semester: 1 });

examinationSchema.index({ examType: 1 });

examinationSchema.index({ status: 1 });

examinationSchema.index({ date: 1 });

/**
 * ==========================
 * Performance Indexes
 * ==========================
 */

// Faculty schedule lookup
examinationSchema.index({
  faculty: 1,
  date: 1,
});

// Section schedule lookup
examinationSchema.index({
  section: 1,
  date: 1,
});

// Hall allocation lookup
examinationSchema.index({
  hall: 1,
  date: 1,
});

// Subject exam lookup
examinationSchema.index({
  subject: 1,
  examType: 1,
});

// Prevent duplicate exams
examinationSchema.index(
  {
    section: 1,
    subject: 1,
    examType: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

export const Examination = model<IExamination>(
  "Examination",
  examinationSchema
);
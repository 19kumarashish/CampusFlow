import { model,Schema } from "mongoose";

import { Status } from "@/shared/enums/status.enum";

import { ICourse } from "./course.interface";

const courseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      uppercase: true,
      unique: true,
      trim: true,
    },

    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    degree: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    totalSemesters: {
      type: Number,
      required: true,
      min: 1,
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

// Indexes
courseSchema.index({ department: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ name: "text" });

// Export model
export const Course = model<ICourse>(
  "Course",
  courseSchema,
);
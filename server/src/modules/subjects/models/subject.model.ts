import { model,Schema } from "mongoose";

import { Status } from "@/shared/enums/status.enum";
import { SubjectType } from "@/shared/enums/subject-type.enum";

import { ISubject } from "./subject.interface";

const subjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      unique: true, // Creates a unique index
      uppercase: true,
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

    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    credits: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },

    type: {
      type: String,
      enum: Object.values(SubjectType),
      default: SubjectType.THEORY,
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

// Indexes
// code already has a unique index
subjectSchema.index({ course: 1 });
subjectSchema.index({ semester: 1 });
subjectSchema.index({ status: 1 });
subjectSchema.index({ name: "text" });

export const Subject = model<ISubject>(
  "Subject",
  subjectSchema
);
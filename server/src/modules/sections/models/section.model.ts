import { model,Schema } from "mongoose";

import { Status } from "@/shared/enums/status.enum";

import { ISection } from "./section.interface";

const sectionSchema = new Schema<ISection>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    semester: {
      type: Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 300,
    },

    classroom: {
      type: String,
      required: true,
      trim: true,
    },

    facultyAdvisor: {
      type: Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
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

// Optimize queries by semester
sectionSchema.index({ semester: 1 });

// Optimize queries by faculty advisor
sectionSchema.index({ facultyAdvisor: 1 });

// Optimize queries by status
sectionSchema.index({ status: 1 });

// Prevent duplicate section names within the same semester
sectionSchema.index(
  {
    semester: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

// Optimize queries filtering by semester and faculty advisor
sectionSchema.index({
  semester: 1,
  facultyAdvisor: 1,
});

// ======================
// Export Model
// ======================

export const Section = model<ISection>("Section", sectionSchema);
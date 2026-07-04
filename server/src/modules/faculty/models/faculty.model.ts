import { model,Schema } from "mongoose";

import { Designation } from "@/shared/enums/designation.enum";
import { EmploymentType } from "@/shared/enums/employment-type.enum";
import { Status } from "@/shared/enums/status.enum";

import { IFaculty } from "./faculty.interface";

const facultySchema = new Schema<IFaculty>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    employeeId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    designation: {
      type: String,
      enum: Object.values(Designation),
      required: true,
    },

    qualification: {
      type: String,
      required: true,
      trim: true,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    joiningDate: {
      type: Date,
      required: true,
    },

    employmentType: {
      type: String,
      enum: Object.values(EmploymentType),
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

/**
 * Indexes
 */

// Already indexed because of `unique: true`
// facultySchema.index({ employeeId: 1 });

// Already indexed because of `unique: true`
// facultySchema.index({ user: 1 });

facultySchema.index({ department: 1 });

facultySchema.index({ designation: 1 });

facultySchema.index({ status: 1 });

// Useful for common filtering
facultySchema.index({
  department: 1,
  status: 1,
});

// Useful if searching faculty by department + designation
facultySchema.index({
  department: 1,
  designation: 1,
});

// Full-text search
facultySchema.index({
  specialization: "text",
  qualification: "text",
});

export const Faculty = model<IFaculty>("Faculty", facultySchema);
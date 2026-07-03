import { model,Schema } from "mongoose";

import { Status } from "@/shared/enums/status.enum";

import { IDepartment } from "./department.interface";

const departmentSchema = new Schema<IDepartment>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
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

// ==========================
// Indexes
// ==========================

departmentSchema.index({
  name: 1,
});

departmentSchema.index({
  code: 1,
});

departmentSchema.index({
  status: 1,
});

// ==========================
// Model
// ==========================

export const Department = model<IDepartment>(
  "Department",
  departmentSchema,
);
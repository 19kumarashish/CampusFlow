import { model, Schema, Document, Types } from "mongoose";

export interface IScholarshipAllocation extends Document {
  student: Types.ObjectId; // Reference Student
  scholarship: Types.ObjectId; // Reference Scholarship
  allocatedAmount: number;
  academicYear: string;
  status: "PENDING" | "APPROVED" | "RENEWED";
  createdAt: Date;
  updatedAt: Date;
}

const scholarshipAllocationSchema = new Schema<IScholarshipAllocation>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    scholarship: {
      type: Schema.Types.ObjectId,
      ref: "Scholarship",
      required: true,
    },
    allocatedAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    academicYear: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "RENEWED"],
      required: true,
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

scholarshipAllocationSchema.index({ student: 1 });
scholarshipAllocationSchema.index({ academicYear: 1 });

export const ScholarshipAllocation = model<IScholarshipAllocation>(
  "ScholarshipAllocation",
  scholarshipAllocationSchema
);

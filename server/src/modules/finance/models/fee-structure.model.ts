import { model, Schema, Document, Types } from "mongoose";

export interface IFeeStructure extends Document {
  name: string;
  category: "TUITION" | "EXAM" | "HOSTEL" | "OTHER";
  amount: number;
  dueDate: Date;
  finePerDay: number;
  course: Types.ObjectId; // Reference Course
  academicYear: string;
  createdAt: Date;
  updatedAt: Date;
}

const feeStructureSchema = new Schema<IFeeStructure>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["TUITION", "EXAM", "HOSTEL", "OTHER"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    finePerDay: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

feeStructureSchema.index({ course: 1 });
feeStructureSchema.index({ academicYear: 1 });

export const FeeStructure = model<IFeeStructure>("FeeStructure", feeStructureSchema);

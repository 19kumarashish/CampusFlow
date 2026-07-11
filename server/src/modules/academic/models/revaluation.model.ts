import { model, Schema, Document, Types } from "mongoose";

export interface IRevaluation extends Document {
  student: Types.ObjectId;
  result: Types.ObjectId;
  subject: Types.ObjectId;
  originalMarks: number;
  revaluedMarks?: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  feePaid: boolean;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const revaluationSchema = new Schema<IRevaluation>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    result: {
      type: Schema.Types.ObjectId,
      ref: "Result",
      required: true,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    originalMarks: {
      type: Number,
      required: true,
    },
    revaluedMarks: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      required: true,
      default: "PENDING",
    },
    feePaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

revaluationSchema.index({ student: 1 });
revaluationSchema.index({ status: 1 });

export const Revaluation = model<IRevaluation>("Revaluation", revaluationSchema);

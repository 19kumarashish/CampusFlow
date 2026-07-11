import { model, Schema, Document, Types } from "mongoose";

export interface IBacklog extends Document {
  student: Types.ObjectId;
  subject: Types.ObjectId;
  originalSemester: Types.ObjectId;
  attempts: number;
  status: "REGISTERED" | "CLEARED" | "FAILED";
  clearanceDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const backlogSchema = new Schema<IBacklog>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    originalSemester: {
      type: Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
    attempts: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    status: {
      type: String,
      enum: ["REGISTERED", "CLEARED", "FAILED"],
      required: true,
      default: "REGISTERED",
    },
    clearanceDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

backlogSchema.index({ student: 1 });
backlogSchema.index({ subject: 1 });
backlogSchema.index({ status: 1 });

export const Backlog = model<IBacklog>("Backlog", backlogSchema);

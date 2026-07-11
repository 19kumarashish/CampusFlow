import { model, Schema, Document } from "mongoose";

export interface IAcademicEvent extends Document {
  title: string;
  category: "EXAM" | "HOLIDAY" | "WORKSHOP" | "ACTIVITY";
  startDate: Date;
  endDate: Date;
  description?: string;
  isRecurring: boolean;
  recurringType?: "NONE" | "WEEKLY" | "MONTHLY" | "YEARLY";
  createdAt: Date;
  updatedAt: Date;
}

const academicEventSchema = new Schema<IAcademicEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["EXAM", "HOLIDAY", "WORKSHOP", "ACTIVITY"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isRecurring: {
      type: Boolean,
      required: true,
      default: false,
    },
    recurringType: {
      type: String,
      enum: ["NONE", "WEEKLY", "MONTHLY", "YEARLY"],
      required: true,
      default: "NONE",
    },
  },
  {
    timestamps: true,
  }
);

academicEventSchema.index({ category: 1 });
academicEventSchema.index({ startDate: 1 });

export const AcademicEvent = model<IAcademicEvent>("AcademicEvent", academicEventSchema);

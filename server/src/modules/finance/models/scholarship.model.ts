import { model, Schema, Document } from "mongoose";

export interface IScholarship extends Document {
  name: string;
  type: "MERIT" | "NEED" | "SPECIAL";
  description?: string;
  discountPercentage: number;
  criteria: string;
  createdAt: Date;
  updatedAt: Date;
}

const scholarshipSchema = new Schema<IScholarship>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["MERIT", "NEED", "SPECIAL"],
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    criteria: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

scholarshipSchema.index({ type: 1 });

export const Scholarship = model<IScholarship>("Scholarship", scholarshipSchema);

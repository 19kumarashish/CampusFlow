import { model, Schema, Document, Types } from "mongoose";

export interface IPromotionHistory extends Document {
  student: Types.ObjectId;
  fromSemester: Types.ObjectId;
  toSemester: Types.ObjectId;
  academicYear: string;
  rollNumber: string;
  processedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const promotionHistorySchema = new Schema<IPromotionHistory>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    fromSemester: {
      type: Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
    toSemester: {
      type: Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
      trim: true,
    },
    rollNumber: {
      type: String,
      required: true,
      trim: true,
    },
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

promotionHistorySchema.index({ student: 1 });
promotionHistorySchema.index({ academicYear: 1 });

export const PromotionHistory = model<IPromotionHistory>(
  "PromotionHistory",
  promotionHistorySchema
);

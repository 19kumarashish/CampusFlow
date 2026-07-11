import { model, Schema, Document, Types } from "mongoose";

export interface IBorrowRecord extends Document {
  book: Types.ObjectId; // Reference Book
  student: Types.ObjectId; // Reference Student
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: "BORROWED" | "RETURNED" | "LOST";
  fineAmount: number;
  conditionOnReturn?: string;
  createdAt: Date;
  updatedAt: Date;
}

const borrowRecordSchema = new Schema<IBorrowRecord>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    borrowDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["BORROWED", "RETURNED", "LOST"],
      required: true,
      default: "BORROWED",
    },
    fineAmount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    conditionOnReturn: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

borrowRecordSchema.index({ student: 1 });
borrowRecordSchema.index({ book: 1 });
borrowRecordSchema.index({ status: 1 });

export const BorrowRecord = model<IBorrowRecord>("BorrowRecord", borrowRecordSchema);

import { model, Schema, Document } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  publisher?: string;
  isbn: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  rackLocation?: string;
  status: "AVAILABLE" | "DAMAGED" | "LOST";
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    publisher: {
      type: String,
      trim: true,
    },
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    totalCopies: {
      type: Number,
      required: true,
      default: 1,
      min: 0,
    },
    availableCopies: {
      type: Number,
      required: true,
      default: 1,
      min: 0,
    },
    rackLocation: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["AVAILABLE", "DAMAGED", "LOST"],
      required: true,
      default: "AVAILABLE",
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.index({ isbn: 1 });
bookSchema.index({ category: 1 });

export const Book = model<IBook>("Book", bookSchema);

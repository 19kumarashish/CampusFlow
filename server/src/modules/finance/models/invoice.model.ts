import { model, Schema, Document, Types } from "mongoose";

export interface IInvoice extends Document {
  invoiceNumber: string;
  student: Types.ObjectId; // Reference Student
  ledger: Types.ObjectId; // Reference FeeLedger
  amount: number;
  dueDate: Date;
  status: "PAID" | "UNPAID";
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    ledger: {
      type: Schema.Types.ObjectId,
      ref: "FeeLedger",
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
    status: {
      type: String,
      enum: ["PAID", "UNPAID"],
      required: true,
      default: "UNPAID",
    },
  },
  {
    timestamps: true,
  }
);

invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ student: 1 });

export const Invoice = model<IInvoice>("Invoice", invoiceSchema);

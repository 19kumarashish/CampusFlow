import { model, Schema, Document, Types } from "mongoose";

export interface IPayment extends Document {
  student: Types.ObjectId; // Reference Student
  ledger: Types.ObjectId; // Reference FeeLedger
  amount: number;
  paymentMethod: "ONLINE" | "CASH" | "CHEQUE";
  transactionId: string;
  status: "SUCCESS" | "FAILED" | "REFUNDED";
  receiptNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
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
    paymentMethod: {
      type: String,
      enum: ["ONLINE", "CASH", "CHEQUE"],
      required: true,
      default: "ONLINE",
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "REFUNDED"],
      required: true,
      default: "SUCCESS",
    },
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ student: 1 });
paymentSchema.index({ transactionId: 1 });

export const Payment = model<IPayment>("Payment", paymentSchema);

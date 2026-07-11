import { model, Schema, Document, Types } from "mongoose";

export interface IFeeLedger extends Document {
  student: Types.ObjectId; // Reference Student
  feeStructure: Types.ObjectId; // Reference FeeStructure
  amountPaid: number;
  balanceAmount: number;
  discount: number;
  status: "PAID" | "PARTIAL" | "UNPAID";
  createdAt: Date;
  updatedAt: Date;
}

const feeLedgerSchema = new Schema<IFeeLedger>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    feeStructure: {
      type: Schema.Types.ObjectId,
      ref: "FeeStructure",
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    balanceAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["PAID", "PARTIAL", "UNPAID"],
      required: true,
      default: "UNPAID",
    },
  },
  {
    timestamps: true,
  }
);

feeLedgerSchema.index({ student: 1 });
feeLedgerSchema.index({ feeStructure: 1 });
feeLedgerSchema.index({ status: 1 });

export const FeeLedger = model<IFeeLedger>("FeeLedger", feeLedgerSchema);

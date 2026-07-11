import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { FeeStructure } from "../models/fee-structure.model";
import { FeeLedger } from "../models/fee-ledger.model";
import { Scholarship } from "../models/scholarship.model";
import { ScholarshipAllocation } from "../models/scholarship-allocation.model";
import { Payment } from "../models/payment.model";
import { Invoice } from "../models/invoice.model";
import { Student } from "../../students/models/student.model";

// --- FEE STRUCTURES ---
export const createFeeStructure = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, category, amount, dueDate, finePerDay, course, academicYear } = req.body;
    const structure = await FeeStructure.create({
      name,
      category,
      amount: Number(amount),
      dueDate: new Date(dueDate),
      finePerDay: Number(finePerDay || 0),
      course: new Types.ObjectId(course),
      academicYear,
    });
    res.status(201).json({ success: true, message: "Fee structure template defined", data: structure });
  } catch (error) {
    next(error);
  }
};

export const getFeeStructures = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const list = await FeeStructure.find().populate("course").sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

// --- LEDGER & INVOICES ---
export const getLedgers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { studentId } = req.query;
    const filter: any = {};
    if (studentId) filter.student = new Types.ObjectId(studentId as string);

    const list = await FeeLedger.find(filter)
      .populate({
        path: "student",
        populate: { path: "user", select: "firstName lastName email" }
      })
      .populate("feeStructure")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

export const assignFeesToStudents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { feeStructureId } = req.body;
    const structure = await FeeStructure.findById(feeStructureId);
    if (!structure) {
       res.status(404).json({ success: false, message: "Fee template not found" });
       return;
    }

    // Get all students matching this course
    const matchingStudents = await Student.find({ course: structure.course });

    const createdLedgers = [];
    for (const st of matchingStudents) {
      // Check if already assigned
      const existing = await FeeLedger.findOne({ student: st._id, feeStructure: structure._id });
      if (existing) continue;

      const ledger = await FeeLedger.create({
        student: st._id,
        feeStructure: structure._id,
        balanceAmount: structure.amount,
        amountPaid: 0,
        discount: 0,
        status: "UNPAID",
      });

      // Generate invoice
      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
      await Invoice.create({
        invoiceNumber,
        student: st._id,
        ledger: ledger._id,
        amount: structure.amount,
        dueDate: structure.dueDate,
        status: "UNPAID",
      });

      createdLedgers.push(ledger);
    }

    res.status(200).json({
      success: true,
      message: `Assigned fee term ledger & invoice sheets for ${createdLedgers.length} students`,
      data: createdLedgers,
    });
  } catch (error) {
    next(error);
  }
};

export const getInvoices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { studentId } = req.query;
    const filter: any = {};
    if (studentId) filter.student = new Types.ObjectId(studentId as string);

    const list = await Invoice.find(filter)
      .populate({
        path: "student",
        populate: { path: "user", select: "firstName lastName email" }
      })
      .populate({
        path: "ledger",
        populate: { path: "feeStructure" }
      })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

// --- SCHOLARSHIPS ---
export const createScholarship = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, type, description, discountPercentage, criteria } = req.body;
    const scholarship = await Scholarship.create({
      name,
      type,
      description,
      discountPercentage: Number(discountPercentage),
      criteria,
    });
    res.status(201).json({ success: true, data: scholarship });
  } catch (error) {
    next(error);
  }
};

export const getScholarships = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const list = await Scholarship.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

export const allocateScholarship = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { studentId, scholarshipId, academicYear } = req.body;

    const student = await Student.findById(studentId);
    const scholarship = await Scholarship.findById(scholarshipId);

    if (!student || !scholarship) {
       res.status(404).json({ success: false, message: "Student or Scholarship template not found" });
       return;
    }

    // Check outstanding fee ledgers
    const ledger = await FeeLedger.findOne({ student: studentId }).sort({ createdAt: -1 });
    let allocatedAmount = 0;
    if (ledger) {
      // Calculate discount amount based on fee structure
      allocatedAmount = (ledger.balanceAmount * scholarship.discountPercentage) / 100;
      ledger.discount = ledger.discount + allocatedAmount;
      ledger.balanceAmount = Math.max(ledger.balanceAmount - allocatedAmount, 0);
      if (ledger.balanceAmount === 0) {
        ledger.status = "PAID";
      } else if (ledger.amountPaid > 0) {
        ledger.status = "PARTIAL";
      }
      await ledger.save();

      // Also update invoice status if invoice exists
      const invoice = await Invoice.findOne({ ledger: ledger._id });
      if (invoice) {
        invoice.amount = ledger.balanceAmount;
        if (ledger.balanceAmount === 0) {
          invoice.status = "PAID";
        }
        await invoice.save();
      }
    }

    const allocation = await ScholarshipAllocation.create({
      student: new Types.ObjectId(studentId),
      scholarship: new Types.ObjectId(scholarshipId),
      allocatedAmount,
      academicYear,
      status: "APPROVED",
    });

    res.status(200).json({
      success: true,
      message: `Scholarship granted. Discount amount: $${allocatedAmount} applied to student balance sheet.`,
      data: allocation,
    });
  } catch (error) {
    next(error);
  }
};

export const getScholarshipAllocations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const list = await ScholarshipAllocation.find()
      .populate({
        path: "student",
        populate: { path: "user", select: "firstName lastName email" }
      })
      .populate("scholarship")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

// --- PAYMENTS ---
export const executePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { studentId, ledgerId, amount, paymentMethod } = req.body;
    const ledger = await FeeLedger.findById(ledgerId);

    if (!ledger) {
       res.status(404).json({ success: false, message: "Student outstanding ledger not found" });
       return;
    }

    const chargeAmount = Number(amount);
    if (chargeAmount > ledger.balanceAmount) {
       res.status(400).json({ success: false, message: "Payment amount exceeds balance due" });
       return;
    }

    // Process ledger update
    ledger.amountPaid = ledger.amountPaid + chargeAmount;
    ledger.balanceAmount = Math.max(ledger.balanceAmount - chargeAmount, 0);
    ledger.status = ledger.balanceAmount === 0 ? "PAID" : "PARTIAL";
    await ledger.save();

    // Update invoice status if fully paid
    const invoice = await Invoice.findOne({ ledger: ledger._id });
    if (invoice) {
      if (ledger.balanceAmount === 0) {
        invoice.status = "PAID";
      }
      await invoice.save();
    }

    const transactionId = `TXN-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const receiptNumber = `RCPT-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payRecord = await Payment.create({
      student: new Types.ObjectId(studentId),
      ledger: new Types.ObjectId(ledgerId),
      amount: chargeAmount,
      paymentMethod: paymentMethod || "ONLINE",
      transactionId,
      status: "SUCCESS",
      receiptNumber,
    });

    res.status(201).json({
      success: true,
      message: `Transaction processed. Receipt #${receiptNumber} generated.`,
      data: payRecord,
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { studentId } = req.query;
    const filter: any = {};
    if (studentId) filter.student = new Types.ObjectId(studentId as string);

    const list = await Payment.find(filter)
      .populate({
        path: "student",
        populate: { path: "user", select: "firstName lastName email" }
      })
      .populate({
        path: "ledger",
        populate: { path: "feeStructure" }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

export const refundPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const pay = await Payment.findById(id);

    if (!pay) {
       res.status(404).json({ success: false, message: "Transaction record not found" });
       return;
    }

    pay.status = "REFUNDED";
    await pay.save();

    // Revert balance on ledger
    const ledger = await FeeLedger.findById(pay.ledger);
    if (ledger) {
      ledger.amountPaid = Math.max(ledger.amountPaid - pay.amount, 0);
      ledger.balanceAmount = ledger.balanceAmount + pay.amount;
      ledger.status = ledger.amountPaid === 0 ? "UNPAID" : "PARTIAL";
      await ledger.save();
    }

    res.status(200).json({ success: true, message: "Payment transaction marked as refunded", data: pay });
  } catch (error) {
    next(error);
  }
};

import { Router } from "express";
import { protect } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/shared/enums/user-role.enum";

import {
  createFeeStructure,
  getFeeStructures,
  getLedgers,
  assignFeesToStudents,
  getInvoices,
  createScholarship,
  getScholarships,
  allocateScholarship,
  getScholarshipAllocations,
  executePayment,
  getPaymentHistory,
  refundPayment,
} from "../controllers/finance.controller";

const router = Router();

// Fee templates & mapping
router.post("/fee-structures", protect, authorize(UserRole.ADMIN), createFeeStructure);
router.get("/fee-structures", protect, getFeeStructures);
router.post("/assign-fees", protect, authorize(UserRole.ADMIN), assignFeesToStudents);

// Student ledger & bills
router.get("/ledger", protect, getLedgers);
router.get("/invoices", protect, getInvoices);

// Scholarships
router.post("/scholarships", protect, authorize(UserRole.ADMIN), createScholarship);
router.get("/scholarships", protect, getScholarships);
router.post("/scholarships/allocate", protect, authorize(UserRole.ADMIN), allocateScholarship);
router.get("/scholarships/allocations", protect, getScholarshipAllocations);

// Payment processing
router.post("/payments/charge", protect, executePayment);
router.get("/payments/history", protect, getPaymentHistory);
router.post("/payments/:id/refund", protect, authorize(UserRole.ADMIN), refundPayment);

export default router;

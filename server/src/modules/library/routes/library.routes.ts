import { Router } from "express";
import { protect } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/authorize.middleware";
import { UserRole } from "@/shared/enums/user-role.enum";

import {
  createBook,
  getBooks,
  updateBook,
  deleteBook,
  getBorrowRecords,
  borrowBook,
  returnBook,
  waiveFine,
} from "../controllers/library.controller";

const router = Router();

// Books management
router.post("/books", protect, authorize(UserRole.ADMIN), createBook);
router.get("/books", protect, getBooks);
router.patch("/books/:id", protect, authorize(UserRole.ADMIN), updateBook);
router.delete("/books/:id", protect, authorize(UserRole.ADMIN), deleteBook);

// Circulation management
router.get("/borrow-records", protect, getBorrowRecords);
router.post("/borrow", protect, authorize(UserRole.ADMIN), borrowBook);
router.post("/return", protect, authorize(UserRole.ADMIN), returnBook);
router.patch("/borrow-records/:id/waive", protect, authorize(UserRole.ADMIN), waiveFine);

export default router;

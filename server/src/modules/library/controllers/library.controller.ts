import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { Book } from "../models/book.model";
import { BorrowRecord } from "../models/borrow-record.model";
import { Student } from "../../students/models/student.model";

// --- BOOK CRUD ---
export const createBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, author, publisher, isbn, category, totalCopies, rackLocation } = req.body;

    const book = await Book.create({
      title,
      author,
      publisher,
      isbn,
      category,
      totalCopies: Number(totalCopies || 1),
      availableCopies: Number(totalCopies || 1),
      rackLocation,
      status: "AVAILABLE",
    });

    res.status(201).json({ success: true, data: book });
  } catch (error) {
    next(error);
  }
};

export const getBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { search, category } = req.query;
    const filter: any = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search as string, $options: "i" } },
        { author: { $regex: search as string, $options: "i" } },
        { isbn: { $regex: search as string, $options: "i" } },
      ];
    }
    if (category && category !== "ALL") {
      filter.category = category;
    }

    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: books });
  } catch (error) {
    next(error);
  }
};

export const updateBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
       res.status(404).json({ success: false, message: "Book registry entry not found" });
       return;
    }

    const originalTotal = book.totalCopies;
    const updated = await Book.findByIdAndUpdate(
      id,
      {
        ...req.body,
        availableCopies: req.body.totalCopies !== undefined
          ? book.availableCopies + (Number(req.body.totalCopies) - originalTotal)
          : book.availableCopies
      },
      { new: true }
    );

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);

    if (!book) {
       res.status(404).json({ success: false, message: "Book not found" });
       return;
    }

    res.status(200).json({ success: true, message: "Book registry removed successfully" });
  } catch (error) {
    next(error);
  }
};

// --- CIRCULATION: BORROW & RETURN ---
export const getBorrowRecords = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { studentId, status } = req.query;
    const filter: any = {};

    if (studentId) filter.student = new Types.ObjectId(studentId as string);
    if (status) filter.status = status;

    const list = await BorrowRecord.find(filter)
      .populate("book")
      .populate({
        path: "student",
        populate: { path: "user", select: "firstName lastName email" }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: list });
  } catch (error) {
    next(error);
  }
};

export const borrowBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { studentId, bookId, dueDate } = req.body;

    const student = await Student.findById(studentId);
    const book = await Book.findById(bookId);

    if (!student || !book) {
       res.status(404).json({ success: false, message: "Student or Book registry not found" });
       return;
    }

    if (book.availableCopies <= 0) {
       res.status(400).json({ success: false, message: "No available copies left for this book title" });
       return;
    }

    // Check student borrow limits (e.g. max 5 borrowed books)
    const activeBorrows = await BorrowRecord.countDocuments({ student: studentId, status: "BORROWED" });
    if (activeBorrows >= 5) {
       res.status(400).json({ success: false, message: "Student borrow quota limit exceeded (Max: 5 titles)" });
       return;
    }

    // Issue book
    book.availableCopies = book.availableCopies - 1;
    await book.save();

    const record = await BorrowRecord.create({
      book: new Types.ObjectId(bookId),
      student: new Types.ObjectId(studentId),
      borrowDate: new Date(),
      dueDate: new Date(dueDate),
      status: "BORROWED",
      fineAmount: 0,
    });

    res.status(201).json({
      success: true,
      message: `Book "${book.title}" issued successfully`,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

export const returnBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { borrowRecordId, conditionOnReturn, markAsLost } = req.body;
    const record = await BorrowRecord.findById(borrowRecordId);

    if (!record) {
       res.status(404).json({ success: false, message: "Borrow transaction log not found" });
       return;
    }

    if (record.status !== "BORROWED") {
       res.status(400).json({ success: false, message: "This book copy was already returned" });
       return;
    }

    const bookObj = await Book.findById(record.book);
    if (bookObj) {
      if (markAsLost) {
        bookObj.totalCopies = Math.max(bookObj.totalCopies - 1, 0);
        // Retain availableCopies reduction since it's lost
      } else {
        bookObj.availableCopies = bookObj.availableCopies + 1;
      }
      await bookObj.save();
    }

    record.returnDate = new Date();
    record.conditionOnReturn = conditionOnReturn || "Good";
    record.status = markAsLost ? "LOST" : "RETURNED";

    // Auto Fine Calculation (e.g. $1 per day overdue)
    const dueTime = new Date(record.dueDate).getTime();
    const returnTime = Date.now();
    let fineAmount = 0;
    if (returnTime > dueTime) {
      const overdueDays = Math.ceil((returnTime - dueTime) / (1000 * 60 * 60 * 24));
      fineAmount = overdueDays * 1; // $1 fine per day
    }
    if (markAsLost) {
      fineAmount = fineAmount + 50; // $50 penalty flat for losing book
    }
    record.fineAmount = fineAmount;

    await record.save();

    res.status(200).json({
      success: true,
      message: markAsLost
        ? `Book copy recorded as lost. $50 penalty applied.`
        : `Book returned successfully. Late fine: $${fineAmount}.`,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

export const waiveFine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const record = await BorrowRecord.findById(id);

    if (!record) {
       res.status(404).json({ success: false, message: "Circulation log entry not found" });
       return;
    }

    record.fineAmount = 0;
    await record.save();

    res.status(200).json({
      success: true,
      message: "Fine waived successfully",
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

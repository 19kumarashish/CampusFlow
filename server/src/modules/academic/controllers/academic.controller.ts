import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { PromotionHistory } from "../models/promotion-history.model";
import { Backlog } from "../models/backlog.model";
import { Revaluation } from "../models/revaluation.model";
import { AcademicEvent } from "../models/academic-event.model";
import { Student } from "../../students/models/student.model";
import { Result } from "../../results/models/result.model";
import { Semester } from "../../semesters/models/semester.model";
import { Grade } from "@/shared/enums/grade.enum";

// --- PROMOTIONS ---
export const promoteStudents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { studentIds, fromSemesterId, toSemesterId, academicYear } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || !fromSemesterId || !toSemesterId || !academicYear) {
       res.status(400).json({ success: false, message: "Missing required promotion parameters" });
       return;
    }

    const semesterDoc = await Semester.findById(toSemesterId);
    if (!semesterDoc) {
       res.status(404).json({ success: false, message: "Target promotion semester record not found" });
       return;
    }

    const processedBy = (req as any).user?._id;
    if (!processedBy) {
       res.status(401).json({ success: false, message: "Unauthorized processed identity reference" });
       return;
    }

    const historyRecords = [];
    for (const sid of studentIds) {
      const studentObj = await Student.findById(sid);
      if (!studentObj) continue;

      // Update student details (currentSemester is number)
      studentObj.currentSemester = semesterDoc.semesterNumber;
      // Generate new roll number logic (e.g. prefix + increment or retain current roll number)
      const rollNumber = studentObj.rollNumber || `R-${Date.now().toString().slice(-6)}`;
      studentObj.rollNumber = rollNumber;
      await studentObj.save();

      // Create history record
      const record = await PromotionHistory.create({
        student: new Types.ObjectId(sid),
        fromSemester: new Types.ObjectId(fromSemesterId),
        toSemester: new Types.ObjectId(toSemesterId),
        academicYear,
        rollNumber,
        processedBy: new Types.ObjectId(processedBy),
      });
      historyRecords.push(record);
    }

    res.status(200).json({
      success: true,
      message: `${historyRecords.length} student(s) promoted successfully`,
      data: historyRecords,
    });
  } catch (error) {
    next(error);
  }
};

export const getPromotionHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const history = await PromotionHistory.find()
      .populate("student")
      .populate("fromSemester")
      .populate("toSemester")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

// --- BACKLOGS ---
export const getBacklogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { studentId, status } = req.query;
    const filter: any = {};

    if (studentId) filter.student = new Types.ObjectId(studentId as string);
    if (status) filter.status = status;

    const backlogs = await Backlog.find(filter)
      .populate({
        path: "student",
        populate: { path: "user", select: "firstName lastName email" }
      })
      .populate("subject")
      .populate("originalSemester")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: backlogs,
    });
  } catch (error) {
    next(error);
  }
};

export const createBacklog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { student, subject, originalSemester, attempts } = req.body;

    const backlog = await Backlog.create({
      student: new Types.ObjectId(student),
      subject: new Types.ObjectId(subject),
      originalSemester: new Types.ObjectId(originalSemester),
      attempts: attempts || 1,
      status: "REGISTERED",
    });

    res.status(201).json({
      success: true,
      message: "Backlog registered successfully",
      data: backlog,
    });
  } catch (error) {
    next(error);
  }
};

export const clearBacklog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const backlog = await Backlog.findById(id);

    if (!backlog) {
       res.status(404).json({ success: false, message: "Backlog record not found" });
       return;
    }

    backlog.status = "CLEARED";
    backlog.clearanceDate = new Date();
    await backlog.save();

    res.status(200).json({
      success: true,
      message: "Backlog marked as cleared successfully",
      data: backlog,
    });
  } catch (error) {
    next(error);
  }
};

// --- REVALUATIONS ---
export const getRevaluations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { studentId, status } = req.query;
    const filter: any = {};

    if (studentId) filter.student = new Types.ObjectId(studentId as string);
    if (status) filter.status = status;

    const list = await Revaluation.find(filter)
      .populate({
        path: "student",
        populate: { path: "user", select: "firstName lastName email" }
      })
      .populate("subject")
      .populate("result")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

export const createRevaluationRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { student, result, subject, originalMarks } = req.body;

    const requestObj = await Revaluation.create({
      student: new Types.ObjectId(student),
      result: new Types.ObjectId(result),
      subject: new Types.ObjectId(subject),
      originalMarks,
      status: "PENDING",
      feePaid: true, // Simulation: pre-paid
    });

    res.status(201).json({
      success: true,
      message: "Revaluation review request received",
      data: requestObj,
    });
  } catch (error) {
    next(error);
  }
};

export const approveRevaluationRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { revaluedMarks, status } = req.body; // APPROVED or REJECTED

    const reqObj = await Revaluation.findById(id);
    if (!reqObj) {
       res.status(404).json({ success: false, message: "Revaluation record not found" });
       return;
    }

    reqObj.status = status || "APPROVED";
    if (status !== "REJECTED" && revaluedMarks !== undefined) {
      reqObj.revaluedMarks = Number(revaluedMarks);

      // Update actual Result document
      const resultDoc = await Result.findById(reqObj.result);
      if (resultDoc) {
        resultDoc.totalMarks = Number(revaluedMarks);
        // Calculate new percentage & grade based on course marks limits if applicable
        const maxMarks = 100;
        resultDoc.percentage = (Number(revaluedMarks) / maxMarks) * 100;
        resultDoc.grade =
          resultDoc.percentage >= 90
            ? Grade.A
            : resultDoc.percentage >= 80
            ? Grade.B
            : resultDoc.percentage >= 70
            ? Grade.C
            : resultDoc.percentage >= 60
            ? Grade.D
            : Grade.F;
        await resultDoc.save();
      }
    }

    await reqObj.save();

    res.status(200).json({
      success: true,
      message: "Revaluation status updated successfully",
      data: reqObj,
    });
  } catch (error) {
    next(error);
  }
};

// --- ACADEMIC CALENDAR ---
export const getAcademicEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const events = await AcademicEvent.find().sort({ startDate: 1 });
    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

export const createAcademicEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, category, startDate, endDate, description, isRecurring, recurringType } = req.body;

    const event = await AcademicEvent.create({
      title,
      category,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      description,
      isRecurring: !!isRecurring,
      recurringType: recurringType || "NONE",
    });

    res.status(201).json({
      success: true,
      message: "Academic calendar event created",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAcademicEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const event = await AcademicEvent.findByIdAndUpdate(id, req.body, { new: true });

    if (!event) {
       res.status(404).json({ success: false, message: "Calendar event not found" });
       return;
    }

    res.status(200).json({
      success: true,
      message: "Academic event updated successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAcademicEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const event = await AcademicEvent.findByIdAndDelete(id);

    if (!event) {
       res.status(404).json({ success: false, message: "Event not found" });
       return;
    }

    res.status(200).json({
      success: true,
      message: "Academic calendar event deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

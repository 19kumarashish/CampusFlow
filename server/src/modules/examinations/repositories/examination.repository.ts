import type { QueryFilter } from "mongoose";

import { ExamStatus } from "@/shared/enums/exam-status.enum";

import { IExamResult } from "../models/exam-result.interface";
import { ExamResult } from "../models/exam-result.model";
import { IExamination } from "../models/examination.interface";
import { Examination } from "../models/examination.model";
import {
  GetExaminationsQueryInput,
  GetExamResultsQueryInput,
} from "../validators/examination.validator";

class ExaminationRepository {
  /**
   * =========================
   * Examination Methods
   * =========================
   */

  async createExamination(
    data: Partial<IExamination>,
  ) {
    return Examination.create(data);
  }

  async findExaminationById(
    id: string,
  ) {
    return Examination.findById(id)
      .populate("subject")
      .populate({
        path: "faculty",
        populate: {
          path: "user",
        },
      })
      .populate("section")
      .populate("semester");
  }

  async findScheduledExamination(
    id: string,
  ) {
    return Examination.findOne({
      _id: id,
      status: ExamStatus.SCHEDULED,
      deletedAt: null,
    });
  }

  async findFacultyConflicts(
    facultyId: string,
    date: Date,
  ) {
    return Examination.find({
      faculty: facultyId,
      date,
      deletedAt: null,
    });
  }

  async findSectionConflicts(
    sectionId: string,
    date: Date,
  ) {
    return Examination.find({
      section: sectionId,
      date,
      deletedAt: null,
    });
  }

  async findHallConflicts(
    hall: string,
    date: Date,
  ) {
    return Examination.find({
      hall,
      date,
      deletedAt: null,
    });
  }

  async findExaminations(
    query: GetExaminationsQueryInput,
  ) {
    const {
      page,
      limit,
      subject,
      faculty,
      section,
      semester,
      examType,
      status,
      sortBy,
      sortOrder,
    } = query;

    const filter: QueryFilter<IExamination> = {
      deletedAt: null,
    };

    if (subject) filter.subject = subject;
    if (faculty) filter.faculty = faculty;
    if (section) filter.section = section;
    if (semester) filter.semester = semester;
    if (examType) filter.examType = examType;
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const [examinations, total] =
      await Promise.all([
        Examination.find(filter)
          .populate("subject")
          .populate({
            path: "faculty",
            populate: {
              path: "user",
            },
          })
          .populate("section")
          .populate("semester")
          .sort({
            [sortBy]:
              sortOrder === "asc"
                ? 1
                : -1,
          })
          .skip(skip)
          .limit(limit),

        Examination.countDocuments(
          filter,
        ),
      ]);

    return {
      examinations,

      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(
          total / limit,
        ),
        hasNextPage:
          page <
          Math.ceil(total / limit),
        hasPreviousPage:
          page > 1,
      },
    };
  }

  async updateExamination(
    id: string,
    data: Partial<IExamination>,
  ) {
    return Examination.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async softDeleteExamination(
    id: string,
  ) {
    return Examination.findByIdAndUpdate(
      id,
      {
        deletedAt: new Date(),
      },
      {
        new: true,
      },
    );
  }

  /**
   * =========================
   * Exam Result Methods
   * =========================
   */

  async createExamResult(
    data: Partial<IExamResult>,
  ) {
    return ExamResult.create(data);
  }

  async findExamResultById(
    id: string,
  ) {
    return ExamResult.findById(id)
      .populate("examination")
      .populate({
        path: "enrollment",
        populate: {
          path: "student",
        },
      });
  }

  async findStudentResult(
    examinationId: string,
    enrollmentId: string,
  ) {
    return ExamResult.findOne({
      examination:
        examinationId,
      enrollment:
        enrollmentId,
    });
  }

  async findExamResults(
    query: GetExamResultsQueryInput,
  ) {
    const {
      page,
      limit,
      examination,
      enrollment,
      grade,
      sortBy,
      sortOrder,
    } = query;

    const filter: QueryFilter<IExamResult> =
      {};

    if (examination)
      filter.examination =
        examination;

    if (enrollment)
      filter.enrollment =
        enrollment;

    if (grade)
      filter.grade = grade;

    const skip =
      (page - 1) * limit;

    const [results, total] =
      await Promise.all([
        ExamResult.find(filter)
          .populate(
            "examination",
          )
          .populate({
            path: "enrollment",
            populate: {
              path: "student",
            },
          })
          .sort({
            [sortBy]:
              sortOrder === "asc"
                ? 1
                : -1,
          })
          .skip(skip)
          .limit(limit),

        ExamResult.countDocuments(
          filter,
        ),
      ]);

    return {
      results,

      pagination: {
        total,
        page,
        limit,
        totalPages:
          Math.ceil(
            total / limit,
          ),
        hasNextPage:
          page <
          Math.ceil(
            total / limit,
          ),
        hasPreviousPage:
          page > 1,
      },
    };
  }

  async updateExamResult(
    id: string,
    data: Partial<IExamResult>,
  ) {
    return ExamResult.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async deleteExamResult(
    id: string,
  ) {
    return ExamResult.findByIdAndDelete(
      id,
    );
  }

  async getStudentExamMarks(
    enrollmentId: string,
    subjectId: string,
  ) {
    const examinations = await Examination.find({
      subject: subjectId,
      deletedAt: null,
    });

    if (!examinations.length) {
      return null;
    }

    const examIds = examinations.map((e) => e._id);

    const results = await ExamResult.find({
      examination: { $in: examIds },
      enrollment: enrollmentId,
    });

    if (results.length < examinations.length) {
      return null;
    }

    const totalMarks = results.reduce(
      (sum, res) => sum + res.obtainedMarks,
      0,
    );

    return { obtainedMarks: totalMarks };
  }
}

export const examinationRepository =
  new ExaminationRepository();
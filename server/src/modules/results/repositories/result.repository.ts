import type { QueryFilter } from "mongoose";

import { Enrollment } from "@/modules/enrollments/models/enrollment.model";

import { IResult } from "../models/result.interface";
import { Result } from "../models/result.model";
import { ISemesterResult } from "../models/semester-result.interface";
import { SemesterResult } from "../models/semester-result.model";
import {
  GetResultsQueryInput,
  GetSemesterResultsQueryInput,
} from "../validators/result.validator";

class ResultRepository {
  // ==========================
  // Result
  // ==========================

  async createResult(
    data: Partial<IResult>,
  ) {
    return Result.create(data);
  }

  async findResultById(
    id: string,
  ) {
    return Result.findById(id)
      .populate("subject")
      .populate({
        path: "enrollment",
        populate: {
          path: "student",
        },
      });
  }

  async findStudentSubjectResult(
    enrollmentId: string,
    subjectId: string,
  ) {
    return Result.findOne({
      enrollment: enrollmentId,
      subject: subjectId,
    });
  }

  async findResults(
    query: GetResultsQueryInput,
  ) {
    const {
      page,
      limit,
      enrollment,
      subject,
      status,
      sortBy,
      sortOrder,
    } = query;

    const filter: QueryFilter<IResult> = {};

    if (enrollment) {
      filter.enrollment = enrollment;
    }

    if (subject) {
      filter.subject = subject;
    }

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [results, total] =
      await Promise.all([
        Result.find(filter)
          .populate("subject")
          .populate("enrollment")
          .sort({
            [sortBy]:
              sortOrder === "asc"
                ? 1
                : -1,
          })
          .skip(skip)
          .limit(limit),

        Result.countDocuments(filter),
      ]);

    return {
      results,
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
        hasPreviousPage: page > 1,
      },
    };
  }

  async updateResult(
    id: string,
    data: Partial<IResult>,
  ) {
    return Result.findByIdAndUpdate(
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

  // ==========================
  // Semester Result
  // ==========================

  async createSemesterResult(
    data: Partial<ISemesterResult>,
  ) {
    return SemesterResult.create(
      data,
    );
  }

  async findSemesterResult(
    enrollmentId: string,
    semesterId: string,
  ) {
    return SemesterResult.findOne({
      enrollment: enrollmentId,
      semester: semesterId,
    });
  }

  async findSemesterResultById(
    id: string,
  ) {
    return SemesterResult.findById(id)
      .populate("semester")
      .populate({
        path: "enrollment",
        populate: {
          path: "student",
        },
      });
  }

  async updateSemesterResult(
    id: string,
    data: Partial<ISemesterResult>,
  ) {
    return SemesterResult.findByIdAndUpdate(
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

  async findSemesterResults(
    query: GetSemesterResultsQueryInput,
  ) {
    const {
      page,
      limit,
      enrollment,
      semester,
      status,
      sortBy,
      sortOrder,
    } = query;

    const filter: QueryFilter<ISemesterResult> =
      {};

    if (enrollment) {
      filter.enrollment =
        enrollment;
    }

    if (semester) {
      filter.semester =
        semester;
    }

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [
      semesterResults,
      total,
    ] = await Promise.all([
      SemesterResult.find(filter)
        .populate("semester")
        .populate("enrollment")
        .sort({
          [sortBy]:
            sortOrder === "asc"
              ? 1
              : -1,
        })
        .skip(skip)
        .limit(limit),

      SemesterResult.countDocuments(
        filter,
      ),
    ]);

    return {
      semesterResults,
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

  async findResultsBySemester(
    enrollmentId: string,
    _semesterId: string,
  ) {
    return Result.find({
      enrollment: enrollmentId,
    }).populate("subject");
  }

  async findPreviousSemesterResults(
    enrollmentId: string,
  ) {
    const currentEnrollment = await Enrollment.findById(enrollmentId);
    if (!currentEnrollment) return [];

    const studentId = currentEnrollment.student;
    const studentEnrollments = await Enrollment.find({
      student: studentId,
    });
    const enrollmentIds = studentEnrollments.map((e) => e._id);

    return SemesterResult.find({
      enrollment: { $in: enrollmentIds, $ne: enrollmentId },
    });
  }
}

export const resultRepository =
  new ResultRepository();
import { Types } from "mongoose";

import { assignmentRepository } from "@/modules/assignments/repositories/assignment.repository";
import { Enrollment } from "@/modules/enrollments/models/enrollment.model";
import { examinationRepository } from "@/modules/examinations/repositories/examination.repository";
import {
  calculateCGPA,
  calculateGrade,
  calculatePercentage,
  calculateSGPA,
  generateTranscript as generateTranscriptHelper,
  getGradePoint,
} from "@/shared/academic";
import { ResultStatus } from "@/shared/enums/result-status.enum";
import { ApiError } from "@/utils/ApiError";

import { resultRepository } from "../repositories/result.repository";
import {
  GetResultsQueryInput,
  GetSemesterResultsQueryInput,
} from "../validators/result.validator";

export class ResultService {
  // ============================
  // Create Subject Result
  // ============================

  async createResult(
    enrollmentId: string,
    subjectId: string,
  ) {
    // Check duplicate result
    const existing =
      await resultRepository.findStudentSubjectResult(
        enrollmentId,
        subjectId,
      );

    if (existing) {
      throw new ApiError(
        409,
        "Result already exists",
      );
    }

    // Assignment Marks
    const assignment =
      await assignmentRepository.getStudentAssignmentMarks(
        enrollmentId,
        subjectId,
      );

    // Examination Marks
    const exam =
      await examinationRepository.getStudentExamMarks(
        enrollmentId,
        subjectId,
      );

    if (!assignment || !exam) {
      throw new ApiError(
        400,
        "Marks are incomplete",
      );
    }

    const total =
      assignment.marks +
      exam.obtainedMarks;

    const percentage =
      calculatePercentage(
        total,
        100,
      );

    const grade =
      calculateGrade(
        total,
        100,
      );

    const gradePoint =
      getGradePoint(
        grade,
      );

    return resultRepository.createResult({
      enrollment: new Types.ObjectId(enrollmentId),
      subject: new Types.ObjectId(subjectId),
      assignmentMarks:
        assignment.marks,
      examMarks:
        exam.obtainedMarks,
      totalMarks: total,
      percentage,
      grade,
      gradePoint,
    });
  }

  // ============================
  // Generate Semester Result
  // ============================

  async generateSemesterResult(
    enrollmentId: string,
    semesterId: string,
  ) {
    const results =
      await resultRepository.findResultsBySemester(
        enrollmentId,
        semesterId,
      );

    if (!results.length) {
      throw new ApiError(
        404,
        "No subject results found",
      );
    }

    const sgpa =
      calculateSGPA(
        results.map(
          (result) => ({
            credits:
              (result.subject as unknown as { credits: number }).credits,
            gradePoint:
              result.gradePoint,
          }),
        ),
      );

    const previousResults =
      await resultRepository.findPreviousSemesterResults(
        enrollmentId,
      );

    const totalCredits =
      results.reduce(
        (
          total: number,
          result,
        ) =>
          total +
          (result.subject as unknown as { credits: number }).credits,
        0,
      );

    const cgpa =
      calculateCGPA([
        ...previousResults.map(
          (semester) => ({
            sgpa: semester.sgpa,
            credits:
              semester.creditsEarned,
          }),
        ),
        {
          sgpa,
          credits: totalCredits,
        },
      ]);

    const passed =
      results.filter(
        (result) =>
          result.gradePoint > 0,
      ).length;

    const failed =
      results.length - passed;

    const averagePercentage =
      results.reduce(
        (
          total: number,
          result,
        ) =>
          total +
          result.percentage,
        0,
      ) / results.length;

    return resultRepository.createSemesterResult(
      {
        enrollment:
          new Types.ObjectId(enrollmentId),
        semester:
          new Types.ObjectId(semesterId),
        sgpa,
        cgpa,
        creditsEarned:
          totalCredits,
        creditsAttempted:
          totalCredits,
        totalSubjects:
          results.length,
        passedSubjects:
          passed,
        failedSubjects:
          failed,
        percentage:
          averagePercentage,
      },
    );
  }

  async getResults(query: GetResultsQueryInput) {
    return resultRepository.findResults(query);
  }

  async getSemesterResults(query: GetSemesterResultsQueryInput) {
    return resultRepository.findSemesterResults(query);
  }

  async publishResult(id: string) {
    const result = await resultRepository.findResultById(id);
    if (!result) {
      throw new ApiError(404, "Result not found");
    }

    return resultRepository.updateResult(id, {
      status: ResultStatus.PUBLISHED,
    });
  }

  async generateTranscript(enrollmentId: string) {
    const enrollment = await Enrollment.findById(enrollmentId)
      .populate({
        path: "student",
        populate: {
          path: "user",
        },
      })
      .populate("semester");

    if (!enrollment) {
      throw new ApiError(404, "Enrollment not found");
    }

    const studentObj = enrollment.student as unknown as {
      registrationNumber?: string;
      studentId?: string;
      user?: { firstName: string; lastName: string };
    };
    const userObj = studentObj?.user;
    const semesterObj = enrollment.semester as unknown as { name?: string };

    const studentName = userObj
      ? `${userObj.firstName} ${userObj.lastName}`
      : "Unknown Student";
    const enrollmentNumber =
      studentObj?.registrationNumber || studentObj?.studentId || "N/A";
    const semesterName = semesterObj?.name || "N/A";

    const semesterResult = await resultRepository.findSemesterResult(
      enrollmentId,
      enrollment.semester.toString(),
    );

    const sgpa = semesterResult?.sgpa || 0;
    const cgpa = semesterResult?.cgpa || 0;

    const results = await resultRepository.findResultsBySemester(
      enrollmentId,
      enrollment.semester.toString(),
    );

    const subjects = results.map((res) => {
      const subjectObj = res.subject as unknown as {
        code?: string;
        name?: string;
        credits?: number;
      };
      return {
        subjectCode: subjectObj?.code || "N/A",
        subjectName: subjectObj?.name || "N/A",
        credits: subjectObj?.credits || 0,
        grade: res.grade,
        gradePoint: res.gradePoint,
        marks: res.totalMarks,
      };
    });

    return generateTranscriptHelper({
      studentName,
      enrollmentNumber,
      semester: semesterName,
      sgpa,
      cgpa,
      subjects,
    });
  }
}

export const resultService =
  new ResultService();
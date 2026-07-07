// ======================
// Imports
// ======================
import { Types } from "mongoose";

import { enrollmentRepository as defaultEnrollmentRepository } from "@/modules/enrollments/repositories/enrollment.repository";
import { facultyRepository as defaultFacultyRepository } from "@/modules/faculty/repositories/faculty.repository";
import { sectionRepository as defaultSectionRepository } from "@/modules/sections/repositories/section.repository";
import { semesterRepository as defaultSemesterRepository } from "@/modules/semesters/repositories/semester.repository";
import { subjectRepository as defaultSubjectRepository } from "@/modules/subjects/repositories/subject.repository";
import { calculateGrade } from "@/shared/utils/grade-calculator";
import { ApiError } from "@/utils/ApiError";

import { examinationRepository as defaultExaminationRepository } from "../repositories/examination.repository";
import {
  CreateExaminationInput,
  CreateExamResultInput,
  GetExaminationsQueryInput,
  GetExamResultsQueryInput,
  UpdateExaminationInput,
  UpdateExamResultInput,
} from "../validators/examination.validator";

// ======================
// Service
// ======================

export class ExaminationService {
  constructor(
    private examinationRepository = defaultExaminationRepository,
    private facultyRepository = defaultFacultyRepository,
    private subjectRepository = defaultSubjectRepository,
    private sectionRepository = defaultSectionRepository,
    private semesterRepository = defaultSemesterRepository,
    private enrollmentRepository = defaultEnrollmentRepository,
  ) {}

  // ======================
  // Helpers
  // ======================

  private hasTimeOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string,
  ) {
    return start1 < end2 && end1 > start2;
  }

  private async validateExamConflicts(
    data: CreateExaminationInput,
  ) {
    const facultyExams =
      await this.examinationRepository.findFacultyConflicts(
        data.faculty,
        data.date,
      );

    for (const exam of facultyExams) {
      if (
        this.hasTimeOverlap(
          data.startTime,
          data.endTime,
          exam.startTime,
          exam.endTime,
        )
      ) {
        throw new ApiError(
          409,
          "Faculty has another examination scheduled",
        );
      }
    }

    const sectionExams =
      await this.examinationRepository.findSectionConflicts(
        data.section,
        data.date,
      );

    for (const exam of sectionExams) {
      if (
        this.hasTimeOverlap(
          data.startTime,
          data.endTime,
          exam.startTime,
          exam.endTime,
        )
      ) {
        throw new ApiError(
          409,
          "Section already has another examination",
        );
      }
    }

    const hallExams =
      await this.examinationRepository.findHallConflicts(
        data.hall,
        data.date,
      );

    for (const exam of hallExams) {
      if (
        this.hasTimeOverlap(
          data.startTime,
          data.endTime,
          exam.startTime,
          exam.endTime,
        )
      ) {
        throw new ApiError(
          409,
          "Hall is already booked",
        );
      }
    }
  }

  // ======================
  // Examination
  // ======================

  async createExamination(
    data: CreateExaminationInput,
  ) {
    const faculty =
      await this.facultyRepository.findById(data.faculty);

    if (!faculty) {
      throw new ApiError(404, "Faculty not found");
    }

    const subject =
      await this.subjectRepository.findById(data.subject);

    if (!subject) {
      throw new ApiError(404, "Subject not found");
    }

    const section =
      await this.sectionRepository.findById(data.section);

    if (!section) {
      throw new ApiError(404, "Section not found");
    }

    const semester =
      await this.semesterRepository.findById(data.semester);

    if (!semester) {
      throw new ApiError(404, "Semester not found");
    }

    await this.validateExamConflicts(data);

    return this.examinationRepository.createExamination({
      ...data,
      subject: new Types.ObjectId(data.subject),
      faculty: new Types.ObjectId(data.faculty),
      section: new Types.ObjectId(data.section),
      semester: new Types.ObjectId(data.semester),
    });
  }

  async getExaminations(
    query: GetExaminationsQueryInput,
  ) {
    return this.examinationRepository.findExaminations(
      query,
    );
  }

  async getExaminationById(id: string) {
    const examination =
      await this.examinationRepository.findExaminationById(
        id,
      );

    if (!examination) {
      throw new ApiError(
        404,
        "Examination not found",
      );
    }

    return examination;
  }

  async updateExamination(
    id: string,
    data: UpdateExaminationInput,
  ) {
    const examination =
      await this.examinationRepository.findExaminationById(
        id,
      );

    if (!examination) {
      throw new ApiError(
        404,
        "Examination not found",
      );
    }

    return this.examinationRepository.updateExamination(
      id,
      data,
    );
  }

  async deleteExamination(id: string) {
    const examination =
      await this.examinationRepository.findExaminationById(
        id,
      );

    if (!examination) {
      throw new ApiError(
        404,
        "Examination not found",
      );
    }

    return this.examinationRepository.softDeleteExamination(
      id,
    );
  }

  // ======================
  // Exam Results
  // ======================

  async createExamResult(
    data: CreateExamResultInput,
  ) {
    const examination =
      await this.examinationRepository.findExaminationById(
        data.examination,
      );

    if (!examination) {
      throw new ApiError(
        404,
        "Examination not found",
      );
    }

    const enrollment =
      await this.enrollmentRepository.findById(
        data.enrollment,
      );

    if (!enrollment) {
      throw new ApiError(
        404,
        "Enrollment not found",
      );
    }

    const existingResult =
      await this.examinationRepository.findStudentResult(
        data.examination,
        data.enrollment,
      );

    if (existingResult) {
      throw new ApiError(
        409,
        "Result already exists",
      );
    }

    if (
      data.obtainedMarks >
      examination.maximumMarks
    ) {
      throw new ApiError(
        400,
        `Marks cannot exceed ${examination.maximumMarks}`,
      );
    }

    const grade = calculateGrade(
      data.obtainedMarks,
      examination.maximumMarks,
    );

    return this.examinationRepository.createExamResult({
      ...data,
      examination: new Types.ObjectId(data.examination),
      enrollment: new Types.ObjectId(data.enrollment),
      grade,
    });
  }

  async updateExamResult(
    id: string,
    data: UpdateExamResultInput,
  ) {
    const result =
      await this.examinationRepository.findExamResultById(
        id,
      );

    if (!result) {
      throw new ApiError(
        404,
        "Exam result not found",
      );
    }

    const examination =
      await this.examinationRepository.findExaminationById(
        result.examination.toString(),
      );

    if (!examination) {
      throw new ApiError(
        404,
        "Examination not found",
      );
    }

    if (
      data.obtainedMarks !== undefined &&
      data.obtainedMarks >
        examination.maximumMarks
    ) {
      throw new ApiError(
        400,
        `Marks cannot exceed ${examination.maximumMarks}`,
      );
    }

    const updateData = {
      ...data,
      ...(data.obtainedMarks !== undefined && {
        grade: calculateGrade(
          data.obtainedMarks,
          examination.maximumMarks,
        ),
      }),
    };

    return this.examinationRepository.updateExamResult(
      id,
      updateData,
    );
  }

  async getExamResults(
    query: GetExamResultsQueryInput,
  ) {
    return this.examinationRepository.findExamResults(
      query,
    );
  }
}

export const examinationService =
  new ExaminationService();
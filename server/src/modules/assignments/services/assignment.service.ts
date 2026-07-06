import { Types } from "mongoose";

import { enrollmentRepository as defaultEnrollmentRepository } from "@/modules/enrollments/repositories/enrollment.repository";
import { facultyRepository as defaultFacultyRepository } from "@/modules/faculty/repositories/faculty.repository";
import { sectionRepository as defaultSectionRepository } from "@/modules/sections/repositories/section.repository";
import { semesterRepository as defaultSemesterRepository } from "@/modules/semesters/repositories/semester.repository";
import { subjectRepository as defaultSubjectRepository } from "@/modules/subjects/repositories/subject.repository";
import { SubmissionStatus } from "@/shared/enums/submission-status.enum";
import { ApiError } from "@/utils/ApiError";

import { assignmentRepository as defaultAssignmentRepository } from "../repositories/assignment.repository";
import {
  CreateAssignmentInput,
  CreateSubmissionInput,
  GetAssignmentsQueryInput,
  GetSubmissionsQueryInput,
  GradeSubmissionInput,
  UpdateAssignmentInput,
} from "../validators/assignment.validator";

export class AssignmentService {
  constructor(
    private assignmentRepository = defaultAssignmentRepository,

    private facultyRepository = defaultFacultyRepository,

    private subjectRepository = defaultSubjectRepository,

    private sectionRepository = defaultSectionRepository,

    private semesterRepository = defaultSemesterRepository,

    private enrollmentRepository = defaultEnrollmentRepository,
  ) {}

  /* -------------------------------------------------------------------------- */
  /*                            Assignment Methods                              */
  /* -------------------------------------------------------------------------- */

  // Create Assignment
  async createAssignment(
    data: CreateAssignmentInput,
  ) {
    const faculty =
      await this.facultyRepository.findById(
        data.faculty,
      );

    if (!faculty) {
      throw new ApiError(
        404,
        "Faculty not found",
      );
    }

    const subject =
      await this.subjectRepository.findById(
        data.subject,
      );

    if (!subject) {
      throw new ApiError(
        404,
        "Subject not found",
      );
    }

    const section =
      await this.sectionRepository.findById(
        data.section,
      );

    if (!section) {
      throw new ApiError(
        404,
        "Section not found",
      );
    }

    const semester =
      await this.semesterRepository.findById(
        data.semester,
      );

    if (!semester) {
      throw new ApiError(
        404,
        "Semester not found",
      );
    }

    return this.assignmentRepository.createAssignment({
      ...data,
      subject: new Types.ObjectId(data.subject),
      faculty: new Types.ObjectId(data.faculty),
      section: new Types.ObjectId(data.section),
      semester: new Types.ObjectId(data.semester),
    });
  }

  // Get Assignments
  async getAssignments(
    query: GetAssignmentsQueryInput,
  ) {
    return this.assignmentRepository.findAssignments(
      query,
    );
  }

  // Get Assignment By ID
  async getAssignmentById(
    id: string,
  ) {
    const assignment =
      await this.assignmentRepository.findAssignmentById(
        id,
      );

    if (!assignment) {
      throw new ApiError(
        404,
        "Assignment not found",
      );
    }

    return assignment;
  }

  // Update Assignment
  async updateAssignment(
    id: string,
    data: UpdateAssignmentInput,
  ) {
    const assignment =
      await this.assignmentRepository.findAssignmentById(
        id,
      );

    if (!assignment) {
      throw new ApiError(
        404,
        "Assignment not found",
      );
    }

    return this.assignmentRepository.updateAssignment(
      id,
      data,
    );
  }

  // Delete Assignment (Soft Delete)
  async deleteAssignment(
    id: string,
  ) {
    const assignment =
      await this.assignmentRepository.findAssignmentById(
        id,
      );

    if (!assignment) {
      throw new ApiError(
        404,
        "Assignment not found",
      );
    }

    return this.assignmentRepository.softDeleteAssignment(
      id,
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                            Submission Methods                              */
  /* -------------------------------------------------------------------------- */

  // Create Submission
  async createSubmission(
    data: CreateSubmissionInput,
  ) {
    const assignment =
      await this.assignmentRepository.findPublishedAssignment(
        data.assignment,
      );

    if (!assignment) {
      throw new ApiError(
        404,
        "Assignment not found or not published",
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

    const existingSubmission =
      await this.assignmentRepository.findStudentSubmission(
        data.assignment,
        data.enrollment,
      );

    if (existingSubmission) {
      throw new ApiError(
        409,
        "Assignment already submitted",
      );
    }

    const now = new Date();

    const status =
      now > assignment.dueDate
        ? SubmissionStatus.LATE
        : SubmissionStatus.SUBMITTED;

    return this.assignmentRepository.createSubmission({
      ...data,
      assignment: new Types.ObjectId(data.assignment),
      enrollment: new Types.ObjectId(data.enrollment),
      submissionDate: now,
      status,
    });
  }

  // Grade Submission
  async gradeSubmission(
    id: string,
    data: GradeSubmissionInput,
  ) {
    const submission =
      await this.assignmentRepository.findSubmissionById(
        id,
      );

    if (!submission) {
      throw new ApiError(
        404,
        "Submission not found",
      );
    }

    const assignment =
      await this.assignmentRepository.findAssignmentById(
        submission.assignment.toString(),
      );

    if (!assignment) {
      throw new ApiError(
        404,
        "Assignment not found",
      );
    }

    if (
      data.marks >
      assignment.maxMarks
    ) {
      throw new ApiError(
        400,
        `Marks cannot exceed ${assignment.maxMarks}`,
      );
    }

    return this.assignmentRepository.gradeSubmission(
      id,
      {
        ...data,
        status:
          SubmissionStatus.GRADED,
      },
    );
  }

  // Get Submissions
  async getSubmissions(
    query: GetSubmissionsQueryInput,
  ) {
    return this.assignmentRepository.findSubmissions(
      query,
    );
  }
}

export const assignmentService =
  new AssignmentService();
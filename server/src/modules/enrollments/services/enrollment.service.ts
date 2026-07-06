import { Types } from "mongoose";

import { courseRepository as defaultCourseRepository } from "@/modules/courses/repositories/course.repository";
import { sectionRepository as defaultSectionRepository } from "@/modules/sections/repositories/section.repository";
import { semesterRepository as defaultSemesterRepository } from "@/modules/semesters/repositories/semester.repository";
import { studentRepository as defaultStudentRepository } from "@/modules/students/repositories/student.repository";
import { ApiError } from "@/utils/ApiError";

import { IEnrollment } from "../models/enrollment.interface";
import { enrollmentRepository as defaultEnrollmentRepository } from "../repositories/enrollment.repository";
import {
  CreateEnrollmentInput,
  GetEnrollmentsQueryInput,
  UpdateEnrollmentInput,
} from "../validators/enrollment.validator";

export class EnrollmentService {
  constructor(
    private enrollmentRepository = defaultEnrollmentRepository,
    private studentRepository = defaultStudentRepository,
    private courseRepository = defaultCourseRepository,
    private semesterRepository = defaultSemesterRepository,
    private sectionRepository = defaultSectionRepository
  ) {}

  // ======================
  // Create Enrollment
  // ======================

  async createEnrollment(
    data: CreateEnrollmentInput
  ) {
    const student = await this.studentRepository.findById(
      data.student
    );

    if (!student) {
      throw new ApiError(404, "Student not found");
    }

    const course = await this.courseRepository.findById(
      data.course
    );

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    const semester = await this.semesterRepository.findById(
      data.semester
    );

    if (!semester) {
      throw new ApiError(404, "Semester not found");
    }

    const section = await this.sectionRepository.findById(
      data.section
    );

    if (!section) {
      throw new ApiError(404, "Section not found");
    }

    if (
      semester.course._id.toString() !==
      data.course
    ) {
      throw new ApiError(
        400,
        "Semester does not belong to the selected course"
      );
    }

    if (
      section.semester._id.toString() !==
      data.semester
    ) {
      throw new ApiError(
        400,
        "Section does not belong to the selected semester"
      );
    }

    const existingEnrollment =
      await this.enrollmentRepository.findByStudentAndSemester(
        data.student,
        data.semester
      );

    if (existingEnrollment) {
      throw new ApiError(
        409,
        "Student is already enrolled in this semester"
      );
    }

    const sectionEnrollments =
      await this.enrollmentRepository.findBySection(
        data.section
      );

    if (
      sectionEnrollments.length >=
      section.capacity
    ) {
      throw new ApiError(
        400,
        "Section capacity has been reached"
      );
    }

    return this.enrollmentRepository.create({
      ...data,
      student: new Types.ObjectId(data.student),
      course: new Types.ObjectId(data.course),
      semester: new Types.ObjectId(data.semester),
      section: new Types.ObjectId(data.section),
    });
  }

  // ======================
  // Get All Enrollments
  // ======================

  async getEnrollments(
    query: GetEnrollmentsQueryInput
  ) {
    return this.enrollmentRepository.findAll(query);
  }

  // ======================
  // Get Enrollment By ID
  // ======================

  async getEnrollmentById(id: string) {
    const enrollment =
      await this.enrollmentRepository.findById(id);

    if (!enrollment) {
      throw new ApiError(
        404,
        "Enrollment not found"
      );
    }

    return enrollment;
  }

  // ======================
  // Update Enrollment
  // ======================

  async updateEnrollment(
    id: string,
    data: UpdateEnrollmentInput
  ) {
    const enrollment =
      await this.enrollmentRepository.findById(id);

    if (!enrollment) {
      throw new ApiError(
        404,
        "Enrollment not found"
      );
    }

    const updateData: Partial<IEnrollment> = {};
    if (data.student !== undefined) updateData.student = new Types.ObjectId(data.student);
    if (data.course !== undefined) updateData.course = new Types.ObjectId(data.course);
    if (data.semester !== undefined) updateData.semester = new Types.ObjectId(data.semester);
    if (data.section !== undefined) updateData.section = new Types.ObjectId(data.section);
    if (data.enrollmentDate !== undefined) updateData.enrollmentDate = data.enrollmentDate;
    if (data.status !== undefined) updateData.status = data.status;

    return this.enrollmentRepository.updateById(
      id,
      updateData
    );
  }

  // ======================
  // Delete Enrollment
  // ======================

  async deleteEnrollment(id: string) {
    const enrollment =
      await this.enrollmentRepository.findById(id);

    if (!enrollment) {
      throw new ApiError(
        404,
        "Enrollment not found"
      );
    }

    if (enrollment.deletedAt) {
      throw new ApiError(
        400,
        "Enrollment already deleted"
      );
    }

    return this.enrollmentRepository.softDeleteById(
      id
    );
  }
}

export const enrollmentService =
  new EnrollmentService();
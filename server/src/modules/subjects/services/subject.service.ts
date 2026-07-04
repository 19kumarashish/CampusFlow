import { Types } from "mongoose";

import { courseRepository as defaultCourseRepository } from "@/modules/courses/repositories/course.repository";
import { departmentRepository as defaultDepartmentRepository } from "@/modules/departments/repositories/department.repository";
import { ApiError } from "@/utils/ApiError";

import { ISubject } from "../models/subject.interface";
import { subjectRepository as defaultSubjectRepository } from "../repositories/subject.repository";
import {
  CreateSubjectInput,
  GetSubjectsQueryInput,
  UpdateSubjectInput,
} from "../validators/subject.validator";

export class SubjectService {
  constructor(
    private subjectRepository = defaultSubjectRepository,
    private departmentRepository = defaultDepartmentRepository,
    private courseRepository = defaultCourseRepository,
  ) {}

  async createSubject(data: CreateSubjectInput) {
    const department = await this.departmentRepository.findById(
      data.department,
    );

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    const course = await this.courseRepository.findById(data.course);

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    if (course.department.toString() !== data.department) {
      throw new ApiError(
        400,
        "Selected course does not belong to the selected department",
      );
    }

    if (data.semester > course.totalSemesters) {
      throw new ApiError(
        400,
        `Course has only ${course.totalSemesters} semesters`,
      );
    }

    const existingCode = await this.subjectRepository.findByCode(data.code);

    if (existingCode) {
      throw new ApiError(409, "Subject code already exists");
    }

    const existingName = await this.subjectRepository.findByName(data.name);

    if (existingName) {
      throw new ApiError(409, "Subject name already exists");
    }

    return this.subjectRepository.create({
      ...data,
      department: new Types.ObjectId(data.department),
      course: new Types.ObjectId(data.course),
    });
  }

  async getSubjects(query: GetSubjectsQueryInput) {
    return this.subjectRepository.findAll(query);
  }

  async getSubjectById(id: string) {
    const subject = await this.subjectRepository.findById(id);

    if (!subject) {
      throw new ApiError(404, "Subject not found");
    }

    return subject;
  }

  async updateSubject(
    id: string,
    data: UpdateSubjectInput,
  ) {
    const subject = await this.subjectRepository.findById(id);

    if (!subject) {
      throw new ApiError(404, "Subject not found");
    }

    // Final values after update
    const departmentId =
      data.department ?? subject.department.toString();

    const courseId =
      data.course ?? subject.course.toString();

    const semester =
      data.semester ?? subject.semester;

    // Validate department
    const department =
      await this.departmentRepository.findById(departmentId);

    if (!department) {
      throw new ApiError(404, "Department not found");
    }

    // Validate course
    const course =
      await this.courseRepository.findById(courseId);

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    // Course must belong to department
    if (
      course.department.toString() !==
      departmentId
    ) {
      throw new ApiError(
        400,
        "Selected course does not belong to the selected department",
      );
    }

    // Semester validation
    if (
      semester >
      course.totalSemesters
    ) {
      throw new ApiError(
        400,
        `Course has only ${course.totalSemesters} semesters`,
      );
    }

    // Code uniqueness
    if (
      data.code &&
      data.code !== subject.code
    ) {
      const existingCode =
        await this.subjectRepository.findByCode(
          data.code,
        );

      if (existingCode) {
        throw new ApiError(
          409,
          "Subject code already exists",
        );
      }
    }

    // Name uniqueness
    if (
      data.name &&
      data.name !== subject.name
    ) {
      const existingName =
        await this.subjectRepository.findByName(
          data.name,
        );

      if (existingName) {
        throw new ApiError(
          409,
          "Subject name already exists",
        );
      }
    }

    const updateData: Partial<ISubject> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.code !== undefined) updateData.code = data.code;
    if (data.department !== undefined) updateData.department = new Types.ObjectId(data.department);
    if (data.course !== undefined) updateData.course = new Types.ObjectId(data.course);
    if (data.semester !== undefined) updateData.semester = data.semester;
    if (data.credits !== undefined) updateData.credits = data.credits;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.status !== undefined) updateData.status = data.status;

    return this.subjectRepository.updateById(
      id,
      updateData,
    );
  }

  async deleteSubject(id: string) {
    const subject =
      await this.subjectRepository.findById(id);

    if (!subject) {
      throw new ApiError(
        404,
        "Subject not found",
      );
    }

    if (subject.deletedAt) {
      throw new ApiError(
        400,
        "Subject already deleted",
      );
    }

    return this.subjectRepository.softDeleteById(
      id,
    );
  }
}

export const subjectService =
  new SubjectService();
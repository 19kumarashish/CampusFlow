import { Types } from "mongoose";

import { courseRepository as defaultCourseRepository } from "@/modules/courses/repositories/course.repository";
import { ApiError } from "@/utils/ApiError";

import { ISemester } from "../models/semester.interface";
import { semesterRepository as defaultSemesterRepository } from "../repositories/semester.repository";
import {
  CreateSemesterInput,
  GetSemestersQueryInput,
  UpdateSemesterInput,
} from "../validators/semester.validator";

export class SemesterService {
  constructor(
    private semesterRepository = defaultSemesterRepository,
    private courseRepository = defaultCourseRepository,
  ) {}

  // Create Semester
  async createSemester(data: CreateSemesterInput) {
    const course = await this.courseRepository.findById(data.course);

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    if (data.semesterNumber > course.totalSemesters) {
      throw new ApiError(
        400,
        `Course has only ${course.totalSemesters} semesters`
      );
    }

    const existingSemester =
      await this.semesterRepository.findByCourseAndSemester(
        data.course,
        data.semesterNumber,
        data.academicYear
      );

    if (existingSemester) {
      throw new ApiError(
        409,
        "Semester already exists for this course and academic year"
      );
    }

    if (data.isCurrent) {
      const currentSemester =
        await this.semesterRepository.findCurrentSemester(data.course);

      if (currentSemester) {
        throw new ApiError(
          409,
          "Current semester already exists for this course"
        );
      }
    }

    return this.semesterRepository.create({
      ...data,
      course: new Types.ObjectId(data.course),
    });
  }

  // Get All Semesters
  async getSemesters(query: GetSemestersQueryInput) {
    return this.semesterRepository.findAll(query);
  }

  // Get Semester By ID
  async getSemesterById(id: string) {
    const semester = await this.semesterRepository.findById(id);

    if (!semester) {
      throw new ApiError(404, "Semester not found");
    }

    return semester;
  }

  // Update Semester
  async updateSemester(
    id: string,
    data: UpdateSemesterInput,
  ) {
    const semester = await this.semesterRepository.findById(id);

    if (!semester) {
      throw new ApiError(404, "Semester not found");
    }

    const courseId =
      data.course ?? semester.course._id.toString();

    const semesterNumber =
      data.semesterNumber ?? semester.semesterNumber;

    const academicYear =
      data.academicYear ?? semester.academicYear;

    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    if (semesterNumber > course.totalSemesters) {
      throw new ApiError(
        400,
        `Course has only ${course.totalSemesters} semesters`
      );
    }

    const duplicate =
      await this.semesterRepository.findByCourseAndSemester(
        courseId,
        semesterNumber,
        academicYear
      );

    if (duplicate && duplicate._id.toString() !== id) {
      throw new ApiError(409, "Semester already exists");
    }

    if (data.isCurrent) {
      const currentSemester =
        await this.semesterRepository.findCurrentSemester(courseId);

      if (
        currentSemester &&
        currentSemester._id.toString() !== id
      ) {
        throw new ApiError(
          409,
          "Current semester already exists"
        );
      }
    }

    const updateData: Partial<ISemester> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.semesterNumber !== undefined) updateData.semesterNumber = data.semesterNumber;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.academicYear !== undefined) updateData.academicYear = data.academicYear;
    if (data.course !== undefined) updateData.course = new Types.ObjectId(data.course);
    if (data.startDate !== undefined) updateData.startDate = data.startDate;
    if (data.endDate !== undefined) updateData.endDate = data.endDate;
    if (data.registrationStart !== undefined) updateData.registrationStart = data.registrationStart;
    if (data.registrationEnd !== undefined) updateData.registrationEnd = data.registrationEnd;
    if (data.examStart !== undefined) updateData.examStart = data.examStart;
    if (data.examEnd !== undefined) updateData.examEnd = data.examEnd;
    if (data.resultDate !== undefined) updateData.resultDate = data.resultDate;
    if (data.isCurrent !== undefined) updateData.isCurrent = data.isCurrent;
    if (data.status !== undefined) updateData.status = data.status;

    return this.semesterRepository.updateById(id, updateData);
  }

  // Delete Semester
  async deleteSemester(id: string) {
    const semester = await this.semesterRepository.findById(id);

    if (!semester) {
      throw new ApiError(404, "Semester not found");
    }

    if (semester.deletedAt) {
      throw new ApiError(
        400,
        "Semester already deleted"
      );
    }

    if (semester.isCurrent) {
      throw new ApiError(
        400,
        "Current semester cannot be deleted"
      );
    }

    return this.semesterRepository.softDeleteById(id);
  }
}

export const semesterService = new SemesterService();
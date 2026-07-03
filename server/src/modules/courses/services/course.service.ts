import { ApiError } from "@/utils/ApiError";
import { Types } from "mongoose";

import { courseRepository as defaultCourseRepository } from "../repositories/course.repository";
import { ICourse } from "../models/course.interface";
import { departmentRepository as defaultDepartmentRepository } from "@/modules/departments/repositories/department.repository";

import {
    CreateCourseInput,
    GetCoursesQueryInput,
    UpdateCourseInput,
} from "../validators/course.validator";

export class CourseService {
    constructor(
        private courseRepository = defaultCourseRepository,
        private departmentRepository = defaultDepartmentRepository,
    ) { }

    async createCourse(
        data: CreateCourseInput,
    ) {
        const department =
            await this.departmentRepository.findById(
                data.department,
            );

        if (!department) {
            throw new ApiError(
                404,
                "Department not found",
            );
        }

        const existingName =
            await this.courseRepository.findByName(
                data.name,
            );

        if (existingName) {
            throw new ApiError(
                409,
                "Course name already exists",
            );
        }

        const existingCode =
            await this.courseRepository.findByCode(
                data.code,
            );

        if (existingCode) {
            throw new ApiError(
                409,
                "Course code already exists",
            );
        }

        return this.courseRepository.create({
            ...data,
            department: new Types.ObjectId(data.department),
        });
    }

    async getCourses(
        query: GetCoursesQueryInput,
    ) {
        return this.courseRepository.findAll(query);
    }

    async getCourseById(id: string) {
        const course =
            await this.courseRepository.findById(id);

        if (!course) {
            throw new ApiError(
                404,
                "Course not found",
            );
        }

        return course;
    }

    async updateCourse(
        id: string,
        data: UpdateCourseInput,
    ) {
        const course =
            await this.courseRepository.findById(id);

        if (!course) {
            throw new ApiError(
                404,
                "Course not found",
            );
        }

        if (data.department) {
            const department =
                await this.departmentRepository.findById(
                    data.department,
                );

            if (!department) {
                throw new ApiError(
                    404,
                    "Department not found",
                );
            }
        }

        if (
            data.name &&
            data.name !== course.name
        ) {
            const existing =
                await this.courseRepository.findByName(
                    data.name,
                );

            if (existing) {
                throw new ApiError(
                    409,
                    "Course name already exists",
                );
            }
        }

        if (
            data.code &&
            data.code !== course.code
        ) {
            const existing =
                await this.courseRepository.findByCode(
                    data.code,
                );

            if (existing) {
                throw new ApiError(
                    409,
                    "Course code already exists",
                );
            }
        }

        const updateData: Partial<ICourse> = {};

        if (data.name) updateData.name = data.name;
        if (data.code) updateData.code = data.code;
        if (data.department) updateData.department = new Types.ObjectId(data.department);
        if (data.degree) updateData.degree = data.degree;
        if (data.duration) updateData.duration = data.duration;
        if (data.totalSemesters) updateData.totalSemesters = data.totalSemesters;
        if (data.status) updateData.status = data.status;

        return this.courseRepository.updateById(id, updateData);
    }

    async deleteCourse(id: string) {
        const course =
            await this.courseRepository.findById(id);

        if (!course) {
            throw new ApiError(
                404,
                "Course not found",
            );
        }

        if (course.deletedAt) {
            throw new ApiError(
                400,
                "Course is already deleted",
            );
        }

        return this.courseRepository.softDeleteById(
            id,
        );
    }
}

export const courseService =
    new CourseService();
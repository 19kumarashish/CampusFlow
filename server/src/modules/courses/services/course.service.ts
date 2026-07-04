import { Types } from "mongoose";

import { departmentRepository as defaultDepartmentRepository } from "@/modules/departments/repositories/department.repository";
import { BaseService } from "@/shared/services/base.service";
import { ApiError } from "@/utils/ApiError";

import { ICourse } from "../models/course.interface";
import { courseRepository as defaultCourseRepository } from "../repositories/course.repository";
import {
    CreateCourseInput,
    GetCoursesQueryInput,
    UpdateCourseInput,
} from "../validators/course.validator";

export class CourseService extends BaseService {
    constructor(
        private courseRepository = defaultCourseRepository,
        private departmentRepository = defaultDepartmentRepository,
    ) {
        super();
    }

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

        return this.findOrFail(course, "Course");
    }

    async updateCourse(
        id: string,
        data: UpdateCourseInput,
    ) {
        const course =
            await this.courseRepository.findById(id);

        const existingCourse = await this.findOrFail(course, "Course");

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
            data.name !== existingCourse.name
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
            data.code !== existingCourse.code
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

        const existingCourse = await this.findOrFail(course, "Course");
        await this.ensureNotDeleted(existingCourse, "Course");

        return this.courseRepository.softDeleteById(
            id,
        );
    }
}

export const courseService =
    new CourseService();
import { Status } from "@/shared/enums/status.enum";

import { IFaculty } from "../models/faculty.interface";
import { Faculty } from "../models/faculty.model";
import { GetFacultiesQueryInput } from "../validators/faculty.validator";

class FacultyRepository {
    async create(data: Partial<IFaculty>) {
        return Faculty.create(data);
    }
    async findById(id: string) {
        return Faculty.findById(id)
            .populate({
                path: "user",
                select:
                    "firstName lastName email phone",
            })
            .populate({
                path: "department",
                select: "name code",
            });
    }
    async findByUser(userId: string) {
        return Faculty.findOne({
            user: userId,
            deletedAt: null,
        });
    }
    async findByEmployeeId(
        employeeId: string,
    ) {
        return Faculty.findOne({
            employeeId,
            deletedAt: null,
        });
    }
    async findAll(
        query: GetFacultiesQueryInput,
    ) {
        const {
            page,
            limit,
            search,
            department,
            designation,
            employmentType,
            status,
            sortBy,
            sortOrder,
        } = query;

        const filter: Record<string, unknown> = {
            deletedAt: null,
        };

        if (search) {
            filter.$or = [
                {
                    employeeId: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    qualification: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    specialization: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        if (department) {
            filter.department = department;
        }

        if (designation) {
            filter.designation =
                designation;
        }

        if (employmentType) {
            filter.employmentType =
                employmentType;
        }

        if (status) {
            filter.status = status;
        }

        const skip =
            (page - 1) * limit;

        const [faculties, total] =
            await Promise.all([
                Faculty.find(filter)
                    .populate({
                        path: "user",
                        select:
                            "firstName lastName email phone",
                    })
                    .populate({
                        path: "department",
                        select: "name code",
                    })
                    .sort({
                        [sortBy]:
                            sortOrder === "asc"
                                ? 1
                                : -1,
                    })
                    .skip(skip)
                    .limit(limit),

                Faculty.countDocuments(
                    filter,
                ),
            ]);

        return {
            faculties,

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
    async updateById(
        id: string,
        data: Partial<IFaculty>,
    ) {
        return Faculty.findByIdAndUpdate(
            id,
            {
                $set: data,
            },
            {
                new: true,
                runValidators: true,
            },
        )
            .populate({
                path: "user",
                select:
                    "firstName lastName email phone",
            })
            .populate({
                path: "department",
                select: "name code",
            });
    }
    async softDeleteById(id: string) {
        return Faculty.findByIdAndUpdate(
            id,
            {
                $set: {
                    status: Status.INACTIVE,
                    deletedAt: new Date(),
                },
            },
            {
                new: true,
                runValidators: true,
            },
        );
    }
}

export const facultyRepository =
    new FacultyRepository();
// Use a generic record for filter to avoid mismatched mongoose type exports across versions

import { Status } from "@/shared/enums/status.enum";

import { IDepartment } from "../models/department.interface";
import { Department } from "../models/department.model";
import { GetDepartmentsQueryInput } from "../validators/department.validator";

class DepartmentRepository {
    async create(data: Partial<IDepartment>) {
        return Department.create(data);
    }

    async findById(id: string) {
        return Department.findById(id);
    }

    async findByName(name: string) {
        return Department.findOne({ name });
    }

    async findByCode(code: string) {
        return Department.findOne({ code });
    }

    async findAll(
        query: GetDepartmentsQueryInput,
    ) {
        const {
            page,
            limit,
            search,
            status,
            sortBy,
            sortOrder,
        } = query;

        const filter: Record<string, unknown> = {};

        if (search) {
            filter.$or = [
                {
                    name: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    code: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        if (status) {
            filter.status = status;
        }

        const skip = (page - 1) * limit;

        const [departments, total] =
            await Promise.all([
                Department.find(filter)
                    .sort({
                        [sortBy]:
                            sortOrder === "asc"
                                ? 1
                                : -1,
                    })
                    .skip(skip)
                    .limit(limit),

                Department.countDocuments(filter),
            ]);

        return {
            departments,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(
                    total / limit,
                ),
            },
        };
    }

    async updateById(
        id: string,
        data: Partial<IDepartment>,
    ) {
        return Department.findByIdAndUpdate(
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

    async softDeleteById(id: string) {
        return Department.findByIdAndUpdate(
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

export const departmentRepository =
    new DepartmentRepository();
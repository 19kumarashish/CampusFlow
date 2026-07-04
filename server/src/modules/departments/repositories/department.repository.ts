import { QueryBuilder } from "@/shared/builders/query.builder";
import { Status } from "@/shared/enums/status.enum";
import { BaseRepository } from "@/shared/repositories/base.repository";
import { buildPaginationMeta } from "@/shared/utils/pagination";

import { IDepartment } from "../models/department.interface";
import { Department } from "../models/department.model";
import { GetDepartmentsQueryInput } from "../validators/department.validator";

class DepartmentRepository extends BaseRepository<IDepartment> {
    constructor() {
        super(Department);
    }

    async findByName(name: string) {
        return Department.findOne({ name });
    }

    async findByCode(code: string) {
        return Department.findOne({ code });
    }

    async findAll(query: GetDepartmentsQueryInput) {
        const { page, limit, status, sortBy, sortOrder } = query;

        const filter: Record<string, unknown> = {};

        if (status) {
            filter.status = status;
        }

        const baseQuery = Department.find(filter);
        const queryBuilder = new QueryBuilder(baseQuery, query, {
            defaultSortBy: sortBy ?? "createdAt",
            defaultSortOrder: sortOrder ?? "desc",
        });

        const [departments, total] = await Promise.all([
            queryBuilder
                .search(["name", "code"])
                .sort()
                .paginate(page, limit)
                .execute(),
            Department.countDocuments(filter),
        ]);

        return {
            departments,
            pagination: buildPaginationMeta(page, limit, total),
        };
    }

    async updateById(id: string, data: Partial<IDepartment>) {
        return Department.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true },
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
            { new: true, runValidators: true },
        );
    }
}

export const departmentRepository = new DepartmentRepository();
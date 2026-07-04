import { QueryBuilder } from "@/shared/builders/query.builder";
import { Status } from "@/shared/enums/status.enum";
import { BaseRepository } from "@/shared/repositories/base.repository";
import { buildPaginationMeta } from "@/shared/utils/pagination";

import { ICourse } from "../models/course.interface";
import { Course } from "../models/course.model";
import { GetCoursesQueryInput } from "../validators/course.validator";

class CourseRepository extends BaseRepository<ICourse> {
  constructor() {
    super(Course);
  }

  async findById(id: string) {
    return Course.findById(id).populate("department");
  }

  async findByName(name: string) {
    return Course.findOne({ name });
  }

  async findByCode(code: string) {
    return Course.findOne({ code });
  }

  async findAll(query: GetCoursesQueryInput) {
    const { page, limit, department, degree, status, sortBy, sortOrder } = query;

    const filter: Record<string, unknown> = { deletedAt: null };

    if (department) {
      filter.department = department;
    }

    if (degree) {
      filter.degree = degree;
    }

    if (status) {
      filter.status = status;
    }

    const baseQuery = Course.find(filter).populate("department");
    const queryBuilder = new QueryBuilder(baseQuery, query, {
      defaultSortBy: sortBy ?? "createdAt",
      defaultSortOrder: sortOrder ?? "desc",
    });

    const [courses, total] = await Promise.all([
      queryBuilder
        .search(["name", "code"])
        .sort()
        .paginate(page, limit)
        .execute(),
      Course.countDocuments(filter),
    ]);

    return {
      courses,
      pagination: buildPaginationMeta(page, limit, total),
    };
  }

  async updateById(id: string, data: Partial<ICourse>) {
    return Course.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true },
    ).populate("department");
  }

  async softDeleteById(id: string) {
    return Course.findByIdAndUpdate(
      id,
      {
        $set: {
          status: Status.INACTIVE,
          deletedAt: new Date(),
        },
      },
      { new: true, runValidators: true },
    ).populate("department");
  }
}

export const courseRepository = new CourseRepository();
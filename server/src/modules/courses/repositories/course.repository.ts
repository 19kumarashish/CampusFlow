import { Course } from "../models/course.model";
import { ICourse } from "../models/course.interface";

import { Status } from "@/shared/enums/status.enum";

import { GetCoursesQueryInput } from "../validators/course.validator";

class CourseRepository {
      async create(data: Partial<ICourse>) {
    return Course.create(data);
  }
  async findById(id: string) {
    return Course.findById(id)
      .populate("department");
  }

  async findByName(name: string) {
    return Course.findOne({
      name,
    });
  }
    async findByCode(code: string) {
    return Course.findOne({
      code,
    });
  }
    async findAll(
    query: GetCoursesQueryInput,
  ) {
    const {
      page,
      limit,
      search,
      department,
      degree,
      status,
      sortBy,
      sortOrder,
    } = query;

    const filter: Record<
      string,
      unknown
    > = {
      deletedAt: null,
    };

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

    if (department) {
      filter.department =
        department;
    }

    if (degree) {
      filter.degree = degree;
    }

    if (status) {
      filter.status = status;
    }

    const skip =
      (page - 1) * limit;

    const [courses, total] =
      await Promise.all([
        Course.find(filter)
          .populate("department")
          .sort({
            [sortBy]:
              sortOrder === "asc"
                ? 1
                : -1,
          })
          .skip(skip)
          .limit(limit),

        Course.countDocuments(filter),
      ]);

    return {
      courses,

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
    data: Partial<ICourse>,
  ) {
    return Course.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate("department");
  }

    async softDeleteById(
    id: string,
  ) {
    return Course.findByIdAndUpdate(
      id,
      {
        $set: {
          status:
            Status.INACTIVE,

          deletedAt:
            new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate("department");
  }
  }

export const courseRepository =
  new CourseRepository();
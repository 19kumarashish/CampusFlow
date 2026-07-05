
import { ISemester } from "../models/semester.interface";
import { Semester } from "../models/semester.model";
import { GetSemestersQueryInput } from "../validators/semester.validator";

class SemesterRepository {
  // Create
  async create(data: Partial<ISemester>) {
    return Semester.create(data);
  }

  // Find By ID
  async findById(id: string) {
    return Semester.findById(id).populate({
      path: "course",
      select: "name code degree totalSemesters department",
    });
  }

  // Find By Name
  async findByName(name: string) {
    return Semester.findOne({
      name,
      deletedAt: null,
    });
  }

  // Find Current Semester
  async findCurrentSemester(courseId: string) {
    return Semester.findOne({
      course: courseId,
      isCurrent: true,
      deletedAt: null,
    });
  }

  // Find By Course + Semester + Academic Year
  async findByCourseAndSemester(
    courseId: string,
    semesterNumber: number,
    academicYear: string
  ) {
    return Semester.findOne({
      course: courseId,
      semesterNumber,
      academicYear,
      deletedAt: null,
    });
  }

  // Find All
  async findAll(query: GetSemestersQueryInput) {
    const {
      page,
      limit,
      search,
      course,
      academicYear,
      semesterNumber,
      type,
      isCurrent,
      status,
      sortBy,
      sortOrder,
    } = query;

    const filter: Record<string, unknown> = {
      deletedAt: null,
    };

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (course) {
      filter.course = course;
    }

    if (academicYear) {
      filter.academicYear = academicYear;
    }

    if (semesterNumber) {
      filter.semesterNumber = semesterNumber;
    }

    if (type) {
      filter.type = type;
    }

    if (typeof isCurrent === "boolean") {
      filter.isCurrent = isCurrent;
    }

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [semesters, total] = await Promise.all([
      Semester.find(filter)
        .populate({
          path: "course",
          select: "name code degree",
        })
        .sort({
          [sortBy]: sortOrder === "asc" ? 1 : -1,
        })
        .skip(skip)
        .limit(limit),

      Semester.countDocuments(filter),
    ]);

    return {
      semesters,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  // Update
  async updateById(
    id: string,
    data: Partial<ISemester>
  ) {
    return Semester.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate({
      path: "course",
      select: "name code degree totalSemesters department",
    });
  }

  // Soft Delete
  async softDeleteById(id: string) {
    return Semester.findByIdAndUpdate(
      id,
      {
        deletedAt: new Date(),
        status: "INACTIVE",
      },
      {
        new: true,
      }
    );
  }
}

export const semesterRepository = new SemesterRepository();
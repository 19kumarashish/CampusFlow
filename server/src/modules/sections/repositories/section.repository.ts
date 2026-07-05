
import { ISection } from "../models/section.interface";
import { Section } from "../models/section.model";
import { GetSectionsQueryInput } from "../validators/section.validator";

class SectionRepository {
  // ======================
  // Create
  // ======================

  async create(data: Partial<ISection>) {
    return Section.create(data);
  }

  // ======================
  // Find By ID
  // ======================

  async findById(id: string) {
    return Section.findById(id)
      .populate({
        path: "semester",
        select: "name semesterNumber academicYear type",
      })
      .populate({
        path: "facultyAdvisor",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      });
  }

  // ======================
  // Find By Name & Semester
  // ======================

  async findByNameAndSemester(
    name: string,
    semester: string
  ) {
    return Section.findOne({
      name,
      semester,
      deletedAt: null,
    });
  }

  // ======================
  // Find All
  // ======================

  async findAll(query: GetSectionsQueryInput) {
    const {
      page,
      limit,
      search,
      semester,
      facultyAdvisor,
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
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          classroom: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (semester) {
      filter.semester = semester;
    }

    if (facultyAdvisor) {
      filter.facultyAdvisor = facultyAdvisor;
    }

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [sections, total] = await Promise.all([
      Section.find(filter)
        .populate({
          path: "semester",
          select: "name semesterNumber academicYear type",
        })
        .populate({
          path: "facultyAdvisor",
          populate: {
            path: "user",
            select: "firstName lastName email",
          },
        })
        .sort({
          [sortBy]: sortOrder === "asc" ? 1 : -1,
        })
        .skip(skip)
        .limit(limit),

      Section.countDocuments(filter),
    ]);

    return {
      sections,
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

  // ======================
  // Update
  // ======================

  async updateById(
    id: string,
    data: Partial<ISection>
  ) {
    return Section.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate({
        path: "semester",
        select: "name semesterNumber academicYear type",
      })
      .populate({
        path: "facultyAdvisor",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      });
  }

  // ======================
  // Soft Delete
  // ======================

  async softDeleteById(id: string) {
    return Section.findByIdAndUpdate(
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

export const sectionRepository = new SectionRepository();
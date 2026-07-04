import type { PopulateOptions } from "mongoose";

import { Status } from "@/shared/enums/status.enum";

import { ISubject } from "../models/subject.interface";
import { Subject } from "../models/subject.model";
import { GetSubjectsQueryInput } from "../validators/subject.validator";

const subjectPopulate: PopulateOptions[] = [
  {
    path: "department",
    select: "name code",
  },
  {
    path: "course",
    select: "name code degree duration totalSemesters",
  },
];

class SubjectRepository {
  async create(data: Partial<ISubject>) {
    return Subject.create(data);
  }

  async findById(id: string) {
    return Subject.findOne({
      _id: id,
      deletedAt: null,
    }).populate(subjectPopulate);
  }

  async findByName(name: string) {
    return Subject.findOne({
      name: {
        $regex: `^${name.trim()}$`,
        $options: "i",
      },
      deletedAt: null,
    }).lean();
  }

  async findByCode(code: string) {
    return Subject.findOne({
      code: code.trim().toUpperCase(),
      deletedAt: null,
    }).lean();
  }

  async findAll(query: GetSubjectsQueryInput) {
    const {
      page,
      limit,
      search,
      department,
      course,
      semester,
      type,
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
          code: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (department) {
      filter.department = department;
    }

    if (course) {
      filter.course = course;
    }

    if (semester !== undefined) {
      filter.semester = semester;
    }

    if (type) {
      filter.type = type;
    }

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [subjects, total] = await Promise.all([
      Subject.find(filter)
        .populate(subjectPopulate)
        .sort({
          [sortBy]: sortOrder === "asc" ? 1 : -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Subject.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      subjects,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async updateById(
    id: string,
    data: Partial<ISubject>,
  ) {
    return Subject.findOneAndUpdate(
      {
        _id: id,
        deletedAt: null,
      },
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate(subjectPopulate);
  }

  async softDeleteById(id: string) {
    return Subject.findOneAndUpdate(
      {
        _id: id,
        deletedAt: null,
      },
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
    ).populate(subjectPopulate);
  }
}

export const subjectRepository = new SubjectRepository();
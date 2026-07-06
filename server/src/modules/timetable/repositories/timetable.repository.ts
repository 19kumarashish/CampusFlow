import { QueryFilter, Types } from "mongoose";

import { Day } from "@/shared/enums/day.enum";
import { Status } from "@/shared/enums/status.enum";

import { ITimetable } from "../models/timetable.interface";
import { Timetable } from "../models/timetable.model";
import { GetTimetableQueryInput } from "../validators/timetable.validator";

class TimetableRepository {
  /* -------------------------------------------------------------------------- */
  /*                                   Create                                   */
  /* -------------------------------------------------------------------------- */

  async create(data: Partial<ITimetable>) {
    return Timetable.create(data);
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Find By ID                                 */
  /* -------------------------------------------------------------------------- */

  async findById(id: string) {
    return Timetable.findById(id)
      .populate("section")
      .populate("subject")
      .populate({
        path: "faculty",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Faculty Conflict                              */
  /* -------------------------------------------------------------------------- */

  async findFacultyConflict(
    facultyId: string,
    day: Day,
    excludeId?: string,
  ) {
    const filter: QueryFilter<ITimetable> = {
      faculty: new Types.ObjectId(facultyId),
      day,
      deletedAt: null,
    };
    if (excludeId) {
      filter._id = { $ne: new Types.ObjectId(excludeId) };
    }
    return Timetable.find(filter);
  }

  /* -------------------------------------------------------------------------- */
  /*                              Section Conflict                              */
  /* -------------------------------------------------------------------------- */

  async findSectionConflict(
    sectionId: string,
    day: Day,
    excludeId?: string,
  ) {
    const filter: QueryFilter<ITimetable> = {
      section: new Types.ObjectId(sectionId),
      day,
      deletedAt: null,
    };
    if (excludeId) {
      filter._id = { $ne: new Types.ObjectId(excludeId) };
    }
    return Timetable.find(filter);
  }

  /* -------------------------------------------------------------------------- */
  /*                             Classroom Conflict                             */
  /* -------------------------------------------------------------------------- */

  async findClassroomConflict(
    classroom: string,
    day: Day,
    excludeId?: string,
  ) {
    const filter: QueryFilter<ITimetable> = {
      classroom,
      day,
      deletedAt: null,
    };
    if (excludeId) {
      filter._id = { $ne: new Types.ObjectId(excludeId) };
    }
    return Timetable.find(filter);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Find All                                 */
  /* -------------------------------------------------------------------------- */

  async findAll(
    query: GetTimetableQueryInput,
  ) {
    const {
      page,
      limit,
      section,
      faculty,
      subject,
      classroom,
      day,
      status,
      sortBy,
      sortOrder,
    } = query;

    const filter: QueryFilter<ITimetable> = {
      deletedAt: null,
    };

    if (section) {
      filter.section = section;
    }

    if (faculty) {
      filter.faculty = faculty;
    }

    if (subject) {
      filter.subject = subject;
    }

    if (classroom) {
      filter.classroom = classroom;
    }

    if (day) {
      filter.day = day;
    }

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [timetable, total] = await Promise.all([
      Timetable.find(filter)
        .populate("section")
        .populate("subject")
        .populate({
          path: "faculty",
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

      Timetable.countDocuments(filter),
    ]);

    return {
      timetable,

      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage:
          page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Update                                    */
  /* -------------------------------------------------------------------------- */

  async updateById(
    id: string,
    data: Partial<ITimetable>,
  ) {
    return Timetable.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("section")
      .populate("subject")
      .populate({
        path: "faculty",
        populate: {
          path: "user",
          select: "firstName lastName email",
        },
      });
  }

  /* -------------------------------------------------------------------------- */
  /*                               Soft Delete                                  */
  /* -------------------------------------------------------------------------- */

  async softDeleteById(id: string) {
    return Timetable.findByIdAndUpdate(
      id,
      {
        deletedAt: new Date(),
        status: Status.INACTIVE,
      },
      {
        new: true,
      },
    );
  }
}

export const timetableRepository =
  new TimetableRepository();
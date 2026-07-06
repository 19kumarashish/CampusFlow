import { Types } from "mongoose";

import { facultyRepository as defaultFacultyRepository } from "@/modules/faculty/repositories/faculty.repository";
import { sectionRepository as defaultSectionRepository } from "@/modules/sections/repositories/section.repository";
import { subjectRepository as defaultSubjectRepository } from "@/modules/subjects/repositories/subject.repository";
import { ApiError } from "@/utils/ApiError";

import { ITimetable } from "../models/timetable.interface";
import { timetableRepository as defaultTimetableRepository } from "../repositories/timetable.repository";
import {
  CreateTimetableInput,
  GetTimetableQueryInput,
  UpdateTimetableInput,
} from "../validators/timetable.validator";

export class TimetableService {
  constructor(
    private timetableRepository = defaultTimetableRepository,
    private sectionRepository = defaultSectionRepository,
    private subjectRepository = defaultSubjectRepository,
    private facultyRepository = defaultFacultyRepository,
  ) {}

  /* -------------------------------------------------------------------------- */
  /*                             Time Overlap Helper                            */
  /* -------------------------------------------------------------------------- */

  private hasTimeOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string,
  ) {
    return start1 < end2 && end1 > start2;
  }

  /* -------------------------------------------------------------------------- */
  /*                           Validate Schedule Conflicts                      */
  /* -------------------------------------------------------------------------- */

  private async validateConflicts(
    data: CreateTimetableInput,
    excludeId?: string,
  ) {
    // Faculty conflict
    const facultyClasses =
      await this.timetableRepository.findFacultyConflict(
        data.faculty,
        data.day,
        excludeId,
      );

    for (const schedule of facultyClasses) {
      if (
        this.hasTimeOverlap(
          data.startTime,
          data.endTime,
          schedule.startTime,
          schedule.endTime,
        )
      ) {
        throw new ApiError(
          409,
          "Faculty has another class during this time",
        );
      }
    }

    // Section conflict
    const sectionClasses =
      await this.timetableRepository.findSectionConflict(
        data.section,
        data.day,
        excludeId,
      );

    for (const schedule of sectionClasses) {
      if (
        this.hasTimeOverlap(
          data.startTime,
          data.endTime,
          schedule.startTime,
          schedule.endTime,
        )
      ) {
        throw new ApiError(
          409,
          "Section already has a scheduled class",
        );
      }
    }

    // Classroom conflict
    const classroomClasses =
      await this.timetableRepository.findClassroomConflict(
        data.classroom,
        data.day,
        excludeId,
      );

    for (const schedule of classroomClasses) {
      if (
        this.hasTimeOverlap(
          data.startTime,
          data.endTime,
          schedule.startTime,
          schedule.endTime,
        )
      ) {
        throw new ApiError(
          409,
          "Classroom is already occupied",
        );
      }
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                              Create Timetable                              */
  /* -------------------------------------------------------------------------- */

  async createTimetable(
    data: CreateTimetableInput,
  ) {
    const section =
      await this.sectionRepository.findById(
        data.section,
      );

    if (!section) {
      throw new ApiError(
        404,
        "Section not found",
      );
    }

    const subject =
      await this.subjectRepository.findById(
        data.subject,
      );

    if (!subject) {
      throw new ApiError(
        404,
        "Subject not found",
      );
    }

    const faculty =
      await this.facultyRepository.findById(
        data.faculty,
      );

    if (!faculty) {
      throw new ApiError(
        404,
        "Faculty not found",
      );
    }

    await this.validateConflicts(data);

    return this.timetableRepository.create({
      ...data,
      section: new Types.ObjectId(data.section),
      subject: new Types.ObjectId(data.subject),
      faculty: new Types.ObjectId(data.faculty),
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Get Timetables                                */
  /* -------------------------------------------------------------------------- */

  async getTimetable(
    query: GetTimetableQueryInput,
  ) {
    return this.timetableRepository.findAll(
      query,
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                             Get Timetable By ID                            */
  /* -------------------------------------------------------------------------- */

  async getTimetableById(id: string) {
    const timetable =
      await this.timetableRepository.findById(id);

    if (!timetable) {
      throw new ApiError(
        404,
        "Timetable not found",
      );
    }

    return timetable;
  }

  /* -------------------------------------------------------------------------- */
  /*                              Update Timetable                              */
  /* -------------------------------------------------------------------------- */

  async updateTimetable(
    id: string,
    data: UpdateTimetableInput,
  ) {
    const timetable =
      await this.timetableRepository.findById(id);

    if (!timetable) {
      throw new ApiError(
        404,
        "Timetable not found",
      );
    }

    const updateData: Partial<ITimetable> = {};

    if (data.section) {
      const section = await this.sectionRepository.findById(data.section);
      if (!section) {
        throw new ApiError(404, "Section not found");
      }
      updateData.section = new Types.ObjectId(data.section);
    }

    if (data.subject) {
      const subject = await this.subjectRepository.findById(data.subject);
      if (!subject) {
        throw new ApiError(404, "Subject not found");
      }
      updateData.subject = new Types.ObjectId(data.subject);
    }

    if (data.faculty) {
      const faculty = await this.facultyRepository.findById(data.faculty);
      if (!faculty) {
        throw new ApiError(404, "Faculty not found");
      }
      updateData.faculty = new Types.ObjectId(data.faculty);
    }

    if (data.classroom) {
      updateData.classroom = data.classroom;
    }

    if (data.day) {
      updateData.day = data.day;
    }

    if (data.startTime) {
      updateData.startTime = data.startTime;
    }

    if (data.endTime) {
      updateData.endTime = data.endTime;
    }

    if (data.status) {
      updateData.status = data.status;
    }

    if (
      data.section ||
      data.faculty ||
      data.classroom ||
      data.day ||
      data.startTime ||
      data.endTime
    ) {
      const sectionToCheck = data.section || (timetable.section as unknown as { _id?: Types.ObjectId })._id?.toString() || timetable.section.toString();
      const facultyToCheck = data.faculty || (timetable.faculty as unknown as { _id?: Types.ObjectId })._id?.toString() || timetable.faculty.toString();
      const classroomToCheck = data.classroom || timetable.classroom;
      const dayToCheck = data.day || timetable.day;
      const startTimeToCheck = data.startTime || timetable.startTime;
      const endTimeToCheck = data.endTime || timetable.endTime;

      const conflictCheckData = {
        section: sectionToCheck,
        faculty: facultyToCheck,
        classroom: classroomToCheck,
        day: dayToCheck,
        startTime: startTimeToCheck,
        endTime: endTimeToCheck,
        subject: data.subject || (timetable.subject as unknown as { _id?: Types.ObjectId })._id?.toString() || timetable.subject.toString(),
      } as unknown as CreateTimetableInput;

      await this.validateConflicts(conflictCheckData, id);
    }

    return this.timetableRepository.updateById(
      id,
      updateData,
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                              Delete Timetable                              */
  /* -------------------------------------------------------------------------- */

  async deleteTimetable(id: string) {
    const timetable =
      await this.timetableRepository.findById(id);

    if (!timetable) {
      throw new ApiError(
        404,
        "Timetable not found",
      );
    }

    if (timetable.deletedAt) {
      throw new ApiError(
        400,
        "Timetable already deleted",
      );
    }

    return this.timetableRepository.softDeleteById(
      id,
    );
  }
}

export const timetableService =
  new TimetableService();
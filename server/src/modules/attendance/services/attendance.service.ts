import { Types } from "mongoose";

import { enrollmentRepository as defaultEnrollmentRepository } from "@/modules/enrollments/repositories/enrollment.repository";
import { facultyRepository as defaultFacultyRepository } from "@/modules/faculty/repositories/faculty.repository";
import { subjectRepository as defaultSubjectRepository } from "@/modules/subjects/repositories/subject.repository";
import { AttendanceStatus } from "@/shared/enums/attendance-status.enum";
import { ApiError } from "@/utils/ApiError";

import { IAttendance } from "../models/attendance.interface";
import { attendanceRepository as defaultAttendanceRepository } from "../repositories/attendance.repository";
import {
  CreateAttendanceInput,
  GetAttendanceQueryInput,
  UpdateAttendanceInput,
} from "../validators/attendance.validator";

export class AttendanceService {
  constructor(
    private attendanceRepository =
      defaultAttendanceRepository,

    private enrollmentRepository =
      defaultEnrollmentRepository,

    private subjectRepository =
      defaultSubjectRepository,

    private facultyRepository =
      defaultFacultyRepository,
  ) {}
async createAttendance(
  data: CreateAttendanceInput,
) {
  const enrollment =
    await this.enrollmentRepository.findById(
      data.enrollment,
    );

  if (!enrollment) {
    throw new ApiError(
      404,
      "Enrollment not found",
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

  const today = new Date();

  if (data.date > today) {
    throw new ApiError(
      400,
      "Attendance cannot be marked for a future date",
    );
  }

  const duplicate =
    await this.attendanceRepository.findDuplicateAttendance(
      data.enrollment,
      data.subject,
      data.lectureNumber,
      data.date,
    );

  if (duplicate) {
    throw new ApiError(
      409,
      "Attendance already marked for this lecture",
    );
  }

  return this.attendanceRepository.create({
    ...data,
    enrollment: new Types.ObjectId(data.enrollment),
    subject: new Types.ObjectId(data.subject),
    faculty: new Types.ObjectId(data.faculty),
  });
}

async getAttendance(query: GetAttendanceQueryInput) {
  return this.attendanceRepository.findAll(query);
}

async getAttendanceById(id: string) {
  const attendance = await this.attendanceRepository.findById(id);
  if (!attendance) {
    throw new ApiError(404, "Attendance record not found");
  }
  return attendance;
}

async updateAttendance(id: string, data: UpdateAttendanceInput) {
  const attendance = await this.attendanceRepository.findById(id);
  if (!attendance) {
    throw new ApiError(404, "Attendance record not found");
  }

  const updateData: Partial<IAttendance> = {};

  if (data.enrollment) {
    const enrollment = await this.enrollmentRepository.findById(data.enrollment);
    if (!enrollment) {
      throw new ApiError(404, "Enrollment not found");
    }
    updateData.enrollment = new Types.ObjectId(data.enrollment);
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

  if (data.date) {
    const today = new Date();
    if (data.date > today) {
      throw new ApiError(400, "Attendance cannot be marked for a future date");
    }
    updateData.date = data.date;
  }

  if (data.lectureNumber !== undefined) {
    updateData.lectureNumber = data.lectureNumber;
  }

  if (data.status) {
    updateData.status = data.status;
  }

  if (data.remarks !== undefined) {
    updateData.remarks = data.remarks;
  }

  const enrollmentToCheck =
    data.enrollment ||
    (attendance.enrollment as unknown as { _id?: Types.ObjectId })._id?.toString() ||
    attendance.enrollment.toString();
  const subjectToCheck =
    data.subject ||
    (attendance.subject as unknown as { _id?: Types.ObjectId })._id?.toString() ||
    attendance.subject.toString();
  const lectureNumberToCheck = data.lectureNumber !== undefined ? data.lectureNumber : attendance.lectureNumber;
  const dateToCheck = data.date || attendance.date;

  if (
    data.enrollment ||
    data.subject ||
    data.lectureNumber !== undefined ||
    data.date
  ) {
    const duplicate = await this.attendanceRepository.findDuplicateAttendance(
      enrollmentToCheck,
      subjectToCheck,
      lectureNumberToCheck,
      dateToCheck,
    );

    if (duplicate && duplicate._id.toString() !== id) {
      throw new ApiError(409, "Attendance already marked for this lecture");
    }
  }

  return this.attendanceRepository.updateById(id, updateData);
}

async deleteAttendance(id: string) {
  const attendance = await this.attendanceRepository.deleteById(id);
  if (!attendance) {
    throw new ApiError(404, "Attendance record not found");
  }
  return attendance;
}

async getAttendancePercentage(enrollmentId: string) {
  const enrollment = await this.enrollmentRepository.findById(enrollmentId);
  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found");
  }

  const attendanceRecords = await this.attendanceRepository.findByEnrollment(enrollmentId);
  const total = attendanceRecords.length;
  if (total === 0) {
    return {
      totalLectures: 0,
      presentLectures: 0,
      percentage: 0,
    };
  }

  const present = attendanceRecords.filter(
    (record) => record.status === AttendanceStatus.PRESENT,
  ).length;

  return {
    totalLectures: total,
    presentLectures: present,
    percentage: Math.round((present / total) * 100 * 100) / 100,
  };
}
}

export const attendanceService = new AttendanceService();
import { expect } from "chai";
import { Types } from "mongoose";

import { attendanceRepository } from "../src/modules/attendance/repositories/attendance.repository";
import { AttendanceService } from "../src/modules/attendance/services/attendance.service";
import { CreateAttendanceInput } from "../src/modules/attendance/validators/attendance.validator";
import { enrollmentRepository } from "../src/modules/enrollments/repositories/enrollment.repository";
import { facultyRepository } from "../src/modules/faculty/repositories/faculty.repository";
import { subjectRepository } from "../src/modules/subjects/repositories/subject.repository";
import { AttendanceStatus } from "../src/shared/enums/attendance-status.enum";
import { ApiError } from "../src/utils/ApiError";

const baseAttendanceInput: CreateAttendanceInput = {
  enrollment: new Types.ObjectId().toString(),
  subject: new Types.ObjectId().toString(),
  faculty: new Types.ObjectId().toString(),
  date: new Date(),
  lectureNumber: 1,
  status: AttendanceStatus.PRESENT,
};

describe("AttendanceService", () => {
  it("creates a new attendance record successfully", async () => {
    const mockEnrollmentRepository = {
      findById: async () => ({ _id: baseAttendanceInput.enrollment }),
    } as unknown as typeof enrollmentRepository;

    const mockSubjectRepository = {
      findById: async () => ({ _id: baseAttendanceInput.subject }),
    } as unknown as typeof subjectRepository;

    const mockFacultyRepository = {
      findById: async () => ({ _id: baseAttendanceInput.faculty }),
    } as unknown as typeof facultyRepository;

    const mockAttendanceRepository = {
      findDuplicateAttendance: async () => null,
      create: async (data: Record<string, unknown>) => ({
        _id: new Types.ObjectId().toString(),
        ...data,
      }),
    } as unknown as typeof attendanceRepository;

    const service = new AttendanceService(
      mockAttendanceRepository,
      mockEnrollmentRepository,
      mockSubjectRepository,
      mockFacultyRepository,
    );

    const result = await service.createAttendance(baseAttendanceInput);

    expect(result).to.have.property("_id");
    expect(result.enrollment.toString()).to.equal(baseAttendanceInput.enrollment);
    expect(result.status).to.equal(AttendanceStatus.PRESENT);
  });

  it("throws a conflict error when duplicate attendance is found", async () => {
    const mockEnrollmentRepository = {
      findById: async () => ({ _id: baseAttendanceInput.enrollment }),
    } as unknown as typeof enrollmentRepository;

    const mockSubjectRepository = {
      findById: async () => ({ _id: baseAttendanceInput.subject }),
    } as unknown as typeof subjectRepository;

    const mockFacultyRepository = {
      findById: async () => ({ _id: baseAttendanceInput.faculty }),
    } as unknown as typeof facultyRepository;

    const mockAttendanceRepository = {
      findDuplicateAttendance: async () => ({ _id: "duplicate-id" }),
      create: async () => null,
    } as unknown as typeof attendanceRepository;

    const service = new AttendanceService(
      mockAttendanceRepository,
      mockEnrollmentRepository,
      mockSubjectRepository,
      mockFacultyRepository,
    );

    try {
      await service.createAttendance(baseAttendanceInput);
      expect.fail("Expected createAttendance to throw ApiError");
    } catch (error: unknown) {
      const err = error as ApiError;
      expect(err).to.be.instanceOf(ApiError);
      expect(err.statusCode).to.equal(409);
      expect(err.message).to.equal("Attendance already marked for this lecture");
    }
  });

  it("calculates attendance percentage correctly", async () => {
    const mockEnrollmentRepository = {
      findById: async () => ({ _id: "enrollment-1" }),
    } as unknown as typeof enrollmentRepository;

    const mockAttendanceRepository = {
      findByEnrollment: async () => [
        { status: AttendanceStatus.PRESENT },
        { status: AttendanceStatus.PRESENT },
        { status: AttendanceStatus.ABSENT },
        { status: AttendanceStatus.PRESENT },
      ],
    } as unknown as typeof attendanceRepository;

    const service = new AttendanceService(
      mockAttendanceRepository,
      mockEnrollmentRepository,
      {} as unknown as typeof subjectRepository,
      {} as unknown as typeof facultyRepository,
    );

    const result = await service.getAttendancePercentage("enrollment-1");

    expect(result.totalLectures).to.equal(4);
    expect(result.presentLectures).to.equal(3);
    expect(result.percentage).to.equal(75);
  });
});



import { StudentStatus } from "@/shared/enums/student-status.enum";

import { IStudent } from "../models/student.interface";
import { Student } from "../models/student.model";
import { GetStudentsQueryInput } from "../validators/student.validator";

class StudentRepository {
  /**
   * Create Student
   */
  async create(data: Partial<IStudent>) {
    return Student.create(data);
  }

  /**
   * Find Student By Mongo ID
   */
  async findById(id: string) {
    return Student.findById(id)
      .populate({
        path: "user",
        select: "firstName lastName email phone",
      })
      .populate({
        path: "department",
        select: "name code",
      })
      .populate({
        path: "course",
        select: "name code degree totalSemesters",
      });
  }

  /**
   * Find Student By User ID
   */
  async findByUser(userId: string) {
    return Student.findOne({
      user: userId,
      deletedAt: null,
    });
  }

  /**
   * Find Student By Student ID
   */
  async findByStudentId(studentId: string) {
    return Student.findOne({
      studentId,
      deletedAt: null,
    });
  }

  /**
   * Find Student By Registration Number
   */
  async findByRegistrationNumber(
    registrationNumber: string,
  ) {
    return Student.findOne({
      registrationNumber,
      deletedAt: null,
    });
  }

  /**
   * Find Student By Roll Number
   */
  async findByRollNumber(rollNumber: string) {
    return Student.findOne({
      rollNumber,
      deletedAt: null,
    });
  }

  /**
   * Find All Students
   */
  async findAll(
    query: GetStudentsQueryInput,
  ) {
    const {
      page,
      limit,
      search,
      department,
      course,
      currentSemester,
      admissionYear,
      admissionType,
      gender,
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
          studentId: {
            $regex: search,
            $options: "i",
          },
        },
        {
          registrationNumber: {
            $regex: search,
            $options: "i",
          },
        },
        {
          rollNumber: {
            $regex: search,
            $options: "i",
          },
        },
        {
          guardianName: {
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

    if (currentSemester) {
      filter.currentSemester =
        currentSemester;
    }

    if (admissionYear) {
      filter.admissionYear =
        admissionYear;
    }

    if (admissionType) {
      filter.admissionType =
        admissionType;
    }

    if (gender) {
      filter.gender = gender;
    }

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [students, total] =
      await Promise.all([
        Student.find(filter)
          .populate({
            path: "user",
            select:
              "firstName lastName email phone",
          })
          .populate({
            path: "department",
            select: "name code",
          })
          .populate({
            path: "course",
            select:
              "name code degree totalSemesters",
          })
          .sort({
            [sortBy]:
              sortOrder === "asc"
                ? 1
                : -1,
          })
          .skip(skip)
          .limit(limit),

        Student.countDocuments(filter),
      ]);

    return {
      students,

      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(
          total / limit,
        ),
        hasNextPage:
          page <
          Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Update Student
   */
  async updateById(
    id: string,
    data: Partial<IStudent>,
  ) {
    return Student.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate({
        path: "user",
        select: "firstName lastName email phone",
      })
      .populate({
        path: "department",
        select: "name code",
      })
      .populate({
        path: "course",
        select:
          "name code degree totalSemesters",
      });
  }

  /**
   * Soft Delete Student
   */
  async softDeleteById(id: string) {
    return Student.findByIdAndUpdate(
      id,
      {
        $set: {
          status:
            StudentStatus.DROPPED,
          deletedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }
}

export const studentRepository =
  new StudentRepository();
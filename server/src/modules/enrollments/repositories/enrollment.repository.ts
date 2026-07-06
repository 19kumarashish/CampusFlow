
import { Status } from "@/shared/enums/status.enum";

import { IEnrollment } from "../models/enrollment.interface";
import { Enrollment } from "../models/enrollment.model";
import { GetEnrollmentsQueryInput } from "../validators/enrollment.validator";

class EnrollmentRepository {
  // ======================
  // Create
  // ======================

  async create(data: Partial<IEnrollment>) {
    return Enrollment.create(data);
  }

  // ======================
  // Find By ID
  // ======================

  async findById(id: string) {
    return Enrollment.findById(id)
      .populate({
        path: "student",
      })
      .populate({
        path: "course",
      })
      .populate({
        path: "semester",
      })
      .populate({
        path: "section",
      });
  }

  // ======================
  // Find By Student & Semester
  // ======================

  async findByStudentAndSemester(
    studentId: string,
    semesterId: string
  ) {
    return Enrollment.findOne({
      student: studentId,
      semester: semesterId,
      deletedAt: null,
    });
  }

  // ======================
  // Find By Section
  // ======================

  async findBySection(sectionId: string) {
    return Enrollment.find({
      section: sectionId,
      deletedAt: null,
    });
  }

  // ======================
  // Find All
  // ======================

  async findAll(query: GetEnrollmentsQueryInput) {
    const {
      page,
      limit,
      search,
      student,
      course,
      semester,
      section,
      status,
      sortBy,
      sortOrder,
    } = query;

    const filter: Record<string, unknown> = {
      deletedAt: null,
    };

    if (student) {
      filter.student = student;
    }

    if (course) {
      filter.course = course;
    }

    if (semester) {
      filter.semester = semester;
    }

    if (section) {
      filter.section = section;
    }

    if (status) {
      filter.status = status;
    }

    // Optional search support
    if (search) {
      filter.$or = [];
    }

    const skip = (page - 1) * limit;

    const [enrollments, total] = await Promise.all([
      Enrollment.find(filter)
        .populate("student")
        .populate("course")
        .populate("semester")
        .populate("section")
        .sort({
          [sortBy]: sortOrder === "asc" ? 1 : -1,
        })
        .skip(skip)
        .limit(limit),

      Enrollment.countDocuments(filter),
    ]);

    return {
      enrollments,
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
    data: Partial<IEnrollment>
  ) {
    return Enrollment.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("student")
      .populate("course")
      .populate("semester")
      .populate("section");
  }

  // ======================
  // Soft Delete
  // ======================

  async softDeleteById(id: string) {
    return Enrollment.findByIdAndUpdate(
      id,
      {
        deletedAt: new Date(),
        status: Status.INACTIVE,
      },
      {
        new: true,
      }
    );
  }
}

export const enrollmentRepository =
  new EnrollmentRepository();
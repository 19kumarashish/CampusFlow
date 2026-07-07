import { Assignment } from "@/modules/assignments/models/assignment.model";
import { Attendance } from "@/modules/attendance/models/attendance.model";
import { Course } from "@/modules/courses/models/course.model";
import { Department } from "@/modules/departments/models/department.model";
import { Enrollment } from "@/modules/enrollments/models/enrollment.model";
import { Examination } from "@/modules/examinations/models/examination.model";
import { Faculty } from "@/modules/faculty/models/faculty.model";
import { Result } from "@/modules/results/models/result.model";
import { SemesterResult } from "@/modules/results/models/semester-result.model";
import { Section } from "@/modules/sections/models/section.model";
import { Student } from "@/modules/students/models/student.model";
import { Subject } from "@/modules/subjects/models/subject.model";
import { AssignmentStatus } from "@/shared/enums/assignment-status.enum";
import { ExamStatus } from "@/shared/enums/exam-status.enum";

class DashboardRepository {
  // ==========================================
  // Institution Statistics
  // ==========================================

  async getInstitutionStatistics() {
    const [
      students,
      faculty,
      departments,
      courses,
      subjects,
      sections,
      enrollments,
      assignments,
      examinations,
    ] = await Promise.all([
      Student.countDocuments(),
      Faculty.countDocuments(),
      Department.countDocuments(),
      Course.countDocuments(),
      Subject.countDocuments(),
      Section.countDocuments(),
      Enrollment.countDocuments(),
      Assignment.countDocuments(),
      Examination.countDocuments(),
    ]);

    return {
      students,
      faculty,
      departments,
      courses,
      subjects,
      sections,
      enrollments,
      assignments,
      examinations,
    };
  }

  // ==========================================
  // Attendance Analytics
  // ==========================================

  async getAttendanceAnalytics() {
    const [result] =
      await Attendance.aggregate([
        {
          $group: {
            _id: null,

            total: {
              $sum: 1,
            },

            present: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      "$status",
                      "PRESENT",
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,

            attendanceRate: {
              $round: [
                {
                  $multiply: [
                    {
                      $divide: [
                        "$present",
                        "$total",
                      ],
                    },
                    100,
                  ],
                },
                2,
              ],
            },
          },
        },
      ]);

    return (
      result ?? {
        attendanceRate: 0,
      }
    );
  }

  // ==========================================
  // Result Analytics
  // ==========================================

  async getResultAnalytics() {
    const [result] =
      await SemesterResult.aggregate([
        {
          $group: {
            _id: null,

            averageCGPA: {
              $avg: "$cgpa",
            },

            passRate: {
              $avg: {
                $cond: [
                  {
                    $gte: [
                      "$cgpa",
                      5,
                    ],
                  },
                  100,
                  0,
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,

            averageCGPA: {
              $round: [
                "$averageCGPA",
                2,
              ],
            },

            passRate: {
              $round: [
                "$passRate",
                2,
              ],
            },
          },
        },
      ]);

    return (
      result ?? {
        averageCGPA: 0,
        passRate: 0,
      }
    );
  }

  // ==========================================
  // Upcoming Examinations
  // ==========================================

  async getUpcomingExaminations() {
    return Examination.find({
      date: {
        $gte: new Date(),
      },
    })
      .sort({
        date: 1,
      })
      .limit(5)
      .populate("subject")
      .populate("section");
  }

  // ==========================================
  // Recent Assignments
  // ==========================================

  async getRecentAssignments() {
    return Assignment.find()
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .populate("subject");
  }

  // ==========================================
  // Monthly Student Admissions
  // ==========================================

  async getMonthlyAdmissions() {
    return Student.aggregate([
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },

            month: {
              $month: "$createdAt",
            },
          },

          students: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);
  }

  // ==========================================
  // Top Performing Departments
  // ==========================================

  async getTopDepartments() {
    return SemesterResult.aggregate([
      {
        $lookup: {
          from: "enrollments",
          localField: "enrollment",
          foreignField: "_id",
          as: "enrollment",
        },
      },
      {
        $unwind: "$enrollment",
      },
      {
        $lookup: {
          from: "students",
          localField:
            "enrollment.student",
          foreignField: "_id",
          as: "student",
        },
      },
      {
        $unwind: "$student",
      },
      {
        $group: {
          _id:
            "$student.department",

          averageCGPA: {
            $avg: "$cgpa",
          },
        },
      },
      {
        $sort: {
          averageCGPA: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);
  }

  // ==========================================
  // Admin Dashboard
  // ==========================================

  async getAdminDashboard() {
    const [
      statistics,
      attendance,
      results,
      examinations,
      assignments,
      admissions,
      departments,
    ] = await Promise.all([
      this.getInstitutionStatistics(),

      this.getAttendanceAnalytics(),

      this.getResultAnalytics(),

      this.getUpcomingExaminations(),

      this.getRecentAssignments(),

      this.getMonthlyAdmissions(),

      this.getTopDepartments(),
    ]);

    return {
      statistics,
      attendance,
      results,
      examinations,
      assignments,
      admissions,
      departments,
    };
  }

  async getFacultyDashboard(facultyId: string) {
    const [assignments, examinations] = await Promise.all([
      Assignment.find({ faculty: facultyId, deletedAt: null })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("subject"),
      Examination.find({
        faculty: facultyId,
        deletedAt: null,
        date: { $gte: new Date() },
      })
        .sort({ date: 1 })
        .limit(5)
        .populate("subject"),
    ]);

    return {
      assignments,
      examinations,
    };
  }

  async getStudentDashboard(enrollmentId: string) {
    const enrollment = await Enrollment.findById(enrollmentId);
    if (!enrollment) return null;

    const sectionId = enrollment.section;

    const [assignments, examinations, results, gpa] = await Promise.all([
      Assignment.find({
        section: sectionId,
        status: AssignmentStatus.PUBLISHED,
        deletedAt: null,
      })
        .sort({ dueDate: 1 })
        .limit(5)
        .populate("subject"),
      Examination.find({
        section: sectionId,
        status: ExamStatus.SCHEDULED,
        deletedAt: null,
        date: { $gte: new Date() },
      })
        .sort({ date: 1 })
        .limit(5)
        .populate("subject"),
      Result.find({ enrollment: enrollmentId }).populate("subject"),
      SemesterResult.findOne({ enrollment: enrollmentId }),
    ]);

    return {
      enrollment,
      assignments,
      examinations,
      results,
      gpa,
    };
  }
}

export const dashboardRepository =
  new DashboardRepository();
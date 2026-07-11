import { Router } from "express";

import assignmentRoutes from "@/modules/assignments/routes/assignment.routes";
import attendanceRoutes from "@/modules/attendance/routes/attendance.routes";
import authRoutes from "@/modules/auth/routes/auth.routes";
import communicationRoutes from "@/modules/communication/routes/communication.routes";
import courseRoutes from "@/modules/courses/routes/course.routes";
import dashboardRoutes from "@/modules/dashboard/routes/dashboard.routes";
import departmentRoutes from "@/modules/departments/routes/department.routes";
import enrollmentRoutes from "@/modules/enrollments/routes/enrollment.routes";
import examinationRoutes from "@/modules/examinations/routes/examination.routes";
import facultyRoutes from "@/modules/faculty/routes/faculty.routes";
import resultRoutes from "@/modules/results/routes/result.routes";
import sectionRoutes from "@/modules/sections/routes/section.routes";
import semesterRoutes from "@/modules/semesters/routes/semester.routes";
import studentRoutes from "@/modules/students/routes/student.routes";
import subjectRoutes from "@/modules/subjects/routes/subject.routes";
import timetableRoutes from "@/modules/timetable/routes/timetable.routes";
import userRoutes from "@/modules/users/routes/user.routes";

import academicRoutes from "@/modules/academic/routes/academic.routes";
import financeRoutes from "@/modules/finance/routes/finance.routes";
import libraryRoutes from "@/modules/library/routes/library.routes";

const router = Router();

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/departments",departmentRoutes);

router.use("/courses",courseRoutes);

router.use("/subjects",subjectRoutes);

router.use("/faculties", facultyRoutes);

router.use("/students", studentRoutes);

router.use("/semesters",semesterRoutes);

router.use("/enrollments",enrollmentRoutes);

router.use("/sections",sectionRoutes);

router.use("/attendance",attendanceRoutes);

router.use("/timetable",timetableRoutes);

router.use("/assignments",assignmentRoutes);

router.use("/examinations",examinationRoutes);

router.use("/results", resultRoutes);

router.use("/dashboard",dashboardRoutes);

router.use("/communication", communicationRoutes);

router.use("/academic", academicRoutes);

router.use("/finance", financeRoutes);

router.use("/library", libraryRoutes);

export default router;
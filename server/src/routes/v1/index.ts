import { Router } from "express";

import assignmentRoutes from "@/modules/assignments/routes/assignment.routes";
import attendanceRoutes from "@/modules/attendance/routes/attendance.routes";
import authRoutes from "@/modules/auth/routes/auth.routes";
import courseRoutes from "@/modules/courses/routes/course.routes";
import departmentRoutes from "@/modules/departments/routes/department.routes";
import enrollmentRoutes from "@/modules/enrollments/routes/enrollment.routes";
import facultyRoutes from "@/modules/faculty/routes/faculty.routes";
import sectionRoutes from "@/modules/sections/routes/section.routes";
import semesterRoutes from "@/modules/semesters/routes/semester.routes";
import studentRoutes from "@/modules/students/routes/student.routes";
import subjectRoutes from "@/modules/subjects/routes/subject.routes";
import timetableRoutes from "@/modules/timetable/routes/timetable.routes";
import userRoutes from "@/modules/users/routes/user.routes";

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
export default router;
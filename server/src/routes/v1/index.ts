import { Router } from "express";

import authRoutes from "@/modules/auth/routes/auth.routes";
import courseRoutes from "@/modules/courses/routes/course.routes";
import departmentRoutes from "@/modules/departments/routes/department.routes";
import facultyRoutes from "@/modules/faculty/routes/faculty.routes";
import subjectRoutes from "@/modules/subjects/routes/subject.routes";
import userRoutes from "@/modules/users/routes/user.routes";

const router = Router();

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/departments",departmentRoutes);

router.use("/courses",courseRoutes);

router.use("/subjects",subjectRoutes);

router.use("/faculties", facultyRoutes);

export default router;
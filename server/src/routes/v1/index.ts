import { Router } from "express";

import authRoutes from "@/modules/auth/routes/auth.routes";
import courseRoutes from "@/modules/courses/routes/course.routes";
import departmentRoutes from "@/modules/departments/routes/department.routes";
import userRoutes from "@/modules/users/routes/user.routes";
import subjectRoutes from "@/modules/subjects/routes/subject.routes";
const router = Router();

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/departments",departmentRoutes);

router.use("/courses",courseRoutes);

router.use("/subjects",subjectRoutes);

export default router;